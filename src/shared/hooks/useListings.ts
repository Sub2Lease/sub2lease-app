import { backendHooks } from "@/shared/api/backendGO/hooks";
import { useQueries } from "@tanstack/react-query";
import { backendApi } from "@/shared/api/backendGO/api";
import { ms } from "@/shared/utils";

export function useListings(page_num: number = 1) {
  const { data: posts = [], isLoading, refetch: refetchListings } = backendHooks.useActivePosts({ page_id: page_num, page_size: 100 });

  const photoResults = useQueries({
    queries: posts.map((post) => ({
      queryKey: ["usePhotosByPostID", post.id],
      queryFn: () => backendApi.getPostPhotos({ post_id: post.id }),
      enabled: !!post.id,
      refetchInterval: ms.mins(5),
      refetchOnMount: "always" as const,
    })),
  });

  const listings = posts.map((post, i) => {
    const photos = photoResults[i]?.data ?? [];
    const sortedPhotos = [...photos]
      .sort((a, b) => a.order - b.order)
      .map(({ photo_url }) => photo_url);
    return { ...post, photos: sortedPhotos };
  });

  const getListingById = (id: string) => {
    if (!listings) return null;
    return listings.find((listing) => String(listing.id) === id);
  };

  return {
    listings,
    isLoading,
    getListingById,
    refetchListings,
  };
}