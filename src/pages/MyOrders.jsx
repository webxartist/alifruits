import { useEffect, useState } from "react";
import { getMyOrders, cancelMyOrder, requestOrderReturn } from "../services/api";
import OrderTracker from "../components/OrderTracker";
import { Link } from "react-router-dom";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState("");

  // ============================================================
  // FETCH MY ORDERS
  // ============================================================

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("userInfo"));

        if (!user?.token) {
          setLoading(false);
          return;
        }

        const data = await getMyOrders(user.token);

        console.log("MY ORDERS:", data);

        setOrders(Array.isArray(data?.orders) ? data.orders : []);
      } catch (error) {
        console.log("ORDER ERROR:", error);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleCancel = async (order) => {
    const reason = window.prompt("Why do you want to cancel this order?", "Changed my mind");
    if (reason === null) return;
    try {
      const session = JSON.parse(localStorage.getItem("userInfo") || "null");
      await cancelMyOrder(order._id, reason, session?.token);
      setActionMessage("Order cancelled successfully.");
      const updated = await getMyOrders(session?.token);
      setOrders(Array.isArray(updated?.orders) ? updated.orders : []);
    } catch (error) { setActionMessage(error.message); }
  };

  const handleReturn = async (order) => {
    const reason = window.prompt("Enter your return reason:");
    if (!reason?.trim()) return;
    const details = window.prompt("Additional details (optional):", "") || "";
    try {
      const session = JSON.parse(localStorage.getItem("userInfo") || "null");
      await requestOrderReturn(order._id, { reason, details }, session?.token);
      setActionMessage("Return request submitted for review.");
      const updated = await getMyOrders(session?.token);
      setOrders(Array.isArray(updated?.orders) ? updated.orders : []);
    } catch (error) { setActionMessage(error.message); }
  };

  // ============================================================
  // STATUS CONFIG
  // ============================================================

  const getStatusConfig = (status) => {
    switch (status) {
      case "Pending":
      case "Confirmed":
        return {
          text: "text-yellow-700",
          bg: "bg-yellow-50",
          border: "border-yellow-200",
          dot: "bg-yellow-500",
        };

      case "Shipped":
        return {
          text: "text-blue-700",
          bg: "bg-blue-50",
          border: "border-blue-200",
          dot: "bg-blue-500",
        };

      case "Out for Delivery":
        return {
          text: "text-purple-700",
          bg: "bg-purple-50",
          border: "border-purple-200",
          dot: "bg-purple-500",
        };

      case "Delivered":
        return {
          text: "text-green-700",
          bg: "bg-green-50",
          border: "border-green-200",
          dot: "bg-green-600",
        };

      default:
        return {
          text: "text-gray-700",
          bg: "bg-gray-50",
          border: "border-gray-200",
          dot: "bg-gray-500",
        };
    }
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-72px)] bg-[#f8faf5] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto flex min-h-[400px] max-w-6xl items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-gray-200 border-t-green-700" />

            <p className="mt-4 text-sm font-medium text-gray-500">
              Loading your orders...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // ORDER SUMMARY
  // ============================================================

  const totalSpent = orders.reduce(
    (total, order) => total + Number(order.totalPrice || 0),
    0,
  );

  // ============================================================
  // MAIN
  // ============================================================

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#f8faf5] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        {actionMessage && <div role="status" className="mb-4 rounded-xl border bg-white p-3 text-sm text-slate-700">{actionMessage}</div>}
        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <span className="h-px w-7 bg-green-700" />

            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-800">
              Your Shopping
            </span>
          </div>

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h1 className="text-3xl font-semibold tracking-[-0.04em] text-gray-950 sm:text-4xl">
                My Orders
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
                View your recent purchases, track deliveries and check your
                order details.
              </p>
            </div>

            {/* SUMMARY */}

            <div className="flex items-center gap-3">
              <div className="rounded-2xl border border-gray-100 bg-white px-5 py-3 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                  Orders
                </p>

                <p className="mt-1 text-lg font-bold text-gray-950">
                  {orders.length}
                </p>
              </div>

              <div className="rounded-2xl border border-gray-100 bg-white px-5 py-3 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                  Total Spent
                </p>

                <p className="mt-1 text-lg font-bold text-green-700">
                  ₹{totalSpent.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================
            EMPTY STATE
        ====================================================== */}

        {orders.length === 0 ? (
          <div className="rounded-3xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f5f7f1]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-7 w-7 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835L5.61 6m0 0h13.14a1.5 1.5 0 0 1 1.455 1.864l-1.5 6A1.5 1.5 0 0 1 17.25 15H8.25a1.5 1.5 0 0 1-1.455-1.136L5.61 6Zm0 0L4.5 3.75M8.25 19.5h.008v.008H8.25V19.5Zm8.25 0h.008v.008H16.5V19.5Z"
                />
              </svg>
            </div>

            <h2 className="mt-5 text-xl font-semibold text-gray-950">
              No orders yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              You haven't placed any orders yet. Start exploring our fresh
              collection.
            </p>

            <Link
              to="/products"
              className="
                mt-6
                inline-flex
                min-h-[46px]
                items-center
                justify-center
                gap-2
                rounded-full
                bg-gray-950
                px-6
                text-sm
                font-semibold
                text-white
                transition-all
                duration-300
                hover:bg-green-700
                active:scale-[0.98]
              "
            >
              Browse Products
              <span>→</span>
            </Link>
          </div>
        ) : (
          /* ====================================================
             ORDERS LIST
          ==================================================== */

          <div className="space-y-6">
            {orders.map((order) => {
              const status = getStatusConfig(order.status);

              return (
                <div
                  key={order._id}
                  className="
                    overflow-hidden
                    rounded-3xl
                    border
                    border-gray-100
                    bg-white
                    shadow-sm
                    transition-all
                    duration-300
                    hover:shadow-md
                  "
                >
                  {/* ==========================================
                      ORDER HEADER
                  ========================================== */}

                  <div className="border-b border-gray-100 px-5 py-5 sm:px-7">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-sm font-semibold text-gray-950">
                            Order
                          </span>

                          <span className="rounded-full bg-gray-100 px-3 py-1 font-mono text-[10px] text-gray-500">
                            #{order._id?.slice(-8)}
                          </span>
                        </div>

                        <p className="mt-2 break-all text-[11px] text-gray-400">
                          Order ID: {order._id}
                        </p>
                      </div>

                      {/* STATUS + TRACK */}

                      <div className="flex flex-wrap items-center gap-2">
                        <div
                          className={`
                            inline-flex
                            items-center
                            gap-2
                            rounded-full
                            border
                            px-3
                            py-1.5
                            text-xs
                            font-semibold
                            ${status.bg}
                            ${status.border}
                            ${status.text}
                          `}
                        >
                          <span
                            className={`
                              h-1.5
                              w-1.5
                              rounded-full
                              ${status.dot}
                            `}
                          />

                          {order.status}
                        </div>

                        {/* TRACK ORDER */}

                        <Link
                          to={`/track-order/${order._id}`}
                          className="
                            inline-flex
                            min-h-[36px]
                            items-center
                            justify-center
                            gap-2
                            rounded-full
                            bg-gray-950
                            px-4
                            text-xs
                            font-semibold
                            text-white
                            transition-all
                            duration-300
                            hover:bg-green-700
                            active:scale-[0.98]
                          "
                        >
                          Track Order
                          <span>→</span>
                        </Link>
                        {["Pending", "Confirmed", "Processing"].includes(order.status) && order.paymentStatus !== "Paid" && (
                          <button onClick={() => handleCancel(order)} className="ml-2 rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-600">Cancel order</button>
                        )}
                        {order.status === "Delivered" && (
                          <button onClick={() => handleReturn(order)} className="ml-2 rounded-full border border-amber-200 px-4 py-2 text-xs font-semibold text-amber-700">Request return</button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* ==========================================
                      ORDER TRACKER
                  ========================================== */}

                  <div className="border-b border-gray-100 px-5 py-6 sm:px-7">
                    <div className="mb-4">
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">
                        Delivery Progress
                      </p>
                    </div>

                    <OrderTracker status={order.status} />
                  </div>

                  {/* ==========================================
                      ORDER ITEMS
                  ========================================== */}

                  <div className="px-5 sm:px-7">
                    <div className="divide-y divide-gray-100">
                      {order.orderItems?.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between gap-4 py-5"
                        >
                          {/* PRODUCT */}

                          <div className="flex min-w-0 items-center gap-4">
                            {/* IMAGE */}

                            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-gray-100 bg-[#f8faf5] sm:h-20 sm:w-20">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="h-full w-full object-contain p-2"
                                />
                              ) : (
                                <span className="text-xs text-gray-400">
                                  No Image
                                </span>
                              )}
                            </div>

                            {/* INFO */}

                            <div className="min-w-0">
                              <h2 className="truncate text-sm font-semibold text-gray-950 sm:text-base">
                                {item.name}
                              </h2>

                              <p className="mt-1 text-xs text-gray-500">
                                ₹
                                {Number(item.price || 0).toLocaleString(
                                  "en-IN",
                                )}{" "}
                                × {item.qty}
                              </p>
                            </div>
                          </div>

                          {/* ITEM TOTAL */}

                          <div className="shrink-0 text-right">
                            <p className="text-sm font-bold text-gray-950 sm:text-base">
                              ₹
                              {(
                                Number(item.price || 0) * Number(item.qty || 0)
                              ).toLocaleString("en-IN")}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* ==========================================
                      ORDER TOTAL
                  ========================================== */}

                  <div className="border-t border-gray-100 bg-[#fafbf8] px-5 py-5 sm:px-7">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-gray-400">
                          Order Total
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          Final amount for this order
                        </p>
                      </div>

                      <p className="text-xl font-bold tracking-tight text-gray-950 sm:text-2xl">
                        ₹{Number(order.totalPrice || 0).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
