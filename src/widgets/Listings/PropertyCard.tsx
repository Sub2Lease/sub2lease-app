import type { Listing } from "@/shared/types";

export function PropertyCard({ property }: { property: Listing }) {
  const photo = property.photos?.[0] || null;

  return (
    <div className="box-border flex bg-white rounded-xl overflow-hidden shadow mb-4 md:h-28 lg:h-36">
      <div className="flex-1 size-full bg-gray-100">
        {photo ? (
          <img
            src={photo}
            alt={property.title}
            className="size-full object-[50%_70%] object-cover"
          />
        ) : (
          <div className="size-full bg-gray-500" />
        )}
      </div>
      <div className="box-border flex-1 flex justify-between w-full items-start">
        <div className="p-4">
          <h2 className="font-bold text-lg">{property.title}</h2>
          <span className="font-semibold">${property.monthly_rent}</span>
          <p className="text-gray-600">{property.address}</p>
        </div>
        <button className="mr-2 leading-none select-none text-red-500 hover:text-red-700 text-5xl">♥</button>
      </div>
    </div>
  );
}