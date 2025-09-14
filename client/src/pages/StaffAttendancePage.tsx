import { useEffect, useState } from 'react';
import { CalendarIcon, CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

interface StaffMember {
  id: string;
  name: string;
  role: 'sweeper' | 'gardener' | 'guard' | 'clerk' | 'other';
}

interface StaffAttendanceRecord {
  id: string;
  staffId: string;
  staffName: string;
  role: StaffMember['role'];
  date: string; // ISO yyyy-mm-dd
  status: 'present' | 'absent' | 'late' | 'excused';
  timeIn?: string; // HH:mm
  remarks?: string;
}

export const StaffAttendancePage = () => {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [records, setRecords] = useState<StaffAttendanceRecord[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filterRole, setFilterRole] = useState<StaffMember['role'] | ''>('');

  useEffect(() => {
    // Seed staff if none
    let stored = localStorage.getItem('staff');
    let parsed: StaffMember[] = [];
    if (stored) {
      try { parsed = JSON.parse(stored); } catch { parsed = []; }
    }
    if (!parsed || parsed.length === 0) {
      parsed = [
        { id: 'st1', name: 'Muhammad Ali', role: 'guard' },
        { id: 'st2', name: 'Aslam Khan', role: 'sweeper' },
        { id: 'st3', name: 'Imran Nazir', role: 'gardener' },
        { id: 'st4', name: 'Shahzad Iqbal', role: 'clerk' },
      ];
      localStorage.setItem('staff', JSON.stringify(parsed));
    }
    setStaff(parsed);

    const storedAtt = localStorage.getItem('staffAttendance');
    if (storedAtt) {
      try { setRecords(JSON.parse(storedAtt)); } catch { setRecords([]); }
    }
  }, []);

  const today = (date: string, role?: string) =>
    records.filter(r => r.date === date && (!role || r.role === role));

  const filteredStaff = staff.filter(s => !filterRole || s.role === filterRole);

  const mark = (s: StaffMember, status: StaffAttendanceRecord['status']) => {
    const existing = records.find(r => r.staffId === s.id && r.date === selectedDate);
    const rec: StaffAttendanceRecord = {
      id: existing?.id || `${Date.now()}-${s.id}`,
      staffId: s.id,
      staffName: s.name,
      role: s.role,
      date: selectedDate,
      status,
      timeIn: status === 'present' || status === 'late' ? new Date().toTimeString().slice(0,5) : undefined,
    };
    const updated = existing
      ? records.map(r => (r.id === existing.id ? rec : r))
      : [...records, rec];
    setRecords(updated);
    localStorage.setItem('staffAttendance', JSON.stringify(updated));
  };

  const roles: StaffMember['role'][] = ['sweeper','gardener','guard','clerk','other'];
  const stats = {
    total: filteredStaff.length,
    present: today(selectedDate, filterRole || undefined).filter(r => r.status === 'present').length,
    absent: today(selectedDate, filterRole || undefined).filter(r => r.status === 'absent').length,
    late: today(selectedDate, filterRole || undefined).filter(r => r.status === 'late').length,
    excused: today(selectedDate, filterRole || undefined).filter(r => r.status === 'excused').length,
  };

  return (
    <div className="space-y-6">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">Staff Attendance</h1>
          <p className="mt-1 text-sm text-gray-500">Mark attendance for non-teaching staff</p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value as any)}
              className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              <option value="">All</option>
              {roles.map(r => (
                <option key={r} value={r}>{r[0].toUpperCase()+r.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStaff.map((s) => {
                  const rec = today(selectedDate).find(r => r.staffId === s.id);
                  return (
                    <tr key={s.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{s.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{s.role[0].toUpperCase()+s.role.slice(1)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {rec ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {rec.status[0].toUpperCase()+rec.status.slice(1)}
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Not Marked</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rec?.timeIn || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex flex-wrap gap-2">
                          <button onClick={() => mark(s, 'present')} className="inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-medium bg-green-50 text-green-700 hover:bg-green-100">
                            <CheckCircleIcon className="h-4 w-4 mr-1" /> Present
                          </button>
                          <button onClick={() => mark(s, 'absent')} className="inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100">
                            <XCircleIcon className="h-4 w-4 mr-1" /> Absent
                          </button>
                          <button onClick={() => mark(s, 'late')} className="inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-medium bg-yellow-50 text-yellow-700 hover:bg-yellow-100">
                            <ClockIcon className="h-4 w-4 mr-1" /> Late
                          </button>
                          <button onClick={() => mark(s, 'excused')} className="inline-flex items-center px-2.5 py-1.5 rounded-md text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100">
                            Excused
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
      </div>
    </div>
  );
};


