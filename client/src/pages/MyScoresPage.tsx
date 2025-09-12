import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';

export const MyScoresPage = () => {
  const { user } = useAuth();
  const [scores, setScores] = useState({
    overall: 87,
    discipline: 92,
    uniform: 88,
    fitness: 85,
    adab: 90,
    dailyLearning: 89,
    salah: 91
  });

  const [scoreHistory, setScoreHistory] = useState([
    {
      id: 1,
      date: '2024-01-20',
      discipline: 95,
      uniform: 90,
      fitness: 85,
      adab: 92,
      dailyLearning: 88,
      salah: 94,
      overall: 91
    },
    {
      id: 2,
      date: '2024-01-19',
      discipline: 88,
      uniform: 85,
      fitness: 80,
      adab: 87,
      dailyLearning: 85,
      salah: 89,
      overall: 86
    },
    {
      id: 3,
      date: '2024-01-18',
      discipline: 90,
      uniform: 88,
      fitness: 82,
      adab: 89,
      dailyLearning: 87,
      salah: 91,
      overall: 88
    }
  ]);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 80) return 'text-blue-600 dark:text-blue-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 dark:bg-green-900';
    if (score >= 80) return 'bg-blue-100 dark:bg-blue-900';
    if (score >= 70) return 'bg-yellow-100 dark:bg-yellow-900';
    return 'bg-red-100 dark:bg-red-900';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          My Scores ⭐
        </h1>
        <p className="text-yellow-100">
          Track your performance across all evaluation criteria
        </p>
      </div>

      {/* Overall Score */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Overall Performance</h2>
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-gray-200 dark:text-gray-700"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-blue-500"
                stroke="currentColor"
                strokeWidth="3"
                fill="none"
                strokeDasharray={`${scores.overall}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-gray-900 dark:text-white">
                {scores.overall}%
              </span>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Keep up the excellent work!
          </p>
        </div>
      </div>

      {/* Individual Scores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Discipline</h3>
            <span className={`px-2 py-1 rounded-full text-sm font-semibold ${getScoreBgColor(scores.discipline)} ${getScoreColor(scores.discipline)}`}>
              {scores.discipline}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full" 
              style={{ width: `${scores.discipline}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Uniform</h3>
            <span className={`px-2 py-1 rounded-full text-sm font-semibold ${getScoreBgColor(scores.uniform)} ${getScoreColor(scores.uniform)}`}>
              {scores.uniform}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full" 
              style={{ width: `${scores.uniform}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Fitness</h3>
            <span className={`px-2 py-1 rounded-full text-sm font-semibold ${getScoreBgColor(scores.fitness)} ${getScoreColor(scores.fitness)}`}>
              {scores.fitness}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-red-500 h-2 rounded-full" 
              style={{ width: `${scores.fitness}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Adab</h3>
            <span className={`px-2 py-1 rounded-full text-sm font-semibold ${getScoreBgColor(scores.adab)} ${getScoreColor(scores.adab)}`}>
              {scores.adab}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-yellow-500 h-2 rounded-full" 
              style={{ width: `${scores.adab}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Daily Learning</h3>
            <span className={`px-2 py-1 rounded-full text-sm font-semibold ${getScoreBgColor(scores.dailyLearning)} ${getScoreColor(scores.dailyLearning)}`}>
              {scores.dailyLearning}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-purple-500 h-2 rounded-full" 
              style={{ width: `${scores.dailyLearning}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Salah (Namaz)</h3>
            <span className={`px-2 py-1 rounded-full text-sm font-semibold ${getScoreBgColor(scores.salah)} ${getScoreColor(scores.salah)}`}>
              {scores.salah}%
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-indigo-500 h-2 rounded-full" 
              style={{ width: `${scores.salah}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Score History */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Score History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
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
                  Overall
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {scoreHistory.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {entry.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {entry.discipline}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {entry.uniform}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {entry.fitness}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {entry.adab}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {entry.dailyLearning}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {entry.salah}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {entry.overall}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
