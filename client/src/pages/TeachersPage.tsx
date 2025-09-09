import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UserCircleIcon,
  AcademicCapIcon,
  PhoneIcon,
  EnvelopeIcon,
  CalendarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  StarIcon,
  BookOpenIcon
} from '@heroicons/react/24/outline';

interface Teacher {
  id: string;
  teacherId: string;
  employeeNumber: string;
  joinDate: string;
  subjects: string[];
  classes: string[];
  qualification: string;
  experience: number;
  salary: number;
  status: 'active' | 'inactive' | 'on-leave';
  performance: number;
  attendancePercentage: number;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    language: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export const TeachersPage = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  // Mock data
  const mockTeachers: Teacher[] = [
    {
      id: '1',
      teacherId: 'TCH001',
      employeeNumber: 'EMP001',
      joinDate: '2023-01-15',
      subjects: ['Quran', 'Arabic', 'Islamic Studies'],
      classes: ['5A', '5B', '6A'],
      qualification: 'Masters in Islamic Studies',
      experience: 5,
      salary: 45000,
      status: 'active',
      performance: 92,
      attendancePercentage: 95,
      user: {
        id: '1',
        firstName: 'Muhammad',
        lastName: 'Ali',
        email: 'muhammad.ali@madrassah.com',
        phone: '+92-300-1234567',
        role: 'teacher',
        language: 'en',
        isActive: true,
        createdAt: '2023-01-15T00:00:00Z',
        updatedAt: '2023-01-15T00:00:00Z'
      }
    },
    {
      id: '2',
      teacherId: 'TCH002',
      employeeNumber: 'EMP002',
      joinDate: '2023-02-01',
      subjects: ['Quran', 'Tajweed'],
      classes: ['3A', '3B', '4A'],
      qualification: 'Hafiz-e-Quran',
      experience: 8,
      salary: 50000,
      status: 'active',
      performance: 88,
      attendancePercentage: 98,
      user: {
        id: '2',
        firstName: 'Fatima',
        lastName: 'Khan',
        email: 'fatima.khan@madrassah.com',
        phone: '+92-300-1234568',
        role: 'teacher',
        language: 'en',
        isActive: true,
        createdAt: '2023-02-01T00:00:00Z',
        updatedAt: '2023-02-01T00:00:00Z'
      }
    },
    {
      id: '3',
      teacherId: 'TCH003',
      employeeNumber: 'EMP003',
      joinDate: '2023-03-10',
      subjects: ['Arabic', 'Urdu'],
      classes: ['7A', '7B'],
      qualification: 'Masters in Arabic',
      experience: 3,
      salary: 40000,
      status: 'on-leave',
      performance: 85,
      attendancePercentage: 90,
      user: {
        id: '3',
        firstName: 'Ahmad',
        lastName: 'Hassan',
        email: 'ahmad.hassan@madrassah.com',
        phone: '+92-300-1234569',
        role: 'teacher',
        language: 'en',
        isActive: true,
        createdAt: '2023-03-10T00:00:00Z',
        updatedAt: '2023-03-10T00:00:00Z'
      }
    }
  ];

  const subjects = ['Quran', 'Arabic', 'Islamic Studies', 'Tajweed', 'Urdu', 'English', 'Mathematics', 'Science'];
  const classes = ['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B', '5A', '5B', '6A', '6B', '7A', '7B', '8A', '8B'];

  // Load teachers
  useEffect(() => {
    const loadTeachers = async () => {
      try {
        // Try API first
        const token = localStorage.getItem('token');
        if (token && token !== 'mock-token') {
          const response = await fetch('http://localhost:5000/api/teachers', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json();
            const teachersData = data.teachers || data.data || [];
            setTeachers(teachersData);
            setFilteredTeachers(teachersData);
            setIsLoading(false);
            return;
          }
        }

        // Use mock data
        setTeachers(mockTeachers);
        setFilteredTeachers(mockTeachers);
      } catch (error) {
        console.error('Error loading teachers:', error);
        setTeachers(mockTeachers);
        setFilteredTeachers(mockTeachers);
      } finally {
        setIsLoading(false);
      }
    };

    loadTeachers();
  }, []);

