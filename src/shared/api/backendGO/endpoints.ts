import { backendApi } from "./api";
import type {
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
} from "./z.ts";
import type { z } from "zod";

// Users

export const createUser = (input: z.infer<typeof createUserInputSchema>) =>
  backendApi.createUser(input);

export const loginUser = (input: z.infer<typeof loginUserInputSchema>) =>
  backendApi.loginUser(input);

export const getMe = () =>
  backendApi.getMe();

export const updateMyProfile = (input: z.infer<typeof updateUserProfileInputSchema>) =>
  backendApi.updateMyProfile(input);

// Posts

export const listPosts = (input: z.infer<typeof listPostsInputSchema>) =>
  backendApi.listPosts(input);

export const listActivePosts = (input: z.infer<typeof listPostsInputSchema>) =>
  backendApi.listActivePosts(input);

export const listPostsByCity = (input: z.infer<typeof listPostsByCityInputSchema>) =>
  backendApi.listPostsByCity(input);

export const listPostsByUser = (input: z.infer<typeof listPostsByUserInputSchema>) =>
  backendApi.listPostsByUser(input);

export const getPostByID = (id: number) =>
  backendApi.getPostByID({ id });

export const createPost = (input: z.infer<typeof createPostInputSchema>) =>
  backendApi.createPost(input);

export const updatePostDetails = (id: number, body: z.infer<typeof updatePostDetailsInputSchema>) =>
  backendApi.updatePostDetails({ id, body });

export const addPhotoToPost = (post_id: number, photo_url: string) =>
  backendApi.addPhotoToPost({ post_id, photo_url });

export const uploadPostPhoto = (id: number, image: File, order: number = 1) =>
  backendApi.uploadPostPhoto({ id, image, order });

// Favorites

export const addFavorite = (input: z.infer<typeof favoriteInputSchema>) =>
  backendApi.addFavorite(input);

export const removeFavorite = (input: z.infer<typeof favoriteInputSchema>) =>
  backendApi.removeFavorite(input);

export const listFavorites = (input: z.infer<typeof listFavoritesInputSchema>) =>
  backendApi.listFavorites(input);