import { useState, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, FileText, Calendar, Clock, Send, AlertCircle, CheckCircle2, Camera, X, ImagePlus, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReportFormProps {
  selectedLocation: { lat: number; lng: number } | null;
  onSubmit: (data: any) => void;
}

interface UploadedImage {
  id: string;
  file: File;
  preview: string;
}

export default function ReportForm({ selectedLocation, onSubmit }: ReportFormProps) {
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    date: '',
    time: '',
    contact: ''
  });
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = useCallback((files: FileList | null) => {
    if (!files) return;

    const newImages: UploadedImage[] = [];
    const maxImages = 5;
    const remainingSlots = maxImages - images.length;

    Array.from(files).slice(0, remainingSlots).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          newImages.push({
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            file,
            preview: e.target?.result as string
          });
          if (newImages.length === Math.min(files.length, remainingSlots)) {
            setImages(prev => [...prev, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }, [images.length]);

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleImageUpload(e.dataTransfer.files);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, boolean> = {};
    if (!selectedLocation) newErrors.location = true;
    if (!formData.type) newErrors.type = true;
    if (!formData.date) newErrors.date = true;
    if (!formData.description) newErrors.description = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({ ...formData, location: selectedLocation, images: images.map(img => img.file) });
    setFormData({ type: '', description: '', date: '', time: '', contact: '' });
    setImages([]);
    setErrors({});
  };

  return (
    <Card className="w-full h-full overflow-hidden flex flex-col shadow-elevated border-0 bg-white dark:bg-slate-800 rounded-2xl">
      <CardHeader className="bg-gradient-to-r from-primary/5 via-blue-500/5 to-indigo-500/5 dark:from-primary/10 dark:via-blue-500/10 dark:to-indigo-500/10 border-b dark:border-slate-700 px-6 py-5">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-blue-600 shadow-lg shadow-primary/25">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <div>
            <CardTitle className="text-xl dark:text-white">Report Details</CardTitle>
            <CardDescription className="mt-0.5 dark:text-slate-400">Fill in the incident information</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto px-6 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Location Display */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              Pinned Location
              <span className="text-destructive">*</span>
            </Label>
            <div className={cn(
              "flex items-center gap-4 p-4 rounded-xl border-2 border-dashed transition-all duration-300",
              selectedLocation
                ? "bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-300 dark:border-green-700"
                : errors.location
                  ? "bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-700"
                  : "bg-muted/30 dark:bg-slate-700/30 border-muted-foreground/20 dark:border-slate-600 hover:border-muted-foreground/30 dark:hover:border-slate-500"
            )}>
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl transition-colors",
                selectedLocation ? "bg-green-100 dark:bg-green-900/50" : "bg-muted dark:bg-slate-700"
              )}>
                {selectedLocation ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                ) : (
                  <MapPin className="h-5 w-5 text-muted-foreground dark:text-slate-400" />
                )}
              </div>
              {selectedLocation ? (
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-green-800 dark:text-green-300">Location Pinned</span>
                  <span className="text-xs text-green-600 dark:text-green-400 font-mono">
                    {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-muted-foreground dark:text-slate-400">No location selected</span>
                  <span className="text-xs text-muted-foreground/70 dark:text-slate-500">Click on the map to pin location</span>
                </div>
              )}
            </div>
            {errors.location && (
              <p className="text-xs text-destructive flex items-center gap-1.5 mt-2">
                <AlertCircle className="h-3.5 w-3.5" />
                Please select a location on the map
              </p>
            )}
          </div>

          {/* Crime Type */}
          <div className="space-y-3">
            <Label htmlFor="type" className="flex items-center gap-2 text-sm font-medium">
              Incident Type
              <span className="text-destructive">*</span>
            </Label>
            <Select
              onValueChange={(val) => {
                setFormData({ ...formData, type: val });
                setErrors({ ...errors, type: false });
              }}
              value={formData.type}
            >
              <SelectTrigger
                id="type"
                className={cn(
                  "h-12 rounded-xl",
                  errors.type && "border-destructive focus:ring-destructive/20"
                )}
              >
                <SelectValue placeholder="Select incident type" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="theft" className="py-3">🔓 Theft / Robbery</SelectItem>
                <SelectItem value="assault" className="py-3">⚠️ Assault</SelectItem>
                <SelectItem value="vandalism" className="py-3">🎨 Vandalism</SelectItem>
                <SelectItem value="suspicious" className="py-3">👁️ Suspicious Activity</SelectItem>
                <SelectItem value="traffic" className="py-3">🚗 Traffic Incident</SelectItem>
                <SelectItem value="noise" className="py-3">📢 Noise Disturbance</SelectItem>
                <SelectItem value="drugs" className="py-3">💊 Drug Related</SelectItem>
                <SelectItem value="other" className="py-3">📝 Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <Label htmlFor="date" className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Date
                <span className="text-destructive">*</span>
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => {
                  setFormData({ ...formData, date: e.target.value });
                  setErrors({ ...errors, date: false });
                }}
                className={cn("h-12 rounded-xl", errors.date && "border-destructive")}
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="time" className="flex items-center gap-2 text-sm font-medium">
                <Clock className="h-4 w-4 text-muted-foreground" />
                Time
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="h-12 rounded-xl"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <Label htmlFor="description" className="flex items-center gap-2 text-sm font-medium">
              Description
              <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Describe the incident in detail. Include suspect description, vehicle details, etc."
              className={cn(
                "min-h-[120px] resize-none rounded-xl",
                errors.description && "border-destructive"
              )}
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                setErrors({ ...errors, description: false });
              }}
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Camera className="h-4 w-4 text-muted-foreground" />
              Upload Photos
              <span className="text-xs text-muted-foreground font-normal">(Optional, max 5)</span>
            </Label>

            {/* Upload Zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "relative flex flex-col items-center justify-center p-6 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-300",
                isDragging
                  ? "bg-primary/5 dark:bg-primary/10 border-primary"
                  : "bg-muted/30 dark:bg-slate-700/30 border-muted-foreground/20 dark:border-slate-600 hover:border-primary/50 hover:bg-primary/5 dark:hover:bg-primary/10"
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleImageUpload(e.target.files)}
              />
              <div className={cn(
                "flex h-12 w-12 items-center justify-center rounded-xl mb-3 transition-colors",
                isDragging ? "bg-primary/10 dark:bg-primary/20" : "bg-muted dark:bg-slate-700"
              )}>
                {isDragging ? (
                  <Upload className="h-6 w-6 text-primary" />
                ) : (
                  <ImagePlus className="h-6 w-6 text-muted-foreground dark:text-slate-400" />
                )}
              </div>
              <p className="text-sm font-medium text-foreground">
                {isDragging ? "Drop images here" : "Click to upload or drag & drop"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG, GIF up to 10MB each
              </p>
            </div>

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-3 mt-4">
                {images.map((image) => (
                  <div key={image.id} className="relative group aspect-square rounded-xl overflow-hidden bg-muted">
                    <img
                      src={image.preview}
                      alt="Upload preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(image.id);
                      }}
                      className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-lg"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-xs text-white truncate font-medium">{image.file.name}</p>
                    </div>
                  </div>
                ))}

                {/* Add More Button */}
                {images.length < 5 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square rounded-xl border-2 border-dashed border-muted-foreground/20 hover:border-primary/50 hover:bg-primary/5 flex flex-col items-center justify-center gap-1 transition-all"
                  >
                    <ImagePlus className="h-6 w-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Add more</span>
                  </button>
                )}
              </div>
            )}

            {images.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {images.length} of 5 photos uploaded
              </p>
            )}
          </div>

          {/* Contact (Optional) */}
          <div className="space-y-3">
            <Label htmlFor="contact" className="flex items-center gap-2 text-sm font-medium">
              Contact Number
              <span className="text-xs text-muted-foreground font-normal">(Optional)</span>
            </Label>
            <Input
              id="contact"
              type="tel"
              placeholder="For follow-up questions"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              className="h-12 rounded-xl"
            />
          </div>
        </form>
      </CardContent>

      <CardFooter className="border-t dark:border-slate-700 bg-muted/20 dark:bg-slate-800/50 p-6">
        <Button
          className="w-full gap-3 h-14 text-base font-semibold rounded-xl shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] transition-all duration-300"
          onClick={handleSubmit}
        >
          <Send className="h-5 w-5" />
          Submit Report
        </Button>
      </CardFooter>
    </Card>
  );
}
