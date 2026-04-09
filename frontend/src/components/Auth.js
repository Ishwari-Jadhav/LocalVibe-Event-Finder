import { useState } from "react";
import axios from "axios";

function Auth({ setUser }) {
  const [isLogin, setIsLogin] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        // LOGIN
        const res = await axios.post(
          "https://localvibe-backend-2f5t.onrender.com/api/auth/login",
          {
            email: form.email,
            password: form.password
          }
        );

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.userId);

        setUser(res.data.token); 

        alert("Login successful");
      } else {
        // REGISTER
        await axios.post(
          "https://localvibe-backend-2f5t.onrender.com/api/auth/register",
          form
        );

        alert("Registered successfully. Now login.");
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data?.msg || "Error");
    }
  };

  return (
    <div className="flex items-center justify-center h-[90vh] bg-gray-200">
        <div className="bg-white p-6 rounded-xl shadow-md w-80">
        
        <h2 className="font-bold mb-4 text-center text-lg">
            {isLogin ? "Login 🔐" : "Register 📝"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">

            {!isLogin && (
            <input
                className="w-full p-2 border rounded"
                placeholder="Name"
                onChange={(e) =>
                setForm({ ...form, name: e.target.value })
                }
            />
            )}

            <input
            className="w-full p-2 border rounded"
            placeholder="Email"
            onChange={(e) =>
                setForm({ ...form, email: e.target.value })
            }
            />

            <input
            type="password"
            className="w-full p-2 border rounded"
            placeholder="Password"
            onChange={(e) =>
                setForm({ ...form, password: e.target.value })
            }
            />

            <button className="w-full bg-blue-500 text-white p-2 rounded">
            {isLogin ? "Login" : "Register"}
            </button>
        </form>

        <p
            className="text-sm text-blue-500 mt-3 text-center cursor-pointer"
            onClick={() => setIsLogin(!isLogin)}
        >
            {isLogin
            ? "Don't have account? Register"
            : "Already have account? Login"}
        </p>
        </div>
    </div>
    );
}

export default Auth;