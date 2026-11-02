import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getSingleProduct, getProducts } from "../services/api";
import { addToCart } from "../utils/cart";
import { addToWishlist } from "../utils/wishlist";

import ProductCard from "../components/ProductCard";

export default function ProductDetails() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ============================================================
  // LOAD PRODUCT
  // ============================================================

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);

        const productData = await getSingleProduct(id);

        if (!productData) {
          setProduct(null);
          return;
        }

        setProduct(productData);

        const allProducts = await getProducts();

        const related = allProducts.filter(
          (item) =>
            item.category?.toLowerCase() ===
              productData.category?.toLowerCase() &&
            item._id !== productData._id,
        );

        setRelatedProducts(related.slice(0, 8));
      } catch (error) {
        console.error("Product Details Error:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8faf5] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid animate-pulse grid-cols-1 gap-10 md:grid-cols-2">
            <div className="h-[420px] rounded-3xl bg-gray-200" />

            <div className="py-4">
              <div className="h-4 w-24 rounded bg-gray-200" />
              <div className="mt-5 h-10 w-3/4 rounded bg-gray-200" />
              <div className="mt-4 h-5 w-1/3 rounded bg-gray-200" />
              <div className="mt-8 h-10 w-1/2 rounded bg-gray-200" />

              <div className="mt-8 space-y-3">
                <div className="h-4 w-full rounded bg-gray-200" />
                <div className="h-4 w-5/6 rounded bg-gray-200" />
                <div className="h-4 w-4/6 rounded bg-gray-200" />
              </div>

              <div className="mt-10 flex gap-3">
                <div className="h-12 w-40 rounded-full bg-gray-200" />
                <div className="h-12 w-40 rounded-full bg-gray-200" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ============================================================
  // PRODUCT NOT FOUND
  // ============================================================

  if (!product) {
    return (
      <main className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[#f8faf5] px-4 py-16">
        <div className="w-full max-w-lg rounded-3xl border border-gray-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-2xl">
            !
          </div>

          <h1 className="mt-6 text-2xl font-semibold text-gray-950">
            Product not found
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            The product you're looking for may have been removed or is no longer
            available.
          </p>

          <Link
            to="/"
            className="mt-7 inline-flex min-h-[46px] items-center justify-center rounded-full bg-gray-950 px-7 text-sm font-semibold text-white transition hover:bg-green-700"
          >
            Back to Store
          </Link>
        </div>
      </main>
    );
  }

  // ============================================================
  // PRICE
  // ============================================================

  const price = Number(product.price || 0);
  const oldPrice = Number(product.oldPrice || 0);

  const hasDiscount = oldPrice > price;

  const discountPercentage = hasDiscount
    ? Math.round(((oldPrice - price) / oldPrice) * 100)
    : 0;

  // ============================================================
  // ACTIONS
  // ============================================================

  const handleAddToCart = () => {
    addToCart(product);

    alert("Product added to cart ✅");
  };

  const handleWishlist = () => {
    addToWishlist(product);

    alert("Product added to wishlist ❤️");
  };

  const handleBuyNow = () => {
    addToCart(product);

    window.location.href = "/cart";
  };

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <main className="min-h-screen bg-[#f8faf5]">
      {/* ========================================================
          PRODUCT
      ======================================================== */}

      <section className="px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Breadcrumb */}

          <div className="mb-8 flex flex-wrap items-center gap-2 text-xs text-gray-400">
            <Link to="/" className="transition hover:text-green-700">
              Home
            </Link>

            <span>/</span>

            <span>{product.category}</span>

            <span>/</span>

            <span className="max-w-[220px] truncate text-gray-600">
              {product.name}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-14">
            {/* ==================================================
                IMAGE
            ================================================== */}

            <div>
              <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
                {/* Discount */}

                {hasDiscount && (
                  <div className="absolute left-5 top-5 z-10 rounded-full bg-green-700 px-4 py-2 text-xs font-bold text-white shadow-sm">
                    {discountPercentage}% OFF
                  </div>
                )}

                {/* Image */}

                <div className="flex min-h-[360px] items-center justify-center p-6 sm:min-h-[500px] sm:p-10">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="max-h-[470px] w-full object-contain transition duration-500 hover:scale-105"
                  />
                </div>
              </div>
            </div>

            {/* ==================================================
                PRODUCT INFORMATION
            ================================================== */}

            <div className="flex flex-col justify-center">
              {/* Category */}

              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-7 bg-green-700" />

                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-800">
                  {product.category}
                </span>
              </div>

              {/* Name */}

              <h1 className="max-w-2xl text-3xl font-semibold leading-tight tracking-[-0.04em] text-gray-950 sm:text-4xl lg:text-5xl">
                {product.name}
              </h1>

              {/* Rating / availability */}

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700">
                  ✓ Fresh Product
                </span>

                {product.stock > 0 ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">
                    In Stock
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Price */}

              <div className="mt-7 flex flex-wrap items-end gap-3">
                <span className="text-4xl font-bold tracking-[-0.04em] text-gray-950">
                  ₹{price.toLocaleString("en-IN")}
                </span>

                {hasDiscount && (
                  <span className="pb-1 text-lg text-gray-400 line-through">
                    ₹{oldPrice.toLocaleString("en-IN")}
                  </span>
                )}
              </div>

              {hasDiscount && (
                <p className="mt-2 text-sm font-medium text-green-700">
                  You save ₹{(oldPrice - price).toLocaleString("en-IN")}
                </p>
              )}

              {/* Divider */}

              <div className="my-7 h-px bg-gray-200" />

              {/* Description */}

              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">
                  Product Information
                </h2>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
                  {product.description ||
                    "Fresh quality product carefully selected for your everyday needs."}
                </p>
              </div>

              {/* Stock */}

              {product.stock !== undefined && (
                <div className="mt-6 rounded-2xl border border-gray-100 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">
                      Availability
                    </span>

                    <span
                      className={`text-sm font-semibold ${
                        product.stock > 0 ? "text-green-700" : "text-red-600"
                      }`}
                    >
                      {product.stock > 0
                        ? `${product.stock} available`
                        : "Out of stock"}
                    </span>
                  </div>

                  {product.stock > 0 && (
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-green-600"
                        style={{
                          width: `${Math.min(
                            Math.max((product.stock / 100) * 100, 8),
                            100,
                          )}%`,
                        }}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="
                    inline-flex
                    min-h-[52px]
                    flex-1
                    items-center
                    justify-center
                    rounded-full
                    bg-gray-950
                    px-6
                    text-sm
                    font-semibold
                    text-white
                    transition-all
                    duration-300
                    hover:bg-green-700
                    disabled:cursor-not-allowed
                    disabled:bg-gray-300
                  "
                >
                  Add to Cart
                </button>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  disabled={product.stock === 0}
                  className="
                    inline-flex
                    min-h-[52px]
                    flex-1
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-green-700
                    bg-green-700
                    px-6
                    text-sm
                    font-semibold
                    text-white
                    transition-all
                    duration-300
                    hover:bg-green-800
                    disabled:cursor-not-allowed
                    disabled:border-gray-300
                    disabled:bg-gray-300
                  "
                >
                  Buy Now
                </button>

                <button
                  type="button"
                  onClick={handleWishlist}
                  className="
                    inline-flex
                    min-h-[52px]
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-gray-200
                    bg-white
                    px-6
                    text-sm
                    font-semibold
                    text-gray-700
                    transition-all
                    duration-300
                    hover:border-red-200
                    hover:bg-red-50
                    hover:text-red-600
                  "
                >
                  ♡<span className="ml-2 sm:hidden">Wishlist</span>
                </button>
              </div>

              {/* Benefits */}

              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-gray-100 bg-white p-4">
                  <div className="text-lg">🚚</div>

                  <p className="mt-2 text-xs font-semibold text-gray-900">
                    Fast Delivery
                  </p>

                  <p className="mt-1 text-[11px] leading-4 text-gray-400">
                    Delivered fresh
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white p-4">
                  <div className="text-lg">🌿</div>

                  <p className="mt-2 text-xs font-semibold text-gray-900">
                    Quality First
                  </p>

                  <p className="mt-1 text-[11px] leading-4 text-gray-400">
                    Carefully selected
                  </p>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-white p-4">
                  <div className="text-lg">🔒</div>

                  <p className="mt-2 text-xs font-semibold text-gray-900">
                    Secure Shopping
                  </p>

                  <p className="mt-1 text-[11px] leading-4 text-gray-400">
                    Safe checkout
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          RELATED PRODUCTS
      ======================================================== */}

      {relatedProducts.length > 0 && (
        <section className="border-t border-gray-100 bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <div className="mb-3 flex items-center gap-3">
                  <span className="h-px w-7 bg-green-700" />

                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-800">
                    You May Also Like
                  </span>
                </div>

                <h2 className="text-2xl font-semibold tracking-[-0.04em] text-gray-950 sm:text-3xl">
                  Related Products
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Explore more products from the {product.category} category.
                </p>
              </div>

              <Link
                to="/"
                className="text-sm font-semibold text-green-700 transition hover:text-green-900"
              >
                Continue Shopping →
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((item) => (
                <ProductCard key={item._id} product={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
