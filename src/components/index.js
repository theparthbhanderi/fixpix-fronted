/**
 * Components Barrel Export
 * 
 * Provides clean imports for all components:
 * import { Button, MaterialCard, Toast } from '@/components';
 */

// UI Components
export { default as Button } from './ui/Button';
export { default as MaterialCard } from './ui/MaterialCard';
export { default as Logo } from './ui/Logo';
export { default as ScanningOverlay } from './ui/ScanningOverlay';
export { ToastProvider, useToast } from './ui/Toast';
export { default as DropZone } from './ui/DropZone';
export { default as ShareModal } from './ui/ShareModal';

// Layout Components
export { default as Navbar } from './layout/Navbar';
export { default as Sidebar } from './layout/Sidebar';
export { default as Footer } from './layout/Footer';
export { default as ToolsPanel } from './layout/ToolsPanel';

// Feature Components
export { default as ImageWorkspace } from './features/ImageWorkspace';
export { default as BeforeAfterSlider } from './features/BeforeAfterSlider';
export { default as ExportModal } from './features/ExportModal';
export { default as MaskCanvas } from './features/MaskCanvas';
export { default as OnboardingTour } from './features/OnboardingTour';
export { default as ComparisonExport } from './features/ComparisonExport';

// Batch Components
export { default as BatchProcessor } from './features/batch/BatchProcessor';
export { default as BatchUploader } from './features/batch/BatchUploader';
export { default as BatchQueueItem } from './features/batch/BatchQueueItem';

// Section Components (Landing Page)
export { default as Hero } from './sections/Hero';
export { default as FeaturesGrid } from './sections/FeaturesGrid';
export { default as HowItWorks } from './sections/HowItWorks';
export { default as Testimonials } from './sections/Testimonials';
