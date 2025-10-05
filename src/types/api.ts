// API Response types
export interface APIError {
  error: true;
  message: string;
  code: string;
}

export interface AuthUser {
  id: number;
  username: string;
  role: string;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  message: string;
  user: AuthUser;
}

// Model types
export interface Carousel {
  id: number;
  title: string;
  title_id: string;
  subtitle: string;
  subtitle_id: string;
  image_url: string;
  thumbnail_url?: string;
  alt_text: string;
  alt_text_id: string;
  carousel_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SellingPoint {
  id: number;
  title: string;
  title_id: string;
  description: string;
  description_id: string;
  image_url: string;
  thumbnail_url?: string;
  pillar_color: string;
  text_color: string;
  selling_point_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Attraction {
  id: string;
  title: string;
  short_description: string;
  full_description: string;
  image_url: string;
  highlights: string[];
  duration: string;
  difficulty: string;
  price_range: string;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface Pricing {
  id: number;
  type: string;
  title: string;
  subtitle: string;
  adult_price: number;
  infant_price: number;
  currency: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: number;
  title: string;
  description: string;
  vision_title: string;
  vision_content: string;
  mission_title: string;
  mission_content: string;
  objectives_title: string;
  objectives_content: string;
  featured_images: any[];
  created_at: string;
  updated_at: string;
}

export interface Destination {
  id: number;
  name: string;
  description: string;
  image_url: string;
  location: string;
  created_at: string;
  updated_at: string;
}

export interface GalleryCategory {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface GalleryImage {
  id: number;
  category_id: number;
  title: string;
  description: string;
  image_url: string;
  thumbnail_url: string;
  alt_text: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface RegulationCategory {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Regulation {
  id: number;
  category_id: number;
  title: string;
  content: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Facility {
  id: number;
  name: string;
  description: string;
  image_url: string;
  price_per_day: number;
  max_capacity: number;
  amenities: string[];
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: number;
  facility_id: number;
  name: string;
  email: string;
  phone: string;
  start_date: string;
  end_date: string;
  guests: number;
  status: string;
  special_requests: string;
  created_at: string;
  updated_at: string;
  facility?: Facility;
}

export interface NewsCategory {
  id: number;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
}

export interface NewsArticle {
  id: number;
  category_id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  author: string;
  published_at: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  admin_notes: string;
  created_at: string;
  updated_at: string;
}

export interface UploadResponse {
  success: boolean;
  file_url: string;
  thumbnail_url: string;
  file_size: number;
  dimensions?: {
    width: number;
    height: number;
  };
}
