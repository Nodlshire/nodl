import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ filename: string }> }
) {
  const { filename } = await context.params;
  const safeFilename = path.basename(filename);
  const filePath = path.join(process.cwd(), "public", "releases", safeFilename);

  if (!fs.existsSync(filePath)) {
    return new NextResponse("File Not Found", { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Length": fileBuffer.length.toString(),
      "Content-Disposition": `attachment; filename="${safeFilename}"`
    }
  });
}
