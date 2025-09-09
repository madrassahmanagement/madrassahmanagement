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
  ExclamationTriangleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { Student } from '../types';

export const StudentsPage = () => {
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
        // First, let's check if we have a token, if not, use mock data
        const token = localStorage.getItem('token');
        if (!token) {
          // Use mock data if no token
          const mockStudents: Student[] = [
            {
              id: '1',
              studentId: 'STU001',
              admissionNumber: 'ADM2024001',
              admissionDate: '2024-01-15',
              currentClass: '5A',
              section: 'A',
              rollNumber: '001',
              guardian: {
                father: {
                  name: 'Ahmed Ali',
                  phone: '+92-300-1234567',
                  occupation: 'Business',
                  cnic: '12345-1234567-1'
                },
                mother: {
                  name: 'Fatima Ahmed',
                  phone: '+92-300-1234568',
                  occupation: 'Teacher'
                },
                emergencyContact: {
                  name: 'Muhammad Ali',
                  relationship: 'Uncle',
                  phone: '+92-300-1234569'
                }
              },
              academicYear: '2024',
              quranLevel: 'intermediate',
              currentSurah: 'Al-Baqarah',
              currentAyah: 15,
              memorizationProgress: 75,
              health: {
                bloodGroup: 'O+',
                allergies: [],
                medicalConditions: []
              },
              overallPerformance: 85,
              attendancePercentage: 92,
              namazPercentage: 88,
              status: 'active',
              feeStatus: 'paid',
              monthlyFee: 2000,
              user: {
                id: '1',
                firstName: 'Muhammad',
                lastName: 'Hassan',
                email: 'muhammad.hassan@example.com',
                phone: '+92-300-1234567',
                role: 'student',
                language: 'en',
                isActive: true,
                createdAt: '2024-01-15T00:00:00Z',
                updatedAt: '2024-01-15T00:00:00Z'
              }
            },
            {
              id: '2',
              studentId: 'STU002',
              admissionNumber: 'ADM2024002',
              admissionDate: '2024-01-20',
              currentClass: '4B',
              section: 'B',
              rollNumber: '002',
              guardian: {
                father: {
                  name: 'Ali Khan',
                  phone: '+92-300-1234570',
                  occupation: 'Engineer',
                  cnic: '12345-1234567-2'
                },
                mother: {
                  name: 'Aisha Ali',
                  phone: '+92-300-1234571',
                  occupation: 'Doctor'
                }
              },
              academicYear: '2024',
              quranLevel: 'beginner',
              currentSurah: 'Al-Fatiha',
              currentAyah: 7,
              memorizationProgress: 25,
              health: {
                bloodGroup: 'A+',
                allergies: ['Peanuts'],
                medicalConditions: []
              },
              overallPerformance: 78,
              attendancePercentage: 95,
              namazPercentage: 82,
              status: 'active',
              feeStatus: 'pending',
              monthlyFee: 2000,
              user: {
                id: '2',
                firstName: 'Ahmad',
                lastName: 'Khan',
                email: 'ahmad.khan@example.com',
                phone: '+92-300-1234570',
                role: 'student',
                language: 'en',
                isActive: true,
                createdAt: '2024-01-20T00:00:00Z',
                updatedAt: '2024-01-20T00:00:00Z'
              }
            }
          ];
          setStudents(mockStudents);
          setFilteredStudents(mockStudents);
          setIsLoading(false);
          return;
        }

        const response = await fetch('http://localhost:5000/api/students', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          // If it's a mock token, skip API call and use mock data
          if (token === 'mock-token') {
            throw new Error('Using mock data');
          }
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const studentsData = data.students || data.data || [];
        
        // Transform the data to match our interface
        const transformedStudents = studentsData.map((student: any) => ({
          id: student._id || student.id,
          studentId: student.studentId,
          admissionNumber: student.admissionNumber,
          admissionDate: student.admissionDate,
          currentClass: student.currentClass?.name || student.currentClass,
          section: student.section,
          rollNumber: student.rollNumber,
          guardian: student.guardian || {
            father: { name: '', phone: '', occupation: '', cnic: '' },
            mother: { name: '', phone: '', occupation: '' },
            emergencyContact: { name: '', relationship: '', phone: '' }
          },
          academicYear: student.academicYear,
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
          status: student.status || 'active',
          feeStatus: student.feeStatus || 'pending',
          monthlyFee: student.monthlyFee || 2000,
          user: {
            id: student.user?._id || student.user?.id,
            firstName: student.user?.firstName || '',
            lastName: student.user?.lastName || '',
            email: student.user?.email || '',
            phone: student.user?.phone || '',
            role: 'student',
            language: 'en',
            isActive: true,
            createdAt: student.createdAt || new Date().toISOString(),
            updatedAt: student.updatedAt || new Date().toISOString()
          }
        }));

        setStudents(transformedStudents);
        setFilteredStudents(transformedStudents);
      } catch (error) {
        console.error('Error loading students:', error);
        toast.error('Failed to load students from API, using mock data');
        
        // Fallback to localStorage if API fails
        const storedStudents = localStorage.getItem('students');
        if (storedStudents) {
          const parsedStudents = JSON.parse(storedStudents);
          setStudents(parsedStudents);
          setFilteredStudents(parsedStudents);
        } else {
          // Use mock data as final fallback
          const mockStudents: Student[] = [
            {
              id: '1',
              studentId: 'STU001',
              admissionNumber: 'ADM2024001',
              admissionDate: '2024-01-15',
              currentClass: '5A',
              section: 'A',
              rollNumber: '001',
              guardian: {
                father: {
                  name: 'Ahmed Ali',
                  phone: '+92-300-1234567',
                  occupation: 'Business',
                  cnic: '12345-1234567-1'
                },
                mother: {
                  name: 'Fatima Ahmed',
                  phone: '+92-300-1234568',
                  occupation: 'Teacher'
                },
                emergencyContact: {
                  name: 'Muhammad Ali',
                  relationship: 'Uncle',
                  phone: '+92-300-1234569'
                }
              },
              academicYear: '2024',
              quranLevel: 'intermediate',
              currentSurah: 'Al-Baqarah',
              currentAyah: 15,
              memorizationProgress: 75,
              health: {
                bloodGroup: 'O+',
                allergies: [],
                medicalConditions: []
              },
              overallPerformance: 85,
              attendancePercentage: 92,
              namazPercentage: 88,
              status: 'active',
              feeStatus: 'paid',
              monthlyFee: 2000,
              user: {
                id: '1',
                firstName: 'Muhammad',
                lastName: 'Hassan',
                email: 'muhammad.hassan@example.com',
                phone: '+92-300-1234567',
                role: 'student',
                language: 'en',
                isActive: true,
                createdAt: '2024-01-15T00:00:00Z',
                updatedAt: '2024-01-15T00:00:00Z'
              }
            }
          ];
          setStudents(mockStudents);
          setFilteredStudents(mockStudents);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadStudents();
  }, []);

  // Filter students based on search and filters
  useEffect(() => {
    let filtered = students;

    if (searchTerm) {
      filtered = filtered.filter(student => 
        student.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.admissionNumber.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedClass) {
      filtered = filtered.filter(student => student.currentClass === selectedClass);
    }

    if (selectedStatus) {
      filtered = filtered.filter(student => student.status === selectedStatus);
    }

    setFilteredStudents(filtered);
  }, [students, searchTerm, selectedClass, selectedStatus]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircleIcon className="w-3 h-3 mr-1" />
          Active
        </span>;
      case 'inactive':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          <XCircleIcon className="w-3 h-3 mr-1" />
          Inactive
        </span>;
      case 'suspended':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
          Suspended
        </span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {status}
        </span>;
    }
  };

  const getFeeStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Paid
        </span>;
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Pending
        </span>;
      case 'overdue':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Overdue
        </span>;
      case 'exempt':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          Exempt
        </span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {status}
        </span>;
    }
  };

  const updateFeeStatus = (studentId: string, newStatus: string) => {
    setStudents(prevStudents => 
      prevStudents.map(student => 
        student.id === studentId 
          ? { ...student, feeStatus: newStatus as 'paid' | 'pending' | 'exempt' | 'overdue' }
          : student
      )
    );
    setFilteredStudents(prevStudents => 
      prevStudents.map(student => 
        student.id === studentId 
          ? { ...student, feeStatus: newStatus as 'paid' | 'pending' | 'exempt' | 'overdue' }
          : student
      ));
    
    // Update localStorage
    const updatedStudents = students.map(student => 
      student.id === studentId 
        ? { ...student, feeStatus: newStatus }
        : student
    );
    localStorage.setItem('students', JSON.stringify(updatedStudents));
    
    toast.success(`Fee status updated to ${newStatus}`);
    setShowFeeModal(false);
    setSelectedStudent(null);
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
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <FunnelIcon className="h-4 w-4 mr-2" />
            Filters
          </button>
          <Link
            to="/students/add"
            className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Student
          </Link>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white shadow rounded-lg p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                {classes.map(cls => (
                  <option key={cls} value={cls === 'All' ? '' : cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                {statuses.map(status => (
                  <option key={status} value={status === 'All' ? '' : status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-4 sm:p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserCircleIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
              <div className="ml-3 sm:ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                    Total Students
                  </dt>
                  <dd className="text-base sm:text-lg font-medium text-gray-900">
                    {students.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-4 sm:p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
              <div className="ml-3 sm:ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                    Active Students
                  </dt>
                  <dd className="text-base sm:text-lg font-medium text-gray-900">
                    {students.filter(s => s.status === 'active').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-4 sm:p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AcademicCapIcon className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />
              </div>
              <div className="ml-3 sm:ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                    Classes
                  </dt>
                  <dd className="text-base sm:text-lg font-medium text-gray-900">
                    {new Set(students.map(s => s.currentClass)).size}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-4 sm:p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-600" />
              </div>
              <div className="ml-3 sm:ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">
                    Pending Fees
                  </dt>
                  <dd className="text-base sm:text-lg font-medium text-gray-900">
                    {students.filter(s => s.feeStatus === 'pending').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="heading-sm mb-4">
            Student Records ({filteredStudents.length})
          </h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Class
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
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <UserCircleIcon className="h-10 w-10 text-gray-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {student.user.firstName} {student.user.lastName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {student.studentId} • {student.admissionNumber}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{student.currentClass}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Section {student.section}</div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white flex items-center">
                        <PhoneIcon className="h-4 w-4 mr-1" />
                        {student.guardian.father.phone}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                        <EnvelopeIcon className="h-4 w-4 mr-1" />
                        {student.user.email}
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        Overall: {student.overallPerformance}%
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Attendance: {student.attendancePercentage}%
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {getStatusBadge(student.status)}
                        {getFeeStatusBadge(student.feeStatus)}
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button className="text-primary-600 hover:text-primary-900">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button className="text-indigo-600 hover:text-indigo-900">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedStudent(student);
                            setShowFeeModal(true);
                          }}
                          className="text-yellow-600 hover:text-yellow-900"
                          title="Manage Fees"
                        >
                          💰
                        </button>
                        <button className="text-red-600 hover:text-red-900">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-8">
              <UserCircleIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No students found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchTerm || selectedClass || selectedStatus 
                  ? 'Try adjusting your search criteria.'
                  : 'Get started by adding a new student.'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Fee Management Modal */}
      {showFeeModal && selectedStudent && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800 transition-colors duration-200">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  💰 Manage Fees - {selectedStudent.user.firstName} {selectedStudent.user.lastName}
                </h3>
                <button
                  onClick={() => {
                    setShowFeeModal(false);
                    setSelectedStudent(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-200"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Student Information</h4>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    <p><strong>Student ID:</strong> {selectedStudent.studentId}</p>
                    <p><strong>Class:</strong> {selectedStudent.currentClass} - Section {selectedStudent.section}</p>
                    <p><strong>Monthly Fee:</strong> Rs. {selectedStudent.monthlyFee}</p>
                    <p><strong>Current Status:</strong> {getFeeStatusBadge(selectedStudent.feeStatus)}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    🎯 Fee Status Options:
                  </label>
                  <div className="space-y-2">
                    <button
                      onClick={() => updateFeeStatus(selectedStudent.id, 'paid')}
                      className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg border-2 transition-all duration-200 ${
                        selectedStudent.feeStatus === 'paid'
                          ? 'bg-green-50 text-green-800 border-green-300 shadow-md'
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-300'
                      }`}
                    >
                      <span className="flex items-center">
                        <span className="text-green-500 mr-2">✅</span>
                        Paid
                      </span>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Green Badge</span>
                    </button>
                    
                    <button
                      onClick={() => updateFeeStatus(selectedStudent.id, 'pending')}
                      className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg border-2 transition-all duration-200 ${
                        selectedStudent.feeStatus === 'pending'
                          ? 'bg-yellow-50 text-yellow-800 border-yellow-300 shadow-md'
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 hover:border-yellow-300'
                      }`}
                    >
                      <span className="flex items-center">
                        <span className="text-yellow-500 mr-2">⏳</span>
                        Pending
                      </span>
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Yellow Badge</span>
                    </button>
                    
                    <button
                      onClick={() => updateFeeStatus(selectedStudent.id, 'overdue')}
                      className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg border-2 transition-all duration-200 ${
                        selectedStudent.feeStatus === 'overdue'
                          ? 'bg-red-50 text-red-800 border-red-300 shadow-md'
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:border-red-300'
                      }`}
                    >
                      <span className="flex items-center">
                        <span className="text-red-500 mr-2">❌</span>
                        Overdue
                      </span>
                      <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Red Badge</span>
                    </button>
                    
                    <button
                      onClick={() => updateFeeStatus(selectedStudent.id, 'exempt')}
                      className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg border-2 transition-all duration-200 ${
                        selectedStudent.feeStatus === 'exempt'
                          ? 'bg-blue-50 text-blue-800 border-blue-300 shadow-md'
                          : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300'
                      }`}
                    >
                      <span className="flex items-center">
                        <span className="text-blue-500 mr-2">🔵</span>
                        Exempt
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Blue Badge</span>
                    </button>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <button
                    onClick={() => {
                      setShowFeeModal(false);
                      setSelectedStudent(null);
                    }}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
