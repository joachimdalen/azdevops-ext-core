import {
  IdentitiesGetConnectionsResponseModel,
  IdentitiesSearchRequestModel,
  IPeoplePickerProvider,
  IVssIdentityService
} from 'azure-devops-extension-api/Identities';
import { getService } from 'azure-devops-extension-sdk';
import { IIdentity } from 'azure-devops-ui/IdentityPicker';

import { mapAbsoluteImageUrl } from '../utils/IdentityUtils';
import { getHostUrl } from './HostUtils';

export class ExtensionPeoplePickerProvider implements IPeoplePickerProvider {
  private identityService: Promise<IVssIdentityService>;
  private localStorageKey: string | undefined;

  constructor(localStorageKey?: string) {
    this.identityService = getService<IVssIdentityService>('ms.vss-features.identity-service');
    this.localStorageKey = localStorageKey;
  }

  public addIdentitiesToMRU = (identities: IIdentity[]): Promise<boolean> => {
    return this.identityService.then(identityService => {
      return identityService.addMruIdentitiesAsync(identities);
    });
  };

  public getEntityFromUniqueAttribute = (entityId: string): IIdentity | PromiseLike<IIdentity> => {
    return getHostUrl(this.localStorageKey).then(hostUrl => {
      const url = hostUrl || '';
      return this.identityService.then(identityService => {
        return identityService
          .searchIdentitiesAsync(entityId, ['user'], ['ims', 'source'], 'uid')
          .then(function (x) {
            return mapAbsoluteImageUrl(url, x[0]);
          });
      });
    });
  };

  public onEmptyInputFocus = (): IIdentity[] | PromiseLike<IIdentity[]> => {
    return getHostUrl(this.localStorageKey).then(hostUrl => {
      const url = hostUrl || '';
      return this.identityService.then(identityService => {
        return identityService.getIdentityMruAsync().then(identities => {
          return identities.map(id => mapAbsoluteImageUrl(url, id));
        });
      });
    });
  };

  public onFilterIdentities = (
    filter: string,
    selectedItems?: IIdentity[]
  ): Promise<IIdentity[]> | IIdentity[] => {
    return this._onSearchPersona(filter, selectedItems ? selectedItems : []);
  };

  public onRequestConnectionInformation = (
    entity: IIdentity,
    getDirectReports?: boolean
  ): IdentitiesGetConnectionsResponseModel | PromiseLike<IdentitiesGetConnectionsResponseModel> => {
    return this.identityService.then(identityService => {
      return identityService.getConnections(entity, getDirectReports);
    });
  };

  public removeIdentitiesFromMRU = (identities: IIdentity[]): Promise<boolean> => {
    return this.identityService.then(identityService => {
      return identityService.removeMruIdentitiesAsync(identities);
    });
  };

  private _onSearchPersona = (searchText: string, items: IIdentity[]): Promise<IIdentity[]> => {
    return getHostUrl(this.localStorageKey).then(hostUrl => {
      const url = hostUrl || '';
      const searchRequest: IdentitiesSearchRequestModel = { query: searchText };
      return this.identityService.then(identityService => {
        return identityService
          .searchIdentitiesAsync(
            searchRequest.query,
            searchRequest.identityTypes,
            searchRequest.operationScopes,
            searchRequest.queryTypeHint,
            searchRequest.options
          )
          .then((identities: IIdentity[]) => {
            return identities
              .filter(
                identity =>
                  !items.some(selectedIdentity => selectedIdentity.entityId === identity.entityId)
              )
              .map(id => mapAbsoluteImageUrl(url, id));
          });
      });
    });
  };
}
