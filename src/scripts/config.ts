/**
 * Custom CSS Class Name
 */
export const customCSSClassName = {
  hashInListItem: 'us-colored-square-in-list-item',
  datetimeOnListItem: 'us-datetime-on-list',
};

export type DynamicConfig = {
  tags: { name: string; type: 'condition' | 'affection' | 'activity' | 'intention' }[];
};
