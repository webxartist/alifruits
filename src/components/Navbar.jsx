import { Link, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import { io } from "socket.io-client";
import { getCartCount } from "../utils/cart";
import { getNotifications } from "../utils/notifications";
import { getPublicSiteSettings } from "../services/api";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useContext(UserContext);

  // ============================================================
  // NOTIFICATION STATES
  // ============================================================

  const [notifications, setNotifications] = useState(getNotifications);
  const [showDropdown, setShowDropdown] = useState(false);
  const [storeAnnouncement, setStoreAnnouncement] = useState("");

  // ============================================================
  // MOBILE MENU
  // ============================================================

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let active = true;
    getPublicSiteSettings().then((result) => {
      if (active) setStoreAnnouncement(result?.settings?.announcement || "");
    }).catch(() => {});
    return () => { active = false; };
  }, []);

  // ============================================================
  // CART COUNT
  // ============================================================

  const [cartCount, setCartCount] = useState(getCartCount);

  // ============================================================
  // LOAD CART COUNT
  // ============================================================

  const loadCartCount = () => {
    try {
      setCartCount(getCartCount());
    } catch (error) {
      console.error("Cart count loading error:", error);
      setCartCount(0);
    }
  };

  // ============================================================
  // LOAD NOTIFICATIONS
  // ============================================================

  const loadNotifications = () => {
    try {
      const data = JSON.parse(localStorage.getItem("notifications")) || [];

      setNotifications(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Notification loading error:", error);
      setNotifications([]);
    }
  };

  // ============================================================
  // CART + SOCKET + AUTO REFRESH
  // ============================================================

  useEffect(() => {
    // ============================================================
    // CART UPDATE EVENT
    // ============================================================

    const handleCartUpdate = () => {
      loadCartCount();
    };

    window.addEventListener("cartUpdated", handleCartUpdate);

    // ============================================================
    // STORAGE EVENT
    // Useful when cart changes from another browser tab
    // ============================================================

    const handleStorageChange = (event) => {
      if (event.key === "cart") {
        loadCartCount();
      }

      if (event.key === "notifications") {
        loadNotifications();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // ============================================================
    // SOCKET CONNECTION
    // ============================================================

    const socket = io("http://localhost:5000");

    socket.on("newNotification", (newNote) => {
      try {
        const existing =
          JSON.parse(localStorage.getItem("notifications")) || [];

        const updated = [newNote, ...existing];

        localStorage.setItem("notifications", JSON.stringify(updated));

        setNotifications(updated);
      } catch (error) {
        console.error("Socket notification error:", error);
      }
    });

    // ============================================================
    // AUTO REFRESH
    // ============================================================

    const interval = setInterval(() => {
      loadNotifications();
      loadCartCount();
    }, 1000);

    // ============================================================
    // CLEANUP
    // ============================================================

    return () => {
      socket.disconnect();

      clearInterval(interval);

      window.removeEventListener("cartUpdated", handleCartUpdate);

      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // ============================================================
  // CLOSE MOBILE MENU
  // ============================================================

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  // ============================================================
  // CLEAR NOTIFICATIONS
  // ============================================================

  const clearAllNotifications = () => {
    localStorage.removeItem("notifications");
    setNotifications([]);
  };

  // ============================================================
  // LOGOUT
  // ============================================================

  const handleLogout = () => {
    logout();

    setMobileMenuOpen(false);
    setShowDropdown(false);

    navigate("/login");
  };

  // ============================================================
  // NAVIGATION LINK STYLE
  // ============================================================

  const navLinkClass =
    "relative text-sm font-medium text-gray-700 transition-colors duration-300 hover:text-green-700";

  const mobileLinkClass =
    "flex w-full items-center rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-[#f5f7f1] hover:text-green-700";

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md">
      {storeAnnouncement && <div className="bg-green-700 px-4 py-2 text-center text-xs font-semibold text-white">{storeAnnouncement}</div>}
      <div className="mx-auto flex h-[72px] w-full max-w-[1920px] items-center justify-between px-4 sm:px-6 lg:px-8 xl:px-10">
        {/* ======================================================
            LOGO
        ====================================================== */}

        <Link
          to="/"
          onClick={closeMobileMenu}
          className="group flex items-center gap-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-700 text-white shadow-sm transition-transform duration-300 group-hover:scale-105">
            <span className="text-lg font-bold">W</span>
          </div>

          <div className="leading-none">
            <span className="block text-lg font-bold tracking-[-0.03em] text-gray-950 sm:text-xl">
              WebX
              <span className="text-green-700">Shop</span>
            </span>

            <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-400">
              Fresh • Simple • Better
            </span>
          </div>
        </Link>

        {/* ======================================================
            DESKTOP NAVIGATION
        ====================================================== */}

        <div className="hidden items-center gap-7 lg:flex">
          <Link to="/" className={navLinkClass}>
            Home
          </Link>

          <Link to="/products" className={navLinkClass}>
            Shop
          </Link>

          <Link to="/products" className={navLinkClass}>
            Collection
          </Link>

          {/* CUSTOMER */}

          {user?.role === "customer" && (
            <>
              <Link to="/my-orders" className={navLinkClass}>
                My Orders
              </Link>

              <Link to="/wishlist" className={navLinkClass}>
                Wishlist
              </Link>

              <Link to="/account" className={navLinkClass}>
                Account
              </Link>
            </>
          )}

          {/* ADMIN */}

          {user?.role === "admin" && (
            <>
              <Link to="/admin" className={navLinkClass}>
                Admin Panel
              </Link>
              <Link to="/admin/products/new" className={navLinkClass}>
                Add Product
              </Link>
            </>
          )}
        </div>

        {/* ======================================================
            RIGHT SIDE ACTIONS
        ====================================================== */}

        <div className="flex items-center gap-2 sm:gap-3">
          {/* SHOP NOW */}

          <Link
            to="/products"
            className="hidden rounded-full bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all duration-300 hover:bg-green-700 hover:shadow-md sm:inline-flex"
          >
            Shop Now
          </Link>

          {/* ====================================================
              CART
          ==================================================== */}

          {user?.role === "customer" && (
            <Link
              to="/cart"
              aria-label={`Shopping cart with ${cartCount} items`}
              className="group relative flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-800 transition-all duration-300 hover:border-green-700 hover:text-green-700"
            >
              {/* CART ICON */}

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25h10.125c.621 0 1.17-.424 1.346-1.011l1.558-5.25a1.125 1.125 0 0 0-1.078-1.449H5.106m0 0L4.25 3.75m.856 3.79 1.394 6.71a2.25 2.25 0 0 0 2.205 1.792h7.92M9 19.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm9 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1-3 0Z"
                />
              </svg>

              {/* CART BADGE */}

              {cartCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-green-700 px-1 text-[10px] font-bold leading-none text-white shadow-sm">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </Link>
          )}

          {/* ====================================================
              NOTIFICATIONS
          ==================================================== */}

          {user && (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                aria-label="Notifications"
                className="relative flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition-all duration-300 hover:border-green-700 hover:text-green-700"
              >
                {/* BELL ICON */}

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.8"
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9a6 6 0 1 0-12 0v.75c0 2.274-.855 4.35-2.261 5.918a23.848 23.848 0 0 0 5.454 1.31m5.664 0a24.255 24.255 0 0 1-5.664 0m5.664 0a3 3 0 1 1-5.664 0"
                  />
                </svg>

                {/* NOTIFICATION BADGE */}

                {notifications.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-green-700 px-1 text-[10px] font-bold text-white">
                    {notifications.length > 99 ? "99+" : notifications.length}
                  </span>
                )}
              </button>

              {/* ==================================================
                  NOTIFICATION DROPDOWN
              ================================================== */}

              {showDropdown && (
                <div className="absolute right-0 top-12 w-[320px] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">
                  {/* HEADER */}

                  <div className="flex items-center justify-between border-b border-gray-100 px-4 py-4">
                    <div>
                      <h3 className="text-sm font-bold text-gray-950">
                        Notifications
                      </h3>

                      <p className="mt-0.5 text-[11px] text-gray-400">
                        Your latest updates
                      </p>
                    </div>

                    {notifications.length > 0 && (
                      <button
                        onClick={clearAllNotifications}
                        className="text-xs font-semibold text-green-700 transition-colors hover:text-green-900"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  {/* NOTIFICATION LIST */}

                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-5 py-10 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#f5f7f1] text-gray-400">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="h-6 w-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9a6 6 0 1 0-12 0v.75c0 2.274-.855 4.35-2.261 5.918a23.848 23.848 0 0 0 5.454 1.31"
                            />
                          </svg>
                        </div>

                        <p className="mt-3 text-sm font-medium text-gray-700">
                          No notifications
                        </p>

                        <p className="mt-1 text-xs text-gray-400">
                          You're all caught up.
                        </p>
                      </div>
                    ) : (
                      notifications.map((note, index) => (
                        <div
                          key={note.id || index}
                          className="border-b border-gray-50 px-4 py-3 transition-colors hover:bg-[#f5f7f1]"
                        >
                          <p className="text-sm leading-5 text-gray-700">
                            {note.message}
                          </p>

                          {note.time && (
                            <span className="mt-1 block text-[11px] text-gray-400">
                              {note.time}
                            </span>
                          )}
                        </div>
                      ))
                    )}
                  </div>

                  {/* FOOTER */}

                  <div className="border-t border-gray-100 p-3">
                    <Link
                      to="/notifications"
                      onClick={() => setShowDropdown(false)}
                      className="flex w-full items-center justify-center rounded-full bg-[#f5f7f1] px-4 py-2.5 text-xs font-semibold text-green-800 transition-colors hover:bg-green-700 hover:text-white"
                    >
                      View All Notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ====================================================
              LOGIN / LOGOUT
          ==================================================== */}

          {!user ? (
            <Link
              to="/login"
              className="hidden rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 transition-all duration-300 hover:border-green-700 hover:text-green-700 sm:inline-flex"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={handleLogout}
              className="hidden rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 transition-all duration-300 hover:border-red-500 hover:text-red-600 sm:inline-flex"
            >
              Logout
            </button>
          )}

          {/* ====================================================
              MOBILE MENU BUTTON
          ==================================================== */}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-800 transition-all duration-300 hover:border-green-700 hover:text-green-700 lg:hidden"
          >
            {mobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.8"
                stroke="currentColor"
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================
          MOBILE NAVIGATION
      ======================================================== */}

      {mobileMenuOpen && (
        <div className="border-t border-gray-100 bg-white lg:hidden">
          <div className="mx-auto max-w-[1920px] px-4 py-4 sm:px-6">
            <div className="space-y-1">
              <Link
                to="/"
                onClick={closeMobileMenu}
                className={mobileLinkClass}
              >
                Home
              </Link>

              <Link
                to="/products"
                onClick={closeMobileMenu}
                className={mobileLinkClass}
              >
                Shop
              </Link>

              <Link
                to="/products"
                onClick={closeMobileMenu}
                className={mobileLinkClass}
              >
                Collection
              </Link>

              {/* ==================================================
                  CUSTOMER
              ================================================== */}

              {user?.role === "customer" && (
                <>
                  <Link
                    to="/cart"
                    onClick={closeMobileMenu}
                    className={`${mobileLinkClass} justify-between`}
                  >
                    <span>Shopping Cart</span>

                    {cartCount > 0 && (
                      <span className="rounded-full bg-green-700 px-2 py-0.5 text-[10px] font-bold text-white">
                        {cartCount > 99 ? "99+" : cartCount}
                      </span>
                    )}
                  </Link>

                  <Link
                    to="/my-orders"
                    onClick={closeMobileMenu}
                    className={mobileLinkClass}
                  >
                    My Orders
                  </Link>

                  <Link
                    to="/wishlist"
                    onClick={closeMobileMenu}
                    className={mobileLinkClass}
                  >
                    Wishlist
                  </Link>

                  <Link
                    to="/account"
                    onClick={closeMobileMenu}
                    className={mobileLinkClass}
                  >
                    Account
                  </Link>
                </>
              )}

              {/* ==================================================
                  ADMIN
              ================================================== */}

              {user?.role === "admin" && (
                <>
                  <Link
                    to="/admin"
                    onClick={closeMobileMenu}
                    className={mobileLinkClass}
                  >
                    Admin Panel
                  </Link>
                  <Link
                    to="/admin/products/new"
                    onClick={closeMobileMenu}
                    className={mobileLinkClass}
                  >
                    Add Product
                  </Link>
                </>
              )}

              {/* ==================================================
                  NOTIFICATIONS
              ================================================== */}

              {user && (
                <button
                  onClick={() => {
                    setShowDropdown(true);
                    setMobileMenuOpen(false);
                  }}
                  className={`${mobileLinkClass} justify-between`}
                >
                  <span>Notifications</span>

                  {notifications.length > 0 && (
                    <span className="rounded-full bg-green-700 px-2 py-0.5 text-[10px] font-bold text-white">
                      {notifications.length > 99 ? "99+" : notifications.length}
                    </span>
                  )}
                </button>
              )}

              {/* ==================================================
                  LOGIN
              ================================================== */}

              {!user && (
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="mt-3 flex w-full items-center justify-center rounded-full bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-700"
                >
                  Login
                </Link>
              )}

              {/* ==================================================
                  LOGOUT
              ================================================== */}

              {user && (
                <button
                  onClick={handleLogout}
                  className="mt-3 flex w-full items-center justify-center rounded-full border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                >
                  Logout
                </button>
              )}

              {/* ==================================================
                  SHOP NOW
              ================================================== */}

              <Link
                to="/products"
                onClick={closeMobileMenu}
                className="mt-2 flex w-full items-center justify-center rounded-full bg-green-700 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-800"
              >
                Shop Now →
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
