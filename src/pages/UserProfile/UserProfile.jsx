import { useState } from 'react';
import Swal from 'sweetalert2';

import { useQuery } from '@tanstack/react-query';
import useAuth from '../../hooks/useAuth';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const UserProfile = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: userData, isLoading, error } = useQuery({
    queryKey: ['userProfile', user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users?search=${user.email}`);
      return res.data[0]; // Assuming API returns an array
    },
    enabled: !!user?.email,
  });

  if (isLoading) return <p className="text-center mt-10">Loading profile...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Failed to load profile.</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="bg-white shadow-lg rounded-lg max-w-xl w-full p-6 md:p-10">
        <div className="flex flex-col md:flex-row items-center gap-6">
          {/* Profile Image */}
          <div className="w-32 h-32 md:w-40 md:h-40 flex-shrink-0">
            <img
              src={userData.photoURL}
              alt={userData.name}
              className="rounded-full w-full h-full object-cover shadow-md"
            />
          </div>

          {/* Profile Info */}
          <div className="flex-1 space-y-2">
            <h2 className="text-2xl font-bold text-gray-800">{userData.name}</h2>
            <p className="text-gray-600"><span className="font-medium">Email:</span> {userData.email}</p>
            <p className="text-gray-600"><span className="font-medium">Role:</span> {userData.role}</p>
            <p className="text-gray-600">
              <span className="font-medium">Joined:</span> {new Date(userData.created_at).toLocaleDateString()}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Last Login:</span> {new Date(userData.last_log_in).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Optional Edit Button */}
        {/* <div className="mt-6 text-center">
          <button className="px-6 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 transition">
            Edit Profile
          </button>
        </div> */}
      </div>
    </div>
  );
};
export default UserProfile;
