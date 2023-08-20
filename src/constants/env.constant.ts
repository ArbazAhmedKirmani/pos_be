import { ConfigService } from '@nestjs/config';

const config = new ConfigService();

export const ENV_CONSTANTS = {
  APP: {
    FRONTEND_URL: config.get<string>('FRONTEND_URL'),
    BACKEND_URL: config.get<string>('BACKEND_URL'),
  },
  DEFAULT_PASSWORD: config.get<string>('DEFAULT_PASSWORD'),
  ENCRYPTION: {
    ALGORITHM: config.get<string>('ENCRYPTION_ALGORITHM'),
    PASSWORD: config.get<string>('ENCRYPTION_PASSWORD'),
  },
  JWT: {
    SECRET_KEY: config.get<string>('JWT_SECRET_KEY'),
    ACCESS_EXPIRY: config.get<string>('JWT_ACCESS_EXPIRY'),
    REFRESH_EXPIRY: config.get<string>('JWT_REFRESH_EXPIRY'),
  },
  EMAIL: {
    CONFIG: {
      HOST: config.get<string>('EMAIL_HOST'),
      USER: config.get<string>('EMAIL_USER'),
      PASSWORD: config.get<string>('EMAIL_PASSWORD'),
      FORM: config.get<string>('EMAIL_FROM'),
      PORT: config.get<number>('EMAIL_PORT'),
    },
    TEMPLATES: {
      FORGOT_EMAIL: 'forgot-email',
      SIGNUP_EMAIL: 'signup-email',
    },
  },
  REDIS: {
    HOST: config.get<string>('REDIS_HOST'),
    PORT: config.get<number>('REDIS_PORT'),
  },
  BULL: {
    QUEUE: {
      MAIL: 'QUEUE_MAIL',
      NOTIFICATION: 'QUEUE_NOTIFICATION',
    },
    JOBS: {
      FORGOT_EMAIL: 'FORGOT_EMAIL',
      SEND_NOTIFICATION: 'SEND_NOTIFICATION',
      SIGNUP_EMAIL: 'SIGNUP_EMAIL',
    },
  },
  ONE_SIGNAL: {
    APP_ID: config.get<string>('ONESIGNAL_APP_ID'),
    CLIENT_ID: config.get<string>('ONESIGNAL_CLIENT_ID'),
    API_KEY: config.get<string>('ONESIGNAL_API_KEY'),
  },
  QUERY: {
    TAKE: 10,
    SKIP: 0,
    ORDER_BY: 'desc',
  },
};
