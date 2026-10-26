// Re-export from NotificationContext to support both useToast and useNotifications
export {
  NotificationProvider as ToastProvider,
  useToast,
  useNotifications,
  notificationReducer,
  NOTIFICATION_ACTIONS
} from './NotificationContext';

export { default } from './NotificationContext';
