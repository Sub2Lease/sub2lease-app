import { useState, useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import { processAndCompressImages } from "@/shared/utils";
import { backendHooks } from "@/shared/api/backendGO/hooks";

export type PhotoSlot =
  | { kind: "existing"; id: number; url: string }
  | { kind: "new"; file: File; previewUrl: string };

interface Props {
  postId: number;
  slots: PhotoSlot[];
  setSlots: Dispatch<SetStateAction<PhotoSlot[]>>;
}

const FILE_LIMIT = 10;

export function PhotosStep({ postId, slots, setSlots }: Props) {
  const { data: serverPhotos, isLoading } = backendHooks.usePhotosByPostID({ post_id: postId });
  const initialized = useRef(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!serverPhotos || initialized.current) return;
    initialized.current = true;
    setSlots(
      [...serverPhotos]
        .sort((a, b) => a.order - b.order)
        .map((p) => ({ kind: "existing", id: p.id, url: p.photo_url }))
    );
  }, [serverPhotos, setSlots]);

  useEffect(() => {
    return () => {
      slots.forEach((s) => { if (s.kind === "new") URL.revokeObjectURL(s.previewUrl); });
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const results = await processAndCompressImages(e.target.files);
    const successful = results.filter((r) => r.status === "fulfilled").map((r) => r.value);
    if (successful.length !== results.length) alert("Some files failed to process and were not added!");
    if (!successful.length) return;
    if (slots.length + successful.length > FILE_LIMIT) alert(`You can upload a maximum of ${FILE_LIMIT} photos.`);
    const newSlots: PhotoSlot[] = successful
      .slice(0, FILE_LIMIT - slots.length)
      .map((file) => ({ kind: "new", file, previewUrl: URL.createObjectURL(file) }));
    setSlots((prev) => [...prev, ...newSlots]);
    e.target.value = "";
  };

  const handleDragStart = (i: number) => setDragIndex(i);

  const handleDrop = (i: number) => {
    if (dragIndex === null || dragIndex === i) return;
    setSlots((prev) => {
      const next = [...prev];
      next.splice(i, 0, next.splice(dragIndex, 1)[0]);
      return next;
    });
    setDragIndex(null);
  };

  const removeSlot = (i: number) => {
    setSlots((prev) => {
      const slot = prev[i];
      if (slot.kind === "new") URL.revokeObjectURL(slot.previewUrl);
      return prev.filter((_, idx) => idx !== i);
    });
  };

  const getThumb = (slot: PhotoSlot) => slot.kind === "existing" ? slot.url : slot.previewUrl;

  if (isLoading) {
    return <div className="flex items-center justify-center h-40 text-foreground/40 text-sm">Loading photos…</div>;
  }

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-xl font-semibold text-foreground">Photos</h2>

      {slots.length < FILE_LIMIT && (
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-foreground/20 bg-foreground/5 px-5 py-4 transition-colors hover:bg-foreground/10">
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
          <span className="text-xl text-foreground/40">+</span>
          <div>
            <p className="text-sm font-medium text-foreground">Add photos</p>
            <p className="text-xs text-foreground/40">
              {slots.length} / {FILE_LIMIT}
              {slots.length < 5 && ` — ${5 - slots.length} more needed`}
            </p>
          </div>
        </label>
      )}

      {slots.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {slots.map((slot, i) => (
            <div
              key={slot.kind === "existing" ? `e-${slot.id}` : `n-${slot.previewUrl}`}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(i)}
              onDragEnd={() => setDragIndex(null)}
              className={`relative cursor-grab rounded-xl bg-background overflow-hidden border-2 transition-colors ${
                dragIndex === i ? "border-foreground/40 opacity-50" : "border-transparent"
              }`}
            >
              <img src={getThumb(slot)} alt="" className="w-full aspect-square object-cover" draggable={false} />
              <div className="absolute top-1 left-2 px-2 text-lg rounded-full font-bold text-foreground/75 bg-background">
                {i === 0 ? "★" : i + 1}
              </div>
              {slot.kind === "new" && (
                <div className="absolute bottom-1 left-1 rounded-full bg-foreground/70 px-2 py-0.5 text-[9px] font-semibold text-background">
                  new
                </div>
              )}
              <button
                type="button"
                onClick={() => removeSlot(i)}
                className="absolute top-1 right-1 flex size-6 items-center justify-center rounded-full bg-foreground/60 text-white text-md font-bold hover:bg-black/80"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {slots.length === 0 && (
        <p className="text-center text-sm text-foreground/30 py-4">No photos yet</p>
      )}

      <p className="text-xs text-foreground/40">Drag to reorder · First photo is the cover (★)</p>
    </div>
  );
}