import {
  IDialogOptions,
  IGlobalMessagesService,
  IHostNavigationService,
  IHostPageLayoutService,
  IPanelOptions,
  IProjectInfo,
  IProjectPageService
} from 'azure-devops-extension-api';
import { IWorkItemFormService } from 'azure-devops-extension-api/WorkItemTracking';
import * as DevOps from 'azure-devops-extension-sdk';

export interface IDevOpsService {
  getProject(): Promise<IProjectInfo | undefined>;
  showToast(message: string): Promise<void>;
  showPanel<T, PanelIds>(id: PanelIds, options: IPanelOptions<T>): Promise<void>;
  openLink(url: string): Promise<void>;
  getCurrentWorkItemId(): Promise<number | undefined>;
  showDialog<T, DialogIds>(id: DialogIds, options: IDialogOptions<T>): Promise<void>;
}

export class DevOpsService implements IDevOpsService {
  public async getProject(): Promise<IProjectInfo | undefined> {
    const projectService = await DevOps.getService<IProjectPageService>(
      'ms.vss-tfs-web.tfs-page-data-service'
    );
    const project = await projectService.getProject();
    return project;
  }
  public async showToast(message: string): Promise<void> {
    const messageService = await DevOps.getService<IGlobalMessagesService>(
      'ms.vss-tfs-web.tfs-global-messages-service'
    );
    messageService.addToast({
      duration: 2500,
      message: message
    });
  }

  public async showDialog<T, DialogIds>(id: DialogIds, options: IDialogOptions<T>): Promise<void> {
    const dialogService = await DevOps.getService<IHostPageLayoutService>(
      'ms.vss-features.host-page-layout-service'
    );

    dialogService.openCustomDialog(`${DevOps.getExtensionContext().id}.${id}`, options);
  }

  public async showPanel<T, PanelIds>(id: PanelIds, options: IPanelOptions<T>): Promise<void> {
    const dialogService = await DevOps.getService<IHostPageLayoutService>(
      'ms.vss-features.host-page-layout-service'
    );

    dialogService.openPanel<T>(`${DevOps.getExtensionContext().id}.${id}`, options);
  }

  public async openLink(url: string): Promise<void> {
    const navigationService = await DevOps.getService<IHostNavigationService>(
      'ms.vss-features.host-navigation-service'
    );
    navigationService.openNewWindow(url, '');
  }
  public async getCurrentWorkItemId(): Promise<number | undefined> {
    try {
      const formService = await DevOps.getService<IWorkItemFormService>(
        'ms.vss-work-web.work-item-form'
      );
      const id = await formService.getId();
      return id;
    } catch {
      return undefined;
    }
  }
  public async getQueryParameters(): Promise<
    | {
        [key: string]: string;
      }
    | undefined
  > {
    const navService = await DevOps.getService<IHostNavigationService>(
      'ms.vss-features.host-navigation-service'
    );

    const params = await navService.getQueryParams();

    if (Object.keys(params).length === 0) return undefined;

    return params;
  }
}
