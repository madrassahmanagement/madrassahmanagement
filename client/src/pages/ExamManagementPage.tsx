import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Exam, ExamResult, InkyResult } from '../types';

export const ExamManagementPage = () => {
  const { user } = useAuth();
  const [exams, setExams] = useState<Exam[]>([
    {
      id: '1',
      name: 'Monthly Test',
      nameArabic: 'الامتحان الشهري',
      type: 'monthly',
      classId: 'class-1',
      subject: 'Quran Studies',
      examDate: '2024-02-15',
      totalMarks: 100,
      passingMarks: 50,
      duration: 120,
      instructions: 'Answer all questions. No cheating allowed.',
      isActive: true,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      name: 'Quarterly Examination',
      nameArabic: 'الامتحان ربع السنوي',
      type: 'quarterly',
      classId: 'class-1',
      subject: 'Arabic Language',
      examDate: '2024-03-20',
      totalMarks: 100,
      passingMarks: 50,
      duration: 150,
      instructions: 'Complete all sections within time limit.',
      isActive: true,
      createdAt: '2024-01-20T10:00:00Z',
      updatedAt: '2024-01-20T10:00:00Z'
    },
    {
      id: '3',
      name: 'Half-Yearly Exam',
      nameArabic: 'الامتحان نصف السنوي',
      type: 'half_yearly',
      classId: 'class-2',
      subject: 'Islamic Studies',
      examDate: '2024-06-15',
      totalMarks: 100,
      passingMarks: 50,
      duration: 180,
      instructions: 'Comprehensive examination covering all topics.',
      isActive: true,
      createdAt: '2024-01-25T10:00:00Z',
      updatedAt: '2024-01-25T10:00:00Z'
    },
    {
      id: '4',
      name: 'Annual Examination',
      nameArabic: 'الامتحان السنوي',
      type: 'annual',
      classId: 'class-3',
      subject: 'Memorization',
      examDate: '2024-12-10',
      totalMarks: 100,
      passingMarks: 50,
      duration: 240,
      instructions: 'Final examination for the academic year.',
      isActive: true,
      createdAt: '2024-01-30T10:00:00Z',
      updatedAt: '2024-01-30T10:00:00Z'
    }
  ]);

  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [inkyResults, setInkyResults] = useState<InkyResult[]>([]);
  const [showExamForm, setShowExamForm] = useState(false);
  const [showResultsForm, setShowResultsForm] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [filterType, setFilterType] = useState<string>('all');

  const [examForm, setExamForm] = useState({
    name: '',
    nameArabic: '',
    type: 'monthly' as const,
    classId: '',
    subject: '',
    examDate: '',
    totalMarks: 100,
    passingMarks: 50,
    duration: 120,
    instructions: ''
  });

  const [resultsForm, setResultsForm] = useState({
    examId: '',
    studentId: '',
    obtainedMarks: 0,
    remarks: ''
  });

  const examTypes = [
    { value: 'monthly', label: 'Monthly', arabic: 'الامتحان الشهري' },
    { value: 'quarterly', label: 'Quarterly', arabic: 'الامتحان ربع السنوي' },
    { value: 'half_yearly', label: 'Half-Yearly', arabic: 'الامتحان نصف السنوي' },
    { value: 'annual', label: 'Annual', arabic: 'الامتحان السنوي' }
  ];

  const getExamTypeInfo = (type: string) => {
    return examTypes.find(t => t.value === type) || examTypes[0];
  };

  const getTypeColor = (type: string) => {
    const colors = {
      monthly: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      quarterly: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      half_yearly: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      annual: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return colors[type as keyof typeof colors] || colors.monthly;
  };

  const handleExamSubmit = () => {
    const newExam: Exam = {
      id: Date.now().toString(),
      ...examForm,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setExams(prev => [...prev, newExam]);
    setShowExamForm(false);
    setExamForm({
      name: '',
      nameArabic: '',
      type: 'monthly',
      classId: '',
      subject: '',
      examDate: '',
      totalMarks: 100,
      passingMarks: 50,
      duration: 120,
      instructions: ''
    });
  };

  const handleResultsSubmit = () => {
    const percentage = (resultsForm.obtainedMarks / (selectedExam?.totalMarks || 100)) * 100;
    const grade = percentage >= 90 ? 'A+' : percentage >= 80 ? 'A' : percentage >= 70 ? 'B+' : 
                  percentage >= 60 ? 'B' : percentage >= 50 ? 'C+' : 'F';

    const newResult: ExamResult = {
      id: Date.now().toString(),
      examId: resultsForm.examId,
      studentId: resultsForm.studentId,
      obtainedMarks: resultsForm.obtainedMarks,
      percentage,
      grade,
      remarks: resultsForm.remarks,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setExamResults(prev => [...prev, newResult]);
    setShowResultsForm(false);
    setResultsForm({
      examId: '',
      studentId: '',
      obtainedMarks: 0,
      remarks: ''
    });
  };

  const filteredExams = filterType === 'all' ? exams : exams.filter(exam => exam.type === filterType);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Exam Management 📚
        </h1>
        <p className="text-purple-100">
          Manage exams with Arabic translations and comprehensive tracking
        </p>
      </div>

      {/* Exam Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <span className="text-2xl">📝</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total Exams</h3>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{exams.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Active Exams</h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {exams.filter(e => e.isActive).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Results Entered</h3>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{examResults.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <span className="text-2xl">🏆</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Inky Results</h3>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{inkyResults.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="all">All Types</option>
            {examTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label} ({type.arabic})
              </option>
            ))}
          </select>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setShowExamForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Add Exam
          </button>
          <button
            onClick={() => setShowResultsForm(true)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
          >
            Add Results
          </button>
        </div>
      </div>

      {/* Exams List */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Exams List</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Exam Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Marks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredExams.map((exam) => {
                const typeInfo = getExamTypeInfo(exam.type);
                return (
                  <tr key={exam.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {exam.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400" dir="rtl">
                          {exam.nameArabic}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(exam.type)}`}>
                        {typeInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {exam.subject}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(exam.examDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {exam.totalMarks} (Pass: {exam.passingMarks})
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {exam.duration} min
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        exam.isActive 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {exam.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedExam(exam);
                            setResultsForm(prev => ({ ...prev, examId: exam.id }));
                            setShowResultsForm(true);
                          }}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                        >
                          Results
                        </button>
                        <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                          Edit
                        </button>
                        <button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                          Delete
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

      {/* Add Exam Modal */}
      {showExamForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Add New Exam
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Exam Name (English)
                  </label>
                  <input
                    type="text"
                    value={examForm.name}
                    onChange={(e) => setExamForm(prev => ({ ...prev, name: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Exam Name (Arabic)
                  </label>
                  <input
                    type="text"
                    value={examForm.nameArabic}
                    onChange={(e) => setExamForm(prev => ({ ...prev, nameArabic: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    dir="rtl"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Exam Type
                  </label>
                  <select
                    value={examForm.type}
                    onChange={(e) => setExamForm(prev => ({ ...prev, type: e.target.value as any }))}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    {examTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label} - {type.arabic}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={examForm.subject}
                    onChange={(e) => setExamForm(prev => ({ ...prev, subject: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Exam Date
                  </label>
                  <input
                    type="date"
                    value={examForm.examDate}
                    onChange={(e) => setExamForm(prev => ({ ...prev, examDate: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Total Marks
                    </label>
                    <input
                      type="number"
                      value={examForm.totalMarks}
                      onChange={(e) => setExamForm(prev => ({ ...prev, totalMarks: parseInt(e.target.value) }))}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Passing Marks
                    </label>
                    <input
                      type="number"
                      value={examForm.passingMarks}
                      onChange={(e) => setExamForm(prev => ({ ...prev, passingMarks: parseInt(e.target.value) }))}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={examForm.duration}
                    onChange={(e) => setExamForm(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Instructions
                  </label>
                  <textarea
                    value={examForm.instructions}
                    onChange={(e) => setExamForm(prev => ({ ...prev, instructions: e.target.value }))}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowExamForm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleExamSubmit}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
                  >
                    Add Exam
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Results Modal */}
      {showResultsForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Add Exam Results
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Student ID
                  </label>
                  <input
                    type="text"
                    value={resultsForm.studentId}
                    onChange={(e) => setResultsForm(prev => ({ ...prev, studentId: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Obtained Marks
                  </label>
                  <input
                    type="number"
                    value={resultsForm.obtainedMarks}
                    onChange={(e) => setResultsForm(prev => ({ ...prev, obtainedMarks: parseInt(e.target.value) }))}
                    max={selectedExam?.totalMarks || 100}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Out of {selectedExam?.totalMarks || 100} marks
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Remarks
                  </label>
                  <textarea
                    value={resultsForm.remarks}
                    onChange={(e) => setResultsForm(prev => ({ ...prev, remarks: e.target.value }))}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowResultsForm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleResultsSubmit}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
                  >
                    Add Results
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
