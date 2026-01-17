/* eslint-disable */
import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polygon, useMap, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { LeafletMouseEvent, LatLngBounds } from 'leaflet';
import {
  MousePointer2,
  MapPin as MapPinIcon,
  AlertCircle,
  Crosshair,
  Plus,
  Minus,
  Maximize,
  Minimize,
  ChevronDown,
  ChevronUp,
  Layers
} from 'lucide-react';
import { BARANGAY_CONFIG, type Location } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Custom marker icons
const createCustomIcon = (color: string, size: number = 36) => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: ${size}px;
        height: ${size}px;
        background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%);
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 4px 14px ${color}66, 0 2px 6px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: ${size * 0.35}px;
          height: ${size * 0.35}px;
          background: white;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size]
  });
};

const selectedIcon = createCustomIcon('#ef4444', 40);
const pendingIcon = createCustomIcon('#f59e0b');
const investigatingIcon = createCustomIcon('#8b5cf6');
const resolvedIcon = createCustomIcon('#10b981');

// User location marker - blue pulsing dot
const createUserLocationIcon = () => {
  return L.divIcon({
    className: 'user-location-marker',
    html: `
      <div style="position: relative; width: 24px; height: 24px;">
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 24px;
          height: 24px;
          background: rgba(59, 130, 246, 0.3);
          border-radius: 50%;
          animation: userLocationPulse 2s ease-out infinite;
        "></div>
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 14px;
          height: 14px;
          background: #3b82f6;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.5);
        "></div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const userLocationIcon = createUserLocationIcon();

// Map Control Component for organizing custom buttons
function MapToolbar({
  onLocate,
  onToggleFullscreen,
  isFullscreen,
  isTracking = false
}: {
  onLocate: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
  isTracking?: boolean;
}) {
  const map = useMap();

  return (
    <div className="absolute bottom-6 right-4 z-[1000] flex flex-col gap-2">
      {/* Zoom Controls */}
      <div className="flex flex-col bg-white shadow-lg rounded-xl border border-slate-200 overflow-hidden">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-none border-b border-slate-100 hover:bg-slate-50"
          onClick={() => map.zoomIn()}
        >
          <Plus className="h-4 w-4 text-slate-600" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-none hover:bg-slate-50"
          onClick={() => map.zoomOut()}
        >
          <Minus className="h-4 w-4 text-slate-600" />
        </Button>
      </div>

      {/* Action Controls */}
      <div className="flex flex-col bg-white shadow-lg rounded-xl border border-slate-200 overflow-hidden">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-10 w-10 rounded-none border-b border-slate-100 transition-colors",
            isTracking
              ? "bg-blue-500 hover:bg-blue-600 text-white"
              : "hover:bg-slate-50"
          )}
          onClick={onLocate}
          title={isTracking ? "Stop Tracking" : "Track My Location"}
        >
          <Crosshair className={cn("h-4 w-4", isTracking ? "text-white" : "text-slate-600")} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-none hover:bg-slate-50"
          onClick={onToggleFullscreen}
          title="Fullscreen"
        >
          {isFullscreen ? <Minimize className="h-4 w-4 text-slate-600" /> : <Maximize className="h-4 w-4 text-slate-600" />}
        </Button>
      </div>
    </div>
  );
}

interface MapProps {
  onLocationSelect?: (location: Location) => void;
  onOutOfBounds?: () => void;
  markers?: Array<{ id: string; position: Location; title: string; type: string }>;
  interactive?: boolean;
  center?: Location;
  zoom?: number;
  restrictToBarangay?: boolean;
}

function isPointInPolygon(point: Location, polygon: [number, number][]): boolean {
  const x = point.lat;
  const y = point.lng;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
      inside = !inside;
    }
  }
  return inside;
}

function MaskLayer({ boundary }: { boundary: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    // Create mask using GeoJSON format which handles holes better
    // GeoJSON uses [lng, lat] format, so we need to swap coordinates
    const outerRing: [number, number][] = [
      [-180, 85],
      [180, 85],
      [180, -85],
      [-180, -85],
      [-180, 85]
    ];

    // Convert boundary from [lat, lng] to [lng, lat] for GeoJSON
    const innerRing: [number, number][] = boundary.map(([lat, lng]) => [lng, lat]);
    // Close the ring if not already closed
    if (innerRing[0][0] !== innerRing[innerRing.length - 1][0] ||
      innerRing[0][1] !== innerRing[innerRing.length - 1][1]) {
      innerRing.push(innerRing[0]);
    }

    const maskGeoJSON: GeoJSON.Feature<GeoJSON.Polygon> = {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [outerRing, innerRing]
      }
    };

    const maskLayer = L.geoJSON(maskGeoJSON, {
      style: {
        color: 'transparent',
        fillColor: '#1e293b',
        fillOpacity: 0.55,
        stroke: false,
        interactive: false
      }
    }).addTo(map);

    return () => { maskLayer.remove(); };
  }, [map, boundary]);

  return null;
}

function MapBoundsController({ restrictToBarangay }: { restrictToBarangay: boolean }) {
  const map = useMap();
  useEffect(() => {
    if (restrictToBarangay) {
      const buffer = 0.01;
      const bounds: LatLngBounds = L.latLngBounds(
        [BARANGAY_CONFIG.bounds.south - buffer, BARANGAY_CONFIG.bounds.west - buffer],
        [BARANGAY_CONFIG.bounds.north + buffer, BARANGAY_CONFIG.bounds.east + buffer]
      );
      map.setMaxBounds(bounds);
      map.setMinZoom(14);
      map.setMaxZoom(18);
    }
  }, [map, restrictToBarangay]);
  return null;
}

function LocationMarker({
  onLocationSelect,
  onOutOfBounds,
  restrictToBarangay
}: {
  onLocationSelect?: (loc: Location) => void;
  onOutOfBounds?: () => void;
  restrictToBarangay: boolean;
}) {
  const [position, setPosition] = useState<Location | null>(null);
  const [showOutOfBounds, setShowOutOfBounds] = useState(false);
  const map = useMapEvents({
    click(e: LeafletMouseEvent) {
      if (onLocationSelect) {
        const clickedLocation = e.latlng;
        if (restrictToBarangay && !isPointInPolygon(clickedLocation, BARANGAY_CONFIG.boundary)) {
          setShowOutOfBounds(true);
          onOutOfBounds?.();
          setTimeout(() => setShowOutOfBounds(false), 3000);
          return;
        }
        setPosition(clickedLocation);
        setShowOutOfBounds(false);
        onLocationSelect(clickedLocation);
        map.flyTo(clickedLocation, map.getZoom());
      }
    },
  });

  return (
    <>
      {position && (
        <Marker position={position} icon={selectedIcon}>
          <Popup>
            <div className="p-2">
              <p className="font-bold text-sm text-red-600">📍 Incident Location</p>
              <p className="text-xs text-gray-600 mt-1 font-mono">{position.lat.toFixed(6)}, {position.lng.toFixed(6)}</p>
            </div>
          </Popup>
        </Marker>
      )}
      {showOutOfBounds && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[1000]">
          <div className="bg-red-500 text-white rounded-xl shadow-lg px-5 py-3 flex items-center gap-3 animate-fade-in">
            <AlertCircle className="h-5 w-5" />
            <div>
              <p className="text-sm font-semibold">Outside coverage area</p>
              <p className="text-xs opacity-90">Please select a location within Brgy. {BARANGAY_CONFIG.name}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Live Location Marker - shows user's real-time position with pulsing indicator
function LiveLocationMarker({
  isTracking,
  onLocationUpdate
}: {
  isTracking: boolean;
  onLocationUpdate?: (loc: Location) => void;
}) {
  const map = useMap();
  const [userPosition, setUserPosition] = useState<Location | null>(null);
  const [accuracy, setAccuracy] = useState<number>(0);
  const watchIdRef = useRef<number | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const circleRef = useRef<L.Circle | null>(null);

  useEffect(() => {
    if (isTracking) {
      // Start watching position
      if (navigator.geolocation) {
        watchIdRef.current = navigator.geolocation.watchPosition(
          (position) => {
            const newPos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            setUserPosition(newPos);
            setAccuracy(position.coords.accuracy);
            onLocationUpdate?.(newPos);

            // Center map on first position
            if (!markerRef.current) {
              map.flyTo([newPos.lat, newPos.lng], 17);
            }
          },
          (error) => {
            console.error("Geolocation error:", error);
          },
          {
            enableHighAccuracy: true,
            maximumAge: 10000,
            timeout: 5000
          }
        );
      }
    } else {
      // Stop watching position
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      setUserPosition(null);
      setAccuracy(0);
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [isTracking, map, onLocationUpdate]);

  // Update marker position
  useEffect(() => {
    if (userPosition) {
      const latLng = L.latLng(userPosition.lat, userPosition.lng);

      if (!markerRef.current) {
        markerRef.current = L.marker(latLng, {
          icon: userLocationIcon,
          zIndexOffset: 1000
        }).addTo(map);
      } else {
        markerRef.current.setLatLng(latLng);
      }

      if (!circleRef.current) {
        circleRef.current = L.circle(latLng, {
          radius: accuracy,
          color: '#3b82f6',
          fillColor: '#3b82f6',
          fillOpacity: 0.15,
          weight: 2,
          opacity: 0.5
        }).addTo(map);
      } else {
        circleRef.current.setLatLng(latLng);
        circleRef.current.setRadius(accuracy);
      }
    } else {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      if (circleRef.current) {
        circleRef.current.remove();
        circleRef.current = null;
      }
    }

    return () => {
      if (markerRef.current) markerRef.current.remove();
      if (circleRef.current) circleRef.current.remove();
    };
  }, [userPosition, accuracy, map]);

  return null;
}

const getMarkerIcon = (status: string) => {
  switch (status) {
    case 'Pending': return pendingIcon;
    case 'Investigating': return investigatingIcon;
    case 'Resolved': return resolvedIcon;
    default: return selectedIcon;
  }
};

export default function Map({
  onLocationSelect,
  onOutOfBounds,
  markers = [],
  interactive = true,
  center = BARANGAY_CONFIG.center,
  zoom = 16,
  restrictToBarangay = true
}: MapProps) {
  const [hasSelected, setHasSelected] = useState(false);
  const [legendOpen, setLegendOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleToggleTracking = () => {
    setIsTracking(prev => !prev);
  };

  const handleLocationUpdate = (_loc: Location) => {
    // When user location is updated, we can optionally select it as incident location
    if (onLocationSelect && isTracking) {
      // Only auto-select on first track if interactive mode
      // User can click to override
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(err => {
        alert(`Error attempting to enable full-screen mode: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  return (
    <div ref={containerRef} className="h-full w-full overflow-hidden relative bg-slate-100 group/map">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        scrollWheelZoom={true}
        zoomControl={false}
        className="h-full w-full z-0"
        ref={mapRef}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Clean Map">
            <TileLayer
              attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              attribution='Tiles &copy; Esri &mdash; Source: Esri'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        {restrictToBarangay && (
          <>
            <MaskLayer boundary={BARANGAY_CONFIG.boundary} />
            <Polygon
              positions={BARANGAY_CONFIG.boundary}
              pathOptions={{ color: '#3b82f6', weight: 3, fillColor: 'transparent', fillOpacity: 0, dashArray: '5, 10', interactive: false }}
            />
          </>
        )}

        <MapBoundsController restrictToBarangay={restrictToBarangay} />

        {interactive && (
          <LocationMarker
            onLocationSelect={(loc) => { setHasSelected(true); onLocationSelect?.(loc); }}
            onOutOfBounds={onOutOfBounds}
            restrictToBarangay={restrictToBarangay}
          />
        )}

        {markers.map((marker) => (
          <Marker key={marker.id} position={[marker.position.lat, marker.position.lng]} icon={getMarkerIcon(marker.type)}>
            <Popup>
              <div className="p-2 min-w-[160px]">
                <p className="font-bold text-sm">{marker.title}</p>
                <div className="flex items-center gap-1.5 mt-2">
                  <span className={cn(
                    "inline-block w-2.5 h-2.5 rounded-full",
                    marker.type === 'Pending' ? 'bg-amber-500' :
                      marker.type === 'Investigating' ? 'bg-purple-500' : 'bg-emerald-500'
                  )} />
                  <span className="text-xs font-medium text-gray-600">{marker.type}</span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        <LiveLocationMarker
          isTracking={isTracking}
          onLocationUpdate={handleLocationUpdate}
        />

        <MapToolbar
          onLocate={handleToggleTracking}
          onToggleFullscreen={toggleFullscreen}
          isFullscreen={isFullscreen}
          isTracking={isTracking}
        />
      </MapContainer>

      {/* UI Overlays - Organized to avoid overlaps */}

      {/* Top Left: Badge & Instructions */}
      <div className="absolute top-4 left-4 z-[400] flex flex-col gap-3 pointer-events-none">
        {/* Barangay Badge */}
        {restrictToBarangay && (
          <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-lg px-4 py-3 border border-slate-200 pointer-events-auto w-fit">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-1.5 rounded-lg">
                <MapPinIcon className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 leading-tight">Brgy. {BARANGAY_CONFIG.name}</p>
                <p className="text-[10px] text-slate-500">{BARANGAY_CONFIG.municipality}, {BARANGAY_CONFIG.province}</p>
              </div>
            </div>
          </div>
        )}

        {/* Click instruction overlay */}
        {interactive && !hasSelected && (
          <div className="bg-blue-600 text-white rounded-xl shadow-lg px-4 py-2.5 flex items-center gap-3 animate-fade-in pointer-events-auto w-fit">
            <MousePointer2 className="h-4 w-4 text-white/80" />
            <p className="text-xs font-medium">Click on map to pin incident location</p>
          </div>
        )}
      </div>

      {/* Bottom Left: Collapsible Legend */}
      <div className="absolute bottom-6 left-4 z-[400] transition-all duration-300">
        <div className={cn(
          "bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-slate-200 overflow-hidden transition-all duration-300",
          legendOpen ? "w-48" : "w-10 h-10"
        )}>
          <button
            onClick={() => setLegendOpen(!legendOpen)}
            className="w-full h-10 px-3 flex items-center justify-between hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-slate-500" />
              {legendOpen && <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Legend</span>}
            </div>
            {legendOpen ? <ChevronDown className="h-4 w-4 text-slate-400" /> : <ChevronUp className="h-4 w-4 text-slate-400" />}
          </button>

          {legendOpen && (
            <div className="px-4 pb-4 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="h-px bg-slate-100 -mx-4" />
              <div className="space-y-2.5 pt-1">
                <div className="flex items-center gap-3 text-xs">
                  <span className="w-3 h-3 rounded-full bg-amber-500 shadow-sm" />
                  <span className="font-medium text-slate-600">Pending</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="w-3 h-3 rounded-full bg-purple-500 shadow-sm" />
                  <span className="font-medium text-slate-600">Investigating</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm" />
                  <span className="font-medium text-slate-600">Resolved</span>
                </div>
                <div className="pt-1 flex items-center gap-2 text-[10px] text-slate-400 italic">
                  <div className="w-4 h-0.5 border-t border-dashed border-blue-400" />
                  <span>Brgy. Boundary</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom attribution positioning */}
      <div className="absolute bottom-1 right-4 z-[999] pointer-events-none opacity-50">
        <span className="text-[10px] text-slate-400 bg-white/50 px-1 rounded">© OpenStreetMap</span>
      </div>
    </div>
  );
}
