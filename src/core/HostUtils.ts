import { ILocationService } from 'azure-devops-extension-api';
import { CoreRestClient } from 'azure-devops-extension-api/Core';
import * as DevOps from 'azure-devops-extension-sdk';

export const getHostUrl = async (
  localStorageKey?: string,
  includeOrg?: boolean
): Promise<string | undefined> => {
  if (localStorageKey !== undefined) {
    const storedUrl = localStorage.getItem(localStorageKey);
    if (storedUrl !== null) {
      return storedUrl;
    }
  }

  const navService: ILocationService = await DevOps.getService<ILocationService>(
    'ms.vss-features.location-service'
  );

  if (navService === undefined) return undefined;
  const hostBaseUrl = await navService.getResourceAreaLocation(CoreRestClient.RESOURCE_AREA_ID);

  if (hostBaseUrl === undefined) return undefined;
  const returnUrl = includeOrg ? hostBaseUrl : new URL(hostBaseUrl).origin;

  if (localStorageKey !== undefined) {
    localStorage.setItem(localStorageKey, returnUrl);
  }

  return returnUrl;
};
