import React from "react";
export default function Sidebar({ active, setActive }) {
    const menuItems = ["Dashboard", "Deposit", "Withdraw", "History"];

    return (
        <div className="bg-purple-700 text-white h-screen w-64 flex flex-col p-6 space-y-4">
            <h1 className="text-2xl font-bold mb-6 text-center">Wallet</h1>

            {menuItems.map((item) => (
                <button
                    key={item}
                    onClick={() => setActive(item)}
                    className={`text-left px-4 py-2 rounded-lg transition ${
                        active === item ? "bg-purple-500" : "hover:bg-purple-600"
                    }`}
                >
                    {item}
                </button>
            ))}
        </div>
    );
}
