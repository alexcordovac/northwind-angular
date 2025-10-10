import { createFeature, createReducer, on } from '@ngrx/store';
import { NotificationsActions } from './notifications.actions';

export const notificationsFeatureKey = 'notifications';

export interface NotificationsState {
  message: string | null;
}

const initialState: NotificationsState = {
  message: null,
};

export const notificationsReducer = createReducer(
  initialState,
  on(NotificationsActions.pushMessage, (state, { message }) => ({ ...state, message })),
  on(NotificationsActions.clearMessage, (state) => ({ ...state, message: null })),
);

export const notificationsFeature = createFeature({
  name: notificationsFeatureKey,
  reducer: notificationsReducer,
});
