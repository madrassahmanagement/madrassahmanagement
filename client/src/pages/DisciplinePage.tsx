import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  UserCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  StarIcon,
  BookOpenIcon,
  CalendarIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

interface DisciplineRecord {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  date: string;
  type: 'positive' | 'negative';
  category: string;
  description: string;
  points: number;
  teacherId: string;
  teacherName: string;
  status: 'active' | 'resolved' | 'escalated';
  resolution?: string;
  resolvedBy?: string;
  resolvedDate?: string;
}

export const DisciplinePage = () => {
  const [records, setRecords] = useState<DisciplineRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<DisciplineRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<DisciplineRecord | null>(null);

  // Mock data
  const mockRecords: DisciplineRecord[] = [
    {
      id: '1',
      studentId: 'STU001',
      studentName: 'Muhammad Hassan',
      className: '5A',
      date: '2024-01-15',
      type: 'positive',
      category: 'Academic Excellence',
      description: 'Outstanding performance in Quran recitation',
      points: 10,
      teacherId: 'TCH001',
      teacherName: 'Muhammad Ali',
      status: 'active'
    },
    {
      id: '2',
      studentId: 'STU002',
      studentName: 'Fatima Khan',
      className: '4B',
      date: '2024-01-14',
      type: 'negative',
      category: 'Behavior',
      description: 'Disruptive behavior during class',
      points: -5,
      teacherId: 'TCH002',
      teacherName: 'Fatima Khan',
      status: 'resolved',
      resolution: 'Student apologized and promised to improve',
      resolvedBy: 'Muhammad Ali',
      resolvedDate: '2024-01-16'
    },
    {
      id: '3',
      studentId: 'STU003',
      studentName: 'Ahmad Ali',
      className: '6A',
      date: '2024-01-13',
      type: 'positive',
      category: 'Helping Others',
      description: 'Helped a classmate with homework',
      points: 5,
      teacherId: 'TCH001',
      teacherName: 'Muhammad Ali',
      status: 'active'
    },
    {
      id: '4',
      studentId: 'STU004',
      studentName: 'Aisha Ahmed',
      className: '7B',
      date: '2024-01-12',
      type: 'negative',
      category: 'Attendance',
      description: 'Frequent late arrivals',
      points: -3,
      teacherId: 'TCH003',
      teacherName: 'Ahmad Hassan',
      status: 'escalated'
    }
  ];

  const categories = [
    'Academic Excellence', 'Behavior', 'Attendance', 'Helping Others', 
    'Leadership', 'Respect', 'Punctuality', 'Participation', 'Discipline'
  ];

  const classes = ['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B', '5A', '5B', '6A', '6B', '7A', '7B', '8A', '8B'];

  // Load records
  useEffect(() => {
    const loadRecords = async () => {
      try {
        // Try API first
        const token = localStorage.getItem('token');
        if (token && token !== 'mock-token') {
          const response = await fetch('http://localhost:5000/api/discipline', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json();
            const recordsData = data.records || data.data || [];
            setRecords(recordsData);
            setFilteredRecords(recordsData);
            setIsLoading(false);
            return;
          }
        }

        // Use mock data
        setRecords(mockRecords);
        setFilteredRecords(mockRecords);
      } catch (error) {
        console.error('Error loading discipline records:', error);
        setRecords(mockRecords);
        setFilteredRecords(mockRecords);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecords();
  }, []);

  // Filter records
  useEffect(() => {
    let filtered = records;

    if (searchTerm) {
      filtered = filtered.filter(record =>
        record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType) {
      filtered = filtered.filter(record => record.type === selectedType);
    }

    if (selectedStatus) {
      filtered = filtered.filter(record => record.status === selectedStatus);
    }

    if (selectedClass) {
      filtered = filtered.filter(record => record.className === selectedClass);
    }

    setFilteredRecords(filtered);
  }, [records, searchTerm, selectedType, selectedStatus, selectedClass]);

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      positive: { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
      negative: { color: 'bg-red-100 text-red-800', icon: XCircleIcon }
    };

    const config = typeConfig[type as keyof typeof typeConfig];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {type.toUpperCase()}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { color: 'bg-blue-100 text-blue-800', icon: ClockIcon },
      resolved: { color: 'bg-green-100 text-green-800', icon: CheckCircleIcon },
      escalated: { color: 'bg-red-100 text-red-800', icon: ExclamationTriangleIcon }
    };

    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {status.toUpperCase()}
      </span>
    );
  };

  const getPointsBadge = (points: number) => {
    if (points > 0) return 'bg-green-100 text-green-800';
    if (points < 0) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const handleDeleteRecord = (recordId: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      setRecords(prev => prev.filter(record => record.id !== recordId));
      toast.success('Discipline record deleted successfully');
    }
  };

  const handleStatusChange = (recordId: string, newStatus: string) => {
    setRecords(prev => prev.map(record => 
      record.id === recordId ? { 
        ...record, 
        status: newStatus as any,
        resolvedDate: newStatus === 'resolved' ? new Date().toISOString().split('T')[0] : undefined,
        resolvedBy: newStatus === 'resolved' ? 'Current User' : undefined
      } : record
    ));
    toast.success('Record status updated');
  };

  const totalPoints = records.reduce((acc, record) => acc + record.points, 0);
  const positiveRecords = records.filter(r => r.type === 'positive').length;
  const negativeRecords = records.filter(r => r.type === 'negative').length;
  const activeRecords = records.filter(r => r.status === 'active').length;

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
          <h1 className="heading-lg">Discipline Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track student behavior, positive actions, and discipline records
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Record
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-8 w-8 text-grass-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Records</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{records.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Positive</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{positiveRecords}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Negative</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{negativeRecords}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <StarIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Points</p>
              <p className={`text-2xl font-semibold ${totalPoints >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalPoints > 0 ? '+' : ''}{totalPoints}
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
                  placeholder="Search records..."
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
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="label">Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="input mt-1"
                >
                  <option value="">All Types</option>
                  <option value="positive">Positive</option>
                  <option value="negative">Negative</option>
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
                  <option value="resolved">Resolved</option>
                  <option value="escalated">Escalated</option>
                </select>
              </div>
              <div>
                <label className="label">Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="input mt-1"
                >
                  <option value="">All Classes</option>
                  {classes.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSelectedType('');
                    setSelectedStatus('');
                    setSelectedClass('');
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

      {/* Records Table */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="heading-sm mb-4">
            Discipline Records ({filteredRecords.length})
          </h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Record Details
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Points & Type
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Teacher
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
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <UserCircleIcon className="h-10 w-10 text-gray-400" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {record.studentName}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {record.studentId} • {record.className}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        <div className="font-medium">{record.category}</div>
                        <div className="text-gray-500 dark:text-gray-400 mt-1">
                          {record.description}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {new Date(record.date).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="space-y-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPointsBadge(record.points)}`}>
                          {record.points > 0 ? '+' : ''}{record.points} points
                        </span>
                        <div>
                          {getTypeBadge(record.type)}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {record.teacherName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {record.teacherId}
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        {getStatusBadge(record.status)}
                        {record.resolvedBy && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Resolved by: {record.resolvedBy}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => {
                            setSelectedRecord(record);
                            setShowEditModal(true);
                          }}
                          className="text-primary-600 hover:text-primary-900"
                          title="View Details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedRecord(record);
                            setShowEditModal(true);
                          }}
                          className="text-indigo-600 hover:text-indigo-900"
                          title="Edit"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <select
                          value={record.status}
                          onChange={(e) => handleStatusChange(record.id, e.target.value)}
                          className="text-xs border border-gray-300 rounded px-2 py-1 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        >
                          <option value="active">Active</option>
                          <option value="resolved">Resolved</option>
                          <option value="escalated">Escalated</option>
                        </select>
                        <button 
                          onClick={() => handleDeleteRecord(record.id)}
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

          {filteredRecords.length === 0 && (
            <div className="text-center py-8">
              <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No records found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchTerm || selectedType || selectedStatus || selectedClass
                  ? 'Try adjusting your search criteria.'
                  : 'Get started by adding a new discipline record.'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add Record Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="heading-md">Add Discipline Record</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-200"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <form className="space-y-4">
                <div>
                  <label className="label">Student</label>
                  <select className="input mt-1" required>
                    <option value="">Select Student</option>
                    <option value="STU001">Muhammad Hassan (5A)</option>
                    <option value="STU002">Fatima Khan (4B)</option>
                    <option value="STU003">Ahmad Ali (6A)</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Type</label>
                    <select className="input mt-1" required>
                      <option value="">Select Type</option>
                      <option value="positive">Positive</option>
                      <option value="negative">Negative</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Category</label>
                    <select className="input mt-1" required>
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="label">Points</label>
                  <input type="number" className="input mt-1" placeholder="Enter points" required />
                </div>
                <div>
                  <label className="label">Description</label>
                  <textarea className="input mt-1 h-20" placeholder="Enter description" required />
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
                    Add Record
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