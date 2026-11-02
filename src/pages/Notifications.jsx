import { useEffect, useState } from "react";
import { getNotifications, clearNotifications } from "../utils/notifications";

export default function Notifications() {
  const [notifications, setNotifications] = useState(getNotifications);

  // ===============================
  // LOAD NOTIFICATIONS
  // ===============================
  const loadNotifications = () => {
    const data = getNotifications();
    setNotifications(data);
  };

  useEffect(() => {
    // Auto refresh every second
    const interval = setInterval(() => {
      loadNotifications();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // ===============================
  // CLEAR ALL
  // ===============================
  const clearAll = () => {
    clearNotifications();
    setNotifications([]);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Notifications 🔔</h1>

        {notifications.length > 0 && (
          <button
            onClick={clearAll}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg shadow"
          >
            Clear All
          </button>
        )}
      </div>

      {/* EMPTY STATE */}
      {notifications.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-10 text-center">
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            No notifications yet
          </h2>
          <p className="text-gray-400">
            New alerts will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((note, index) => (
            <div
              key={note.id}
              className="bg-white border rounded-xl shadow-sm p-5 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-800 text-lg">
                    {note.message}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">{note.time}</p>
                </div>

                <span className="text-xs bg-pink-100 text-pink-600 px-3 py-1 rounded-full">
                  #{notifications.length - index}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
