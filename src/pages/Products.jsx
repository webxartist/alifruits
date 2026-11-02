import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import {
  getProducts,
  getTopDeals,
  getFeaturedProducts,
  getNewArrivals,
  getPopularProducts,
} from "../services/api";

import ProductCard from "../components/ProductCard";

export default function Products() {
  const [searchParams] = useSearchParams();

  const section = searchParams.get("section") || "all";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ============================================================
  // SECTION INFORMATION
  // ============================================================

  const sectionInfo = useMemo(() => {
    switch (section) {
      case "top-deals":
        return {
          eyebrow: "Best Deals",
          title: "Top Deals",
          description: "Grab today's best offers before they're gone.",
        };

      case "featured":
        return {
          eyebrow: "Handpicked For You",
          title: "Featured Products",
          description:
            "A carefully selected collection of products worth checking out.",
        };

      case "new-arrivals":
        return {
          eyebrow: "Freshly Added",
          title: "New Arrivals",
          description:
            "Discover the latest products recently added to our store.",
        };

      case "popular":
        return {
          eyebrow: "Customer Favorites",
          title: "Popular Products",
          description: "Explore products customers are loving right now.",
        };

      default:
        return {
          eyebrow: "Fresh Collection",
          title: "Shop All Products",
          description: "Explore our complete collection of fresh products.",
        };
    }
  }, [section]);

  // ============================================================
  // FETCH PRODUCTS
  // ============================================================

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        let response;

        switch (section) {
          case "top-deals":
            response = await getTopDeals(100);
            break;

          case "featured":
            response = await getFeaturedProducts(100);
            break;

          case "new-arrivals":
            response = await getNewArrivals(100);
            break;

          case "popular":
            response = await getPopularProducts(100);
            break;

          default:
            response = await getProducts(100);
            break;
        }

        console.log("PRODUCTS API RESPONSE:", response);

        // ======================================================
        // HANDLE DIFFERENT API RESPONSE FORMATS
        // ======================================================

        let productList = [];

        // Format 1:
        // [ {...}, {...} ]

        if (Array.isArray(response)) {
          productList = response;
        }

        // Format 2:
        // { products: [...] }
        else if (Array.isArray(response?.products)) {
          productList = response.products;
        }

        // Format 3:
        // { data: [...] }
        else if (Array.isArray(response?.data)) {
          productList = response.data;
        }

        // Format 4:
        // { data: { products: [...] } }
        else if (Array.isArray(response?.data?.products)) {
          productList = response.data.products;
        }

        console.log("FINAL PRODUCT LIST:", productList);

        setProducts(productList);
      } catch (err) {
        console.error("Products Page Error:", err);

        setProducts([]);

        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load products. Please try again.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [section]);

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <main className="min-h-screen bg-white">
      {/* ========================================================
          HERO / HEADER
      ======================================================== */}

      <section className="border-b border-gray-100 bg-[#f5f7f1]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-8 bg-green-700" />

            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-700">
              {sectionInfo.eyebrow}
            </span>
          </div>

          <h1 className="text-4xl font-semibold tracking-[-0.04em] text-gray-950 sm:text-5xl lg:text-6xl">
            {sectionInfo.title}
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
            {sectionInfo.description}
          </p>

          {/* ====================================================
              SECTION FILTERS
          ==================================================== */}

          <div className="mt-8 flex flex-wrap gap-2">
            <Link
              to="/products"
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                section === "all"
                  ? "bg-green-700 text-white"
                  : "border border-gray-200 bg-white text-gray-700 hover:border-green-700 hover:text-green-700"
              }`}
            >
              All Products
            </Link>

            <Link
              to="/products?section=top-deals"
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                section === "top-deals"
                  ? "bg-green-700 text-white"
                  : "border border-gray-200 bg-white text-gray-700 hover:border-green-700 hover:text-green-700"
              }`}
            >
              Top Deals
            </Link>

            <Link
              to="/products?section=featured"
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                section === "featured"
                  ? "bg-green-700 text-white"
                  : "border border-gray-200 bg-white text-gray-700 hover:border-green-700 hover:text-green-700"
              }`}
            >
              Featured
            </Link>

            <Link
              to="/products?section=new-arrivals"
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                section === "new-arrivals"
                  ? "bg-green-700 text-white"
                  : "border border-gray-200 bg-white text-gray-700 hover:border-green-700 hover:text-green-700"
              }`}
            >
              New Arrivals
            </Link>

            <Link
              to="/products?section=popular"
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                section === "popular"
                  ? "bg-green-700 text-white"
                  : "border border-gray-200 bg-white text-gray-700 hover:border-green-700 hover:text-green-700"
              }`}
            >
              Popular
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================================
          PRODUCTS
      ======================================================== */}

      <section className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* ====================================================
              LOADING
          ==================================================== */}

          {loading && (
            <div className="flex min-h-[350px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-green-700" />

                <p className="mt-4 text-sm font-medium text-gray-500">
                  Loading products...
                </p>
              </div>
            </div>
          )}

          {/* ====================================================
              ERROR
          ==================================================== */}

          {!loading && error && (
            <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-12 text-center">
              <h2 className="text-lg font-semibold text-red-700">
                Something went wrong
              </h2>

              <p className="mt-2 text-sm text-red-500">{error}</p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-5 rounded-full bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          )}

          {/* ====================================================
              EMPTY
          ==================================================== */}

          {!loading && !error && products.length === 0 && (
            <div className="flex min-h-[350px] items-center justify-center">
              <div className="max-w-md text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f5f7f1] text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-7 w-7"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-4.35-4.35m2.1-5.4a7.5 7.5 0 1 1-15 0 7.5 7.5 0 0 1 15 0Z"
                    />
                  </svg>
                </div>

                <h2 className="mt-5 text-xl font-semibold text-gray-950">
                  No products found
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  There are currently no products available in this collection.
                </p>

                <Link
                  to="/products"
                  className="mt-6 inline-flex rounded-full bg-gray-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
                >
                  Browse All Products
                </Link>
              </div>
            </div>
          )}

          {/* ====================================================
              PRODUCT GRID
          ==================================================== */}

          {!loading && !error && products.length > 0 && (
            <>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Showing{" "}
                  <span className="font-semibold text-gray-950">
                    {products.length}
                  </span>{" "}
                  {products.length === 1 ? "product" : "products"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
                {products.map((product) => (
                  <ProductCard
                    key={product?._id || product?.id}
                    product={product}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
