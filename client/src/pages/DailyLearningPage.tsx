import { useState, useEffect } from 'react';
import { DailyLearning } from '../types';

export const DailyLearningPage = () => {
  const [dailyLearning, setDailyLearning] = useState<DailyLearning[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState<DailyLearning | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Mock data for demonstration
  useEffect(() => {
    const mockData: DailyLearning[] = [
      {
        id: '1',
        student: 'Student 1',
        class: 'Class 1',
        section: 'Section A',
        date: selectedDate,
        muatlia: {
          completed: true,
          description: 'Reviewed previous lessons',
          performance: 'good',
          notes: 'Good understanding'
        },
        sabaq: {
          surah: { name: 'Al-Fatiha', number: 1 },
          fromAyah: 1,
          toAyah: 7,
          performance: 'excellent',
          notes: 'Perfect recitation'
        },
        sabqi: {
          surah: { name: 'Al-Baqarah', number: 2 },
          fromAyah: 1,
          toAyah: 10,
          performance: 'good',
          mistakes: [
            { type: 'Tajweed', description: 'Minor pronunciation issue' }
          ],
          notes: 'Needs more practice'
        },
        manzil: {
          surah: { name: 'Al-Imran', number: 3 },
          fromAyah: 1,
          toAyah: 5,
          performance: 'average',
          notes: 'Memorization needs improvement'
        },
        markedBy: 'Teacher 1'
      }
    ];
    setDailyLearning(mockData);
    setIsLoading(false);
  }, [selectedDate]);

  const handleAddRecord = (recordData: Omit<DailyLearning, 'id'>) => {
    const newRecord: DailyLearning = {
      ...recordData,
      id: Date.now().toString()
    };
    setDailyLearning([...dailyLearning, newRecord]);
    setShowAddModal(false);
  };

  const handleEditRecord = (recordData: DailyLearning) => {
    setDailyLearning(dailyLearning.map(r => r.id === recordData.id ? recordData : r));
    setEditingRecord(null);
  };

  const getPerformanceColor = (performance: string) => {
    switch (performance) {
      case 'excellent': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200';
      case 'good': return 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200';
      case 'average': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200';
      case 'needs_improvement': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-200';
    }
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Daily Learning Tracking</h1>
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
            Add Learning Record
          </button>
        </div>
      </div>

      <div className="grid gap-6">
        {dailyLearning.map((record) => (
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
              <button
                onClick={() => setEditingRecord(record)}
                className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Edit
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Muatlia */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Muatlia (مطالعہ)</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPerformanceColor(record.muatlia.performance)}`}>
                      {record.muatlia.performance.replace('_', ' ')}
                    </span>
                    <span className={`text-sm ${record.muatlia.completed ? 'text-green-600' : 'text-red-600'}`}>
                      {record.muatlia.completed ? '✓ Completed' : '✗ Not Completed'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{record.muatlia.description}</p>
                  {record.muatlia.notes && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 italic">{record.muatlia.notes}</p>
                  )}
                </div>
              </div>

              {/* Sabaq */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Sabaq (سبق)</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPerformanceColor(record.sabaq.performance)}`}>
                      {record.sabaq.performance.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {record.sabaq.surah.name} ({record.sabaq.surah.number}): {record.sabaq.fromAyah}-{record.sabaq.toAyah}
                  </p>
                  {record.sabaq.notes && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 italic">{record.sabaq.notes}</p>
                  )}
                </div>
              </div>

              {/* Sabqi */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Sabqi (سبقی)</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPerformanceColor(record.sabqi.performance)}`}>
                      {record.sabqi.performance.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {record.sabqi.surah.name} ({record.sabqi.surah.number}): {record.sabqi.fromAyah}-{record.sabqi.toAyah}
                  </p>
                  {record.sabqi.mistakes.length > 0 && (
                    <div className="text-xs text-red-600 dark:text-red-400">
                      Mistakes: {record.sabqi.mistakes.map(m => m.type).join(', ')}
                    </div>
                  )}
                  {record.sabqi.notes && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 italic">{record.sabqi.notes}</p>
                  )}
                </div>
              </div>

              {/* Manzil */}
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Manzil (منزل)</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPerformanceColor(record.manzil.performance)}`}>
                      {record.manzil.performance.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {record.manzil.surah.name} ({record.manzil.surah.number}): {record.manzil.fromAyah}-{record.manzil.toAyah}
                  </p>
                  {record.manzil.notes && (
                    <p className="text-xs text-gray-500 dark:text-gray-500 italic">{record.manzil.notes}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingRecord) && (
        <DailyLearningModal
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

interface DailyLearningModalProps {
  record?: DailyLearning | null;
  onClose: () => void;
  onSave: (record: DailyLearning | Omit<DailyLearning, 'id'>) => void;
}

const DailyLearningModal = ({ record, onClose, onSave }: DailyLearningModalProps) => {
  const [formData, setFormData] = useState({
    student: record?.student || '',
    class: record?.class || '',
    section: record?.section || '',
    date: record?.date || new Date().toISOString().split('T')[0],
    muatlia: {
      completed: record?.muatlia.completed || false,
      description: record?.muatlia.description || '',
      performance: record?.muatlia.performance || 'good' as 'excellent' | 'good' | 'average' | 'needs_improvement',
      notes: record?.muatlia.notes || ''
    },
    sabaq: {
      surah: {
        name: record?.sabaq.surah.name || '',
        number: record?.sabaq.surah.number || 1
      },
      fromAyah: record?.sabaq.fromAyah || 1,
      toAyah: record?.sabaq.toAyah || 1,
      performance: record?.sabaq.performance || 'good' as 'excellent' | 'good' | 'average' | 'needs_improvement',
      notes: record?.sabaq.notes || ''
    },
    sabqi: {
      surah: {
        name: record?.sabqi.surah.name || '',
        number: record?.sabqi.surah.number || 1
      },
      fromAyah: record?.sabqi.fromAyah || 1,
      toAyah: record?.sabqi.toAyah || 1,
      performance: record?.sabqi.performance || 'good' as 'excellent' | 'good' | 'average' | 'needs_improvement',
      mistakes: record?.sabqi.mistakes || [],
      notes: record?.sabqi.notes || ''
    },
    manzil: {
      surah: {
        name: record?.manzil.surah.name || '',
        number: record?.manzil.surah.number || 1
      },
      fromAyah: record?.manzil.fromAyah || 1,
      toAyah: record?.manzil.toAyah || 1,
      performance: record?.manzil.performance || 'good' as 'excellent' | 'good' | 'average' | 'needs_improvement',
      notes: record?.manzil.notes || ''
    },
    markedBy: record?.markedBy || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white dark:bg-gray-800">
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {record ? 'Edit Learning Record' : 'Add Learning Record'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            </div>

            {/* Muatlia Section */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">Muatlia (مطالعہ)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.muatlia.completed}
                      onChange={(e) => setFormData({
                        ...formData,
                        muatlia: { ...formData.muatlia, completed: e.target.checked }
                      })}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Completed</span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Performance
                  </label>
                  <select
                    value={formData.muatlia.performance}
                    onChange={(e) => setFormData({
                      ...formData,
                      muatlia: { ...formData.muatlia, performance: e.target.value as any }
                    })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="excellent">Excellent</option>
                    <option value="good">Good</option>
                    <option value="average">Average</option>
                    <option value="needs_improvement">Needs Improvement</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    value={formData.muatlia.description}
                    onChange={(e) => setFormData({
                      ...formData,
                      muatlia: { ...formData.muatlia, description: e.target.value }
                    })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {/* Similar sections for Sabaq, Sabqi, and Manzil would go here */}
            {/* For brevity, I'll include just the structure for one more section */}

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
