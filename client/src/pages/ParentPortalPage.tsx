import { useState, useEffect } from 'react';
import { ParentSuggestion, ParentApplication, NamazTracking, StudentScoring } from '../types';

export const ParentPortalPage = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'suggestions' | 'applications' | 'namaz' | 'scoring'>('dashboard');
  const [suggestions, setSuggestions] = useState<ParentSuggestion[]>([]);
  const [applications, setApplications] = useState<ParentApplication[]>([]);
  const [namazTracking, setNamazTracking] = useState<NamazTracking[]>([]);
  const [scoringRecords, setScoringRecords] = useState<StudentScoring[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockSuggestions: ParentSuggestion[] = [
      {
        id: '1',
        parent: 'Parent 1',
        student: 'Student 1',
        suggestion: 'Please provide more homework for Quran memorization',
        category: 'academic',
        status: 'pending',
        createdAt: '2024-01-15'
      }
    ];

    const mockApplications: ParentApplication[] = [
      {
        id: '1',
        parent: 'Parent 1',
        student: 'Student 1',
        type: 'leave',
        subject: 'Medical Leave Request',
        description: 'Student needs to visit doctor for regular checkup',
        status: 'pending',
        createdAt: '2024-01-15'
      }
    ];

    const mockNamazTracking: NamazTracking[] = [
      {
        id: '1',
        student: 'Student 1',
        date: '2024-01-15',
        fajr: {
          performed: true,
          location: 'home',
          time: '05:30',
          notes: 'Performed with family'
        },
        isha: {
          performed: true,
          location: 'home',
          time: '19:45',
          notes: 'Performed with family'
        },
        familyInteraction: {
          handKiss: true,
          behaviorRating: 5,
          description: 'Very respectful and helpful at home'
        },
        newLearning: {
          hadith: {
            learned: true,
            text: 'The best of people are those who benefit others',
            reference: 'Sahih Bukhari'
          },
          sunnah: {
            learned: true,
            description: 'Learned about the importance of saying Bismillah before eating'
          },
          other: {
            learned: false,
            description: ''
          }
        },
        weeklyReflection: {
          question: 'What new Islamic knowledge did you learn this week?',
          answer: 'I learned about the importance of honesty and truthfulness in Islam. The Prophet (PBUH) taught us that truthfulness leads to righteousness and righteousness leads to Paradise.',
          answered: true
        },
        markedBy: 'Teacher 1'
      }
    ];

    const mockScoringRecords: StudentScoring[] = [
      {
        id: '1',
        student: 'Student 1',
        class: 'Class 1',
        section: 'Section A',
        date: '2024-01-15',
        discipline: {
          points: 4,
          description: 'Good behavior, respectful to teachers',
          category: 'behavior'
        },
        uniform: {
          points: 5,
          description: 'Perfect uniform, clean and neat',
          issues: []
        },
        fitness: {
          points: 3,
          description: 'Participated in activities but needs improvement',
          activities: ['Running', 'Stretching']
        },
        adab: {
          points: 4,
          description: 'Good manners, polite speech',
          aspects: ['Respect', 'Politeness']
        },
        dailyLearning: {
          points: 4,
          description: 'Good progress in studies',
          areas: ['Quran', 'Hadith']
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
        totalPoints: 25,
        markedBy: 'Teacher 1'
      }
    ];

    setSuggestions(mockSuggestions);
    setApplications(mockApplications);
    setNamazTracking(mockNamazTracking);
    setScoringRecords(mockScoringRecords);
    setIsLoading(false);
  }, []);

  const handleAddSuggestion = (suggestionData: Omit<ParentSuggestion, 'id' | 'createdAt'>) => {
    const newSuggestion: ParentSuggestion = {
      ...suggestionData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setSuggestions([...suggestions, newSuggestion]);
  };

  const handleAddApplication = (applicationData: Omit<ParentApplication, 'id' | 'createdAt'>) => {
    const newApplication: ParentApplication = {
      ...applicationData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setApplications([...applications, newApplication]);
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Parent Portal</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Assalam-u-Alaikum. Access your child's information and communicate with the madrassah.
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'dashboard', name: 'Dashboard', icon: '📊' },
            { id: 'suggestions', name: 'Suggestions', icon: '💡' },
            { id: 'applications', name: 'Applications', icon: '📝' },
            { id: 'namaz', name: 'Namaz Tracking', icon: '🕌' },
            { id: 'scoring', name: 'Student Scoring', icon: '⭐' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'suggestions' && (
          <SuggestionsTab suggestions={suggestions} onAddSuggestion={handleAddSuggestion} />
        )}
        {activeTab === 'applications' && (
          <ApplicationsTab applications={applications} onAddApplication={handleAddApplication} />
        )}
        {activeTab === 'namaz' && <NamazTab namazTracking={namazTracking} />}
        {activeTab === 'scoring' && <ScoringTab scoringRecords={scoringRecords} />}
      </div>
    </div>
  );
};

