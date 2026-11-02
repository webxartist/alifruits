import { useEffect, useState } from "react";

import {
  getTopDeals,
  getFeaturedProducts,
  getNewArrivals,
  getPopularProducts,
} from "../services/api";

import FruitHero from "../components/Hero";
import ProductSection from "../components/home/ProductSection";

export default function Home() {
  // ============================================================
  // HOMEPAGE PRODUCTS
  // ============================================================

  const [topDeals, setTopDeals] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);

  // ============================================================
  // LOADING
  // ============================================================

  const [loading, setLoading] = useState(true);

  // ============================================================
  // FETCH HOMEPAGE PRODUCTS
  // ============================================================

  useEffect(() => {
    const fetchHomepageProducts = async () => {
      try {
        setLoading(true);

        const [topDealsData, featuredData, newArrivalsData, popularData] =
          await Promise.all([
            getTopDeals(8),
            getFeaturedProducts(8),
            getNewArrivals(8),
            getPopularProducts(8),
          ]);

        setTopDeals(Array.isArray(topDealsData) ? topDealsData : []);

        setFeaturedProducts(Array.isArray(featuredData) ? featuredData : []);

        setNewArrivals(Array.isArray(newArrivalsData) ? newArrivalsData : []);

        setPopularProducts(Array.isArray(popularData) ? popularData : []);
      } catch (error) {
        console.error("Homepage Products Error:", error);

        setTopDeals([]);
        setFeaturedProducts([]);
        setNewArrivals([]);
        setPopularProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHomepageProducts();
  }, []);

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <main className="min-h-screen bg-white">
      {/* ========================================================
          HERO
      ======================================================== */}

      <FruitHero />

      {/* ========================================================
          LOADING STATE
      ======================================================== */}

      {loading ? (
        <div className="mx-auto flex min-h-[300px] max-w-7xl items-center justify-center px-4">
          <div className="text-center">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-green-700" />

            <p className="text-sm font-medium text-gray-500">
              Loading products...
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* ======================================================
              TOP DEALS
          ====================================================== */}

          <ProductSection
            eyebrow="Best Deals"
            title="Top Deals"
            description="Grab today's best offers before they're gone."
            products={topDeals}
            viewAllLink="/products?section=top-deals"
            viewAllText="View All Deals"
            background="white"
          />

          {/* ======================================================
              FEATURED PRODUCTS
          ====================================================== */}

          <ProductSection
            eyebrow="Handpicked For You"
            title="Featured Products"
            description="A carefully selected collection of products worth checking out."
            products={featuredProducts}
            viewAllLink="/products?section=featured"
            viewAllText="View All"
            background="soft"
          />

          {/* ======================================================
              NEW ARRIVALS
          ====================================================== */}

          <ProductSection
            eyebrow="Freshly Added"
            title="New Arrivals"
            description="Discover the latest products recently added to our store."
            products={newArrivals}
            viewAllLink="/products?section=new-arrivals"
            viewAllText="View All New"
            background="white"
          />

          {/* ======================================================
              POPULAR PRODUCTS
          ====================================================== */}

          <ProductSection
            eyebrow="Customer Favorites"
            title="Popular Products"
            description="Explore products customers are loving right now."
            products={popularProducts}
            viewAllLink="/products?section=popular"
            viewAllText="View All Popular"
            background="soft"
          />
        </>
      )}
    </main>
  );
}
