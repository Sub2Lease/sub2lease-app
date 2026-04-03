import { useLayoutEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ErrorPage } from "@/app/router/error-page";
import { useListings } from "@/shared/hooks";
import { LISTING_PARAM } from "@/app/router";
import { ChevronsDown } from "lucide-react";
import { MapSection } from "@/widgets/Listings";
import { OfferModal } from "@/widgets/widget/OfferModal";
import { type Amenity, AMENITIES, amenities } from "@/shared";
import { useChatStore } from "@/shared/stores/chatStore";
import { backendHooks } from "@/shared/api/backendGO/hooks";
import { getUserById } from "@/shared/api/backendGO/endpoints";

function nullFloat(val: unknown): number | null {
  if (val === null || val === undefined) return null;
  if (typeof val === "number") return isNaN(val) ? null : val;
  if (typeof val === "string") {
    const n = parseFloat(val);
    return isNaN(n) ? null : n;
  }
  if (typeof val === "object" && "Valid" in (val as object)) {
    const v = val as { String?: string; Float64?: number; Valid: boolean };
    if (!v.Valid) return null;
    if (typeof v.Float64 === "number") return v.Float64;
    if (typeof v.String === "string") {
      const n = parseFloat(v.String);
      return isNaN(n) ? null : n;
    }
  }
  return null;
}

function nullStr(val: unknown): string | null {
  if (!val) return null;
  if (typeof val === "string") return val || null;
  if (typeof val === "object" && "Valid" in (val as object)) {
    const v = val as { String: string; Valid: boolean };
    return v.Valid ? v.String : null;
  }
  return null;
}

const GENDER_ICON: Record<string, string> = {
  male: "♂",
  female: "♀",
  "non-binary": "⚧",
};

function genderIcon(gender: string) {
  return GENDER_ICON[gender.toLowerCase()] ?? "·";
}

