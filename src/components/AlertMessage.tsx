import { AlertTriangle } from 'lucide-react';

export type AlertMessageProps = {
    message: string;
    className?: string;
};

export function AlertMessage({ message, className = '' }: AlertMessageProps) {
    return (
        <div
            className={`mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900 ${className}`}
        >
            <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                <span className="text-sm font-medium">{message}</span>
            </div>
        </div>
    );
}

export default AlertMessage;
