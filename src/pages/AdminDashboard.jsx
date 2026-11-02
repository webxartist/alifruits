import { Link } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";

import {
  getAdminStats,
  getAllUsers,
  getAllProducts,
  getAllOrders,
  deleteUser,
  deleteProduct,
  getMonthlyRevenue,
  getPendingProducts,
  approveProduct,
  rejectProduct,
  updateAdminProductControls,
  updateAdminOrderStatus,
} from "../services/api";

import { exportExcelReport, exportPDFReport } from "../utils/exportReports";

import { addNotification } from "../utils/notifications";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [revenue, setRevenue] = useState([]);
  const [previousOrderCount, setPreviousOrderCount] = useState(0);
  const [pendingProducts, setPendingProducts] = useState([]);

  // ============================================================
  // FETCH ALL DASHBOARD DATA
  // ============================================================

  const fetchDashboardData = useCallback(async () => {
    try {
      const user = JSON.parse(localStorage.getItem("userInfo"));

      if (!user?.token) {
        return;
      }

      const statsData = await getAdminStats(user.token);
      const usersData = await getAllUsers(user.token);
      const productsData = await getAllProducts(user.token);
      const pendingProductsData = await getPendingProducts(user.token);
      const ordersData = await getAllOrders(user.token);
      const revenueData = await getMonthlyRevenue(user.token);

      // ========================================================
      // NORMALIZE API RESPONSES
      // ========================================================

      const safeUsers = Array.isArray(usersData)
        ? usersData
        : usersData?.users || [];

      const safeProducts = Array.isArray(productsData)
        ? productsData
        : productsData?.products || [];

      const safePendingProducts = Array.isArray(pendingProductsData)
        ? pendingProductsData
        : pendingProductsData?.products || [];

      const safeOrders = Array.isArray(ordersData)
        ? ordersData
        : ordersData?.orders || [];

      const safeRevenue = Array.isArray(revenueData)
        ? revenueData
        : revenueData?.revenue || [];

      // ========================================================
      // NEW ORDER NOTIFICATION
      // ========================================================

      if (previousOrderCount > 0 && safeOrders.length > previousOrderCount) {
        const latestOrder = safeOrders[safeOrders.length - 1];

        addNotification(
          "New Order from " +
            (latestOrder?.user?.name || "Customer") +
            " - Rs." +
            Number(latestOrder?.totalPrice || 0).toLocaleString("en-IN"),
        );
      }

      setPreviousOrderCount(safeOrders.length);

      setStats(statsData);
      setUsers(safeUsers);
      setProducts(safeProducts);
      setPendingProducts(safePendingProducts);
      setOrders(safeOrders);
      setRevenue(safeRevenue);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    }
  }, [previousOrderCount]);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 5000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  // ============================================================
  // DELETE USER
  // ============================================================

  const handleDeleteUser = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmed) {
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("userInfo"));

      if (!user?.token) {
        addNotification("Admin session not found");
        return;
      }

      await deleteUser(id, user.token);

      setUsers((prev) => prev.filter((u) => u._id !== id));

      addNotification("User deleted successfully");
    } catch (error) {
      console.error("Delete user error:", error);

      addNotification(error.message || "Failed to delete user");
    }
  };

  // ============================================================
  // DELETE PRODUCT
  // ============================================================

  const handleDeleteProduct = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmed) {
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("userInfo"));

      if (!user?.token) {
        addNotification("Admin session not found");
        return;
      }

      await deleteProduct(id, user.token);

      setProducts((prev) => prev.filter((p) => p._id !== id));

      addNotification("Product deleted successfully");
    } catch (error) {
      console.error("Delete product error:", error);

      addNotification(error.message || "Failed to delete product");
    }
  };

  // ============================================================
  // APPROVE PRODUCT
  // ============================================================

  const handleApproveProduct = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to approve this product?",
    );

    if (!confirmed) {
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("userInfo"));

      if (!user?.token) {
        addNotification("Admin session not found");
        return;
      }

      await approveProduct(id, user.token);

      setPendingProducts((prev) =>
        prev.filter((product) => product._id !== id),
      );

      addNotification("Product approved successfully");

      // Refresh all products
      const productsResponse = await getAllProducts(user.token);

      const productsData = Array.isArray(productsResponse)
        ? productsResponse
        : productsResponse?.products || [];

      setProducts(productsData);

      // Refresh dashboard statistics
      const statsResponse = await getAdminStats(user.token);

      setStats(statsResponse);
    } catch (error) {
      console.error("Approve product error:", error);

      addNotification(error.message || "Failed to approve product");
    }
  };

  // ============================================================
  // REJECT PRODUCT
  // ============================================================

  const handleRejectProduct = async (id) => {
    const reason = window.prompt(
      "Enter rejection reason:",
      "Product does not meet store requirements",
    );

    if (reason === null) {
      return;
    }

    const trimmedReason = reason.trim();

    if (!trimmedReason) {
      addNotification("Rejection reason is required");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("userInfo"));

      if (!user?.token) {
        addNotification("Admin session not found");
        return;
      }

      await rejectProduct(id, user.token, trimmedReason);

      setPendingProducts((prev) =>
        prev.filter((product) => product._id !== id),
      );

      addNotification("Product rejected successfully");

      // Refresh all products
      const productsResponse = await getAllProducts(user.token);

      const productsData = Array.isArray(productsResponse)
        ? productsResponse
        : productsResponse?.products || [];

      setProducts(productsData);

      // Refresh dashboard statistics
      const statsResponse = await getAdminStats(user.token);

      setStats(statsResponse);
    } catch (error) {
      console.error("Reject product error:", error);

      addNotification(error.message || "Failed to reject product");
    }
  };

  // ============================================================
  // UPDATE ADMIN PRODUCT CONTROLS
  // ============================================================
  //
  // Admin controls:
  // - Active
  // - Top Deal
  // - Featured
  // - New Arrival
  // - Popular
  //
  // ============================================================

  const handleUpdateProductControls = async (productId, controls) => {
    try {
      const user = JSON.parse(localStorage.getItem("userInfo"));

      if (!user?.token) {
        addNotification("Admin session not found");
        return;
      }

      const response = await updateAdminProductControls(
        productId,
        controls,
        user.token,
      );

      const updatedProduct = response?.product;

      if (updatedProduct) {
        setProducts((prev) =>
          prev.map((product) =>
            product._id === productId ? updatedProduct : product,
          ),
        );
      } else {
        setProducts((prev) =>
          prev.map((product) =>
            product._id === productId
              ? {
                  ...product,
                  ...controls,
                }
              : product,
          ),
        );
      }

      addNotification("Product settings updated successfully");
    } catch (error) {
      console.error("Update product controls error:", error);

      addNotification(error.message || "Failed to update product settings");
    }
  };

  // ============================================================
  // UPDATE ORDER STATUS
  // ============================================================

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      if (!user?.token) throw new Error("Admin session not found");
      const response = await updateAdminOrderStatus(orderId, status, user.token);
      if (response?.order) {
        setOrders((prev) => prev.map((order) => order._id === orderId ? response.order : order));
      }
      addNotification(`Order status updated to ${status}`);
    } catch (error) {
      console.error("Update order status error:", error);
      addNotification(error.message || "Failed to update order status");
    }
  };

  // ============================================================
  // TOGGLE PRODUCT CONTROL
  // ============================================================

  const handleToggleProductControl = async (product, field) => {
    if (product.status !== "approved") {
      addNotification(
        "Only approved products can be added to homepage sections",
      );
      return;
    }

    const newValue = !product[field];

    await handleUpdateProductControls(product._id, {
      [field]: newValue,
    });
  };

  // ============================================================
  // LOADING STATE
  // ============================================================

  if (!stats) {
    return (
      <div className="min-h-screen bg-[#f8faf5]">
      <div className="mb-5 flex flex-wrap gap-3"><Link to="/admin/store-settings" className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">Store settings & website controls →</Link><Link to="/admin/fulfillment" className="rounded-xl border bg-white px-4 py-3 text-sm font-semibold">Orders, shipping & returns →</Link><Link to="/admin/hero-banners" className="rounded-xl border bg-white px-4 py-3 text-sm font-semibold">Manage homepage banners →</Link></div>
      
        <div className="mx-auto flex min-h-[70vh] max-w-[1920px] items-center justify-center px-4">
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
              <div className="h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-green-700" />
            </div>

            <h2 className="mt-5 text-lg font-semibold text-gray-950">
              Loading dashboard
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Fetching your latest store data...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // CHART DATA
  // ============================================================

  const chartData = [
    {
      name: "Users",
      value: stats.users || 0,
    },
    {
      name: "Products",
      value: stats.products || 0,
    },
    {
      name: "Orders",
      value: stats.orders || 0,
    },
    {
      name: "Sales",
      value: stats.totalSales || 0,
    },
  ];

  // ============================================================
  // STATUS COLOR
  // ============================================================

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-50 text-amber-700 border-amber-200";

      case "Shipped":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "Out for Delivery":
        return "bg-purple-50 text-purple-700 border-purple-200";

      case "Delivered":
        return "bg-green-50 text-green-700 border-green-200";

      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-200";

      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  // ============================================================
  // PRODUCT APPROVAL STATUS
  // ============================================================

  const getProductStatusClass = (status) => {
    switch (status) {
      case "approved":
        return "border-green-200 bg-green-50 text-green-700";

      case "rejected":
        return "border-red-200 bg-red-50 text-red-700";

      case "pending":
        return "border-amber-200 bg-amber-50 text-amber-700";

      default:
        return "border-gray-200 bg-gray-50 text-gray-700";
    }
  };

  // ============================================================
  // DASHBOARD
  // ============================================================

  return (
    <div className="min-h-screen bg-[#f8faf5]">
      <div className="mx-auto w-full max-w-[1920px] px-4 py-6 sm:px-6 lg:px-8 xl:px-10">
        <div className="mb-5 flex flex-wrap gap-3"><Link to="/admin/store-settings" className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white">Store settings & website controls →</Link><Link to="/admin/fulfillment" className="rounded-xl border bg-white px-4 py-3 text-sm font-semibold">Orders, shipping & returns →</Link><Link to="/admin/hero-banners" className="rounded-xl border bg-white px-4 py-3 text-sm font-semibold">Manage homepage banners →</Link></div>
        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-px w-7 bg-green-700" />

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-800">
                WebXShop Administration
              </span>
            </div>

            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-gray-950 sm:text-4xl">
              Admin Dashboard
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">
              Monitor your store, orders, customers, products and revenue from
              one place.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start rounded-full border border-green-100 bg-white px-4 py-2 shadow-sm md:self-auto">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />

              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-600" />
            </span>

            <span className="text-xs font-semibold text-gray-700">
              Live Dashboard
            </span>
          </div>
        </div>

        {/* =====================================================
            KPI CARDS
        ====================================================== */}

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {/* USERS */}

          <div className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">
                  Total Users
                </p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-950">
                  {stats.users || 0}
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f5f7f1] text-green-700">
                Users
              </div>
            </div>

            <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-gray-100">
              <div className="h-full w-3/4 rounded-full bg-green-700" />
            </div>
          </div>

          {/* PRODUCTS */}

          <div className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">
                  Total Products
                </p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-950">
                  {stats.products || 0}
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f5f7f1] text-green-700">
                Products
              </div>
            </div>

            <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-gray-100">
              <div className="h-full w-2/3 rounded-full bg-green-700" />
            </div>
          </div>

          {/* ORDERS */}

          <div className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">
                  Total Orders
                </p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-950">
                  {stats.orders || 0}
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f5f7f1] text-green-700">
                Orders
              </div>
            </div>

            <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-gray-100">
              <div className="h-full w-1/2 rounded-full bg-green-700" />
            </div>
          </div>

          {/* SALES */}

          <div className="group rounded-2xl border border-gray-100 bg-gray-950 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-400">
                  Total Sales
                </p>

                <h2 className="mt-3 text-3xl font-bold tracking-tight text-white">
                  Rs.{Number(stats.totalSales || 0).toLocaleString("en-IN")}
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-green-400">
                Rs.
              </div>
            </div>

            <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-4/5 rounded-full bg-green-500" />
            </div>
          </div>
        </div>

        {/* =====================================================
            EXPORT BUTTONS
        ====================================================== */}

        <div className="mb-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => exportExcelReport(stats)}
            className="flex min-h-[46px] items-center justify-center gap-2 rounded-full bg-gray-950 px-6 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-green-700 hover:shadow-md active:scale-[0.98]"
          >
            Export Excel
          </button>

          <button
            type="button"
            onClick={() => exportPDFReport(stats)}
            className="flex min-h-[46px] items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-6 text-sm font-semibold text-gray-800 shadow-sm transition-all duration-300 hover:border-green-700 hover:text-green-700 active:scale-[0.98]"
          >
            Export PDF
          </button>
        </div>

        {/* =====================================================
            PENDING PRODUCTS
        ====================================================== */}

        <div className="mb-8 rounded-2xl border border-amber-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-3 border-b border-amber-100 px-5 py-5 sm:flex-row sm:items-center sm:px-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-700">
                  Product Review
                </span>

                {pendingProducts.length > 0 && (
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-800">
                    Action Required
                  </span>
                )}
              </div>

              <h2 className="mt-1 text-xl font-semibold tracking-tight text-gray-950">
                Pending Products
              </h2>

              <p className="mt-1 text-xs text-gray-400">
                Review products before making them available to
                customers.
              </p>
            </div>

            <span className="w-fit rounded-full bg-amber-50 px-4 py-2 text-xs font-bold text-amber-800">
              {pendingProducts.length} Pending
            </span>
          </div>

          <div className="p-5 sm:p-6">
            {pendingProducts.length === 0 ? (
              <div className="py-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-2xl">
                  Done
                </div>

                <p className="mt-4 text-sm font-semibold text-gray-700">
                  No pending products
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  All products have been reviewed.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingProducts.map((product) => (
                  <div
                    key={product._id}
                    className="rounded-2xl border border-gray-100 bg-[#fafbf8] p-4 transition-all duration-300 hover:border-amber-200 hover:bg-[#f5f7f1] sm:p-5"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      {/* PRODUCT INFO */}

                      <div className="flex min-w-0 items-center gap-4">
                        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-white">
                          {product.image ? (
                            <img
                              src={product.image}
                              alt={product.name || "Product"}
                              className="h-full w-full object-contain p-1"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-[#f5f7f1] text-xs">
                              Product
                            </div>
                          )}
                        </div>

                        <div className="min-w-0">
                          <h3 className="truncate text-sm font-bold text-gray-900 sm:text-base">
                            {product.name || "Unnamed Product"}
                          </h3>

                          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-400">
                            {product.category && (
                              <span>Category: {product.category}</span>
                            )}

                            {product.stock !== undefined && (
                              <span>Stock: {product.stock}</span>
                            )}

                            {product.price !== undefined && (
                              <span className="font-semibold text-gray-700">
                                Rs.
                                {Number(product.price).toLocaleString("en-IN")}
                              </span>
                            )}
                          </div>

                          {product.vendor && (
                            <p className="mt-1 text-[11px] text-gray-400">
                              Source:{" "}
                              {product.vendor.name ||
                                product.vendor.email ||
                                "Vendor"}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* ACTIONS */}

                      <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                        <button
                          type="button"
                          onClick={() => handleApproveProduct(product._id)}
                          className="min-h-[42px] rounded-full bg-green-700 px-5 text-xs font-bold text-white shadow-sm transition-all duration-300 hover:bg-green-800 hover:shadow-md active:scale-[0.98]"
                        >
                          Approve
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRejectProduct(product._id)}
                          className="min-h-[42px] rounded-full border border-red-200 bg-white px-5 text-xs font-bold text-red-600 transition-all duration-300 hover:bg-red-50 active:scale-[0.98]"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* =====================================================
            ANALYTICS GRID
        ====================================================== */}

        <div className="mb-8 grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* BAR CHART */}

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-green-700">
                  Overview
                </p>

                <h2 className="mt-1 text-xl font-semibold tracking-tight text-gray-950">
                  Store Analytics
                </h2>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f7f1] text-green-700">
                Analytics
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#eeeeee"
                  />

                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />

                  <Tooltip
                    cursor={{ fill: "#f5f7f1" }}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #eeeeee",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                    }}
                  />

                  <Bar
                    dataKey="value"
                    fill="#15803d"
                    radius={[8, 8, 0, 0]}
                    maxBarSize={55}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* REVENUE CHART */}

          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-green-700">
                  Revenue
                </p>

                <h2 className="mt-1 text-xl font-semibold tracking-tight text-gray-950">
                  Monthly Revenue
                </h2>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f5f7f1] text-green-700">
                Revenue
              </div>
            </div>

            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenue}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#eeeeee"
                  />

                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12 }}
                  />

                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #eeeeee",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#15803d"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      fill: "#15803d",
                    }}
                    activeDot={{
                      r: 6,
                    }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* =====================================================
            ALL ORDERS
        ====================================================== */}

        <div className="mb-8 rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-5 py-5 sm:px-6">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-green-700">
                  Orders
                </p>

                <h2 className="mt-1 text-xl font-semibold tracking-tight text-gray-950">
                  All Orders
                </h2>
              </div>

              <span className="w-fit rounded-full bg-[#f5f7f1] px-3 py-1.5 text-xs font-semibold text-green-800">
                {orders.length} Total
              </span>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            {orders.length === 0 ? (
              <div className="py-10 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f5f7f1] text-2xl">
                  Orders
                </div>

                <p className="mt-4 text-sm font-semibold text-gray-700">
                  No orders found
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  New customer orders will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order._id}
                    className="rounded-2xl border border-gray-100 bg-[#fafbf8] p-4 transition-colors duration-300 hover:bg-[#f5f7f1] sm:p-5"
                  >
                    {/* ORDER HEADER */}

                    <div className="flex flex-col justify-between gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-center">
                      <div>
                        <p className="text-sm font-semibold text-gray-950">
                          {order.user?.name || "Customer"}
                        </p>

                        {order.user?.email && (
                          <p className="mt-1 text-xs text-gray-400">
                            {order.user.email}
                          </p>
                        )}
                      </div>

                      <span
                        className={`w-fit rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClass(
                          order.status,
                        )}`}
                      >
                        {order.status}
                      </span>

                      <select
                        value={order.status || "Pending"}
                        onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                        className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 outline-none"
                      >
                        {['Pending','Confirmed','Shipped','Out for Delivery','Delivered','Cancelled'].map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>

                    {/* ITEMS */}

                    <div className="py-4">
                      {order.orderItems?.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between gap-4 py-2 text-sm"
                        >
                          <span className="truncate text-gray-700">
                            {item.name}
                          </span>

                          <span className="shrink-0 text-gray-500">
                            Rs.
                            {Number(item.price).toLocaleString("en-IN")} x{" "}
                            {item.qty}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* TOTAL */}

                    <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                      <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        Order Total
                      </span>

                      <span className="text-lg font-bold text-gray-950">
                        Rs.
                        {Number(order.totalPrice || 0).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* =====================================================
            USERS + PRODUCTS
        ====================================================== */}

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* USERS */}

          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 sm:px-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-green-700">
                  Customers
                </p>

                <h2 className="mt-1 text-xl font-semibold tracking-tight text-gray-950">
                  Users
                </h2>
              </div>

              <span className="rounded-full bg-[#f5f7f1] px-3 py-1.5 text-xs font-semibold text-green-800">
                {users.length}
              </span>
            </div>

            <div className="max-h-[500px] overflow-y-auto p-4 sm:p-5">
              {users.length === 0 ? (
                <div className="py-10 text-center text-sm text-gray-400">
                  No users found.
                </div>
              ) : (
                <div className="space-y-2">
                  {users.map((u) => (
                    <div
                      key={u._id}
                      className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 bg-[#fafbf8] p-3 transition-colors hover:bg-[#f5f7f1]"
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-700 text-xs font-bold text-white">
                          {u.name?.charAt(0)?.toUpperCase() || "U"}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-gray-800">
                            {u.name}
                          </p>

                          {u.email && (
                            <p className="truncate text-[11px] text-gray-400">
                              {u.email}
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteUser(u._id)}
                        className="shrink-0 rounded-full border border-red-100 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ===================================================
              PRODUCTS
          ==================================================== */}

          <div className="rounded-2xl border border-gray-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-5 sm:px-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-green-700">
                  Inventory & Homepage Controls
                </p>

                <h2 className="mt-1 text-xl font-semibold tracking-tight text-gray-950">
                  Products
                </h2>
              </div>

              <span className="rounded-full bg-[#f5f7f1] px-3 py-1.5 text-xs font-semibold text-green-800">
                {products.length}
              </span>
            </div>

            <div className="max-h-[800px] overflow-y-auto p-4 sm:p-5">
              {products.length === 0 ? (
                <div className="py-10 text-center text-sm text-gray-400">
                  No products found.
                </div>
              ) : (
                <div className="space-y-4">
                  {products.map((p) => (
                    <div
                      key={p._id}
                      className="rounded-2xl border border-gray-100 bg-[#fafbf8] p-4 transition-all duration-300 hover:border-green-100 hover:bg-[#f5f7f1]"
                    >
                      {/* PRODUCT HEADER */}

                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-white">
                            {p.image ? (
                              <img
                                src={p.image}
                                alt={p.name || "Product"}
                                className="h-full w-full object-contain p-1"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-[#f5f7f1] text-xs">
                                Product
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-gray-900">
                              {p.name || "Unnamed Product"}
                            </p>

                            {p.category && (
                              <p className="mt-1 truncate text-[11px] text-gray-400">
                                {p.category}
                              </p>
                            )}

                            <div className="mt-1 flex flex-wrap items-center gap-2">
                              {/* STATUS */}

                              <span
                                className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold ${getProductStatusClass(
                                  p.status,
                                )}`}
                              >
                                {p.status || "approved"}
                              </span>

                              {/* ACTIVE STATUS */}

                              <span
                                className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-semibold ${
                                  p.isActive
                                    ? "border-green-200 bg-green-50 text-green-700"
                                    : "border-gray-200 bg-gray-100 text-gray-500"
                                }`}
                              >
                                {p.isActive ? "Active" : "Inactive"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* PRODUCT ACTIONS */}

                        <div className="flex shrink-0 items-center gap-2">
                          <button
                            type="button"
                            onClick={() => (window.location.href = `/admin/products/${p._id}/edit`)}
                            className="rounded-full border border-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-50"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(p._id)}
                            className="rounded-full border border-red-100 px-3 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      {/* PRODUCT DETAILS */}

                      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
                        <div className="rounded-xl border border-gray-100 bg-white p-3">
                          <p className="text-[9px] font-bold uppercase tracking-wide text-gray-400">
                            Price
                          </p>

                          <p className="mt-1 text-sm font-bold text-gray-900">
                            Rs.
                            {Number(p.price || 0).toLocaleString("en-IN")}
                          </p>
                        </div>

                        <div className="rounded-xl border border-gray-100 bg-white p-3">
                          <p className="text-[9px] font-bold uppercase tracking-wide text-gray-400">
                            Stock
                          </p>

                          <p className="mt-1 text-sm font-bold text-gray-900">
                            {p.stock ?? 0}
                          </p>
                        </div>

                        <div className="rounded-xl border border-gray-100 bg-white p-3">
                          <p className="text-[9px] font-bold uppercase tracking-wide text-gray-400">
                            Source
                          </p>

                          <p className="mt-1 truncate text-sm font-bold text-gray-900">
                            {p.vendor?.name || p.vendor?.email || "Admin"}
                          </p>
                        </div>

                        <div className="rounded-xl border border-gray-100 bg-white p-3">
                          <p className="text-[9px] font-bold uppercase tracking-wide text-gray-400">
                            Homepage
                          </p>

                          <p className="mt-1 text-sm font-bold text-green-700">
                            {[
                              p.isTopDeal && "Top Deal",
                              p.featured && "Featured",
                              p.isNewArrival && "New",
                              p.isPopular && "Popular",
                            ]
                              .filter(Boolean)
                              .join(", ") || "None"}
                          </p>
                        </div>
                      </div>

                      {/* ADMIN CONTROLS */}

                      {p.status === "approved" ? (
                        <div className="mt-4 rounded-2xl border border-green-100 bg-white p-4">
                          <div className="mb-3">
                            <p className="text-xs font-bold uppercase tracking-[0.12em] text-green-700">
                              Admin Controls
                            </p>

                            <p className="mt-1 text-[11px] text-gray-400">
                              Choose where this approved product appears in the
                              store.
                            </p>
                          </div>

                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            {/* ACTIVE */}

                            <button
                              type="button"
                              onClick={() =>
                                handleToggleProductControl(p, "isActive")
                              }
                              className={`flex items-center justify-between rounded-xl border p-3 text-left transition-all ${
                                p.isActive
                                  ? "border-green-200 bg-green-50"
                                  : "border-gray-200 bg-gray-50"
                              }`}
                            >
                              <div>
                                <p className="text-xs font-bold text-gray-900">
                                  Store Active
                                </p>

                                <p className="mt-0.5 text-[10px] text-gray-400">
                                  Show product in store
                                </p>
                              </div>

                              <span
                                className={`relative h-6 w-11 rounded-full transition-colors ${
                                  p.isActive ? "bg-green-600" : "bg-gray-300"
                                }`}
                              >
                                <span
                                  className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                                    p.isActive
                                      ? "translate-x-6"
                                      : "translate-x-1"
                                  }`}
                                />
                              </span>
                            </button>

                            {/* TOP DEAL */}

                            <button
                              type="button"
                              onClick={() =>
                                handleToggleProductControl(p, "isTopDeal")
                              }
                              className={`flex items-center justify-between rounded-xl border p-3 text-left transition-all ${
                                p.isTopDeal
                                  ? "border-green-200 bg-green-50"
                                  : "border-gray-200 bg-gray-50"
                              }`}
                            >
                              <div>
                                <p className="text-xs font-bold text-gray-900">
                                  Top Deal
                                </p>

                                <p className="mt-0.5 text-[10px] text-gray-400">
                                  Show in Top Deals
                                </p>
                              </div>

                              <span
                                className={`relative h-6 w-11 rounded-full transition-colors ${
                                  p.isTopDeal ? "bg-green-600" : "bg-gray-300"
                                }`}
                              >
                                <span
                                  className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                                    p.isTopDeal
                                      ? "translate-x-6"
                                      : "translate-x-1"
                                  }`}
                                />
                              </span>
                            </button>

                            {/* FEATURED */}

                            <button
                              type="button"
                              onClick={() =>
                                handleToggleProductControl(p, "featured")
                              }
                              className={`flex items-center justify-between rounded-xl border p-3 text-left transition-all ${
                                p.featured
                                  ? "border-green-200 bg-green-50"
                                  : "border-gray-200 bg-gray-50"
                              }`}
                            >
                              <div>
                                <p className="text-xs font-bold text-gray-900">
                                  Featured
                                </p>

                                <p className="mt-0.5 text-[10px] text-gray-400">
                                  Show in Featured
                                </p>
                              </div>

                              <span
                                className={`relative h-6 w-11 rounded-full transition-colors ${
                                  p.featured ? "bg-green-600" : "bg-gray-300"
                                }`}
                              >
                                <span
                                  className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                                    p.featured
                                      ? "translate-x-6"
                                      : "translate-x-1"
                                  }`}
                                />
                              </span>
                            </button>

                            {/* NEW ARRIVAL */}

                            <button
                              type="button"
                              onClick={() =>
                                handleToggleProductControl(p, "isNewArrival")
                              }
                              className={`flex items-center justify-between rounded-xl border p-3 text-left transition-all ${
                                p.isNewArrival
                                  ? "border-green-200 bg-green-50"
                                  : "border-gray-200 bg-gray-50"
                              }`}
                            >
                              <div>
                                <p className="text-xs font-bold text-gray-900">
                                  New Arrival
                                </p>

                                <p className="mt-0.5 text-[10px] text-gray-400">
                                  Show in New Arrivals
                                </p>
                              </div>

                              <span
                                className={`relative h-6 w-11 rounded-full transition-colors ${
                                  p.isNewArrival
                                    ? "bg-green-600"
                                    : "bg-gray-300"
                                }`}
                              >
                                <span
                                  className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                                    p.isNewArrival
                                      ? "translate-x-6"
                                      : "translate-x-1"
                                  }`}
                                />
                              </span>
                            </button>

                            {/* POPULAR */}

                            <button
                              type="button"
                              onClick={() =>
                                handleToggleProductControl(p, "isPopular")
                              }
                              className={`flex items-center justify-between rounded-xl border p-3 text-left transition-all sm:col-span-2`}
                            >
                              <div>
                                <p className="text-xs font-bold text-gray-900">
                                  Popular
                                </p>

                                <p className="mt-0.5 text-[10px] text-gray-400">
                                  Show in Popular Products
                                </p>
                              </div>

                              <span
                                className={`relative h-6 w-11 rounded-full transition-colors ${
                                  p.isPopular ? "bg-green-600" : "bg-gray-300"
                                }`}
                              >
                                <span
                                  className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                                    p.isPopular
                                      ? "translate-x-6"
                                      : "translate-x-1"
                                  }`}
                                />
                              </span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 p-3">
                          <p className="text-xs font-semibold text-amber-800">
                            Homepage controls become available after this
                            product is approved.
                          </p>
                        </div>
                      )}

                      {/* REJECTION REASON */}

                      {p.status === "rejected" && p.rejectionReason && (
                        <div className="mt-3 rounded-xl border border-red-100 bg-red-50 p-3">
                          <p className="text-[10px] font-bold uppercase tracking-wide text-red-600">
                            Rejection Reason
                          </p>

                          <p className="mt-1 text-xs text-red-700">
                            {p.rejectionReason}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
