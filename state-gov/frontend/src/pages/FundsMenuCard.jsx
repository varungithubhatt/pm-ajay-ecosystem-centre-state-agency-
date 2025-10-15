import React, { useState, useEffect } from "react";
import { FaGooglePay } from "react-icons/fa";
import axios from "axios";

function FundsMenuPage() {
  const [entered, setEntered] = useState(false);
  const [inputs, setInputs] = useState({
    bankName: "",
    accountNumber: "",
    ifsc: "",
    holderName: ""
  });
  const [accountId, setAccountId] = useState(null);

  // Bank/Account Data
  const [details, setDetails] = useState(null);
  const [balance, setBalance] = useState(0);
  const [showAdd, setShowAdd] = useState(false);
  const [showRemove, setShowRemove] = useState(false);
  const [amount, setAmount] = useState("");
  const [history, setHistory] = useState([]);

  const handleDetailsSubmit = async (e) => {
    e.preventDefault();
    setEntered(true);
    setAccountId(inputs.accountNumber.trim());
    await axios.post("/bank-account", inputs);
  };

  useEffect(() => {
    if (!accountId) return;
    axios.get(`/bank-account/${accountId}`).then(res => setDetails(res.data));
    axios.get(`/bank-account/${accountId}/balance`).then(res => {
      const b = Number(res.data.balance);
      setBalance(isNaN(b) ? 0 : b);
    });
    axios.get(`/bank-account/${accountId}/transactions`).then(res => setHistory(res.data));
  }, [accountId]);

  const handleAddRemove = type => {
    axios.post(`/bank-account/${accountId}/${type}-money`, { amount: Number(amount) })
      .then(res => {
        const b = Number(res.data.balance);
        setBalance(isNaN(b) ? 0 : b);
        setAmount("");
        setShowAdd(false);
        setShowRemove(false);
        return axios.get(`/bank-account/${accountId}/transactions`);
      })
      .then(res => setHistory(res.data));
  };

  // --- UI ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col">

      {/* Top Navigation Bar */}
      <header className="bg-white shadow-md h-16 w-full fixed top-0 left-0 z-30 flex items-center px-10 justify-between">
        <div className="flex items-center space-x-3">
          {/* Optionally add a logo image */}
          <div className="text-2xl font-bold text-blue-700 tracking-wide">SBI Corporate</div>
        </div>
        {!entered ? null : (
          <div className="flex items-center space-x-6">
            <span className="text-gray-600 font-semibold">{details?.holderName || inputs.holderName}</span>
            {/* Profile avatar could go here */}
            <button className="px-4 py-1 bg-gray-100 text-gray-600 rounded hover:bg-blue-50">Logout</button>
          </div>
        )}
      </header>

      {/* Main Content Area (below header, fill full width + height) */}
      <main className="flex-1 flex flex-col pt-20 pb-6 max-w-7xl w-full mx-auto px-6 xl:px-0">
        {!entered ? (
          // Entry Form full width, centered
          <form
            onSubmit={handleDetailsSubmit}
            className="max-w-lg w-full mx-auto mt-20 bg-white rounded shadow-lg p-10 space-y-8"
          >
            <h1 className="text-3xl font-extrabold text-center text-blue-800 mb-8">Enter Bank Account Details</h1>
            <div>
              <label className="font-bold text-sm">Bank Name</label>
              <input
                className="border rounded w-full px-3 py-2 mt-2"
                value={inputs.bankName}
                onChange={e => setInputs({ ...inputs, bankName: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="font-bold text-sm">Account Number</label>
              <input
                className="border rounded w-full px-3 py-2 mt-2"
                value={inputs.accountNumber}
                onChange={e => setInputs({ ...inputs, accountNumber: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="font-bold text-sm">IFSC Code</label>
              <input
                className="border rounded w-full px-3 py-2 mt-2"
                value={inputs.ifsc}
                onChange={e => setInputs({ ...inputs, ifsc: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="font-bold text-sm">Holder Name</label>
              <input
                className="border rounded w-full px-3 py-2 mt-2"
                value={inputs.holderName}
                onChange={e => setInputs({ ...inputs, holderName: e.target.value })}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded font-bold text-lg mt-4"
            >
              Continue
            </button>
          </form>
        ) : (
          <div className="flex flex-col space-y-8 w-full">

            {/* Account Details and Controls Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start w-full mb-3">
              <section className="h-full w-full bg-white rounded-lg shadow p-8 space-y-3">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-blue-700 mb-1">Account Summary</h2>
                  <div className="text-gray-700">
                    <div><span className="font-bold">Bank:</span> {details?.bankName || inputs.bankName}</div>
                    <div><span className="font-bold">Account Number:</span> {details?.accountNumber || inputs.accountNumber}</div>
                    <div><span className="font-bold">Holder Name:</span> {details?.holderName || inputs.holderName}</div>
                    <div><span className="font-bold">IFSC:</span> {details?.ifsc || inputs.ifsc}</div>
                  </div>
                </div>
                <div className="text-3xl font-extrabold text-green-700 mb-3">
                  ₹{typeof balance === "number" && !isNaN(balance) ? balance.toLocaleString("en-IN") : "0"}
                </div>
              </section>

              {/* Controls */}
              <section className="bg-white rounded-lg shadow p-8 flex flex-col space-y-4">
                <div className="flex items-center space-x-5">
                  <button className="bg-blue-600 text-white px-5 py-3 rounded font-bold text-lg" onClick={() => setShowAdd(true)}>Add Money</button>
                  <button className="bg-red-600 text-white px-5 py-3 rounded font-bold text-lg" onClick={() => setShowRemove(true)}>Remove Money</button>
                  <button className="p-3 rounded bg-blue-100 hover:bg-blue-200" title="Google Pay">
                    <FaGooglePay className="text-2xl text-blue-700" />
                  </button>
                </div>
                {showAdd && (
                  <div className="flex flex-col items-center mt-2">
                    <input
                      type="number"
                      className="border px-3 py-2 rounded w-48 mb-2"
                      placeholder="Amount"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                    />
                    <button className="bg-blue-700 text-white px-6 py-2 rounded font-semibold" onClick={() => handleAddRemove("add")}>Confirm Add</button>
                  </div>
                )}
                {showRemove && (
                  <div className="flex flex-col items-center mt-2">
                    <input
                      type="number"
                      className="border px-3 py-2 rounded w-48 mb-2"
                      placeholder="Amount"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                    />
                    <button className="bg-red-700 text-white px-6 py-2 rounded font-semibold" onClick={() => handleAddRemove("remove")}>Confirm Remove</button>
                  </div>
                )}
              </section>
            </div>

            {/* Transaction Table */}
            <section className="w-full bg-white rounded-lg shadow p-8">
              <h3 className="text-xl font-bold mb-3">Transaction History</h3>
              <div className="max-h-60 overflow-y-auto">
                <table className="min-w-full text-left text-gray-800">
                  <thead className="border-b">
                    <tr>
                      <th className="py-2">Date</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(history) && history.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-2 text-gray-500">No transactions yet</td>
                      </tr>
                    ) : (
                      (Array.isArray(history) ? history : [])
                        .filter(tr => tr)
                        .map((tr, idx) => (
                          <tr key={tr._id || idx} className="border-b">
                            <td>{tr.timestamp ? new Date(tr.timestamp).toLocaleString() : "-"}</td>
                            <td className={tr.type === "add" ? "text-green-700" : "text-red-700"}>{tr.type || "-"}</td>
                            <td>₹{typeof tr.amount === "number" && !isNaN(tr.amount) ? tr.amount.toLocaleString("en-IN") : "0"}</td>
                            <td>{tr.note || "-"}</td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>

          </div>
        )}
      </main>
    </div>
  );
}

export default FundsMenuPage;
