import React, { useState } from "react";

const WisePayoutAdmin = () => {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("");
  const [recipientId, setRecipientId] = useState("");
  const [reference, setReference] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const token = localStorage.getItem("adminBearerToken");
      if (!token) {
        setError("Admin token not found. Please login.");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/admin/wise-payout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount, currency, recipientId, reference }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Payout successful.");
        setAmount("");
        setCurrency("");
        setRecipientId("");
        setReference("");
      } else {
        setError(data.error || "An error occurred.");
      }
    } catch (err) {
      setError("An error occurred.");
    }

    setLoading(false);
  };

  return (
    <div className="admin-container">
      <h1>Wise Payout</h1>
      <form onSubmit={handleSubmit} className="admin-form">
        <label>
          Amount
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="0"
            step="0.01"
          />
        </label>
        <label>
          Currency
          <input
            type="text"
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            required
          />
        </label>
        <label>
          Recipient ID
          <input
            type="text"
            value={recipientId}
            onChange={(e) => setRecipientId(e.target.value)}
            required
          />
        </label>
        <label>
          Reference
          <input
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Submit"}
        </button>
      </form>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <style jsx>{`
        .admin-container {
          max-width: 600px;
          margin: 2rem auto;
          padding: 1rem;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          font-family: Arial, sans-serif;
        }
        h1 {
          text-align: center;
          margin-bottom: 1.5rem;
        }
        .admin-form {
          display: flex;
          flex-direction: column;
        }
        label {
          margin-bottom: 1rem;
          font-weight: bold;
        }
        input {
          width: 100%;
          padding: 0.5rem;
          margin-top: 0.25rem;
          border: 1px solid #ccc;
          border-radius: 4px;
          font-size: 1rem;
        }
        button {
          padding: 0.75rem;
          background-color: #0070f3;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }
        button:disabled {
          background-color: #999;
          cursor: not-allowed;
        }
        button:hover:not(:disabled) {
          background-color: #005bb5;
        }
        .success-message {
          color: green;
          margin-top: 1rem;
          text-align: center;
        }
        .error-message {
          color: red;
          margin-top: 1rem;
          text-align: center;
        }
      `}</style>
    </div>
  );
};

export default WisePayoutAdmin;
