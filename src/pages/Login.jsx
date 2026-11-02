import { useState, useContext } from "react";
import { loginUser } from "../services/api";
import { UserContext } from "../context/UserContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    setLoading(true);

    console.log("STEP 5: Calling API...");

    try {
      const data = await loginUser({
        email,
        password,
      });

      console.log("API RESPONSE:", data);

      // ========================================================
      // LOGIN SUCCESS
      // ========================================================

      if (data?.token && data?.user) {
        // ======================================================
        // CREATE CORRECT USER OBJECT
        // ======================================================

        const userInfo = {
          ...data.user,
          token: data.token,
        };

        console.log("USER INFO TO SAVE:", userInfo);

        // ======================================================
        // SAVE USER TO LOCAL STORAGE
        // ======================================================

        localStorage.setItem("userInfo", JSON.stringify(userInfo));

        // ======================================================
        // UPDATE USER CONTEXT
        // ======================================================

        login(userInfo);

        alert("Login Success ✅");

        // ======================================================
        // ROLE BASED REDIRECT
        // ======================================================

        const userRole = String(data.user.role || "")
          .trim()
          .toLowerCase();

        console.log("USER ROLE:", userRole);

        if (userRole === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }

        return;
      }

      // ========================================================
      // LOGIN FAILED
      // ========================================================

      alert(data?.message || "Login Failed ❌");
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      alert(
        error?.response?.data?.message || error?.message || "Server Error ❌",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] bg-[#f8faf5] px-4 py-10 sm:py-16">
      <div className="mx-auto flex w-full max-w-[1920px] items-center justify-center">
        <div className="w-full max-w-md">
          <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-xl">
            {/* ==================================================
                BRAND AREA
            ================================================== */}

            <div className="bg-[#f5f7f1] px-6 py-8 text-center sm:px-10">
              <Link to="/" className="inline-flex items-center gap-2">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-700 text-white shadow-sm">
                  <span className="text-lg font-bold">W</span>
                </div>

                <div className="text-left leading-none">
                  <span className="block text-xl font-bold tracking-[-0.03em] text-gray-950">
                    WebX
                    <span className="text-green-700">Shop</span>
                  </span>

                  <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[0.18em] text-gray-400">
                    Fresh • Simple • Better
                  </span>
                </div>
              </Link>

              <div className="mt-7">
                <div className="mb-3 flex items-center justify-center gap-2">
                  <span className="h-px w-6 bg-green-700" />

                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-800">
                    Welcome Back
                  </span>

                  <span className="h-px w-6 bg-green-700" />
                </div>

                <h1 className="text-2xl font-semibold tracking-[-0.04em] text-gray-950 sm:text-3xl">
                  Sign in to your account
                </h1>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Access your orders, wishlist and shopping account.
                </p>
              </div>
            </div>

            {/* ==================================================
                FORM
            ================================================== */}

            <form
              onSubmit={submitHandler}
              className="px-6 py-7 sm:px-10 sm:py-9"
            >
              {/* EMAIL */}

              <div className="mb-5">
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-gray-600"
                >
                  Email Address
                </label>

                <div className="relative">
                  <div className="pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 items-center text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.7"
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25H4.5a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0l-7.5-4.615A2.25 2.25 0 0 1 2.25 6.993V6.75"
                      />
                    </svg>
                  </div>

                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    required
                    autoComplete="email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-gray-200
                      bg-gray-50
                      pl-12
                      pr-4
                      text-sm
                      text-gray-900
                      outline-none
                      transition-all
                      duration-300
                      placeholder:text-gray-400
                      focus:border-green-700
                      focus:bg-white
                      focus:ring-4
                      focus:ring-green-700/10
                    "
                  />
                </div>
              </div>

              {/* PASSWORD */}

              <div className="mb-6">
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold uppercase tracking-[0.12em] text-gray-600"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-xs font-semibold text-green-700 transition-colors hover:text-green-900"
                    onClick={() => navigate("/forgot-password")}
                  >
                    Forgot Password?
                  </button>
                </div>

                <div className="relative">
                  <div className="pointer-events-none absolute left-4 top-1/2 flex -translate-y-1/2 items-center text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.7"
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 0h10.5A2.25 2.25 0 0 1 19.5 12.75v6A2.25 2.25 0 0 1 17.25 21H6.75a2.25 2.25 0 0 1-2.25-2.25v-6a2.25 2.25 0 0 1 2.25-2.25Z"
                      />
                    </svg>
                  </div>

                  <input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    required
                    autoComplete="current-password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="
                      h-12
                      w-full
                      rounded-xl
                      border
                      border-gray-200
                      bg-gray-50
                      pl-12
                      pr-4
                      text-sm
                      text-gray-900
                      outline-none
                      transition-all
                      duration-300
                      placeholder:text-gray-400
                      focus:border-green-700
                      focus:bg-white
                      focus:ring-4
                      focus:ring-green-700/10
                    "
                  />
                </div>
              </div>

              {/* LOGIN */}

              <button
                type="submit"
                disabled={loading}
                className="
                  group
                  flex
                  min-h-[50px]
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
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Signing In...
                  </>
                ) : (
                  <>
                    Login
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      →
                    </span>
                  </>
                )}
              </button>

              {/* DIVIDER */}

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-gray-100" />

                <span className="text-[10px] font-medium uppercase tracking-wider text-gray-400">
                  New to WebXShop?
                </span>

                <div className="h-px flex-1 bg-gray-100" />
              </div>

              {/* REGISTER */}

              <Link
                to="/register"
                className="
                  flex
                  min-h-[48px]
                  w-full
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-gray-200
                  bg-white
                  px-6
                  text-sm
                  font-semibold
                  text-gray-800
                  transition-all
                  duration-300
                  hover:border-green-700
                  hover:text-green-700
                "
              >
                Create an Account
              </Link>

              {/* SHOP */}

              <Link
                to="/products"
                className="mt-5 flex items-center justify-center gap-2 text-xs font-semibold text-gray-500 transition-colors hover:text-green-700"
              >
                ← Continue Shopping
              </Link>
            </form>
          </div>

          {/* TRUST */}

          <div className="mt-6 grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-xs font-semibold text-gray-800">Secure</p>
              <p className="mt-1 text-[10px] text-gray-400">Protected login</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-800">Simple</p>
              <p className="mt-1 text-[10px] text-gray-400">Easy shopping</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-800">Reliable</p>
              <p className="mt-1 text-[10px] text-gray-400">Quality service</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
