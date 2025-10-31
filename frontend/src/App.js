import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />

                {/* Protected Dashboard Routes */}
                <Route path="/dashboard/*" element={<DashboardRoutes />} />

                {/* Redirect unknown routes to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

// Nested Dashboard Routes Component
function DashboardRoutes() {
    return (
        <Routes>
            <Route index element={<Dashboard defaultView="Dashboard" />} />
            <Route path="deposit" element={<Dashboard defaultView="Deposit" />} />
            <Route path="withdraw" element={<Dashboard defaultView="Withdraw" />} />
            <Route path="history" element={<Dashboard defaultView="History" />} />
        </Routes>
    );
}
