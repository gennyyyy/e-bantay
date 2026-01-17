import type { Report, Stat, Alert } from '@/types';
import { AlertTriangle, Clock3, Eye, CheckCircle } from 'lucide-react';

export const MOCK_REPORTS: Report[] = [
  { id: '1', type: 'Theft / Robbery', description: 'Bag snatched near the barangay hall along Norzagaray-Santa Maria Road. Suspect fled on motorcycle.', date: '2024-12-15', time: '14:30', location: { lat: 14.8600, lng: 120.9850 }, status: 'Pending', reporter: 'Anonymous' },
  { id: '2', type: 'Traffic Incident', description: 'Tricycle collision at Cityland Avenue intersection. Two vehicles involved. Minor injuries.', date: '2024-12-14', time: '09:15', location: { lat: 14.8820, lng: 120.9900 }, status: 'Investigating', reporter: 'Juan Dela Cruz' },
  { id: '3', type: 'Vandalism', description: 'Graffiti on public wall near the basketball court in Purok 5.', date: '2024-12-13', time: '22:00', location: { lat: 14.8560, lng: 120.9760 }, status: 'Resolved', reporter: 'Anonymous' },
  { id: '4', type: 'Suspicious Activity', description: 'Unknown individuals loitering near the elementary school during late hours.', date: '2024-12-12', time: '23:45', location: { lat: 14.8720, lng: 121.0000 }, status: 'Pending', reporter: 'Maria Santos' },
  { id: '5', type: 'Noise Disturbance', description: 'Loud videoke noise past midnight in residential area near Puntong Bato Road.', date: '2024-12-11', time: '01:30', location: { lat: 14.8520, lng: 120.9980 }, status: 'Resolved', reporter: 'Pedro Reyes' },
  { id: '6', type: 'Drug Related', description: 'Suspected drug activity near vacant lot along the eastern boundary.', date: '2024-12-10', time: '20:15', location: { lat: 14.8700, lng: 121.0120 }, status: 'Investigating', reporter: 'Anonymous' },
];

export const MOCK_STATS: Stat[] = [
  { label: 'Total Reports', value: '156', change: '+12%', trend: 'up', icon: AlertTriangle, color: 'blue', gradient: 'from-blue-500 to-indigo-500' },
  { label: 'Pending Review', value: '23', change: '+3', trend: 'up', icon: Clock3, color: 'amber', gradient: 'from-amber-500 to-orange-500' },
  { label: 'Under Investigation', value: '18', change: '-2', trend: 'down', icon: Eye, color: 'purple', gradient: 'from-purple-500 to-pink-500' },
  { label: 'Resolved Cases', value: '115', change: '+8', trend: 'up', icon: CheckCircle, color: 'emerald', gradient: 'from-emerald-500 to-teal-500' },
];

export const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string; border: string }> = {
  'Pending': { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500', border: 'border-amber-200' },
  'Investigating': { bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-500', border: 'border-purple-200' },
  'Resolved': { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', border: 'border-emerald-200' },
};

export const MOCK_ALERTS: Alert[] = [
  { id: '1', title: 'Heavy Rainfall Warning', message: 'Orange rainfall warning raised in Bulacan. Expect flooding in low-lying areas.', type: 'warning', date: '2024-12-22 08:00 AM', source: 'PAGASA' },
  { id: '2', title: 'Medical Mission', message: 'Free medical checkup and dental services at the Barangay Hall tomorrow starting 8am.', type: 'info', date: '2024-12-21 02:00 PM', source: 'Brgy. Health Center' },
  { id: '3', title: 'Fire Incident', message: 'Fire reported at Purok 2. Fire trucks are on the way. Please avoid the area.', type: 'emergency', date: '2024-12-20 09:30 PM', source: 'BFP Santa Maria' },
];
