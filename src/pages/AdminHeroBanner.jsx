import { useCallback, useEffect, useState } from "react";

import {
  getAllHeroBanners,
  createHeroBanner,
  updateHeroBanner,
  deleteHeroBanner,
} from "../services/api";

export default function AdminHeroBanners() {
  // ============================================================
  // STATE
  // ============================================================

  const [banners, setBanners] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    title: "",
    highlight: "",
    eyebrow: "",
    description: "",
    image: "",
    buttonText: "Shop Fresh Fruits",
    buttonLink: "/products",
    isActive: true,
    sortOrder: 1,
  });

  // ============================================================
  // GET ADMIN TOKEN
  // ============================================================

  const getToken = () => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    return user?.token || null;
  };

  // ============================================================
  // FETCH BANNERS
  // ============================================================

  const fetchBanners = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        setError("Admin authentication required.");
        return;
      }

      const data = await getAllHeroBanners(token);

      setBanners(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Fetch Hero Banners Error:", error);

      setError("Unable to load hero banners.");
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    fetchBanners();
  }, [fetchBanners]);

  // ============================================================
  // FORM INPUT
  // ============================================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ============================================================
  // RESET FORM
  // ============================================================

  const resetForm = () => {
    setForm({
      title: "",
      highlight: "",
      eyebrow: "",
      description: "",
      image: "",
      buttonText: "Shop Fresh Fruits",
      buttonLink: "/products",
      isActive: true,
      sortOrder: banners.length + 1,
    });

    setEditingId(null);
  };

  // ============================================================
  // CREATE / UPDATE
  // ============================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    const token = getToken();

    if (!token) {
      setError("Admin authentication required.");
      return;
    }

    // Basic validation

    if (!form.title.trim()) {
      setError("Banner title is required.");
      return;
    }

    if (!form.image.trim()) {
      setError("Banner image path is required.");
      return;
    }

    try {
      setSaving(true);

      const bannerData = {
        title: form.title.trim(),
        highlight: form.highlight.trim(),
        eyebrow: form.eyebrow.trim(),
        description: form.description.trim(),
        image: form.image.trim(),
        buttonText: form.buttonText.trim(),
        buttonLink: form.buttonLink.trim(),
        isActive: form.isActive,
        sortOrder: Number(form.sortOrder),
      };

      let response;

      // UPDATE

      if (editingId) {
        response = await updateHeroBanner(editingId, bannerData, token);
      }

      // CREATE
      else {
        response = await createHeroBanner(bannerData, token);
      }

      if (response?.message?.toLowerCase().includes("success")) {
        setSuccess(
          editingId
            ? "Hero banner updated successfully."
            : "Hero banner created successfully.",
        );

        resetForm();

        await fetchBanners();

        setTimeout(() => {
          setSuccess("");
        }, 3000);
      } else {
        setError(
          response?.message || "Something went wrong while saving the banner.",
        );
      }
    } catch (error) {
      console.error("Save Hero Banner Error:", error);

      setError("Unable to save hero banner.");
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // EDIT
  // ============================================================

  const handleEdit = (banner) => {
    setEditingId(banner._id);

    setForm({
      title: banner.title || "",
      highlight: banner.highlight || "",
      eyebrow: banner.eyebrow || "",
      description: banner.description || "",
      image: banner.image || "",
      buttonText: banner.buttonText || "Shop Now",
      buttonLink: banner.buttonLink || "/products",
      isActive: banner.isActive ?? true,
      sortOrder: banner.sortOrder ?? 1,
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ============================================================
  // DELETE
  // ============================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this hero banner?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      const token = getToken();

      if (!token) {
        setError("Admin authentication required.");
        return;
      }

      const response = await deleteHeroBanner(id, token);

      if (response?.message?.toLowerCase().includes("success")) {
        setSuccess("Hero banner deleted successfully.");

        setBanners((prev) => prev.filter((banner) => banner._id !== id));

        if (editingId === id) {
          resetForm();
        }

        setTimeout(() => {
          setSuccess("");
        }, 3000);
      } else {
        setError(response?.message || "Unable to delete hero banner.");
      }
    } catch (error) {
      console.error("Delete Hero Banner Error:", error);

      setError("Unable to delete hero banner.");
    }
  };

  // ============================================================
  // TOGGLE ACTIVE STATUS
  // ============================================================

  const handleToggleActive = async (banner) => {
    try {
      setError("");
      setSuccess("");

      const token = getToken();

      if (!token) {
        setError("Admin authentication required.");
        return;
      }

      const updatedData = {
        title: banner.title,
        highlight: banner.highlight || "",
        eyebrow: banner.eyebrow || "",
        description: banner.description || "",
        image: banner.image,
        buttonText: banner.buttonText || "Shop Now",
        buttonLink: banner.buttonLink || "/products",
        isActive: !banner.isActive,
        sortOrder: banner.sortOrder || 0,
      };

      const response = await updateHeroBanner(banner._id, updatedData, token);

      if (response?.message?.toLowerCase().includes("success")) {
        setBanners((prev) =>
          prev.map((item) =>
            item._id === banner._id
              ? {
                  ...item,
                  isActive: !banner.isActive,
                }
              : item,
          ),
        );

        setSuccess(
          `Banner ${
            !banner.isActive ? "activated" : "deactivated"
          } successfully.`,
        );

        setTimeout(() => {
          setSuccess("");
        }, 2500);
      } else {
        setError(response?.message || "Unable to update banner status.");
      }
    } catch (error) {
      console.error("Toggle Hero Banner Error:", error);

      setError("Unable to update banner status.");
    }
  };

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <div className="h-9 w-64 animate-pulse rounded bg-gray-200" />

            <div className="mt-3 h-5 w-96 max-w-full animate-pulse rounded bg-gray-200" />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="h-[600px] animate-pulse rounded-2xl bg-white shadow-sm" />

            <div className="h-[600px] animate-pulse rounded-2xl bg-white shadow-sm" />
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="mb-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-green-700">
                Store Management
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
                Hero Banners
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 sm:text-base">
                Manage the promotional banners displayed on your ecommerce
                homepage.
              </p>
            </div>

            <div className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm">
              {banners.length} {banners.length === 1 ? "Banner" : "Banners"}
            </div>
          </div>
        </div>

        {/* ======================================================
            ALERTS
        ====================================================== */}

        {error && (
          <div className="mb-6 flex items-start justify-between gap-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{error}</span>

            <button
              onClick={() => setError("")}
              className="font-bold"
              aria-label="Close error"
            >
              ×
            </button>
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {success}
          </div>
        )}

        {/* ======================================================
            MAIN GRID
        ====================================================== */}

        <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
          {/* ====================================================
              FORM
          ==================================================== */}

          <div className="h-fit rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-6 py-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-gray-950">
                    {editingId ? "Edit Banner" : "Create Banner"}
                  </h2>

                  <p className="mt-1 text-xs text-gray-500">
                    {editingId
                      ? "Update your existing homepage banner."
                      : "Add a new homepage banner."}
                  </p>
                </div>

                {editingId && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:border-gray-400 hover:text-gray-950"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              {/* Eyebrow */}

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-600">
                  Eyebrow
                </label>

                <input
                  type="text"
                  name="eyebrow"
                  value={form.eyebrow}
                  onChange={handleChange}
                  placeholder="FRESHNESS, DELIVERED."
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* Title */}

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-600">
                  Title *
                </label>

                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Naturally fresh."
                  required
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* Highlight */}

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-600">
                  Highlight
                </label>

                <input
                  type="text"
                  name="highlight"
                  value={form.highlight}
                  onChange={handleChange}
                  placeholder="Exceptionally selected."
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* Description */}

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-600">
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Discover carefully selected fruits..."
                  rows="4"
                  className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* Image */}

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-600">
                  Image Path *
                </label>

                <input
                  type="text"
                  name="image"
                  value={form.image}
                  onChange={handleChange}
                  placeholder="/hero/fruits-1.jpg"
                  required
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />

                <p className="mt-2 text-[11px] leading-5 text-gray-400">
                  Example: /hero/fruits-1.jpg
                </p>
              </div>

              {/* Image Preview */}

              {form.image && (
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                  <img
                    src={form.image}
                    alt="Banner preview"
                    className="h-40 w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}

              {/* Button Text */}

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-600">
                  Button Text
                </label>

                <input
                  type="text"
                  name="buttonText"
                  value={form.buttonText}
                  onChange={handleChange}
                  placeholder="Shop Fresh Fruits"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* Button Link */}

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-600">
                  Button Link
                </label>

                <input
                  type="text"
                  name="buttonLink"
                  value={form.buttonLink}
                  onChange={handleChange}
                  placeholder="/products"
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {/* Sort Order */}

              <div>
                <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-600">
                  Sort Order
                </label>

                <input
                  type="number"
                  name="sortOrder"
                  min="0"
                  value={form.sortOrder}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />

                <p className="mt-2 text-[11px] text-gray-400">
                  Lower numbers appear first.
                </p>
              </div>

              {/* Active */}

              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Active Banner
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    Show this banner on the homepage.
                  </p>
                </div>

                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                  className="h-5 w-5 accent-green-600"
                />
              </label>

              {/* Submit */}

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-xl bg-gray-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Banner"
                    : "Create Banner"}
              </button>

              {/* Reset */}

              {!editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-400 hover:text-gray-950"
                >
                  Clear Form
                </button>
              )}
            </form>
          </div>

          {/* ====================================================
              BANNERS LIST
          ==================================================== */}

          <div className="space-y-5">
            {/* Section heading */}

            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-950">
                  Existing Banners
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Control the banners shown on your homepage.
                </p>
              </div>
            </div>

            {/* Empty */}

            {banners.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl">
                  🖼️
                </div>

                <h3 className="font-semibold text-gray-900">
                  No hero banners yet
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Create your first homepage banner.
                </p>
              </div>
            ) : (
              banners
                .slice()
                .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
                .map((banner, index) => (
                  <div
                    key={banner._id}
                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
                  >
                    {/* Image */}

                    <div className="relative h-56 w-full overflow-hidden bg-gray-100 sm:h-64 lg:h-72">
                      <img
                        src={banner.image}
                        alt={`${banner.title} ${banner.highlight || ""}`}
                        className="h-full w-full object-cover transition duration-500 hover:scale-[1.02]"
                        onError={(e) => {
                          e.currentTarget.src =
                            "https://placehold.co/1200x600/f3f4f6/6b7280?text=Image+Not+Found";
                        }}
                      />

                      {/* Status */}

                      <div className="absolute left-4 top-4">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-bold shadow-sm ${
                            banner.isActive
                              ? "bg-green-600 text-white"
                              : "bg-gray-900/80 text-white"
                          }`}
                        >
                          {banner.isActive ? "ACTIVE" : "INACTIVE"}
                        </span>
                      </div>

                      {/* Order */}

                      <div className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-bold text-gray-800 shadow-sm backdrop-blur">
                        #{banner.sortOrder}
                      </div>
                    </div>

                    {/* Content */}

                    <div className="p-5 sm:p-6">
                      <div className="flex flex-col justify-between gap-5 sm:flex-row">
                        <div className="min-w-0 flex-1">
                          {banner.eyebrow && (
                            <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-green-700">
                              {banner.eyebrow}
                            </p>
                          )}

                          <h3 className="text-xl font-bold tracking-tight text-gray-950">
                            {banner.title}
                          </h3>

                          {banner.highlight && (
                            <p className="mt-1 text-lg font-semibold text-green-700">
                              {banner.highlight}
                            </p>
                          )}

                          {banner.description && (
                            <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-500">
                              {banner.description}
                            </p>
                          )}

                          <div className="mt-4 flex flex-wrap gap-2">
                            <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">
                              Button: {banner.buttonText || "Shop Now"}
                            </span>

                            <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600">
                              Link: {banner.buttonLink || "/products"}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}

                        <div className="flex shrink-0 flex-row gap-2 sm:flex-col">
                          <button
                            onClick={() => handleToggleActive(banner)}
                            className={`rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
                              banner.isActive
                                ? "border border-yellow-200 bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                                : "border border-green-200 bg-green-50 text-green-700 hover:bg-green-100"
                            }`}
                          >
                            {banner.isActive ? "Deactivate" : "Activate"}
                          </button>

                          <button
                            onClick={() => handleEdit(banner)}
                            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-xs font-semibold text-gray-700 transition hover:border-gray-400 hover:text-gray-950"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(banner._id)}
                            className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      {/* Footer */}

                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4 text-[11px] text-gray-400">
                        <span>Banner {index + 1}</span>

                        {banner.createdAt && (
                          <span>
                            Created{" "}
                            {new Date(banner.createdAt).toLocaleDateString(
                              "en-IN",
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
