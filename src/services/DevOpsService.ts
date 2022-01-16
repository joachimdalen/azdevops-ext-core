import {
  IGlobalMessagesService,
  IHostNavigationService,
  IHostPageLayoutService,
  IPanelOptions,
  IProjectInfo,
  IProjectPageService,
} from "azure-devops-extension-api";
import * as DevOps from "azure-devops-extension-sdk";

export interface IDevOpsService {
  getProject(): Promise<IProjectInfo | undefined>;
  showToast(message: string): Promise<void>;
  showPanel<T, PanelIds>(
    id: PanelIds,
    options: IPanelOptions<T>
  ): Promise<void>;
  openLink(url: string): Promise<void>;
}

export default class DevOpsService implements IDevOpsService {
  public async getProject(): Promise<IProjectInfo | undefined> {
    const projectService = await DevOps.getService<IProjectPageService>(
      "ms.vss-tfs-web.tfs-page-data-service"
    );
    const project = await projectService.getProject();
    return project;
  }
  public async showToast(message: string): Promise<void> {
    const messageService = await DevOps.getService<IGlobalMessagesService>(
      "ms.vss-tfs-web.tfs-global-messages-service"
    );
    messageService.addToast({
      duration: 2500,
      message: message,
    });
  }
  public async showPanel<T, PanelIds>(
    id: PanelIds,
    options: IPanelOptions<T>
  ): Promise<void> {
    const dialogService = await DevOps.getService<IHostPageLayoutService>(
      "ms.vss-features.host-page-layout-service"
    );

    dialogService.openPanel<T>(
      `${DevOps.getExtensionContext().id}.${id}`,
      options
    );
  }

  public async openLink(url: string): Promise<void> {
    const navigationService = await DevOps.getService<IHostNavigationService>(
      "ms.vss-features.host-navigation-service"
    );
    navigationService.openNewWindow(url, "");
  }
}
