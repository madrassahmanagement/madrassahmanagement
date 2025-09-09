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
  HeartIcon,
  ChartBarIcon,
  ClockIcon,
  StarIcon,
  CalendarIcon,
  AcademicCapIcon,
  FireIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

interface FitnessRecord {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  date: string;
  activity: string;
  duration: number; // in minutes
  intensity: 'low' | 'medium' | 'high';
  calories: number;
  notes: string;
  teacherId: string;
  teacherName: string;
  bmi?: number;
  weight?: number;
  height?: number;
}

export const FitnessPage = () => {
  const [records, setRecords] = useState<FitnessRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<FitnessRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('');
  const [selectedIntensity, setSelectedIntensity] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<FitnessRecord | null>(null);

  // Mock data
  const mockRecords: FitnessRecord[] = [
    {
      id: '1',
      studentId: 'STU001',
      studentName: 'Muhammad Hassan',
      className: '5A',
      date: '2024-01-15',
      activity: 'Running',
      duration: 30,
      intensity: 'high',
      calories: 300,
      notes: 'Excellent performance, maintained steady pace',
      teacherId: 'TCH001',
      teacherName: 'Muhammad Ali',
      bmi: 18.5,
      weight: 45,
      height: 155
    },
    {
      id: '2',
      studentId: 'STU002',
      studentName: 'Fatima Khan',
      className: '4B',
      date: '2024-01-14',
      activity: 'Swimming',
      duration: 45,
      intensity: 'medium',
      calories: 250,
      notes: 'Good technique, needs to work on endurance',
      teacherId: 'TCH002',
      teacherName: 'Fatima Khan',
      bmi: 19.2,
      weight: 42,
      height: 150
    },
    {
      id: '3',
      studentId: 'STU003',
      studentName: 'Ahmad Ali',
      className: '6A',
      date: '2024-01-13',
      activity: 'Football',
      duration: 60,
      intensity: 'high',
      calories: 400,
      notes: 'Great teamwork and coordination',
      teacherId: 'TCH001',
      teacherName: 'Muhammad Ali',
      bmi: 20.1,
      weight: 50,
      height: 158
    },
    {
      id: '4',
      studentId: 'STU004',
      studentName: 'Aisha Ahmed',
      className: '7B',
      date: '2024-01-12',
      activity: 'Yoga',
      duration: 25,
      intensity: 'low',
      calories: 100,
      notes: 'Good flexibility, needs more practice',
      teacherId: 'TCH003',
      teacherName: 'Ahmad Hassan',
      bmi: 17.8,
      weight: 40,
      height: 145
    }
  ];

  const activities = [
    'Running', 'Swimming', 'Football', 'Basketball', 'Cricket', 'Yoga', 
    'Gymnastics', 'Martial Arts', 'Cycling', 'Walking', 'Dancing', 'Volleyball'
  ];

  const classes = ['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B', '5A', '5B', '6A', '6B', '7A', '7B', '8A', '8B'];

  // Load records
  useEffect(() => {
    const loadRecords = async () => {
      try {
        // Try API first
        const token = localStorage.getItem('token');
        if (token && token !== 'mock-token') {
          const response = await fetch('http://localhost:5000/api/fitness', {
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
        console.error('Error loading fitness records:', error);
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
        record.activity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.notes.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedActivity) {
      filtered = filtered.filter(record => record.activity === selectedActivity);
    }

    if (selectedIntensity) {
      filtered = filtered.filter(record => record.intensity === selectedIntensity);
    }

    if (selectedClass) {
      filtered = filtered.filter(record => record.className === selectedClass);
    }

    setFilteredRecords(filtered);
  }, [records, searchTerm, selectedActivity, selectedIntensity, selectedClass]);

  const getIntensityBadge = (intensity: string) => {
    const intensityConfig = {
      low: { color: 'bg-green-100 text-green-800', icon: HeartIcon },
      medium: { color: 'bg-yellow-100 text-yellow-800', icon: FireIcon },
      high: { color: 'bg-red-100 text-red-800', icon: TrophyIcon }
    };

    const config = intensityConfig[intensity as keyof typeof intensityConfig];
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {intensity.toUpperCase()}
      </span>
    );
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return { category: 'Underweight', color: 'text-blue-600' };
    if (bmi < 25) return { category: 'Normal', color: 'text-green-600' };
    if (bmi < 30) return { category: 'Overweight', color: 'text-yellow-600' };
    return { category: 'Obese', color: 'text-red-600' };
  };

  const handleDeleteRecord = (recordId: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      setRecords(prev => prev.filter(record => record.id !== recordId));
      toast.success('Fitness record deleted successfully');
    }
  };

  const totalCalories = records.reduce((acc, record) => acc + record.calories, 0);
  const totalDuration = records.reduce((acc, record) => acc + record.duration, 0);
  const avgBMI = records.reduce((acc, record) => acc + (record.bmi || 0), 0) / records.length;
  const highIntensityRecords = records.filter(r => r.intensity === 'high').length;

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
          <h1 className="heading-lg">Fitness Tracking</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor student physical activities, health metrics, and fitness progress
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
              <HeartIcon className="h-8 w-8 text-grass-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Activities</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{records.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FireIcon className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Calories</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalCalories}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Duration</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{Math.round(totalDuration / 60)}h</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrophyIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">High Intensity</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{highIntensityRecords}</p>
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
                  placeholder="Search fitness records..."
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
                <label className="label">Activity</label>
                <select
                  value={selectedActivity}
                  onChange={(e) => setSelectedActivity(e.target.value)}
                  className="input mt-1"
                >
                  <option value="">All Activities</option>
                  {activities.map(activity => (
                    <option key={activity} value={activity}>{activity}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Intensity</label>
                <select
                  value={selectedIntensity}
                  onChange={(e) => setSelectedIntensity(e.target.value)}
                  className="input mt-1"
                >
                  <option value="">All Intensities</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
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
                    setSelectedActivity('');
                    setSelectedIntensity('');
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
            Fitness Records ({filteredRecords.length})
          </h3>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Activity Details
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Duration & Calories
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Health Metrics
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Teacher
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
                        <div className="font-medium">{record.activity}</div>
                        <div className="text-gray-500 dark:text-gray-400 mt-1">
                          {record.notes}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {new Date(record.date).toLocaleDateString()}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="space-y-2">
                        <div className="text-sm text-gray-900 dark:text-white">
                          <span className="font-medium">{record.duration} min</span>
                        </div>
                        <div className="text-sm text-gray-900 dark:text-white">
                          <span className="font-medium">{record.calories} cal</span>
                        </div>
                        <div>
                          {getIntensityBadge(record.intensity)}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      {record.bmi ? (
                        <div className="text-sm text-gray-900 dark:text-white">
                          <div className="font-medium">BMI: {record.bmi.toFixed(1)}</div>
                          <div className={`text-xs ${getBMICategory(record.bmi).color}`}>
                            {getBMICategory(record.bmi).category}
                          </div>
                          {record.weight && record.height && (
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {record.weight}kg • {record.height}cm
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          No health data
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {record.teacherName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {record.teacherId}
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
              <HeartIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No records found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {searchTerm || selectedActivity || selectedIntensity || selectedClass
                  ? 'Try adjusting your search criteria.'
                  : 'Get started by adding a new fitness record.'
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
                <h3 className="heading-md">Add Fitness Record</h3>
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
                    <label className="label">Activity</label>
                    <select className="input mt-1" required>
                      <option value="">Select Activity</option>
                      {activities.map(activity => (
                        <option key={activity} value={activity}>{activity}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="label">Intensity</label>
                    <select className="input mt-1" required>
                      <option value="">Select Intensity</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">Duration (minutes)</label>
                    <input type="number" className="input mt-1" placeholder="30" required />
                  </div>
                  <div>
                    <label className="label">Calories</label>
                    <input type="number" className="input mt-1" placeholder="250" required />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="label">Weight (kg)</label>
                    <input type="number" className="input mt-1" placeholder="45" />
                  </div>
                  <div>
                    <label className="label">Height (cm)</label>
                    <input type="number" className="input mt-1" placeholder="155" />
                  </div>
                  <div>
                    <label className="label">BMI</label>
                    <input type="number" step="0.1" className="input mt-1" placeholder="18.5" />
                  </div>
                </div>
                <div>
                  <label className="label">Notes</label>
                  <textarea className="input mt-1 h-20" placeholder="Enter notes" />
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