import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center animate-fade-in">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800 mb-4">
        <Icon className="h-10 w-10 text-slate-400 dark:text-slate-500" />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h3>
      <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400 mt-2 mb-6">{description}</p>
      {action}
    </div>
  );
}