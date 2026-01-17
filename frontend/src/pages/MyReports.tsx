import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import type { Report } from '@/types';
import { Card, CardContent } from "@/components/ui/card";
import { ClipboardList, Loader2, MapPin, Calendar, Clock, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { STATUS_CONFIG } from '@/lib/data';
import EmptyState from '@/components/EmptyState';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

export default function MyReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyReports = async () => {
      try {
        // In a real app, we'd filter by user ID on the backend
        const allReports = await api.getReports();
        // Simulating "My Reports" by taking a subset or just showing all for now
        setReports(allReports.slice(0, 3));
      } catch {
        toast.error("Failed to load your reports");
      } finally {
        setLoading(false);
      }
    };
    fetchMyReports();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
          <ClipboardList className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Reports</h1>
          <p className="text-slate-500 dark:text-slate-400">Track the status of incidents you've reported.</p>
        </div>
      </div>

      <div className="grid gap-4">
        {reports.length > 0 ? (
          reports.map((report) => (
            <Card key={report.id} className="group hover:border-blue-200 dark:hover:border-blue-800 transition-all shadow-sm dark:bg-slate-800 dark:border-slate-700">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-lg text-slate-900 dark:text-white">{report.type}</h3>
                      <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                        STATUS_CONFIG[report.status].bg,
                        STATUS_CONFIG[report.status].text,
                        STATUS_CONFIG[report.status].border
                      )}>
                        <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_CONFIG[report.status].dot)} />
                        {report.status}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-2">{report.description}</p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 dark:text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        <span>Brgy. Pulong Buhangin</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{report.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{report.time}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="hidden sm:flex dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">
                      View Details
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg dark:text-slate-400 dark:hover:bg-slate-700">
                      <ArrowUpRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <EmptyState
            icon={ClipboardList}
            title="No reports yet"
            description="You haven't submitted any reports. Your reporting history will appear here."
            action={
              <Button onClick={() => window.location.href = '/'}>
                File a Report
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
}