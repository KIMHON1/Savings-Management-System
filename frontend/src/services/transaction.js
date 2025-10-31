import axios from "axios";

const API_URL = "http://localhost:5000/api/transactions";

function authHeader() {
    const token = sessionStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
}
export const transactionService = {
    async deposit(amount, note) {
        const res = await axios.post(`${API_URL}/deposit`, { amount, note }, { headers: authHeader() });
        return res.data;
    },

    async withdraw(amount, note) {
        const res = await axios.post(`${API_URL}/withdraw`, { amount, note }, { headers: authHeader() });
        return res.data;
    },

    async history() {
        const res = await axios.get(`${API_URL}/history`, { headers: authHeader() });
        return res.data.transactions;
    },

    async getBalance() {
        const res = await axios.get(`${API_URL}/balance`, { headers: authHeader() });
        console.log("Balance response:", res.data); // 
        return res.data.balance;
    }
};
