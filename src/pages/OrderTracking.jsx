import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMyOrders } from "../services/api";
import io from "socket.io-client";

import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const socket = io("http://localhost:5000");

export default function OrderTracking() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);

  // 🚚 Delivery Boy Location (dummy start)
  const [location, setLocation] = useState({
    lat: 19.033,
    lng: 73.029, // Panvel area
  });

  // ===============================
  // FETCH ORDER
  // ===============================
  useEffect(() => {
    const fetchOrder = async () => {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      const orders = await getMyOrders(user.token);

      const selected = orders.find((o) => o._id === id);
      setOrder(selected);
    };

    fetchOrder();
  }, [id]);

  // ===============================
  // SOCKET LISTENER
  // ===============================
  useEffect(() => {
    socket.on("orderStatusUpdated", (data) => {
      if (data.orderId === id) {
        setOrder((prev) => ({
          ...prev,
          status: data.status,
        }));
      }
    });

    return () => socket.disconnect();
  }, [id]);

  // ===============================
  // 🚚 FAKE LIVE MOVEMENT
  // ===============================
  useEffect(() => {
    const interval = setInterval(() => {
      setLocation((prev) => ({
        lat: prev.lat + 0.0005,
        lng: prev.lng + 0.0005,
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (!order) return <h1 className="p-6">Loading...</h1>;

  const steps = ["Pending", "Confirmed", "Shipped", "Out for Delivery", "Delivered"];

  const currentIndex = steps.indexOf(order.status);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Live Order Tracking 🚚</h1>

      {/* TIMELINE */}
      <div className="flex justify-between mb-10">
        {steps.map((step, i) => (
          <div key={i} className="text-center flex-1">
            <div
              className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center text-white ${
                i <= currentIndex ? "bg-green-500" : "bg-gray-300"
              }`}
            >
              {i + 1}
            </div>
            <p className="text-sm mt-2">{step}</p>
          </div>
        ))}
      </div>

      {/* MAP */}
      <div className="rounded overflow-hidden shadow mb-6">
        <LoadScript googleMapsApiKey="YOUR_API_KEY_HERE">
          <GoogleMap
            center={location}
            zoom={15}
            mapContainerStyle={{ width: "100%", height: "400px" }}
          >
            <Marker position={location} />
          </GoogleMap>
        </LoadScript>
      </div>

      {/* ORDER DETAILS */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-bold mb-2">Order ID: {order._id}</h2>

        {order.orderItems.map((item, i) => (
          <div key={i} className="flex justify-between border-b py-2">
            <span>{item.name}</span>
            <span>
              ₹{item.price} × {item.qty}
            </span>
          </div>
        ))}

        <div className="text-right font-bold mt-3">
          Total: ₹{order.totalPrice}
        </div>
      </div>
    </div>
  );
}
