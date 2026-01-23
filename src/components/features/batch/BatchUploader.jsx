import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon } from 'lucide-react';

const BatchUploader = ({ onUpload }) => {
    const fileInputRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onUpload(e.dataTransfer.files);
        }
    };

    const handleChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            onUpload(e.target.files);
        }
    };

    return (
        <div
            onClick={() => fileInputRef.current.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`glass-panel border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group ${isDragging
                ? 'border-primary bg-primary/5 scale-[1.02]'
                : 'border-border-light hover:border-primary/50 hover:bg-surface-highlight'
                }`}
        >
            <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                ref={fileInputRef}
                onChange={handleChange}
            />

            <div className="w-20 h-20 rounded-full bg-surface shadow-neon mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <UploadCloud className={`w-10 h-10 ${isDragging ? 'text-primary' : 'text-text-secondary group-hover:text-primary'} transition-colors`} />
            </div>

            <h3 className="h3 text-text-main mb-2">Drag & Drop Multiple Images</h3>
            <p className="text-text-secondary text-center max-w-sm">
                Or click to browse. Support for JPG, PNG.
                <br />
                <span className="text-xs opacity-70 mt-2 block">Batch auto-enhancement ready.</span>
            </p>
        </div>
    );
};

export default BatchUploader;
