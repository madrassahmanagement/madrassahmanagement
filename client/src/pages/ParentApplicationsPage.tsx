import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { ParentApplication } from '../types';

export const ParentApplicationsPage = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState<ParentApplication[]>([
    {
      id: '1',
      parentId: 'parent-1',
      studentId: 'student-1',
      type: 'leave',
      subject: 'Medical Leave Request',
      description: 'My child Ahmed Khan needs to take leave for 3 days due to a family medical emergency. We need to travel to another city for treatment.',
      supportingDocuments: ['medical_certificate.pdf', 'doctor_note.pdf'],
      status: 'pending',
      createdAt: '2024-01-20T10:00:00Z',
      updatedAt: '2024-01-20T10:00:00Z'
    },
    {
      id: '2',
      parentId: 'parent-2',
      studentId: 'student-2',
      type: 'fee_exemption',
      subject: 'Fee Exemption Request',
      description: 'Due to financial difficulties, I would like to request a partial fee exemption for this quarter. I can provide necessary documentation.',
      supportingDocuments: ['income_certificate.pdf', 'bank_statement.pdf'],
      status: 'approved',
      reviewedBy: 'admin-1',
      reviewedAt: '2024-01-22T14:30:00Z',
      response: 'Your request has been approved. You will receive a 50% fee exemption for this quarter.',
      createdAt: '2024-01-20T10:00:00Z',
      updatedAt: '2024-01-22T14:30:00Z'
    },
    {
      id: '3',
      parentId: 'parent-3',
      studentId: 'student-3',
      type: 'transfer',
      subject: 'Class Transfer Request',
      description: 'I would like to request a transfer for my child from Class 5B to Class 5A due to scheduling conflicts with our family routine.',
      supportingDocuments: [],
      status: 'rejected',
      reviewedBy: 'nazim-1',
      reviewedAt: '2024-01-25T09:15:00Z',
      response: 'Unfortunately, we cannot accommodate this transfer request as Class 5A is at full capacity.',
      createdAt: '2024-01-20T10:00:00Z',
      updatedAt: '2024-01-25T09:15:00Z'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const [applicationForm, setApplicationForm] = useState({
    studentId: '',
    type: 'leave' as const,
    subject: '',
    description: '',
    supportingDocuments: [] as string[]
  });

  const students = [
    { id: 'student-1', name: 'Ahmed Khan', class: 'Class 5A', section: 'Section A' },
    { id: 'student-2', name: 'Fatima Ali', class: 'Class 5A', section: 'Section A' },
    { id: 'student-3', name: 'Muhammad Hassan', class: 'Class 5B', section: 'Section B' }
  ];

  const applicationTypes = [
    { 
      value: 'leave', 
      label: 'Leave Application', 
      description: 'Request for student leave',
      icon: '📅',
      maxDays: 30
    },
    { 
      value: 'transfer', 
      label: 'Transfer Request', 
      description: 'Request to transfer student to different class/section',
      icon: '🔄',
      maxDays: 0
    },
    { 
      value: 'fee_exemption', 
      label: 'Fee Exemption', 
      description: 'Request for fee reduction or exemption',
      icon: '💰',
      maxDays: 0
    },
    { 
      value: 'other', 
      label: 'Other Application', 
      description: 'Other requests or applications',
      icon: '📋',
      maxDays: 0
    }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200',
      approved: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200',
      rejected: 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      leave: 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200',
      transfer: 'text-purple-600 bg-purple-100 dark:bg-purple-900 dark:text-purple-200',
      fee_exemption: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200',
      other: 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-200'
    };
    return colors[type as keyof typeof colors] || colors.other;
  };

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.name} (${student.class})` : 'Unknown Student';
  };

  const handleSubmit = () => {
    const newApplication: ParentApplication = {
      id: Date.now().toString(),
      parentId: user?.id || 'parent-1',
      ...applicationForm,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setApplications(prev => [...prev, newApplication]);
    setShowForm(false);
    setApplicationForm({
      studentId: '',
      type: 'leave',
      subject: '',
      description: '',
      supportingDocuments: []
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileNames = Array.from(files).map(file => file.name);
      setApplicationForm(prev => ({
        ...prev,
        supportingDocuments: [...prev.supportingDocuments, ...fileNames]
      }));
    }
  };

  const filteredApplications = applications.filter(application => {
    if (filterStatus !== 'all' && application.status !== filterStatus) return false;
    if (filterType !== 'all' && application.type !== filterType) return false;
    return true;
  });

  const pendingCount = applications.filter(a => a.status === 'pending').length;
  const approvedCount = applications.filter(a => a.status === 'approved').length;
  const rejectedCount = applications.filter(a => a.status === 'rejected').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Parent Applications 📋
        </h1>
        <p className="text-purple-100">
          Submit applications for leave, transfers, fee exemptions, and other requests
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
              <span className="text-2xl">📋</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total Applications</h3>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{applications.length}</p>
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
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Approved</h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{approvedCount}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-red-100 dark:bg-red-900">
              <span className="text-2xl">❌</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Rejected</h3>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{rejectedCount}</p>
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
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="all">All Types</option>
            {applicationTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600 transition-colors"
        >
          Submit Application
        </button>
      </div>

      {/* Applications List */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Your Applications</h2>
        </div>
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredApplications.map((application) => (
            <div key={application.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">
                      {applicationTypes.find(t => t.value === application.type)?.icon || '📋'}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(application.status)}`}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(application.type)}`}>
                      {applicationTypes.find(t => t.value === application.type)?.label || application.type}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {getStudentName(application.studentId)}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    {application.subject}
                  </h3>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    {application.description}
                  </p>

                  {application.supportingDocuments.length > 0 && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        Supporting Documents:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {application.supportingDocuments.map((doc, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          >
                            📄 {doc}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Submitted: {new Date(application.createdAt).toLocaleDateString()}
                  </div>

                  {application.response && (
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Response from {application.reviewedBy}:
                      </h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {application.response}
                      </p>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Reviewed: {application.reviewedAt ? new Date(application.reviewedAt).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Application Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Submit New Application
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Student
                  </label>
                  <select
                    value={applicationForm.studentId}
                    onChange={(e) => setApplicationForm(prev => ({ ...prev, studentId: e.target.value }))}
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
                    Application Type
                  </label>
                  <select
                    value={applicationForm.type}
                    onChange={(e) => setApplicationForm(prev => ({ ...prev, type: e.target.value as any }))}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    {applicationTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.label} - {type.description}
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
                    value={applicationForm.subject}
                    onChange={(e) => setApplicationForm(prev => ({ ...prev, subject: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Brief subject of your application"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea
                    value={applicationForm.description}
                    onChange={(e) => setApplicationForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={6}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Please provide detailed information about your request..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Supporting Documents (Optional)
                  </label>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="mt-1 block w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900 dark:file:text-blue-200"
                  />
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Upload relevant documents to support your application (PDF, JPG, PNG)
                  </p>
                </div>

                {applicationForm.supportingDocuments.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Selected Documents:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {applicationForm.supportingDocuments.map((doc, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        >
                          📄 {doc}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <span className="text-blue-400">ℹ️</span>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        Application Guidelines
                      </h3>
                      <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
                        <ul className="list-disc list-inside space-y-1">
                          <li>Provide clear and detailed information</li>
                          <li>Include relevant supporting documents</li>
                          <li>Submit applications well in advance when possible</li>
                          <li>Be specific about dates and reasons</li>
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
                    disabled={!applicationForm.studentId || !applicationForm.subject.trim() || !applicationForm.description.trim()}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
                  >
                    Submit Application
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
