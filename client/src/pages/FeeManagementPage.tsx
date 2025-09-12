import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Fee } from '../types';

export const FeeManagementPage = () => {
  const { user } = useAuth();
  const [fees, setFees] = useState<Fee[]>([
    {
      id: '1',
      studentId: 'student-1',
      classId: 'class-1',
      feeType: 'monthly',
      amount: 2000,
      dueDate: '2024-02-01',
      paidAmount: 2000,
      paidDate: '2024-01-25',
      status: 'paid',
      paymentMethod: 'bank_transfer',
      transactionId: 'TXN123456789',
      notes: 'Paid on time',
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-25T10:00:00Z'
    },
    {
      id: '2',
      studentId: 'student-2',
      classId: 'class-1',
      feeType: 'monthly',
      amount: 2000,
      dueDate: '2024-02-01',
      paidAmount: 0,
      paidDate: undefined,
      status: 'pending',
      paymentMethod: undefined,
      transactionId: undefined,
      notes: 'Payment pending',
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-01T10:00:00Z'
    },
    {
      id: '3',
      studentId: 'student-3',
      classId: 'class-2',
      feeType: 'quarterly',
      amount: 6000,
      dueDate: '2024-03-31',
      paidAmount: 3000,
      paidDate: '2024-01-15',
      status: 'overdue',
      paymentMethod: 'cash',
      transactionId: undefined,
      notes: 'Partial payment received',
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '4',
      studentId: 'student-4',
      classId: 'class-1',
      feeType: 'annual',
      amount: 20000,
      dueDate: '2024-12-31',
      paidAmount: 0,
      paidDate: undefined,
      status: 'pending',
      paymentMethod: undefined,
      transactionId: undefined,
      notes: 'Annual fee due',
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-01T10:00:00Z'
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [selectedFee, setSelectedFee] = useState<Fee | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const [feeForm, setFeeForm] = useState({
    studentId: '',
    classId: '',
    feeType: 'monthly' as const,
    amount: 0,
    dueDate: '',
    notes: ''
  });

  const [paymentForm, setPaymentForm] = useState({
    paidAmount: 0,
    paidDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash' as const,
    transactionId: '',
    notes: ''
  });

  const students = [
    { id: 'student-1', name: 'Ahmed Khan', class: 'Class 5A', section: 'Section A' },
    { id: 'student-2', name: 'Fatima Ali', class: 'Class 5A', section: 'Section A' },
    { id: 'student-3', name: 'Muhammad Hassan', class: 'Class 5B', section: 'Section B' },
    { id: 'student-4', name: 'Aisha Ahmed', class: 'Class 5A', section: 'Section A' }
  ];

  const classes = [
    { id: 'class-1', name: 'Class 5A', monthlyFee: 2000 },
    { id: 'class-2', name: 'Class 5B', monthlyFee: 2000 },
    { id: 'class-3', name: 'Class 6A', monthlyFee: 2500 }
  ];

  const feeTypes = [
    { value: 'monthly', label: 'Monthly Fee', description: 'Regular monthly tuition fee' },
    { value: 'quarterly', label: 'Quarterly Fee', description: 'Three-month advance payment' },
    { value: 'annual', label: 'Annual Fee', description: 'Full year payment' },
    { value: 'admission', label: 'Admission Fee', description: 'One-time admission charge' },
    { value: 'exam', label: 'Exam Fee', description: 'Examination charges' },
    { value: 'other', label: 'Other', description: 'Miscellaneous charges' }
  ];

  const getStatusColor = (status: string) => {
    const colors = {
      paid: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200',
      pending: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200',
      overdue: 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200',
      waived: 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-200'
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      monthly: 'text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200',
      quarterly: 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200',
      annual: 'text-purple-600 bg-purple-100 dark:bg-purple-900 dark:text-purple-200',
      admission: 'text-orange-600 bg-orange-100 dark:bg-orange-900 dark:text-orange-200',
      exam: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900 dark:text-indigo-200',
      other: 'text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-200'
    };
    return colors[type as keyof typeof colors] || colors.other;
  };

  const getStudentName = (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    return student ? `${student.name} (${student.class})` : 'Unknown Student';
  };

  const getClassName = (classId: string) => {
    const classInfo = classes.find(c => c.id === classId);
    return classInfo ? classInfo.name : 'Unknown Class';
  };

  const handleFeeSubmit = () => {
    const newFee: Fee = {
      id: Date.now().toString(),
      ...feeForm,
      paidAmount: 0,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setFees(prev => [...prev, newFee]);
    setShowForm(false);
    setFeeForm({
      studentId: '',
      classId: '',
      feeType: 'monthly',
      amount: 0,
      dueDate: '',
      notes: ''
    });
  };

  const handlePaymentSubmit = () => {
    if (!selectedFee) return;

    const updatedFee: Fee = {
      ...selectedFee,
      paidAmount: paymentForm.paidAmount,
      paidDate: paymentForm.paidDate,
      paymentMethod: paymentForm.paymentMethod,
      transactionId: paymentForm.transactionId,
      status: paymentForm.paidAmount >= selectedFee.amount ? 'paid' : 'overdue',
      notes: paymentForm.notes,
      updatedAt: new Date().toISOString()
    };

    setFees(prev => prev.map(fee => fee.id === selectedFee.id ? updatedFee : fee));
    setShowPaymentForm(false);
    setSelectedFee(null);
    setPaymentForm({
      paidAmount: 0,
      paidDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'cash',
      transactionId: '',
      notes: ''
    });
  };

  const filteredFees = fees.filter(fee => {
    if (filterStatus !== 'all' && fee.status !== filterStatus) return false;
    if (filterType !== 'all' && fee.feeType !== filterType) return false;
    return true;
  });

  const totalFees = fees.reduce((sum, fee) => sum + fee.amount, 0);
  const collectedFees = fees.reduce((sum, fee) => sum + fee.paidAmount, 0);
  const pendingFees = fees.filter(fee => fee.status === 'pending').length;
  const overdueFees = fees.filter(fee => fee.status === 'overdue').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Fee Management 💰
        </h1>
        <p className="text-green-100">
          Manage student fees, payments, and financial tracking
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Total Fees</h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                ₹{totalFees.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
              <span className="text-2xl">✅</span>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Collected</h3>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                ₹{collectedFees.toLocaleString()}
              </p>
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
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {pendingFees}
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
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Overdue</h3>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                {overdueFees}
              </p>
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
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="overdue">Overdue</option>
            <option value="waived">Waived</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="all">All Types</option>
            {feeTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary-500 text-white px-4 py-2 rounded hover:bg-primary-600 transition-colors"
          >
            Add Fee
          </button>
        </div>
      </div>

      {/* Fees List */}
      <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Fee Records</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Student
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Fee Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Paid Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Payment Method
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredFees.map((fee) => (
                <tr key={fee.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {getStudentName(fee.studentId)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(fee.feeType)}`}>
                      {feeTypes.find(t => t.value === fee.feeType)?.label || fee.feeType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    ₹{fee.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {new Date(fee.dueDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    ₹{fee.paidAmount.toLocaleString()}
                    {fee.paidAmount > 0 && fee.paidAmount < fee.amount && (
                      <div className="text-xs text-yellow-600 dark:text-yellow-400">
                        (Partial)
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(fee.status)}`}>
                      {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {fee.paymentMethod ? (
                      <span className="capitalize">
                        {fee.paymentMethod.replace('_', ' ')}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      {fee.status !== 'paid' && (
                        <button
                          onClick={() => {
                            setSelectedFee(fee);
                            setPaymentForm(prev => ({
                              ...prev,
                              paidAmount: fee.amount - fee.paidAmount
                            }));
                            setShowPaymentForm(true);
                          }}
                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                        >
                          Pay
                        </button>
                      )}
                      <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                        View
                      </button>
                      <button className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300">
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

      {/* Add Fee Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Add New Fee
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Student
                  </label>
                  <select
                    value={feeForm.studentId}
                    onChange={(e) => setFeeForm(prev => ({ ...prev, studentId: e.target.value }))}
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
                    Fee Type
                  </label>
                  <select
                    value={feeForm.feeType}
                    onChange={(e) => setFeeForm(prev => ({ ...prev, feeType: e.target.value as any }))}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    {feeTypes.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={feeForm.amount}
                    onChange={(e) => setFeeForm(prev => ({ ...prev, amount: parseInt(e.target.value) }))}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={feeForm.dueDate}
                    onChange={(e) => setFeeForm(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Notes
                  </label>
                  <textarea
                    value={feeForm.notes}
                    onChange={(e) => setFeeForm(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleFeeSubmit}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
                  >
                    Add Fee
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Payment Form Modal */}
      {showPaymentForm && selectedFee && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Record Payment
              </h3>
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Student: {getStudentName(selectedFee.studentId)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total Amount: ₹{selectedFee.amount.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Already Paid: ₹{selectedFee.paidAmount.toLocaleString()}
                  </div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    Remaining: ₹{(selectedFee.amount - selectedFee.paidAmount).toLocaleString()}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Payment Amount (₹)
                  </label>
                  <input
                    type="number"
                    value={paymentForm.paidAmount}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, paidAmount: parseInt(e.target.value) }))}
                    max={selectedFee.amount - selectedFee.paidAmount}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Payment Date
                  </label>
                  <input
                    type="date"
                    value={paymentForm.paidDate}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, paidDate: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Payment Method
                  </label>
                  <select
                    value={paymentForm.paymentMethod}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, paymentMethod: e.target.value as any }))}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="cash">Cash</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="mobile_banking">Mobile Banking</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Transaction ID
                  </label>
                  <input
                    type="text"
                    value={paymentForm.transactionId}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, transactionId: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Notes
                  </label>
                  <textarea
                    value={paymentForm.notes}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowPaymentForm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePaymentSubmit}
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md"
                  >
                    Record Payment
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
