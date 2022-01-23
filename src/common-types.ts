export interface ActionResult<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export enum ScopeType {
  Default = 'Default',
  User = 'User'
}

export interface IInternalIdentity {
  entityId: string;
  image?: string;
  displayName: string;
}
