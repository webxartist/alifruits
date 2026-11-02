import { useState } from "react";
import { createProduct } from "../services/api";

export default function AddProduct() {
  // ============================================================
  // PRODUCT INFORMATION
  // ============================================================

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");

  // ============================================================
  // HOMEPAGE SECTIONS
  // ============================================================

  const [featured, setFeatured] = useState(false);
  const [isTopDeal, setIsTopDeal] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isPopular, setIsPopular] = useState(false);

  // ============================================================
  // SUBMIT PRODUCT
  // ============================================================

  const submitHandler = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("userInfo"));

    // ----------------------------------------------------------
    // Check login
    // ----------------------------------------------------------

    if (!user?.token) {
      alert("You must be logged in as an admin to add a product ❌");
      return;
    }

    // ----------------------------------------------------------
    // Basic validation
    // ----------------------------------------------------------

    if (!name.trim()) {
      alert("Please enter product name ❌");
      return;
    }

    if (!price || Number(price) < 0) {
      alert("Please enter a valid selling price ❌");
      return;
    }

    if (!category.trim()) {
      alert("Please enter product category ❌");
      return;
    }

    if (!image.trim()) {
      alert("Please enter product image URL ❌");
      return;
    }

    try {
      // --------------------------------------------------------
      // Product data
      // --------------------------------------------------------

      const productData = {
        name: name.trim(),

        price: Number(price),

        oldPrice: oldPrice ? Number(oldPrice) : null,

        category: category.trim(),

        image: image.trim(),

        stock: stock ? Number(stock) : 0,

        description: description.trim(),

        // Homepage sections
        featured,
        isTopDeal,
        isNewArrival,
        isPopular,
      };

      console.log("CREATING PRODUCT:", productData);

      // --------------------------------------------------------
      // API
      // --------------------------------------------------------

      const data = await createProduct(productData, user.token);

      console.log("PRODUCT CREATED:", data);

      // --------------------------------------------------------
      // Success
      // --------------------------------------------------------

      if (data?.product?._id || data?._id) {
        alert("Product Added Successfully ✅");

        // Reset product fields
        setName("");
        setPrice("");
        setOldPrice("");
        setImage("");
        setCategory("");
        setStock("");
        setDescription("");

        // Reset homepage sections
        setFeatured(false);
        setIsTopDeal(false);
        setIsNewArrival(false);
        setIsPopular(false);
      } else {
        alert(data?.message || "Unable to add product ❌");
      }
    } catch (error) {
      console.error("Add Product Error:", error);

      alert(
        error?.message ||
          "Server Error. Please check your backend connection ❌",
      );
    }
  };

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto w-full max-w-2xl">
        <form
          onSubmit={submitHandler}
          className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
        >
          {/* ====================================================
              HEADER
          ==================================================== */}

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-950 sm:text-3xl">
              Add Product
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Add a new product and choose where it should appear on the
              homepage.
            </p>
          </div>

          {/* ====================================================
              PRODUCT NAME
          ==================================================== */}

          <div className="mb-5">
            <label className="mb-2 block text-sm font-semibold text-gray-800">
              Product Name
            </label>

            <input
              type="text"
              placeholder="Example: Fresh Alphonso Mango"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              required
            />
          </div>

          {/* ====================================================
              PRICE
          ==================================================== */}

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Selling Price */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                Selling Price
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  ₹
                </span>

                <input
                  type="number"
                  min="0"
                  placeholder="120"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 py-3 pl-8 pr-4 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                  required
                />
              </div>
            </div>

            {/* Old Price */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                Old Price
                <span className="ml-1 font-normal text-gray-400">
                  (Optional)
                </span>
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  ₹
                </span>

                <input
                  type="number"
                  min="0"
                  placeholder="150"
                  value={oldPrice}
                  onChange={(e) => setOldPrice(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 py-3 pl-8 pr-4 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>
            </div>
          </div>

          {/* ====================================================
              CATEGORY + STOCK
          ==================================================== */}

          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            {/* Category */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                Category
              </label>

              <input
                type="text"
                placeholder="Example: Fruits"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                required
              />
            </div>

            {/* Stock */}

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-800">
                Stock
              </label>

              <input
                type="number"
                min="0"
                placeholder="100"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>
          </div>

          {/* ====================================================
              IMAGE URL
          ==================================================== */}

          <div className="mt-5">
            <label className="mb-2 block text-sm font-semibold text-gray-800">
              Product Image URL
            </label>

            <input
              type="url"
              placeholder="https://example.com/product-image.jpg"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              required
            />

            <p className="mt-2 text-xs text-gray-400">
              Use a publicly accessible image URL.
            </p>
          </div>

          {/* ====================================================
              DESCRIPTION
          ==================================================== */}

          <div className="mt-5">
            <label className="mb-2 block text-sm font-semibold text-gray-800">
              Description
              <span className="ml-1 font-normal text-gray-400">(Optional)</span>
            </label>

            <textarea
              placeholder="Write a short description about this product..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          {/* ====================================================
              HOMEPAGE PLACEMENT
          ==================================================== */}

          <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-5">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-950">
                Homepage Placement
              </h2>

              <p className="mt-1 text-xs text-gray-500">
                Select the sections where this product should appear. You can
                select more than one.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* Featured */}

              <label
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                  featured
                    ? "border-green-600 bg-green-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="h-4 w-4 accent-green-600"
                />

                <div>
                  <p className="font-semibold text-gray-900">⭐ Featured</p>

                  <p className="text-xs text-gray-500">
                    Show in featured section
                  </p>
                </div>
              </label>

              {/* Top Deal */}

              <label
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                  isTopDeal
                    ? "border-green-600 bg-green-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isTopDeal}
                  onChange={(e) => setIsTopDeal(e.target.checked)}
                  className="h-4 w-4 accent-green-600"
                />

                <div>
                  <p className="font-semibold text-gray-900">🔥 Top Deal</p>

                  <p className="text-xs text-gray-500">Show in top deals</p>
                </div>
              </label>

              {/* New Arrival */}

              <label
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                  isNewArrival
                    ? "border-green-600 bg-green-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isNewArrival}
                  onChange={(e) => setIsNewArrival(e.target.checked)}
                  className="h-4 w-4 accent-green-600"
                />

                <div>
                  <p className="font-semibold text-gray-900">🆕 New Arrival</p>

                  <p className="text-xs text-gray-500">Show in new arrivals</p>
                </div>
              </label>

              {/* Popular */}

              <label
                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${
                  isPopular
                    ? "border-green-600 bg-green-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isPopular}
                  onChange={(e) => setIsPopular(e.target.checked)}
                  className="h-4 w-4 accent-green-600"
                />

                <div>
                  <p className="font-semibold text-gray-900">❤️ Popular</p>

                  <p className="text-xs text-gray-500">
                    Show in popular products
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* ====================================================
              SUBMIT
          ==================================================== */}

          <button
            type="submit"
            className="mt-8 flex min-h-[50px] w-full items-center justify-center rounded-xl bg-gray-950 px-6 text-sm font-semibold text-white transition hover:bg-green-700 active:scale-[0.99]"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}
