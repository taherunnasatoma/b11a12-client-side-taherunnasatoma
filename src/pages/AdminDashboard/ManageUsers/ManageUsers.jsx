import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const [searchEmail, setSearchEmail] = useState('');
  const queryClient = useQueryClient();

  // Fetch all users
  const { data: allUsers = [], isLoading } = useQuery({
    queryKey: ['allUsers'],
    queryFn: async () => {
      const res = await axiosSecure.get('/users');
      return res.data;
    },
    enabled: !searchEmail,
    refetchOnWindowFocus: true,
  });

  // Search specific users
  const { data: searchedUsers = [] } = useQuery({
    queryKey: ['searchedUsers', searchEmail],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users?search=${searchEmail}`);
      return res.data;
    },
    enabled: !!searchEmail,
    refetchOnWindowFocus: true,
  });

  const usersToShow = searchEmail ? searchedUsers : allUsers;

  const handleRoleChange = async (id, role) => {
    const confirm = await Swal.fire({
      title: `Make user ${role}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Yes`,
    });

    if (confirm.isConfirmed) {
      try {
        const res = await axiosSecure.patch(`/users/${id}/role`, { role });
        if (res.data.modifiedCount > 0) {
          Swal.fire('Success', `Role updated to ${role}`, 'success');
          if (searchEmail) {
            queryClient.invalidateQueries(['searchedUsers', searchEmail]);
          } else {
            queryClient.invalidateQueries(['allUsers']);
          }
        }
      } catch (err) {
        Swal.fire('Error', 'Failed to update role', 'error');
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">👥 Manage Users</h2>

      <div className="mb-6">
        <input
          type="text"
          placeholder="🔍 Search by email..."
          className="input input-bordered w-full max-w-md"
          value={searchEmail}
          onChange={(e) => setSearchEmail(e.target.value)}
        />
      </div>

      {isLoading ? (
        <p className="text-gray-500">Loading users...</p>
      ) : usersToShow.length === 0 ? (
        <p className="text-red-500">No users found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-md">
          <table className="table table-zebra w-full text-sm md:text-base">
            <thead className="bg-gray-100 text-gray-800">
              <tr>
                <th>#</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created At</th>
                <th>Last Login</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersToShow.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td className="break-words">{user.email}</td>
                  <td className="capitalize">{user.role}</td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td>{new Date(user.last_log_in).toLocaleDateString()}</td>
                  <td>
                    <div className="flex flex-wrap gap-2 justify-center">
                      <button
                        className="btn btn-xs md:btn-sm btn-info"
                        onClick={() => handleRoleChange(user._id, 'admin')}
                        disabled={user.role === 'admin'}
                      >
                        Admin
                      </button>
                      <button
                        className="btn btn-xs md:btn-sm bg-[#82b440] text-white hover:bg-[#6ba235]"
                        onClick={() => handleRoleChange(user._id, 'seller')}
                        disabled={user.role === 'seller'}
                      >
                        Seller
                      </button>
                      <button
                        className="btn btn-xs md:btn-sm btn-warning"
                        onClick={() => handleRoleChange(user._id, 'user')}
                        disabled={user.role === 'user'}
                      >
                        User
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
