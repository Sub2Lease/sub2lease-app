export interface Listing {
  title: string;
  monthly_rent: string;
  address: string;
  photos: { photo_url: string; order: number }[];
}