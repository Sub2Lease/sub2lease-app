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

  useLayoutEffect(() => {
    const updatePhotoSize = () => {
      if (!photoGridRef.current) return;
      const grid = photoGridRef.current;
      const naturalWidth = grid.offsetWidth;
      const naturalHeight = grid.offsetHeight;
      const maxHeight = photoWrapRef.current?.parentElement?.clientHeight ?? window.innerHeight;
      const scale = Math.min(1, maxHeight / naturalHeight);
      setPhotoScale(scale);
      setPhotoBox({
        width: naturalWidth * scale,
        height: naturalHeight * scale,
      });
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
  const availabilityStr =
    start.toLocaleDateString() + "\u2013" + end.toLocaleDateString();

  const listingAmenities: Amenity[] = (listing.amenities?.String ?? "")
    .split(" ")
    .filter((a: string) => a && AMENITIES.includes(a.toLowerCase() as Amenity));

  const validPhotos = listing.photos.filter(Boolean);
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

  return (
    <div className="flex gap-4 font-sans text-slate-800 h-screen overflow-hidden">
      {/* Photo Gallery Modal */}
      {photoGalleryOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setPhotoGalleryOpen(false)}
        >
          <button
            className="absolute top-4 right-4 text-white text-3xl font-bold hover:opacity-70"
            onClick={() => setPhotoGalleryOpen(false)}
          >
            ✕
          </button>
          <button
            className="absolute left-4 text-white text-4xl hover:opacity-70 px-4 py-2"
            onClick={(e) => { e.stopPropagation(); setGalleryIndex((i) => Math.max(0, i - 1)); }}
          >
            ‹
          </button>
          <img
            src={validPhotos[galleryIndex]}
            alt={`Photo ${galleryIndex + 1}`}
            className="max-h-[90vh] max-w-[80vw] object-contain rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute right-4 text-white text-4xl hover:opacity-70 px-4 py-2"
            onClick={(e) => { e.stopPropagation(); setGalleryIndex((i) => Math.min(validPhotos.length - 1, i + 1)); }}
          >
            ›
          </button>
          <div className="absolute bottom-4 text-white text-sm opacity-60">
            {galleryIndex + 1} / {validPhotos.length}
          </div>
        </div>
      )}

      {/* Photos */}
      <div
        ref={photoWrapRef}
        className="shrink-0 overflow-hidden self-start"
        style={{
          width: photoBox.width || undefined,
          height: photoBox.height || undefined,
        }}
      >
        <div
          ref={photoGridRef}
          style={{
            display: "grid",
            gridTemplateColumns: "23vw 23vw",
            gridTemplateRows: "28vw 14vw 14vw",
            gap: "8px",
            transform: `scale(${photoScale})`,
            transformOrigin: "top left",
            width: "fit-content",
            height: "fit-content",
          }}
        >
          <div
            className="rounded-3xl overflow-hidden bg-slate-200"
            style={{ gridColumn: "1/3", gridRow: "1" }}
          >
            <img className="size-full object-cover" src={validPhotos[0]} alt="Listing Photo 1" />
          </div>

          <div
            className="rounded-3xl overflow-hidden bg-slate-200"
            style={{ gridColumn: "1", gridRow: "2/4" }}
          >
            <img className="size-full object-cover" src={validPhotos[1]} alt="Listing Photo 2" />
          </div>

          <div
            className="rounded-3xl overflow-hidden bg-slate-200"
            style={{ gridColumn: "2", gridRow: "2" }}
          >
            <img className="size-full object-cover" src={validPhotos[2]} alt="Listing Photo 3" />
          </div>

          {/* Bottom right — clickable to open gallery */}
          <div
            className="rounded-3xl overflow-hidden bg-slate-200 relative cursor-pointer group"
            style={{ gridColumn: "2", gridRow: "3" }}
            onClick={() => { setGalleryIndex(3); setPhotoGalleryOpen(true); }}
          >
            <img className="size-full object-cover" src={validPhotos[3]} alt="Listing Photo 4" />
            {extraCount > 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center group-hover:bg-black/60 transition-colors">
                <span className="text-white text-xl font-bold">+{extraCount}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 flex flex-col items-center relative h-full overflow-hidden min-h-0">
        <div
          onScroll={handleScroll}
          className="w-full h-full gap-4 flex flex-col overflow-y-auto scrollbar-none pb-20 min-h-0"
        >
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold mb-1 inline-block">{listing.title}</h1>
              <span className="font-semibold text-slate-600 block">
                {listing.total_bedroom_count} bed / {listing.bathrooms} bath
              </span>
            </div>
            <span className="font-semibold leading-loose">
              {listing.address}, {listing.city.trim()},
            </span>{" "}
            {listing.state} {listing.zipcode}
            <p className="my-2 text-slate-600 font-medium">
              Open From: <span className="text-lg">{availabilityStr}</span>
            </p>
            <div className="pt-2">
              <p className="font-semibold">About the Building:</p>
              <p className="text-slate-600">{listing.description}</p>
            </div>
          </div>

          {listingAmenities.length > 0 && (
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 grid grid-cols-3 gap-y-4 gap-x-2 justify-items-center">
              {amenities
                .filter((item) => listingAmenities.includes(item.value))
                .map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </div>
                  );
                })}
            </div>
          )}

          <div className="flex shrink-0 h-[500px]">
            <MapSection />
          </div>
        </div>

        {isAtTop && <ChevronsDown size={50} className="-mt-[50px] text-black" />}

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] bg-white/80 backdrop-blur-md p-4 rounded-3xl border border-slate-100 shadow-lg flex justify-between gap-4 items-center z-10">
          <div>
            <div className="text-2xl font-bold">${listing.monthly_rent}/mo</div>
            <div className="text-sm text-slate-500">Open From: {availabilityStr}</div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleMessage}
              disabled={isOwnListing || !myUserId}
              className="bg-orange-300 hover:bg-orange-400 disabled:opacity-40 disabled:cursor-not-allowed text-white px-6 py-3 rounded-2xl font-bold transition-colors"
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
              disabled={isOwnListing}
              className="bg-orange-300 hover:bg-orange-400 disabled:opacity-40 disabled:cursor-not-allowed text-white px-6 py-3 rounded-2xl font-bold transition-colors"
            >
              Offer
            </button>
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