const DashboardTab = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
            <span className="text-2xl">📊</span>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Attendance</h3>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">95%</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
            <span className="text-2xl">🕌</span>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Namaz</h3>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">98%</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
            <span className="text-2xl">⭐</span>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Overall Score</h3>
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">A+</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
            <span className="text-2xl">📚</span>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Progress</h3>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">85%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

interface SuggestionsTabProps {
  suggestions: ParentSuggestion[];
  onAddSuggestion: (suggestion: Omit<ParentSuggestion, 'id' | 'createdAt'>) => void;
}

const SuggestionsTab = ({ suggestions, onAddSuggestion }: SuggestionsTabProps) => {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Suggestions</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          Add Suggestion
        </button>
      </div>

      <div className="space-y-4">
        {suggestions.map((suggestion) => (
          <div key={suggestion.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {suggestion.subject || 'Suggestion'}
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">{suggestion.suggestion}</p>
                <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>Category: {suggestion.category}</span>
                  <span>Status: {suggestion.status}</span>
                  <span>Date: {new Date(suggestion.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                suggestion.status === 'pending' 
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  : suggestion.status === 'implemented'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {suggestion.status}
              </span>
            </div>
            {suggestion.response && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white">Response:</h4>
                <p className="mt-1 text-gray-600 dark:text-gray-400">{suggestion.response}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {showAddModal && (
        <SuggestionModal
          onClose={() => setShowAddModal(false)}
          onSave={onAddSuggestion}
        />
      )}
    </div>
  );
};

interface ApplicationsTabProps {
  applications: ParentApplication[];
  onAddApplication: (application: Omit<ParentApplication, 'id' | 'createdAt'>) => void;
}

const ApplicationsTab = ({ applications, onAddApplication }: ApplicationsTabProps) => {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Applications</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          Submit Application
        </button>
      </div>

      <div className="space-y-4">
        {applications.map((application) => (
          <div key={application.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {application.subject}
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-400">{application.description}</p>
                <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>Type: {application.type}</span>
                  <span>Status: {application.status}</span>
                  <span>Date: {new Date(application.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                application.status === 'pending' 
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  : application.status === 'approved'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {application.status}
              </span>
            </div>
            {application.response && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white">Response:</h4>
                <p className="mt-1 text-gray-600 dark:text-gray-400">{application.response}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {showAddModal && (
        <ApplicationModal
          onClose={() => setShowAddModal(false)}
          onSave={onAddApplication}
        />
      )}
    </div>
  );
};

interface NamazTabProps {
  namazTracking: NamazTracking[];
}

const NamazTab = ({ namazTracking }: NamazTabProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Namaz Tracking</h2>
      
      <div className="space-y-4">
        {namazTracking.map((record) => (
          <div key={record.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {record.student} - {new Date(record.date).toLocaleDateString()}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fajr & Isha */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">Prayers</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Fajr:</span>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        record.fajr.performed 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {record.fajr.performed ? '✓ Performed' : '✗ Missed'}
                      </span>
                      {record.fajr.time && <span className="text-xs text-gray-500">{record.fajr.time}</span>}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Isha:</span>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        record.isha.performed 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {record.isha.performed ? '✓ Performed' : '✗ Missed'}
                      </span>
                      {record.isha.time && <span className="text-xs text-gray-500">{record.isha.time}</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Family Interaction */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">Family Interaction</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Hand Kiss:</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      record.familyInteraction.handKiss 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {record.familyInteraction.handKiss ? '✓ Yes' : '✗ No'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Behavior Rating:</span>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-lg ${
                          i < record.familyInteraction.behaviorRating 
                            ? 'text-yellow-400' 
                            : 'text-gray-300 dark:text-gray-600'
                        }`}>
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                  {record.familyInteraction.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {record.familyInteraction.description}
                    </p>
                  )}
                </div>
              </div>

              {/* New Learning */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">New Learning</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Hadith:</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      record.newLearning.hadith.learned 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {record.newLearning.hadith.learned ? '✓ Learned' : '✗ Not Learned'}
                    </span>
                  </div>
                  {record.newLearning.hadith.text && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                      "{record.newLearning.hadith.text}"
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Sunnah:</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      record.newLearning.sunnah.learned 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {record.newLearning.sunnah.learned ? '✓ Learned' : '✗ Not Learned'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Weekly Reflection */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900 dark:text-white">Weekly Reflection</h4>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Question:</strong> {record.weeklyReflection.question}
                  </p>
                  {record.weeklyReflection.answered ? (
                    <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        <strong>Answer:</strong> {record.weeklyReflection.answer}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-500 italic">No answer provided</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

interface ScoringTabProps {
  scoringRecords: StudentScoring[];
}

const ScoringTab = ({ scoringRecords }: ScoringTabProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Student Scoring</h2>
      
      <div className="space-y-4">
        {scoringRecords.map((record) => (
          <div key={record.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {record.student} - {new Date(record.date).toLocaleDateString()}
              </h3>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {record.totalPoints}/30
                </div>
                <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                  A+
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { name: 'Discipline', points: record.discipline.points, max: 5 },
                { name: 'Uniform', points: record.uniform.points, max: 5 },
                { name: 'Fitness', points: record.fitness.points, max: 5 },
                { name: 'Adab', points: record.adab.points, max: 5 },
                { name: 'Learning', points: record.dailyLearning.points, max: 5 },
                { name: 'Salah', points: record.salah.points, max: 5 }
              ].map((item) => (
                <div key={item.name} className="text-center">
                  <div className="text-sm text-gray-600 dark:text-gray-400">{item.name}</div>
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {item.points}/{item.max}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Modal components would go here
const SuggestionModal = ({ onClose, onSave }: { onClose: () => void; onSave: (suggestion: Omit<ParentSuggestion, 'id' | 'createdAt'>) => void }) => {
  const [formData, setFormData] = useState({
    parent: 'Parent 1',
    student: 'Student 1',
    suggestion: '',
    category: 'general' as 'academic' | 'behavior' | 'health' | 'general' | 'other'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Add Suggestion</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Suggestion
            </label>
            <textarea
              value={formData.suggestion}
              onChange={(e) => setFormData({ ...formData, suggestion: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              rows={4}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="academic">Academic</option>
              <option value="behavior">Behavior</option>
              <option value="health">Health</option>
              <option value="general">General</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ApplicationModal = ({ onClose, onSave }: { onClose: () => void; onSave: (application: Omit<ParentApplication, 'id' | 'createdAt'>) => void }) => {
  const [formData, setFormData] = useState({
    parent: 'Parent 1',
    student: 'Student 1',
    type: 'leave' as 'leave' | 'transfer' | 'fee_exemption' | 'other',
    subject: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Submit Application</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="leave">Leave Request</option>
              <option value="transfer">Transfer Request</option>
              <option value="fee_exemption">Fee Exemption</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Subject
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
              rows={4}
              required
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
