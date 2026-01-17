import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Bell, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
// Badge removed

export default function Settings() {
  const [loading, setLoading] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  const setTheme = (newTheme: 'light' | 'dark') => {
    if (newTheme !== theme) {
      toggleTheme();
    }
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your profile and application preferences.</p>
      </div>

      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 dark:text-white">
            <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Profile Information
            {user?.isVerified ? (
              <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full border border-green-200 dark:border-green-800">
                Verified
              </span>
            ) : (
              <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full border border-yellow-200 dark:border-yellow-800">
                Pending
              </span>
            )}
          </CardTitle>
          <CardDescription className="dark:text-slate-400">Update your personal details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">First Name</label>
              <Input
                defaultValue={user?.name ? user.name.split(' ')[0] : ''}
                className="dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Last Name</label>
              <Input
                defaultValue={user?.name ? user.name.split(' ').slice(1).join(' ') : ''}
                className="dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
            <Input
              defaultValue={user?.email || ''}
              className="dark:bg-slate-700 dark:border-slate-600 dark:text-white"
              readOnly
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Phone Number</label>
            <Input defaultValue="0912 345 6789" className="dark:bg-slate-700 dark:border-slate-600 dark:text-white" />
          </div>
        </CardContent>
      </Card>

      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 dark:text-white">
            <Moon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            Appearance
          </CardTitle>
          <CardDescription className="dark:text-slate-400">Customize the look and feel.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50 dark:bg-slate-900 dark:border-slate-800">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">Theme Mode</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Select your preferred display theme.</p>
            </div>
            <div className="flex bg-slate-200 dark:bg-slate-700 rounded-lg p-1">
              <Button
                size="sm"
                variant="ghost"
                className={`h-8 px-3 rounded-md ${theme === 'light' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
                onClick={() => setTheme('light')}
              >
                <Sun className="h-4 w-4 mr-2" />
                Light
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className={`h-8 px-3 rounded-md ${theme === 'dark' ? 'bg-slate-600 shadow-sm text-white' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'}`}
                onClick={() => setTheme('dark')}
              >
                <Moon className="h-4 w-4 mr-2" />
                Dark
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="dark:bg-slate-800 dark:border-slate-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 dark:text-white">
            <Bell className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            Notifications
          </CardTitle>
          <CardDescription className="dark:text-slate-400">Configure how you receive alerts.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50 dark:bg-slate-900 dark:border-slate-800">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">Emergency Alerts</p>
              <p className="text-xs text-slate-500">Receive instant push notifications for critical emergencies.</p>
            </div>
            <div className="h-6 w-11 bg-blue-600 rounded-full relative cursor-pointer">
              <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full shadow-sm" />
            </div>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50 dark:bg-slate-900 dark:border-slate-800">
            <div>
              <p className="font-medium text-slate-900 dark:text-white">Email Updates</p>
              <p className="text-xs text-slate-500">Get weekly summary reports via email.</p>
            </div>
            <div className="h-6 w-11 bg-slate-300 rounded-full relative cursor-pointer">
              <div className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full shadow-sm" />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={loading} className="w-32">
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
}