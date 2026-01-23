import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const Logo = () => {
    return (
        <Link to="/" className="flex items-center gap-2 select-none cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-ios bg-primary flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-ios-title3 text-text-main">FixPix</span>
        </Link>
    );
};

export default Logo;

