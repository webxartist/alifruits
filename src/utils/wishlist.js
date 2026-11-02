export const getWishlist = () => {
  return JSON.parse(localStorage.getItem("wishlist")) || [];
};

export const addToWishlist = (product) => {
  let wishlist = getWishlist();

  const exists = wishlist.find((item) => item._id === product._id);

  if (!exists) {
    wishlist.push(product);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }
};

export const removeFromWishlist = (id) => {
  let wishlist = getWishlist().filter((item) => item._id !== id);
  localStorage.setItem("wishlist", JSON.stringify(wishlist));
};
