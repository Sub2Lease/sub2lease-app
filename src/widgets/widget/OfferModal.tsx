import { useState } from "react";
import { createOffer } from "@/shared/api/backendGO/endpoints";

interface Props {
  postId: number;
  postTitle: string;
  monthlyRent: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function OfferModal({ postId, postTitle, monthlyRent, onClose, onSuccess }: Props) {
  const originalPrice = parseFloat(monthlyRent);

  const [priceType, setPriceType] = useState<"original" | "custom">("original");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const amount = priceType === "original"
    ? Math.round(originalPrice)
    : Math.round(parseFloat(customAmount));

  const handleSubmit = async () => {
    if (priceType === "custom" && (!customAmount || isNaN(amount) || amount <= 0)) {
      setError("Please enter a valid amount.");
      return;
    }
    if (!startDate) {
      setError("Please select a start date.");
      return;
    }
    if (!endDate) {
      setError("Please select an end date.");
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      setError("End date must be after start date.");
      return;
    }

    setError(null);
    setIsSubmitting(true);
    try {
      await createOffer({
        post_id: postId,
        amount,
        start_date: startDate,
        end_date: endDate,
        message,
      });
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send offer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl mx-4">

        {/* Header */}
        <div className="mb-5">
          <h2 className="text-base font-bold text-foreground">Make an Offer</h2>
          <p className="text-xs text-foreground/50 mt-0.5 truncate">{postTitle}</p>
        </div>

        {/* Price Selection */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wide mb-2">
            Offer Amount
          </p>
          <div className="flex flex-col gap-2">
            <label className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer transition-colors ${
              priceType === "original" ? "border-foreground bg-foreground/5" : "border-foreground/15"
            }`}>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="priceType"
                  checked={priceType === "original"}
                  onChange={() => setPriceType("original")}
                  className="accent-foreground"
                />
                <span className="text-sm font-medium text-foreground">Listed price</span>
              </div>
              <span className="text-sm font-bold text-foreground">${Math.round(originalPrice)}/mo</span>
            </label>

            <label className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer transition-colors ${
              priceType === "custom" ? "border-foreground bg-foreground/5" : "border-foreground/15"
            }`}>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="priceType"
                  checked={priceType === "custom"}
                  onChange={() => setPriceType("custom")}
                  className="accent-foreground"
                />
                <span className="text-sm font-medium text-foreground">Custom amount</span>
              </div>
              {priceType === "custom" ? (
                <div className="flex items-center gap-1">
                  <span className="text-sm text-foreground">$</span>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder={monthlyRent}
                    className="w-24 rounded-lg border border-foreground/20 px-2 py-1 text-sm text-right focus:outline-none focus:border-foreground"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="text-sm text-foreground/50">/mo</span>
                </div>
              ) : (
                <span className="text-xs text-foreground/30">Enter amount</span>
              )}
            </label>
          </div>
        </div>

        {/* Dates */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wide mb-2">
            Lease Dates
          </p>
          <div className="flex gap-2">
            <div className="flex-1">
              <p className="text-xs text-foreground/40 mb-1">Start date</p>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl border border-foreground/15 px-3 py-2 text-sm text-foreground focus:outline-none focus:border-foreground"
              />
            </div>
            <div className="flex-1">
              <p className="text-xs text-foreground/40 mb-1">End date</p>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                className="w-full rounded-xl border border-foreground/15 px-3 py-2 text-sm text-foreground focus:outline-none focus:border-foreground"
              />
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="mb-5">
          <p className="text-xs font-semibold text-foreground/50 uppercase tracking-wide mb-2">
            Message <span className="normal-case font-normal">(optional)</span>
          </p>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Introduce yourself or explain your offer..."
            rows={3}
            className="w-full rounded-xl border border-foreground/15 px-3 py-2 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-foreground resize-none"
          />
        </div>

        {/* Error */}
        {error && (
          <p className="mb-3 text-xs text-red-500">{error}</p>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded-full border border-foreground/20 py-2 text-sm font-medium text-foreground hover:bg-foreground/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 rounded-full bg-foreground py-2 text-sm font-medium text-background hover:opacity-80 transition-opacity disabled:opacity-40"
          >
            {isSubmitting ? "Sending..." : "Send Offer"}
          </button>
        </div>

      </div>
    </div>
  );
}