import React from "react";
export default function BalanceCard({ balance }) {
    return (
        <div className="bg-white shadow-lg rounded-2xl p-6 mb-6">
            <h2 className="text-lg text-gray-600">Current Balance</h2>
            <p className="text-3xl font-bold text-purple-700 mt-2">
                {balance.toLocaleString()} RWF
            </p>
        </div>
    );
}
