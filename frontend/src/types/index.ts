export const UserRole = {
  CLIENT: 'client',
  SERVICE: 'service',
} as const;

export type UserRole = typeof UserRole[keyof typeof UserRole];

export const AppointmentStatus = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export type AppointmentStatus = typeof AppointmentStatus[keyof typeof AppointmentStatus];

export const NotificationType = {
  APPOINTMENT: 'appointment',
  REMINDER: 'reminder',
  SYSTEM: 'system',
} as const;

export type NotificationType = typeof NotificationType[keyof typeof NotificationType];

export const NotificationChannel = {
  EMAIL: 'email',
  SMS: 'sms',
  TELEGRAM: 'telegram',
  PUSH: 'push',
} as const;

export type NotificationChannel = typeof NotificationChannel[keyof typeof NotificationChannel];

export interface City {
  id: string;
  name: string;
  country: string;
  hasUsers: boolean;
  hasServices: boolean;
  serviceCount?: number;
  clientCount?: number;
}

// Базовые интерфейсы
export interface BaseEntity {
  id: string;
  createdAt: Date;
}

// Пользователь и профили
export interface ClientProfile extends BaseEntity {
  firstName: string;
  lastName: string;
  user?: User;
  cars?: Car[];
}

export interface ServiceProfile extends BaseEntity {
  name: string;
  address: string;
  description?: string;
  city?: City;
  user?: User;
  services?: Service[];
  masters?: Master[];
}

export interface User extends BaseEntity {
  email: string;
  phone?: string;
  telegramId?: string;
  telegramChatId?: string;
  role: UserRole;
  clientProfile?: ClientProfile;
  serviceProfile?: ServiceProfile;
  notifications?: Notification[];
}

// Автомобили
export interface Car extends BaseEntity {
  make: string;
  model: string;
  year: number;
  vin?: string;
  mileage?: number;
  owner?: ClientProfile;
  appointments?: Appointment[];
}

// Услуги и категории
export interface ServiceCategory extends BaseEntity {
  name: string;
  icon?: string;
  services?: Service[];
}

export interface Service extends BaseEntity {
  name: string;
  description?: string;
  price: number;
  durationMinutes: number;
  availableDates?: string[];
  category?: ServiceCategory;
  serviceProfile?: ServiceProfile;
  appointments?: Appointment[];
}

// Мастера
export interface Master extends BaseEntity {
  firstName: string;
  lastName: string;
  specialization: string;
  experienceYears: number;
  workStartHour: number;
  workEndHour: number;
  serviceProfile?: ServiceProfile;
}

// Записи
export interface Appointment extends BaseEntity {
  startTime: Date;
  endTime: Date;
  status: AppointmentStatus;
  notes?: string;
  cancellationReason?: string;
  updatedAt: Date;
  car?: Car;
  service?: Service;
  master?: Master | null;
}

// Уведомления
export interface Notification extends BaseEntity {
  type: NotificationType;
  channel: NotificationChannel;
  title: string;
  content: string;
  isRead: boolean;
  isSent: boolean;
  metadata?: Record<string, unknown>;
  recipient?: User;
}

// DTO для API
export interface CreateAppointmentDto {
  carId: string;
  serviceId: string;
  startTime: Date;
  masterId?: string;
  notes?: string;
}

export interface UpdateAppointmentDto {
  status?: AppointmentStatus;
  masterId?: string | null;
  notes?: string;
  cancellationReason?: string;
}

export interface CreateCarDto {
  make: string;
  model: string;
  year: number;
  vin?: string;
  mileage?: number;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterClientDto {
  email: string;
  password: string;
  phone?: string;
  firstName: string;
  lastName: string;
}

export interface RegisterServiceDto {
  email: string;
  password: string;
  phone?: string;
  serviceName: string;
  address: string;
  description?: string;
}

// Ответы API
export interface TimeSlot {
  startTime: Date;
  endTime: Date;
  available: boolean;
}

export interface ServiceWithCategory extends Service {
  category: ServiceCategory;
}

export interface AppointmentDetails extends Appointment {
  car: Car;
  service: ServiceWithCategory;
  master?: Master;
}
