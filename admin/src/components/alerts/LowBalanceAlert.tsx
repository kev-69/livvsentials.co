import { AlertCircle } from 'lucide-react';

interface LowBalanceAlertProps {
  show: boolean;
}

const LowBalanceAlert = ({ show }: LowBalanceAlertProps) => {
  if (!show) return null;
  
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-md p-4 mb-6 flex items-start dark:bg-amber-900/20 dark:border-amber-700">
      <AlertCircle className="h-5 w-5 text-amber-600 mr-3 mt-0.5 dark:text-amber-500" />
      <div>
        <h3 className="font-medium text-amber-800 dark:text-amber-500">Low Balance Warning</h3>
        <p className="text-sm text-amber-700 dark:text-amber-400">
          Your notification credit balance is running low. Consider adding more credits to ensure uninterrupted service.
        </p>
      </div>
    </div>
  );
};

export default LowBalanceAlert;