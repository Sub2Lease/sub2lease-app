import { useMemo } from "react";
import { useState } from "react";
import { backendHooks } from "@/shared/api/backendGO/hooks";
import { addFavorite, removeFavorite } from "@/shared/api/backendGO/endpoints";

export function useFavorites() {
  const {
    data: posts = [],
    isLoading,
    isError,
    refetch,
  } = backendHooks.useFavorites({
    page_id: 1,
    page_size: 100,
  });

  // Derive base set from server data
  const serverIds = useMemo(() => new Set(posts.map((p) => p.id)), [posts]);

  // Local overrides for optimistic updates
  const [localIds, setLocalIds] = useState<Set<number>>(new Set());
  const [removedIds, setRemovedIds] = useState<Set<number>>(new Set());

  const favoriteIds = useMemo(() => {
    const result = new Set([...serverIds, ...localIds]);
    removedIds.forEach((id) => result.delete(id));
    return result;
  }, [serverIds, localIds, removedIds]);

  const toggle = async (postId: number) => {
    const isFaved = favoriteIds.has(postId);

    // Optimistic update
    if (isFaved) {
      setRemovedIds((prev) => new Set([...prev, postId]));
      setLocalIds((prev) => { const n = new Set(prev); n.delete(postId); return n; });
    } else {
      setLocalIds((prev) => new Set([...prev, postId]));
      setRemovedIds((prev) => { const n = new Set(prev); n.delete(postId); return n; });
    }

    try {
      if (isFaved) {
        await removeFavorite({ post_id: postId });
      } else {
        await addFavorite({ post_id: postId });
      }
      refetch();
    } catch {
      // Revert on failure
      if (isFaved) {
        setRemovedIds((prev) => { const n = new Set(prev); n.delete(postId); return n; });
      } else {
        setLocalIds((prev) => { const n = new Set(prev); n.delete(postId); return n; });
      }
    }
  };

  return { posts, favoriteIds, toggle, isLoading, isError };
}