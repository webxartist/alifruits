const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ============================================================
// LOGIN API
// ============================================================

export const loginUser = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(result?.message || "Login failed");
    }

    return result;
  } catch (error) {
    console.error("Login Error:", error);
    throw error;
  }
};

export const forgotPassword = async (email) => {
  const res = await fetch(`${BASE_URL}/users/forgot-password`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Unable to request password reset");
  return data;
};

export const resetPassword = async (token, password) => {
  const res = await fetch(`${BASE_URL}/users/reset-password/${token}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Unable to reset password");
  return data;
};

// ============================================================
// CUSTOMER REGISTRATION
// POST /api/users/register
// ============================================================

export const registerUser = async (data) => {
  const res = await fetch(`${BASE_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(result?.message || "Registration failed");
  return result;
};

// ============================================================
// HERO BANNERS
// ============================================================

// ============================================================
// PUBLIC - GET ACTIVE HERO BANNERS
// GET /api/hero-banners
// ============================================================

export const getHeroBanners = async () => {
  try {
    const res = await fetch(`${BASE_URL}/hero-banners`);

    const data = await res.json().catch(() => []);

    if (!res.ok) {
      throw new Error(data?.message || "Failed to fetch hero banners");
    }

    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data?.banners)) {
      return data.banners;
    }

    if (Array.isArray(data?.data)) {
      return data.data;
    }

    return [];
  } catch (error) {
    console.error("Get Hero Banners Error:", error);
    return [];
  }
};

// ============================================================
// ADMIN - GET ALL HERO BANNERS
// GET /api/hero-banners/admin
// ============================================================

export const getAllHeroBanners = async (token) => {
  try {
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const res = await fetch(`${BASE_URL}/hero-banners/admin`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.message || "Failed to fetch admin hero banners");
    }

    return data;
  } catch (error) {
    console.error("Get All Hero Banners Error:", error);
    throw error;
  }
};

// ============================================================
// ADMIN - CREATE HERO BANNER
// POST /api/hero-banners
// ============================================================

export const createHeroBanner = async (bannerData, token) => {
  try {
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const res = await fetch(`${BASE_URL}/hero-banners`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bannerData),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.message || "Failed to create hero banner");
    }

    return data;
  } catch (error) {
    console.error("Create Hero Banner Error:", error);
    throw error;
  }
};

// ============================================================
// ADMIN - UPDATE HERO BANNER
// PUT /api/hero-banners/:id
// ============================================================

export const updateHeroBanner = async (id, bannerData, token) => {
  try {
    if (!id) {
      throw new Error("Banner ID is required");
    }

    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const res = await fetch(`${BASE_URL}/hero-banners/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bannerData),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.message || "Failed to update hero banner");
    }

    return data;
  } catch (error) {
    console.error("Update Hero Banner Error:", error);
    throw error;
  }
};

// ============================================================
// ADMIN - DELETE HERO BANNER
// DELETE /api/hero-banners/:id
// ============================================================

export const deleteHeroBanner = async (id, token) => {
  try {
    if (!id) {
      throw new Error("Banner ID is required");
    }

    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const res = await fetch(`${BASE_URL}/hero-banners/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.message || "Failed to delete hero banner");
    }

    return data;
  } catch (error) {
    console.error("Delete Hero Banner Error:", error);
    throw error;
  }
};

// ============================================================
// PRODUCTS
// ============================================================

// ============================================================
// PRODUCT RESPONSE HELPER
// ============================================================

const normalizeProducts = (data) => {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.products)) {
    return data.products;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  return [];
};

// ============================================================
// CREATE PRODUCT
// POST /api/products
// ============================================================

