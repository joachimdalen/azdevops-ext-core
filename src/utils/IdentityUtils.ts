import { IVssIdentityService } from 'azure-devops-extension-api/Identities';
import * as DevOps from 'azure-devops-extension-sdk';
import { IIdentity } from 'azure-devops-ui/IdentityPicker';

import { IInternalIdentity, IInternalIdentityType } from '../CommonTypes';

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

export const getLoggedInUser = async (): Promise<IInternalIdentity | undefined> => {
  const loggedIn = DevOps.getUser();
  const client = await DevOps.getService<IVssIdentityService>('ms.vss-features.identity-service');

  const identityResult = await client.searchIdentitiesAsync(
    loggedIn.id,
    ['user'],
    ['ims', 'source'],
    'uid'
  );

  if (identityResult === undefined || identityResult.length < 1) return undefined;

  const user = identityResult[0] as IIdentity;
  const id: IInternalIdentity = {
    id: user.localId || user.entityId,
    descriptor: user.subjectDescriptor,
    entityId: user.entityId,
    displayName: user.displayName || 'Unknown User',
    image: user.image,
    entityType: user.entityType as IInternalIdentityType
  };

  return id;
};

export const mapAbsoluteImageUrl = (baseUrl: string, identity: IIdentity): IIdentity => {
  return {
    ...identity,
    image:
      identity.image === undefined
        ? undefined
        : baseUrl === undefined
        ? ''
        : `${baseUrl}${identity.image}`
  };
};
