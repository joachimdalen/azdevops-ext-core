import { ILocationService } from 'azure-devops-extension-api';
import { CoreRestClient } from 'azure-devops-extension-api/Core';
import * as DevOps from 'azure-devops-extension-sdk';

export const getHostUrl = (localStorageKey?: string): string | undefined => {
  if (localStorageKey !== undefined) {
    const storedUrl = localStorage.getItem(localStorageKey);
    if (storedUrl !== null) {
      return storedUrl;
    }
  }

  DevOps.getService<ILocationService>('ms.vss-features.location-service').then(
    (service: ILocationService) => {
      service.getResourceAreaLocation(CoreRestClient.RESOURCE_AREA_ID).then(hostBaseUrl => {
        if (localStorageKey !== undefined) {
          localStorage.setItem(localStorageKey, new URL(hostBaseUrl).origin);
        }

        return hostBaseUrl;
      });
    }
  );

  return undefined;
};
