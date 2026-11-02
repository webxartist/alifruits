import { useEffect, useState } from "react";
import { getNotifications } from "../utils/notifications";

export default function NotificationDropdown() {
  const [notifications, setNotifications] = useState(getNotifications);

  const loadNotifications = () => setNotifications(getNotifications());

  useEffect(() => {
    const interval = setInterval(loadNotifications, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute right-0 z-50 mt-3 max-h-96 w-80 overflow-y-auto rounded-lg border bg-white shadow-xl">
      <div className="border-b p-3 font-bold">Notifications 🔔</div>
      {notifications.length === 0 ? (
        <p className="p-4 text-gray-500">No notifications</p>
      ) : (
        notifications.map((note) => (
          <div key={note.id} className="border-b p-3">
            <p>{note.message}</p>
            <span className="text-xs text-gray-400">{note.time}</span>
          </div>
        ))
      )}
    </div>
  );
}
