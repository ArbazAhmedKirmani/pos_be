import { CompanySetttings } from '@prisma/client';

export const Default_Company_Settings: Array<{
  setting: CompanySetttings;
  value: string;
}> = [
  {
    setting: CompanySetttings.ADVANCE_REPORTING,
    value: 'false',
  },
  {
    setting: CompanySetttings.ALLOW_DYNAMIC_RECEIPT,
    value: 'false',
  },
  {
    setting: CompanySetttings.ALLOW_FINANCE,
    value: 'false',
  },
  {
    setting: CompanySetttings.ALLOW_INVENTORY,
    value: 'false',
  },
  {
    setting: CompanySetttings.ALLOW_KDS,
    value: 'false',
  },
  {
    setting: CompanySetttings.ALLOW_MULTI_PRINTING,
    value: 'false',
  },
  {
    setting: CompanySetttings.ALLOW_POS,
    value: 'true',
  },
  {
    setting: CompanySetttings.NUMBER_OF_ACTIVE_USERS,
    value: '2',
  },
  {
    setting: CompanySetttings.NUMBER_OF_USERS,
    value: '5',
  },
];
