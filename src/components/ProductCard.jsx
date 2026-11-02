import { Link } from "react-router-dom";
import { addToCart } from "../utils/cart";
import { addToWishlist } from "../utils/wishlist";

export default function ProductCard({ product }) {
  // ============================================================
  // SAFETY
  // ============================================================

  if (!product) {
    return null;
  }

  // ============================================================
  // PRODUCT ID
  // ============================================================

  const productId = product?._id;

  // ============================================================
  // PRICE
  // ============================================================

  const price = Number(product?.price || 0);
  const oldPrice = Number(product?.oldPrice || 0);

  // ============================================================
  // DISCOUNT
  // ============================================================

  const discount =
    oldPrice > price && price > 0
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : 0;

  // ============================================================
  // PRODUCT INFORMATION
  // ============================================================

  const productName = product?.name || "Product";
  const category = product?.category || "";

  const image =
    product?.image || "https://via.placeholder.com/600x600?text=Product";

  // ============================================================
  // PRODUCT URL
  // ============================================================

  const productUrl = productId ? `/product/${productId}` : "#";

  // ============================================================
  // ADD TO CART
  // ============================================================

  const handleAddToCart = (event) => {
    event.preventDefault();
    event.stopPropagation();

    addToCart(product);

    alert("Added to Cart 🛒");
  };

  // ============================================================
  // ADD TO WISHLIST
  // ============================================================

  const handleWishlist = (event) => {
    event.preventDefault();
    event.stopPropagation();

    addToWishlist(product);

    alert("Added to Wishlist ❤️");
  };

  // ============================================================
  // UI
  // ============================================================

  return (
    <article
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-gray-100
        bg-white
        shadow-sm
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
      "
    >
      {/* ======================================================
          PRODUCT IMAGE + INFORMATION
      ====================================================== */}

      <div className="relative">
        {/* PRODUCT LINK */}

        {productId ? (
          <Link
            to={productUrl}
            className="block w-full cursor-pointer text-left"
            aria-label={`View ${productName}`}
          >
            <div
              className="
                relative
                flex
                h-64
                items-center
                justify-center
                overflow-hidden
                bg-[#f8faf5]
                sm:h-72
              "
            >
              {/* ==================================================
                  DISCOUNT
              ================================================== */}

              {discount > 0 && (
                <span
                  className="
                    absolute
                    left-4
                    top-4
                    z-10
                    rounded-full
                    bg-green-700
                    px-3
                    py-1
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-wide
                    text-white
                  "
                >
                  {discount}% OFF
                </span>
              )}

              {/* ==================================================
                  IMAGE
              ================================================== */}

              <img
                src={image}
                alt={productName}
                loading="lazy"
                className="
                  h-full
                  w-full
                  object-contain
                  p-6
                  transition-transform
                  duration-500
                  group-hover:scale-105
                "
              />
            </div>

            {/* ====================================================
                PRODUCT INFORMATION
            ==================================================== */}

            <div className="p-5">
              {category && (
                <p
                  className="
                    mb-2
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.16em]
                    text-green-700
                  "
                >
                  {category}
                </p>
              )}

              <h2
                className="
                  truncate
                  text-base
                  font-semibold
                  tracking-[-0.01em]
                  text-gray-950
                  sm:text-lg
                "
                title={productName}
              >
                {productName}
              </h2>

              {/* PRICE */}

              <div className="mt-3 flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-gray-950">
                  ₹{price.toLocaleString("en-IN")}
                </span>

                {oldPrice > price && (
                  <span className="text-sm text-gray-400 line-through">
                    ₹{oldPrice.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ) : (
          <div>
            <div
              className="
                relative
                flex
                h-64
                items-center
                justify-center
                overflow-hidden
                bg-[#f8faf5]
                sm:h-72
              "
            >
              {discount > 0 && (
                <span
                  className="
                    absolute
                    left-4
                    top-4
                    z-10
                    rounded-full
                    bg-green-700
                    px-3
                    py-1
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-wide
                    text-white
                  "
                >
                  {discount}% OFF
                </span>
              )}

              <img
                src={image}
                alt={productName}
                loading="lazy"
                className="
                  h-full
                  w-full
                  object-contain
                  p-6
                "
              />
            </div>

            <div className="p-5">
              {category && (
                <p
                  className="
                    mb-2
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.16em]
                    text-green-700
                  "
                >
                  {category}
                </p>
              )}

              <h2
                className="
                  truncate
                  text-base
                  font-semibold
                  text-gray-950
                  sm:text-lg
                "
                title={productName}
              >
                {productName}
              </h2>

              <div className="mt-3 flex items-center gap-2">
                <span className="text-xl font-bold text-gray-950">
                  ₹{price.toLocaleString("en-IN")}
                </span>

                {oldPrice > price && (
                  <span className="text-sm text-gray-400 line-through">
                    ₹{oldPrice.toLocaleString("en-IN")}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ======================================================
            WISHLIST BUTTON
            IMPORTANT: This is OUTSIDE the Link
        ====================================================== */}

        <button
          type="button"
          onClick={handleWishlist}
          aria-label={`Add ${productName} to wishlist`}
          className="
            absolute
            right-4
            top-4
            z-20
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-full
            border
            border-gray-200
            bg-white/95
            text-gray-500
            shadow-sm
            backdrop-blur-sm
            transition-all
            duration-300
            hover:border-green-700
            hover:bg-green-700
            hover:text-white
          "
        >
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
              d="M21 8.25c0 5.25-9 10.5-9 10.5S3 13.5 3 8.25A4.5 4.5 0 0 1 12 6.75a4.5 4.5 0 0 1 9 1.5Z"
            />
          </svg>
        </button>
      </div>

      {/* ======================================================
          ACTION AREA
      ====================================================== */}

      <div className="px-5 pb-5">
        {/* VIEW DETAILS */}

        {productId ? (
          <Link
            to={productUrl}
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
              text-gray-800
              transition-all
              duration-300
              hover:border-green-700
              hover:bg-[#f5f7f1]
              hover:text-green-700
            "
          >
            View Details
            <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        ) : (
          <button
            type="button"
            disabled
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
              text-gray-800
              opacity-50
            "
          >
            View Details
          </button>
        )}

        {/* ADD TO CART */}

        <button
          type="button"
          onClick={handleAddToCart}
          className="
            mt-3
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
            shadow-sm
            transition-all
            duration-300
            hover:bg-green-700
            hover:shadow-md
            active:scale-[0.98]
          "
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.8"
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25h10.125c.621 0 1.17-.424 1.346-1.011l1.558-5.25a1.125 1.125 0 0 0-1.078-1.449H5.106m0 0L4.25 3.75m.856 3.79 1.394 6.71a2.25 2.25 0 0 0 2.205 1.792h7.92M9 19.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Zm9 0a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1-3 0Z"
            />
          </svg>
          Add to Cart
        </button>
      </div>
    </article>
  );
}
