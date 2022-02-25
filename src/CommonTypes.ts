export interface ActionResult<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export enum ScopeType {
  Default = 'Default',
  User = 'User'
}

export type IInternalIdentityType = 'User' | 'Group' | 'Custom';
export interface IInternalIdentity {
  entityId: string;
  id: string;
  descriptor?: string;
  image?: string;
  displayName: string;
  entityType: IInternalIdentityType;
}

export interface Something {
  some: string;
}
