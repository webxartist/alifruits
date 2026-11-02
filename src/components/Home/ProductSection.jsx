import { Link } from "react-router-dom";
import ProductCard from "../ProductCard";

export default function ProductSection({
  eyebrow,
  title,
  description,
  products = [],
  viewAllLink = "/products",
  viewAllText = "View All",
  background = "white",
}) {
  // ============================================================
  // DON'T RENDER EMPTY SECTIONS
  // ============================================================

  if (!products || products.length === 0) {
    return null;
  }

  // ============================================================
  // SECTION BACKGROUND
  // ============================================================

  const sectionBackground = background === "soft" ? "bg-[#f5f7f1]" : "bg-white";

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <section className={`${sectionBackground} py-14 sm:py-16 lg:py-20`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ======================================================
            SECTION HEADER
        ====================================================== */}

        <div className="mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          {/* ====================================================
              TITLE AREA
          ==================================================== */}

          <div className="max-w-2xl">
            {/* Eyebrow */}

            {eyebrow && (
              <div className="mb-3 flex items-center gap-3">
                <span className="h-px w-7 bg-green-700" />

                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-700">
                  {eyebrow}
                </span>
              </div>
            )}

            {/* Title */}

            <h2
              className="
                text-3xl
                font-semibold
                tracking-[-0.035em]
                text-gray-950
                sm:text-4xl
                lg:text-5xl
              "
            >
              {title}
            </h2>

            {/* Description */}

            {description && (
              <p
                className="
                  mt-3
                  max-w-xl
                  text-sm
                  leading-6
                  text-gray-500
                  sm:text-base
                "
              >
                {description}
              </p>
            )}
          </div>

          {/* ====================================================
              VIEW ALL
          ==================================================== */}

          <Link
            to={viewAllLink}
            className="
              inline-flex
              min-h-[44px]
              items-center
              justify-center
              self-start
              rounded-full
              border
              border-gray-200
              bg-white
              px-5
              text-sm
              font-semibold
              text-gray-800
              shadow-sm
              transition-all
              duration-300
              hover:border-green-700
              hover:bg-green-700
              hover:text-white
              sm:self-auto
            "
          >
            {viewAllText}

            <span className="ml-2 transition-transform duration-300">→</span>
          </Link>
        </div>

        {/* ======================================================
            PRODUCTS
        ====================================================== */}

        <div
          className="
            grid
            grid-cols-2
            gap-4
            sm:grid-cols-2
            sm:gap-5
            lg:grid-cols-4
          "
        >
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
