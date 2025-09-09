import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  ChartBarIcon,
  DocumentArrowDownIcon,
  CalendarIcon,
  FunnelIcon,
  EyeIcon,
  PrinterIcon,
  ShareIcon,
  AcademicCapIcon,
  UserGroupIcon,
  ClockIcon,
  StarIcon,
  HeartIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface ReportData {
  id: string;
  title: string;
  type: 'attendance' | 'performance' | 'discipline' | 'fitness' | 'fees' | 'comprehensive';
  dateRange: string;
  generatedBy: string;
  generatedAt: string;
  status: 'ready' | 'generating' | 'error';
  fileUrl?: string;
  summary: {
    totalStudents: number;
    totalTeachers: number;
    attendanceRate: number;
    performanceScore: number;
    disciplineIssues: number;
    fitnessScore: number;
  };
}

export const ReportsPage = () => {
  const [reports, setReports] = useState<ReportData[]>([]);
  const [filteredReports, setFilteredReports] = useState<ReportData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);

  // Mock data
  const mockReports: ReportData[] = [
    {
      id: '1',
      title: 'Monthly Attendance Report - January 2024',
      type: 'attendance',
      dateRange: '2024-01-01 to 2024-01-31',
      generatedBy: 'Admin User',
      generatedAt: '2024-01-31T10:30:00Z',
      status: 'ready',
      fileUrl: '/reports/attendance-jan-2024.pdf',
      summary: {
        totalStudents: 150,
        totalTeachers: 12,
        attendanceRate: 92.5,
        performanceScore: 85.2,
        disciplineIssues: 8,
        fitnessScore: 78.5
      }
    },
    {
      id: '2',
      title: 'Student Performance Analysis - Q1 2024',
      type: 'performance',
      dateRange: '2024-01-01 to 2024-03-31',
      generatedBy: 'Admin User',
      generatedAt: '2024-04-01T14:15:00Z',
      status: 'ready',
      fileUrl: '/reports/performance-q1-2024.pdf',
      summary: {
        totalStudents: 150,
        totalTeachers: 12,
        attendanceRate: 91.8,
        performanceScore: 87.3,
        disciplineIssues: 12,
        fitnessScore: 82.1
      }
    },
    {
      id: '3',
      title: 'Discipline Report - February 2024',
      type: 'discipline',
      dateRange: '2024-02-01 to 2024-02-29',
      generatedBy: 'Admin User',
      generatedAt: '2024-02-29T16:45:00Z',
      status: 'ready',
      fileUrl: '/reports/discipline-feb-2024.pdf',
      summary: {
        totalStudents: 150,
        totalTeachers: 12,
        attendanceRate: 93.2,
        performanceScore: 86.7,
        disciplineIssues: 5,
        fitnessScore: 80.3
      }
    },
    {
      id: '4',
      title: 'Comprehensive Annual Report 2023',
      type: 'comprehensive',
      dateRange: '2023-01-01 to 2023-12-31',
      generatedBy: 'Admin User',
      generatedAt: '2024-01-15T09:20:00Z',
      status: 'ready',
      fileUrl: '/reports/annual-2023.pdf',
      summary: {
        totalStudents: 145,
        totalTeachers: 11,
        attendanceRate: 89.5,
        performanceScore: 83.8,
        disciplineIssues: 45,
        fitnessScore: 76.2
      }
    }
  ];

  const reportTypes = [
    { value: 'attendance', label: 'Attendance', icon: ClockIcon },
    { value: 'performance', label: 'Performance', icon: StarIcon },
    { value: 'discipline', label: 'Discipline', icon: ExclamationTriangleIcon },
    { value: 'fitness', label: 'Fitness', icon: HeartIcon },
    { value: 'fees', label: 'Fees', icon: ChartBarIcon },
    { value: 'comprehensive', label: 'Comprehensive', icon: AcademicCapIcon }
  ];

  // Load reports
  useEffect(() => {
    const loadReports = async () => {
      try {
        // Try API first
        const token = localStorage.getItem('token');
        if (token && token !== 'mock-token') {
          const response = await fetch('http://localhost:5000/api/reports', {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json();
            const reportsData = data.reports || data.data || [];
            setReports(reportsData);
            setFilteredReports(reportsData);
            setIsLoading(false);
            return;
          }
        }

        // Use mock data
        setReports(mockReports);
        setFilteredReports(mockReports);
      } catch (error) {
        console.error('Error loading reports:', error);
        setReports(mockReports);
        setFilteredReports(mockReports);
      } finally {
        setIsLoading(false);
      }
    };

    loadReports();
  }, []);

  // Filter reports
  useEffect(() => {
    let filtered = reports;

    if (searchTerm) {
      filtered = filtered.filter(report =>
        report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        report.generatedBy.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedType) {
      filtered = filtered.filter(report => report.type === selectedType);
    }

    if (selectedStatus) {
      filtered = filtered.filter(report => report.status === selectedStatus);
    }

    setFilteredReports(filtered);
  }, [reports, searchTerm, selectedType, selectedStatus]);

  const getTypeIcon = (type: string) => {
    const typeConfig = reportTypes.find(t => t.value === type);
    return typeConfig ? typeConfig.icon : ChartBarIcon;
  };

  const getTypeLabel = (type: string) => {
    const typeConfig = reportTypes.find(t => t.value === type);
    return typeConfig ? typeConfig.label : type;
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ready: { color: 'bg-green-100 text-green-800', text: 'Ready' },
      generating: { color: 'bg-yellow-100 text-yellow-800', text: 'Generating' },
      error: { color: 'bg-red-100 text-red-800', text: 'Error' }
    };

    const config = statusConfig[status as keyof typeof statusConfig];

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const handleGenerateReport = async (reportType: string, dateRange: string) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newReport: ReportData = {
        id: Date.now().toString(),
        title: `${getTypeLabel(reportType)} Report - ${new Date().toLocaleDateString()}`,
        type: reportType as any,
        dateRange: dateRange,
        generatedBy: 'Current User',
        generatedAt: new Date().toISOString(),
        status: 'ready',
        fileUrl: `/reports/${reportType}-${Date.now()}.pdf`,
        summary: {
          totalStudents: Math.floor(Math.random() * 50) + 100,
          totalTeachers: Math.floor(Math.random() * 5) + 8,
          attendanceRate: Math.random() * 20 + 80,
          performanceScore: Math.random() * 20 + 75,
          disciplineIssues: Math.floor(Math.random() * 20),
          fitnessScore: Math.random() * 20 + 70
        }
      };
      
      setReports(prev => [newReport, ...prev]);
      setShowGenerateModal(false);
      toast.success('Report generated successfully!');
    } catch (error) {
      toast.error('Failed to generate report');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadReport = (report: ReportData) => {
    if (report.status === 'ready') {
      // Simulate download
      toast.success('Report download started');
    } else {
      toast.error('Report is not ready for download');
    }
  };

  const handlePrintReport = (report: ReportData) => {
    if (report.status === 'ready') {
      // Simulate print
      toast.success('Report sent to printer');
    } else {
      toast.error('Report is not ready for printing');
    }
  };

  const handleShareReport = (report: ReportData) => {
    if (report.status === 'ready') {
      // Simulate share
      toast.success('Report share link copied to clipboard');
    } else {
      toast.error('Report is not ready for sharing');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-grass-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="heading-lg">Reports & Analytics</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Generate, view, and manage comprehensive reports and analytics
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowGenerateModal(true)}
            className="btn btn-primary"
          >
            <ChartBarIcon className="h-4 w-4 mr-2" />
            Generate Report
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-grass-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Reports</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{reports.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Ready Reports</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {reports.filter(r => r.status === 'ready').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <StarIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Performance</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {Math.round(reports.reduce((acc, r) => acc + r.summary.performanceScore, 0) / reports.length)}%
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserGroupIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Attendance</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                {Math.round(reports.reduce((acc, r) => acc + r.summary.attendanceRate, 0) / reports.length)}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-outline"
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="label">Report Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="input mt-1"
                >
                  <option value="">All Types</option>
                  {reportTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="input mt-1"
                >
                  <option value="">All Status</option>
                  <option value="ready">Ready</option>
                  <option value="generating">Generating</option>
                  <option value="error">Error</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => {
                    setSelectedType('');
                    setSelectedStatus('');
                    setSearchTerm('');
                  }}
                  className="btn btn-outline w-full"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((report) => {
          const Icon = getTypeIcon(report.type);
          return (
            <div key={report.id} className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Icon className="h-8 w-8 text-grass-600 mr-3" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {getTypeLabel(report.type)}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {report.dateRange}
                      </p>
                    </div>
                  </div>
                  {getStatusBadge(report.status)}
                </div>
                
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  {report.title}
                </h4>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Students:</span>
                    <span className="text-gray-900 dark:text-white">{report.summary.totalStudents}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Attendance:</span>
                    <span className="text-gray-900 dark:text-white">{report.summary.attendanceRate.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400">Performance:</span>
                    <span className="text-gray-900 dark:text-white">{report.summary.performanceScore.toFixed(1)}%</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleDownloadReport(report)}
                    className="flex-1 btn btn-outline text-xs"
                    disabled={report.status !== 'ready'}
                  >
                    <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
                    Download
                  </button>
                  <button
                    onClick={() => handlePrintReport(report)}
                    className="flex-1 btn btn-outline text-xs"
                    disabled={report.status !== 'ready'}
                  >
                    <PrinterIcon className="h-4 w-4 mr-1" />
                    Print
                  </button>
                  <button
                    onClick={() => handleShareReport(report)}
                    className="flex-1 btn btn-outline text-xs"
                    disabled={report.status !== 'ready'}
                  >
                    <ShareIcon className="h-4 w-4 mr-1" />
                    Share
                  </button>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>Generated by: {report.generatedBy}</span>
                    <span>{new Date(report.generatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-12">
          <ChartBarIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No reports found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm || selectedType || selectedStatus
              ? 'Try adjusting your search criteria.'
              : 'Get started by generating a new report.'
            }
          </p>
        </div>
      )}

      {/* Generate Report Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="heading-md">Generate New Report</h3>
                <button
                  onClick={() => setShowGenerateModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-200"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target as HTMLFormElement);
                const reportType = formData.get('reportType') as string;
                const dateRange = formData.get('dateRange') as string;
                handleGenerateReport(reportType, dateRange);
              }} className="space-y-4">
                <div>
                  <label className="label">Report Type</label>
                  <select name="reportType" className="input mt-1" required>
                    <option value="">Select Report Type</option>
                    {reportTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">Date Range</label>
                  <select name="dateRange" className="input mt-1" required>
                    <option value="">Select Date Range</option>
                    <option value="last-week">Last Week</option>
                    <option value="last-month">Last Month</option>
                    <option value="last-quarter">Last Quarter</option>
                    <option value="last-year">Last Year</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowGenerateModal(false)}
                    className="btn btn-outline"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? 'Generating...' : 'Generate Report'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};