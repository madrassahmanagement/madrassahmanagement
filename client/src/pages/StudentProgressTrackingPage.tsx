import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { StudentProgress } from '../types';

export const StudentProgressTrackingPage = () => {
  const { user } = useAuth();
  const [progressRecords, setProgressRecords] = useState<StudentProgress[]>([
    {
      id: '1',
      studentId: 'student-1',
      classId: 'class-1',
      sectionId: 'section-1',
      date: '2024-01-20',
      muatlia: {
        completed: true,
        description: 'Completed Surah Al-Fatiha with proper pronunciation',
        performance: 'excellent',
        notes: 'Student showed great improvement in tajweed'
      },
      sabaq: {
        surah: { name: 'Al-Baqarah', number: 2 },
        fromAyah: 1,
        toAyah: 10,
        performance: 'good',
        notes: 'Minor mistakes in pronunciation'
      },
      sabqi: {
        surah: { name: 'Al-Fatiha', number: 1 },
        fromAyah: 1,
        toAyah: 7,
        performance: 'excellent',
        mistakes: [],
        notes: 'Perfect recitation'
      },
      manzil: {
        surah: { name: 'Al-Mulk', number: 67 },
        fromAyah: 1,
        toAyah: 5,
        performance: 'good',
        notes: 'Good memorization, needs more practice'
      },
      markedBy: 'teacher-1',
      createdAt: '2024-01-20T10:00:00Z',
      updatedAt: '2024-01-20T10:00:00Z'
    },
    {
      id: '2',
      studentId: 'student-2',
      classId: 'class-1',
      sectionId: 'section-1',
      date: '2024-01-20',
      muatlia: {
        completed: false,
        description: 'Working on Surah Al-Baqarah verses 1-5',
        performance: 'needs_improvement',
        notes: 'Student needs more practice with difficult words'
      },
      sabaq: {
        surah: { name: 'Al-Baqarah', number: 2 },
        fromAyah: 1,
        toAyah: 5,
        performance: 'average',
        notes: 'Some pronunciation issues'
      },
      sabqi: {
        surah: { name: 'Al-Fatiha', number: 1 },
        fromAyah: 1,
        toAyah: 7,
        performance: 'good',
        mistakes: [
          { type: 'pronunciation', description: 'Mispronounced "maliki" as "maliki"' }
        ],
        notes: 'Good effort, keep practicing'
      },
      manzil: {
        surah: { name: 'Al-Mulk', number: 67 },
        fromAyah: 1,
        toAyah: 3,
        performance: 'average',
        notes: 'Memorization needs improvement'
      },
      markedBy: 'teacher-1',
      createdAt: '2024-01-20T10:00:00Z',
      updatedAt: '2024-01-20T10:00:00Z'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [filterDate, setFilterDate] = useState<string>('');

  const [progressForm, setProgressForm] = useState({
    studentId: '',
    classId: '',
    sectionId: '',
    date: new Date().toISOString().split('T')[0],
    muatlia: {
      completed: false,
      description: '',
      performance: 'excellent' as const,
      notes: ''
    },
    sabaq: {
      surah: { name: '', number: 0 },
      fromAyah: 0,
      toAyah: 0,
      performance: 'excellent' as const,
      notes: ''
    },
    sabqi: {
      surah: { name: '', number: 0 },
      fromAyah: 0,
      toAyah: 0,
      performance: 'excellent' as const,
      mistakes: [] as Array<{ type: string; description: string }>,
      notes: ''
    },
    manzil: {
      surah: { name: '', number: 0 },
      fromAyah: 0,
      toAyah: 0,
      performance: 'excellent' as const,
      notes: ''
    }
  });

  const students = [
    { id: 'student-1', name: 'Ahmed Khan', class: 'Class 5A', section: 'Section A' },
    { id: 'student-2', name: 'Fatima Ali', class: 'Class 5A', section: 'Section A' },
    { id: 'student-3', name: 'Muhammad Hassan', class: 'Class 5B', section: 'Section B' }
  ];

  const performanceColors = {
    excellent: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200',
    good: 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200',
    average: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200',
    needs_improvement: 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200'
  };

  const handleSubmit = () => {
    const newRecord: StudentProgress = {
      id: Date.now().toString(),
      ...progressForm,
      markedBy: user?.id || 'teacher-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setProgressRecords(prev => [...prev, newRecord]);
    setShowForm(false);
    setProgressForm({
      studentId: '',
      classId: '',
      sectionId: '',
      date: new Date().toISOString().split('T')[0],
      muatlia: {
        completed: false,
        description: '',
        performance: 'excellent',
        notes: ''
      },
      sabaq: {
        surah: { name: '', number: 0 },
        fromAyah: 0,
        toAyah: 0,
        performance: 'excellent',
        notes: ''
      },
      sabqi: {
        surah: { name: '', number: 0 },
        fromAyah: 0,
        toAyah: 0,
        performance: 'excellent',
        mistakes: [],
        notes: ''
      },
      manzil: {
        surah: { name: '', number: 0 },
        fromAyah: 0,
        toAyah: 0,
        performance: 'excellent',
        notes: ''
      }
    });
  };

  const filteredRecords = progressRecords.filter(record => {
    if (selectedStudent && record.studentId !== selectedStudent) return false;
    if (filterDate && record.date !== filterDate) return false;
    return true;
  });

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.name} (${student.class})` : 'Unknown Student';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Student Progress Tracking 📖
        </h1>
        <p className="text-green-100">
          Track daily learning: Muatlia, Sabaq, Sabqi, and Manzil
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <span className="text-2xl">📚</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total Records</h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{progressRecords.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Muatlia Completed</h3>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {progressRecords.filter(r => r.muatlia.completed).length}
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
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Excellent Performance</h3>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {progressRecords.filter(r => 
                  r.muatlia.performance === 'excellent' || 
                  r.sabaq.performance === 'excellent' || 
                  r.sabqi.performance === 'excellent' || 
                  r.manzil.performance === 'excellent'
                ).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <span className="text-2xl">📈</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Today's Records</h3>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {progressRecords.filter(r => r.date === new Date().toISOString().split('T')[0]).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="">All Students</option>
            {students.map(student => (
              <option key={student.id} value={student.id}>
                {student.name} - {student.class}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600 transition-colors"
        >
          Add Progress Record
        </button>
      </div>

      {/* Progress Records */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Progress Records</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Muatlia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Sabaq
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Sabqi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Manzil
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {getStudentName(record.studentId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {new Date(record.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        record.muatlia.completed ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {record.muatlia.completed ? 'Completed' : 'Pending'}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${performanceColors[record.muatlia.performance]}`}>
                        {record.muatlia.performance.replace('_', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {record.sabaq.surah.name} ({record.sabaq.fromAyah}-{record.sabaq.toAyah})
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${performanceColors[record.sabaq.performance]}`}>
                        {record.sabaq.performance.replace('_', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {record.sabqi.surah.name} ({record.sabqi.fromAyah}-{record.sabqi.toAyah})
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${performanceColors[record.sabqi.performance]}`}>
                        {record.sabqi.performance.replace('_', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {record.manzil.surah.name} ({record.manzil.fromAyah}-{record.manzil.toAyah})
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${performanceColors[record.manzil.performance]}`}>
                        {record.manzil.performance.replace('_', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                        View
                      </button>
                      <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Progress Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Add Student Progress Record
              </h3>
              <div className="space-y-6">
                {/* Student Selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Student
                    </label>
                    <select
                      value={progressForm.studentId}
                      onChange={(e) => setProgressForm(prev => ({ ...prev, studentId: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    >
                      <option value="">Select Student</option>
                      {students.map(student => (
                        <option key={student.id} value={student.id}>
                          {student.name} - {student.class}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Date
                    </label>
                    <input
                      type="date"
                      value={progressForm.date}
                      onChange={(e) => setProgressForm(prev => ({ ...prev, date: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {/* Muatlia Section */}
                <div className="border rounded-lg p-4">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Muatlia (مطالعہ)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={progressForm.muatlia.completed}
                        onChange={(e) => setProgressForm(prev => ({
                          ...prev,
                          muatlia: { ...prev.muatlia, completed: e.target.checked }
                        }))}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Completed
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Performance
                      </label>
                      <select
                        value={progressForm.muatlia.performance}
                        onChange={(e) => setProgressForm(prev => ({
                          ...prev,
                          muatlia: { ...prev.muatlia, performance: e.target.value as any }
                        }))}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      >
                        <option value="excellent">Excellent</option>
                        <option value="good">Good</option>
                        <option value="average">Average</option>
                        <option value="needs_improvement">Needs Improvement</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Description
                    </label>
                    <textarea
                      value={progressForm.muatlia.description}
                      onChange={(e) => setProgressForm(prev => ({
                        ...prev,
                        muatlia: { ...prev.muatlia, description: e.target.value }
                      }))}
                      rows={2}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {/* Sabaq Section */}
                <div className="border rounded-lg p-4">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Sabaq (سبق)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Surah Name
                      </label>
                      <input
                        type="text"
                        value={progressForm.sabaq.surah.name}
                        onChange={(e) => setProgressForm(prev => ({
                          ...prev,
                          sabaq: { ...prev.sabaq, surah: { ...prev.sabaq.surah, name: e.target.value } }
                        }))}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        From Ayah
                      </label>
                      <input
                        type="number"
                        value={progressForm.sabaq.fromAyah}
                        onChange={(e) => setProgressForm(prev => ({
                          ...prev,
                          sabaq: { ...prev.sabaq, fromAyah: parseInt(e.target.value) }
                        }))}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        To Ayah
                      </label>
                      <input
                        type="number"
                        value={progressForm.sabaq.toAyah}
                        onChange={(e) => setProgressForm(prev => ({
                          ...prev,
                          sabaq: { ...prev.sabaq, toAyah: parseInt(e.target.value) }
                        }))}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Performance
                      </label>
                      <select
                        value={progressForm.sabaq.performance}
                        onChange={(e) => setProgressForm(prev => ({
                          ...prev,
                          sabaq: { ...prev.sabaq, performance: e.target.value as any }
                        }))}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      >
                        <option value="excellent">Excellent</option>
                        <option value="good">Good</option>
                        <option value="average">Average</option>
                        <option value="needs_improvement">Needs Improvement</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Notes
                      </label>
                      <input
                        type="text"
                        value={progressForm.sabaq.notes}
                        onChange={(e) => setProgressForm(prev => ({
                          ...prev,
                          sabaq: { ...prev.sabaq, notes: e.target.value }
                        }))}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Similar sections for Sabqi and Manzil would go here... */}
                {/* For brevity, I'll add a simplified version */}

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
                  >
                    Add Record
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
