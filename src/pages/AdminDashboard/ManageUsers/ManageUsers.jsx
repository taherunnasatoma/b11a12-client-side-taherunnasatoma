import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import Swal from 'sweetalert2';
import useAxiosSecure from '../../../hooks/useAxiosSecure';

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure();
  const [searchEmail, setSearchEmail] = useState('');
  const queryClient = useQueryClient();

  // Default: show 10 users
  const { data: allUsers = [], isLoading ,refetch} = useQuery({
    queryKey: ['allUsers'],
    queryFn: async () => {
      const res = await axiosSecure.get('/users');
      return res.data;
    },
    enabled: !searchEmail,
    refetchOnWindowFocus: true,
  });

  // Search users
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

        // ✅ Dynamically invalidate the correct query
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
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>

      <input
        type="text"
        placeholder="Search by email..."
        className="input input-bordered w-full max-w-md mb-4"
        value={searchEmail}
        onChange={(e) => setSearchEmail(e.target.value)}
      />

      {isLoading ? (
        <p>Loading users...</p>
      ) : usersToShow.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>#</th>
                <th>Email</th>
                <th>Role</th>
                <th>Created At</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersToShow.map((user, index) => (
                <tr key={user._id}>
                  <td>{index + 1}</td>
                  <td>{user.email}</td>
                  <td className="capitalize">{user.role}</td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td>{new Date(user.last_log_in).toLocaleDateString()}</td>
                  <td className="space-x-2">
                    <button
                      className="btn btn-xs btn-info"
                      onClick={() => handleRoleChange(user._id, 'admin')}
                      disabled={user.role === 'admin'}
                    >
                      Make Admin
                    </button>
                    <button
                      className="btn btn-xs btn-success"
                      onClick={() => handleRoleChange(user._id, 'seller')}
                      disabled={user.role === 'seller'}
                    >
                      Make Seller
                    </button>
                    <button
                      className="btn btn-xs btn-warning"
                      onClick={() => handleRoleChange(user._id, 'user')}
                      disabled={user.role === 'user'}
                    >
                      Make User
                    </button>
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
