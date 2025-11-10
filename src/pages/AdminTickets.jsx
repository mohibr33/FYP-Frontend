import React, { useEffect, useMemo, useState } from "react";
import { Eye, CheckCircle2, Trash2, Search, X, Send } from "lucide-react";

const API = "http://localhost:5000/api"; // make sure this matches your backend

// Client-side ticket filtering helper (frontend only)
function filterTickets(list = [], priorityFilter = "", statusFilter = "", search = "") {
  const q = (search || "").trim().toLowerCase();
  return (list || []).filter((t) => {
    // search across subject / description / user email
    const hay = `${t.subject || ""} ${t.description || ""} ${t.user?.email || ""}`.toLowerCase();
    if (q && !hay.includes(q)) return false;

    // normalize priority (handles 'Priority' or 'priority' from backend)
    const p = (t.priority || t.Priority || "").toString().toLowerCase();
    if (priorityFilter && p !== priorityFilter.toLowerCase()) return false;

    // normalize status and support matching "open" / "close" (accepts closed/resolved)
    const s = (t.status || "").toString().toLowerCase();
    if (statusFilter) {
      if (statusFilter === "open" && !s.includes("open")) return false;
      if (
        statusFilter === "close" &&
        !(s.includes("close") || s.includes("closed") || s.includes("resolved"))
      )
        return false;
    }

    return true;
  });
}

