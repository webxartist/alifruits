// ============================================================
// CART UTILITIES
// ============================================================

// GET CART
export const getCart = () => {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch (error) {
    console.error("Get Cart Error:", error);
    return [];
  }
};

// ============================================================
// SAVE CART
// ============================================================

export const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));

  // 🔥 Tell Navbar / other components that cart changed
  window.dispatchEvent(new Event("cartUpdated"));
};

// ============================================================
// GET TOTAL CART QUANTITY
// ============================================================

export const getCartCount = () => {
  const cart = getCart();

  return cart.reduce((total, item) => {
    return total + (Number(item.qty) || 1);
  }, 0);
};

// ============================================================
// ADD TO CART
// ============================================================

export const addToCart = (product) => {
  let cart = getCart();

  const exist = cart.find((item) => item._id === product._id);

  if (exist) {
    cart = cart.map((item) =>
      item._id === product._id
        ? {
            ...item,
            qty: (Number(item.qty) || 1) + 1,
          }
        : item,
    );
  } else {
    cart.push({
      ...product,
      qty: 1,
    });
  }

  saveCart(cart);

  return cart;
};

// ============================================================
// INCREASE QTY
// ============================================================

export const increaseQty = (id) => {
  let cart = getCart();

  cart = cart.map((item) =>
    item._id === id
      ? {
          ...item,
          qty: (Number(item.qty) || 1) + 1,
        }
      : item,
  );

  saveCart(cart);

  return cart;
};

// ============================================================
// DECREASE QTY
// ============================================================

export const decreaseQty = (id) => {
  let cart = getCart();

  cart = cart
    .map((item) =>
      item._id === id
        ? {
            ...item,
            qty: (Number(item.qty) || 1) - 1,
          }
        : item,
    )
    .filter((item) => item.qty > 0);

  saveCart(cart);

  return cart;
};

// ============================================================
// REMOVE ITEM
// ============================================================

export const removeFromCart = (id) => {
  let cart = getCart();

  cart = cart.filter((item) => item._id !== id);

  saveCart(cart);

  return cart;
};

// ============================================================
// CLEAR CART
// ============================================================

export const clearCart = () => {
  localStorage.removeItem("cart");

  // 🔥 Update Navbar immediately
  window.dispatchEvent(new Event("cartUpdated"));
};
