export interface ServiceFilter {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  searchQuery?: string;
  limit?: number;
  offset?: number;
  dateAt?: string; // ISO date string
  dateTo?: string; // ISO date string
  cityId?: string; // City ID for filtering
}
