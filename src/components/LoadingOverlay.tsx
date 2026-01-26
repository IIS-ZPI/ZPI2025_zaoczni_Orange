import { Loader } from 'lucide-react';

export const LoadingOverlay: React.FC = () => {
    return (
        <div
            role="status"
            aria-live="polite"
            className="absolute inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm"
        >
            <div className="flex flex-col items-center">
                <Loader className="animate-spin h-8 w-8" />
                <span className="mt-2 text-sm text-gray-700">Loading...</span>
            </div>
        </div>
    );
};
