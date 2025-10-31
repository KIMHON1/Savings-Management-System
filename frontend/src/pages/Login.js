import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export default function Login() {
    const location = useLocation();
    const navigate = useNavigate();

    const [form, setForm] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");
    const [verification, setVerification] = useState({
        required: false,
        deviceId: "",
        code: "",
    });

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const deviceFingerprint = navigator.userAgent + navigator.platform;
        const res = await axios.post("http://localhost:5000/api/auth/login", {
            ...form,
            deviceFingerprint,
        });

        const user = res.data.user;

        if (!user.isVerified) {
            // Device not verified
            setMessage("Your device is not verified. Please contact admin.");
            return; // stop login
        }

        // Device is verified — allow login
        if (res.data.token) {
            sessionStorage.setItem("token", res.data.token);
            sessionStorage.setItem("user", JSON.stringify(user));
            setMessage(`Welcome back, ${user.name || user.email}`);

            // Redirect to dashboard after 1 second
            setTimeout(() => {
                navigate("/dashboard");
            }, 1000);
        } else {
            setMessage("Unexpected response from server");
        }
    } catch (err) {
        setMessage(err.response?.data?.error || "Login failed");
    }
};


    const handleCodeChange = (e) =>
        setVerification({ ...verification, code: e.target.value });

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/auth/devices/confirm", {
                deviceId: verification.deviceId,
                code: verification.code,
            });
            setVerification({ required: false, deviceId: "", code: "" });
            setMessage("Device verified successfully. Please log in again.");
        } catch (err) {
            setMessage(err.response?.data?.message || "Invalid verification code");
        }
    };

    useEffect(() => {
        if (location.state?.message) {
            setMessage(location.state.message);
        }
    }, [location]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
            <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
                <h2 className="text-3xl font-bold mb-6 text-center text-purple-700">
                    Login
                </h2>

                {!verification.required ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email address"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
                        >
                            Login
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerify} className="space-y-4">
                        <input
                            type="text"
                            name="code"
                            placeholder="Enter verification code"
                            value={verification.code}
                            onChange={handleCodeChange}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                        >
                            Verify Device
                        </button>
                    </form>
                )}

                {message && (
                    <p className="text-center text-sm mt-4 text-gray-700">{message}</p>
                )}
            </div>
        </div>
    );
}
