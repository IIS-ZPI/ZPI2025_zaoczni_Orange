import { AlertTriangle } from 'lucide-react';

export type AlertMessageProps = {
    message: string;
    className?: string;
    variant?: 'error' | 'warning' | 'info';
};

export function AlertMessage({ message, className = '', variant = 'warning' }: AlertMessageProps) {
    const variantClasses = {
        error: 'border-red-300 bg-red-100 text-red-900',
        warning: 'border-amber-200 bg-amber-50 text-amber-900',
        info: 'border-blue-200 bg-blue-50 text-blue-900',
    };

    return (
        <div className={`mb-6 rounded-lg border px-4 py-3 ${variantClasses[variant]} ${className}`}>
            <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                <span className="text-sm font-medium">{message}</span>
            </div>
        </div>
    );
}

export default AlertMessage;
