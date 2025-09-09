import { useState, useEffect } from 'react';
import { 
  BookOpenIcon, 
  AcademicCapIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationTriangleIcon,
  UserGroupIcon,
  ChartBarIcon,
  PlusIcon,
  CalendarIcon,
  StarIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

interface Student {
  id: string;
  studentId: string;
  user: {
    firstName: string;
    lastName: string;
  };
  currentClass: string;
  section: string;
  quranLevel: string;
  currentSurah: string;
  currentAyah: number;
  memorizationProgress: number;
}

interface IslamicStudyRecord {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  date: string;
  type: 'sabaq' | 'sabqi' | 'manzil' | 'word_of_day';
  surah: string;
  fromAyah: number;
  toAyah: number;
  totalAyahs: number;
  completedAyahs: number;
  progress: number;
  quality: 'excellent' | 'good' | 'average' | 'needs_improvement';
  teacherRemarks?: string;
  parentRemarks?: string;
  wordOfDay?: {
    arabic: string;
    english: string;
    meaning: string;
  };
}

const QURAN_LEVELS = ['beginner', 'intermediate', 'advanced'];
const SURAHS = [
  'Al-Fatiha', 'Al-Baqarah', 'Ali Imran', 'An-Nisa', 'Al-Maidah',
  'Al-Anam', 'Al-Araf', 'Al-Anfal', 'At-Tawbah', 'Yunus',
  'Hud', 'Yusuf', 'Ar-Rad', 'Ibrahim', 'Al-Hijr',
  'An-Nahl', 'Al-Isra', 'Al-Kahf', 'Maryam', 'Taha'
];

const QUALITY_LEVELS = {
  excellent: { label: 'Excellent', color: 'bg-green-100 text-green-800', icon: StarIcon },
  good: { label: 'Good', color: 'bg-blue-100 text-blue-800', icon: CheckCircleIcon },
  average: { label: 'Average', color: 'bg-yellow-100 text-yellow-800', icon: ClockIcon },
  needs_improvement: { label: 'Needs Improvement', color: 'bg-red-100 text-red-800', icon: ExclamationTriangleIcon }
};

export const IslamicStudiesPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [islamicRecords, setIslamicRecords] = useState<IslamicStudyRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedType, setSelectedType] = useState<'sabaq' | 'sabqi' | 'manzil' | 'word_of_day'>('sabaq');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddRecord, setShowAddRecord] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');

  // Load students and islamic studies records
  useEffect(() => {
    const loadData = () => {
      try {
        // Load students
        const storedStudents = localStorage.getItem('students');
        if (storedStudents) {
          const parsedStudents = JSON.parse(storedStudents);
          setStudents(parsedStudents);
          if (parsedStudents.length > 0 && !selectedClass) {
            setSelectedClass(parsedStudents[0].currentClass);
          }
        }

        // Load islamic studies records
        const storedIslamic = localStorage.getItem('islamicStudies');
        if (storedIslamic) {
          setIslamicRecords(JSON.parse(storedIslamic));
        }
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedClass]);

  const classes = Array.from(new Set(students.map(s => s.currentClass)));

  const getRecordsForDate = (date: string, className?: string, type?: string) => {
    return islamicRecords.filter(record => {
      const recordDate = new Date(record.date).toISOString().split('T')[0];
      return recordDate === date && 
             (!className || record.className === className) &&
             (!type || record.type === type);
    });
  };

  const addIslamicRecord = (recordData: Partial<IslamicStudyRecord>) => {
    const student = students.find(s => s.id === selectedStudent);
    if (!student) return;

    const newRecord: IslamicStudyRecord = {
      id: Date.now().toString(),
      studentId: selectedStudent,
      studentName: `${student.user.firstName} ${student.user.lastName}`,
      className: student.currentClass,
      date: selectedDate,
      type: selectedType,
      surah: recordData.surah || '',
      fromAyah: recordData.fromAyah || 1,
      toAyah: recordData.toAyah || 1,
      totalAyahs: (recordData.toAyah || 1) - (recordData.fromAyah || 1) + 1,
      completedAyahs: recordData.completedAyahs || 0,
      progress: recordData.progress || 0,
      quality: recordData.quality || 'average',
      teacherRemarks: recordData.teacherRemarks,
      parentRemarks: recordData.parentRemarks,
      wordOfDay: recordData.wordOfDay
    };

    const updatedRecords = [...islamicRecords, newRecord];
    setIslamicRecords(updatedRecords);
    localStorage.setItem('islamicStudies', JSON.stringify(updatedRecords));
    
    toast.success(`${student.user.firstName} - ${selectedType.toUpperCase()} record added`);
    setShowAddRecord(false);
  };

  const getQualityBadge = (quality: string) => {
    const qualityData = QUALITY_LEVELS[quality as keyof typeof QUALITY_LEVELS];
    const Icon = qualityData.icon;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${qualityData.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {qualityData.label}
      </span>
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'sabaq':
        return <BookOpenIcon className="h-5 w-5 text-blue-500" />;
      case 'sabqi':
        return <ClockIcon className="h-5 w-5 text-green-500" />;
      case 'manzil':
        return <TrophyIcon className="h-5 w-5 text-purple-500" />;
      case 'word_of_day':
        return <StarIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <AcademicCapIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const filteredStudents = students.filter(student => 
    !selectedClass || student.currentClass === selectedClass
  );

  const todayRecords = getRecordsForDate(selectedDate, selectedClass, selectedType);
  const stats = {
    total: filteredStudents.length,
    sabaq: getRecordsForDate(selectedDate, selectedClass, 'sabaq').length,
    sabqi: getRecordsForDate(selectedDate, selectedClass, 'sabqi').length,
    manzil: getRecordsForDate(selectedDate, selectedClass, 'manzil').length,
    wordOfDay: getRecordsForDate(selectedDate, selectedClass, 'word_of_day').length,
    averageProgress: todayRecords.length > 0 ? Math.round(todayRecords.reduce((sum, r) => sum + r.progress, 0) / todayRecords.length) : 0
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
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Islamic Studies Tracking
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Track Sabaq, Sabqi, Manzil, and Word of the Day
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            onClick={() => setShowAddRecord(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Record
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
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
              <option value="">All Classes</option>
              {classes.map(cls => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              <option value="sabaq">Sabaq (New Lesson)</option>
              <option value="sabqi">Sabqi (Revision)</option>
              <option value="manzil">Manzil (Long-term)</option>
              <option value="word_of_day">Word of the Day</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Student
            </label>
            <select
              value={selectedStudent}
              onChange={(e) => setSelectedStudent(e.target.value)}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              <option value="">All Students</option>
              {filteredStudents.map(student => (
                <option key={student.id} value={student.id}>
                  {student.user.firstName} {student.user.lastName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Students</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpenIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Sabaq</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.sabaq}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Sabqi</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.sabqi}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrophyIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Manzil</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.manzil}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Avg Progress</dt>
                  <dd className="text-lg font-medium text-gray-900">{stats.averageProgress}%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Record Modal */}
      {showAddRecord && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Add {selectedType.toUpperCase()} Record</h3>
                <button
                  onClick={() => setShowAddRecord(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                addIslamicRecord({
                  surah: formData.get('surah') as string,
                  fromAyah: parseInt(formData.get('fromAyah') as string),
                  toAyah: parseInt(formData.get('toAyah') as string),
                  completedAyahs: parseInt(formData.get('completedAyahs') as string),
                  progress: parseInt(formData.get('progress') as string),
                  quality: formData.get('quality') as string,
                  teacherRemarks: formData.get('teacherRemarks') as string,
                  parentRemarks: formData.get('parentRemarks') as string
                });
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Student *
                  </label>
                  <select
                    name="studentId"
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    required
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  >
                    <option value="">Select Student</option>
                    {filteredStudents.map(student => (
                      <option key={student.id} value={student.id}>
                        {student.user.firstName} {student.user.lastName} - {student.currentClass}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedType !== 'word_of_day' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Surah *
                      </label>
                      <select
                        name="surah"
                        required
                        className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                      >
                        <option value="">Select Surah</option>
                        {SURAHS.map(surah => (
                          <option key={surah} value={surah}>{surah}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          From Ayah *
                        </label>
                        <input
                          type="number"
                          name="fromAyah"
                          min="1"
                          required
                          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          To Ayah *
                        </label>
                        <input
                          type="number"
                          name="toAyah"
                          min="1"
                          required
                          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Completed Ayahs *
                        </label>
                        <input
                          type="number"
                          name="completedAyahs"
                          min="0"
                          required
                          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Progress %
                        </label>
                        <input
                          type="number"
                          name="progress"
                          min="0"
                          max="100"
                          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quality *
                  </label>
                  <select
                    name="quality"
                    required
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  >
                    <option value="">Select Quality</option>
                    {Object.entries(QUALITY_LEVELS).map(([key, quality]) => (
                      <option key={key} value={key}>{quality.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teacher Remarks
                  </label>
                  <textarea
                    name="teacherRemarks"
                    rows={2}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Parent Remarks
                  </label>
                  <textarea
                    name="parentRemarks"
                    rows={2}
                    className="w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddRecord(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Add Record
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Records Table */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            {selectedType.toUpperCase()} Records - {new Date(selectedDate).toLocaleDateString()}
          </h3>
          
          {todayRecords.length === 0 ? (
            <div className="text-center py-8">
              <AcademicCapIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No records found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Add {selectedType} records for {new Date(selectedDate).toLocaleDateString()} to see them here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Surah & Ayahs
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quality
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Remarks
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {todayRecords.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {record.studentName}
                        </div>
                        <div className="text-sm text-gray-500">{record.className}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getTypeIcon(record.type)}
                          <span className="ml-2 text-sm text-gray-900">
                            {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{record.surah}</div>
                        <div className="text-sm text-gray-500">
                          Ayahs {record.fromAyah}-{record.toAyah}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {record.completedAyahs}/{record.totalAyahs}
                        </div>
                        <div className="text-sm text-gray-500">
                          {record.progress}%
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getQualityBadge(record.quality)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {record.teacherRemarks || '-'}
                        </div>
                        {record.parentRemarks && (
                          <div className="text-sm text-gray-500">
                            Parent: {record.parentRemarks}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};