import React, { memo, useContext, useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageContext } from '../../context/ImageContext';
import BeforeAfterSlider from './BeforeAfterSlider';
import Button from '../ui/Button';
import { ZoomIn, ZoomOut, Maximize, Upload } from 'lucide-react';
import { cn } from '../../lib/utils';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../utils/canvasUtils';
import MaskCanvas from './MaskCanvas';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import ScanningOverlay from '../ui/ScanningOverlay';
import RestorationOverlay from './RestorationOverlay';
import { useCommand } from '../../context/CommandContext';

/**
 * ImageWorkspace - Performance Optimized
 * 
 * Optimizations:
 * - React.memo wrapper
 * - useRef for mask image dimensions (fixes sync DOM query)
 * - Memoized callbacks
 * - GPU-accelerated transforms
 * - Memoized filter style
 */
const ImageWorkspace = memo(({ isPanelOpen, togglePanel }) => {
    const {
        selectedImage,
        processedImage,
        isProcessing,
        uploadImage,
        isCropping,
        setIsCropping,
        isMasking,
        setMaskImage,
        settings
    } = useContext(ImageContext);

    // Get shared tool state from CommandContext
    const { brushSize, activeSection } = useCommand();

    // Local state
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [isSliding, setIsSliding] = useState(false);

    // Ref for mask image dimensions - fixes synchronous DOM query
    const maskImageRef = useRef(null);
    const [maskDimensions, setMaskDimensions] = useState({ width: 800, height: 600 });

    // Update mask dimensions when image loads
    const handleMaskImageLoad = useCallback((e) => {
        const { clientWidth, clientHeight } = e.target;
        setMaskDimensions({ width: clientWidth, height: clientHeight });
    }, []);

    // Memoized callbacks
    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleMaskChange = useCallback((dataUrl) => {
        setMaskImage(dataUrl);
    }, [setMaskImage]);

    const handleCancelCrop = useCallback(() => {
        setIsCropping(false);
    }, [setIsCropping]);

    const handleFileUpload = useCallback((e) => {
        if (e.target.files[0]) {
            uploadImage(e.target.files[0]);
        }
    }, [uploadImage]);

    const showCroppedImage = useCallback(async () => {
        try {
            const croppedImageBlobUrl = await getCroppedImg(
                selectedImage,
                croppedAreaPixels
            );

            const response = await fetch(croppedImageBlobUrl);
            const blob = await response.blob();
            const file = new File([blob], "cropped_image.jpg", { type: "image/jpeg" });

            await uploadImage(file);
            setIsCropping(false);
        } catch (e) {
            console.error(e);
            alert("Failed to apply crop: " + e.message);
        }
    }, [croppedAreaPixels, selectedImage, uploadImage, setIsCropping]);

    // Memoized computed values
    const isRestorationMode = useMemo(() => activeSection === 'restore', [activeSection]);
    // Check if any specific tool is active to trigger peripheral blur
    const hasActiveTool = useMemo(() => !!activeSection, [activeSection]);

    const filterStyle = useMemo(() => ({
        filter: `brightness(${settings?.brightness ?? 1}) contrast(${settings?.contrast ?? 1}) saturate(${settings?.saturation ?? 1})`
    }), [settings?.brightness, settings?.contrast, settings?.saturation]);

    // Memoized zoom handlers to prevent recreation
    const createZoomHandler = useCallback((fn, amount) => () => fn(amount), []);

    return (
        <div className={cn(
            "flex-1 h-full relative flex items-center justify-center overflow-hidden p-8 transition-colors duration-500 ease-out",
            "bg-background/50" // Base background
        )}>
            {/* Background Pattern - subtle noise */}
            <div className="absolute inset-0 opacity-10 pointer-events-none text-text-tertiary mix-blend-overlay"
                style={{
                    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\' opacity=\'0.5\'/%3E%3C/svg%3E")',
                    backgroundSize: 'cover'
                }}
            />

            {/* Show upload zone only if no image at all */}
            {!selectedImage && !processedImage ? (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="relative z-10 w-full flex items-center justify-center p-4"
                >
                    <label
                        className="relative group cursor-pointer"
                        style={{ willChange: 'transform' }}
                        onDragOver={(e) => {
                            e.preventDefault();
                            e.currentTarget.setAttribute('data-dragging', 'true');
                        }}
                        onDragLeave={(e) => {
                            e.preventDefault();
                            e.currentTarget.removeAttribute('data-dragging');
                        }}
                        onDrop={(e) => {
                            e.preventDefault();
                            e.currentTarget.removeAttribute('data-dragging');
                            handleFileUpload(e);
                        }}
                    >
                        {/* 
                          Studio Canvas Card 
                          - Large rounded rect (36px)
                          - Floating shadow & glass texture
                          - Breathing animation
                        */}
                        <motion.div
                            animate={{
                                y: [0, -8, 0],
                                rotateX: [0, 2, 0], // Subtle 3D tilt
                            }}
                            transition={{
                                duration: 6,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            className={cn(
                                "relative w-[min(90vw,480px)] h-[360px]",
                                "flex flex-col items-center justify-center",
                                "rounded-[36px]",
                                "bg-white/40 dark:bg-black/40", // Pearl / Deep Glass
                                "backdrop-blur-2xl",
                                "border border-white/60 dark:border-white/10",
                                "shadow-[0_20px_60px_-10px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.3)]",
                                "group-hover:shadow-[0_30px_80px_-12px_rgba(0,0,0,0.15)] dark:group-hover:shadow-[0_30px_80px_-12px_rgba(var(--ios-accent),0.2)]",
                                "transition-all duration-500",
                                // Drag state styles handled via data attribute or conditional
                                "group-data-[dragging=true]:scale-105 group-data-[dragging=true]:border-[var(--accent)] group-data-[dragging=true]:bg-[rgba(var(--ios-accent),0.05)]"
                            )}
                        >
                            {/* Inner Glow / Noise Texture */}
                            <div className="absolute inset-0 rounded-[36px] opacity-20 pointer-events-none mix-blend-overlay"
                                style={{
                                    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.3\'/%3E%3C/svg%3E")'
                                }}
                            />

                            {/* Input hidden */}
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileUpload}
                            />

                            {/* Floating Icon Stage */}
                            <motion.div
                                className="relative z-20 mb-8"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                            >
                                <div className={cn(
                                    "w-24 h-24 rounded-[28px]",
                                    "bg-white dark:bg-[#1C1C1E]",
                                    "shadow-[0_8px_24px_rgba(0,0,0,0.06)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.2)]",
                                    "flex items-center justify-center",
                                    "border border-white/50 dark:border-white/5",
                                    "group-hover:text-[var(--accent)] transition-colors duration-300"
                                )}>
                                    <Upload
                                        className="w-10 h-10 text-[var(--ios-label-secondary)] dark:text-white/80 group-hover:text-[var(--accent)] transition-colors duration-300"
                                        strokeWidth={1.5}
                                    />
                                </div>

                                {/* Decorative elements */}
                                <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-[var(--accent)] to-purple-500 rounded-2xl blur-xl opacity-40 animate-pulse" />
                            </motion.div>

                            {/* Typography Stage */}
                            <div className="relative z-20 text-center space-y-3 px-8">
                                <h3 className="text-[22px] font-semibold text-[var(--ios-label)] tracking-tight">
                                    Open Photo
                                </h3>
                                <p className="text-[15px] text-[var(--ios-label-tertiary)] font-medium leading-relaxed max-w-[260px] mx-auto">
                                    Drag and drop your memory here, or tap to browse.
                                </p>
                            </div>



                        </motion.div>
                    </label>
                </motion.div>
            ) : (
                <div className="relative w-full h-full max-w-7xl flex items-center justify-center p-8 transition-all duration-500">
                    {/* Main Canvas Container - Hero Style */}
                    <div className={cn(
                        "relative rounded-[32px] overflow-hidden w-full h-full flex items-center justify-center transition-all duration-500 canvas-container bg-black/5 dark:bg-black/20",
                        // Dynamic Shadow: Deeper when no tool is active (floating higher), sharper when working
                        hasActiveTool ? "shadow-2xl scale-[0.98] ring-1 ring-white/10" : "shadow-floating-large scale-100"
                    )}>
                        <ScanningOverlay isProcessing={isProcessing} />
                        <RestorationOverlay />

                        {isCropping ? (
                            <div className="w-full h-full relative bg-black">
                                <Cropper
                                    image={selectedImage}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={4 / 3}
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                />
                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex gap-2">
                                    <Button onClick={handleCancelCrop} variant="secondary" size="sm">Cancel</Button>
                                    <Button onClick={showCroppedImage} variant="primary" size="sm">Apply Crop</Button>
                                </div>
                            </div>
                        ) : isMasking ? (
                            <div className="relative w-full h-full flex items-center justify-center">
                                <img
                                    ref={maskImageRef}
                                    src={selectedImage}
                                    alt="Masking Target"
                                    className="max-w-full max-h-full object-contain pointer-events-none"
                                    onLoad={handleMaskImageLoad}
                                />
                                {/* Overlay Canvas - uses ref-based dimensions */}
                                <MaskCanvas
                                    width={maskDimensions.width}
                                    height={maskDimensions.height}
                                    imageSrc={selectedImage}
                                    onMaskChange={handleMaskChange}
                                    brushSize={brushSize}
                                />
                            </div>
                        ) : (
                            <TransformWrapper
                                initialScale={1}
                                minScale={0.5}
                                maxScale={4}
                                centerOnInit
                                disabled={isSliding}
                                panning={{ disabled: isSliding }}
                                wheel={{ disabled: isSliding }}
                                pinch={{ disabled: isSliding }}
                            >
                                {({ zoomIn, zoomOut, resetTransform }) => (
                                    <>
                                        <TransformComponent wrapperClass="!w-full !h-full" contentClass="!w-full !h-full flex items-center justify-center">
                                            {processedImage && selectedImage ? (
                                                <div
                                                    className="w-full h-full flex items-center justify-center"
                                                    style={{ touchAction: 'none' }}
                                                    onMouseDown={(e) => e.stopPropagation()}
                                                    onTouchStart={(e) => e.stopPropagation()}
                                                >
                                                    {/* Shimmer Reveal for Result */}
                                                    <motion.div
                                                        initial={{ opacity: 0, filter: "brightness(1.5) blur(10px)" }}
                                                        animate={{ opacity: 1, filter: "brightness(1) blur(0px)" }}
                                                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                                        className="w-full h-full flex items-center justify-center"
                                                    >
                                                        <BeforeAfterSlider
                                                            before={selectedImage}
                                                            after={processedImage}
                                                            style={filterStyle}
                                                            className="max-w-full max-h-full object-contain"
                                                            onSlidingChange={setIsSliding}
                                                        />
                                                    </motion.div>
                                                </div>
                                            ) : (
                                                <motion.img
                                                    initial={{ opacity: 0, scale: 0.92 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ type: "spring", stiffness: 280, damping: 35 }}
                                                    src={processedImage || selectedImage}
                                                    alt="Work"
                                                    className="max-w-full max-h-full object-contain shadow-2xl"
                                                    style={filterStyle}
                                                />
                                            )}
                                        </TransformComponent>

                                        {/* Zoom Controls - Integrated into Canvas */}
                                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-1.5 p-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/10 shadow-lg" role="group" aria-label="Image zoom controls">
                                            <button
                                                onClick={() => zoomOut(0.5)}
                                                className="p-2 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors duration-150"
                                                title="Zoom Out"
                                            >
                                                <ZoomOut className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => resetTransform()}
                                                className="p-2 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors duration-150"
                                                title="Reset zoom"
                                            >
                                                <Maximize className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => zoomIn(0.5)}
                                                className="p-2 rounded-full hover:bg-white/20 text-white/80 hover:text-white transition-colors duration-150"
                                                title="Zoom In"
                                            >
                                                <ZoomIn className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </>
                                )}
                            </TransformWrapper>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
});

ImageWorkspace.displayName = 'ImageWorkspace';

export default ImageWorkspace;