function AdminTickets() {
  const token = localStorage.getItem("hp:token");
  const headers = useMemo(
    () => ({ Authorization: `Bearer ${token}`, "Content-Type": "application/json" }),
    [token]
  );

  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  // frontend-only filters (no backend change)
  const [priorityFilter, setPriorityFilter] = useState(""); // "", "high", "medium", "low"
  const [statusFilter, setStatusFilter] = useState(""); // "", "open", "close"
  const [message, setMessage] = useState("");
  const [focus, setFocus] = useState(null);
  const [loading, setLoading] = useState(true);

  // State for reply modal
  const [replying, setReplying] = useState(null);
  const [replyText, setReplyText] = useState("");

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/support`, { headers });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log("Tickets loaded:", data);
      
      // Ensure we have an array
      const tickets = Array.isArray(data) ? data : [];
      
      // Log any tickets with missing userId
      tickets.forEach((ticket, index) => {
        if (!ticket.userId) {
          console.warn(`Ticket at index ${index} (ID: ${ticket._id}) has no userId:`, ticket);
        }
      });
      
      setList(tickets);
    } catch (error) {
      console.error("Error loading tickets:", error);
      setMessage("❌ Failed to load tickets: " + error.message);
      setList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []); // eslint-disable-line

  // derived filtered list (applies search + priority + status on client)
  const filtered = useMemo(
    () => filterTickets(list, priorityFilter, statusFilter, search),
    [list, priorityFilter, statusFilter, search]
  );

  const resolve = async (id) => {
    if (!replyText.trim()) {
      alert("Please enter a reply message.");
      return;
    }
    
    try {
      const res = await fetch(`${API}/support/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ customMessage: replyText }),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to resolve ticket");
      }
      
      setMessage("✅ Ticket resolved and reply sent successfully.");
      setReplying(null);
      setReplyText("");
      setTimeout(() => setMessage(""), 3000);
      load();
    } catch (error) {
      console.error("Error resolving ticket:", error);
      alert("Failed to resolve ticket: " + error.message);
    }
  };

  // DELETE ticket on server (support route) and update local list
  const deleteTicket = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;
    try {
      const res = await fetch(`${API}/support/${id}`, {
        method: "DELETE",
        headers,
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || `Delete failed (${res.status})`);
      }
      // remove locally after successful server delete
      setList((prev) => prev.filter((t) => String(t._id) !== String(id)));
    } catch (err) {
      console.error("Delete ticket error:", err);
      alert(err.message || "Failed to delete ticket. Check Network tab / server logs.");
    }
  };

  const removeLocal = (id) => setList((p) => p.filter((x) => x._id !== id));

  const priorityColors = {
    High: "bg-red-100 text-red-700",
    Medium: "bg-yellow-100 text-yellow-700",
    Low: "bg-green-100 text-green-700",
  };

  const getUserDisplay = (ticket) => {
    if (!ticket.userId) return "No User Data";
    
    const { firstName, lastName, email } = ticket.userId;
    
    if (firstName || lastName) {
      return `${firstName || ""} ${lastName || ""}`.trim();
    }
    
    return email || "Unknown User";
  };

  return (
    <section>
      <div className="mb-8">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-2">Support Tickets</h1>
        <p className="text-gray-600 text-lg">Manage user support requests and technical issues</p>
      </div>

      {message && (
        <div className={`mb-4 rounded-xl border px-4 py-3 ${
          message.startsWith("✅") 
            ? "bg-green-50 border-green-200 text-green-700"
            : "bg-red-50 border-red-200 text-red-700"
        }`}>
          {message}
        </div>
      )}

      <div className="flex items-center gap-3 w-full md:w-auto mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tickets..."
          className="input"
        />

        {/* Priority filter */}
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="input w-40"
          aria-label="Filter by priority"
        >
          <option value="">Priority (any)</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        
        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="input w-40"
          aria-label="Filter by status"
        >
          <option value="">Status (any)</option>
          <option value="open">Open</option>
          <option value="close">Close</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-20">
          <div className="inline-block w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading tickets...</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
          <table className="w-full table-fixed">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-4 text-left font-semibold text-gray-700 w-20">ID</th>
                <th className="px-4 py-4 text-left font-semibold text-gray-700 w-48">User Email</th>
                <th className="px-4 py-4 text-left font-semibold text-gray-700">Subject</th>
                <th className="px-4 py-4 text-left font-semibold text-gray-700 w-24">Priority</th>
                <th className="px-4 py-4 text-left font-semibold text-gray-700 w-24">Status</th>
                <th className="px-4 py-4 text-left font-semibold text-gray-700 w-28">Date</th>
                <th className="px-4 py-4 text-center font-semibold text-gray-700 w-48">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((t) => (
                <tr key={t._id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 font-medium text-sm">#{t._id.slice(-6)}</td>
                  <td className="px-4 py-4 text-gray-600 text-sm truncate" title={t.userId?.email}>
                    {t.userId?.email || "N/A"}
                  </td>
                  <td className="px-4 py-4 text-gray-900 text-sm truncate" title={t.subject}>
                    {t.subject}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        priorityColors[t.Priority] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {t.Priority || "Medium"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        t.status === "resolved"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {t.status === "resolved" ? "Resolved" : "Open"}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-600 text-sm">
                    {t.createdAt ? new Date(t.createdAt).toLocaleDateString("en-GB") : "N/A"}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-center gap-1">
                      <button
                        onClick={() => setFocus(t)}
                        className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded text-xs flex items-center gap-1"
                        title="View Details"
                      >
                        <Eye className="w-3 h-3" /> View
                      </button>

                      {t.status !== "resolved" && (
                        <button
                          className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 flex items-center gap-1"
                          onClick={() => {
                            setReplying(t);
                            setReplyText("");
                          }}
                          title="Resolve Ticket"
                        >
                          <CheckCircle2 className="w-3 h-3" /> Resolve
                        </button>
                      )}

                      <button
                        className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition"
                        onClick={() => deleteTicket(t._id)}
                        title="Delete ticket"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!filtered.length && (
            <div className="px-6 py-10 text-center text-gray-500">
              {list.length === 0 ? "No tickets found." : "No tickets match your search."}
            </div>
          )}
        </div>
      )}

      {/* Ticket Detail Modal */}
      {focus && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setFocus(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-xl font-bold text-gray-900">Ticket Details</h3>
              <button onClick={() => setFocus(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-gray-600 font-medium">Ticket ID</div>
                <div className="col-span-2 text-gray-900 font-mono">#{focus._id}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-gray-600 font-medium">User</div>
                <div className="col-span-2 text-gray-900">
                  {getUserDisplay(focus)}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-gray-600 font-medium">Email</div>
                <div className="col-span-2 text-gray-900">{focus.userId?.email || "N/A"}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-gray-600 font-medium">Priority</div>
                <div className="col-span-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      priorityColors[focus.Priority] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {focus.Priority || "Medium"}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-gray-600 font-medium">Status</div>
                <div className="col-span-2">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      focus.status === "resolved"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {focus.status || "open"}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-gray-600 font-medium">Created</div>
                <div className="col-span-2 text-gray-900">
                  {focus.createdAt ? new Date(focus.createdAt).toLocaleString("en-GB") : "N/A"}
                </div>
              </div>
              {focus.resolvedAt && (
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-gray-600 font-medium">Resolved</div>
                  <div className="col-span-2 text-gray-900">
                    {new Date(focus.resolvedAt).toLocaleString("en-GB")}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-gray-600 font-medium">Subject</div>
                <div className="col-span-2 text-gray-900 font-semibold">{focus.subject}</div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-gray-600 font-medium">Description</div>
                <div className="col-span-2 text-gray-900 whitespace-pre-wrap">{focus.description}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {replying && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
          onClick={() => setReplying(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-md shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-900 mb-3">Reply & Resolve Ticket</h3>
            <p className="text-gray-600 text-sm mb-2">
              <span className="font-medium">User:</span> {getUserDisplay(replying)}
            </p>
            <p className="text-gray-600 text-sm mb-4">
              <span className="font-medium">Subject:</span> {replying.subject}
            </p>
            <textarea
              className="w-full border rounded-xl p-3 text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none min-h-[120px]"
              placeholder="Type your reply message here... This will be sent to the user's email."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setReplying(null);
                  setReplyText("");
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => resolve(replying._id)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2"
                disabled={!replyText.trim()}
              >
                <Send className="w-4 h-4" /> Send Reply & Resolve
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default AdminTickets;