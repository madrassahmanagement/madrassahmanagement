import { useState, useEffect } from 'react';
import { StudentScoring } from '../types';

export const StudentScoringPage = () => {
  const [scoringRecords, setScoringRecords] = useState<StudentScoring[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<StudentScoring | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Mock data for demonstration
  useEffect(() => {
    const mockData: StudentScoring[] = [
      {
        id: '1',
        student: 'Student 1',
        class: 'Class 1',
        section: 'Section A',
        date: selectedDate,
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
    setScoringRecords(mockData);
    setIsLoading(false);
  }, [selectedDate]);

  const handleAddRecord = (recordData: Omit<StudentScoring, 'id'>) => {
    const newRecord: StudentScoring = {
      ...recordData,
      id: Date.now().toString()
    };
    setScoringRecords([...scoringRecords, newRecord]);
    setShowAddModal(false);
  };

  const handleEditRecord = (recordData: StudentScoring) => {
    setScoringRecords(scoringRecords.map(r => r.id === recordData.id ? recordData : r));
    setEditingRecord(null);
  };

  const getPointsColor = (points: number) => {
    if (points >= 4) return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200';
    if (points >= 3) return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200';
    return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200';
  };

  const getTotalGrade = (totalPoints: number) => {
    if (totalPoints >= 25) return { grade: 'A+', color: 'text-green-600' };
    if (totalPoints >= 22) return { grade: 'A', color: 'text-green-600' };
    if (totalPoints >= 19) return { grade: 'B+', color: 'text-blue-600' };
    if (totalPoints >= 16) return { grade: 'B', color: 'text-blue-600' };
    if (totalPoints >= 13) return { grade: 'C+', color: 'text-yellow-600' };
    if (totalPoints >= 10) return { grade: 'C', color: 'text-yellow-600' };
    return { grade: 'D', color: 'text-red-600' };
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Student Scoring System</h1>
        <div className="flex space-x-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            Add Scoring Record
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {scoringRecords.map((record) => {
          const totalGrade = getTotalGrade(record.totalPoints);
          return (
            <div key={record.id} className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {record.student} - {record.class} {record.section}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(record.date).toLocaleDateString()} • Marked by {record.markedBy}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {record.totalPoints}/30
                  </div>
                  <div className={`text-lg font-semibold ${totalGrade.color}`}>
                    {totalGrade.grade}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Discipline */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Discipline (5 points)</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Points:</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPointsColor(record.discipline.points)}`}>
                        {record.discipline.points}/5
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{record.discipline.description}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 capitalize">
                      Category: {record.discipline.category}
                    </p>
                  </div>
                </div>

                {/* Uniform */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Uniform (5 points)</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Points:</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPointsColor(record.uniform.points)}`}>
                        {record.uniform.points}/5
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{record.uniform.description}</p>
                    {record.uniform.issues.length > 0 && (
                      <p className="text-xs text-red-600 dark:text-red-400">
                        Issues: {record.uniform.issues.join(', ')}
                      </p>
                    )}
                  </div>
                </div>

                {/* Fitness */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Fitness (5 points)</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Points:</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPointsColor(record.fitness.points)}`}>
                        {record.fitness.points}/5
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{record.fitness.description}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Activities: {record.fitness.activities.join(', ')}
                    </p>
                  </div>
                </div>

                {/* Adab */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Adab (5 points)</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Points:</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPointsColor(record.adab.points)}`}>
                        {record.adab.points}/5
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{record.adab.description}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Aspects: {record.adab.aspects.join(', ')}
                    </p>
                  </div>
                </div>

                {/* Daily Learning */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Daily Learning (5 points)</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Points:</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPointsColor(record.dailyLearning.points)}`}>
                        {record.dailyLearning.points}/5
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{record.dailyLearning.description}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      Areas: {record.dailyLearning.areas.join(', ')}
                    </p>
                  </div>
                </div>

                {/* Salah */}
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Salah (5 points)</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Points:</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPointsColor(record.salah.points)}`}>
                        {record.salah.points}/5
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{record.salah.description}</p>
                    <div className="grid grid-cols-5 gap-1 text-xs">
                      {Object.entries(record.salah.prayers).map(([prayer, performed]) => (
                        <div key={prayer} className="text-center">
                          <div className={`w-6 h-6 rounded-full mx-auto flex items-center justify-center ${
                            performed ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {performed ? '✓' : '✗'}
                          </div>
                          <span className="text-xs capitalize">{prayer}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setEditingRecord(record)}
                  className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                >
                  Edit Record
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingRecord) && (
        <StudentScoringModal
          record={editingRecord}
          onClose={() => {
            setShowAddModal(false);
            setEditingRecord(null);
          }}
          onSave={editingRecord ? handleEditRecord : handleAddRecord}
        />
      )}
    </div>
  );
};

interface StudentScoringModalProps {
  record?: StudentScoring | null;
  onClose: () => void;
  onSave: (record: StudentScoring | Omit<StudentScoring, 'id'>) => void;
}

const StudentScoringModal = ({ record, onClose, onSave }: StudentScoringModalProps) => {
  const [formData, setFormData] = useState({
    student: record?.student || '',
    class: record?.class || '',
    section: record?.section || '',
    date: record?.date || new Date().toISOString().split('T')[0],
    discipline: {
      points: record?.discipline.points || 0,
      description: record?.discipline.description || '',
      category: record?.discipline.category || 'behavior' as 'behavior' | 'respect' | 'punctuality' | 'cooperation' | 'other'
    },
    uniform: {
      points: record?.uniform.points || 0,
      description: record?.uniform.description || '',
      issues: record?.uniform.issues || []
    },
    fitness: {
      points: record?.fitness.points || 0,
      description: record?.fitness.description || '',
      activities: record?.fitness.activities || []
    },
    adab: {
      points: record?.adab.points || 0,
      description: record?.adab.description || '',
      aspects: record?.adab.aspects || []
    },
    dailyLearning: {
      points: record?.dailyLearning.points || 0,
      description: record?.dailyLearning.description || '',
      areas: record?.dailyLearning.areas || []
    },
    salah: {
      points: record?.salah.points || 0,
      description: record?.salah.description || '',
      prayers: {
        fajr: record?.salah.prayers.fajr || false,
        dhuhr: record?.salah.prayers.dhuhr || false,
        asr: record?.salah.prayers.asr || false,
        maghrib: record?.salah.prayers.maghrib || false,
        isha: record?.salah.prayers.isha || false
      }
    },
    markedBy: record?.markedBy || ''
  });

  const calculateTotalPoints = () => {
    return formData.discipline.points + formData.uniform.points + formData.fitness.points + 
           formData.adab.points + formData.dailyLearning.points + formData.salah.points;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalPoints = calculateTotalPoints();
    onSave({ ...formData, totalPoints });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-5 mx-auto p-5 border w-11/12 max-w-6xl shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {record ? 'Edit Scoring Record' : 'Add Scoring Record'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Student
                </label>
                <input
                  type="text"
                  value={formData.student}
                  onChange={(e) => setFormData({ ...formData, student: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Class
                </label>
                <input
                  type="text"
                  value={formData.class}
                  onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Section
                </label>
                <input
                  type="text"
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
            </div>

            {/* Scoring Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Discipline */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Discipline (5 points)</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Points (0-5)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      value={formData.discipline.points}
                      onChange={(e) => setFormData({
                        ...formData,
                        discipline: { ...formData.discipline, points: parseInt(e.target.value) || 0 }
                      })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Description
                    </label>
                    <textarea
                      value={formData.discipline.description}
                      onChange={(e) => setFormData({
                        ...formData,
                        discipline: { ...formData.discipline, description: e.target.value }
                      })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Category
                    </label>
                    <select
                      value={formData.discipline.category}
                      onChange={(e) => setFormData({
                        ...formData,
                        discipline: { ...formData.discipline, category: e.target.value as any }
                      })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="behavior">Behavior</option>
                      <option value="respect">Respect</option>
                      <option value="punctuality">Punctuality</option>
                      <option value="cooperation">Cooperation</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Similar sections for other categories would go here */}
              {/* For brevity, I'll include the structure for one more section */}

              {/* Salah */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Salah (5 points)</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Points (0-5)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      value={formData.salah.points}
                      onChange={(e) => setFormData({
                        ...formData,
                        salah: { ...formData.salah, points: parseInt(e.target.value) || 0 }
                      })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Description
                    </label>
                    <textarea
                      value={formData.salah.description}
                      onChange={(e) => setFormData({
                        ...formData,
                        salah: { ...formData.salah, description: e.target.value }
                      })}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Prayers Performed
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {Object.entries(formData.salah.prayers).map(([prayer, performed]) => (
                        <label key={prayer} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={performed}
                            onChange={(e) => setFormData({
                              ...formData,
                              salah: {
                                ...formData.salah,
                                prayers: { ...formData.salah.prayers, [prayer]: e.target.checked }
                              }
                            })}
                            className="mr-1"
                          />
                          <span className="text-xs capitalize">{prayer}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Total Points Display */}
            <div className="bg-primary-50 dark:bg-primary-900 p-4 rounded-lg">
              <div className="text-center">
                <h4 className="text-lg font-medium text-primary-900 dark:text-primary-100">
                  Total Points: {calculateTotalPoints()}/30
                </h4>
                <p className="text-sm text-primary-700 dark:text-primary-300">
                  Grade: {calculateTotalPoints() >= 25 ? 'A+' : calculateTotalPoints() >= 22 ? 'A' : calculateTotalPoints() >= 19 ? 'B+' : calculateTotalPoints() >= 16 ? 'B' : calculateTotalPoints() >= 13 ? 'C+' : calculateTotalPoints() >= 10 ? 'C' : 'D'}
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-md transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md transition-colors duration-200"
              >
                {record ? 'Update' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
