import { useState } from "react";
import { useParams } from "react-router-dom";
import { ErrorPage } from "@/app/router/error-page";
import { useListings } from "@/shared/hooks";
import { LISTING_PARAM } from "@/app/router";
import {
  Wind, 
  Wifi, 
  Flame, 
  Dumbbell, 
  Waves, 
  UtensilsCrossed, 
  Microwave, 
  ChevronsDown,
} from 'lucide-react';
import { MapSection } from "@/widgets/Listings";
import { OfferModal } from "@/widgets/widget/OfferModal";

const amenityIcons = [
  { icon: <Wind size={20} />, label: "Air conditioning", value: 'aircon' },
  { icon: <Wifi size={20} />, label: "Wifi", value: 'wifi' },
  { icon: <UtensilsCrossed size={20} />, label: "Stove", value: 'stove' },
  { icon: <Flame size={20} />, label: "Heating", value: 'heating' },
  { icon: <Dumbbell size={20} />, label: "Gym", value: 'gym' },
  { icon: <UtensilsCrossed size={20} />, label: "Oven", value: 'oven' },
  { icon: <Waves size={20} />, label: "In-unit laundry", value: 'laundry' },
  { icon: <UtensilsCrossed size={20} />, label: "Dishwasher", value: 'dishwasher' },
  { icon: <Microwave size={20} />, label: "Microwave", value: 'microwave' },
];

const dummyListing = {
  id: 79,
  user_id: {"Int64":75,"Valid":true},
  address: "339 West Gorham Street",
  city: "Madison ",
  state: "Wi",
  country: "US",
  zipcode: "53703",
  description: "Cool Place",
  property_type: "Apartment",
  listing_type: "Sublease",
  poster_role: "Tenant",
  furnished: true,
  total_bedroom_count: 4,
  rooms_available: 1,
  bathrooms: 2,
  monthly_rent: "5000",
  security_deposit: {"String":"", Valid: false},
  start_date: "2026-03-18T00:00:00Z",
  end_date: "2026-06-26T00:00:00Z",
  property_website: {"String":"", Valid: false},
  status: "subleased",
  created_at: "2026-03-17T01:58:53.790581Z",
  updated_at: "2026-03-17T21:01:09.124583Z",
  title: "Winter Wonderland",
  amenities: {"String":"aircon wifi stove heating gym oven laundry dishwasher microwave", Valid: false},
  house_rules: {"String":"", Valid: false},
  photos: ["https://ffeiqqfembwxavvqihpd.supabase.co/storage/v1/object/public/sub2lease_images/posts/79/7911c47c-3f72-4382-b8b2-2ab92092bfc3.jpe","https://ffeiqqfembwxavvqihpd.supabase.co/storage/v1/object/public/sub2lease_images/posts/79/629b2099-a36f-4f2f-98aa-e14571bbea75.jpe","https://ffeiqqfembwxavvqihpd.supabase.co/storage/v1/object/public/sub2lease_images/posts/79/6016d144-8198-453c-bcc9-22cd01eb868e.jpe","https://ffeiqqfembwxavvqihpd.supabase.co/storage/v1/object/public/sub2lease_images/posts/79/efa88e48-523b-41e4-b4ff-48055d732321.jpe","https://ffeiqqfembwxavvqihpd.supabase.co/storage/v1/object/public/sub2lease_images/posts/79/a02c352e-a51e-4a0a-ac51-59339e4faa08.jpe"]
};

