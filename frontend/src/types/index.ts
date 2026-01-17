import type { LucideIcon } from 'lucide-react';

export interface Location {
  lat: number;
  lng: number;
}

export type ReportStatus = 'Pending' | 'Investigating' | 'Resolved';

export interface Report {
  id: string;
  type: string;
  description: string;
  date: string;
  time: string;
  location: Location;
  status: ReportStatus;
  reporter: string;
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  type: 'emergency' | 'warning' | 'info';
  date: string;
  source: string;
}

export interface Stat {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: LucideIcon;
  color: 'blue' | 'amber' | 'purple' | 'emerald';
  gradient: string;
}

export const BARANGAY_CONFIG = {
  name: "Pulong Buhangin",
  municipality: "Santa Maria",
  province: "Bulacan",
  country: "Philippines",
  osmRelationId: 19556052,
  // Center of the barangay
  center: { lat: 14.8700, lng: 121.0000 },
  // Boundary polygon
  boundary: [
    // Southwest corner (Moved EAST of Cay Pombo)
    [14.8460, 120.9850],

    // Western edge (Zig-zag/Stair-step pattern, shifted EAST of El Pueblo del Rio)
    [14.8500, 120.9820],
    [14.8530, 120.9800],
    [14.8560, 120.9810],
    [14.8580, 120.9790],
    [14.8620, 120.9800],
    [14.8650, 120.9830],
    [14.8680, 120.9840],
    [14.8720, 120.9845],
    [14.8750, 120.9820],
    [14.8780, 120.9830],
    [14.8810, 120.9860],

    // North boundary (Top edge - same as before)
    [14.8850, 120.9850], // Connected smoothly
    [14.8900, 120.9950],
    [14.8930, 121.0050],

    // Northeast tip (Point near Yantok - same as before)
    [14.8980, 121.0180],

    // East boundary (Right side - same as before)
    [14.8900, 121.0200],
    [14.8800, 121.0205],
    [14.8700, 121.0190],

    // Southeast area (Wavy bottom right - same as before)
    [14.8650, 121.0180],
    [14.8620, 121.0150],
    [14.8600, 121.0160],
    [14.8580, 121.0140],

    // South boundary (Bottom edge - same as before)
    [14.8550, 121.0100],
    [14.8520, 121.0050],
    [14.8500, 121.0000],
    [14.8480, 120.9950],
    [14.8470, 120.9900],
    // Closing the loop back to the new start point
    [14.8460, 120.9850]
  ] as [number, number][],
  // Map bounds
  bounds: {
    north: 14.9000,
    south: 14.8400,
    east: 121.0250,
    west: 120.9750 // Tightened western bound
  }
};
