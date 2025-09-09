import { useState, useEffect } from 'react';
import { 
  BookOpenIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationTriangleIcon,
  SunIcon,
  MoonIcon,
  CalendarIcon,
  UserGroupIcon,
  ChartBarIcon,
  PlusIcon
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
}

interface NamazRecord {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  date: string;
  prayers: {
    fajr: { prayed: boolean; time?: string; location: 'madrassah' | 'home' | 'missed' };
    dhuhr: { prayed: boolean; time?: string; location: 'madrassah' | 'home' | 'missed' };
    asr: { prayed: boolean; time?: string; location: 'madrassah' | 'home' | 'missed' };
    maghrib: { prayed: boolean; time?: string; location: 'madrassah' | 'home' | 'missed' };
    isha: { prayed: boolean; time?: string; location: 'madrassah' | 'home' | 'missed' };
  };
  totalPrayers: number;
  prayedCount: number;
  percentage: number;
  remarks?: string;
}

const PRAYER_TIMES = {
  fajr: { name: 'Fajr', time: '05:30', icon: SunIcon, color: 'text-orange-500' },
  dhuhr: { name: 'Dhuhr', time: '12:30', icon: SunIcon, color: 'text-yellow-500' },
  asr: { name: 'Asr', time: '15:45', icon: SunIcon, color: 'text-orange-600' },
  maghrib: { name: 'Maghrib', time: '18:15', icon: MoonIcon, color: 'text-purple-500' },
  isha: { name: 'Isha', time: '19:45', icon: MoonIcon, color: 'text-indigo-500' }
};

