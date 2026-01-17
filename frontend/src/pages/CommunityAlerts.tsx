import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import type { Alert } from '@/types';
import { Card, CardContent } from "@/components/ui/card";
import { Megaphone, AlertTriangle, Info, BellRing, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import EmptyState from '@/components/EmptyState';

export default function CommunityAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const data = await api.getAlerts();
        setAlerts(data);
      } catch (error) {
        toast.error("Failed to load alerts");
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'emergency': return AlertTriangle;
      case 'warning': return Megaphone;
      case 'info': return Info;
      default: return BellRing;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'emergency': return 'bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900';
      case 'warning': return 'bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-900';
      case 'info': return 'bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900';
      default: return 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-100 dark:border-slate-700';
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center">
          <Megaphone className="h-5 w-5 text-orange-600 dark:text-orange-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Community Alerts</h1>
          <p className="text-slate-500 dark:text-slate-400">Stay informed about emergencies and announcements.</p>
        </div>
      </div>

      <div className="space-y-4">
        {alerts.length > 0 ? (
          alerts.map((alert) => {
            const Icon = getIcon(alert.type);
            return (
              <Card key={alert.id} className="border-l-4 shadow-sm hover:shadow-md transition-shadow dark:bg-slate-800 dark:border-slate-700">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <div className={cn("h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 border", getColor(alert.type))}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg text-slate-900 dark:text-white">{alert.title}</h3>
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                          {alert.type}
                        </span>
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{alert.message}</p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-slate-400 dark:text-slate-500">
                        <span>{alert.source}</span>
                        <span>•</span>
                        <span>{alert.date}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <EmptyState
            icon={BellRing}
            title="No alerts at the moment"
            description="You're all caught up! Check back later for updates."
          />
        )}
      </div>
    </div>
  );
}