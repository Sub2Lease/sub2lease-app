import { z } from "zod";
import { buildApi, item } from "../builder/api";
import { fetchBackend, methodOptions, simpleJson } from "../backends/fetch.ts";
import {
  userSchema,
  loginResponseSchema,
  postSchema,
  postsListSchema,
  photoSchema,
  favoriteMessageSchema,
  createUserInputSchema,
  loginUserInputSchema,
  updateUserProfileInputSchema,
  createPostInputSchema,
  updatePostDetailsInputSchema,
  listPostsInputSchema,
  listPostsByCityInputSchema,
  listPostsByUserInputSchema,
  favoriteInputSchema,
  listFavoritesInputSchema,
} from "./z";

const isClient = typeof window !== "undefined";

const root = isClient ? import.meta.env.VITE_BACKEND_API_ROOT : (process.env.VITE_BACKEND_API_ROOT ?? "");

export const backendApi = buildApi(
  fetchBackend,
  { root },
  {
    // Users

    createUser: item({
      input: createUserInputSchema,
      key: "/users",
      result: userSchema,
      options: [methodOptions.post, simpleJson],
    }),

    loginUser: item({
      input: loginUserInputSchema,
      key: "/users/login",
      result: loginResponseSchema,
      options: [methodOptions.post, simpleJson],
    }),

    getMe: item({
      input: z.void(),
      key: "/users/me",
      result: userSchema,
    }),

    updateMyProfile: item({
      input: updateUserProfileInputSchema,
      key: "/users/me/profile",
      result: userSchema,
      options: [methodOptions.patch, simpleJson],
    }),

    // Posts

    listPosts: item({
      input: listPostsInputSchema,
      key: ({ page_id, page_size }: z.infer<typeof listPostsInputSchema>) =>
        `/posts?page_id=${page_id}&page_size=${page_size}`,
      result: postsListSchema,
    }),

    listActivePosts: item({
      input: listPostsInputSchema,
      key: ({ page_id, page_size }: z.infer<typeof listPostsInputSchema>) =>
        `/posts/active?page_id=${page_id}&page_size=${page_size}`,
      result: postsListSchema,
    }),

    listPostsByCity: item({
      input: listPostsByCityInputSchema,
      key: ({ city, state, page_id, page_size }: z.infer<typeof listPostsByCityInputSchema>) =>
        `/posts/city?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}&page_id=${page_id}&page_size=${page_size}`,
      result: postsListSchema,
    }),

    listPostsByUser: item({
      input: listPostsByUserInputSchema,
      key: ({ user_id, page_id, page_size }: z.infer<typeof listPostsByUserInputSchema>) =>
        `/posts/user?user_id=${user_id}&page_id=${page_id}&page_size=${page_size}`,
      result: postsListSchema,
    }),

    getPostByID: item({
      input: z.object({ id: z.number() }),
      key: ({ id }: { id: number }) => `/posts/${id}`,
      result: postSchema,
    }),

    createPost: item({
      input: createPostInputSchema,
      key: "/posts",
      result: postSchema,
      options: [methodOptions.post, simpleJson],
    }),

    updatePostDetails: item({
      input: z.object({
        id: z.number(),
        body: updatePostDetailsInputSchema,
      }),
      key: ({ id }: { id: number; body: z.infer<typeof updatePostDetailsInputSchema> }) =>
        `/posts/${id}/details`,
      result: postSchema,
      options: [methodOptions.patch, simpleJson],
    }),

    // Photos

    uploadPostPhoto: item({
      input: z.object({
        id: z.number(),
        image: z.instanceof(File),
      }),
      key: ({ id }: { id: number; image: File }) => `/posts/${id}/photos`,
      result: photoSchema,
      options: [methodOptions.post],
    }),

    // Favorites

    addFavorite: item({
      input: favoriteInputSchema,
      key: "/favorites",
      result: favoriteMessageSchema,
      options: [methodOptions.post, simpleJson],
    }),

    removeFavorite: item({
      input: favoriteInputSchema,
      key: "/favorites",
      result: favoriteMessageSchema,
      options: [methodOptions.delete, simpleJson],
    }),

    listFavorites: item({
      input: listFavoritesInputSchema,
      key: ({ page_id, page_size }: z.infer<typeof listFavoritesInputSchema>) =>
        `/favorites?page_id=${page_id}&page_size=${page_size}`,
      result: postsListSchema,
    }),
  },
);