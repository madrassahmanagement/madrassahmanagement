import { useState, useEffect } from 'react';
import { Report, Announcement, ExamType } from '../types';

export const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'daily' | 'weekly' | 'monthly' | 'fee' | 'exam' | 'announcements'>('overview');
  const [reports, setReports] = useState<Report[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [examTypes, setExamTypes] = useState<ExamType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    const mockReports: Report[] = [
    {
      id: '1',
        type: 'daily',
        title: 'Daily Attendance Report',
        description: 'Daily attendance summary for all classes',
        generatedBy: 'Admin',
        generatedAt: '2024-01-15T10:00:00Z',
        data: {
        totalStudents: 150,
          present: 142,
          absent: 8,
          percentage: 94.7
        },
        filters: {
          dateRange: {
            start: '2024-01-15',
            end: '2024-01-15'
          }
        },
        status: 'completed',
        filePath: '/reports/daily-attendance-2024-01-15.pdf'
    },
    {
      id: '2',
        type: 'weekly',
        title: 'Weekly Performance Report',
        description: 'Weekly performance summary for all students',
        generatedBy: 'Admin',
        generatedAt: '2024-01-14T15:30:00Z',
        data: {
          averageScore: 85.2,
          topPerformers: ['Student 1', 'Student 2', 'Student 3'],
          areasOfImprovement: ['Discipline', 'Fitness']
        },
        filters: {
          dateRange: {
            start: '2024-01-08',
            end: '2024-01-14'
          }
        },
        status: 'completed',
        filePath: '/reports/weekly-performance-2024-01-14.pdf'
    },
    {
      id: '3',
        type: 'monthly',
        title: 'Monthly Fee Report',
        description: 'Monthly fee collection and outstanding amounts',
        generatedBy: 'Admin',
        generatedAt: '2024-01-01T09:00:00Z',
        data: {
          totalFees: 150000,
          collected: 135000,
          outstanding: 15000,
          collectionRate: 90
        },
        filters: {
          dateRange: {
            start: '2024-01-01',
            end: '2024-01-31'
          }
        },
        status: 'completed',
        filePath: '/reports/monthly-fee-2024-01.pdf'
      }
    ];

    const mockAnnouncements: Announcement[] = [
      {
        id: '1',
        title: 'Monthly Exam Schedule',
        content: 'The monthly exam will be conducted from January 20-25, 2024. Please ensure all students are prepared.',
        type: 'exam',
        targetAudience: ['students', 'parents', 'teachers'],
        priority: 'high',
        publishedBy: 'Admin',
        publishedAt: '2024-01-10T10:00:00Z',
        expiresAt: '2024-01-25T23:59:59Z',
        isActive: true
      },
      {
        id: '2',
        title: 'Holiday Notice',
        content: 'The madrassah will be closed on January 26, 2024 for Republic Day.',
        type: 'holiday',
        targetAudience: ['all'],
        priority: 'medium',
        publishedBy: 'Admin',
        publishedAt: '2024-01-15T14:00:00Z',
        expiresAt: '2024-01-26T23:59:59Z',
        isActive: true
      }
    ];

    const mockExamTypes: ExamType[] = [
      {
        id: '1',
        name: 'Monthly Exam',
        nameArabic: 'الامتحان الشهري',
        type: 'monthly',
        description: 'Monthly assessment for all students',
        weight: 25,
        status: 'active'
      },
      {
        id: '2',
        name: 'Quarterly Exam',
        nameArabic: 'الامتحان ربع السنوي',
        type: 'quarterly',
        description: 'Quarterly assessment for all students',
        weight: 30,
        status: 'active'
      },
      {
        id: '3',
        name: 'Half-Yearly Exam',
        nameArabic: 'الامتحان نصف السنوي',
        type: 'half_yearly',
        description: 'Half-yearly assessment for all students',
        weight: 35,
        status: 'active'
      },
      {
        id: '4',
        name: 'Annual Exam',
        nameArabic: 'الامتحان السنوي',
        type: 'annual',
        description: 'Annual assessment for all students',
        weight: 40,
        status: 'active'
      }
    ];

        setReports(mockReports);
    setAnnouncements(mockAnnouncements);
    setExamTypes(mockExamTypes);
        setIsLoading(false);
  }, []);

  const handleGenerateReport = (type: string) => {
    const newReport: Report = {
        id: Date.now().toString(),
      type: type as any,
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Report`,
      description: `Generated ${type} report`,
      generatedBy: 'Admin',
        generatedAt: new Date().toISOString(),
      data: {},
      filters: {},
      status: 'generating'
    };
    setReports([newReport, ...reports]);
    
    // Simulate report generation
    setTimeout(() => {
      setReports(prev => prev.map(r => 
        r.id === newReport.id 
          ? { ...r, status: 'completed', filePath: `/reports/${type}-${Date.now()}.pdf` }
          : r
      ));
    }, 2000);
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reports & Announcements</h1>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Generate and manage reports and announcements
        </div>
        </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview', icon: '📊' },
            { id: 'daily', name: 'Daily Reports', icon: '📅' },
            { id: 'weekly', name: 'Weekly Reports', icon: '📈' },
            { id: 'monthly', name: 'Monthly Reports', icon: '📋' },
            { id: 'fee', name: 'Fee Reports', icon: '💰' },
            { id: 'exam', name: 'Exam Reports', icon: '📝' },
            { id: 'announcements', name: 'Announcements', icon: '📢' }
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
        {activeTab === 'overview' && <OverviewTab reports={reports} onGenerateReport={handleGenerateReport} />}
        {activeTab === 'daily' && <DailyReportsTab reports={reports.filter(r => r.type === 'daily')} onGenerateReport={handleGenerateReport} />}
        {activeTab === 'weekly' && <WeeklyReportsTab reports={reports.filter(r => r.type === 'weekly')} onGenerateReport={handleGenerateReport} />}
        {activeTab === 'monthly' && <MonthlyReportsTab reports={reports.filter(r => r.type === 'monthly')} onGenerateReport={handleGenerateReport} />}
        {activeTab === 'fee' && <FeeReportsTab reports={reports.filter(r => r.type === 'fee')} onGenerateReport={handleGenerateReport} />}
        {activeTab === 'exam' && <ExamReportsTab examTypes={examTypes} />}
        {activeTab === 'announcements' && <AnnouncementsTab announcements={announcements} />}
        </div>
      </div>
  );
};

interface OverviewTabProps {
  reports: Report[];
  onGenerateReport: (type: string) => void;
}

const OverviewTab = ({ reports, onGenerateReport }: OverviewTabProps) => {
  const recentReports = reports.slice(0, 5);
  const reportStats = {
    total: reports.length,
    completed: reports.filter(r => r.status === 'completed').length,
    generating: reports.filter(r => r.status === 'generating').length,
    failed: reports.filter(r => r.status === 'failed').length
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <span className="text-2xl">📊</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total Reports</h3>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{reportStats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Completed</h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{reportStats.completed}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900">
              <span className="text-2xl">⏳</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Generating</h3>
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{reportStats.generating}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900">
              <span className="text-2xl">❌</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Failed</h3>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{reportStats.failed}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { type: 'daily', name: 'Daily Report', icon: '📅', color: 'blue' },
            { type: 'weekly', name: 'Weekly Report', icon: '📈', color: 'green' },
            { type: 'monthly', name: 'Monthly Report', icon: '📋', color: 'purple' },
            { type: 'fee', name: 'Fee Report', icon: '💰', color: 'yellow' }
          ].map((action) => (
            <button
              key={action.type}
              onClick={() => onGenerateReport(action.type)}
              className={`p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-${action.color}-500 hover:bg-${action.color}-50 dark:hover:bg-${action.color}-900/20 transition-colors duration-200`}
            >
              <div className="text-center">
                <span className="text-3xl mb-2 block">{action.icon}</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{action.name}</span>
              </div>
            </button>
          ))}
        </div>
          </div>

      {/* Recent Reports */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent Reports</h3>
        <div className="space-y-4">
          {recentReports.map((report) => (
            <div key={report.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex items-center space-x-4">
                <span className="text-2xl">
                  {report.type === 'daily' ? '📅' : 
                   report.type === 'weekly' ? '📈' : 
                   report.type === 'monthly' ? '📋' : 
                   report.type === 'fee' ? '💰' : '📊'}
                </span>
              <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{report.title}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Generated by {report.generatedBy} • {new Date(report.generatedAt).toLocaleDateString()}
                  </p>
              </div>
            </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  report.status === 'completed' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : report.status === 'generating'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {report.status}
                </span>
                {report.status === 'completed' && (
                  <button className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300">
                    Download
                  </button>
          )}
        </div>
      </div>
          ))}
        </div>
      </div>
    </div>
  );
};

interface DailyReportsTabProps {
  reports: Report[];
  onGenerateReport: (type: string) => void;
}

const DailyReportsTab = ({ reports, onGenerateReport }: DailyReportsTabProps) => {
          return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Daily Reports</h2>
        <button
          onClick={() => onGenerateReport('daily')}
          className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          Generate Daily Report
        </button>
      </div>

      <div className="grid gap-6">
        {reports.map((report) => (
          <div key={report.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex justify-between items-start mb-4">
                    <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{report.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                  Generated by {report.generatedBy} • {new Date(report.generatedAt).toLocaleDateString()}
                      </p>
                    </div>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                report.status === 'completed' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  : report.status === 'generating'
                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
              }`}>
                {report.status}
              </span>
                </div>
                
            {report.data && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {Object.entries(report.data).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{value}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                  </div>
                ))}
                  </div>
            )}
                  </div>
        ))}
                  </div>
                </div>
  );
};

