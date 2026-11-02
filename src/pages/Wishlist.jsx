import { useState } from "react";
import { getWishlist, removeFromWishlist } from "../utils/wishlist";
import { addToCart } from "../utils/cart";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState(getWishlist);

  // ============================================================
  // LOAD WISHLIST
  // ============================================================


  // ============================================================
  // REMOVE ITEM
  // ============================================================

  const removeItem = (id) => {
    removeFromWishlist(id);
    setWishlist(getWishlist());
  };

  // ============================================================
  // ADD TO CART
  // ============================================================

  const handleAddToCart = (item) => {
    addToCart(item);
    alert("Added to Cart 🛒");
  };

  // ============================================================
  // MAIN
  // ============================================================

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#f8faf5] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="mb-8">
          <div className="mb-3 flex items-center gap-3">
            <span className="h-px w-7 bg-green-700" />

            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-800">
              Saved For Later
            </span>
          </div>

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <h1 className="text-3xl font-semibold tracking-[-0.04em] text-gray-950 sm:text-4xl">
                My Wishlist
              </h1>

              <p className="mt-2 text-sm leading-6 text-gray-500 sm:text-base">
                Products you've saved for your next purchase.
              </p>
            </div>

            {/* ITEM COUNT */}

            <div className="rounded-2xl border border-gray-100 bg-white px-5 py-3 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
                Saved Items
              </p>

              <p className="mt-1 text-lg font-bold text-gray-950">
                {wishlist.length}
              </p>
            </div>
          </div>
        </div>

        {/* ======================================================
            EMPTY WISHLIST
        ====================================================== */}

        {wishlist.length === 0 ? (
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
                  d="M21 8.25c0 5.25-9 10.5-9 10.5S3 13.5 3 8.25A4.25 4.25 0 0 1 7.25 4c1.49 0 2.85.77 3.75 1.94A4.52 4.52 0 0 1 14.75 4 4.25 4.25 0 0 1 19 8.25Z"
                />
              </svg>
            </div>

            <h2 className="mt-5 text-xl font-semibold text-gray-950">
              Your wishlist is empty
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Save products you love here so you can easily find them when
              you're ready to shop.
            </p>
          </div>
        ) : (
          /* ====================================================
             WISHLIST GRID
          ==================================================== */

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishlist.map((item) => (
              <div
                key={item._id}
                className="
                  group
                  overflow-hidden
                  rounded-3xl
                  border
                  border-gray-100
                  bg-white
                  shadow-sm
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-lg
                "
              >
                {/* ==========================================
                    PRODUCT IMAGE
                ========================================== */}

                <div className="relative flex h-64 items-center justify-center overflow-hidden bg-[#f8faf5]">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="
                      h-full
                      w-full
                      object-contain
                      p-5
                      transition-transform
                      duration-500
                      group-hover:scale-105
                    "
                  />

                  {/* WISHLIST BADGE */}

                  <div className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-gray-100 bg-white/90 text-red-500 shadow-sm backdrop-blur">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      className="h-4 w-4"
                    >
                      <path d="M12 21.35 10.55 20C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.5L12 21.35Z" />
                    </svg>
                  </div>
                </div>

                {/* ==========================================
                    PRODUCT INFORMATION
                ========================================== */}

                <div className="p-5">
                  <h2 className="truncate text-base font-semibold text-gray-950">
                    {item.name}
                  </h2>

                  {item.category && (
                    <p className="mt-1 truncate text-xs text-gray-500">
                      {item.category}
                    </p>
                  )}

                  {/* PRICE */}

                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-lg font-bold text-green-700">
                      ₹{Number(item.price || 0).toLocaleString("en-IN")}
                    </span>

                    {item.oldPrice && (
                      <span className="text-xs text-gray-400 line-through">
                        ₹{Number(item.oldPrice).toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>

                  {/* ========================================
                      ACTIONS
                  ======================================== */}

                  <div className="mt-5 space-y-2">
                    {/* ADD TO CART */}

                    <button
                      onClick={() => handleAddToCart(item)}
                      className="
                        flex
                        min-h-[46px]
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-full
                        bg-gray-950
                        px-5
                        text-sm
                        font-semibold
                        text-white
                        transition-all
                        duration-300
                        hover:bg-green-700
                        active:scale-[0.98]
                      "
                    >
                      Add to Cart
                      <span className="transition-transform duration-300">
                        →
                      </span>
                    </button>

                    {/* REMOVE */}

                    <button
                      onClick={() => removeItem(item._id)}
                      className="
                        flex
                        min-h-[44px]
                        w-full
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-gray-200
                        bg-white
                        px-5
                        text-sm
                        font-semibold
                        text-gray-600
                        transition-all
                        duration-300
                        hover:border-red-200
                        hover:bg-red-50
                        hover:text-red-600
                        active:scale-[0.98]
                      "
                    >
                      Remove from Wishlist
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
