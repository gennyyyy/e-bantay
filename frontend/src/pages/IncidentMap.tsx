import { useEffect, useState } from 'react';
import Map from '@/components/Map';
import { api } from '@/services/api';
import type { Report } from '@/types';
import { Card } from "@/components/ui/card";
import { Search, Filter, Loader2, ListFilter, X } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from 'sonner';

const INCIDENT_TYPES = ['Theft / Robbery', 'Traffic Incident', 'Vandalism', 'Suspicious Activity', 'Noise Disturbance', 'Drug Related'];
const STATUS_TYPES = ['Pending', 'Investigating', 'Resolved'];

export default function IncidentMap() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await api.getReports();
        setReports(data);
      } catch (error) {
        toast.error("Failed to load incidents");
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const toggleType = (type: string) => {
    setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  const toggleStatus = (status: string) => {
    setSelectedStatuses(prev => prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]);
  };

  const filteredReports = reports.filter(r => {
    const matchesSearch = r.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedTypes.length === 0 || selectedTypes.includes(r.type);
    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(r.status);

    let matchesDate = true;
    if (dateRange.start) {
      matchesDate = matchesDate && new Date(r.date) >= new Date(dateRange.start);
    }
    if (dateRange.end) {
      matchesDate = matchesDate && new Date(r.date) <= new Date(dateRange.end);
    }

    return matchesSearch && matchesType && matchesStatus && matchesDate;
  });

  const mapMarkers = filteredReports.map(r => ({
    id: r.id,
    position: r.location,
    title: r.type,
    type: r.status
  }));

  const activeFiltersCount = selectedTypes.length + selectedStatuses.length + (dateRange.start || dateRange.end ? 1 : 0);

  return (
    <div className="relative h-[calc(100vh-6rem)] w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm bg-slate-50 dark:bg-slate-900">
      {/* Top UI Overlay Cluster */}
      <div className="absolute top-4 left-4 right-4 z-[400] flex flex-col md:flex-row items-start md:items-center gap-3 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto w-full md:w-auto">
          {/* The Map Badge is at Top-Left in Map.tsx. We offset this cluster slightly or stack them. */}
          <div className="hidden xl:block w-48" />

          <Card className="flex-1 md:w-80 lg:w-96 p-1.5 shadow-lg border-slate-200/60 dark:border-slate-700 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm flex items-center gap-2 rounded-xl">
            <Search className="h-4 w-4 text-slate-400 dark:text-slate-500 ml-3" />
            <Input
              placeholder="Search incidents..."
              className="border-0 focus-visible:ring-0 placeholder:text-slate-400 dark:placeholder:text-slate-500 h-9 bg-transparent text-sm dark:text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 dark:text-slate-500" onClick={() => setSearchQuery('')}>
                <X className="h-3 w-3" />
              </Button>
            )}
          </Card>

          <Button
            size="default"
            variant={showFilters ? "default" : "secondary"}
            className={cn(
              "shadow-lg h-12 rounded-xl gap-2 px-4 transition-all",
              activeFiltersCount > 0 && !showFilters && "ring-2 ring-blue-500 ring-offset-2"
            )}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline text-sm font-medium">Filters</span>
            {activeFiltersCount > 0 && (
              <span className="bg-blue-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full ml-1">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </div>

        {/* Results Summary */}
        {!loading && (
          <div className="pointer-events-auto">
            <Badge variant="secondary" className="bg-white/90 dark:bg-slate-800/90 backdrop-blur shadow-sm border-slate-200 dark:border-slate-700 py-1.5 px-3 rounded-lg text-slate-600 dark:text-slate-300 font-medium">
              {filteredReports.length} {filteredReports.length === 1 ? 'incident' : 'incidents'} found
            </Badge>
          </div>
        )}
      </div>

      {/* Filter Panel - Adjusted position to not overlap the badge too much */}
      <div className={cn(
        "absolute top-20 left-4 z-[400] w-[340px] max-h-[calc(100%-6rem)] overflow-y-auto transition-all duration-300 ease-in-out transform",
        showFilters ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0 pointer-events-none"
      )}>
        <Card className="p-5 shadow-2xl border-slate-200/60 dark:border-slate-700 bg-white/98 dark:bg-slate-800/98 backdrop-blur-md space-y-6 rounded-2xl">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
            <div className="flex items-center gap-2">
              <ListFilter className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              <h3 className="font-bold text-slate-900 dark:text-white">Advanced Filters</h3>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => { setSelectedTypes([]); setSelectedStatuses([]); setDateRange({ start: '', end: '' }); }}
              className="h-auto p-0 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold"
            >
              Clear All
            </Button>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Incident Timeline</label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 ml-1">From</span>
                <Input
                  type="date"
                  className="h-9 text-xs bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 dark:text-white rounded-lg focus:bg-white dark:focus:bg-slate-700"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                />
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 ml-1">To</span>
                <Input
                  type="date"
                  className="h-9 text-xs bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 dark:text-white rounded-lg focus:bg-white dark:focus:bg-slate-700"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Status</label>
            <div className="flex flex-wrap gap-2">
              {STATUS_TYPES.map(status => (
                <button
                  key={status}
                  onClick={() => toggleStatus(status)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                    selectedStatuses.includes(status)
                      ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 border-slate-900 dark:border-slate-100 shadow-md"
                      : "bg-slate-50 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600"
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Incident Type</label>
            <div className="grid grid-cols-1 gap-2">
              {INCIDENT_TYPES.map(type => (
                <button
                  key={type}
                  onClick={() => toggleType(type)}
                  className={cn(
                    "flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium border transition-all",
                    selectedTypes.includes(type)
                      ? "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800 shadow-sm ring-1 ring-blue-200 dark:ring-blue-800"
                      : "bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-100 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 hover:border-slate-200 dark:hover:border-slate-500"
                  )}
                >
                  <span>{type}</span>
                  {selectedTypes.includes(type) && <div className="h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />}
                </button>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {loading && (
        <div className="absolute inset-0 z-[500] bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600 dark:text-blue-400" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">Loading Incident Data...</p>
          </div>
        </div>
      )}

      <Map
        markers={mapMarkers}
        interactive={true}
        restrictToBarangay={true}
      />
    </div>
  );
}