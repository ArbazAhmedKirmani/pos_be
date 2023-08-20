import { Injectable } from '@nestjs/common';
import * as OneSignal from 'onesignal-node';

@Injectable()
export class NotificationService {
  private client: OneSignal.Client;

  constructor() {
    // this.client = new OneSignal.Client({
    //   userAuthKey: 'YOUR_USER_AUTH_KEY',
    //   app: { appAuthKey: 'YOUR_APP_AUTH_KEY', appId: 'YOUR_APP_ID' },
    // });
  }

  async sendPushNotification() {}
}
