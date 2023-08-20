import {
  BranchType,
  BusinessType,
  CompanySetttings,
  UserRole,
} from '@prisma/client';

export interface Branch {
  branchId: number;
  branchName: string;
}

export interface AuthUser {
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
    companySettings: Array<{ setting: CompanySetttings; value: string }>;
  };
}