export function ListingDetails() {
  const [isAtTop, setIsAtTop] = useState(true);
  const [offerPost, setOfferPost] = useState<{
    id: number;
    title: string;
    monthly_rent: string;
    start_date: string;
    end_date: string;
  } | null>(null);
  const [photoGalleryOpen, setPhotoGalleryOpen] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  const navigate = useNavigate();
  const listingId = useParams()[LISTING_PARAM];
  const { getListingById } = useListings();
  const listing = getListingById(listingId || "");

  const { data: me } = backendHooks.useMe();
  const myUserId = (me as unknown as { id?: number })?.id;

  const { openConversation } = useChatStore();

  const photoGridRef = useRef<HTMLDivElement>(null);
  const photoWrapRef = useRef<HTMLDivElement>(null);
  const [photoScale, setPhotoScale] = useState(1);
  const [photoBox, setPhotoBox] = useState({ width: 0, height: 0 });

  const postId = listing?.id ?? 0;
  const { data: roommates } = backendHooks.useRoommates({ post_id: postId });

  useLayoutEffect(() => {
    const updatePhotoSize = () => {
      if (!photoGridRef.current) return;
      const grid = photoGridRef.current;
      const naturalWidth = grid.offsetWidth;
      const naturalHeight = grid.offsetHeight;
      const maxHeight = photoWrapRef.current?.parentElement?.clientHeight ?? window.innerHeight;
      const scale = Math.min(1, maxHeight / naturalHeight);
      setPhotoScale(scale);
      setPhotoBox({ width: naturalWidth * scale, height: naturalHeight * scale });
    };

    updatePhotoSize();
    const resizeObserver = new ResizeObserver(updatePhotoSize);
    if (photoGridRef.current) resizeObserver.observe(photoGridRef.current);
    window.addEventListener("resize", updatePhotoSize);
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updatePhotoSize);
    };
  }, []);

  if (!listing) return <ErrorPage />;

  const start = new Date(listing.start_date);
  const end = new Date(listing.end_date);
  const availabilityStr = start.toLocaleDateString() + "\u2013" + end.toLocaleDateString();

  const listingAmenities: Amenity[] = (listing.amenities?.String ?? "")
    .split(" ")
    .filter((a: string) => a && AMENITIES.includes(a.toLowerCase() as Amenity));

  const validPhotos = listing.photos.filter((p): p is string => typeof p === "string" && p.length > 0);
  const extraCount = validPhotos.length - 4;

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    const isCurrentlyAtTop = scrollTop < 200;
    if (isCurrentlyAtTop !== isAtTop) setIsAtTop(isCurrentlyAtTop);
  };

  const handleMessage = async () => {
    const posterId = listing.user_id?.Valid ? listing.user_id.Int64 : null;
    if (!posterId || myUserId == null) return;
    try {
      const user = await getUserById(posterId);
      const u = user as unknown as { username?: string; first_name?: string; profile_photo_url?: string | null };
      const name = u.username ?? u.first_name ?? String(posterId);
      openConversation(posterId, name, myUserId, u.profile_photo_url ?? null);
    } catch {
      openConversation(posterId, String(posterId), myUserId);
    }
    navigate(`/messages/${posterId}`);
  };

  const posterUserId = listing.user_id?.Valid ? listing.user_id.Int64 : null;
  const isOwnListing = myUserId != null && posterUserId === myUserId;
  const securityDeposit = nullStr(listing.security_deposit);
  const propertyWebsite = nullStr(listing.property_website);
  const houseRules = nullStr(listing.house_rules);

  return (
    <div className="flex gap-4 font-sans text-slate-800 h-screen overflow-hidden">
      {photoGalleryOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setPhotoGalleryOpen(false)}
        >
          <button className="absolute top-4 right-4 text-white text-3xl font-bold hover:opacity-70" onClick={() => setPhotoGalleryOpen(false)}>✕</button>
          <button className="absolute left-4 text-white text-4xl hover:opacity-70 px-4 py-2" onClick={(e) => { e.stopPropagation(); setGalleryIndex((i) => Math.max(0, i - 1)); }}>‹</button>
          <img src={validPhotos[galleryIndex]} alt={`Photo ${galleryIndex + 1}`} className="max-h-[90vh] max-w-[80vw] object-contain rounded-2xl" onClick={(e) => e.stopPropagation()} />
          <button className="absolute right-4 text-white text-4xl hover:opacity-70 px-4 py-2" onClick={(e) => { e.stopPropagation(); setGalleryIndex((i) => Math.min(validPhotos.length - 1, i + 1)); }}>›</button>
          <div className="absolute bottom-4 text-white text-sm opacity-60">{galleryIndex + 1} / {validPhotos.length}</div>
        </div>
      )}

      <div ref={photoWrapRef} className="shrink-0 overflow-hidden self-start" style={{ width: photoBox.width || undefined, height: photoBox.height || undefined }}>
        <div ref={photoGridRef} style={{ display: "grid", gridTemplateColumns: "23vw 23vw", gridTemplateRows: "28vw 14vw 14vw", gap: "8px", transform: `scale(${photoScale})`, transformOrigin: "top left", width: "fit-content", height: "fit-content" }}>
          <div className="rounded-3xl overflow-hidden bg-slate-200" style={{ gridColumn: "1/3", gridRow: "1" }}>
            <img className="size-full object-cover" src={validPhotos[0]} alt="Listing Photo 1" />
          </div>
          <div className="rounded-3xl overflow-hidden bg-slate-200" style={{ gridColumn: "1", gridRow: "2/4" }}>
            <img className="size-full object-cover" src={validPhotos[1]} alt="Listing Photo 2" />
          </div>
          <div className="rounded-3xl overflow-hidden bg-slate-200" style={{ gridColumn: "2", gridRow: "2" }}>
            <img className="size-full object-cover" src={validPhotos[2]} alt="Listing Photo 3" />
          </div>
          <div className="rounded-3xl overflow-hidden bg-slate-200 relative cursor-pointer group" style={{ gridColumn: "2", gridRow: "3" }} onClick={() => { setGalleryIndex(3); setPhotoGalleryOpen(true); }}>
            <img className="size-full object-cover" src={validPhotos[3]} alt="Listing Photo 4" />
            {extraCount > 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center group-hover:bg-black/60 transition-colors">
                <span className="text-white text-xl font-bold">+{extraCount}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col relative h-full overflow-hidden min-h-0">
        <div onScroll={handleScroll} className="w-full h-full gap-4 flex flex-col overflow-y-auto scrollbar-none pb-20 min-h-0">

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 break-words">
            <h1 className="text-xl font-bold text-slate-900 mb-2">{listing.title}</h1>

            <div className="flex flex-wrap gap-2 mb-3">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{listing.listing_type}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{listing.property_type}</span>
              {listing.furnished && <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-medium text-orange-500">Furnished</span>}
            </div>

            <div className="flex items-center gap-3 text-slate-500 text-sm mb-3">
              <span>{listing.total_bedroom_count} bed</span>
              <span className="text-slate-300">·</span>
              <span>{listing.bathrooms} bath</span>
              <span className="text-slate-300">·</span>
              <span>{listing.rooms_available} room{listing.rooms_available !== 1 ? "s" : ""} available</span>
            </div>

            <p className="font-semibold leading-loose text-slate-700">
              {listing.address}, {listing.city.trim()}, {listing.state} {listing.zipcode}
            </p>

            <p className="mt-2 text-slate-600 font-medium">
              Available: <span className="text-slate-800">{availabilityStr}</span>
            </p>

            <div className="mt-3 flex gap-6">
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wide">Monthly Rent</p>
                <p className="text-lg font-bold text-slate-800">${listing.monthly_rent}</p>
              </div>
              {securityDeposit && (
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wide">Security Deposit</p>
                  <p className="text-lg font-bold text-slate-800">${securityDeposit}</p>
                </div>
              )}
            </div>

            <p className="mt-3 text-xs text-slate-400">
              Listed by: <span className="text-slate-600 font-medium">{listing.poster_role}</span>
              {listing.created_at && (
                <span className="ml-3">
                  Posted <span className="text-slate-600 font-medium">{new Date(listing.created_at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}</span>
                </span>
              )}
            </p>

            <div className="mt-4 pt-4 border-t border-slate-100">
              <p className="font-semibold text-slate-800 mb-1">About the Building</p>
              <p className="text-slate-600 leading-relaxed">{listing.description}</p>
            </div>

            {propertyWebsite && (
              <a href={propertyWebsite} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm text-orange-400 hover:text-orange-500 font-medium transition-colors">
                Property website ↗
              </a>
            )}
          </div>

          {roommates && roommates.length > 0 && (
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <p className="font-semibold text-slate-800 mb-3">Current Roommate{roommates.length > 1 ? "s" : ""}</p>
              <div className="flex gap-3 overflow-x-auto scrollbar-none pb-1">
                {roommates.map((r, i) => (
                  <div key={r.id ?? i} className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-2.5 shrink-0">
                    <span className="text-lg leading-none text-slate-400">{genderIcon(r.gender)}</span>
                    <div className="flex flex-col leading-tight">
                      <span className="text-sm font-semibold text-slate-700">{r.gender}</span>
                      <span className="text-xs text-slate-400">{r.age} yrs old</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {houseRules && (
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <p className="font-semibold text-slate-800 mb-2">House Rules</p>
              <p className="text-slate-600 leading-relaxed whitespace-pre-line break-words">{houseRules}</p>
            </div>
          )}

          {listingAmenities.length > 0 && (
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <div className="grid grid-cols-3 gap-x-4 gap-y-3">
                {amenities.filter((item) => listingAmenities.includes(item.value)).map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                      <Icon size={18} className="shrink-0 text-slate-400" />
                      <span>{item.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex shrink-0 h-[500px] rounded-3xl overflow-hidden">
            <MapSection
              loc={
                nullFloat(listing.lat) !== null && nullFloat(listing.lng) !== null
                  ? { lat: nullFloat(listing.lat)!, lng: nullFloat(listing.lng)! }
                  : undefined
              }
              zoom={15}
            />
          </div>
        </div>

        {isAtTop && <ChevronsDown size={50} className="-mt-[50px] text-black" />}

        <div className="absolute bottom-4 left-0 right-0 bg-white/80 backdrop-blur-md p-4 rounded-3xl border border-slate-100 shadow-lg flex justify-between gap-4 items-center z-10">
          <div>
            <div className="text-2xl font-bold">${listing.monthly_rent}/mo</div>
            <div className="text-sm text-slate-500">Open From: {availabilityStr}</div>
          </div>
          <div className="flex gap-2">
            {isOwnListing ? (
              <button
                onClick={() => navigate(`/listings/${listing.id}/edit`)}
                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-3 rounded-2xl font-bold transition-colors"
              >
                Edit
              </button>
            ) : (
              <>
                <button onClick={handleMessage} disabled={!myUserId} className="bg-orange-300 hover:bg-orange-400 disabled:opacity-40 disabled:cursor-not-allowed text-white px-6 py-3 rounded-2xl font-bold transition-colors">
                  Message
                </button>
                <button onClick={() => setOfferPost({ id: listing.id, title: listing.title, monthly_rent: listing.monthly_rent, start_date: listing.start_date, end_date: listing.end_date })} className="bg-orange-300 hover:bg-orange-400 text-white px-6 py-3 rounded-2xl font-bold transition-colors">
                  Offer
                </button>
              </>
            )}
          </div>
        </div>
      </div>

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
}