export const NamazPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [namazRecords, setNamazRecords] = useState<NamazRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showMarkNamaz, setShowMarkNamaz] = useState(false);

  // Load students and namaz records
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

        // Load namaz records
        const storedNamaz = localStorage.getItem('namaz');
        if (storedNamaz) {
          setNamazRecords(JSON.parse(storedNamaz));
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

  const getNamazForDate = (date: string, className?: string, studentId?: string) => {
    return namazRecords.filter(record => {
      const recordDate = new Date(record.date).toISOString().split('T')[0];
      return recordDate === date && 
             (!className || record.className === className) &&
             (!studentId || record.studentId === studentId);
    });
  };

  const markPrayer = (studentId: string, prayer: keyof NamazRecord['prayers'], location: 'madrassah' | 'home' | 'missed') => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const existingRecord = namazRecords.find(
      record => record.studentId === studentId && 
      new Date(record.date).toISOString().split('T')[0] === selectedDate
    );

    const currentTime = new Date().toTimeString().split(' ')[0];
    const prayed = location !== 'missed';
    const time = prayed ? currentTime : undefined;

    let prayers;
    if (existingRecord) {
      prayers = {
        ...existingRecord.prayers,
        [prayer]: { prayed, time, location: location as 'madrassah' | 'home' | 'missed' }
      };
    } else {
      prayers = {
        fajr: { prayed: false, location: 'missed' as const },
        dhuhr: { prayed: false, location: 'missed' as const },
        asr: { prayed: false, location: 'missed' as const },
        maghrib: { prayed: false, location: 'missed' as const },
        isha: { prayed: false, location: 'missed' as const },
        [prayer]: { prayed, time, location: location as 'madrassah' | 'home' | 'missed' }
      };
    }

    const totalPrayers = 5;
    const prayedCount = Object.values(prayers).filter(p => p.prayed).length;
    const percentage = Math.round((prayedCount / totalPrayers) * 100);

    const newRecord: NamazRecord = {
      id: existingRecord?.id || Date.now().toString(),
      studentId,
      studentName: `${student.user.firstName} ${student.user.lastName}`,
      className: student.currentClass,
      date: selectedDate,
      prayers,
      totalPrayers,
      prayedCount,
      percentage
    };

    let updatedRecords;
    if (existingRecord) {
      updatedRecords = namazRecords.map(record => 
        record.id === existingRecord.id ? newRecord : record
      );
    } else {
      updatedRecords = [...namazRecords, newRecord];
    }

    setNamazRecords(updatedRecords);
    localStorage.setItem('namaz', JSON.stringify(updatedRecords));
    
    const locationText = location === 'madrassah' ? 'at Madrassah' : location === 'home' ? 'at Home' : 'Missed';
    toast.success(`${student.user.firstName} - ${PRAYER_TIMES[prayer].name} marked as ${locationText}`);
  };

  const getPrayerIcon = (prayer: keyof NamazRecord['prayers'], record?: NamazRecord) => {
    if (!record) return <ClockIcon className="h-5 w-5 text-gray-400" />;
    
    const prayerData = record.prayers[prayer];
    if (prayerData.prayed) {
      return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
    } else if (prayerData.location === 'missed') {
      return <XCircleIcon className="h-5 w-5 text-red-500" />;
    } else {
      return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getPrayerBadge = (prayer: keyof NamazRecord['prayers'], record?: NamazRecord) => {
    if (!record) {
      return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Not Marked</span>;
    }
    
    const prayerData = record.prayers[prayer];
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    
    if (prayerData.prayed) {
      const locationColor = prayerData.location === 'madrassah' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800';
      return <span className={`${baseClasses} ${locationColor}`}>
        {prayerData.location === 'madrassah' ? 'Madrassah' : 'Home'}
      </span>;
    } else {
      return <span className={`${baseClasses} bg-red-100 text-red-800`}>Missed</span>;
    }
  };

  const filteredStudents = students.filter(student => 
    (!selectedClass || student.currentClass === selectedClass) &&
    (!selectedStudent || student.id === selectedStudent)
  );

  const todayNamaz = getNamazForDate(selectedDate, selectedClass, selectedStudent);
  const namazStats = {
    total: filteredStudents.length,
    completed: todayNamaz.filter(r => r.percentage === 100).length,
    partial: todayNamaz.filter(r => r.percentage > 0 && r.percentage < 100).length,
    missed: todayNamaz.filter(r => r.percentage === 0).length,
    average: todayNamaz.length > 0 ? Math.round(todayNamaz.reduce((sum, r) => sum + r.percentage, 0) / todayNamaz.length) : 0
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
            Namaz Tracking
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Track and manage student prayer attendance
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            onClick={() => setShowMarkNamaz(!showMarkNamaz)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Mark Namaz
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
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Students</dt>
                  <dd className="text-lg font-medium text-gray-900">{namazStats.total}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Completed All</dt>
                  <dd className="text-lg font-medium text-gray-900">{namazStats.completed}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Partial</dt>
                  <dd className="text-lg font-medium text-gray-900">{namazStats.partial}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ChartBarIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Average %</dt>
                  <dd className="text-lg font-medium text-gray-900">{namazStats.average}%</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Prayer Times */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Prayer Times - {new Date(selectedDate).toLocaleDateString()}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(PRAYER_TIMES).map(([key, prayer]) => {
              const Icon = prayer.icon;
              return (
                <div key={key} className="text-center p-4 bg-gray-50 rounded-lg">
                  <Icon className={`h-8 w-8 mx-auto mb-2 ${prayer.color}`} />
                  <h4 className="font-medium text-gray-900">{prayer.name}</h4>
                  <p className="text-sm text-gray-500">{prayer.time}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Namaz Tracking Table */}
      {showMarkNamaz && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Mark Namaz - {new Date(selectedDate).toLocaleDateString()}
            </h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    {Object.entries(PRAYER_TIMES).map(([key, prayer]) => (
                      <th key={key} className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {prayer.name}
                      </th>
                    ))}
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((student) => {
                    const namazRecord = todayNamaz.find(n => n.studentId === student.id);
                    return (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {student.user.firstName} {student.user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {student.studentId} • {student.currentClass}
                          </div>
                        </td>
                        {Object.keys(PRAYER_TIMES).map((prayer) => (
                          <td key={prayer} className="px-3 py-4 whitespace-nowrap text-center">
                            {getPrayerBadge(prayer as keyof NamazRecord['prayers'], namazRecord)}
                          </td>
                        ))}
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-sm font-medium text-gray-900">
                            {namazRecord ? `${namazRecord.prayedCount}/5` : '0/5'}
                          </div>
                          <div className="text-xs text-gray-500">
                            {namazRecord ? `${namazRecord.percentage}%` : '0%'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex justify-center space-x-1">
                            {Object.keys(PRAYER_TIMES).map((prayer) => (
                              <div key={prayer} className="flex flex-col space-y-1">
                                <button
                                  onClick={() => markPrayer(student.id, prayer as keyof NamazRecord['prayers'], 'madrassah')}
                                  className="text-green-600 hover:text-green-900 text-xs"
                                  title={`Mark ${PRAYER_TIMES[prayer as keyof typeof PRAYER_TIMES].name} at Madrassah`}
                                >
                                  M
                                </button>
                                <button
                                  onClick={() => markPrayer(student.id, prayer as keyof NamazRecord['prayers'], 'home')}
                                  className="text-blue-600 hover:text-blue-900 text-xs"
                                  title={`Mark ${PRAYER_TIMES[prayer as keyof typeof PRAYER_TIMES].name} at Home`}
                                >
                                  H
                                </button>
                                <button
                                  onClick={() => markPrayer(student.id, prayer as keyof NamazRecord['prayers'], 'missed')}
                                  className="text-red-600 hover:text-red-900 text-xs"
                                  title={`Mark ${PRAYER_TIMES[prayer as keyof typeof PRAYER_TIMES].name} as Missed`}
                                >
                                  X
                                </button>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Recent Namaz Records */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Recent Namaz Records
          </h3>
          
          {todayNamaz.length === 0 ? (
            <div className="text-center py-8">
              <BookOpenIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No namaz records</h3>
              <p className="mt-1 text-sm text-gray-500">
                Mark namaz for {new Date(selectedDate).toLocaleDateString()} to see records.
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
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fajr
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dhuhr
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Asr
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Maghrib
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Isha
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Progress
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {todayNamaz.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {record.studentName}
                        </div>
                        <div className="text-sm text-gray-500">{record.className}</div>
                      </td>
                      {Object.keys(PRAYER_TIMES).map((prayer) => (
                        <td key={prayer} className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center">
                            {getPrayerIcon(prayer as keyof NamazRecord['prayers'], record)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {record.prayers[prayer as keyof NamazRecord['prayers']].time || '-'}
                          </div>
                        </td>
                      ))}
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm font-medium text-gray-900">
                          {record.prayedCount}/5
                        </div>
                        <div className="text-xs text-gray-500">
                          {record.percentage}%
                        </div>
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