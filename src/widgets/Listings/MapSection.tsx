export function MapSection({ lat, lng }: { lat: number; lng: number }) {
  const src = `https://www.google.com/maps?q=${lat},${lng}&z=13&output=embed`;

  return (
    <div className="w-full h-[600px] rounded-xl overflow-hidden shadow">
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