export const createProduct = async (productData, token) => {
  try {
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const res = await fetch(`${BASE_URL}/admin/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.message || "Failed to create product");
    }

    console.log("CREATE PRODUCT RESPONSE:", data);

    return data;
  } catch (error) {
    console.error("Create Product Error:", error);
    throw error;
  }
};

// ============================================================
// GET ALL PRODUCTS
// GET /api/products
// ============================================================

export const getProducts = async (limit = 100) => {
  try {
    const res = await fetch(
      `${BASE_URL}/products?limit=${encodeURIComponent(limit)}`,
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.message || "Failed to fetch products");
    }

    console.log("GET ALL PRODUCTS RESPONSE:", data);

    return normalizeProducts(data);
  } catch (error) {
    console.error("Get Products Error:", error);
    return [];
  }
};

// ============================================================
// GET TOP DEALS
// GET /api/products/top-deals
// ============================================================

export const getTopDeals = async (limit = 8) => {
  try {
    const res = await fetch(
      `${BASE_URL}/products/top-deals?limit=${encodeURIComponent(limit)}`,
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.message || "Failed to fetch top deals");
    }

    console.log("GET TOP DEALS RESPONSE:", data);

    return normalizeProducts(data);
  } catch (error) {
    console.error("Get Top Deals Error:", error);
    return [];
  }
};

// ============================================================
// GET FEATURED PRODUCTS
// GET /api/products/featured
// ============================================================

export const getFeaturedProducts = async (limit = 8) => {
  try {
    const res = await fetch(
      `${BASE_URL}/products/featured?limit=${encodeURIComponent(limit)}`,
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.message || "Failed to fetch featured products");
    }

    console.log("GET FEATURED PRODUCTS RESPONSE:", data);

    return normalizeProducts(data);
  } catch (error) {
    console.error("Get Featured Products Error:", error);
    return [];
  }
};

// ============================================================
// GET NEW ARRIVALS
// GET /api/products/new-arrivals
// ============================================================

export const getNewArrivals = async (limit = 8) => {
  try {
    const res = await fetch(
      `${BASE_URL}/products/new-arrivals?limit=${encodeURIComponent(limit)}`,
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.message || "Failed to fetch new arrivals");
    }

    console.log("GET NEW ARRIVALS RESPONSE:", data);

    return normalizeProducts(data);
  } catch (error) {
    console.error("Get New Arrivals Error:", error);
    return [];
  }
};

// ============================================================
// GET POPULAR PRODUCTS
// GET /api/products/popular
// ============================================================

export const getPopularProducts = async (limit = 8) => {
  try {
    const res = await fetch(
      `${BASE_URL}/products/popular?limit=${encodeURIComponent(limit)}`,
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.message || "Failed to fetch popular products");
    }

    console.log("GET POPULAR PRODUCTS RESPONSE:", data);

    return normalizeProducts(data);
  } catch (error) {
    console.error("Get Popular Products Error:", error);
    return [];
  }
};

// ============================================================
// GET PRODUCTS BY CATEGORY
// GET /api/products/category/:category
// ============================================================

export const getProductsByCategory = async (category, limit = 8) => {
  try {
    if (!category) {
      return [];
    }

    const res = await fetch(
      `${BASE_URL}/products/category/${encodeURIComponent(
        category,
      )}?limit=${encodeURIComponent(limit)}`,
    );

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.message || "Failed to fetch category products");
    }

    console.log("GET CATEGORY PRODUCTS RESPONSE:", data);

    return normalizeProducts(data);
  } catch (error) {
    console.error("Get Category Products Error:", error);
    return [];
  }
};

// ============================================================
// GET SINGLE PRODUCT
// GET /api/products/:id
// ============================================================

export const getSingleProduct = async (id) => {
  try {
    if (!id) {
      return null;
    }

    const res = await fetch(`${BASE_URL}/products/${id}`);

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.message || "Failed to fetch product");
    }

    console.log("GET SINGLE PRODUCT RESPONSE:", data);

    return data?.product || data?.data || data;
  } catch (error) {
    console.error("Get Product Error:", error);
    return null;
  }
};

// ============================================================
// SEARCH PRODUCTS
// GET /api/products/search
// ============================================================

export const searchProducts = async (keyword, category, sort) => {
  try {
    const params = new URLSearchParams({
      keyword: keyword || "",
      category: category || "",
      sort: sort || "",
    });

    const res = await fetch(`${BASE_URL}/products/search?${params.toString()}`);

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.message || "Failed to search products");
    }

    console.log("SEARCH PRODUCTS RESPONSE:", data);

    return normalizeProducts(data);
  } catch (error) {
    console.error("Search Products Error:", error);
    return [];
  }
};

// ============================================================
// ORDERS
// ============================================================

// ============================================================
// CREATE ORDER
// POST /api/orders
// ============================================================

export const createOrder = async (orderData, token) => {
  try {
    if (!token) {
      throw new Error("No token");
    }

    const res = await fetch(`${BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.message || "Failed to create order");
    }

    console.log("CREATE ORDER RESPONSE:", data);

    return data;
  } catch (error) {
    console.error("Create Order Error:", error);
    throw error;
  }
};

// ============================================================
// USER ORDERS
// GET /api/orders/my
// ============================================================

