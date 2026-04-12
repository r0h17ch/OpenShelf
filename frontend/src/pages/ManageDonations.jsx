import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../api/axios';

export default function ManageDonations() {

  // State to store donations data
  const [data, setData] = useState({ donations: [] });

  // State to handle loading spinner
  const [loading, setLoading] = useState(true);

  // Function to fetch all donation requests from backend
  const fetchData = async () => {
    try {
      // API call to get all donations
      const { data } = await api.get('/donations/all');

      // Store response data (handles both nested and direct formats)
      setData(data.data || data);
    } catch {
      // Show error message if API fails
      toast.error('Failed');
    } finally {
      // Stop loading spinner
      setLoading(false);
    }
  };

  // Run fetchData once when component mounts
  useEffect(() => { fetchData(); }, []);

  // Function to perform actions: approve, reject, complete
  const action = async (id, act) => {
    try {
      // API call based on action type
      await api.put(`/donations/${act}/${id}`);

      // Show success message dynamically
      toast.success(`Donation ${act}d!`);

      // Refresh data after action
      fetchData();
    } catch (err) {
      // Show error message if request fails
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  // Map donation status to badge colors
  const statusColors = {
    PENDING: 'badge-warning',
    APPROVED: 'badge-info',
    REJECTED: 'badge-danger',
    COMPLETED: 'badge-success'
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
        Manage Donations
      </h1>

      <div className="glass-card overflow-hidden">

        {/* Table to display donations */}
        <table className="w-full">

          {/* Table header */}
          <thead>
            <tr className="border-b border-gray-800/50">
              <th className="text-left p-4 text-sm font-semibold text-gray-400">Book</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-400">Donor</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-400">Condition</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-400">Status</th>
              <th className="text-right p-4 text-sm font-semibold text-gray-400">Actions</th>
            </tr>
          </thead>

          {/* Table body */}
          <tbody>

            {/* Loop through all donation records */}
            {(data.donations || []).map(d => (

              <tr
                key={d.id} // unique key for each row
                className="border-b border-gray-800/30 hover:bg-gray-800/20 transition"
              >

                {/* Book title and author */}
                <td className="p-4">
                  <p className="font-medium text-gray-200">
                    {d.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {d.author}
                  </p>
                </td>

                {/* Donor name */}
                <td className="p-4 text-sm text-gray-400">
                  {d.user?.name}
                </td>

                {/* Book condition */}
                <td className="p-4">
                  <span className="badge badge-neutral">
                    {d.condition}
                  </span>
                </td>

                {/* Donation status with color */}
                <td className="p-4">
                  <span className={`badge ${statusColors[d.status]}`}>
                    {d.status}
                  </span>
                </td>

                {/* Action buttons */}
                <td className="p-4 text-right space-x-2">

                  {/* Show approve/reject buttons if status is PENDING */}
                  {d.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => action(d.id, 'approve')}
                        className="px-3 py-1.5 rounded-lg text-sm bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => action(d.id, 'reject')}
                        className="px-3 py-1.5 rounded-lg text-sm bg-red-500/10 text-red-400 hover:bg-red-500/20 transition"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {/* Show complete button if status is APPROVED */}
                  {d.status === 'APPROVED' && (
                    <button
                      onClick={() => action(d.id, 'complete')}
                      className="btn-primary text-sm !px-4 !py-1.5"
                    >
                      Complete
                    </button>
                  )}

                </td>

              </tr>
            ))}

            {/* Show message if no donations available */}
            {(data.donations || []).length === 0 && (
              <tr>
                <td colSpan="5" className="p-8 text-center text-gray-500">
                  No donations.
                </td>
              </tr>
            )}

          </tbody>
        </table>
      </div>
    </div>
  );
}
