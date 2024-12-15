import clsx from "clsx";
import { useState } from "react";
import { useRouter } from "next/router";

export const SignupForm = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({ username: "", password: "", confirmPassword: "" });

  const validateInputs = () => {
    const newErrors = { username: "", password: "", confirmPassword: "" };
    let isValid = true;

    if (!username.trim()) {
      newErrors.username = "จําเป็นต้องใส่ชื่อผู้ใช้";
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = "จําเป็นต้องใส่รหัสผ่าน";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
      isValid = false;
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "จําเป็นต้องใส่ยืนยันรหัสผ่าน";
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "รหัสผ่านไม่ตรงกัน";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignup = async () => {
    if (validateInputs()) {
      console.log("Signup with:", { username, password });
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      setErrors({ username: "", password: "", confirmPassword: "" });

      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (res.ok) return router.push("/signin");
    }
  };

  return (
    <div className="max-w-md mx-4 w-full bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold text-center mb-6">ลงทะเบียน</h3>

      {/* Username Input */}
      <div className="mb-4">
        <label htmlFor="username" className="block text-gray-700 font-medium mb-2">
          Username
        </label>
        <input
          id="username"
          type="text"
          className={clsx(
            "w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2",
            errors.username ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
          )}
          placeholder="โปรดใส่ชื่อผู้ใช้"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
      </div>

      {/* Password Input */}
      <div className="mb-4">
        <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
          Password
        </label>
        <input
          id="password"
          type="password"
          className={clsx(
            "w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2",
            errors.password ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"
          )}
          placeholder="โปรดใส่รหัสผ่าน"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
      </div>

      {/* Confirm Password Input */}
      <div className="mb-6">
        <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          className={clsx(
            "w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2",
            errors.confirmPassword
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500"
          )}
          placeholder="โปรดยืนยันรหัสผ่าน"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
      </div>

      {/* Signup Button */}
      <button
        className="w-full bg-blue-500 font-semibold text-lg text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
        onClick={handleSignup}
      >
        ยืนยัน
      </button>
    </div>
  );
};
