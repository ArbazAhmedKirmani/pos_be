import { ENV_CONSTANTS } from './env.constant';

export const CONTEXT_CONSTANT = {
  FORGOT_EMAIL: (context: any) => {
    let obj = {
      subject: 'Your POS password reset request',
      template: ENV_CONSTANTS.EMAIL.TEMPLATES.FORGOT_EMAIL,
      context: {
        name: context.name,
        url: context.url,
        email: context.email,
      },
    };
    return obj;
  },
  SIGNUP_EMAIL: (context: any) => {
    let obj = {
      subject: 'You have sccessfully Signed Up',
      template: ENV_CONSTANTS.EMAIL.TEMPLATES.SIGNUP_EMAIL,
      context: {
        name: context.fullname,
        email: context.email,
        companyName: context.companyName,
      },
    };
    return obj;
  },
};
