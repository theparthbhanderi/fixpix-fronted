import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFoundPage = () => {
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-ios-gutter">
            <div className="text-center max-w-md">
                {/* 404 Number */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className="mb-6"
                >
                    <h1 className="text-[120px] md:text-[160px] font-bold leading-none text-text-quaternary select-none">
                        404
                    </h1>
                </motion.div>

                {/* Message */}
                <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                >
                    <h2 className="ios-title1 text-text-main mb-3">
                        Page Not Found
                    </h2>

                    <p className="text-ios-body text-text-secondary mb-8">
                        The page you're looking for doesn't exist or has been moved. Let's get you back on track.
                    </p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    className="flex flex-col sm:flex-row gap-3 justify-center"
                >
                    <Link to="/">
                        <Button size="lg" variant="filled" className="w-full sm:w-auto">
                            <Home className="w-5 h-5 mr-2" />
                            Go Home
                        </Button>
                    </Link>

                    <Button
                        variant="gray"
                        size="lg"
                        onClick={() => window.history.back()}
                        className="w-full sm:w-auto"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Go Back
                    </Button>
                </motion.div>

                {/* Fun Emoji */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-10 text-5xl"
                >
                    <motion.span
                        animate={{
                            y: [0, -8, 0]
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            repeatType: "loop"
                        }}
                        className="inline-block"
                    >
                        🔍
                    </motion.span>
                </motion.div>
            </div>
        </div>
    );
};

export default NotFoundPage;
