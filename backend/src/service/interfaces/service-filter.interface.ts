export interface ServiceFilter {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  searchQuery?: string;
  limit?: number;
  offset?: number;
}
