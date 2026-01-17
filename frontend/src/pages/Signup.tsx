
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Camera } from "lucide-react";
import CameraCapture from "@/components/CameraCapture";

export default function Signup() {
    const navigate = useNavigate();
    const [cameraOpen, setCameraOpen] = useState(false);
    const [activeField, setActiveField] = useState<'valid-id' | 'selfie' | null>(null);
    const [idImage, setIdImage] = useState<File | null>(null);
    const [selfieImage, setSelfieImage] = useState<File | null>(null);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [isPhoneVerified, setIsPhoneVerified] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const password = (form.elements.namedItem('password') as HTMLInputElement).value;
        const confirmPassword = (form.elements.namedItem('confirm-password') as HTMLInputElement).value;

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (!isPhoneVerified) {
            toast.error("Please verify your phone number first.");
            return;
        }

        if (!idImage || !selfieImage) {
            toast.error("Please provide both a Valid ID and a Selfie.");
            return;
        }

        // In a real app, you would append idImage and selfieImage to formData here
        console.log("ID Image:", idImage);
        console.log("Selfie Image:", selfieImage);

        toast.success("Account created successfully!");
        navigate('/');
    };

    const handleCameraCapture = (file: File) => {
        if (activeField === 'valid-id') {
            setIdImage(file);
            toast.success("ID captured successfully");
        } else if (activeField === 'selfie') {
            setSelfieImage(file);
            toast.success("Selfie captured successfully");
        }
        setCameraOpen(false);
        setActiveField(null);
    };

    const openCamera = (field: 'valid-id' | 'selfie') => {
        setActiveField(field);
        setCameraOpen(true);
    };

    const handleSendOtp = () => {
        if (!phoneNumber) {
            toast.error("Please enter a phone number");
            return;
        }
        setShowOtpInput(true);
        toast.info("OTP Sent! (Dummy: 123456)");
    };

    const handleVerifyOtp = () => {
        setIsPhoneVerified(true);
        setShowOtpInput(false);
        toast.success("Phone Verified!");
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
            <Card className="w-full max-w-md">
                <form onSubmit={handleSubmit}>
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
                        <CardDescription className="text-center">
                            Enter your details to create your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="firstName">First Name</Label>
                                <Input id="firstName" name="firstName" placeholder="First Name" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="lastName">Last Name</Label>
                                <Input id="lastName" name="lastName" placeholder="Last Name" required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="middleName">Middle Name <span className="text-slate-500 text-xs font-normal">(Optional)</span></Label>
                            <Input id="middleName" name="middleName" placeholder="Middle Name" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="m@example.com"
                                required
                                pattern="^[^@]+@[^@]+\.[^@]+$"
                                title="Please enter a valid email address (e.g., user@example.com)"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="+63 900 000 0000"
                                    value={phoneNumber}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    disabled={isPhoneVerified}
                                    required
                                />
                                {!isPhoneVerified && !showOtpInput && (
                                    <Button type="button" onClick={handleSendOtp}>Send OTP</Button>
                                )}
                            </div>
                        </div>

                        {showOtpInput && (
                            <div className="space-y-2">
                                <Label htmlFor="otp">Enter OTP</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="otp"
                                        name="otp"
                                        placeholder="123456"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                    />
                                    <Button type="button" onClick={handleVerifyOtp} className="whitespace-nowrap">Verify OTP</Button>
                                </div>
                            </div>
                        )}

                        {isPhoneVerified && (
                            <div className="flex items-center gap-2 text-green-600 bg-green-50 p-2 rounded text-sm dark:bg-green-900/20 dark:text-green-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                                Phone Number Verified
                            </div>
                        )}

                        <div className="space-y-4 pt-2 border-t dark:border-slate-800">
                            <h3 className="font-medium text-sm text-slate-900 dark:text-slate-100">Identity Verification</h3>

                            <div className="space-y-2">
                                <Label>Valid ID (Government Issued)</Label>
                                {!idImage ? (
                                    <div className="flex flex-col gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full h-20 border-dashed border-2 flex flex-col gap-2 hover:bg-slate-50 dark:hover:bg-slate-900"
                                            onClick={() => openCamera('valid-id')}
                                        >
                                            <Camera className="w-6 h-6 text-slate-400" />
                                            <span className="text-sm text-slate-500">Take Photo of ID</span>
                                        </Button>
                                        <p className="text-[10px] text-slate-500 text-center">Please ensure details are readable.</p>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between p-3 border rounded-md dark:border-slate-800">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                                                <Camera className="w-5 h-5 text-green-600 dark:text-green-500" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">ID Captured</span>
                                                <span className="text-xs text-slate-500">{idImage.name}</span>
                                            </div>
                                        </div>
                                        <Button type="button" variant="ghost" size="sm" onClick={() => openCamera('valid-id')} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20">
                                            Retake
                                        </Button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label>Face Verification (Selfie)</Label>
                                {!selfieImage ? (
                                    <div className="flex flex-col gap-2">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full h-20 border-dashed border-2 flex flex-col gap-2 hover:bg-slate-50 dark:hover:bg-slate-900"
                                            onClick={() => openCamera('selfie')}
                                        >
                                            <Camera className="w-6 h-6 text-slate-400" />
                                            <span className="text-sm text-slate-500">Take Selfie</span>
                                        </Button>
                                        <p className="text-[10px] text-slate-500 text-center">Ensure good lighting and your face is clearly visible.</p>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between p-3 border rounded-md dark:border-slate-800">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                                                <Camera className="w-5 h-5 text-green-600 dark:text-green-500" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Selfie Captured</span>
                                                <span className="text-xs text-slate-500">{selfieImage.name}</span>
                                            </div>
                                        </div>
                                        <Button type="button" variant="ghost" size="sm" onClick={() => openCamera('selfie')} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20">
                                            Retake
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" required minLength={8} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm Password</Label>
                            <Input id="confirm-password" name="confirm-password" type="password" required minLength={8} />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-4">
                        <Button className="w-full" type="submit">Sign Up</Button>
                        <div className="text-sm text-center text-gray-500 dark:text-gray-400">
                            Already have an account?{" "}
                            <Link to="/login" className="text-primary hover:underline">
                                Sign in
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>

            <Dialog open={cameraOpen} onOpenChange={setCameraOpen}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Take Photo</DialogTitle>
                    </DialogHeader>
                    {cameraOpen && (
                        <CameraCapture
                            onCapture={handleCameraCapture}
                            onClose={() => setCameraOpen(false)}
                            overlayType={activeField === 'valid-id' ? 'id' : 'face'}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

