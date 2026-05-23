import { NextRequest, NextResponse } from 'next/server';
import { getAgreement, saveAgreement } from '../../../../../../lib/db/agreements';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const STORAGE_ROOT = path.join(process.cwd(), 'storage', 'data-room');

function getSafePath(relativePath: string) {
    try {
        const decodedPath = decodeURIComponent(relativePath);
        const resolvedPath = path.resolve(path.join(STORAGE_ROOT, decodedPath));
        if (!resolvedPath.startsWith(STORAGE_ROOT)) {
            throw new Error('Path traversal detected');
        }
        return resolvedPath;
    } catch {
        return STORAGE_ROOT;
    }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;
        const agreement = await getAgreement(id);
        
        if (!agreement) {
            return NextResponse.json({ error: 'Agreement not found' }, { status: 404 });
        }

        if (agreement.status !== 'fully_signed') {
            return NextResponse.json({ error: 'Agreement is not fully signed' }, { status: 400 });
        }

        // 1. Load Original PDF Template
        const templatePath = getSafePath(agreement.templateFileId);
        let templateBytes: Buffer;
        try {
            templateBytes = await fs.readFile(templatePath);
        } catch (e) {
            return NextResponse.json({ error: 'Original template file is missing or deleted' }, { status: 400 });
        }
        
        const pdfDoc = await PDFDocument.load(templateBytes);
        
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        // 2. Append Signature Page
        const page = pdfDoc.addPage();
        const { width, height } = page.getSize();
        
        let y = height - 50;

        page.drawText('Signature Page', { x: 50, y, size: 24, font: fontBold });
        y -= 40;

        page.drawText(`Agreement Title: ${agreement.title}`, { x: 50, y, size: 12, font });
        y -= 20;
        page.drawText(`Counterparty Email: ${agreement.counterpartyEmail}`, { x: 50, y, size: 12, font });
        y -= 40;

        page.drawText('Filled Fields Summary:', { x: 50, y, size: 14, font: fontBold });
        y -= 20;

        for (const [key, val] of Object.entries(agreement.filledFields)) {
            page.drawText(`${key}: ${val}`, { x: 50, y, size: 12, font });
            y -= 20;
        }

        y -= 40;

        // Hash of agreement
        const contentHash = crypto.createHash('sha256').update(JSON.stringify(agreement)).digest('hex');
        page.drawText('Agreement Hash:', { x: 50, y, size: 12, font: fontBold });
        y -= 20;
        page.drawText(contentHash, { x: 50, y, size: 10, font });
        y -= 40;

        // Insert Signatures
        const insertSignature = async (label: string, sigId: string | null, timestamp: string | null, xPos: number) => {
            let currY = y;
            page.drawText(label, { x: xPos, y: currY, size: 14, font: fontBold });
            currY -= 20;
            
            if (sigId) {
                try {
                    const sigPath = getSafePath(sigId);
                    const sigBytes = await fs.readFile(sigPath);
                    const image = await pdfDoc.embedPng(sigBytes);
                    
                    const imgDims = image.scale(0.5); // scale down
                    currY -= imgDims.height;
                    
                    page.drawImage(image, {
                        x: xPos,
                        y: currY,
                        width: imgDims.width,
                        height: imgDims.height,
                    });
                } catch (e) {
                    page.drawText('[Signature Image Missing]', { x: xPos, y: currY, size: 12, font, color: rgb(1,0,0) });
                    currY -= 20;
                }
            } else {
                page.drawText('[Not Signed]', { x: xPos, y: currY, size: 12, font });
                currY -= 20;
            }

            currY -= 20;
            page.drawText(`Date: ${timestamp ? new Date(timestamp).toLocaleString() : 'N/A'}`, { x: xPos, y: currY, size: 10, font });
        };

        await insertSignature('Owner Signature:', agreement.ownerSignatureId, agreement.ownerSignedAt, 50);
        await insertSignature('Counterparty Signature:', agreement.counterpartySignatureId, agreement.counterpartySignedAt, 300);

        // 3. Save Final PDF
        const finalPdfBytes = await pdfDoc.save();
        const finalFilename = `signed_${agreement.id}.pdf`;
        const finalPdfPath = getSafePath(finalFilename);
        
        await fs.writeFile(finalPdfPath, finalPdfBytes);

        // Update Agreement
        agreement.finalPdfFileId = finalFilename;
        await saveAgreement(agreement);

        return NextResponse.json({ success: true, finalPdfFileId: finalFilename });

    } catch (error) {
        console.error('Finalize agreement error:', error);
        return NextResponse.json({ error: 'Failed to finalize agreement' }, { status: 500 });
    }
}
