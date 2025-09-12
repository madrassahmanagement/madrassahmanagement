import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { NamazTracking } from '../types';

export const EnhancedNamazTrackingPage = () => {
  const { user } = useAuth();
  const [namazRecords, setNamazRecords] = useState<NamazTracking[]>([
    {
      id: '1',
      studentId: 'student-1',
      date: '2024-01-20',
      fajr: {
        performed: true,
        location: 'madrassah',
        time: '05:30',
        notes: 'On time, good concentration'
      },
      isha: {
        performed: true,
        location: 'home',
        time: '19:45',
        notes: 'Performed with family'
      },
      newLearning: {
        hadith: {
          learned: true,
          text: 'The best of people are those who benefit others',
          reference: 'Sahih Bukhari'
        },
        sunnah: {
          learned: true,
          description: 'Eating with right hand and saying Bismillah'
        },
        other: {
          learned: false,
          description: ''
        }
      },
      familyInteraction: {
        handKiss: true,
        behaviorRating: 5,
        description: 'Very respectful and loving towards family'
      },
      weeklyReflection: {
        question: 'What positive changes have you noticed in your child this week?',
        answer: 'My child has become more punctual with prayers and shows better respect towards elders. He has also started helping more around the house and shows more interest in Islamic studies.',
        answered: true
      },
      markedBy: 'parent-1',
      createdAt: '2024-01-20T10:00:00Z',
      updatedAt: '2024-01-20T10:00:00Z'
    },
    {
      id: '2',
      studentId: 'student-2',
      date: '2024-01-20',
      fajr: {
        performed: false,
        location: 'home',
        time: '',
        notes: 'Overslept, needs to improve sleep schedule'
      },
      isha: {
        performed: true,
        location: 'madrassah',
        time: '19:30',
        notes: 'Good performance'
      },
      newLearning: {
        hadith: {
          learned: false,
          text: '',
          reference: ''
        },
        sunnah: {
          learned: true,
          description: 'Saying Salam when entering home'
        },
        other: {
          learned: true,
          description: 'New dua for protection'
        }
      },
      familyInteraction: {
        handKiss: false,
        behaviorRating: 3,
        description: 'Sometimes forgets to greet properly'
      },
      weeklyReflection: {
        question: 'What positive changes have you noticed in your child this week?',
        answer: 'My child is trying to be more regular with prayers but still needs improvement in waking up for Fajr. His behavior at home has been good overall.',
        answered: true
      },
      markedBy: 'parent-2',
      createdAt: '2024-01-20T10:00:00Z',
      updatedAt: '2024-01-20T10:00:00Z'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [filterDate, setFilterDate] = useState<string>('');

  const [namazForm, setNamazForm] = useState({
    studentId: '',
    date: new Date().toISOString().split('T')[0],
    fajr: {
      performed: false,
      location: 'home' as const,
      time: '',
      notes: ''
    },
    isha: {
      performed: false,
      location: 'home' as const,
      time: '',
      notes: ''
    },
    newLearning: {
      hadith: {
        learned: false,
        text: '',
        reference: ''
      },
      sunnah: {
        learned: false,
        description: ''
      },
      other: {
        learned: false,
        description: ''
      }
    },
    familyInteraction: {
      handKiss: false,
      behaviorRating: 5,
      description: ''
    },
    weeklyReflection: {
      question: 'What positive changes have you noticed in your child this week?',
      answer: '',
      answered: false
    }
  });

  const students = [
    { id: 'student-1', name: 'Ahmed Khan', class: 'Class 5A', section: 'Section A' },
    { id: 'student-2', name: 'Fatima Ali', class: 'Class 5A', section: 'Section A' },
    { id: 'student-3', name: 'Muhammad Hassan', class: 'Class 5B', section: 'Section B' }
  ];

  const weeklyQuestions = [
    'What positive changes have you noticed in your child this week?',
    'How has your child\'s behavior improved at home?',
    'What new Islamic knowledge has your child shared with the family?',
    'How has your child\'s prayer routine affected the family?',
    'What areas would you like to see more improvement in?'
  ];

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.name} (${student.class})` : 'Unknown Student';
  };

  const getRatingStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  const getPerformanceColor = (performed: boolean) => {
    return performed 
      ? 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200'
      : 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200';
  };

  const handleSubmit = () => {
    const newRecord: NamazTracking = {
      id: Date.now().toString(),
      ...namazForm,
      markedBy: user?.id || 'parent-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setNamazRecords(prev => [...prev, newRecord]);
    setShowForm(false);
    setNamazForm({
      studentId: '',
      date: new Date().toISOString().split('T')[0],
      fajr: { performed: false, location: 'home', time: '', notes: '' },
      isha: { performed: false, location: 'home', time: '', notes: '' },
      newLearning: {
        hadith: { learned: false, text: '', reference: '' },
        sunnah: { learned: false, description: '' },
        other: { learned: false, description: '' }
      },
      familyInteraction: { handKiss: false, behaviorRating: 5, description: '' },
      weeklyReflection: { question: weeklyQuestions[0], answer: '', answered: false }
    });
  };

  const filteredRecords = namazRecords.filter(record => {
    if (selectedStudent && record.studentId !== selectedStudent) return false;
    if (filterDate && record.date !== filterDate) return false;
    return true;
  });

  const fajrPercentage = namazRecords.length > 0 
    ? (namazRecords.filter(r => r.fajr.performed).length / namazRecords.length) * 100 
    : 0;
  
  const ishaPercentage = namazRecords.length > 0 
    ? (namazRecords.filter(r => r.isha.performed).length / namazRecords.length) * 100 
    : 0;

  const averageBehaviorRating = namazRecords.length > 0
    ? namazRecords.reduce((sum, r) => sum + r.familyInteraction.behaviorRating, 0) / namazRecords.length
    : 0;

  const handKissPercentage = namazRecords.length > 0
    ? (namazRecords.filter(r => r.familyInteraction.handKiss).length / namazRecords.length) * 100
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Enhanced Namaz Tracking 🕌
        </h1>
        <p className="text-indigo-100">
          Track Fajr & Isha, new learning, family interaction, and weekly reflections
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-indigo-100 dark:bg-indigo-900">
              <span className="text-2xl">🌅</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Fajr Performance</h3>
              <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                {fajrPercentage.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <span className="text-2xl">🌙</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Isha Performance</h3>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {ishaPercentage.toFixed(1)}%
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
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Family Rating</h3>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {averageBehaviorRating.toFixed(1)}/5
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <span className="text-2xl">🤝</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Hand Kiss</h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {handKissPercentage.toFixed(1)}%
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
          Add Namaz Record
        </button>
      </div>

      {/* Namaz Records */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Namaz Tracking Records</h2>
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
                  Fajr
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Isha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  New Learning
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Family Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Hand Kiss
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Reflection
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
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPerformanceColor(record.fajr.performed)}`}>
                        {record.fajr.performed ? 'Performed' : 'Missed'}
                      </span>
                      {record.fajr.performed && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {record.fajr.time} - {record.fajr.location}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPerformanceColor(record.isha.performed)}`}>
                        {record.isha.performed ? 'Performed' : 'Missed'}
                      </span>
                      {record.isha.performed && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {record.isha.time} - {record.isha.location}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <div className="text-xs text-gray-900 dark:text-white">
                        Hadith: {record.newLearning.hadith.learned ? '✓' : '✗'}
                      </div>
                      <div className="text-xs text-gray-900 dark:text-white">
                        Sunnah: {record.newLearning.sunnah.learned ? '✓' : '✗'}
                      </div>
                      <div className="text-xs text-gray-900 dark:text-white">
                        Other: {record.newLearning.other.learned ? '✓' : '✗'}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <div className="text-sm text-yellow-600 dark:text-yellow-400">
                        {getRatingStars(record.familyInteraction.behaviorRating)}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {record.familyInteraction.behaviorRating}/5
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPerformanceColor(record.familyInteraction.handKiss)}`}>
                      {record.familyInteraction.handKiss ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPerformanceColor(record.weeklyReflection.answered)}`}>
                      {record.weeklyReflection.answered ? 'Answered' : 'Pending'}
                    </span>
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

      {/* Add Namaz Record Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Add Namaz Tracking Record
              </h3>
              <div className="space-y-6">
                {/* Student Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Student
                    </label>
                    <select
                      value={namazForm.studentId}
                      onChange={(e) => setNamazForm(prev => ({ ...prev, studentId: e.target.value }))}
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
                      value={namazForm.date}
                      onChange={(e) => setNamazForm(prev => ({ ...prev, date: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {/* Prayer Tracking */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Fajr */}
                  <div className="border rounded-lg p-4">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Fajr Prayer</h4>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={namazForm.fajr.performed}
                          onChange={(e) => setNamazForm(prev => ({
                            ...prev,
                            fajr: { ...prev.fajr, performed: e.target.checked }
                          }))}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          Performed
                        </label>
                      </div>
                      {namazForm.fajr.performed && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Time
                            </label>
                            <input
                              type="time"
                              value={namazForm.fajr.time}
                              onChange={(e) => setNamazForm(prev => ({
                                ...prev,
                                fajr: { ...prev.fajr, time: e.target.value }
                              }))}
                              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Location
                            </label>
                            <select
                              value={namazForm.fajr.location}
                              onChange={(e) => setNamazForm(prev => ({
                                ...prev,
                                fajr: { ...prev.fajr, location: e.target.value as any }
                              }))}
                              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            >
                              <option value="madrassah">Madrassah</option>
                              <option value="home">Home</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                        </>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Notes
                        </label>
                        <textarea
                          value={namazForm.fajr.notes}
                          onChange={(e) => setNamazForm(prev => ({
                            ...prev,
                            fajr: { ...prev.fajr, notes: e.target.value }
                          }))}
                          rows={2}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Isha */}
                  <div className="border rounded-lg p-4">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Isha Prayer</h4>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={namazForm.isha.performed}
                          onChange={(e) => setNamazForm(prev => ({
                            ...prev,
                            isha: { ...prev.isha, performed: e.target.checked }
                          }))}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          Performed
                        </label>
                      </div>
                      {namazForm.isha.performed && (
                        <>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Time
                            </label>
                            <input
                              type="time"
                              value={namazForm.isha.time}
                              onChange={(e) => setNamazForm(prev => ({
                                ...prev,
                                isha: { ...prev.isha, time: e.target.value }
                              }))}
                              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                              Location
                            </label>
                            <select
                              value={namazForm.isha.location}
                              onChange={(e) => setNamazForm(prev => ({
                                ...prev,
                                isha: { ...prev.isha, location: e.target.value as any }
                              }))}
                              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                            >
                              <option value="madrassah">Madrassah</option>
                              <option value="home">Home</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                        </>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Notes
                        </label>
                        <textarea
                          value={namazForm.isha.notes}
                          onChange={(e) => setNamazForm(prev => ({
                            ...prev,
                            isha: { ...prev.isha, notes: e.target.value }
                          }))}
                          rows={2}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* New Learning */}
                <div className="border rounded-lg p-4">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">New Learning</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Hadith */}
                    <div>
                      <div className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          checked={namazForm.newLearning.hadith.learned}
                          onChange={(e) => setNamazForm(prev => ({
                            ...prev,
                            newLearning: {
                              ...prev.newLearning,
                              hadith: { ...prev.newLearning.hadith, learned: e.target.checked }
                            }
                          }))}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Hadith
                        </label>
                      </div>
                      {namazForm.newLearning.hadith.learned && (
                        <>
                          <input
                            type="text"
                            placeholder="Hadith text"
                            value={namazForm.newLearning.hadith.text}
                            onChange={(e) => setNamazForm(prev => ({
                              ...prev,
                              newLearning: {
                                ...prev.newLearning,
                                hadith: { ...prev.newLearning.hadith, text: e.target.value }
                              }
                            }))}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          />
                          <input
                            type="text"
                            placeholder="Reference"
                            value={namazForm.newLearning.hadith.reference}
                            onChange={(e) => setNamazForm(prev => ({
                              ...prev,
                              newLearning: {
                                ...prev.newLearning,
                                hadith: { ...prev.newLearning.hadith, reference: e.target.value }
                              }
                            }))}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          />
                        </>
                      )}
                    </div>

                    {/* Sunnah */}
                    <div>
                      <div className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          checked={namazForm.newLearning.sunnah.learned}
                          onChange={(e) => setNamazForm(prev => ({
                            ...prev,
                            newLearning: {
                              ...prev.newLearning,
                              sunnah: { ...prev.newLearning.sunnah, learned: e.target.checked }
                            }
                          }))}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Sunnah
                        </label>
                      </div>
                      {namazForm.newLearning.sunnah.learned && (
                        <textarea
                          placeholder="Sunnah description"
                          value={namazForm.newLearning.sunnah.description}
                          onChange={(e) => setNamazForm(prev => ({
                            ...prev,
                            newLearning: {
                              ...prev.newLearning,
                              sunnah: { ...prev.newLearning.sunnah, description: e.target.value }
                            }
                          }))}
                          rows={2}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                      )}
                    </div>

                    {/* Other */}
                    <div>
                      <div className="flex items-center mb-2">
                        <input
                          type="checkbox"
                          checked={namazForm.newLearning.other.learned}
                          onChange={(e) => setNamazForm(prev => ({
                            ...prev,
                            newLearning: {
                              ...prev.newLearning,
                              other: { ...prev.newLearning.other, learned: e.target.checked }
                            }
                          }))}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                          Other
                        </label>
                      </div>
                      {namazForm.newLearning.other.learned && (
                        <textarea
                          placeholder="Other learning description"
                          value={namazForm.newLearning.other.description}
                          onChange={(e) => setNamazForm(prev => ({
                            ...prev,
                            newLearning: {
                              ...prev.newLearning,
                              other: { ...prev.newLearning.other, description: e.target.value }
                            }
                          }))}
                          rows={2}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Family Interaction */}
                <div className="border rounded-lg p-4">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Family Interaction</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={namazForm.familyInteraction.handKiss}
                        onChange={(e) => setNamazForm(prev => ({
                          ...prev,
                          familyInteraction: { ...prev.familyInteraction, handKiss: e.target.checked }
                        }))}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                        Hand Kiss (Ghar aakar hathon ka bossa liya)
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Behavior Rating (1-5 stars)
                      </label>
                      <select
                        value={namazForm.familyInteraction.behaviorRating}
                        onChange={(e) => setNamazForm(prev => ({
                          ...prev,
                          familyInteraction: { ...prev.familyInteraction, behaviorRating: parseInt(e.target.value) }
                        }))}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      >
                        <option value={5}>5 - Excellent</option>
                        <option value={4}>4 - Good</option>
                        <option value={3}>3 - Average</option>
                        <option value={2}>2 - Poor</option>
                        <option value={1}>1 - Very Poor</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Description
                    </label>
                    <textarea
                      value={namazForm.familyInteraction.description}
                      onChange={(e) => setNamazForm(prev => ({
                        ...prev,
                        familyInteraction: { ...prev.familyInteraction, description: e.target.value }
                      }))}
                      rows={2}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {/* Weekly Reflection */}
                <div className="border rounded-lg p-4">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Weekly Reflection</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Question
                      </label>
                      <select
                        value={namazForm.weeklyReflection.question}
                        onChange={(e) => setNamazForm(prev => ({
                          ...prev,
                          weeklyReflection: { ...prev.weeklyReflection, question: e.target.value }
                        }))}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      >
                        {weeklyQuestions.map((question, index) => (
                          <option key={index} value={question}>
                            {question}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Answer (200 words max)
                      </label>
                      <textarea
                        value={namazForm.weeklyReflection.answer}
                        onChange={(e) => setNamazForm(prev => ({
                          ...prev,
                          weeklyReflection: { 
                            ...prev.weeklyReflection, 
                            answer: e.target.value,
                            answered: e.target.value.length > 0
                          }
                        }))}
                        rows={4}
                        maxLength={200}
                        className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {namazForm.weeklyReflection.answer.length}/200 words
                      </p>
                    </div>
                  </div>
                </div>

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
