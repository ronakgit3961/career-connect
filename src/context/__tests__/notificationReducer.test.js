import { describe, it, expect } from 'vitest';
import {
  notificationReducer,
  NOTIFICATION_ACTIONS,
  initialNotificationState
} from '../NotificationContext';

describe('notificationReducer (Context API + useReducer Architecture)', () => {
  it('should add a toast alert to ephemeral queue', () => {
    const toast = { id: 't-1', title: 'Success', message: 'Job applied', type: 'success' };
    const state = notificationReducer(initialNotificationState, {
      type: NOTIFICATION_ACTIONS.ADD_TOAST,
      payload: toast
    });

    expect(state.toasts.length).toBe(1);
    expect(state.toasts[0].title).toBe('Success');
  });

  it('should remove a toast alert by id', () => {
    const initialState = {
      ...initialNotificationState,
      toasts: [{ id: 't-1', message: 'Hello' }]
    };

    const state = notificationReducer(initialState, {
      type: NOTIFICATION_ACTIONS.REMOVE_TOAST,
      payload: 't-1'
    });

    expect(state.toasts.length).toBe(0);
  });

  it('should add a notification to persistent history', () => {
    const newNotif = {
      id: 'notif-test-1',
      title: 'Interview Invite',
      message: 'Invitation received',
      isRead: false
    };

    const state = notificationReducer(initialNotificationState, {
      type: NOTIFICATION_ACTIONS.ADD_NOTIFICATION,
      payload: newNotif
    });

    expect(state.notifications[0].id).toBe('notif-test-1');
  });

  it('should mark a specific notification as read', () => {
    const state = notificationReducer(initialNotificationState, {
      type: NOTIFICATION_ACTIONS.MARK_AS_READ,
      payload: 'notif-1'
    });

    const target = state.notifications.find((n) => n.id === 'notif-1');
    expect(target.isRead).toBe(true);
  });

  it('should mark all notifications as read', () => {
    const state = notificationReducer(initialNotificationState, {
      type: NOTIFICATION_ACTIONS.MARK_ALL_READ
    });

    expect(state.notifications.every((n) => n.isRead)).toBe(true);
  });

  it('should remove a single notification', () => {
    const countBefore = initialNotificationState.notifications.length;
    const state = notificationReducer(initialNotificationState, {
      type: NOTIFICATION_ACTIONS.REMOVE_NOTIFICATION,
      payload: 'notif-1'
    });

    expect(state.notifications.length).toBe(countBefore - 1);
    expect(state.notifications.some((n) => n.id === 'notif-1')).toBe(false);
  });

  it('should clear all notifications', () => {
    const state = notificationReducer(initialNotificationState, {
      type: NOTIFICATION_ACTIONS.CLEAR_ALL_NOTIFICATIONS
    });

    expect(state.notifications.length).toBe(0);
  });
});
