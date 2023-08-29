import {
  BranchType,
  BusinessType,
  UserRole,
  companySettings,
} from '@prisma/client';

export interface LoginResponse {
  userId: number;
  fullname: string;
  email: string;
  role: UserRole;
  branch: Array<{
    branchId: number;
    branchName: string;
    type: BranchType;
  }>;
  company: {
    companyId: number;
    businessType: BusinessType;
    companySettings: Array<
      Omit<
        companySettings,
        'companyId' | 'companySettingId' | 'createdAt' | 'updatedAt'
      >
    >;
  };
  access_token: string;
  refresh_token: string;
  notifications: { new_notification: number; new_order: number };
  message?: string;
}
