export const getNotifications = () => {
  return JSON.parse(localStorage.getItem("notifications")) || [];
};

export const addNotification = (message) => {
  let notifications = getNotifications();

  notifications.unshift({
    id: Date.now(),
    message,
    time: new Date().toLocaleString(),
  });

  localStorage.setItem("notifications", JSON.stringify(notifications));
};

export const clearNotifications = () => {
  localStorage.removeItem("notifications");
};
