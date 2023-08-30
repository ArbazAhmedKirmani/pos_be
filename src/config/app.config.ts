export const AppConfig = {
  APP: {
    FRONTEND_URL: process.env.FRONTEND_URL,
    BACKEND_URL: process.env.BACKEND_URL,
    PORT: process.env.APP_PORT,
    DEBUG: true,
  },
  DEFAULT_PASSWORD: process.env.DEFAULT_PASSWORD,
  ENCRYPTION: {
    ALGORITHM: process.env.ENCRYPTION_ALGORITHM,
    PASSWORD: process.env.ENCRYPTION_PASSWORD,
  },
  JWT: {
    SECRET_KEY: process.env.JWT_SECRET_KEY,
    ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY,
    REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY,
  },
  EMAIL: {
    CONFIG: {
      HOST: process.env.EMAIL_HOST,
      USER: process.env.EMAIL_USER,
      PASSWORD: process.env.EMAIL_PASSWORD,
      FORM: process.env.EMAIL_FROM,
      PORT: Number(process.env.EMAIL_PORT),
    },
    TEMPLATES: {
      FORGOT_EMAIL: 'forgot-email',
      SIGNUP_EMAIL: 'signup-email',
    },
  },
  REDIS: {
    HOST: process.env.REDIS_HOST,
    PORT: Number(process.env.REDIS_PORT),
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
    APP_ID: process.env.ONESIGNAL_APP_ID,
    CLIENT_ID: process.env.ONESIGNAL_CLIENT_ID,
    API_KEY: process.env.ONESIGNAL_API_KEY,
  },
  QUERY: {
    TAKE: 10,
    SKIP: 0,
    ORDER_BY: 'desc',
  },
  I18N: {
    FALLBACK_LANG: 'en',
  },
};
