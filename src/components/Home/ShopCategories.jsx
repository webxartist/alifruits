import { Link } from "react-router-dom";

const categories = [
  {
    name: "Fruits",
    description: "Fresh & juicy",
    emoji: "🍎",
    value: "Fruits",
  },
  {
    name: "Vegetables",
    description: "Farm fresh",
    emoji: "🥦",
    value: "Vegetables",
  },
  {
    name: "Dry Fruits",
    description: "Healthy choices",
    emoji: "🥜",
    value: "Dry Fruits",
  },
  {
    name: "Seasonal",
    description: "Fresh this season",
    emoji: "🥭",
    value: "Seasonal",
  },
];

export default function ShopCategories() {
  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="mb-8 sm:mb-10">
          <div className="mb-3 flex items-center gap-3">
            <span className="h-px w-7 bg-green-700" />

            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-700">
              Shop
            </span>
          </div>

          <h2
            className="
              text-3xl
              font-semibold
              tracking-[-0.035em]
              text-gray-950
              sm:text-4xl
            "
          >
            Shop by category
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500 sm:text-base">
            Explore our collection and find exactly what you're looking for.
          </p>
        </div>

        {/* ======================================================
            CATEGORY GRID
        ====================================================== */}

        <div
          className="
            grid
            grid-cols-2
            gap-3
            sm:grid-cols-2
            md:grid-cols-4
            md:gap-5
          "
        >
          {categories.map((category) => (
            <Link
              key={category.value}
              to={`/products?category=${encodeURIComponent(category.value)}`}
              className="
                group
                relative
                overflow-hidden
                rounded-2xl
                border
                border-gray-100
                bg-[#f5f7f1]
                p-5
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-green-100
                hover:shadow-lg
                sm:p-6
              "
            >
              {/* Icon */}

              <div
                className="
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-full
                  bg-white
                  text-2xl
                  shadow-sm
                  transition-transform
                  duration-300
                  group-hover:scale-110
                "
              >
                {category.emoji}
              </div>

              {/* Text */}

              <h3 className="mt-5 text-base font-semibold text-gray-950 sm:text-lg">
                {category.name}
              </h3>

              <p className="mt-1 text-xs text-gray-500 sm:text-sm">
                {category.description}
              </p>

              {/* Arrow */}

              <span
                className="
                  absolute
                  bottom-5
                  right-5
                  text-sm
                  text-gray-400
                  transition-all
                  duration-300
                  group-hover:translate-x-1
                  group-hover:text-green-700
                  sm:bottom-6
                  sm:right-6
                "
              >
                →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
