import React, { useEffect, useState } from "react";
import { HelpCircle, Send, Edit3 } from "lucide-react";
import { SupportAPI } from "../utils/api";
import { useAuth } from "../state/AuthContext";

// ----- Dummy content for sidebar + FAQs -----
const SUPPORT_DUMMY = {
  expectedResponseTime: [
    "High Priority: Within 4 hours",
    "Medium Priority: Within 24 hours",
    "Low Priority: Within 48 hours",
  ],
  whatToInclude: [
    "Clear description of the issue",
    "Steps to reproduce the problem",
  
  ],
  contactEmail: "DigitalHealthAssistance@gmx.com",
  faqs: [
    {
      q: "How do I reset my password?",
      a: 'Click on "Forgot Password" on the login page and follow the instructions sent to your email.',
    },
    {
      q: "Can I sync data across multiple devices?",
      a: "Yes, your data automatically syncs when you're logged in on any device. Make sure you're using the same account.",
    },
    {
      q: "How do I update my medication schedule?",
      a: 'Go to the Medication Adherence module and click "Add Medicine" to update your schedule.',
    },
    
    { q: "How can I contact support?",
      a: "You can submit a support ticket using the form on this page or email us at DigitalHealthAssistance@gmx.com"
}
],
};


export default function SupportTickets() {
  const { token, logout } = useAuth();
  const [form, setForm] = useState({
    subject: "",
    description: "",
    Priority: "Medium",
  });
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(null);
  const [message, setMessage] = useState("");

  // ✅ Fetch user's tickets dynamically
  const refresh = async () => {
    try {
      setLoading(true);
      const res = await SupportAPI.getMyTickets();
      setTickets(res.data || []);
    } catch (err) {
      console.error("❌ Failed to fetch tickets", err);
      if (err.response?.status === 401) logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) refresh();
  }, [token]);

  // ✅ Create or update ticket
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        // No dedicated update route for user, so just show alert
        setMessage("You can’t edit resolved tickets. Please create a new one if needed.");
      } else {
        await SupportAPI.create(form);
        setMessage("Ticket created successfully!");
      }
      setForm({ subject: "", description: "", Priority: "Medium" });
      setEditing(null);
      refresh();
    } catch (err) {
      console.error("❌ Error submitting ticket", err);
      setMessage("Something went wrong while submitting the ticket.");
    }
  };

  // ✅ Load ticket for re-filling the form (no backend update)
  const handleEdit = (ticket) => {
    if (ticket.status === "resolved") {
      setMessage("Resolved tickets cannot be edited.");
      return;
    }
    setForm({
      subject: ticket.subject,
      description: ticket.description,
      Priority: ticket.Priority,
    });
    setEditing(ticket);
  };

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 min-h-screen space-y-8">
      {/* Message Banner */}
      {message && (
        <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-2 rounded-lg shadow-sm">
          {message}
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-1">Support Center</h2>
        <p className="text-gray-600">
          Need help? Submit a support ticket and our team will get back to you.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* LEFT: Ticket Form */}
        <div className="md:col-span-2 bg-white shadow-lg rounded-xl p-6 border border-gray-100">
          <h3 className="text-xl font-semibold flex items-center gap-2 text-blue-700 mb-4">
            <HelpCircle className="w-5 h-5" />
            {editing ? "Edit Ticket" : "Submit Support Ticket"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subject *
              </label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                value={form.subject}
                onChange={(e) =>
                  setForm((s) => ({ ...s, subject: e.target.value }))
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                rows="4"
                value={form.description}
                onChange={(e) =>
                  setForm((s) => ({ ...s, description: e.target.value }))
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                value={form.Priority}
                onChange={(e) =>
                  setForm((s) => ({ ...s, Priority: e.target.value }))
                }
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition"
            >
              <Send className="w-4 h-4" />
              {editing ? "Update Ticket" : "Submit Ticket"}
            </button>
          </form>
        </div>

       {/* RIGHT: Support Info (dummy) */}
<div className="space-y-4">
  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
    <h4 className="font-semibold text-blue-700 mb-2">Expected Response Time</h4>
    <ul className="text-sm text-gray-700 space-y-1">
      {SUPPORT_DUMMY.expectedResponseTime.map((line) => (
        <li key={line}>{line}</li>
      ))}
    </ul>
  </div>

  <div className="bg-green-50 border border-green-100 rounded-xl p-4">
    <h4 className="font-semibold text-green-700 mb-2">What to Include</h4>
    <ul className="list-disc pl-4 text-sm text-gray-700 space-y-1">
      {SUPPORT_DUMMY.whatToInclude.map((line) => (
        <li key={line}>{line}</li>
      ))}
    </ul>
  </div>

  <div className="bg-pink-50 border border-pink-100 rounded-xl p-4">
    <h4 className="font-semibold text-pink-700 mb-2">Contact Methods</h4>
    <ul className="text-sm text-gray-700 space-y-1">
      <li>📧 {SUPPORT_DUMMY.contactEmail}</li>
    </ul>
  </div>
</div>

      </div>

      {/* My Tickets Section */}
      {/* <div className="bg-white rounded-xl shadow p-6 mt-8 border border-gray-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">My Tickets</h3>
        {loading ? (
          <p>Loading...</p>
        ) : tickets.length ? (
          <div className="space-y-4 max-h-[24rem] overflow-auto">
            {tickets.map((t) => (
              <div
                key={t._id}
                className="border border-gray-200 rounded-xl p-4 flex justify-between items-start"
              >
                <div>
                  <h4 className="font-semibold text-gray-800">{t.subject}</h4>
                  <p className="text-sm text-gray-600 mb-1">{t.description}</p>
                  <p className="text-xs text-gray-500">
                    Priority: {t.Priority} |{" "}
                    <span
                      className={`font-semibold ${
                        t.status === "resolved"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {t.status}
                    </span>
                  </p>
                </div>

                <button
                  onClick={() => handleEdit(t)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  title="Edit"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No tickets found.</p>
        )}
      </div> */}

     {/* FAQ Section (dummy) */}
<div className="bg-white rounded-xl shadow p-6 mt-6 border border-gray-100">
  <h3 className="text-lg font-semibold text-gray-800 mb-4">
    Frequently Asked Questions
  </h3>
  <ul className="space-y-4 text-gray-700 text-sm">
    {SUPPORT_DUMMY.faqs.map(({ q, a }) => (
      <li key={q}>
        <p className="font-semibold">{q}</p>
        <p className="mt-1">{a}</p>
      </li>
    ))}
  </ul>
</div>

    </div>
  );
}
