import { useRef, useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Camera } from 'lucide-react';

interface CameraCaptureProps {
    onCapture: (file: File) => void;
    onClose: () => void;
    overlayType?: 'id' | 'face' | 'none';
}

export default function CameraCapture({ onCapture, onClose, overlayType = 'none' }: CameraCaptureProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let stream: MediaStream | null = null;

        async function startCamera() {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'user' }
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    setIsStreaming(true);
                }
            } catch (err) {
                console.error("Error accessing camera:", err);
                setError("Could not access camera. Please ensure permissions are granted.");
            }
        }

        startCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            if (context) {
                // Set canvas dimensions to match video
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;

                // Draw video frame to canvas
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                // Convert to blob/file
                canvas.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], `capture-${Date.now()}.png`, { type: 'image/png' });
                        onCapture(file);
                    }
                }, 'image/png');
            }
        }
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            {error ? (
                <div className="text-red-500 text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-md">
                    {error}
                </div>
            ) : (
                <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
                    {!isStreaming && (
                        <div className="absolute inset-0 flex items-center justify-center text-white">
                            Loading Camera...
                        </div>
                    )}
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover transform scale-x-[-1]" // Mirror effect
                    />

                    {/* Overlays */}
                    {overlayType === 'id' && (
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                            <div className="w-[85%] h-[60%] border-2 border-white rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
                                <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-blue-500 -mt-0.5 -ml-0.5" />
                                <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-blue-500 -mt-0.5 -mr-0.5" />
                                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-blue-500 -mb-0.5 -ml-0.5" />
                                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-blue-500 -mb-0.5 -mr-0.5" />
                                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-white text-xs bg-black/50 px-2 py-1 rounded">
                                    Align ID within frame
                                </div>
                            </div>
                        </div>
                    )}

                    {overlayType === 'face' && (
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                            <div className="w-48 h-48 rounded-full border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
                                <div className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white text-xs bg-black/50 px-2 py-1 rounded w-max">
                                    Position face within circle
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <canvas ref={canvasRef} className="hidden" />

            <div className="flex gap-4 w-full justify-center">
                <Button variant="outline" onClick={onClose}>
                    Cancel
                </Button>
                <Button onClick={capturePhoto} disabled={!isStreaming || !!error} className="gap-2">
                    <Camera className="w-4 h-4" />
                    Capture Photo
                </Button>
            </div>
        </div>
    );
}