export function ListingDetails() {
  const [isAtTop, setIsAtTop] = useState(true);
  const [offerPost, setOfferPost] = useState<{
    id: number;
    title: string;
    monthly_rent: string;
    start_date: string;
    end_date: string;
  } | null>(null);
  const listingId = useParams()[LISTING_PARAM];
  const { getListingById } = useListings();

  const listing = getListingById(listingId || "") ?? dummyListing;

  if (!listing) return <ErrorPage/>;

  const start = new Date(listing.start_date);
  const end = new Date(listing.end_date);
  const availabilityStr = start.toLocaleDateString()+"\u2013"+end.toLocaleDateString();

  const listingAmenities = listing.amenities.String.split(' ').map((s: string) => s);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const isCurrentlyAtTop = scrollTop < 200;

    if (isCurrentlyAtTop !== isAtTop) {
      setIsAtTop(isCurrentlyAtTop);
    }
  };

  return (
    <div className="flex gap-4 font-sans text-slate-800">
      {/* Photos */}
      <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-1 h-[80vh]">
        <img className="size-full object-cover col-span-2 rounded-3xl" src={listing.photos[0]} alt="Listing Photo 1" />
        <img className="size-full object-cover rounded-3xl" src={listing.photos[1]} alt="Listing Photo 2" />
        <div className="grid grid-rows-2 gap-1">
          <img className="size-full object-cover rounded-3xl" src={listing.photos[2]} alt="Listing Photo 3" />
          <img className="size-full object-cover rounded-3xl" src={listing.photos[3]} alt="Listing Photo 4" />
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col items-center">
        <div
          onScroll={handleScroll}
          className="w-full flex-1 gap-4 flex flex-col max-h-[70vh] overflow-y-auto scrollbar-none pb-4"
        >
          {/* Header Info Card */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold mb-1 inline-block">{listing.title}</h1>
              <span className="font-semibold text-slate-600 block">{listing.total_bedroom_count} bed / {listing.bathrooms} bath</span>
            </div>
            <span className="font-semibold leading-loose">{listing.address}, {listing.city.trim()},</span> {listing.state} {listing.zipcode}

            <p className="my-2 text-slate-600 font-medium">Open From: <span className="text-lg">{availabilityStr}</span></p>
            <div className="pt-2">
              <p className="font-semibold">About the Building:</p>
              <p className="text-slate-600">{listing.description}</p>
            </div>
          </div>

          {/* Amenities Card */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 grid grid-cols-3 gap-y-4 gap-x-2">
            {amenityIcons.filter((item) => listingAmenities.includes(item.value)).map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                {item.icon}
                <span>{item.label}</span>
              </div>
            ))}
          </div>

          {/* Bottom Section: Map & Calendar */}
          <div className="flex shrink-0 h-[500px]">
            <MapSection />

            {/* Mini Calendar UI */}
            {/* <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-4 px-1">
                <ChevronLeft size={18} className="text-slate-400 cursor-pointer" />
                <div className="flex gap-2 font-semibold text-sm">
                  <span>Sep</span>
                  <span>2025</span>
                </div>
                <ChevronRight size={18} className="text-slate-400 cursor-pointer" />
              </div>
              <div className="grid grid-cols-7 text-[10px] text-center text-slate-400 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => <div key={d}>{d}</div>)}
              </div>
              <div className="grid grid-cols-7 text-center text-xs gap-y-2">
                {[...Array(20)].map((_, i) => {
                  const day = i + 1;
                  const isSelected = day === 9 || day === 13;
                  return (
                    <div 
                      key={i} 
                      className={`p-1 rounded-md ${isSelected ? 'bg-zinc-800 text-white font-bold' : 'text-slate-600'}`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </div> */}
          </div>
        </div>
        { isAtTop && <ChevronsDown size={50} className="-mt-[50px] text-black" /> }
        {/* Footer Pricing & Actions -- if absolute: absolute bottom-4 right-[35vw] w-[30vw] */}
        <div className="w-full bg-white p-4 rounded-3xl border border-slate-100 flex justify-between gap-4 items-center">
          <div>
            <div className="text-2xl font-bold">${listing.monthly_rent}/mo</div>
            <div className="text-sm text-slate-500">Open From: {availabilityStr}</div>
          </div>
          <div className="flex gap-2">
            <button
              disabled
              className="bg-orange-200 enabled:hover:bg-orange-400 text-white px-6 py-3 rounded-2xl font-bold transition-colors"
            >
              Message
            </button>
            <button
              onClick={() => {
                setOfferPost({
                  id: listing.id,
                  title: listing.title,
                  monthly_rent: listing.monthly_rent,
                  start_date: listing.start_date,
                  end_date: listing.end_date,
                });
              }}
              className="bg-orange-300 hover:bg-orange-400 text-white px-6 py-3 rounded-2xl font-bold transition-colors"
            >
              Reserve
            </button>
          </div>
        </div>
      </div>
      {/* Offer Modal */}
      {offerPost && (
        <OfferModal
          postId={offerPost.id}
          postTitle={offerPost.title}
          monthlyRent={offerPost.monthly_rent}
          availableFrom={offerPost.start_date}
          availableTo={offerPost.end_date}
          onClose={() => setOfferPost(null)}
          onSuccess={() => setOfferPost(null)}
        />
      )}
    </div>
  );
};
