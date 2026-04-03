import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow } from "@vis.gl/react-google-maps";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string;
const MADISON = { lat: 43.07235, lng: -89.40365 };

interface ListingPin {
  id: number;
  title: string;
  monthly_rent: string;
  lat: { String: string; Valid: boolean } | number | string | null;
  lng: { String: string; Valid: boolean } | number | string | null;
}

interface Props {
  // Single listing mode
  address?: string;
  loc?: { lat: number; lng: number };
  zoom?: number;
  // Multi listing mode
  listings?: ListingPin[];
}

// Unwrap Go's sql.NullString decimal, plain number, or string
function nullFloat(val: ListingPin["lat"]): number | null {
  if (val === null || val === undefined) return null;
  if (typeof val === "number") return isNaN(val) ? null : val;
  if (typeof val === "string") {
    const n = parseFloat(val);
    return isNaN(n) ? null : n;
  }
  if (typeof val === "object" && "Valid" in val) {
    if (!val.Valid) return null;
    const n = parseFloat(val.String);
    return isNaN(n) ? null : n;
  }
  return null;
}

export function MapSection({ loc, zoom, listings }: Props) {
  const navigate = useNavigate();
  const [openId, setOpenId] = useState<number | null>(null);

  const isMulti = !!listings;

  // Build renderable pins — only listings that have valid coordinates
  const pins = (listings ?? []).flatMap(l => {
    const lat = nullFloat(l.lat);
    const lng = nullFloat(l.lng);
    if (lat === null || lng === null) return [];
    return [{ id: l.id, title: l.title, monthly_rent: l.monthly_rent, lat, lng }];
  });

  const center = isMulti
    ? (pins[0] ?? MADISON)
    : (loc ?? MADISON);

  return (
    <APIProvider apiKey={GOOGLE_MAPS_KEY}>
      <Map
        defaultCenter={center}
        defaultZoom={zoom ?? (isMulti ? 15 : 16)}
        mapId="sub2lease-map"
        style={{ width: "100%", height: "100%" }}
        gestureHandling="greedy"
        
        disableDefaultUI={true}

        // Add back only essentials
        zoomControl={true}
        mapTypeControl={true}
        streetViewControl={true}
        // Extra polish
        clickableIcons={false}   // removes POI clutter clicks
      >
        {/* Single listing mode — plain pin */}
        {!isMulti && loc && (
          <AdvancedMarker position={loc}>
            <Pin background="#fb923c" borderColor="#ea580c" glyphColor="white" />
          </AdvancedMarker>
        )}

        {/* Multi listing mode — price label pins */}
        {isMulti && pins.map(pin => (
          <div key={pin.id}>
            <AdvancedMarker
              position={{ lat: pin.lat, lng: pin.lng }}
              onClick={() => setOpenId(openId === pin.id ? null : pin.id)}
            >
              <div style={{
                background: "#fb923c",
                color: "white",
                fontWeight: 700,
                fontSize: 12,
                padding: "4px 10px",
                borderRadius: 999,
                whiteSpace: "nowrap",
                boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
                border: "2px solid white",
                cursor: "pointer",
              }}>
                ${pin.monthly_rent}
              </div>
            </AdvancedMarker>

            {openId === pin.id && (
              <InfoWindow
                position={{ lat: pin.lat, lng: pin.lng }}
                onCloseClick={() => setOpenId(null)}
                pixelOffset={[0, -40]}
                disableAutoPan
                headerDisabled
              >
                <div style={{ minWidth: 140 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 2 }}>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{pin.title}</div>
                    <button
                      onClick={() => setOpenId(null)}
                      style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#94a3b8", lineHeight: 1, padding: 0, flexShrink: 0 }}
                    >✕</button>
                  </div>
                  <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>${pin.monthly_rent}/mo</div>
                  <button
                    onClick={() => navigate(`/listings/${pin.id}`)}
                    style={{ fontSize: 12, color: "#fb923c", fontWeight: 600, background: "none", border: "none", cursor: "pointer", padding: 0 }}
                  >
                    View listing →
                  </button>
                </div>
              </InfoWindow>
            )}
          </div>
        ))}
      </Map>
    </APIProvider>
  );
}