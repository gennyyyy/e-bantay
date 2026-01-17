import { useEffect, useState } from 'react';
import Map from '@/components/Map';
import { api } from '@/services/api';
import { BARANGAY_CONFIG, type Report } from '@/types';
import { MOCK_STATS, STATUS_CONFIG } from '@/lib/data';
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  MapPin, Download, Search,
  RefreshCw, ArrowUpRight, TrendingUp, FolderOpen, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import EmptyState from '@/components/EmptyState';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await api.getReports();
      setReports(data);
    } catch (error) {
      toast.error("Failed to fetch reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const mapMarkers = reports.map(r => ({
    id: r.id,
    position: r.location,
    title: r.type,
    type: r.status
  }));

  const filteredReports = reports.filter(r =>
    r.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-slate-500 dark:text-slate-400">Welcome back! Here's what's happening in Brgy. {BARANGAY_CONFIG.name} today.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-700" onClick={fetchReports} disabled={loading}>
            <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
            Refresh
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {MOCK_STATS.map((stat) => (
          <Card key={stat.label} className="border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800 hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={cn("p-2 rounded-lg bg-slate-50 dark:bg-slate-700",
                  stat.color === 'blue' && "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400",
                  stat.color === 'amber' && "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400",
                  stat.color === 'purple' && "bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400",
                  stat.color === 'emerald' && "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400",
                )}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                  stat.trend === 'up' ? "bg-green-50 dark:bg-green-950/50 text-green-700 dark:text-green-400" : "bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400"
                )}>
                  <TrendingUp className={cn("h-3 w-3", stat.trend === 'down' && "rotate-180")} />
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.label}</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Area */}
      <Card className="border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800 overflow-hidden">
        <Tabs defaultValue="list" className="w-full">
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <TabsList className="grid w-[200px] grid-cols-2 bg-slate-100 dark:bg-slate-700">
                <TabsTrigger value="list" className="dark:data-[state=active]:bg-slate-600 dark:data-[state=active]:text-white">List View</TabsTrigger>
                <TabsTrigger value="map" className="dark:data-[state=active]:bg-slate-600 dark:data-[state=active]:text-white">Map View</TabsTrigger>
              </TabsList>
              <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block" />
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white hidden sm:block">Recent Incidents</h2>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
              <Input
                placeholder="Search reports..."
                className="pl-9 bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <TabsContent value="list" className="m-0">
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-slate-400 dark:text-slate-500" />
              </div>
            ) : filteredReports.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700">
                      <tr>
                        <th className="px-6 py-3 font-medium">Type</th>
                        <th className="px-6 py-3 font-medium">Location</th>
                        <th className="px-6 py-3 font-medium">Date & Time</th>
                        <th className="px-6 py-3 font-medium">Status</th>
                        <th className="px-6 py-3 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                      {filteredReports.map((report) => (
                        <tr key={report.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="font-medium text-slate-900 dark:text-white">{report.type}</div>
                            <div className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 truncate max-w-[200px]">{report.description}</div>
                          </td>
                          <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                            <div className="flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                              Brgy. {BARANGAY_CONFIG.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                            <div className="flex flex-col">
                              <span>{report.date}</span>
                              <span className="text-xs text-slate-400 dark:text-slate-500">{report.time}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={cn(
                              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                              STATUS_CONFIG[report.status].bg,
                              STATUS_CONFIG[report.status].text,
                              STATUS_CONFIG[report.status].border
                            )}>
                              <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_CONFIG[report.status].dot)} />
                              {report.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400">
                              <ArrowUpRight className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="p-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                  <span>Showing {filteredReports.length} results</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled className="dark:border-slate-600 dark:text-slate-400">Previous</Button>
                    <Button variant="outline" size="sm" className="dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">Next</Button>
                  </div>
                </div>
              </>
            ) : (
              <EmptyState
                icon={FolderOpen}
                title="No reports found"
                description="Try adjusting your search filters to find what you're looking for."
              />
            )}
          </TabsContent>

          <TabsContent value="map" className="m-0">
            <div className="h-[700px] w-full bg-slate-50 dark:bg-slate-900">
              <Map markers={mapMarkers} interactive={false} restrictToBarangay={true} />
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}