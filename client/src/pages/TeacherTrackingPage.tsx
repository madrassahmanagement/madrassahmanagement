import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

export const TeacherTrackingPage = () => {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState([
    {
      id: 1,
      name: 'Ahmed Khan',
      subject: 'Quran Studies',
      class: 'Class 5A',
      comingTime: '08:00 AM',
      leavingTime: '02:00 PM',
      isPresent: true,
      discipline: 4.5,
      attitude: 4.2,
      focus: 4.8,
      lastUpdate: '2024-01-20'
    },
    {
      id: 2,
      name: 'Fatima Ali',
      subject: 'Arabic Language',
      class: 'Class 3B',
      comingTime: '08:15 AM',
      leavingTime: '01:45 PM',
      isPresent: true,
      discipline: 4.8,
      attitude: 4.5,
      focus: 4.6,
      lastUpdate: '2024-01-20'
    },
    {
      id: 3,
      name: 'Muhammad Hassan',
      subject: 'Islamic Studies',
      class: 'Class 4C',
      comingTime: '08:30 AM',
      leavingTime: '02:15 PM',
      isPresent: false,
      discipline: 4.0,
      attitude: 3.8,
      focus: 4.2,
      lastUpdate: '2024-01-19'
    }
  ]);

  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [showDisciplineModal, setShowDisciplineModal] = useState(false);

  const [attendanceForm, setAttendanceForm] = useState({
    comingTime: '',
    leavingTime: '',
    isPresent: true,
    leaveReason: ''
  });

  const [disciplineForm, setDisciplineForm] = useState({
    discipline: 5,
    attitude: 5,
    focus: 5,
    description: ''
  });

  const handleAttendanceSubmit = (teacherId: number) => {
    // Update teacher attendance
    setTeachers(prev => prev.map(teacher => 
      teacher.id === teacherId 
        ? { 
            ...teacher, 
            ...attendanceForm,
            lastUpdate: new Date().toISOString().split('T')[0]
          }
        : teacher
    ));
    setShowAttendanceModal(false);
    setAttendanceForm({ comingTime: '', leavingTime: '', isPresent: true, leaveReason: '' });
  };

  const handleDisciplineSubmit = (teacherId: number) => {
    // Update teacher discipline scores
    setTeachers(prev => prev.map(teacher => 
      teacher.id === teacherId 
        ? { 
            ...teacher, 
            discipline: disciplineForm.discipline,
            attitude: disciplineForm.attitude,
            focus: disciplineForm.focus,
            lastUpdate: new Date().toISOString().split('T')[0]
          }
        : teacher
    ));
    setShowDisciplineModal(false);
    setDisciplineForm({ discipline: 5, attitude: 5, focus: 5, description: '' });
  };

  const getStatusColor = (isPresent: boolean) => {
    return isPresent ? 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200' : 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200';
  };

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return 'text-green-600';
    if (score >= 4.0) return 'text-blue-600';
    if (score >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Teacher Tracking 👨‍🏫
        </h1>
        <p className="text-indigo-100">
          Monitor teacher attendance, discipline, and performance
        </p>
      </div>

      {/* Teacher Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total Teachers</h3>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{teachers.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Present Today</h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {teachers.filter(t => t.isPresent).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
              <span className="text-2xl">⭐</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Avg Discipline</h3>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {(teachers.reduce((sum, t) => sum + t.discipline, 0) / teachers.length).toFixed(1)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <span className="text-2xl">🎯</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Avg Focus</h3>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {(teachers.reduce((sum, t) => sum + t.focus, 0) / teachers.length).toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Teachers List */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Teacher Management</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Teacher
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Class
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Attendance
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Discipline
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Attitude
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Focus
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {teachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center">
                          <span className="text-sm font-medium text-primary-600 dark:text-primary-300">
                            {teacher.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {teacher.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {teacher.subject}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {teacher.class}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(teacher.isPresent)}`}>
                        {teacher.isPresent ? 'Present' : 'Absent'}
                      </span>
                      {teacher.isPresent && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {teacher.comingTime} - {teacher.leavingTime}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <span className={`font-medium ${getScoreColor(teacher.discipline)}`}>
                      {teacher.discipline}/5
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <span className={`font-medium ${getScoreColor(teacher.attitude)}`}>
                      {teacher.attitude}/5
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <span className={`font-medium ${getScoreColor(teacher.focus)}`}>
                      {teacher.focus}/5
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedTeacher(teacher);
                          setAttendanceForm({
                            comingTime: teacher.comingTime,
                            leavingTime: teacher.leavingTime,
                            isPresent: teacher.isPresent,
                            leaveReason: ''
                          });
                          setShowAttendanceModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Attendance
                      </button>
                      <button
                        onClick={() => {
                          setSelectedTeacher(teacher);
                          setDisciplineForm({
                            discipline: teacher.discipline,
                            attitude: teacher.attitude,
                            focus: teacher.focus,
                            description: ''
                          });
                          setShowDisciplineModal(true);
                        }}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                      >
                        Discipline
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attendance Modal */}
      {showAttendanceModal && selectedTeacher && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Update Attendance - {selectedTeacher.name}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Present Today
                  </label>
                  <select
                    value={attendanceForm.isPresent ? 'true' : 'false'}
                    onChange={(e) => setAttendanceForm(prev => ({ ...prev, isPresent: e.target.value === 'true' }))}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="true">Present</option>
                    <option value="false">Absent</option>
                  </select>
                </div>

                {attendanceForm.isPresent ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Coming Time
                      </label>
                      <input
                        type="time"
                        value={attendanceForm.comingTime}
                        onChange={(e) => setAttendanceForm(prev => ({ ...prev, comingTime: e.target.value }))}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Leaving Time
                      </label>
                      <input
                        type="time"
                        value={attendanceForm.leavingTime}
                        onChange={(e) => setAttendanceForm(prev => ({ ...prev, leavingTime: e.target.value }))}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                  </>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Leave Reason
                    </label>
                    <textarea
                      value={attendanceForm.leaveReason}
                      onChange={(e) => setAttendanceForm(prev => ({ ...prev, leaveReason: e.target.value }))}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      placeholder="Reason for absence..."
                    />
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowAttendanceModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleAttendanceSubmit(selectedTeacher.id)}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Discipline Modal */}
      {showDisciplineModal && selectedTeacher && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Update Discipline - {selectedTeacher.name}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Discipline (5/5)
                  </label>
                  <select
                    value={disciplineForm.discipline}
                    onChange={(e) => setDisciplineForm(prev => ({ ...prev, discipline: parseFloat(e.target.value) }))}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value={5}>5 - Excellent</option>
                    <option value={4.5}>4.5 - Very Good</option>
                    <option value={4}>4 - Good</option>
                    <option value={3.5}>3.5 - Satisfactory</option>
                    <option value={3}>3 - Needs Improvement</option>
                    <option value={2.5}>2.5 - Poor</option>
                    <option value={2}>2 - Very Poor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Attitude with Students (5/5)
                  </label>
                  <select
                    value={disciplineForm.attitude}
                    onChange={(e) => setDisciplineForm(prev => ({ ...prev, attitude: parseFloat(e.target.value) }))}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value={5}>5 - Excellent</option>
                    <option value={4.5}>4.5 - Very Good</option>
                    <option value={4}>4 - Good</option>
                    <option value={3.5}>3.5 - Satisfactory</option>
                    <option value={3}>3 - Needs Improvement</option>
                    <option value={2.5}>2.5 - Poor</option>
                    <option value={2}>2 - Very Poor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Focus with Students (5/5)
                  </label>
                  <select
                    value={disciplineForm.focus}
                    onChange={(e) => setDisciplineForm(prev => ({ ...prev, focus: parseFloat(e.target.value) }))}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value={5}>5 - Excellent</option>
                    <option value={4.5}>4.5 - Very Good</option>
                    <option value={4}>4 - Good</option>
                    <option value={3.5}>3.5 - Satisfactory</option>
                    <option value={3}>3 - Needs Improvement</option>
                    <option value={2.5}>2.5 - Poor</option>
                    <option value={2}>2 - Very Poor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    value={disciplineForm.description}
                    onChange={(e) => setDisciplineForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Additional comments about teacher's performance..."
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowDisciplineModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDisciplineSubmit(selectedTeacher.id)}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
                  >
                    Update
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
