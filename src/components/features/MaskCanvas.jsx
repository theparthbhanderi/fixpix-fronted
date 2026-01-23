import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const MaskCanvas = ({ width, height, imageSrc, onMaskChange, brushSize = 20 }) => {
    const canvasRef = useRef(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const contextRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        // Only reset dimensions if they actually change to avoid clearing content unexpectedly
        if (canvas.width !== width || canvas.height !== height) {
            canvas.width = width;
            canvas.height = height;
        }

        const ctx = canvas.getContext('2d');
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)'; // Semi-transparent red
        ctx.lineWidth = brushSize;
        contextRef.current = ctx;
    }, [width, height, brushSize]);

    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.beginPath();
        contextRef.current.moveTo(offsetX, offsetY);
        setIsDrawing(true);
    };

    const finishDrawing = () => {
        contextRef.current.closePath();
        setIsDrawing(false);
        if (onMaskChange) {
            onMaskChange(canvasRef.current.toDataURL('image/png'));
        }
    };

    const draw = ({ nativeEvent }) => {
        if (!isDrawing) return;
        const { offsetX, offsetY } = nativeEvent;
        contextRef.current.lineTo(offsetX, offsetY);
        contextRef.current.stroke();
    };

    return (
        <canvas
            ref={canvasRef}
            onMouseDown={startDrawing}
            onMouseUp={finishDrawing}
            onMouseMove={draw}
            onMouseLeave={finishDrawing}
            className="absolute inset-0 z-30 cursor-crosshair touch-none"
            style={{ width, height }}
        />
    );
};

export default MaskCanvas;
