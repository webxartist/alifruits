import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHeroBanners } from "../services/api";

export default function FruitHero() {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  // ============================================================
  // FETCH HERO BANNERS FROM BACKEND
  // ============================================================

  useEffect(() => {
    const fetchHeroBanners = async () => {
      try {
        setLoading(true);

        const data = await getHeroBanners();

        if (Array.isArray(data)) {
          setSlides(data);
          setError(false);
        } else {
          setSlides([]);
          setError(true);
        }
      } catch (error) {
        console.error("Hero banner fetch error:", error);

        setSlides([]);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroBanners();
  }, []);

  // ============================================================
  // AUTOMATIC SLIDER
  // ============================================================

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  // ============================================================
  // MANUAL NAVIGATION
  // ============================================================

  const nextSlide = () => {
    if (slides.length === 0) {
      return;
    }

    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const previousSlide = () => {
    if (slides.length === 0) {
      return;
    }

    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // ============================================================
  // LOADING STATE
  // ============================================================

  if (loading) {
    return (
      <section className="w-full bg-white">
        <div className="mx-auto w-full max-w-[1920px] px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-6 lg:px-8 xl:px-10">
          <div className="flex min-h-[500px] items-center justify-center overflow-hidden rounded-2xl bg-[#f5f7f1] sm:min-h-[600px] sm:rounded-3xl md:min-h-[650px]">
            <div className="text-center">
              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-gray-200 border-t-green-700" />

              <p className="mt-4 text-sm font-medium text-gray-500">
                Loading fresh picks...
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ============================================================
  // EMPTY / ERROR STATE
  // ============================================================

  if (error || slides.length === 0) {
    return null;
  }

  // ============================================================
  // CURRENT SLIDE
  // ============================================================

  const slide = slides[currentSlide];

  // ============================================================
  // HERO
  // ============================================================

  return (
    <section className="w-full bg-white">
      {/* ========================================================
          OUTER CONTAINER
      ======================================================== */}

      <div className="mx-auto w-full max-w-[1920px] px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-6 lg:px-8 xl:px-10">
        {/* ======================================================
            HERO
        ====================================================== */}

        <div className="relative min-h-[720px] w-full overflow-hidden rounded-2xl bg-[#f5f7f1] sm:min-h-[680px] sm:rounded-3xl md:min-h-[650px] lg:min-h-[620px] xl:min-h-[650px] 2xl:min-h-[700px]">
          {/* ====================================================
              BACKGROUND IMAGE
          ==================================================== */}

          <div className="absolute inset-0">
            <img
              key={slide._id}
              src={slide.image}
              alt={`${slide.title} ${slide.highlight || ""}`}
              className="
                h-full
                w-full
                object-cover
                object-center
                transition-all
                duration-1000
                ease-in-out
                sm:object-center
                lg:object-right
              "
            />

            {/* Desktop gradient */}

            <div
              className="
                absolute
                inset-0
                bg-gradient-to-r
                from-[#f5f7f1]
                via-[#f5f7f1]/85
                to-transparent
                lg:from-[#f5f7f1]
                lg:via-[#f5f7f1]/75
                lg:to-transparent
              "
            />

            {/* Mobile overlay */}

            <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/75 to-white/20 lg:hidden" />
          </div>

          {/* ====================================================
              CONTENT
          ==================================================== */}

          <div
            className="
              relative
              z-10
              flex
              min-h-[720px]
              items-start
              px-5
              py-14
              sm:min-h-[680px]
              sm:px-8
              sm:py-16
              md:min-h-[650px]
              md:px-12
              md:py-20
              lg:min-h-[620px]
              lg:items-center
              lg:px-16
              lg:py-20
              xl:min-h-[650px]
              xl:px-20
              2xl:min-h-[700px]
              2xl:px-24
            "
          >
            <div
              className="
                w-full
                max-w-xl
                lg:max-w-2xl
              "
            >
              {/* ==================================================
                  EYEBROW
              ================================================== */}

              {slide.eyebrow && (
                <div className="mb-5 flex items-center gap-3 sm:mb-6">
                  <span className="h-px w-6 bg-green-700 sm:w-8" />

                  <span className="text-[10px] font-bold tracking-[0.18em] text-green-800 sm:text-xs sm:tracking-[0.2em]">
                    {slide.eyebrow}
                  </span>
                </div>
              )}

              {/* ==================================================
                  HEADING
              ================================================== */}

              <h1
                className="
                  max-w-[700px]
                  text-[42px]
                  font-semibold
                  leading-[0.98]
                  tracking-[-0.045em]
                  text-gray-950
                  sm:text-5xl
                  md:text-6xl
                  lg:text-7xl
                  xl:text-[76px]
                  2xl:text-[84px]
                "
              >
                {slide.title}

                {slide.highlight && (
                  <span className="mt-2 block text-green-700">
                    {slide.highlight}
                  </span>
                )}
              </h1>

              {/* ==================================================
                  DESCRIPTION
              ================================================== */}

              {slide.description && (
                <p
                  className="
                    mt-6
                    max-w-[560px]
                    text-sm
                    leading-6
                    text-gray-600
                    sm:mt-7
                    sm:text-base
                    sm:leading-7
                    md:text-lg
                    md:leading-8
                  "
                >
                  {slide.description}
                </p>
              )}

              {/* ==================================================
                  BUTTONS
              ================================================== */}

              <div
                className="
                  mt-7
                  flex
                  w-full
                  flex-col
                  gap-3
                  sm:mt-9
                  sm:w-auto
                  sm:flex-row
                  sm:items-center
                "
              >
                {/* Primary Button */}

                <button
                  onClick={() => navigate(slide.buttonLink || "/products")}
                  className="
                    group
                    flex
                    min-h-[48px]
                    w-full
                    items-center
                    justify-center
                    gap-3
                    rounded-full
                    bg-gray-950
                    px-6
                    text-sm
                    font-semibold
                    text-white
                    shadow-sm
                    transition-all
                    duration-300
                    hover:bg-green-700
                    hover:shadow-lg
                    active:scale-[0.98]
                    sm:w-auto
                    sm:px-7
                  "
                >
                  {slide.buttonText || "Shop Now"}

                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </button>

                {/* Secondary Button */}

                <button
                  onClick={() => navigate("/products")}
                  className="
                    min-h-[48px]
                    w-full
                    rounded-full
                    border
                    border-gray-300
                    bg-white/80
                    px-6
                    text-sm
                    font-semibold
                    text-gray-800
                    backdrop-blur-sm
                    transition-all
                    duration-300
                    hover:border-green-700
                    hover:text-green-700
                    active:scale-[0.98]
                    sm:w-auto
                    sm:px-7
                  "
                >
                  View Collection
                </button>
              </div>

              {/* ==================================================
                  TRUST INFORMATION
              ================================================== */}

              <div
                className="
                  mt-9
                  grid
                  grid-cols-2
                  gap-4
                  border-t
                  border-gray-200
                  pt-5
                  sm:mt-11
                  sm:flex
                  sm:flex-wrap
                  sm:gap-x-8
                  sm:gap-y-4
                  sm:pt-6
                "
              >
                <div>
                  <p className="text-xs font-semibold text-gray-900 sm:text-sm">
                    Fresh Selection
                  </p>

                  <p className="mt-1 text-[10px] text-gray-500 sm:text-xs">
                    Carefully chosen
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-900 sm:text-sm">
                    Quality First
                  </p>

                  <p className="mt-1 text-[10px] text-gray-500 sm:text-xs">
                    Selected with care
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-900 sm:text-sm">
                    Easy Shopping
                  </p>

                  <p className="mt-1 text-[10px] text-gray-500 sm:text-xs">
                    Simple & convenient
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ====================================================
              SLIDER CONTROLS
          ==================================================== */}

          {slides.length > 1 && (
            <div
              className="
                absolute
                bottom-5
                right-5
                z-20
                flex
                items-center
                gap-2
                sm:bottom-7
                sm:right-7
                sm:gap-3
                md:bottom-9
                md:right-9
                lg:bottom-10
                lg:right-10
              "
            >
              {/* Previous */}

              <button
                onClick={previousSlide}
                aria-label="Previous slide"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-gray-300
                  bg-white/90
                  text-sm
                  text-gray-800
                  shadow-sm
                  backdrop-blur
                  transition-all
                  duration-300
                  hover:border-gray-950
                  hover:bg-gray-950
                  hover:text-white
                  sm:h-10
                  sm:w-10
                  sm:text-base
                "
              >
                ←
              </button>

              {/* Counter */}

              <div className="flex items-center gap-1.5 text-xs font-medium sm:gap-2 sm:text-sm">
                <span className="text-gray-950">
                  {String(currentSlide + 1).padStart(2, "0")}
                </span>

                <span className="text-gray-400">/</span>

                <span className="text-gray-400">
                  {String(slides.length).padStart(2, "0")}
                </span>
              </div>

              {/* Next */}

              <button
                onClick={nextSlide}
                aria-label="Next slide"
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-gray-300
                  bg-white/90
                  text-sm
                  text-gray-800
                  shadow-sm
                  backdrop-blur
                  transition-all
                  duration-300
                  hover:border-gray-950
                  hover:bg-gray-950
                  hover:text-white
                  sm:h-10
                  sm:w-10
                  sm:text-base
                "
              >
                →
              </button>
            </div>
          )}

          {/* ====================================================
              PROGRESS BAR
          ==================================================== */}

          {slides.length > 1 && (
            <div className="absolute bottom-0 left-0 z-20 h-1 w-full bg-black/5">
              <div
                key={currentSlide}
                className="
                  h-full
                  w-full
                  origin-left
                  bg-green-700
                  animate-[heroProgress_5s_linear]
                "
              />
            </div>
          )}
        </div>
      </div>

      {/* ==========================================================
          CUSTOM ANIMATION
      ========================================================== */}

      <style>
        {`
          @keyframes heroProgress {
            from {
              transform: scaleX(0);
            }

            to {
              transform: scaleX(1);
            }
          }
        `}
      </style>
    </section>
  );
}
