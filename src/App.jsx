import { BrowserRouter, Routes, Route } from "react-router-dom";

// ============================================================
// PUBLIC / CUSTOMER PAGES
// ============================================================

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Checkout from "./pages/Checkout.jsx";
import Products from "./pages/Products.jsx";
import Cart from "./pages/Cart.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Notifications from "./pages/Notifications.jsx";
import Account from "./pages/Account.jsx";
import OrderTracking from "./pages/OrderTracking.jsx";
import ProductDetails from "./pages/ProductDetails.jsx";
import AddressBook from "./pages/AddressBook.jsx";
import AdminStoreSettings from "./pages/AdminStoreSettings.jsx";
import AdminFulfillment from "./pages/AdminFulfillment.jsx";

// ============================================================
// ADMIN PRODUCT MANAGEMENT
// ============================================================

import AddProduct from "./pages/AddProduct.jsx";
import EditProduct from "./pages/EditProduct.jsx";

// ============================================================
// ADMIN PAGES
// ============================================================

import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminHeroBanners from "./pages/AdminHeroBanner.jsx";

// ============================================================
// COMPONENTS
// ============================================================

import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

// ============================================================
// APP
// ============================================================

export default function App() {
  return (
    <BrowserRouter>
      {/* ======================================================
          NAVBAR
      ====================================================== */}

      <Navbar />

      {/* ======================================================
          ROUTES
      ====================================================== */}

      <Routes>
        {/* ====================================================
            PUBLIC ROUTES
        ==================================================== */}

        <Route path="/" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="/products" element={<Products />} />

        <Route path="/product/:id" element={<ProductDetails />} />

        {/* ====================================================
            CUSTOMER ROUTES
        ==================================================== */}

        <Route path="/cart" element={<Cart />} />

        <Route path="/checkout" element={<Checkout />} />

        <Route path="/wishlist" element={<Wishlist />} />

        <Route path="/notifications" element={<Notifications />} />

        <Route
          path="/my-orders"
          element={
            <ProtectedRoute role="customer">
              <MyOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/track-order/:id"
          element={
            <ProtectedRoute role="customer">
              <OrderTracking />
            </ProtectedRoute>
          }
        />

        {/* ====================================================
            CUSTOMER ACCOUNT
        ==================================================== */}

        <Route
          path="/account/addresses"
          element={
            <ProtectedRoute role="customer">
              <AddressBook />
            </ProtectedRoute>
          }
        />

        <Route
          path="/account"
          element={
            <ProtectedRoute role="customer">
              <Account />
            </ProtectedRoute>
          }
        />

        {/* ====================================================
            ADMIN ROUTES
        ==================================================== */}

        {/* Admin Dashboard */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/fulfillment"
          element={
            <ProtectedRoute role="admin">
              <AdminFulfillment />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/store-settings"
          element={
            <ProtectedRoute role="admin">
              <AdminStoreSettings />
            </ProtectedRoute>
          }
        />

        {/* Admin Hero Banners */}

        <Route
          path="/admin/products/:id/edit"
          element={
            <ProtectedRoute role="admin">
              <EditProduct />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/products/new"
          element={
            <ProtectedRoute role="admin">
              <AddProduct />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/hero-banners"
          element={
            <ProtectedRoute role="admin">
              <AdminHeroBanners />
            </ProtectedRoute>
          }
        />

        {/* ====================================================
            404 FALLBACK
        ==================================================== */}

        <Route
          path="*"
          element={
            <div className="flex min-h-[70vh] items-center justify-center px-4">
              <div className="text-center">
                <h1 className="text-5xl font-bold text-gray-950">404</h1>

                <p className="mt-3 text-gray-500">
                  The page you're looking for doesn't exist.
                </p>

                <a
                  href="/"
                  className="
                    mt-6
                    inline-flex
                    rounded-full
                    bg-green-700
                    px-6
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-green-800
                  "
                >
                  Go Home
                </a>
              </div>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