  // Filter teachers
  useEffect(() => {
    let filtered = teachers;

    if (searchTerm) {
      filtered = filtered.filter(teacher =>
        teacher.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.teacherId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.subjects.some(subject => subject.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedSubject) {
      filtered = filtered.filter(teacher =>
        teacher.subjects.includes(selectedSubject)
      );
    }

    if (selectedStatus) {
      filtered = filtered.filter(teacher => teacher.status === selectedStatus);
    }

    setFilteredTeachers(filtered);
  }, [teachers, searchTerm, selectedSubject, selectedStatus]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
      inactive: { color: 'bg-red-100 text-red-800', icon: XCircleIcon },
      'on-leave': { color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {status.replace('-', ' ').toUpperCase()}
      </span>
    );
  };

  const getPerformanceBadge = (performance: number) => {
    if (performance >= 90) return 'bg-green-100 text-green-800';
    if (performance >= 80) return 'bg-yellow-100 text-yellow-800';
    if (performance >= 70) return 'bg-orange-100 text-orange-800';
    return 'bg-red-100 text-red-800';
  };

  const handleDeleteTeacher = (teacherId: string) => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      setTeachers(prev => prev.filter(teacher => teacher.id !== teacherId));
      toast.success('Teacher deleted successfully');
    }
  };

  const handleStatusChange = (teacherId: string, newStatus: string) => {
    setTeachers(prev => prev.map(teacher => 
      teacher.id === teacherId ? { ...teacher, status: newStatus as any } : teacher
    ));
    toast.success('Teacher status updated');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-grass-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="heading-lg">Teachers Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage teacher records, assignments, and performance
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Teacher
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserCircleIcon className="h-8 w-8 text-grass-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Teachers</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{teachers.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {teachers.filter(t => t.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <StarIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Performance</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {Math.round(teachers.reduce((acc, t) => acc + t.performance, 0) / teachers.length)}%
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BookOpenIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Subjects</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {new Set(teachers.flatMap(t => t.subjects)).size}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search teachers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-outline"
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="label">Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="input mt-1"
                >
                  <option value="">All Subjects</option>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="input mt-1"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="on-leave">On Leave</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSelectedSubject('');
                    setSelectedStatus('');
                    setSearchTerm('');
                  }}
                  className="btn btn-outline w-full"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Teachers Table */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="heading-sm mb-4">
            Teacher Records ({filteredTeachers.length})
          </h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Teacher
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Subjects & Classes
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Performance
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <UserCircleIcon className="h-10 w-10 text-gray-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {teacher.user.firstName} {teacher.user.lastName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {teacher.teacherId} • {teacher.employeeNumber}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        <div className="font-medium">Subjects:</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {teacher.subjects.map(subject => (
                            <span key={subject} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-grass-100 text-grass-800">
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        Classes: {teacher.classes.join(', ')}
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white flex items-center">
                        <PhoneIcon className="h-4 w-4 mr-1" />
                        {teacher.user.phone}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                        <EnvelopeIcon className="h-4 w-4 mr-1" />
                        {teacher.user.email}
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPerformanceBadge(teacher.performance)}`}>
                            {teacher.performance}%
                          </span>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          Attendance: {teacher.attendancePercentage}%
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          Experience: {teacher.experience} years
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {getStatusBadge(teacher.status)}
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Salary: Rs. {teacher.salary.toLocaleString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => {
                            setSelectedTeacher(teacher);
                            setShowEditModal(true);
                          }}
                          className="text-primary-600 hover:text-primary-900"
                          title="View Details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedTeacher(teacher);
                            setShowEditModal(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <select
                          value={teacher.status}
                          onChange={(e) => handleStatusChange(teacher.id, e.target.value)}
                          className="text-xs border border-gray-300 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="on-leave">On Leave</option>
                        </select>
                        <button 
                          onClick={() => handleDeleteTeacher(teacher.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTeachers.length === 0 && (
            <div className="text-center py-8">
              <UserCircleIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No teachers found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchTerm || selectedSubject || selectedStatus 
                  ? 'Try adjusting your search criteria.'
                  : 'Get started by adding a new teacher.'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Teacher Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="heading-md">Add New Teacher</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-200"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">First Name</label>
                    <input type="text" className="input mt-1" required />
                  </div>
                  <div>
                    <label className="label">Last Name</label>
                    <input type="text" className="input mt-1" required />
                  </div>
                </div>
                <div>
                  <label className="label">Email</label>
                  <input type="email" className="input mt-1" required />
                </div>
                <div>
                  <label className="label">Phone</label>
                  <input type="tel" className="input mt-1" required />
                </div>
                <div>
                  <label className="label">Subjects</label>
                  <select multiple className="input mt-1 h-20">
                    {subjects.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Classes</label>
                  <select multiple className="input mt-1 h-20">
                    {classes.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Add Teacher
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};