import { createActionGroup, emptyProps, props } from '@ngrx/store';

export const NotificationsActions = createActionGroup({
  source: 'Notifications',
  events: {
    'Push Message': props<{ message: string }>(),
    'Clear Message': emptyProps(),
  },
});
