import { IVssRestClientOptions } from 'azure-devops-extension-api';
import { RestClientBase } from 'azure-devops-extension-api/Common/RestClientBase';
import { WorkItemTagDefinition } from 'azure-devops-extension-api/WorkItemTracking';

export class ExtendedWorkItemTrackingRestClient extends RestClientBase {
  constructor(options: IVssRestClientOptions) {
    super(options);
  }

  public static readonly RESOURCE_AREA_ID = '5264459e-e5e0-4bd8-b118-0985e68a4ec5';

  /**
   * Returns a single work item tag
   *
   * @param tagIdOrName - Name or Id of tag
   * @param project - Project ID or project name
   */
  public async getWorkItemTag(
    tagIdOrName: number,
    project: string
  ): Promise<WorkItemTagDefinition> {
    return this.beginRequest<WorkItemTagDefinition>({
      apiVersion: '7.1-preview.1',
      routeTemplate: '{project}/_apis/wit/tags/{tagIdOrName}',
      routeValues: {
        project: project,
        tagIdOrName: tagIdOrName
      }
    });
  }

  /**
   * Returns all work item tagd
   *
   * @param project - Project ID or project name
   */
  public async getWorkItemTags(project: string): Promise<WorkItemTagDefinition[]> {
    return this.beginRequest<WorkItemTagDefinition[]>({
      apiVersion: '7.1-preview.1',
      routeTemplate: '{project}/_apis/wit/tags',
      routeValues: {
        project: project
      }
    });
  }
}
