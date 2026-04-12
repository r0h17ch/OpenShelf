import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { X } from 'lucide-react';

export default function MyReservations() {

  // State to store reservations data
  const [reservations, setReservations] = useState([]);

  // State to handle loading spinner
  const [loading, setLoading] = useState(true);

  // Function to fetch user's reservations
  const fetchData = async () => {
    try {
      // API call to get reservations
      const { data } = await api.get('/reservations/my');

      // Store response data (handles nested or direct format)
      setReservations(data.data || data);
    } catch {
      // Show error message if API fails
      toast.error('Failed to load');
    } finally {
      // Stop loading spinner
      setLoading(false);
    }
  };

  // Run fetchData once when component mounts
  useEffect(() => { fetchData(); }, []);

  // Function to cancel a reservation
  const handleCancel = async (id) => {
    try {
      // API call to delete reservation
      await api.delete(`/reservations/${id}`);

      // Show success message
      toast.success('Reservation cancelled');

      // Refresh reservations list
      fetchData();
    } catch (err) {
      // Show error message if request fails
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  // Show loading spinner while fetching data
  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        {/* Spinner UI */}
        <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="space-y-6">

      {/* Page heading */}
      <h1 className="text-2xl font-bold text-gray-100">
        My Reservations
      </h1>

      <div className="glass-card overflow-hidden">

        {/* Table to display reservations */}
        <table className="w-full">

          {/* Table header */}
          <thead>
            <tr className="border-b border-gray-800/50">
              <th className="text-left p-4 text-sm font-semibold text-gray-400">Book</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-400">Position</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-400">Status</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-400">Created</th>
              <th className="text-right p-4 text-sm font-semibold text-gray-400">Action</th>
            </tr>
          </thead>

          {/* Table body */}
          <tbody>

            {/* Loop through all reservations */}
            {reservations.map((r) => (

              <tr
                key={r.id}
                className="border-b border-gray-800/30 hover:bg-gray-800/20 transition"
              >

                {/* Book title */}
                <td className="p-4 font-medium text-gray-200">
                  {r.book?.title}
                </td>

                {/* Queue position */}
                <td className="p-4 text-gray-400">
                  #{r.position}
                </td>

                {/* Reservation status */}
                <td className="p-4">
                  <span
                    className={`badge ${
                      r.status === 'PENDING'
                        ? 'badge-warning'
                        : r.status === 'FULFILLED'
                        ? 'badge-success'
                        : 'badge-neutral'
                    }`}
                  >
                    {r.status}
                  </span>
                </td>

                {/* Creation date */}
                <td className="p-4 text-sm text-gray-400">
                  {new Date(r.createdAt).toLocaleDateString()}
                </td>

                {/* Action button */}
                <td className="p-4 text-right">

                  {/* Show cancel button only if reservation is still pending */}
                  {r.status === 'PENDING' && (
                    <button
                      onClick={() => handleCancel(r.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                    >
                      <X className="w-3.5 h-3.5" />
                      Cancel
                    </button>
                  )}

                </td>

              </tr>
            ))}

            {/* Show message if no reservations exist */}
            {reservations.length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">
                  No reservations.
                </td>
              </tr>
            )}

          </tbody>
        </table>
      </div>
    </div>
  );
}
