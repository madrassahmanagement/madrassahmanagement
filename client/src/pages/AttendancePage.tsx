import { useState, useEffect } from 'react';
import { 
  CalendarIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationTriangleIcon,
  UserGroupIcon,
  ClipboardDocumentCheckIcon,
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

interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  className: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  timeIn?: string;
  timeOut?: string;
  remarks?: string;
}

export const AttendancePage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showMarkAttendance, setShowMarkAttendance] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number>(new Date().getDate());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1); // 1-12
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  // Load students and attendance records
  useEffect(() => {
    const loadData = () => {
      try {
        // Load students (seed demo data if none exist)
        let parsedStudents: Student[] = [];
        const storedStudents = localStorage.getItem('students');
        if (storedStudents) {
          try {
            parsedStudents = JSON.parse(storedStudents);
          } catch (e) {
            parsedStudents = [];
          }
        }

        if (!parsedStudents || parsedStudents.length === 0) {
          const demoStudents: Student[] = [
            { id: 's1', studentId: '2024-001', user: { firstName: 'Ahmed', lastName: 'Ali' }, currentClass: 'Class 1', section: 'A' },
            { id: 's2', studentId: '2024-002', user: { firstName: 'Aisha', lastName: 'Khan' }, currentClass: 'Class 1', section: 'A' },
            { id: 's3', studentId: '2024-003', user: { firstName: 'Bilal', lastName: 'Ahmed' }, currentClass: 'Class 1', section: 'A' },
            { id: 's4', studentId: '2024-004', user: { firstName: 'Fatima', lastName: 'Noor' }, currentClass: 'Class 1', section: 'B' },
            { id: 's5', studentId: '2024-005', user: { firstName: 'Hamza', lastName: 'Iqbal' }, currentClass: 'Class 1', section: 'B' },
            { id: 's6', studentId: '2024-006', user: { firstName: 'Sara', lastName: 'Malik' }, currentClass: 'Class 2', section: 'A' },
            { id: 's7', studentId: '2024-007', user: { firstName: 'Umar', lastName: 'Farooq' }, currentClass: 'Class 2', section: 'A' },
            { id: 's8', studentId: '2024-008', user: { firstName: 'Zainab', lastName: 'Hassan' }, currentClass: 'Class 2', section: 'A' },
            { id: 's9', studentId: '2024-009', user: { firstName: 'Yousuf', lastName: 'Raza' }, currentClass: 'Class 2', section: 'B' },
            { id: 's10', studentId: '2024-010', user: { firstName: 'Maryam', lastName: 'Javed' }, currentClass: 'Class 2', section: 'B' },
          ];
          localStorage.setItem('students', JSON.stringify(demoStudents));
          parsedStudents = demoStudents;
        }

        setStudents(parsedStudents);
        if (parsedStudents.length > 0 && !selectedClass) {
          setSelectedClass(parsedStudents[0].currentClass);
        }

        // Load attendance records
        const storedAttendance = localStorage.getItem('attendance');
        if (storedAttendance) {
          setAttendanceRecords(JSON.parse(storedAttendance));
        }
        setIsDirty(false);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [selectedClass]);

  // Helpers for day/month/year selector
  const getDaysInMonth = (year: number, month1to12: number) => new Date(year, month1to12, 0).getDate();
  const monthNames = [
    'January','February','March','April','May','June','July','August','September','October','November','December'
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
  const daysInSelected = getDaysInMonth(selectedYear, selectedMonth);

  // Keep day within valid range when month/year changes and sync ISO date
  useEffect(() => {
    const safeDay = Math.min(selectedDay, daysInSelected);
    if (safeDay !== selectedDay) {
      setSelectedDay(safeDay);
    }
    const mm = String(selectedMonth).padStart(2, '0');
    const dd = String(safeDay).padStart(2, '0');
    const iso = `${selectedYear}-${mm}-${dd}`;
    if (iso !== selectedDate) {
      setSelectedDate(iso);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear, selectedMonth, selectedDay]);

  // When selectedDate changes (e.g., native input), sync day/month/year
  useEffect(() => {
    const d = new Date(selectedDate);
    if (!isNaN(d.getTime())) {
      const y = d.getFullYear();
      const m = d.getMonth() + 1;
      const dy = d.getDate();
      if (y !== selectedYear) setSelectedYear(y);
      if (m !== selectedMonth) setSelectedMonth(m);
      if (dy !== selectedDay) setSelectedDay(dy);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const classes = Array.from(new Set(students.map(s => s.currentClass)));

  const getAttendanceForDate = (date: string, className?: string) => {
    return attendanceRecords.filter(record => {
      const recordDate = new Date(record.date).toISOString().split('T')[0];
      return recordDate === date && (!className || record.className === className);
    });
  };

  const markAttendance = (studentId: string, status: 'present' | 'absent' | 'late' | 'excused', remarks?: string) => {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const existingRecord = attendanceRecords.find(
      record => record.studentId === studentId && 
      new Date(record.date).toISOString().split('T')[0] === selectedDate
    );

    const newRecord: AttendanceRecord = {
      id: existingRecord?.id || Date.now().toString(),
      studentId,
      studentName: `${student.user.firstName} ${student.user.lastName}`,
      className: student.currentClass,
      date: selectedDate,
      status,
      timeIn: status === 'present' || status === 'late' ? new Date().toTimeString().split(' ')[0] : undefined,
      remarks
    };

    let updatedRecords;
    if (existingRecord) {
      updatedRecords = attendanceRecords.map(record => 
        record.id === existingRecord.id ? newRecord : record
      );
    } else {
      updatedRecords = [...attendanceRecords, newRecord];
    }

    setAttendanceRecords(updatedRecords);
    setIsDirty(true);
    
    const statusText = status.charAt(0).toUpperCase() + status.slice(1);
    toast.success(`${student.user.firstName} marked as ${statusText}`);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'absent':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'late':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'excused':
        return <ExclamationTriangleIcon className="h-5 w-5 text-blue-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status) {
      case 'present':
        return <span className={`${baseClasses} bg-green-100 text-green-800`}>Present</span>;
      case 'absent':
        return <span className={`${baseClasses} bg-red-100 text-red-800`}>Absent</span>;
      case 'late':
        return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Late</span>;
      case 'excused':
        return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>Excused</span>;
      default:
        return <span className={`${baseClasses} bg-gray-100 text-gray-800`}>Not Marked</span>;
    }
  };

  const filteredStudents = students.filter(student => 
    !selectedClass || student.currentClass === selectedClass
  );

  const todayAttendance = getAttendanceForDate(selectedDate, selectedClass);
  const attendanceStats = {
    total: filteredStudents.length,
    present: todayAttendance.filter(r => r.status === 'present').length,
    absent: todayAttendance.filter(r => r.status === 'absent').length,
    late: todayAttendance.filter(r => r.status === 'late').length,
    excused: todayAttendance.filter(r => r.status === 'excused').length,
    marked: todayAttendance.length,
    unmarked: filteredStudents.length - todayAttendance.length
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
            Attendance Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Track and manage student attendance
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <button
            onClick={() => setShowMarkAttendance(!showMarkAttendance)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Mark Attendance
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              Set by Day / Month / Year
            </label>
            <div className="flex gap-2">
              <select
                value={selectedDay}
                onChange={(e) => setSelectedDay(Number(e.target.value))}
                className="block w-1/3 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                {Array.from({ length: daysInSelected }, (_, i) => i + 1).map(d => (
                  <option key={d} value={d}>{String(d).padStart(2, '0')}</option>
                ))}
              </select>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="block w-1/3 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                {monthNames.map((m, idx) => (
                  <option key={m} value={idx + 1}>{m}</option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="block w-1/3 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                {years.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserGroupIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total</dt>
                  <dd className="text-lg font-medium text-gray-900">{attendanceStats.total}</dd>
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
                  <dt className="text-sm font-medium text-gray-500 truncate">Present</dt>
                  <dd className="text-lg font-medium text-gray-900">{attendanceStats.present}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircleIcon className="h-8 w-8 text-red-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Absent</dt>
                  <dd className="text-lg font-medium text-gray-900">{attendanceStats.absent}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Late</dt>
                  <dd className="text-lg font-medium text-gray-900">{attendanceStats.late}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ExclamationTriangleIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Excused</dt>
                  <dd className="text-lg font-medium text-gray-900">{attendanceStats.excused}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClipboardDocumentCheckIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Marked</dt>
                  <dd className="text-lg font-medium text-gray-900">{attendanceStats.marked}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      {showMarkAttendance && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            {/* Bulk Actions */}
            <div className="flex flex-wrap items-center gap-2 mb-4 justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-600 mr-2">Bulk mark:</span>
                <button
                  onClick={() => filteredStudents.forEach(s => markAttendance(s.id, 'present'))}
                  className="px-3 py-1.5 rounded-md text-sm font-medium bg-green-50 text-green-700 hover:bg-green-100"
                >
                  Mark All Present
                </button>
                <button
                  onClick={() => filteredStudents.forEach(s => markAttendance(s.id, 'absent'))}
                  className="px-3 py-1.5 rounded-md text-sm font-medium bg-red-50 text-red-700 hover:bg-red-100"
                >
                  Mark All Absent
                </button>
                <button
                  onClick={() => filteredStudents.forEach(s => markAttendance(s.id, 'late'))}
                  className="px-3 py-1.5 rounded-md text-sm font-medium bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                >
                  Mark All Late
                </button>
                <button
                  onClick={() => {
                    const remaining = attendanceRecords.filter(r => new Date(r.date).toISOString().split('T')[0] !== selectedDate || (selectedClass && r.className !== selectedClass));
                    setAttendanceRecords(remaining);
                    setIsDirty(true);
                    toast.success('Cleared today\'s marks for this class');
                  }}
                  className="px-3 py-1.5 rounded-md text-sm font-medium bg-gray-50 text-gray-700 hover:bg-gray-100"
                >
                  Clear Today
                </button>
              </div>
              <div className="flex items-center gap-2">
                {isDirty && (
                  <span className="text-xs text-amber-600">Unsaved changes</span>
                )}
                <button
                  onClick={() => {
                    localStorage.setItem('attendance', JSON.stringify(attendanceRecords));
                    setIsDirty(false);
                    const prettyDate = new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit' });
                    toast.success(`Attendance saved for ${prettyDate}${selectedClass ? ` • ${selectedClass}` : ''}`);
                  }}
                  disabled={!isDirty}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium text-white ${isDirty ? 'bg-primary-600 hover:bg-primary-700' : 'bg-gray-300 cursor-not-allowed'}`}
                >
                  Save Attendance
                </button>
              </div>
            </div>
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Mark Attendance - {new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit' })}
            </h3>
            
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
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.map((student) => {
                    const attendance = todayAttendance.find(a => a.studentId === student.id);
                    return (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {student.user.firstName} {student.user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {student.studentId}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{student.currentClass}</div>
                          <div className="text-sm text-gray-500">Section {student.section}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {attendance ? getStatusBadge(attendance.status) : getStatusBadge('unmarked')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {attendance?.timeIn || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => markAttendance(student.id, 'present')}
                              className="inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-medium bg-green-50 text-green-700 hover:bg-green-100"
                            >
                              <CheckCircleIcon className="h-4 w-4 mr-1" /> Present
                            </button>
                            <button
                              onClick={() => markAttendance(student.id, 'absent')}
                              className="inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100"
                            >
                              <XCircleIcon className="h-4 w-4 mr-1" /> Absent
                            </button>
                            <button
                              onClick={() => markAttendance(student.id, 'late')}
                              className="inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-medium bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                            >
                              <ClockIcon className="h-4 w-4 mr-1" /> Late
                            </button>
                            <button
                              onClick={() => markAttendance(student.id, 'excused')}
                              className="inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100"
                            >
                              <ExclamationTriangleIcon className="h-4 w-4 mr-1" /> Excused
                            </button>
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

      {/* Recent Attendance Records */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Recent Attendance Records
          </h3>
          
          {todayAttendance.length === 0 ? (
            <div className="text-center py-8">
              <ClipboardDocumentCheckIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No attendance records</h3>
              <p className="mt-1 text-sm text-gray-500">
                Mark attendance for {new Date(selectedDate).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: '2-digit' })} to see records.
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
                      Class
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time In
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Remarks
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {todayAttendance.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {record.studentName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{record.className}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(record.status)}
                          <span className="ml-2 text-sm text-gray-900">
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.timeIn || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {record.remarks || '-'}
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