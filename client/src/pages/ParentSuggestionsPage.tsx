import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ParentSuggestion } from '../types';

export const ParentSuggestionsPage = () => {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState<ParentSuggestion[]>([
    {
      id: '1',
      parentId: 'parent-1',
      studentId: 'student-1',
      suggestion: 'I would like to suggest that the madrassah could organize more outdoor activities for students to help them stay physically active and engaged. This would be beneficial for their overall development.',
      category: 'general',
      status: 'pending',
      createdAt: '2024-01-20T10:00:00Z',
      updatedAt: '2024-01-20T10:00:00Z'
    },
    {
      id: '2',
      parentId: 'parent-2',
      studentId: 'student-2',
      suggestion: 'Could you please provide more detailed feedback on my child\'s progress in Quran memorization? I would like to know specific areas where he needs improvement.',
      category: 'academic',
      status: 'reviewed',
      response: 'Thank you for your suggestion. We will provide more detailed progress reports starting next month.',
      respondedBy: 'teacher-1',
      respondedAt: '2024-01-22T14:30:00Z',
      createdAt: '2024-01-20T10:00:00Z',
      updatedAt: '2024-01-22T14:30:00Z'
    },
    {
      id: '3',
      parentId: 'parent-3',
      studentId: 'student-3',
      suggestion: 'I have noticed that my child seems to be having difficulty with punctuality. Could you please help us work together to improve this aspect?',
      category: 'behavior',
      status: 'implemented',
      response: 'We have implemented a punctuality tracking system and will work with you to help your child improve in this area.',
      respondedBy: 'nazim-1',
      respondedAt: '2024-01-25T09:15:00Z',
      createdAt: '2024-01-20T10:00:00Z',
      updatedAt: '2024-01-25T09:15:00Z'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const [suggestionForm, setSuggestionForm] = useState({
    studentId: '',
    suggestion: '',
    category: 'general' as const
  });

  const students = [
    { id: 'student-1', name: 'Ahmed Khan', class: 'Class 5A', section: 'Section A' },
    { id: 'student-2', name: 'Fatima Ali', class: 'Class 5A', section: 'Section A' },
    { id: 'student-3', name: 'Muhammad Hassan', class: 'Class 5B', section: 'Section B' }
  ];

  const categories = [
    { value: 'academic', label: 'Academic', description: 'Related to studies and learning' },
    { value: 'behavior', label: 'Behavior', description: 'Student behavior and discipline' },
    { value: 'health', label: 'Health', description: 'Health and safety concerns' },
    { value: 'general', label: 'General', description: 'General suggestions and feedback' },
    { value: 'other', label: 'Other', description: 'Other suggestions' }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200',
      reviewed: 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200',
      implemented: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200',
      rejected: 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      academic: 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200',
      behavior: 'text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-200',
      health: 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200',
      general: 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-200',
      other: 'text-purple-600 bg-purple-100 dark:bg-purple-900 dark:text-purple-200'
    };
    return colors[category as keyof typeof colors] || colors.general;
  };

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.name} (${student.class})` : 'Unknown Student';
  };

  const handleSubmit = () => {
    if (suggestionForm.suggestion.length > 200) {
      alert('Suggestion must be 200 words or less');
      return;
    }

    const newSuggestion: ParentSuggestion = {
      id: Date.now().toString(),
      parentId: user?.id || 'parent-1',
      ...suggestionForm,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setSuggestions(prev => [...prev, newSuggestion]);
    setShowForm(false);
    setSuggestionForm({
      studentId: '',
      suggestion: '',
      category: 'general'
    });
  };

  const filteredSuggestions = suggestions.filter(suggestion => {
    if (filterStatus !== 'all' && suggestion.status !== filterStatus) return false;
    if (filterCategory !== 'all' && suggestion.category !== filterCategory) return false;
    return true;
  });

  const pendingCount = suggestions.filter(s => s.status === 'pending').length;
  const reviewedCount = suggestions.filter(s => s.status === 'reviewed').length;
  const implementedCount = suggestions.filter(s => s.status === 'implemented').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Parent Suggestions 💬
        </h1>
        <p className="text-blue-100">
          Share your suggestions and feedback with the madrassah administration
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <span className="text-2xl">📝</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total Suggestions</h3>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{suggestions.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
              <span className="text-2xl">⏳</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Pending</h3>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{pendingCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <span className="text-2xl">👀</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Reviewed</h3>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{reviewedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Implemented</h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{implementedCount}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="implemented">Implemented</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600 transition-colors"
        >
          Submit Suggestion
        </button>
      </div>

      {/* Suggestions List */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Your Suggestions</h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredSuggestions.map((suggestion) => (
            <div key={suggestion.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(suggestion.status)}`}>
                      {suggestion.status.charAt(0).toUpperCase() + suggestion.status.slice(1)}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(suggestion.category)}`}>
                      {categories.find(c => c.value === suggestion.category)?.label || suggestion.category}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {getStudentName(suggestion.studentId)}
                    </span>
                  </div>
                  
                  <p className="text-gray-900 dark:text-white mb-3">
                    {suggestion.suggestion}
                  </p>
                  
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Submitted: {new Date(suggestion.createdAt).toLocaleDateString()}
                  </div>

                  {suggestion.response && (
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                        Response from {suggestion.respondedBy}:
                      </h4>
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        {suggestion.response}
                      </p>
                      <div className="text-xs text-blue-600 dark:text-blue-300 mt-2">
                        Responded: {suggestion.respondedAt ? new Date(suggestion.respondedAt).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Suggestion Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Submit New Suggestion
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Student
                  </label>
                  <select
                    value={suggestionForm.studentId}
                    onChange={(e) => setSuggestionForm(prev => ({ ...prev, studentId: e.target.value }))}
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
                    Category
                  </label>
                  <select
                    value={suggestionForm.category}
                    onChange={(e) => setSuggestionForm(prev => ({ ...prev, category: e.target.value as any }))}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label} - {category.description}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Suggestion (200 words maximum)
                  </label>
                  <textarea
                    value={suggestionForm.suggestion}
                    onChange={(e) => setSuggestionForm(prev => ({ ...prev, suggestion: e.target.value }))}
                    rows={6}
                    maxLength={200}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Please share your suggestion or feedback..."
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                    <span>Be specific and constructive in your feedback</span>
                    <span>{suggestionForm.suggestion.length}/200 words</span>
                  </div>
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <span className="text-yellow-400">⚠️</span>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        Guidelines for Suggestions
                      </h3>
                      <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                        <ul className="list-disc list-inside space-y-1">
                          <li>Be respectful and constructive in your feedback</li>
                          <li>Provide specific examples when possible</li>
                          <li>Focus on areas that can be improved</li>
                          <li>Keep suggestions concise and clear</li>
                        </ul>
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
                    disabled={!suggestionForm.studentId || !suggestionForm.suggestion.trim()}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
                  >
                    Submit Suggestion
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
