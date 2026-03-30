import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, CheckCircle, Settings } from "lucide-react";
import authService from "../../services/authService";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await authService.adminLogin(
        formData.email,
        formData.password
      );

      // ✅ SUCCESS CASE
      if (result?.token) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("adminName", result.name || "Admin");
        localStorage.setItem("adminEmail", result.email || formData.email);
        localStorage.setItem("userRole", result.role || "ADMIN");

        navigate("/admin");
      } else {
        setError("Invalid email or password");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full max-w-6xl h-[650px] bg-primary rounded-3xl overflow-hidden shadow-2xl border border-border-color">
      {/* LEFT PANEL */}
      <div className="w-[40%] hidden lg:flex flex-col justify-center items-center text-white p-12 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-black to-gray-800 opacity-95 z-10" />
        <img
          src="/images/admin-login.png"
          alt="Admin Login"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="relative z-20 text-center">
          <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center text-5xl mb-6 mx-auto shadow-lg">
            <Settings size={48} />
          </div>
          <h2 className="text-4xl font-bold mb-4">Welcome Administrator!</h2>
          <p className="text-lg opacity-90 mb-8">
            Access your dashboard to manage platform
          </p>
          <ul className="space-y-3">
            <li className="flex items-center gap-3">
              <CheckCircle size={20} /> Full platform control
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle size={20} /> Analytics & reports
            </li>
            <li className="flex items-center gap-3">
              <CheckCircle size={20} /> User management
            </li>
          </ul>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-full lg:w-[60%] p-16 flex flex-col justify-center bg-primary">
        <h2 className="text-4xl font-bold mb-3 text-text-primary">
          Admin Login
        </h2>
        <p className="text-text-secondary text-lg mb-10">
          Please enter your credentials to continue
        </p>

        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              required
              className="w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:border-accent"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              required
              className="w-full pl-12 pr-4 py-4 border-2 rounded-xl focus:outline-none focus:border-accent"
            />
          </div>

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
              />
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-accent to-accent-hover text-white py-4 rounded-xl text-lg font-bold transition-all hover:shadow-xl disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In →"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