export const getMyOrders = async (token) => {
  try {
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const res = await fetch(`${BASE_URL}/orders/my`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.message || "Failed to fetch orders");
    }

    console.log("MY ORDERS RESPONSE:", data);

    return data;
  } catch (error) {
    console.error("Get My Orders Error:", error);
    throw error;
  }
};

// ============================================================
// VENDOR ORDERS
// GET /api/orders/vendor
// ============================================================

export const getVendorOrders = async (token) => {
  try {
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const res = await fetch(`${BASE_URL}/orders/vendor`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.message || "Failed to fetch vendor orders");
    }

    console.log("VENDOR ORDERS RESPONSE:", data);

    return data;
  } catch (error) {
    console.error("Get Vendor Orders Error:", error);
    throw error;
  }
};

// ============================================================
// VENDOR STATS
// GET /api/orders/vendor/stats
// ============================================================

export const getVendorStats = async (token) => {
  try {
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const res = await fetch(`${BASE_URL}/orders/vendor/stats`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.message || "Failed to fetch vendor statistics");
    }

    console.log("VENDOR STATS RESPONSE:", data);

    return data;
  } catch (error) {
    console.error("Get Vendor Stats Error:", error);
    throw error;
  }
};

// ============================================================
// UPDATE VENDOR ORDER STATUS
// PUT /api/orders/:id/status
// ============================================================

export const updateVendorOrderStatus = async (orderId, status, token) => {
  try {
    if (!orderId) {
      throw new Error("Order ID is required");
    }

    if (!status) {
      throw new Error("Order status is required");
    }

    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const res = await fetch(`${BASE_URL}/orders/${orderId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        status,
      }),
    });

    const data = await res.json().catch(() => ({}));

    console.log("UPDATE VENDOR ORDER RESPONSE:", data);

    if (!res.ok) {
      throw new Error(data?.message || "Failed to update order status");
    }

    return data;
  } catch (error) {
    console.error("Update Vendor Order Status Error:", error);
    throw error;
  }
};

// ============================================================
// UPDATE ORDER STATUS
// PUT /api/orders/:id/status
//
// Kept as an alias-compatible function because some components
// may import updateOrderStatus.
// ============================================================

export const updateOrderStatus = async (orderId, status, token) => {
  return updateVendorOrderStatus(orderId, status, token);
};

// ============================================================
// ADMIN USERS
// ============================================================

// ============================================================
// GET ALL USERS
// GET /api/admin/users
// ============================================================

export const getAllUsers = async (token) => {
  try {
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const res = await fetch(`${BASE_URL}/admin/users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.message || "Failed to fetch users");
    }

    return data;
  } catch (error) {
    console.error("Get All Users Error:", error);
    throw error;
  }
};

// ============================================================
// DELETE USER
// DELETE /api/admin/users/:id
// ============================================================

export const deleteUser = async (id, token) => {
  try {
    if (!id) {
      throw new Error("User ID is required");
    }

    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const res = await fetch(`${BASE_URL}/admin/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.message || "Failed to delete user");
    }

    return data;
  } catch (error) {
    console.error("Delete User Error:", error);
    throw error;
  }
};

// ============================================================
// ADMIN PRODUCTS
// ============================================================

// ============================================================
// GET ALL PRODUCTS - ADMIN
// GET /api/products/admin/all
// ============================================================

export const getAllProducts = async (token) => {
  try {
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const res = await fetch(`${BASE_URL}/admin/products`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.message || "Failed to fetch admin products");
    }

    return data;
  } catch (error) {
    console.error("Get All Admin Products Error:", error);
    throw error;
  }
};

// ============================================================
// DELETE PRODUCT
// DELETE /api/admin/products/:id
// ============================================================

export const deleteProduct = async (id, token) => {
  try {
    if (!id) {
      throw new Error("Product ID is required");
    }

    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const res = await fetch(`${BASE_URL}/admin/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.message || "Failed to delete product");
    }

    return data;
  } catch (error) {
    console.error("Delete Product Error:", error);
    throw error;
  }
};

// ============================================================
// ADMIN ORDERS
// ============================================================

// ============================================================
// GET ALL ORDERS
// GET /api/admin/orders
// ============================================================

export const getAllOrders = async (token) => {
  try {
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const res = await fetch(`${BASE_URL}/admin/orders`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.message || "Failed to fetch admin orders");
    }

    return data;
  } catch (error) {
    console.error("Get All Orders Error:", error);
    throw error;
  }
};

