import { IExtensionDataService } from 'azure-devops-extension-api';
import * as DevOps from 'azure-devops-extension-sdk';

import { ScopeType } from '../CommonTypes';
import { DevOpsService } from './DevOpsService';

export interface IStorageService {
  getAll<T>(collectionName: string, scope: ScopeType): Promise<T[] | undefined>;
  getById<T>(collectionName: string, id: string, scope: ScopeType): Promise<T | undefined>;
}

export class StorageService implements IStorageService {
  private dataService?: IExtensionDataService;
  private _devOpsServive: DevOpsService;

  constructor() {
    this._devOpsServive = new DevOpsService();
  }

  protected async getDataService(): Promise<IExtensionDataService> {
    if (this.dataService === undefined) {
      this.dataService = await DevOps.getService<IExtensionDataService>(
        'ms.vss-features.extension-data-service'
      );
    }

    return this.dataService;
  }

  public async getAll<T>(
    collectionName: string,
    scope = ScopeType.Default
  ): Promise<T[] | undefined> {
    const dataService = await this.getDataService();

    if (collectionName === undefined) {
      throw new Error('Failed to initialize ');
    }

    const dataManager = await dataService.getExtensionDataManager(
      DevOps.getExtensionContext().id,
      await DevOps.getAccessToken()
    );
    const document: T[] | undefined = await dataManager.getDocuments(collectionName, {
      scopeType: scope,
      defaultValue: undefined
    });

    return document;
  }
  public async getById<T>(
    collectionName: string,
    id: string,
    scope = ScopeType.Default
  ): Promise<T | undefined> {
    const dataService = await this.getDataService();

    if (collectionName === undefined) {
      throw new Error('Failed to initialize ');
    }

    const dataManager = await dataService.getExtensionDataManager(
      DevOps.getExtensionContext().id,
      await DevOps.getAccessToken()
    );
    const document: T | undefined = await dataManager.getDocument(collectionName, id, {
      scopeType: scope,
      defaultValue: undefined
    });

    return document;
  }
}
