import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { StudentScore } from '../types';

export const StudentScoringSystemPage = () => {
  const { user } = useAuth();
  const [scores, setScores] = useState<StudentScore[]>([
    {
      id: '1',
      studentId: 'student-1',
      classId: 'class-1',
      sectionId: 'section-1',
      date: '2024-01-20',
      discipline: {
        points: 5,
        description: 'Excellent behavior, respectful to teachers and peers',
        category: 'behavior'
      },
      uniform: {
        points: 4,
        description: 'Clean and proper uniform, minor crease issues',
        issues: ['Minor creases']
      },
      fitness: {
        points: 5,
        description: 'Active participation in physical activities',
        activities: ['Running', 'Sports']
      },
      adab: {
        points: 5,
        description: 'Excellent manners and etiquette',
        aspects: ['Respect', 'Politeness', 'Kindness']
      },
      dailyLearning: {
        points: 4,
        description: 'Good progress in studies, needs improvement in some areas',
        areas: ['Quran', 'Arabic', 'Islamic Studies']
      },
      salah: {
        points: 5,
        description: 'Performed all prayers on time',
        prayers: {
          fajr: true,
          dhuhr: true,
          asr: true,
          maghrib: true,
          isha: true
        }
      },
      totalPoints: 28,
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
      discipline: {
        points: 3,
        description: 'Some behavioral issues, needs improvement',
        category: 'behavior'
      },
      uniform: {
        points: 2,
        description: 'Uniform not properly maintained',
        issues: ['Stains', 'Wrinkled', 'Missing buttons']
      },
      fitness: {
        points: 3,
        description: 'Limited participation in activities',
        activities: ['Walking']
      },
      adab: {
        points: 4,
        description: 'Generally good manners, some areas need work',
        aspects: ['Respect', 'Politeness']
      },
      dailyLearning: {
        points: 3,
        description: 'Average progress, needs more focus',
        areas: ['Quran', 'Arabic']
      },
      salah: {
        points: 4,
        description: 'Mostly performed prayers, missed Fajr once',
        prayers: {
          fajr: false,
          dhuhr: true,
          asr: true,
          maghrib: true,
          isha: true
        }
      },
      totalPoints: 21,
      markedBy: 'teacher-1',
      createdAt: '2024-01-20T10:00:00Z',
      updatedAt: '2024-01-20T10:00:00Z'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [filterDate, setFilterDate] = useState<string>('');

  const [scoreForm, setScoreForm] = useState({
    studentId: '',
    classId: '',
    sectionId: '',
    date: new Date().toISOString().split('T')[0],
    discipline: {
      points: 5,
      description: '',
      category: 'behavior' as const
    },
    uniform: {
      points: 5,
      description: '',
      issues: [] as string[]
    },
    fitness: {
      points: 5,
      description: '',
      activities: [] as string[]
    },
    adab: {
      points: 5,
      description: '',
      aspects: [] as string[]
    },
    dailyLearning: {
      points: 5,
      description: '',
      areas: [] as string[]
    },
    salah: {
      points: 5,
      description: '',
      prayers: {
        fajr: true,
        dhuhr: true,
        asr: true,
        maghrib: true,
        isha: true
      }
    }
  });

  const students = [
    { id: 'student-1', name: 'Ahmed Khan', class: 'Class 5A', section: 'Section A' },
    { id: 'student-2', name: 'Fatima Ali', class: 'Class 5A', section: 'Section A' },
    { id: 'student-3', name: 'Muhammad Hassan', class: 'Class 5B', section: 'Section B' }
  ];

  const getScoreColor = (points: number) => {
    if (points >= 4.5) return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200';
    if (points >= 3.5) return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200';
    if (points >= 2.5) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200';
    return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200';
  };

  const getTotalScoreColor = (total: number) => {
    if (total >= 25) return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200';
    if (total >= 20) return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200';
    if (total >= 15) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200';
    return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200';
  };

  const getGrade = (total: number) => {
    if (total >= 28) return 'A+';
    if (total >= 25) return 'A';
    if (total >= 22) return 'B+';
    if (total >= 20) return 'B';
    if (total >= 18) return 'C+';
    if (total >= 15) return 'C';
    if (total >= 12) return 'D';
    return 'F';
  };

  const handleSubmit = () => {
    const totalPoints = scoreForm.discipline.points + scoreForm.uniform.points + 
                       scoreForm.fitness.points + scoreForm.adab.points + 
                       scoreForm.dailyLearning.points + scoreForm.salah.points;

    const newScore: StudentScore = {
      id: Date.now().toString(),
      ...scoreForm,
      totalPoints,
      markedBy: user?.id || 'teacher-1',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setScores(prev => [...prev, newScore]);
    setShowForm(false);
    setScoreForm({
      studentId: '',
      classId: '',
      sectionId: '',
      date: new Date().toISOString().split('T')[0],
      discipline: { points: 5, description: '', category: 'behavior' },
      uniform: { points: 5, description: '', issues: [] },
      fitness: { points: 5, description: '', activities: [] },
      adab: { points: 5, description: '', aspects: [] },
      dailyLearning: { points: 5, description: '', areas: [] },
      salah: { points: 5, description: '', prayers: { fajr: true, dhuhr: true, asr: true, maghrib: true, isha: true } }
    });
  };

  const filteredScores = scores.filter(score => {
    if (selectedStudent && score.studentId !== selectedStudent) return false;
    if (filterDate && score.date !== filterDate) return false;
    return true;
  });

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.name} (${student.class})` : 'Unknown Student';
  };

  const averageScore = scores.length > 0 ? scores.reduce((sum, score) => sum + score.totalPoints, 0) / scores.length : 0;
  const excellentStudents = scores.filter(score => score.totalPoints >= 25).length;
  const goodStudents = scores.filter(score => score.totalPoints >= 20 && score.totalPoints < 25).length;
  const averageStudents = scores.filter(score => score.totalPoints >= 15 && score.totalPoints < 20).length;
  const needsImprovement = scores.filter(score => score.totalPoints < 15).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Student Scoring System ⭐
        </h1>
        <p className="text-orange-100">
          5/5 points system: Discipline, Uniform, Fitness, Adab, Daily Learning, Salah
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Average Score</h3>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {averageScore.toFixed(1)}/30
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <span className="text-2xl">🏆</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Excellent</h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {excellentStudents}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <span className="text-2xl">👍</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Good</h3>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {goodStudents}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
              <span className="text-2xl">📈</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Average</h3>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {averageStudents}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900">
              <span className="text-2xl">⚠️</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Needs Help</h3>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {needsImprovement}
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
          Add Score Record
        </button>
      </div>

      {/* Scores List */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Student Scores</h2>
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
                  Discipline
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Uniform
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Fitness
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Adab
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Learning
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Salah
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredScores.map((score) => (
                <tr key={score.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {getStudentName(score.studentId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {new Date(score.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getScoreColor(score.discipline.points)}`}>
                      {score.discipline.points}/5
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getScoreColor(score.uniform.points)}`}>
                      {score.uniform.points}/5
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getScoreColor(score.fitness.points)}`}>
                      {score.fitness.points}/5
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getScoreColor(score.adab.points)}`}>
                      {score.adab.points}/5
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getScoreColor(score.dailyLearning.points)}`}>
                      {score.dailyLearning.points}/5
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getScoreColor(score.salah.points)}`}>
                      {score.salah.points}/5
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col space-y-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTotalScoreColor(score.totalPoints)}`}>
                        {score.totalPoints}/30
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Grade: {getGrade(score.totalPoints)}
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

      {/* Add Score Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Add Student Score Record
              </h3>
              <div className="space-y-6">
                {/* Student Selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Student
                    </label>
                    <select
                      value={scoreForm.studentId}
                      onChange={(e) => setScoreForm(prev => ({ ...prev, studentId: e.target.value }))}
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
                      value={scoreForm.date}
                      onChange={(e) => setScoreForm(prev => ({ ...prev, date: e.target.value }))}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                </div>

                {/* Scoring Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Discipline */}
                  <div className="border rounded-lg p-4">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Discipline (5/5)</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Points
                        </label>
                        <select
                          value={scoreForm.discipline.points}
                          onChange={(e) => setScoreForm(prev => ({
                            ...prev,
                            discipline: { ...prev.discipline, points: parseInt(e.target.value) }
                          }))}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        >
                          <option value={5}>5 - Excellent</option>
                          <option value={4}>4 - Good</option>
                          <option value={3}>3 - Average</option>
                          <option value={2}>2 - Poor</option>
                          <option value={1}>1 - Very Poor</option>
                          <option value={0}>0 - Unacceptable</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Description
                        </label>
                        <textarea
                          value={scoreForm.discipline.description}
                          onChange={(e) => setScoreForm(prev => ({
                            ...prev,
                            discipline: { ...prev.discipline, description: e.target.value }
                          }))}
                          rows={2}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Uniform */}
                  <div className="border rounded-lg p-4">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Uniform (5/5)</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Points
                        </label>
                        <select
                          value={scoreForm.uniform.points}
                          onChange={(e) => setScoreForm(prev => ({
                            ...prev,
                            uniform: { ...prev.uniform, points: parseInt(e.target.value) }
                          }))}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        >
                          <option value={5}>5 - Perfect</option>
                          <option value={4}>4 - Good</option>
                          <option value={3}>3 - Average</option>
                          <option value={2}>2 - Poor</option>
                          <option value={1}>1 - Very Poor</option>
                          <option value={0}>0 - Unacceptable</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Description
                        </label>
                        <textarea
                          value={scoreForm.uniform.description}
                          onChange={(e) => setScoreForm(prev => ({
                            ...prev,
                            uniform: { ...prev.uniform, description: e.target.value }
                          }))}
                          rows={2}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Fitness */}
                  <div className="border rounded-lg p-4">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Fitness (5/5)</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Points
                        </label>
                        <select
                          value={scoreForm.fitness.points}
                          onChange={(e) => setScoreForm(prev => ({
                            ...prev,
                            fitness: { ...prev.fitness, points: parseInt(e.target.value) }
                          }))}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        >
                          <option value={5}>5 - Excellent</option>
                          <option value={4}>4 - Good</option>
                          <option value={3}>3 - Average</option>
                          <option value={2}>2 - Poor</option>
                          <option value={1}>1 - Very Poor</option>
                          <option value={0}>0 - No Participation</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Description
                        </label>
                        <textarea
                          value={scoreForm.fitness.description}
                          onChange={(e) => setScoreForm(prev => ({
                            ...prev,
                            fitness: { ...prev.fitness, description: e.target.value }
                          }))}
                          rows={2}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Adab */}
                  <div className="border rounded-lg p-4">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Adab (5/5)</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Points
                        </label>
                        <select
                          value={scoreForm.adab.points}
                          onChange={(e) => setScoreForm(prev => ({
                            ...prev,
                            adab: { ...prev.adab, points: parseInt(e.target.value) }
                          }))}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        >
                          <option value={5}>5 - Excellent</option>
                          <option value={4}>4 - Good</option>
                          <option value={3}>3 - Average</option>
                          <option value={2}>2 - Poor</option>
                          <option value={1}>1 - Very Poor</option>
                          <option value={0}>0 - Unacceptable</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Description
                        </label>
                        <textarea
                          value={scoreForm.adab.description}
                          onChange={(e) => setScoreForm(prev => ({
                            ...prev,
                            adab: { ...prev.adab, description: e.target.value }
                          }))}
                          rows={2}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Daily Learning */}
                  <div className="border rounded-lg p-4">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Daily Learning (5/5)</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Points
                        </label>
                        <select
                          value={scoreForm.dailyLearning.points}
                          onChange={(e) => setScoreForm(prev => ({
                            ...prev,
                            dailyLearning: { ...prev.dailyLearning, points: parseInt(e.target.value) }
                          }))}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        >
                          <option value={5}>5 - Excellent</option>
                          <option value={4}>4 - Good</option>
                          <option value={3}>3 - Average</option>
                          <option value={2}>2 - Poor</option>
                          <option value={1}>1 - Very Poor</option>
                          <option value={0}>0 - No Progress</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Description
                        </label>
                        <textarea
                          value={scoreForm.dailyLearning.description}
                          onChange={(e) => setScoreForm(prev => ({
                            ...prev,
                            dailyLearning: { ...prev.dailyLearning, description: e.target.value }
                          }))}
                          rows={2}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Salah */}
                  <div className="border rounded-lg p-4">
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Salah (5/5)</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Points
                        </label>
                        <select
                          value={scoreForm.salah.points}
                          onChange={(e) => setScoreForm(prev => ({
                            ...prev,
                            salah: { ...prev.salah, points: parseInt(e.target.value) }
                          }))}
                          className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                        >
                          <option value={5}>5 - All Prayers</option>
                          <option value={4}>4 - 4 Prayers</option>
                          <option value={3}>3 - 3 Prayers</option>
                          <option value={2}>2 - 2 Prayers</option>
                          <option value={1}>1 - 1 Prayer</option>
                          <option value={0}>0 - No Prayers</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Prayers Performed
                        </label>
                        <div className="grid grid-cols-5 gap-2 mt-2">
                          {Object.entries(scoreForm.salah.prayers).map(([prayer, performed]) => (
                            <label key={prayer} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={performed}
                                onChange={(e) => setScoreForm(prev => ({
                                  ...prev,
                                  salah: {
                                    ...prev.salah,
                                    prayers: { ...prev.salah.prayers, [prayer]: e.target.checked }
                                  }
                                }))}
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                              />
                              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">
                                {prayer}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
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
                    Add Score
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
