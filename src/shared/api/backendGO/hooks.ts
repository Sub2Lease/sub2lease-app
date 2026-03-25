import { buildHooks, item } from "../builder/hooks";
import { backendApi } from "./api";
import { ms } from "@/shared/utils";
import type { z } from "zod";
import type {
  listPostsInputSchema,
  listPostsByCityInputSchema,
  listPostsByUserInputSchema,
  listFavoritesInputSchema,
} from "./z";

export const backendHooks = buildHooks(
  {
    // Users

    useMe: item({
      fn: backendApi.getMe,
      key: () => ["useMe"],
      options: () => ({ refetchOnMount: "always" }),
    }),

    // Posts

    usePosts: item({
      fn: backendApi.listPosts,
      key: (params: z.infer<typeof listPostsInputSchema>) => ["usePosts", params],
      options: (params: z.infer<typeof listPostsInputSchema>) => ({
        enabled: !!params,
        refetchOnMount: "always" as const,
      }),
    }),

    useActivePosts: item({
      fn: backendApi.listActivePosts,
      key: (params: z.infer<typeof listPostsInputSchema>) => ["useActivePosts", params],
      options: (params: z.infer<typeof listPostsInputSchema>) => ({
        enabled: !!params,
        refetchOnMount: "always" as const,
      }),
    }),

    usePostsByCity: item({
      fn: backendApi.listPostsByCity,
      key: (params: z.infer<typeof listPostsByCityInputSchema>) => ["usePostsByCity", params],
      options: (params: z.infer<typeof listPostsByCityInputSchema>) => ({
        enabled: !!params?.city && !!params?.state,
        refetchOnMount: "always" as const,
      }),
    }),

    usePostsByUser: item({
      fn: backendApi.listPostsByUser,
      key: (params: z.infer<typeof listPostsByUserInputSchema>) => ["usePostsByUser", params],
      options: (params: z.infer<typeof listPostsByUserInputSchema>) => ({
        enabled: !!params?.user_id,
        refetchOnMount: "always" as const,
      }),
    }),

    usePostByID: item({
      fn: backendApi.getPostByID,
      key: ({ id }: { id: number }) => ["usePostByID", id],
      options: ({ id }: { id: number }) => ({
        enabled: !!id,
        refetchOnMount: "always" as const,
      }),
    }),

    usePhotosByPostID: item({
      fn: backendApi.getPostPhotos,
      key: ({ post_id }: { post_id?: number }) => ["usePhotosByPostID", post_id],
      options: ({ post_id }: { post_id?: number }) => ({
        enabled: post_id !== undefined,
        refetchOnMount: "always" as const,
      }),
    }),

    useMyOffers: item({
      fn: backendApi.listMyOffers,
      key: () => ["useMyOffers"],
      options: () => ({
        refetchOnMount: "always" as const,
      }),
    }),

    useOffersByPost: item({
      fn: backendApi.listOffersByPost,
      key: ({ id }: { id: number }) => ["useOffersByPost", id],
      options: ({ id }: { id: number }) => ({
        enabled: !!id,
        refetchOnMount: "always" as const,
      }),
    }),

    // Favorites

    useFavorites: item({
      fn: backendApi.listFavorites,
      key: (params: z.infer<typeof listFavoritesInputSchema>) => ["useFavorites", params],
      options: (params: z.infer<typeof listFavoritesInputSchema>) => ({
        enabled: !!params,
        refetchOnMount: "always" as const,
      }),
    }),

    // Messages

    useUserById: item({
      fn: backendApi.getUserById,
      key: ({ id }: { id: number }) => ["useUserById", id],
      options: ({ id }: { id: number }) => ({
        enabled: !!id,
        refetchOnMount: "always" as const,
      }),
    }),

    useConversation: item({
      fn: backendApi.getConversation,
      key: ({ user_id }: { user_id: number }) => ["useConversation", user_id],
      options: ({ user_id }: { user_id: number }) => ({
        enabled: !!user_id,
        refetchOnMount: "always" as const,
      }),
    }),
  },
  {
    refetchInterval: ms.mins(5),
  },
);