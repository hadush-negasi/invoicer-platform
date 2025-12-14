import { useAuth } from '../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="px-4 py-6 sm:p-6">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Profile</h1>

      <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 max-w-2xl">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
            <div className="text-slate-900">{user.name || 'N/A'}</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
            <div className="text-slate-900">{user.email}</div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
            <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${
              user.role === 'admin' 
                ? 'bg-violet-100 text-violet-800' 
                : 'bg-indigo-100 text-indigo-800'
            }`}>
              {user.role}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;


