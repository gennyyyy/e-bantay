import { useState } from 'react';
import Map from '@/components/Map';
import { BARANGAY_CONFIG } from '@/types';
import ReportForm from '@/components/ReportForm';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CheckCircle2, Shield, MousePointerClick, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { api } from '@/services/api';
import { toast } from 'sonner';

export default function UserReport() {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleLocationSelect = (loc: { lat: number; lng: number }) => {
    setSelectedLocation(loc);
  };

  const handleOutOfBounds = () => {
    setSelectedLocation(null);
    toast.error("Location is outside the barangay boundary.");
  };

  const handleReportSubmit = async (data: any) => {
    setSubmitting(true);
    try {
      await api.createReport(data);
      setShowSuccess(true);
      setSelectedLocation(null);
      toast.success("Report submitted successfully");
    } catch (error) {
      toast.error("Failed to submit report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)]">
      {/* Left Column - Form & Info */}
      <div className="w-full lg:w-[480px] xl:w-[560px] flex flex-col gap-6 overflow-y-auto pr-2 pb-6">

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Report an Incident</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Submit a report for suspicious activities or crimes in <span className="font-semibold text-slate-700 dark:text-slate-300">Brgy. {BARANGAY_CONFIG.name}</span>.
          </p>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="border-blue-100 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/30 shadow-none">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg">
                <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">Coverage</p>
                <p className="font-semibold text-slate-900 dark:text-white">Brgy. {BARANGAY_CONFIG.name}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-green-100 dark:border-green-900/50 bg-green-50/50 dark:bg-green-950/30 shadow-none">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="bg-green-100 dark:bg-green-900/50 p-2 rounded-lg">
                <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs font-medium text-green-600 dark:text-green-400 uppercase tracking-wide">Response</p>
                <p className="font-semibold text-slate-900 dark:text-white">~15 Minutes</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 p-4 flex gap-4 shadow-sm">
          <div className="flex-shrink-0">
            <MousePointerClick className="h-5 w-5 text-slate-400 dark:text-slate-500" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-900 dark:text-white">1. Pin Location</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Click on the map or use the <span className="font-semibold text-blue-600 dark:text-blue-400">Locate Me</span> button to mark the incident.</p>
          </div>
          <div className="w-px bg-slate-100 dark:bg-slate-700 mx-2" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-900 dark:text-white">2. Submit Details</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Fill out the form below with as much detail as possible.</p>
          </div>
        </div>

        {/* Form Container */}
        <Card className="border-slate-200 dark:border-slate-700 dark:bg-slate-800/50 shadow-sm flex-1 relative">
          {submitting && (
            <div className="absolute inset-0 z-50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm flex items-center justify-center rounded-xl">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">Submitting...</p>
              </div>
            </div>
          )}
          <CardContent className="p-6">
            <ReportForm selectedLocation={selectedLocation} onSubmit={handleReportSubmit} />
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Map */}
      <div className="flex-1 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm relative bg-slate-50 dark:bg-slate-800/30 h-[500px] lg:h-auto min-h-[500px]">
        {/* Clear Selection Button - Only show when location is selected */}
        {selectedLocation && (
          <Button
            size="sm"
            variant="secondary"
            className="absolute top-4 right-16 z-[1001] shadow-sm bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300"
            onClick={() => setSelectedLocation(null)}
          >
            Clear Selection
          </Button>
        )}

        <Map
          onLocationSelect={handleLocationSelect}
          onOutOfBounds={handleOutOfBounds}
          interactive={true}
          restrictToBarangay={true}
        />
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex flex-col items-center text-center gap-4 py-6">
            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-green-600" />
            </div>
            <div className="space-y-2">
              <DialogTitle className="text-xl">Report Submitted Successfully</DialogTitle>
              <DialogDescription>
                Your report has been logged and forwarded to the barangay officials. You can track its status in the "My Reports" section.
              </DialogDescription>
            </div>
          </DialogHeader>
          <div className="flex gap-3 justify-center pb-2">
            <Button variant="outline" onClick={() => setShowSuccess(false)} className="w-full">
              Close
            </Button>
            <Button onClick={() => setShowSuccess(false)} className="w-full bg-blue-600 hover:bg-blue-700">
              View Status
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
