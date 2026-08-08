"use client";

import React, { useRef, useState, useEffect } from 'react';

interface SignaturePadProps {
    onConfirm: (base64Png: string) => void;
    onCancel: () => void;
}

export default function SignaturePad({ onConfirm, onCancel }: SignaturePadProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasDrawn, setHasDrawn] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000000';
    }, []);

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        setIsDrawing(true);
        const rect = canvas.getBoundingClientRect();
        
        let clientX = 0, clientY = 0;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }

        ctx.beginPath();
        ctx.moveTo(clientX - rect.left, clientY - rect.top);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const rect = canvas.getBoundingClientRect();
        
        let clientX = 0, clientY = 0;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }

        ctx.lineTo(clientX - rect.left, clientY - rect.top);
        ctx.stroke();
        setHasDrawn(true);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
    };

    const handleClear = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasDrawn(false);
    };

    const handleConfirm = () => {
        if (!hasDrawn) {
            alert('Please provide a signature before confirming.');
            return;
        }
        const canvas = canvasRef.current;
        if (!canvas) return;
        const dataUrl = canvas.toDataURL('image/png');
        onConfirm(dataUrl);
    };

    return (
        <div className="flex flex-col items-center gap-4 w-full">
            <div className="border-2 border-slate-700 rounded-xl overflow-hidden bg-white">
                <canvas
                    ref={canvasRef}
                    width={500}
                    height={200}
                    className="touch-none cursor-crosshair"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                />
            </div>
            <div className="flex gap-4 w-full max-w-full">
                <button onClick={handleClear} className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-bold uppercase tracking-widest transition-colors">Clear</button>
                <button onClick={onCancel} className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-bold uppercase tracking-widest transition-colors">Cancel</button>
                <button onClick={handleConfirm} className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold uppercase tracking-widest transition-colors shadow-[0_0_15px_rgba(37,99,235,0.2)]">Confirm</button>
            </div>
        </div>
    );
}
