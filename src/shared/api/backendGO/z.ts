import { z } from "zod";

// User

export const userSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  username: z.string(),
  email: z.string().email(),
  phone: z.string().nullable().optional(),
  profile_photo_url: z.string().nullable().optional(),
});

export const loginResponseSchema = z.object({
  access_token: z.string(),
  user: userSchema,
});

export const createUserInputSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  username: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(8).max(30),
  profile_photo_url: z.string().optional(),
});

export const loginUserInputSchema = z.object({
  identifier: z.string(),
  password: z.string().min(6),
});

export const updateUserProfileInputSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  username: z.string().optional(),
  phone: z.string().optional(),
  profile_photo_url: z.string().optional(),
});

// Post

export const postSchema = z.object({
  id: z.number(),
  user_id: z.number().nullable().optional(),
  title: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  zipcode: z.string(),
  description: z.string(),
  property_type: z.string(),
  listing_type: z.string(),
  poster_role: z.string(),
  furnished: z.boolean(),
  total_bedroom_count: z.number(),
  rooms_available: z.number(),
  bathrooms: z.number(),
  monthly_rent: z.string(),
  security_deposit: z.string().nullable().optional(),
  start_date: z.string(),
  end_date: z.string(),
  property_website: z.string().nullable().optional(),
  amenities: z.string().nullable().optional(),
  house_rules: z.string().nullable().optional(),
  status: z.string(),
});

export const postsListSchema = z.array(postSchema);

export const createPostInputSchema = z.object({
  title: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  zipcode: z.string(),
  description: z.string(),
  property_type: z.string(),
  listing_type: z.string(),
  poster_role: z.string(),
  furnished: z.boolean(),
  total_bedroom_count: z.number(),
  rooms_available: z.number(),
  bathrooms: z.number(),
  monthly_rent: z.string(),
  security_deposit: z.number().optional(),
  start_date: z.string(), // YYYY-MM-DD
  end_date: z.string(),   // YYYY-MM-DD
  property_website: z.string().optional(),
  amenities: z.string().optional(),
  house_rules: z.string().optional(),
  status: z.string(),
});

export const updatePostDetailsInputSchema = z.object({
  description: z.string().optional(),
  furnished: z.boolean().optional(),
  rooms_available: z.number().optional(),
  monthly_rent: z.string().optional(),
  security_deposit: z.string().optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  property_website: z.string().optional(),
  title: z.string().optional(),
  amenities: z.string().optional(),
  house_rules: z.string().optional(),
});

export const listPostsInputSchema = z.object({
  page_id: z.number().min(1),
  page_size: z.number().min(5).max(100),
});

export const listPostsByCityInputSchema = z.object({
  city: z.string(),
  state: z.string(),
  page_id: z.number().min(1),
  page_size: z.number().min(5).max(100),
});

export const listPostsByUserInputSchema = z.object({
  user_id: z.number(),
  page_id: z.number().min(1),
  page_size: z.number().min(5).max(100),
});

// Photo

export const photoSchema = z.object({
  id: z.number(),
  post_id: z.number().nullable().optional(),
  photo_url: z.string(),
});

// Favorites

export const favoriteInputSchema = z.object({
  post_id: z.number(),
});

export const favoriteMessageSchema = z.object({
  message: z.string(),
});

export const listFavoritesInputSchema = z.object({
  page_id: z.number().min(1),
  page_size: z.number().min(5).max(100),
});

// Supabase

export const addPhotoInputSchema = z.object({
    post_id: z.number(),
    photo_url: z.string().url(),
});