// ============================================================
// ADMIN STATISTICS
// ============================================================

// ============================================================
// ADMIN STATS
// GET /api/admin/stats
// ============================================================

export const getAdminStats = async (token) => {
  try {
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const res = await fetch(`${BASE_URL}/admin/stats`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.message || "Failed to fetch admin stats");
    }

    return data;
  } catch (error) {
    console.error("Get Admin Stats Error:", error);
    throw error;
  }
};

// ============================================================
// MONTHLY REVENUE
// GET /api/admin/monthly-revenue
// ============================================================

export const getMonthlyRevenue = async (token) => {
  try {
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const res = await fetch(`${BASE_URL}/admin/monthly-revenue`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.message || "Failed to fetch monthly revenue");
    }

    return data;
  } catch (error) {
    console.error("Get Monthly Revenue Error:", error);
    throw error;
  }
};


// ============================================================
// ACCOUNT
// ============================================================

export const getMyProfile = async (token) => {
  if (!token) throw new Error("Authentication token is missing");
  const res = await fetch(`${BASE_URL}/users/me`, { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to fetch profile");
  return data;
};

export const updateMyProfile = async (profileData, token) => {
  if (!token) throw new Error("Authentication token is missing");
  const res = await fetch(`${BASE_URL}/users/profile`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(profileData),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to update profile");
  return data;
};

export const changeMyPassword = async (passwordData, token) => {
  if (!token) throw new Error("Authentication token is missing");
  const res = await fetch(`${BASE_URL}/users/change-password`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(passwordData),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to change password");
  return data;
};

export const updateAdminOrderStatus = async (orderId, status, token, cancellationReason = "") => {
  if (!orderId || !token) throw new Error("Order ID and authentication token are required");
  const res = await fetch(`${BASE_URL}/admin/orders/${orderId}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status, cancellationReason }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to update order status");
  return data;
};

export const getAdminProduct = async (productId, token) => {
  if (!productId || !token) throw new Error("Product ID and authentication token are required");
  const res = await fetch(`${BASE_URL}/admin/products/${productId}`, { headers: { Authorization: `Bearer ${token}` } });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to fetch admin product");
  return data;
};

export const updateAdminProduct = async (productId, productData, token) => {
  if (!productId || !token) throw new Error("Product ID and authentication token are required");
  const res = await fetch(`${BASE_URL}/admin/products/${productId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify(productData),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Failed to update product");
  return data;
};

// ============================================================
// PAYMENT
// ============================================================

// ============================================================
// CREATE PAYMENT ORDER
// POST /api/payment/create-order
// ============================================================

export const createPaymentOrder = async (amount, token) => {
  try {
    if (!token) {
      throw new Error("No token");
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      throw new Error("Invalid payment amount");
    }

    const res = await fetch(`${BASE_URL}/payment/create-order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        amount: numericAmount,
      }),
    });

    const data = await res.json().catch(() => ({}));

    console.log("CREATE PAYMENT ORDER RESPONSE:", data);

    if (!res.ok) {
      throw new Error(data?.message || "Unable to create payment order");
    }

    if (data?.id) {
      return data;
    }

    if (data?.order?.id) {
      return {
        ...data.order,
        success: data.success,
      };
    }

    throw new Error("Invalid payment order response");
  } catch (error) {
    console.error("Create Payment Order Error:", error);
    throw error;
  }
};

// ============================================================
// VERIFY PAYMENT
// POST /api/payment/verify-payment
// ============================================================

export const verifyPayment = async (paymentData, token) => {
  try {
    if (!token) {
      throw new Error("No token");
    }

    if (!paymentData) {
      throw new Error("Payment data is required");
    }

    const res = await fetch(`${BASE_URL}/payment/verify-payment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(paymentData),
    });

    const data = await res.json().catch(() => ({}));

    console.log("VERIFY PAYMENT RESPONSE:", data);

    if (!res.ok) {
      throw new Error(data?.message || "Payment verification failed");
    }

    return data;
  } catch (error) {
    console.error("Verify Payment Error:", error);
    throw error;
  }
};

// ============================================================
// ADMIN PRODUCT APPROVAL
// ============================================================

// ============================================================
// GET PENDING PRODUCTS
// GET /api/products/admin/pending
// ============================================================

export const getPendingProducts = async (token) => {
  try {
    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const res = await fetch(`${BASE_URL}/admin/products/pending`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.message || "Failed to fetch pending products");
    }

    return data;
  } catch (error) {
    console.error("Get Pending Products Error:", error);
    throw error;
  }
};

// ============================================================
// APPROVE PRODUCT
// PUT /api/products/admin/:id/approve
// ============================================================

export const approveProduct = async (productId, token) => {
  try {
    if (!productId) {
      throw new Error("Product ID is required");
    }

    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const res = await fetch(`${BASE_URL}/admin/products/${productId}/approve`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.message || "Failed to approve product");
    }

    return data;
  } catch (error) {
    console.error("Approve Product Error:", error);
    throw error;
  }
};

// ============================================================
// REJECT PRODUCT
// PUT /api/products/admin/:id/reject
// ============================================================

export const rejectProduct = async (
  productId,
  token,
  rejectionReason = "Product rejected by admin",
) => {
  try {
    if (!productId) {
      throw new Error("Product ID is required");
    }

    if (!token) {
      throw new Error("Authentication token is missing");
    }

    const res = await fetch(`${BASE_URL}/admin/products/${productId}/reject`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        rejectionReason,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data?.message || "Failed to reject product");
    }

    return data;
  } catch (error) {
    console.error("Reject Product Error:", error);
    throw error;
  }
};

// ============================================================
// ADMIN - UPDATE PRODUCT CONTROLS
// PUT /api/products/admin/:id/controls
//
// Admin can control:
// - featured
// - isTopDeal
// - isNewArrival
// - isPopular
// - isActive
// ============================================================

export const updateAdminProductControls = async (
  productId,
  controls,
  token,
) => {
  try {
    if (!productId) {
      throw new Error("Product ID is required");
    }

    if (!token) {
      throw new Error("Authentication token is missing");
    }

    console.log("========================================");
    console.log("UPDATE ADMIN PRODUCT CONTROLS");
    console.log("Product ID:", productId);
    console.log("Controls:", controls);
    console.log("Token exists:", !!token);

    // IMPORTANT:
    // Backend route is:
    // PUT /api/products/admin/:id/controls
    const requestUrl = `${BASE_URL}/admin/products/${productId}`;

    console.log("Request URL:", requestUrl);
    console.log("========================================");

    const res = await fetch(requestUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(controls),
    });

    const data = await res.json().catch(() => ({}));

    console.log("UPDATE PRODUCT STATUS:", res.status);
    console.log("UPDATE PRODUCT RESPONSE:", data);

    if (!res.ok) {
      throw new Error(
        data?.message ||
          data?.error ||
          `Failed to update product controls (HTTP ${res.status})`,
      );
    }

    return data;
  } catch (error) {
    console.error("Update Admin Product Controls Error:", error);
    throw error;
  }
};


// CUSTOMER ADDRESS BOOK
export const getMyAddresses = async (token) => apiRequest("/users/addresses", { token });
export const addMyAddress = async (data, token) => apiRequest("/users/addresses", { method: "POST", body: data, token });
export const updateMyAddress = async (id, data, token) => apiRequest(`/users/addresses/${id}`, { method: "PATCH", body: data, token });
export const deleteMyAddress = async (id, token) => apiRequest(`/users/addresses/${id}`, { method: "DELETE", token });

// PUBLIC AND ADMIN STORE SETTINGS
export const getPublicSiteSettings = async () => apiRequest("/site-settings");
export const getAdminSiteSettings = async (token) => apiRequest("/site-settings/admin", { token });
export const updateAdminSiteSettings = async (data, token) => apiRequest("/site-settings/admin", { method: "PUT", body: data, token });

// CUSTOMER ORDER ACTIONS
export const cancelMyOrder = async (id, reason, token) => apiRequest(`/orders/${id}/cancel`, { method: "POST", body: { reason }, token });
export const requestOrderReturn = async (id, payload, token) => apiRequest(`/orders/${id}/returns`, { method: "POST", body: payload, token });

// Shared authenticated JSON helper
async function apiRequest(path, { method = "GET", body, token } = {}) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${BASE_URL}${path}`, {
    method, headers, ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || "Request failed");
  return data;
}

export const updateAdminShipment = async (id, payload, token) => apiRequest(`/admin/orders/${id}/shipment`, { method: "PUT", body: payload, token });
export const updateAdminReturn = async (orderId, returnId, payload, token) => apiRequest(`/admin/orders/${orderId}/returns/${returnId}`, { method: "PUT", body: payload, token });
