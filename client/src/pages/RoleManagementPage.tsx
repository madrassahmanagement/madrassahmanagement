import { useState, useEffect } from 'react';
import { User } from '../types';

export const RoleManagementPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Mock data for demonstration
  useEffect(() => {
    const mockUsers: User[] = [
      {
        id: '1',
        firstName: 'Ahmad',
        lastName: 'Hassan',
        email: 'ahmad@deensoft.com',
        phone: '+92-300-1234567',
        role: 'mudir',
        profilePicture: '',
        language: 'ur',
        lastLogin: '2024-01-15T10:30:00Z',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        firstName: 'Fatima',
        lastName: 'Khan',
        email: 'fatima@deensoft.com',
        phone: '+92-300-1234568',
        role: 'teacher',
        profilePicture: '',
        language: 'ur',
        lastLogin: '2024-01-15T09:15:00Z',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T09:15:00Z'
      },
      {
        id: '3',
        firstName: 'Muhammad',
        lastName: 'Ali',
        email: 'muhammad@deensoft.com',
        phone: '+92-300-1234569',
        role: 'nazim',
        profilePicture: '',
        language: 'ur',
        lastLogin: '2024-01-15T08:45:00Z',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T08:45:00Z'
      },
      {
        id: '4',
        firstName: 'Abdul',
        lastName: 'Rahman',
        email: 'abdul@deensoft.com',
        phone: '+92-300-1234570',
        role: 'raises_jamia',
        profilePicture: '',
        language: 'ar',
        lastLogin: '2024-01-15T07:30:00Z',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T07:30:00Z'
      },
      {
        id: '5',
        firstName: 'Umar',
        lastName: 'Hafiz',
        email: 'umar@deensoft.com',
        phone: '+92-300-1234571',
        role: 'shaikul_hadees',
        profilePicture: '',
        language: 'ar',
        lastLogin: '2024-01-15T06:00:00Z',
        isActive: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T06:00:00Z'
      }
    ];
    setUsers(mockUsers);
    setIsLoading(false);
  }, []);

  const roleHierarchy = {
    'raises_jamia': { name: 'Rais e Jamia', level: 1, color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
    'mudir': { name: 'Mudir', level: 2, color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
    'shaikul_hadees': { name: 'Shaikul Hadees', level: 3, color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    'nazim': { name: 'Nazim', level: 4, color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
    'senior_mentor': { name: 'Senior Mentor', level: 5, color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
    'teacher': { name: 'Teacher', level: 6, color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' },
    'staff': { name: 'Staff', level: 7, color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' },
    'admin': { name: 'Admin', level: 0, color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' }
  };

  const getRolePermissions = (role: string) => {
    const permissions = {
      'raises_jamia': [
        'Full system access',
        'User management',
        'Financial reports',
        'Academic oversight',
        'Policy decisions'
      ],
      'mudir': [
        'Academic management',
        'Teacher oversight',
        'Student management',
        'Reports generation',
        'Section management'
      ],
      'shaikul_hadees': [
        'Islamic studies oversight',
        'Curriculum management',
        'Teacher guidance',
        'Academic reports'
      ],
      'nazim': [
        'Daily operations',
        'Student tracking',
        'Attendance management',
        'Basic reports'
      ],
      'senior_mentor': [
        'Mentor students',
        'Track progress',
        'Provide guidance',
        'Basic reporting'
      ],
      'teacher': [
        'Class management',
        'Student scoring',
        'Daily learning tracking',
        'Attendance marking'
      ],
      'staff': [
        'Basic data entry',
        'Support functions'
      ],
      'admin': [
        'System administration',
        'User management',
        'System configuration'
      ]
    };
    return permissions[role as keyof typeof permissions] || [];
  };

  const handleUpdateRole = (userId: string, newRole: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, role: newRole as any, updatedAt: new Date().toISOString() }
        : user
    ));
  };

  const handleToggleStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, isActive: !user.isActive, updatedAt: new Date().toISOString() }
        : user
    ));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Role Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          Add User
        </button>
      </div>

      {/* Role Hierarchy */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Role Hierarchy</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(roleHierarchy)
            .sort(([,a], [,b]) => a.level - b.level)
            .map(([role, info]) => (
              <div key={role} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${info.color}`}>
                    {info.name}
                  </span>
                  <span className="text-xs text-gray-500">Level {info.level}</span>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {users.filter(u => u.role === role).length} users
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Permissions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {user.firstName[0]}{user.lastName[0]}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.firstName} {user.lastName}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      roleHierarchy[user.role as keyof typeof roleHierarchy]?.color || 'bg-gray-100 text-gray-800'
                    }`}>
                      {roleHierarchy[user.role as keyof typeof roleHierarchy]?.name || user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {getRolePermissions(user.role).slice(0, 2).join(', ')}
                      {getRolePermissions(user.role).length > 2 && (
                        <span className="text-gray-500"> +{getRolePermissions(user.role).length - 2} more</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.isActive 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => setEditingUser(user)}
                      className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleStatus(user.id)}
                      className={`${
                        user.isActive 
                          ? 'text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300'
                          : 'text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300'
                      }`}
                    >
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <UserEditModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={(updatedUser) => {
            setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
            setEditingUser(null);
          }}
        />
      )}
    </div>
  );
};

interface UserEditModalProps {
  user: User;
  onClose: () => void;
  onSave: (user: User) => void;
}

const UserEditModal = ({ user, onClose, onSave }: UserEditModalProps) => {
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    language: user.language,
    isActive: user.isActive
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...user,
      ...formData,
      updatedAt: new Date().toISOString()
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Edit User Role
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                First Name
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Last Name
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Role
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="admin">Admin</option>
                <option value="raises_jamia">Rais e Jamia</option>
                <option value="mudir">Mudir</option>
                <option value="shaikul_hadees">Shaikul Hadees</option>
                <option value="nazim">Nazim</option>
                <option value="senior_mentor">Senior Mentor</option>
                <option value="teacher">Teacher</option>
                <option value="staff">Staff</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Language
              </label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value as any })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="en">English</option>
                <option value="ur">Urdu</option>
                <option value="ar">Arabic</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900 dark:text-white">
                Active
              </label>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-md transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors duration-200"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
