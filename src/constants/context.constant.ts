import { AppConfig } from '../config/app.config';

export const CONTEXT_CONSTANT = {
  FORGOT_EMAIL: (context: any) => {
    let obj = {
      subject: 'Your POS password reset request',
      template: AppConfig.EMAIL.TEMPLATES.FORGOT_EMAIL,
      context: {
        fullname: context.fullname,
        url: `${AppConfig.APP.FRONTEND_URL}/auth/reset-password/${context.userId}`,
      },
    };
    return obj;
  },

  SIGNUP_EMAIL: (context: any) => {
    let obj = {
      subject: 'You have sccessfully Signed Up',
      template: AppConfig.EMAIL.TEMPLATES.SIGNUP_EMAIL,
      context: {
        fullname: context.fullname,
        url: `${AppConfig.APP.FRONTEND_URL}/reset-password/${context.userId}`,
      },
    };
    return obj;
  },
};
