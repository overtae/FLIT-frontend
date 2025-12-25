export type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
};

export type NotificationReadRequest = {
  id: string;
};

export type NotificationReadAllRequest = {
  ids: string[];
};
