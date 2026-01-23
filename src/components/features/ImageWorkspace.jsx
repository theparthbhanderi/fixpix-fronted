import React, { useContext, useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageContext } from '../../context/ImageContext';
import BeforeAfterSlider from './BeforeAfterSlider';
import Button from '../ui/Button';
import { ZoomIn, ZoomOut, Maximize, ScanLine, Upload, RefreshCw } from 'lucide-react';
import MaterialCard from '../ui/MaterialCard';
import Cropper from 'react-easy-crop';
import getCroppedImg from '../../utils/canvasUtils';
import MaskCanvas from './MaskCanvas';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import ScanningOverlay from '../ui/ScanningOverlay';

const ImageWorkspace = ({ isPanelOpen, togglePanel }) => {
    const {
        selectedImage,
        processedImage,
        isProcessing,
        uploadImage,
        isCropping,
        setIsCropping,
        isMasking,
        setIsMasking,
        setMaskImage,
        maskImage,
        setOriginalImage,
        processImage
    } = useContext(ImageContext);

    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [isSliding, setIsSliding] = useState(false); // Track slider drag state

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleMaskChange = (dataUrl) => {
        setMaskImage(dataUrl);
    };

    const [brushSize, setBrushSize] = useState(30);

    const handleRemoveObject = async () => {
        if (!maskImage) return;
        await processImage({ mask: maskImage });
        setIsMasking(false);
    };

    const showCroppedImage = useCallback(async () => {
        try {
            const croppedImageBlobUrl = await getCroppedImg(
                selectedImage,
                croppedAreaPixels
            );

            // Convert Blob URL to File for Re-upload
            const response = await fetch(croppedImageBlobUrl);
            const blob = await response.blob();
            const file = new File([blob], "cropped_image.jpg", { type: "image/jpeg" });

            // Upload the cropped image as a NEW project source
            await uploadImage(file);

            setIsCropping(false);
        } catch (e) {
            console.error(e);
            alert("Failed to apply crop: " + e.message);
        }
    }, [croppedAreaPixels, selectedImage, uploadImage, setIsCropping]);

    return (
        <div className="flex-1 h-full relative flex items-center justify-center bg-background overflow-hidden p-8">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-20 pointer-events-none text-current"
                style={{
                    backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
                    backgroundSize: '30px 30px'
                }}
            />

            {/* Show upload zone only if no image at all (neither original nor generated) */}
            {!selectedImage && !processedImage ? (
                <label className="text-center space-y-4 cursor-pointer group relative z-10 p-12 rounded-3xl border-2 border-dashed border-separator/30 hover:border-primary/50 hover:bg-fill/5 transition-all duration-300">
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                            if (e.target.files[0]) uploadImage(e.target.files[0]);
                        }}
                    />
                    <div className="w-20 h-20 bg-fill/5 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                        <Upload className="w-8 h-8 text-text-tertiary group-hover:text-primary transition-colors" />
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold text-text-main mb-1">Upload an Image</h3>
                        <p className="text-text-secondary text-sm">Drag and drop or click to browse</p>
                    </div>
                </label>
            ) : (
                <div className="relative w-full h-full max-w-5xl max-h-[85vh] flex items-center justify-center">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl glass-panel w-full h-full flex items-center justify-center">

                        <ScanningOverlay isProcessing={isProcessing} />

                        {isCropping ? (
                            <div className="w-full h-full relative bg-black">
                                <Cropper
                                    image={selectedImage}
                                    crop={crop}
                                    zoom={zoom}
                                    aspect={4 / 3} // Default aspect, maybe make dynamic later
                                    onCropChange={setCrop}
                                    onCropComplete={onCropComplete}
                                    onZoomChange={setZoom}
                                />
                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex gap-2">
                                    <Button onClick={() => setIsCropping(false)} variant="secondary" size="sm">Cancel</Button>
                                    <Button onClick={showCroppedImage} variant="primary" size="sm">Apply Crop</Button>
                                </div>
                            </div>
                        ) : isMasking ? (
                            <div className="relative w-full h-full flex items-center justify-center">
                                <img
                                    src={selectedImage}
                                    alt="Masking Target"
                                    className="max-w-full max-h-full object-contain pointer-events-none"
                                    id="mask-target-image"
                                />
                                {/* Overlay Canvas matching the image dimensions */}
                                <MaskCanvas
                                    width={document.getElementById('mask-target-image')?.clientWidth || 800}
                                    height={document.getElementById('mask-target-image')?.clientHeight || 600}
                                    imageSrc={selectedImage}
                                    onMaskChange={handleMaskChange}
                                    brushSize={brushSize}
                                />

                                {/* Eraser Controls Toolbar */}
                                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-40 bg-black/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-2xl flex flex-col gap-4 min-w-[300px]">
                                    <div className="flex items-center gap-3">
                                        <span className="text-white text-xs font-bold uppercase w-16">Brush Size</span>
                                        <input
                                            type="range"
                                            min="5"
                                            max="100"
                                            value={brushSize}
                                            onChange={(e) => setBrushSize(parseInt(e.target.value))}
                                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                                        />
                                        <span className="text-white text-xs w-8 text-right">{brushSize}px</span>
                                    </div>

                                    <div className="flex gap-2 w-full">
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            className="flex-1"
                                            onClick={() => setIsMasking(false)}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            className="flex-1 shadow-neon"
                                            onClick={handleRemoveObject}
                                            disabled={!maskImage}
                                        >
                                            Remove Object ✨
                                        </Button>
                                    </div>
                                </div>
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
                                                // Both images exist - show before/after slider
                                                <div
                                                    className="w-full h-full flex items-center justify-center"
                                                    style={{ touchAction: 'none' }}
                                                    onMouseDown={(e) => e.stopPropagation()}
                                                    onTouchStart={(e) => e.stopPropagation()}
                                                >
                                                    <BeforeAfterSlider
                                                        before={selectedImage}
                                                        after={processedImage}
                                                        className="max-w-full max-h-full object-contain"
                                                        onSlidingChange={setIsSliding}
                                                    />
                                                </div>
                                            ) : processedImage ? (
                                                // Only processed/generated image exists - show just the generated image
                                                <img
                                                    src={processedImage}
                                                    alt="Generated"
                                                    className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                                                />
                                            ) : (
                                                // Only original image exists - show original
                                                <img
                                                    src={selectedImage}
                                                    alt="Original"
                                                    className="max-w-full max-h-full object-contain"
                                                />
                                            )}
                                        </TransformComponent>

                                        {/* Zoom Controls */}
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 glass-panel rounded-full px-3 py-2" role="group" aria-label="Image zoom controls">
                                            <button
                                                onClick={() => zoomOut(0.5)}
                                                className="p-2 rounded-full hover:bg-white/10 text-text-secondary hover:text-text-main transition-colors"
                                                title="Zoom Out"
                                                aria-label="Zoom out image"
                                            >
                                                <ZoomOut className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => resetTransform()}
                                                className="p-2 rounded-full hover:bg-white/10 text-text-secondary hover:text-text-main transition-colors"
                                                title="Reset zoom"
                                                aria-label="Reset zoom to original size"
                                            >
                                                <Maximize className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => zoomIn(0.5)}
                                                className="p-2 rounded-full hover:bg-white/10 text-text-secondary hover:text-text-main transition-colors"
                                                title="Zoom In"
                                                aria-label="Zoom in image"
                                            >
                                                <ZoomIn className="w-5 h-5" />
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
};

export default ImageWorkspace;
