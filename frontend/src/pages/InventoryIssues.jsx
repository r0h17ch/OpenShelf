// Import React hooks
import { useEffect, useState } from 'react';

// Import toast notifications
import { toast } from 'react-toastify';

// Import API instance
import api from '../api/axios';

// Import icons
import { AlertTriangle, Check, Plus } from 'lucide-react';

export default function InventoryIssues() {

  // State to store all inventory issues
  const [issues, setIssues] = useState([]);

  // Loading state
  const [loading, setLoading] = useState(true);

  // Toggle form visibility
  const [showForm, setShowForm] = useState(false);

  // Form state for reporting new issue
  const [form, setForm] = useState({
    bookId: '',
    status: 'MISSING',
    note: ''
  });

  // Fetch inventory issues from API
  const fetchData = async () => {
    try {
      const { data } = await api.get('/inventory');

      // Store issues data
      setIssues(data.data || data);
    } catch {
      // Show error if fetch fails
      toast.error('Failed');
    } finally {
      // Stop loading spinner
      setLoading(false);
    }
  };

  // Run fetchData when component mounts
  useEffect(() => {
    fetchData();
  }, []);

  // Handle form submission (report issue)
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload

    try {
      // Send issue data to backend
      await api.post('/inventory', form);

      // Success message
      toast.success('Issue reported!');

      // Hide form
      setShowForm(false);

      // Refresh data
      fetchData();
    } catch (err) {
      // Show error message
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  // Handle resolving an issue
  const handleResolve = async (id) => {
    try {
      // API call to mark issue as resolved
      await api.put(`/inventory/resolve/${id}`);

      // Success message
      toast.success('Resolved!');

      // Refresh data
      fetchData();
    } catch (err) {
      // Error message
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  // Show loading spinner while fetching data
  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="space-y-6">

      {/* Header section */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-100">
          Inventory Issues
        </h1>

        {/* Toggle form button */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Report Issue
        </button>
      </div>

      {/* Form to report new issue */}
      {showForm && (
        <form onSubmit={handleSubmit} className="glass-card p-5 space-y-3">

          <div className="grid grid-cols-3 gap-3">

            {/* Book ID input */}
            <input
              className="input-field"
              placeholder="Book ID"
              value={form.bookId}
              onChange={e =>
                setForm({ ...form, bookId: e.target.value })
              }
              required
            />

            {/* Issue type dropdown */}
            <select
              className="input-field"
              value={form.status}
              onChange={e =>
                setForm({ ...form, status: e.target.value })
              }
            >
              <option value="MISSING">Missing</option>
              <option value="STOLEN">Stolen</option>
            </select>

            {/* Note input */}
            <input
              className="input-field"
              placeholder="Note"
              value={form.note}
              onChange={e =>
                setForm({ ...form, note: e.target.value })
              }
            />
          </div>

          {/* Submit button */}
          <button type="submit" className="btn-primary text-sm">
            Submit
          </button>
        </form>
      )}

      {/* Issues table */}
      <div className="glass-card overflow-hidden">
        <table className="w-full">

          {/* Table header */}
          <thead>
            <tr className="border-b border-gray-800/50">
              <th className="text-left p-4 text-sm font-semibold text-gray-400">Book</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-400">Type</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-400">Reported By</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-400">Note</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-400">Status</th>
              <th className="text-right p-4 text-sm font-semibold text-gray-400">Action</th>
            </tr>
          </thead>

          <tbody>

            {/* Loop through issues */}
            {issues.map(i => (
              <tr
                key={i.id}
                className="border-b border-gray-800/30 hover:bg-gray-800/20 transition"
              >

                {/* Book title */}
                <td className="p-4 text-gray-200">
                  {i.book?.title || i.bookId}
                </td>

                {/* Issue type */}
                <td className="p-4">
                  <span
                    className={`badge ${
                      i.status === 'STOLEN'
                        ? 'badge-danger'
                        : 'badge-warning'
                    }`}
                  >
                    {i.status}
                  </span>
                </td>

                {/* Reporter name */}
                <td className="p-4 text-sm text-gray-400">
                  {i.reportedBy?.name}
                </td>

                {/* Note */}
                <td className="p-4 text-sm text-gray-500">
                  {i.note}
                </td>

                {/* Status (resolved or open) */}
                <td className="p-4">
                  {i.resolved ? (
                    <span className="badge badge-success">Resolved</span>
                  ) : (
                    <span className="badge badge-warning">Open</span>
                  )}
                </td>

                {/* Resolve button */}
                <td className="p-4 text-right">
                  {!i.resolved && (
                    <button
                      onClick={() => handleResolve(i.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                    >
                      <Check className="w-3.5 h-3.5" /> Resolve
                    </button>
                  )}
                </td>
              </tr>
            ))}

            {/* If no issues */}
            {issues.length === 0 && (
              <tr>
                <td colSpan="6" className="p-8 text-center text-gray-500">
                  No inventory issues.
                </td>
              </tr>
            )}

          </tbody>
        </table>
      </div>
    </div>
  );
}
