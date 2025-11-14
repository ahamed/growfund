import { growfundConfig } from '@/config/growfund';

export type UserRole = 'administrator' | 'gf_fundraiser' | 'gf_donor' | 'gf_backer';

const isMatchedSpecificRole = (role: UserRole) => {
  return growfundConfig.user_role === role;
};

export const User = {
  isFundraiser: () => isMatchedSpecificRole('gf_fundraiser'),
  isAdmin: () => isMatchedSpecificRole('administrator'),
  isDonor: () => isMatchedSpecificRole('gf_donor'),
  isBacker: () => isMatchedSpecificRole('gf_backer'),
  role: growfundConfig.user_role as UserRole,
} as const;
