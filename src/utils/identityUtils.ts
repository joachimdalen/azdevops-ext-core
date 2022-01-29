import * as DevOps from 'azure-devops-extension-sdk';

import { IInternalIdentity } from '..';

export const isSameIdentity = (first: IInternalIdentity, second: IInternalIdentity): boolean => {
  if (first.id === second.id) return true;
  if (first.descriptor !== undefined && second.descriptor !== undefined) {
    if (first.descriptor === second.descriptor) return true;
  }
  return false;
};

export const isLoggedInUser = (identity: IInternalIdentity): boolean => {
  const loggedIn = DevOps.getUser();

  if (identity.id === loggedIn.id) return true;
  if (identity.descriptor !== undefined && loggedIn.descriptor !== undefined) {
    if (identity.descriptor === loggedIn.descriptor) return true;
  }
  return false;
};
