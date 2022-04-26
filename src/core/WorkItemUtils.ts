import { WorkItem, WorkItemType } from 'azure-devops-extension-api/WorkItemTracking';

import { isDefined } from './CoreUtils';

const titleField = 'System.Title';
const parentField = 'System.LinkTypes.Hierarchy-Reverse';
const childField = 'System.LinkTypes.Hierarchy-Forward';
const workItemType = 'System.WorkItemType';
const state = 'System.State';

/**
 *
 * Get work item id from url
 *
 * @param url Url of work item
 * @returns id of work item
 */
export const getIdFormWorkItemUrl = (url: string): number | undefined => {
  const idString = url.split('/').pop();
  if (idString === undefined) return undefined;

  const id = parseInt(idString);
  if (isNaN(id)) return undefined;

  return id;
};

/**
 * Get id of parent work item
 *
 *  @param workItem
 * @returns
 */
export const getParentId = (workItem: WorkItem): number | undefined => {
  const parent = workItem.relations.find(x => x.rel === parentField);
  if (parent === undefined) return undefined;
  return getIdFormWorkItemUrl(parent.url);
};

/**
 * Get ids of child work items
 *
 * @param workItem
 * @returns
 */
export const getChildIds = (workItem: WorkItem): number[] | undefined => {
  const children = workItem.relations.filter(x => x.rel === childField);
  if (children === undefined) return undefined;
  if (children.length === 0) return undefined;

  return children.map(c => getIdFormWorkItemUrl(c.url)).filter(isDefined);
};

/**
 * Get work item type
 * @param workItem
 * @returns Work item type display name. E.g "User Story"
 */
export const getWorkItemTypeDisplayName = (workItem: WorkItem): string =>
  workItem.fields[workItemType];

/**
 * Get work item state
 * @param workItem
 * @returns Work item state
 */
export const getWorkItemState = (workItem: WorkItem): string => workItem.fields[state];

/**
 * Get work item type reference name. E.g "User Story" => "Microsoft.VSTS.WorkItemTypes.UserStory"
 * @param workItem
 * @returns work item type reference name. E.g "Microsoft.VSTS.WorkItemTypes.UserStory"
 */
export const getWorkItemReferenceName = (
  workItem: WorkItem,
  workItemTypes: WorkItemType[]
): string | undefined => {
  const type = getWorkItemTypeDisplayName(workItem);
  return getWorkItemReferenceNameFromDisplayName(type, workItemTypes);
};

/**
 * Get work item type reference name. E.g "User Story" => "Microsoft.VSTS.WorkItemTypes.UserStory"
 *
 * @param name Work item display name. E.g "User Story"
 * @param workItemTypes
 * @returns work item reference name. E.g "Microsoft.VSTS.WorkItemTypes.UserStory"
 */
export const getWorkItemReferenceNameFromDisplayName = (
  name: string,
  workItemTypes: WorkItemType[]
): string | undefined => workItemTypes.find(x => x.name === name)?.referenceName;

/**
 * Get work item title
 *
 * @param workItem
 * @returns
 */
export const getWorkItemTitle = (workItem: WorkItem): string => workItem.fields[titleField];

export const getWorkTypeFromReferenceName = (
  referenceName: string,
  workItemTypes: WorkItemType[]
): WorkItemType | undefined => workItemTypes.find(x => x.referenceName === referenceName);
