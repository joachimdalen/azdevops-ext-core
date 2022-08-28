import { getClient } from 'azure-devops-extension-api/Common';
import { CoreRestClient, ProjectProperty } from 'azure-devops-extension-api/Core';
import {
  WorkItem,
  WorkItemErrorPolicy,
  WorkItemExpand,
  WorkItemQueryResult,
  WorkItemTagDefinition,
  WorkItemTrackingRestClient,
  WorkItemType
} from 'azure-devops-extension-api/WorkItemTracking';
import { WorkItemTrackingProcessRestClient } from 'azure-devops-extension-api/WorkItemTrackingProcess';

import { getChildIds, getParentId } from '../core/WorkItemUtils';
import { ExtendedWorkItemTrackingRestClient } from '../WorkItemTracking/ExtendedWorkItemTrackingRestClient';
import { DevOpsService, IDevOpsService } from './DevOpsService';

export interface IWorkItemService {
  getParentForWorkItem(
    id: number,
    workItem?: WorkItem,
    expand?: WorkItemExpand
  ): Promise<WorkItem | undefined>;
  getChildrenForWorkItem(
    id: number,
    workItem?: WorkItem,
    expand?: WorkItemExpand
  ): Promise<WorkItem[] | undefined>;
  getWorkItemTypes(fromProcess?: boolean): Promise<WorkItemType[]>;
  getWorkItem(id: number, expand?: WorkItemExpand, fields?: string[]): Promise<WorkItem>;
  getWorkItems(
    ids: number[],
    expand?: WorkItemExpand,
    fields?: string[],
    errorPolicy?: WorkItemErrorPolicy
  ): Promise<WorkItem[]>;
  setWorkItemState(id: number, state: string): Promise<WorkItem>;
  getProcessTemplateName(): Promise<string | undefined>;
  getTags(): Promise<WorkItemTagDefinition[] | undefined>;
  queryWorkItems(wiql: string): Promise<WorkItemQueryResult | undefined>;
}

export class WorkItemService implements IWorkItemService {
  private _devOpsService: IDevOpsService;
  private _processTemplateTypeKey = 'System.ProcessTemplateType';
  constructor(devOpsService?: IDevOpsService) {
    this._devOpsService = devOpsService ?? new DevOpsService();
  }

  public async getParentForWorkItem(
    id: number,
    workItem?: WorkItem,
    expand?: WorkItemExpand
  ): Promise<WorkItem | undefined> {
    const wi = workItem || (await this.getWorkItem(id, expand));
    const parentId = getParentId(wi);
    if (parentId === undefined) return undefined;
    const parentWi = await this.getWorkItem(parentId, expand);
    return parentWi;
  }

  public async getChildrenForWorkItem(
    id: number,
    workItem?: WorkItem,
    expand?: WorkItemExpand
  ): Promise<WorkItem[] | undefined> {
    const wi = workItem || (await this.getWorkItem(id, expand));
    const childIds = getChildIds(wi);
    if (childIds === undefined) return undefined;
    const wis = await this.getWorkItems(childIds, expand);
    return wis;
  }

  private async getProjectProperties(projectId: string): Promise<ProjectProperty[]> {
    const coreClient = getClient(CoreRestClient);
    const props = await coreClient.getProjectProperties(projectId);
    return props;
  }

  public async getProcessTemplateName(): Promise<string | undefined> {
    const project = await this._devOpsService.getProject();

    if (project) {
      const props = await this.getProjectProperties(project.id);
      const processClient = getClient(WorkItemTrackingProcessRestClient);
      const processId = props.find(x => x.name === this._processTemplateTypeKey)?.value;
      if (processId) {
        const process = await processClient.getProcessByItsId(processId);
        if (
          process.parentProcessTypeId !== undefined &&
          process.parentProcessTypeId !== '00000000-0000-0000-0000-000000000000'
        ) {
          const parentProcess = await processClient.getProcessByItsId(process.parentProcessTypeId);
          return parentProcess.name;
        } else {
          return process.name;
        }
      }

      return undefined;
    }
  }

  public async getWorkItemTypes(fromProcess?: boolean): Promise<WorkItemType[]> {
    const project = await this._devOpsService.getProject();
    if (project) {
      const client = getClient(WorkItemTrackingRestClient);
      const types = await client.getWorkItemTypes(project.name);
      if (fromProcess) {
        const processClient = getClient(WorkItemTrackingProcessRestClient);
        const props = await this.getProjectProperties(project.id);
        const processId = props.find(x => x.name === this._processTemplateTypeKey)?.value;
        if (processId === undefined) {
          return types;
        }

        const wits = await processClient.getProcessWorkItemTypes(processId);

        return types.filter(x => wits.some(y => y.referenceName === x.referenceName));
      } else {
        return types;
      }
    }
    return [];
  }

  public async getWorkItem(
    id: number,
    expand?: WorkItemExpand,
    fields?: string[]
  ): Promise<WorkItem> {
    const client = getClient(WorkItemTrackingRestClient);
    const wit = await client.getWorkItem(id, undefined, fields, undefined, expand);
    return wit;
  }

  public async getWorkItems(
    ids: number[],
    expand?: WorkItemExpand,
    fields?: string[],
    errorPolicy?: WorkItemErrorPolicy
  ): Promise<WorkItem[]> {
    const client = getClient(WorkItemTrackingRestClient);
    const wit = await client.getWorkItems(ids, undefined, fields, undefined, expand, errorPolicy);
    return wit;
  }

  public async setWorkItemState(id: number, state: string): Promise<WorkItem> {
    const client = getClient(WorkItemTrackingRestClient);
    const updated = await client.updateWorkItem(
      [
        {
          op: 'add',
          path: '/fields/System.State',
          value: state
        }
      ],
      id
    );
    return updated;
  }

  public async getTags(): Promise<WorkItemTagDefinition[] | undefined> {
    const project = await this._devOpsService.getProject();

    if (project) {
      const client = getClient(ExtendedWorkItemTrackingRestClient);
      const tags = await client.getWorkItemTags('demoproject');
      return tags;
    }
  }

  public async queryWorkItems(wiql: string): Promise<WorkItemQueryResult | undefined> {
    const project = await this._devOpsService.getProject();

    if (project) {
      const client = getClient(WorkItemTrackingRestClient);
      const wit = await client.queryByWiql({ query: wiql }, project.name);
      return wit;
    }
  }
}
