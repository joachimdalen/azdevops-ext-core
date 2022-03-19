import {
  IdentitiesGetConnectionsResponseModel,
  IPeoplePickerProvider,
  IVssIdentityService
} from 'azure-devops-extension-api/Identities';
import * as DevOps from 'azure-devops-extension-sdk';
import { IIdentity } from 'azure-devops-ui/IdentityPicker';

import { mapAbsoluteImageUrl } from '../utils/IdentityUtils';
import { getHostUrl } from './HostUtils';

class ExtensionPeoplePickerProvider implements IPeoplePickerProvider {
  private identityService: Promise<IVssIdentityService>;
  private baseUrl: string | undefined;
  constructor(localStorageKey?: string) {
    this.identityService = DevOps.getService<IVssIdentityService>(
      'ms.vss-features.identity-service'
    );

    this.baseUrl = getHostUrl(localStorageKey);
  }

  addIdentitiesToMRU(identities: IIdentity[]): Promise<boolean> {
    return this.identityService.then(function (identityService) {
      return identityService.addMruIdentitiesAsync(identities);
    });
  }
  getEntityFromUniqueAttribute(entityId: string): IIdentity | PromiseLike<IIdentity> {
    const url = this.baseUrl || '';
    return this.identityService.then(function (identityService) {
      return identityService
        .searchIdentitiesAsync(entityId, ['user'], ['ims', 'source'], 'uid')
        .then(function (x) {
          return mapAbsoluteImageUrl(url, x[0]);
        });
    });
  }
  onEmptyInputFocus(): IIdentity[] | PromiseLike<IIdentity[]> | null {
    const url = this.baseUrl || '';
    return this.identityService.then(function (identityService) {
      return identityService.getIdentityMruAsync().then(function (identities) {
        return identities.map(id => mapAbsoluteImageUrl(url, id));
      });
    });
  }
  onFilterIdentities(
    filter: string,
    selectedItems?: IIdentity[]
  ): IIdentity[] | PromiseLike<IIdentity[]> | null {
    return this._onSearchPersona(filter, selectedItems ? selectedItems : []);
  }

  _onSearchPersona(searchText: string, items: IIdentity[]): Promise<IIdentity[]> {
    const url = this.baseUrl || '';
    // eslint-disable-next-line no-var
    var searchRequest: any = { query: searchText };
    return this.identityService.then(function (identityService) {
      return identityService
        .searchIdentitiesAsync(
          searchRequest.query,
          searchRequest.identityTypes,
          searchRequest.operationScopes,
          searchRequest.queryTypeHint,
          searchRequest.options
        )
        .then(function (identities) {
          return identities
            .filter(function (identity) {
              return !items.some(function (selectedIdentity) {
                return selectedIdentity.entityId === identity.entityId;
              });
            })
            .map(id => mapAbsoluteImageUrl(url, id));
        });
    });
  }
  onRequestConnectionInformation(
    entity: IIdentity,
    getDirectReports?: boolean
  ): IdentitiesGetConnectionsResponseModel | PromiseLike<IdentitiesGetConnectionsResponseModel> {
    return this.identityService.then(function (identityService) {
      return identityService.getConnections(entity, getDirectReports);
    });
  }

  removeIdentitiesFromMRU(identities: IIdentity[]): Promise<boolean> {
    return this.identityService.then(function (identityService) {
      return identityService.removeMruIdentitiesAsync(identities);
    });
  }
}

export default ExtensionPeoplePickerProvider;
