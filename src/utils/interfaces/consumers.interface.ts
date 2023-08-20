import { NotificationType } from '@prisma/client';

export interface ForgotEmailProcess {
  email: string;
  userId: number;
}

export interface NotificationProcess {
  notificationType: NotificationType;
  device: string;
  message: string;
  header?: string;
  subject?: string;
  userId?: number;
  image?: string;
  idOrRoute?: string | number;
}
