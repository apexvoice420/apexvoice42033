'use client';

import { useEffect, useRef, useState } from 'react';

interface FrameAnimationProps {
    className?: string;
    frameCount: number;
    path: string; // e.g., "/images/animation/frame_"
    extension?: string; // e.g., "jpg"
    fps?: number;
}

export default function FrameAnimation({
    className,
    frameCount,
    path,
    extension = 'jpg',
    fps = 30
}: FrameAnimationProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [images, setImages] = useState<HTMLImageElement[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const requestRef = useRef<number>(0);
    const frameIndexRef = useRef(0);
    const lastFrameTimeRef = useRef(0);

    // Preload images
    useEffect(() => {
        let loadedCount = 0;
        const imgs: HTMLImageElement[] = [];

        for (let i = 0; i < frameCount; i++) {
            const img = new Image();
            // Pad with zeros to 3 digits matches our renaming script
            const frameNum = i.toString().padStart(3, '0');
            img.src = `${path}${frameNum}.${extension}`;
            img.onload = () => {
                loadedCount++;
                if (loadedCount === frameCount) {
                    setIsLoaded(true);
                }
            };
            imgs.push(img);
        }
        setImages(imgs);
    }, [frameCount, path, extension]);

    // Animation Loop
    const animate = (time: number) => {
        if (!canvasRef.current || !isLoaded || images.length === 0) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Calculate time delta for FPS control
        const interval = 1000 / fps;
        if (time - lastFrameTimeRef.current >= interval) {
            const currentImg = images[frameIndexRef.current];

            // Draw image covering the canvas (object-fit: cover equivalent)
            const hRatio = canvas.width / currentImg.width;
            const vRatio = canvas.height / currentImg.height;
            const ratio = Math.max(hRatio, vRatio);

            const centerShift_x = (canvas.width - currentImg.width * ratio) / 2;
            const centerShift_y = (canvas.height - currentImg.height * ratio) / 2;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(
                currentImg,
                0, 0, currentImg.width, currentImg.height,
                centerShift_x, centerShift_y, currentImg.width * ratio, currentImg.height * ratio
            );

            frameIndexRef.current = (frameIndexRef.current + 1) % frameCount;
            lastFrameTimeRef.current = time;
        }

        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        if (isLoaded) {
            requestRef.current = requestAnimationFrame(animate);
        }
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, [isLoaded, fps, images]);

    // Handle Resize
    useEffect(() => {
        const handleResize = () => {
            if (canvasRef.current && canvasRef.current.parentElement) {
                const dpr = window.devicePixelRatio || 1;
                // Set the canvas size to the hardware resolution
                canvasRef.current.width = canvasRef.current.parentElement.clientWidth * dpr;
                canvasRef.current.height = canvasRef.current.parentElement.clientHeight * dpr;
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Init

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className={className}
            style={{ width: '100%', height: '100%', display: 'block' }}
        />
    );
}
