import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import BalanceCard from "../components/BalanceCard";
import { transactionService } from "../services/transaction";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const [active, setActive] = useState("Dashboard");
    const [balance, setBalance] = useState(0);
    const [amount, setAmount] = useState("");
    const [note, setNote] = useState("");
    const [transactions, setTransactions] = useState([]);
    const [message, setMessage] = useState("");
    const [user, setUser] = useState({ name: "" });
    const navigate = useNavigate();

    // Load user info and balance
    useEffect(() => {
        const token = sessionStorage.getItem("token"); // use sessionStorage for session expiry
        if (!token) return navigate("/login");

        const decoded = jwtDecode(token);
        setUser({ name: decoded.name, email: decoded.email, id: decoded.id });
        setMessage(`Welcome back, ${decoded.name}`);

        fetchBalance();
    }, []);


    async function fetchBalance() {
        try {
            const data = await transactionService.getBalance();
            console.log(data);
            setBalance(data);
        } catch (err) {
            console.error(err);
        }
    }

    async function handleDeposit() {
        try {
            await transactionService.deposit(amount, note);
            setMessage("Deposit successful!");
            fetchBalance();
            setAmount("");
            setNote("");
            setActive("Dashboard"); // redirect to dashboard after deposit
        } catch (err) {
            setMessage(err.response?.data?.error || "Deposit failed");
        }
    }

    async function handleWithdraw() {
        try {
            await transactionService.withdraw(amount, note);
            setMessage("Withdrawal successful!");
            fetchBalance();
            setAmount("");
            setNote("");
            setActive("Dashboard"); // redirect to dashboard after withdraw
        } catch (err) {
            setMessage(err.response?.data?.error || "Withdrawal failed");
        }
    }

    async function handleHistory() {
        try {
            const data = await transactionService.history();
            setTransactions(data);
        } catch (err) {
            setMessage("Failed to fetch history");
        }
    }

    useEffect(() => {
        if (active === "History") handleHistory();
    }, [active]);

    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/login");
    }

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar active={active} setActive={setActive} />

            <div className="flex-1 p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-700">
                        Welcome, {user.name || "User"}!
                    </h1>
                    <button
                        onClick={handleLogout}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                        Logout
                    </button>
                </div>

                <BalanceCard balance={balance} />

                {message && (
                    <p className="mb-4 text-center text-sm text-gray-600">{message}</p>
                )}

                {active === "Dashboard" && (
                    <p className="text-gray-700">Welcome to your account dashboard.</p>
                )}

                {(active === "Deposit" || active === "Withdraw") && (
                    <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
                        <input
                            type="number"
                            placeholder="Amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full border p-3 rounded-md"
                        />
                        <input
                            type="text"
                            placeholder="Note (optional)"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="w-full border p-3 rounded-md"
                        />
                        <button
                            onClick={active === "Deposit" ? handleDeposit : handleWithdraw}
                            className={`w-full py-3 rounded-lg font-semibold text-white ${
                                active === "Deposit"
                                    ? "bg-green-600 hover:bg-green-700"
                                    : "bg-red-600 hover:bg-red-700"
                            }`}
                        >
                            {active === "Deposit" ? "Deposit" : "Withdraw"}
                        </button>
                    </div>
                )}

                {active === "History" && (
                    <div className="bg-white rounded-xl shadow-md mt-6 p-6">
                        <h3 className="text-lg font-bold mb-4">Transaction History</h3>
                        <table className="w-full border-collapse">
                            <thead>
                            <tr className="border-b text-left">
                                <th className="p-2">Date</th>
                                <th className="p-2">Type</th>
                                <th className="p-2">Amount</th>
                                <th className="p-2">Note</th>
                            </tr>
                            </thead>
                            <tbody>
                            {transactions.map((tx, i) => (
                                <tr key={i} className="border-b text-gray-700">
                                    <td className="p-2">
                                        {new Date(tx.createdAt).toLocaleString()}
                                    </td>
                                    <td
                                        className={`p-2 font-semibold ${
                                            tx.type === "deposit"
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {tx.type}
                                    </td>
                                    <td className="p-2">{tx.amount}</td>
                                    <td className="p-2">{tx.note || "-"}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
