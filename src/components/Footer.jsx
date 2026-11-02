import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 text-white">
      {/* ============================================================
          TOP CTA
      ============================================================ */}

      <div className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="flex flex-col gap-7 rounded-3xl bg-green-700 px-6 py-8 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10 lg:py-10">
            <div className="max-w-2xl">
              <span className="mb-3 block text-xs font-bold uppercase tracking-[0.2em] text-green-100">
                Fresh & Simple
              </span>

              <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
                Fresh products, delivered to your door.
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-green-50 sm:text-base">
                Discover fresh fruits, daily essentials and great deals — all in
                one simple shopping experience.
              </p>
            </div>

            <Link
              to="/products"
              className="inline-flex min-h-[48px] shrink-0 items-center justify-center rounded-full bg-white px-7 text-sm font-bold text-gray-950 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-100"
            >
              Start Shopping
              <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* ============================================================
          MAIN FOOTER
      ============================================================ */}

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* ========================================================
              BRAND
          ======================================================== */}

          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="group inline-flex items-center gap-3">
              {/* Logo */}

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-700 text-white shadow-lg transition-transform duration-300 group-hover:scale-105">
                <span className="text-xl font-bold">W</span>
              </div>

              <div className="leading-none">
                <span className="block text-xl font-bold tracking-[-0.03em] text-white">
                  WebX
                  <span className="text-green-500">Shop</span>
                </span>

                <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                  Fresh • Simple • Better
                </span>
              </div>
            </Link>

            <p className="mt-6 max-w-sm text-sm leading-7 text-gray-400">
              Your simple destination for fresh fruits, quality products and
              everyday essentials. Shop easily and enjoy a better way to buy.
            </p>

            {/* Social Icons */}

            <div className="mt-6 flex items-center gap-3">
              {/* Instagram */}

              <a
                href="#"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 transition-all duration-300 hover:border-green-600 hover:bg-green-700 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.7"
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <rect width="18" height="18" x="3" y="3" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle
                    cx="17.5"
                    cy="6.5"
                    r="1"
                    fill="currentColor"
                    stroke="none"
                  />
                </svg>
              </a>

              {/* Facebook */}

              <a
                href="#"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 transition-all duration-300 hover:border-green-600 hover:bg-green-700 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-5 w-5"
                >
                  <path d="M13.5 21v-8h2.7l.4-3h-3.1V8.1c0-.9.3-1.5 1.6-1.5h1.7V3.9c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3V10H7.4v3h2.7v8h3.4Z" />
                </svg>
              </a>

              {/* WhatsApp */}

              <a
                href="#"
                aria-label="WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 transition-all duration-300 hover:border-green-600 hover:bg-green-700 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.7"
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 20.25 4.5 21l.75-3a8.25 8.25 0 1 1 2.25 2.25Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.75 8.75c.25-.5.5-.5.75-.5h.5c.15 0 .35.05.5.4l.75 1.75c.1.25.05.45-.1.6l-.5.6c-.15.15-.1.35 0 .5.35.65 1.1 1.55 1.9 2.1.55.4 1.2.7 1.5.8.2.1.4.05.55-.1l.65-.75c.15-.2.35-.25.6-.15l1.7.8c.25.1.4.25.4.45-.05.65-.3 1.25-.75 1.55-.4.3-1 .45-1.65.3-1.2-.25-2.7-1.1-4.15-2.4-1.25-1.15-2.2-2.5-2.65-3.5-.35-.75-.4-1.45-.2-1.95Z"
                  />
                </svg>
              </a>

              {/* X */}

              <a
                href="#"
                aria-label="X"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-gray-400 transition-all duration-300 hover:border-green-600 hover:bg-green-700 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="h-4 w-4"
                >
                  <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.25l-4.9-6.4L6.45 22H3.35l7.24-8.28L2.8 2h6.4l4.43 5.85L18.9 2Zm-1.1 17.4h1.73L8.28 4.46H6.42L17.8 19.4Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* ========================================================
              SHOP
          ======================================================== */}

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-white">
              Shop
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  to="/products"
                  className="text-sm text-gray-400 transition-colors hover:text-green-500"
                >
                  All Products
                </Link>
              </li>

              <li>
                <Link
                  to="/products?section=top-deals"
                  className="text-sm text-gray-400 transition-colors hover:text-green-500"
                >
                  Top Deals
                </Link>
              </li>

              <li>
                <Link
                  to="/products?section=featured"
                  className="text-sm text-gray-400 transition-colors hover:text-green-500"
                >
                  Featured Products
                </Link>
              </li>

              <li>
                <Link
                  to="/products?section=new-arrivals"
                  className="text-sm text-gray-400 transition-colors hover:text-green-500"
                >
                  New Arrivals
                </Link>
              </li>

              <li>
                <Link
                  to="/products?section=popular"
                  className="text-sm text-gray-400 transition-colors hover:text-green-500"
                >
                  Popular Products
                </Link>
              </li>
            </ul>
          </div>

          {/* ========================================================
              ACCOUNT
          ======================================================== */}

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-white">
              Account
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  to="/login"
                  className="text-sm text-gray-400 transition-colors hover:text-green-500"
                >
                  Login
                </Link>
              </li>

              <li>
                <Link
                  to="/cart"
                  className="text-sm text-gray-400 transition-colors hover:text-green-500"
                >
                  Shopping Cart
                </Link>
              </li>

              <li>
                <Link
                  to="/wishlist"
                  className="text-sm text-gray-400 transition-colors hover:text-green-500"
                >
                  Wishlist
                </Link>
              </li>

              <li>
                <Link
                  to="/my-orders"
                  className="text-sm text-gray-400 transition-colors hover:text-green-500"
                >
                  My Orders
                </Link>
              </li>

              <li>
                <Link
                  to="/notifications"
                  className="text-sm text-gray-400 transition-colors hover:text-green-500"
                >
                  Notifications
                </Link>
              </li>
            </ul>
          </div>

          {/* ========================================================
              HELP / CONTACT
          ======================================================== */}

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-white">
              Need Help?
            </h3>

            <ul className="mt-5 space-y-4">
              {/* Email */}

              <li className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5 text-green-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.6"
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5A2.25 2.25 0 0 1 19.5 19.5h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0-9.75 6.75L2.25 6.75"
                    />
                  </svg>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Email</p>

                  <a
                    href="mailto:support@webxshop.com"
                    className="mt-0.5 block text-sm text-gray-300 transition-colors hover:text-green-500"
                  >
                    support@webxshop.com
                  </a>
                </div>
              </li>

              {/* Phone */}

              <li className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5 text-green-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.6"
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 6.75c0-1.243 1.007-2.25 2.25-2.25h2.25c.966 0 1.803.617 2.111 1.485l.956 2.71a2.25 2.25 0 0 1-.502 2.25l-1.142 1.142a16.5 16.5 0 0 0 6.49 6.49l1.142-1.142a2.25 2.25 0 0 1 2.25-.502l2.71.956A2.25 2.25 0 0 1 20.25 20.25V18A2.25 2.25 0 0 1 18 15.75C9.16 15.75 2.25 8.84 2.25 0Z"
                    />
                  </svg>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Phone</p>

                  <a
                    href="tel:+919999999999"
                    className="mt-0.5 block text-sm text-gray-300 transition-colors hover:text-green-500"
                  >
                    +91 99999 99999
                  </a>
                </div>
              </li>

              {/* Location */}

              <li className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/5 text-green-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.6"
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                    />
                  </svg>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Location</p>

                  <p className="mt-0.5 text-sm leading-5 text-gray-300">
                    Maharashtra, India
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ============================================================
          BOTTOM BAR
      ============================================================ */}

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p className="text-xs leading-5 text-gray-500">
            © {currentYear} WebXShop. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link
              to="/"
              className="text-xs text-gray-500 transition-colors hover:text-green-500"
            >
              Privacy Policy
            </Link>

            <Link
              to="/"
              className="text-xs text-gray-500 transition-colors hover:text-green-500"
            >
              Terms & Conditions
            </Link>

            <Link
              to="/"
              className="text-xs text-gray-500 transition-colors hover:text-green-500"
            >
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
