import { backendHooks } from "@/shared/api/backendGO/hooks";

export function useListings(page_num: number = 1) {
  const { data: posts = [] } = backendHooks.useActivePosts({ page_id: page_num, page_size: 100 });
  
  const postsWithPhotos = posts.map(post => {
    const { data: photos = [] } = backendHooks.usePhotosByPostID({ post_id: post.id });
    const sortedPhotos = photos.map((p) => ({ order: p.order, photo_url: p.photo_url })).sort((a, b) => a.order - b.order);
    return { ...post, photos: sortedPhotos };
  });

  return postsWithPhotos;
}