// Similar components for other tabs would go here
const WeeklyReportsTab = ({ reports, onGenerateReport }: DailyReportsTabProps) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Weekly Reports</h2>
                  <button
        onClick={() => onGenerateReport('weekly')}
        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
        Generate Weekly Report
                  </button>
    </div>
    <div className="text-center text-gray-500 dark:text-gray-400 py-8">
      Weekly reports will be displayed here
    </div>
  </div>
);

const MonthlyReportsTab = ({ reports, onGenerateReport }: DailyReportsTabProps) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Monthly Reports</h2>
                  <button
        onClick={() => onGenerateReport('monthly')}
        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
        Generate Monthly Report
                  </button>
    </div>
    <div className="text-center text-gray-500 dark:text-gray-400 py-8">
      Monthly reports will be displayed here
    </div>
  </div>
);

const FeeReportsTab = ({ reports, onGenerateReport }: DailyReportsTabProps) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Fee Reports</h2>
                  <button
        onClick={() => onGenerateReport('fee')}
        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
        Generate Fee Report
                  </button>
                </div>
    <div className="text-center text-gray-500 dark:text-gray-400 py-8">
      Fee reports will be displayed here
    </div>
  </div>
);

interface ExamReportsTabProps {
  examTypes: ExamType[];
}

const ExamReportsTab = ({ examTypes }: ExamReportsTabProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Exam Types</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {examTypes.map((examType) => (
          <div key={examType.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {examType.name}
              </h3>
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400 mb-2">
                {examType.nameArabic}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {examType.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Weight: {examType.weight}%
                </span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  examType.status === 'active' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {examType.status}
                </span>
                  </div>
                </div>
          </div>
        ))}
              </div>
            </div>
          );
};

interface AnnouncementsTabProps {
  announcements: Announcement[];
}

const AnnouncementsTab = ({ announcements }: AnnouncementsTabProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Announcements</h2>
        <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors duration-200">
          Create Announcement
                </button>
              </div>
              
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {announcement.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Published by {announcement.publishedBy} • {new Date(announcement.publishedAt).toLocaleDateString()}
                </p>
                </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  announcement.priority === 'urgent' 
                    ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    : announcement.priority === 'high'
                    ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                }`}>
                  {announcement.priority}
                </span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  announcement.isActive 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                }`}>
                  {announcement.isActive ? 'Active' : 'Inactive'}
                </span>
            </div>
          </div>

            <p className="text-gray-600 dark:text-gray-400 mb-4">{announcement.content}</p>

            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-4">
                <span>Type: {announcement.type}</span>
                <span>Audience: {announcement.targetAudience.join(', ')}</span>
        </div>
              {announcement.expiresAt && (
                <span>Expires: {new Date(announcement.expiresAt).toLocaleDateString()}</span>
      )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};