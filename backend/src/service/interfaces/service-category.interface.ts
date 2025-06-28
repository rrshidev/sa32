export interface ServiceCategory {
  id: string;
  name: string;
  icon?: string;
  servicesCount?: number; // Опциональное поле для агрегации
}
