import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';

// Export reducer and action types for standalone unit testing and pedagogical clarity
export const NOTIFICATION_ACTIONS = {
  ADD_TOAST: 'ADD_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  MARK_AS_READ: 'MARK_AS_READ',
  MARK_ALL_READ: 'MARK_ALL_READ',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  CLEAR_ALL_NOTIFICATIONS: 'CLEAR_ALL_NOTIFICATIONS'
};

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Welcome to CareerConnect',
    message: 'Explore open engineering vacancies or showcase your live candidate portfolio.',
    type: 'info',
    timestamp: 'Just now',
    isRead: false
  },
  {
    id: 'notif-2',
    title: 'Application Pipeline Active',
    message: 'StripeWave Labs reviewed your Full-Stack Engineer submission.',
    type: 'success',
    timestamp: '15m ago',
    isRead: false
  },
  {
    id: 'notif-3',
    title: 'Job Basket Ready',
    message: 'You can queue multiple vacancies and apply in batch from the Cart page.',
    type: 'info',
    timestamp: '1h ago',
    isRead: true
  }
];

export const initialNotificationState = {
  toasts: [],
  notifications: INITIAL_NOTIFICATIONS
};

/**
 * Pure notificationReducer demonstrating the useReducer pattern inside the Context API.
 * Handles predictable state transitions for ephemeral toasts and persistent alerts.
 */
export function notificationReducer(state, action) {
  switch (action.type) {
    case NOTIFICATION_ACTIONS.ADD_TOAST:
      return {
        ...state,
        toasts: [...state.toasts, action.payload]
      };

    case NOTIFICATION_ACTIONS.REMOVE_TOAST:
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.payload)
      };

    case NOTIFICATION_ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [action.payload, ...state.notifications]
      };

    case NOTIFICATION_ACTIONS.MARK_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload ? { ...n, isRead: true } : n
        )
      };

    case NOTIFICATION_ACTIONS.MARK_ALL_READ:
      return {
        ...state,
        notifications: state.notifications.map((n) => ({ ...n, isRead: true }))
      };

    case NOTIFICATION_ACTIONS.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter((n) => n.id !== action.payload)
      };

    case NOTIFICATION_ACTIONS.CLEAR_ALL_NOTIFICATIONS:
      return {
        ...state,
        notifications: []
      };

    default:
      return state;
  }
}

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialNotificationState);

  const removeToast = useCallback((id) => {
    dispatch({ type: NOTIFICATION_ACTIONS.REMOVE_TOAST, payload: id });
  }, []);

  const addToast = useCallback(
    ({ type = 'info', title = '', message, duration = 4000, logToCenter = true }) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      const toastItem = { id, type, title, message, duration };

      dispatch({ type: NOTIFICATION_ACTIONS.ADD_TOAST, payload: toastItem });

      // Automatically log to notification center history as well
      if (logToCenter) {
        dispatch({
          type: NOTIFICATION_ACTIONS.ADD_NOTIFICATION,
          payload: {
            id: `notif-${Date.now()}`,
            title: title || 'System Update',
            message,
            type,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isRead: false
          }
        });
      }

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
      return id;
    },
    [removeToast]
  );

  const markAsRead = useCallback((id) => {
    dispatch({ type: NOTIFICATION_ACTIONS.MARK_AS_READ, payload: id });
  }, []);

  const markAllAsRead = useCallback(() => {
    dispatch({ type: NOTIFICATION_ACTIONS.MARK_ALL_READ });
  }, []);

  const removeNotification = useCallback((id) => {
    dispatch({ type: NOTIFICATION_ACTIONS.REMOVE_NOTIFICATION, payload: id });
  }, []);

  const clearAllNotifications = useCallback(() => {
    dispatch({ type: NOTIFICATION_ACTIONS.CLEAR_ALL_NOTIFICATIONS });
  }, []);

  const unreadCount = useMemo(
    () => state.notifications.filter((n) => !n.isRead).length,
    [state.notifications]
  );

  const value = useMemo(
    () => ({
      toasts: state.toasts,
      notifications: state.notifications,
      unreadCount,
      addToast,
      removeToast,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearAllNotifications,
      dispatch
    }),
    [
      state.toasts,
      state.notifications,
      unreadCount,
      addToast,
      removeToast,
      markAsRead,
      markAllAsRead,
      removeNotification,
      clearAllNotifications
    ]
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Backwards compatibility alias for components calling useToast
export const useToast = useNotifications;

export default NotificationProvider;
