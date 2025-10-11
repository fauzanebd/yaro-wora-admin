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

export interface WhyVisit {
  id: number;
  title: string;
  title_id: string;
  description: string;
  description_id: string;
  icon_url: string;
  created_at: string;
  updated_at: string;
}

export interface WhyVisitContent {
  why_visit_section_title_part_1: string;
  why_visit_section_title_part_2: string;
  why_visit_section_title_part_1_id: string;
  why_visit_section_title_part_2_id: string;
  why_visit_section_description: string;
  why_visit_section_description_id: string;
}

export interface Attraction {
  id: number;
  title: string;
  title_id: string;
  subtitle?: string;
  subtitle_id?: string;
  description?: string;
  description_id?: string;
  image_url: string;
  highlights: string[];
  highlights_id: string[];
  sort_order: number;
  active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface GeneralAttractionContent {
  attraction_section_title_part_1: string;
  attraction_section_title_part_2: string;
  attraction_section_title_part_1_id: string;
  attraction_section_title_part_2_id: string;
  attraction_section_description: string;
  attraction_section_description_id: string;
}

export interface Pricing {
  type: string;
  title: string;
  title_id: string;
  subtitle: string;
  subtitle_id: string;
  adult_price: number;
  infant_price: number;
  currency: string;
  description: string;
  image_url?: string;
  thumbnail_url?: string;
  color?: string;
  start_gradient_color?: string;
  end_gradient_color?: string;
  created_at: string;
  updated_at: string;
}

export interface GeneralPricingContent {
  general_pricing_section_title_part_1: string;
  general_pricing_section_title_part_2: string;
  general_pricing_section_title_part_1_id: string;
  general_pricing_section_title_part_2_id: string;
  general_pricing_section_description: string;
  general_pricing_section_description_id: string;
}

export interface ProfileSection {
  title: string;
  title_id: string;
  content: string;
  content_id: string;
  image_url?: string;
}

export interface ProfilePageContent {
  title: string;
  title_id: string;
  header_image_url: string;
  subtitle: string;
  subtitle_id: string;
  brief_section_title: string;
  brief_section_title_id: string;
  brief_section_content: string;
  brief_section_content_id: string;
  brief_section_image_url?: string;
  profile_sections: ProfileSection[];
  cta_section_title: string;
  cta_section_title_id: string;
  cta_section_text: string;
  cta_section_text_id: string;
  cta_section_button_text: string;
  cta_section_button_text_id: string;
  cta_section_button_url: string;
}

export interface DestinationDetailSection {
  title: string;
  title_id: string;
  content: string;
  content_id: string;
  image_url: string;
}

export interface Destination {
  id: number;
  title: string;
  title_id: string;
  short_description: string;
  short_description_id: string;
  about: string;
  about_id: string;
  image_url: string;
  thumbnail_url?: string;
  destination_detail_sections: DestinationDetailSection[];
  highlights: string[];
  highlights_id: string[];
  cta_url: string;
  google_maps_url: string;
  is_featured: boolean;
  sort_order: number;
  category_id: number;
  destination_category?: DestinationCategory;
  created_at: string;
  updated_at: string;
}

export interface DestinationSummary {
  id: number;
  title: string;
  title_id: string;
  short_description: string;
  short_description_id: string;
  image_url: string;
  thumbnail_url?: string;
  highlights: string[];
  highlights_id: string[];
  is_featured: boolean;
  sort_order: number;
  category_id: number;
  destination_category?: DestinationCategory;
}

export interface DestinationPageContent {
  hero_image_url: string;
  hero_image_thumbnail_url?: string;
  title: string;
  title_id: string;
  subtitle: string;
  subtitle_id: string;
  featured_destination_title: string;
  featured_destination_title_id: string;
  featured_destination_description: string;
  featured_destination_description_id: string;
  other_destinations_title: string;
  other_destinations_title_id: string;
  other_destinations_description: string;
  other_destinations_description_id: string;
  cta_title: string;
  cta_title_id: string;
  cta_description: string;
  cta_description_id: string;
  cta_button_text: string;
  cta_button_text_id: string;
  cta_button_url: string;
}

export interface DestinationCategory {
  id?: number;
  name: string;
  name_id: string;
  description: string;
  description_id: string;
}

export interface PaginationMeta {
  current_page: number;
  per_page: number;
  total_pages: number;
  has_next: boolean;
  has_previous: boolean;
}

export interface DestinationsMeta {
  total: number;
  categories: DestinationCategory[];
  pagination: PaginationMeta;
}

export interface GalleryCategory {
  id: number;
  name: string;
  name_id: string;
  description: string;
  description_id: string;
  count?: number;
}

export interface GalleryImageSummary {
  id: number;
  title: string;
  title_id: string;
  short_description: string;
  short_description_id: string;
  image_url: string;
  thumbnail_url: string;
  category_id: number;
  gallery_category: GalleryCategory;
  date_uploaded: string;
}

export interface GalleryImage {
  id: number;
  title: string;
  title_id: string;
  short_description: string;
  short_description_id: string;
  description: string;
  description_id: string;
  image_url: string;
  thumbnail_url: string;
  category_id: number;
  gallery_category: GalleryCategory;
  photographer: string;
  location: string;
  tags: string[];
  tags_id: string[];
  date_uploaded: string;
}

export interface GalleryPageContent {
  hero_image_url: string;
  hero_image_thumbnail_url?: string;
  title: string;
  title_id: string;
  subtitle: string;
  subtitle_id: string;
}

export interface GalleryMeta {
  total_categories: number;
  total_images: number;
}

export interface RegulationCategory {
  id: number;
  name: string;
  name_id: string;
  description: string;
  description_id: string;
  count: number;
  created_at: string;
  updated_at: string;
}

export interface Regulation {
  id: number;
  category_id: number;
  regulation_category: RegulationCategory;
  question: string;
  question_id: string;
  answer: string;
  answer_id: string;
  created_at: string;
  updated_at: string;
}

export interface RegulationPageContent {
  hero_image_url: string;
  hero_image_thumbnail_url?: string;
  title: string;
  title_id: string;
  subtitle: string;
  subtitle_id: string;
  cta_title: string;
  cta_title_id: string;
  cta_description: string;
  cta_description_id: string;
  cta_button_text: string;
  cta_button_text_id: string;
  cta_button_url: string;
}

export interface RegulationsMeta {
  total_categories: number;
  total_regulations: number;
}

export interface FacilityDetailSection {
  title: string;
  title_id: string;
  content: string;
  content_id: string;
  image_url: string;
}

export interface FacilityCategory {
  id: number;
  name: string;
  name_id: string;
  description: string;
  description_id: string;
  count: number;
}

export interface FacilitySummary {
  id: number;
  name: string;
  name_id: string;
  short_description: string;
  short_description_id: string;
  image_url: string;
  thumbnail_url?: string;
  highlights: string[];
  highlights_id: string[];
  is_featured: boolean;
  sort_order: number;
  category_id: number;
  facility_category?: FacilityCategory;
  duration: string;
  capacity: string;
  price: string;
  duration_id: string;
  capacity_id: string;
  price_id: string;
}

export interface Facility {
  id: number;
  name: string;
  name_id: string;
  short_description: string;
  short_description_id: string;
  description: string;
  description_id: string;
  image_url: string;
  thumbnail_url?: string;
  category_id: number;
  facility_category?: FacilityCategory;
  facility_detail_sections: FacilityDetailSection[];
  highlights: string[];
  highlights_id: string[];
  duration: string;
  capacity: string;
  price: string;
  duration_id: string;
  capacity_id: string;
  price_id: string;
  cta_url: string;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface FacilityPageContent {
  hero_image_url: string;
  hero_image_thumbnail_url?: string;
  title: string;
  title_id: string;
  subtitle: string;
  subtitle_id: string;
  facilities_list_section_title: string;
  facilities_list_section_title_id: string;
  facilities_list_section_description: string;
  facilities_list_section_description_id: string;
  cta_title: string;
  cta_title_id: string;
  cta_description: string;
  cta_description_id: string;
  cta_button_text: string;
  cta_button_text_id: string;
  cta_button_url: string;
}

export interface FacilitiesMeta {
  total_categories: number;
  total_facilities: number;
  pagination: PaginationMeta;
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
  name_id: string;
  description: string;
  description_id: string;
  count: number;
}

export interface NewsAuthor {
  id: number;
  name: string;
  avatar: string;
  count: number;
}

export interface NewsArticleSummary {
  id: number;
  title: string;
  title_id: string;
  excerpt: string;
  excerpt_id: string;
  author_id: number;
  news_author: NewsAuthor;
  date_published: string;
  category_id: number;
  news_category: NewsCategory;
  image_url: string;
  tags: string[];
  read_time: number;
  is_headline: boolean;
}

export interface NewsArticle {
  id: number;
  title: string;
  title_id: string;
  excerpt: string;
  excerpt_id: string;
  content: string;
  content_id: string;
  image_url: string;
  date_published: string;
  author_id: number;
  category_id: number;
  tags: string[];
  read_time: number;
  is_headline: boolean;
  news_author?: NewsAuthor;
  news_category?: NewsCategory;
  created_at: string;
  updated_at: string;
}

export interface NewsPageContent {
  id: number;
  hero_image_url: string;
  hero_image_thumbnail_url?: string;
  title: string;
  title_id: string;
  subtitle: string;
  subtitle_id: string;
  highlight_section_title: string;
  highlight_section_title_id: string;
  created_at: string;
  updated_at: string;
}

export interface NewsMeta {
  total: number;
  categories: NewsCategory[];
  authors: NewsAuthor[];
  pagination: PaginationMeta;
}

export interface NewsCategoriesMeta {
  total_categories: number;
  total_news: number;
}

export interface NewsAuthorsMeta {
  total_authors: number;
  total_news: number;
}

export interface SocialMedia {
  name: string;
  handle: string;
  url: string;
  icon_url: string;
}

export interface ContactInfo {
  address_part_1: string;
  address_part_1_id: string;
  address_part_2: string;
  address_part_2_id: string;
  latitude: number;
  longitude: number;
  phones: string[];
  emails: string[];
  social_media: SocialMedia[];
  plan_your_visit_url: string;
}

export interface ContactContent {
  contact_section_title_part_1: string;
  contact_section_title_part_1_id: string;
  contact_section_title_part_2: string;
  contact_section_title_part_2_id: string;
  contact_section_description: string;
  contact_section_description_id: string;
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

// Heritage types
export interface HeritageDetailSection {
  title: string;
  title_id: string;
  content: string;
  content_id: string;
  image_url?: string;
}

export interface HeritageSummary {
  id: number;
  title: string;
  title_id: string;
  short_description: string;
  short_description_id: string;
  image_url: string;
  thumbnail_url?: string;
  sort_order: number;
}

export interface Heritage {
  id: number;
  title: string;
  title_id: string;
  short_description: string;
  short_description_id: string;
  description: string;
  description_id: string;
  image_url: string;
  thumbnail_url?: string;
  heritage_detail_sections: HeritageDetailSection[];
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface HeritagePageContent {
  id: number;
  hero_image_url: string;
  hero_image_thumbnail_url?: string;
  title: string;
  title_id: string;
  subtitle: string;
  subtitle_id: string;
  main_section_title: string;
  main_section_title_id: string;
  main_section_description: string;
  main_section_description_id: string;
  cta_title: string;
  cta_title_id: string;
  cta_description: string;
  cta_description_id: string;
  cta_button_text: string;
  cta_button_text_id: string;
  cta_button_url: string;
}

// Storage Analytics types
export interface StorageAnalytics {
  total_size_bytes: number;
  total_size_mb: number;
  total_size_gb: number;
  object_count: number;
  storage_limit_bytes: number;
  storage_limit_gb: number;
  usage_percent: number;
  can_upload: boolean;
  remaining_bytes: number;
  remaining_mb: number;
}

export interface StorageAnalyticsResponse {
  success: boolean;
  data: StorageAnalytics;
}

// Visitor Analytics types
export interface VisitorAnalytics {
  total_visitors: number;
  unique_visitors: number;
  today_visitors: number;
  this_week_visitors: number;
  this_month_visitors: number;
  top_pages: Array<{
    page: string;
    count: number;
  }>;
  top_countries: Array<{
    country: string;
    count: number;
  }>;
  top_devices: Array<{
    device: string;
    count: number;
  }>;
  top_browsers: Array<{
    browser: string;
    count: number;
  }>;
  hourly_stats: Array<{
    hour: number;
    count: number;
  }>;
  daily_stats: Array<{
    date: string;
    count: number;
  }>;
  weekly_stats: Array<{
    week: string;
    count: number;
  }>;
  monthly_stats: Array<{
    month: string;
    count: number;
  }>;
}

export interface VisitorAnalyticsResponse {
  success: boolean;
  data: VisitorAnalytics;
  period: string;
}

// Visitor tracking types
export interface VisitorTrackResponse {
  success: boolean;
  session_id: string;
  is_unique: boolean;
  message: string;
}
