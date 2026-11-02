import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const storedUser = localStorage.getItem("userInfo");

  // ============================================================
  // NOT LOGGED IN
  // ============================================================

  if (!storedUser) {
    console.log("ProtectedRoute: No user found");

    return <Navigate to="/login" replace />;
  }

  // ============================================================
  // PARSE USER
  // ============================================================

  let user;

  try {
    user = JSON.parse(storedUser);
  } catch (error) {
    console.error("ProtectedRoute: Invalid userInfo", error);

    localStorage.removeItem("userInfo");

    return <Navigate to="/login" replace />;
  }

  // ============================================================
  // NORMALIZE ROLE
  // ============================================================

  const userRole = String(user?.role || "")
    .trim()
    .toLowerCase();

  const requiredRole = String(role || "")
    .trim()
    .toLowerCase();

  console.log("ProtectedRoute:", {
    userRole,
    requiredRole,
    path: window.location.pathname,
  });

  // ============================================================
  // WRONG ROLE
  // ============================================================

  if (requiredRole && userRole !== requiredRole) {
    console.log("ROLE MISMATCH:", {
      userRole,
      requiredRole,
    });

    return <Navigate to="/" replace />;
  }

  // ============================================================
  // AUTHORIZED
  // ============================================================

  return children;
}
