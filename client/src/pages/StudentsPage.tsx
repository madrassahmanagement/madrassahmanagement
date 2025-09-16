import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { studentsAPI } from '../services/api';
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
  ExclamationTriangleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { Student } from '../types';

export const StudentsPage = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showFeeModal, setShowFeeModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Load students from API
  useEffect(() => {
    const loadStudents = async () => {
      try {
        setIsLoading(true);
        const response = await studentsAPI.getAll();
        const studentsData = response.data || [];
        
        console.log('Students data from API:', studentsData);
        
        // Transform the data to match our interface
        const transformedStudents = studentsData.map((student: any) => ({
          id: student._id || student.id,
          studentId: student.studentId || `STU${String(student.rollNumber || '').padStart(3, '0')}`,
          admissionNumber: student.admissionNumber || `ADM${new Date().getFullYear()}${String(Math.random()).substr(2, 3)}`,
          admissionDate: student.admissionDate,
          currentClass: student.currentClass?.name || student.currentClass || 'Not Assigned',
          section: student.section || 'A',
          rollNumber: student.rollNumber || '001',
          guardian: student.guardian || {
            father: { name: '', phone: '', occupation: '', cnic: '' },
            mother: { name: '', phone: '', occupation: '' },
            emergencyContact: { name: '', relationship: '', phone: '' }
          },
          academicYear: student.academicYear || new Date().getFullYear().toString(),
          quranLevel: student.quranLevel || 'beginner',
          currentSurah: student.currentSurah || 'Al-Fatiha',
          currentAyah: student.currentAyah || 1,
          memorizationProgress: student.memorizationProgress || 0,
          health: student.health || {
            bloodGroup: 'Not specified',
            allergies: [],
            medicalConditions: []
          },
          overallPerformance: student.overallPerformance || 0,
          attendancePercentage: student.attendancePercentage || 0,
          namazPercentage: student.namazPercentage || 0,
          status: student.isActive !== false ? 'active' : 'inactive',
          feeStatus: ((student.feeStatus ?? 'pending') as Student['feeStatus']),
          monthlyFee: student.monthlyFee || 2000,
          user: {
            id: student._id || student.id,
            firstName: student.firstName || 'Unknown',
            lastName: student.lastName || 'Student',
            email: student.email || 'no-email@example.com',
            phone: student.phone || 'No phone',
            role: 'student',
            language: 'en',
            isActive: student.isActive !== false,
            createdAt: student.createdAt || new Date().toISOString(),
            updatedAt: student.updatedAt || new Date().toISOString()
          }
        }));

        console.log('Transformed students:', transformedStudents);
        setStudents(transformedStudents);
        setFilteredStudents(transformedStudents);
      } catch (error) {
        console.error('Error loading students:', error);
        toast.error('Failed to load students');
        
        // Fallback to empty array
        setStudents([]);
        setFilteredStudents([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadStudents();
  }, []);

  // Filter students based on search and filters
  const filterStudents = () => {
    let filtered = students;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(student => 
        student.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Class filter
    if (selectedClass && selectedClass !== 'All') {
      filtered = filtered.filter(student => student.currentClass === selectedClass);
    }

    // Status filter
    if (selectedStatus && selectedStatus !== 'All') {
      filtered = filtered.filter(student => student.status === selectedStatus);
    }

    setFilteredStudents(filtered);
  };

  // Apply filters when search term or filters change
  useEffect(() => {
    filterStudents();
  }, [searchTerm, selectedClass, selectedStatus, students]);

  // Handle student deletion
  const handleDelete = async (studentId: string) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        // In a real app, you would call the API here
        setStudents(students.filter(student => student.id !== studentId));
        setFilteredStudents(filteredStudents.filter(student => student.id !== studentId));
        toast.success('Student deleted successfully');
      } catch (error) {
        toast.error('Failed to delete student');
      }
    }
  };

  // Handle fee status update
  const handleFeeStatusUpdate = (studentId: string, newStatus: Student['feeStatus']) => {
    setStudents(students.map(student => 
      student.id === studentId 
        ? { ...student, feeStatus: newStatus }
        : student
    ));
    setFilteredStudents(filteredStudents.map(student => 
      student.id === studentId 
        ? { ...student, feeStatus: newStatus }
        : student
    ));
    toast.success('Fee status updated successfully');
  };

  const classes = ['All', '1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B', '5A', '5B', '6A', '6B'];
  const statuses = ['All', 'active', 'inactive', 'suspended', 'graduated', 'transferred'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-7 text-gray-900 truncate">
            Students
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage student records and information
          </p>
        </div>
        <div className="flex sm:mt-0">
          {(user?.role === 'nazim' || user?.role === 'raises_jamia') && (
            <Link
              to="/students/add"
              className="inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 border border-transparent rounded-md shadow-sm text-xs sm:text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <PlusIcon className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Add Student</span>
              <span className="sm:hidden">Add</span>
            </Link>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
            Filters
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Class Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Class
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  {classes.map((cls) => (
                    <option key={cls} value={cls === 'All' ? '' : cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status === 'All' ? '' : status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Students List */}
      <div className="bg-white shadow rounded-lg">
        {filteredStudents.length === 0 ? (
          <div className="text-center py-12">
            <UserCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {students.length === 0 
                ? 'Get started by adding a new student.' 
                : 'Try adjusting your search or filter criteria.'
              }
            </p>
            {students.length === 0 && (user?.role === 'nazim' || user?.role === 'raises_jamia') && (
              <div className="mt-6">
                <Link
                  to="/students/add"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Student
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Class
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fee Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <UserCircleIcon className="h-10 w-10 text-gray-400" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {student.user.firstName} {student.user.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {student.studentId} • {student.admissionNumber}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <AcademicCapIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <div className="text-sm text-gray-900">
                            {student.currentClass} - {student.section}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{student.user.email}</div>
                        <div className="text-sm text-gray-500">{student.user.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          student.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : student.status === 'inactive'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {student.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          student.feeStatus === 'paid' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {student.feeStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => {/* View student details */}}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {/* Edit student */}}
                            className="text-yellow-600 hover:text-yellow-900"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(student.id)}
                            className="text-red-600 hover:text-red-900"
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
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredStudents.length > 0 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredStudents.length}</span> of{' '}
                <span className="font-medium">{filteredStudents.length}</span> results
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};