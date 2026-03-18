import { useEffect, useState } from "react";
import { useCoordinates } from "@/shared/hooks";

export function MapSection({ address, loc, zoom }: { address?: string, loc?: { lat: number; lng: number }, zoom?: number }) {
  const { getCoordinates } = useCoordinates();
  const [addrLoc, setAddrLoc] = useState<{ lat: number; lng: number }>();
  
  useEffect(() => {
    if (!address) return;
    getCoordinates(address).then(res => res?.json()).then(result => {
      if (result?.error) return;
      const { lat, lng } = result;
      setAddrLoc({ lat, lng });
    });
  }, [address, getCoordinates]);

  const defaultPos = { lat: 43.07235, lng: -89.40365 }; // grand central in Madison
  
  const usedLoc = loc || addrLoc || defaultPos;

  const src = `https://www.google.com/maps?q=${usedLoc?.lat ?? 43.07235},${usedLoc?.lng ?? -89.40365}&z=${zoom ?? 16}&output=embed`;

  return (
    <div className="w-full h-full rounded-xl overflow-hidden shadow">
      <iframe
        src={src}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}

// ONCE WE HAVE A GOOGLE CLOUD PROJECT WITH A MAPS API KEY:

// import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";

// export function MapSection({ lat, lng }: { lat: number; lng: number }) {
//   const position = { lat, lng };

//   return (
//     <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}>
//       <Map
//         defaultCenter={position}
//         defaultZoom={12}
//         style={{ width: "100%", height: "600px" }}
//       >
//         <AdvancedMarker position={position} />
//       </Map>
//     </APIProvider>
//   );
// }