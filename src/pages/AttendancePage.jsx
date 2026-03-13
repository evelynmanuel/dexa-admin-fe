import { useState, useEffect } from 'react';
import { attendanceAPI, employeeAPI } from '../services/api.jsx';

export default function AttendancePage() {
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  const [employeeId, setEmployeeId] = useState('');
  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    employeeAPI.getAll().then(res => setEmployees(res.data));
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const params = { startDate, endDate };
      if (employeeId) params.employeeId = employeeId;
      const res = await attendanceAPI.getAll(params);
      setRecords(res.data);
    } finally {
      setLoading(false);
    }
  };

  const masukCount = records.filter(r => r.status === 'masuk').length;
  const pulangCount = records.filter(r => r.status === 'pulang').length;

  return (
    <div className="page">
      <h1 className="page-title">Monitoring Absensi</h1>
      <p className="page-subtitle">Data absensi seluruh karyawan (hanya baca)</p>

      <div className="card">
        <div className="filter-row">
          <div className="filter-col">
            <label className="form-label">Dari Tanggal</label>
            <input className="form-input" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>
          <div className="filter-col">
            <label className="form-label">Sampai Tanggal</label>
            <input className="form-input" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
          <div className="filter-col">
            <label className="form-label">Filter Karyawan</label>
            <select className="form-input" value={employeeId} onChange={e => setEmployeeId(e.target.value)}>
              <option value="">Semua Karyawan</option>
              {employees.filter(e => e.role === 'employee').map(e => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>
          </div>
          <div className="filter-col" style={{ justifyContent: 'flex-end', minWidth: 'unset', flex: 'none' }}>
            <button className="btn btn-dark" onClick={fetchRecords}>Cari</button>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">{records.length}</div>
          <div className="stat-label">Total Record</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#2ecc71' }}>{masukCount}</div>
          <div className="stat-label">Absen Masuk</div>
        </div>
        <div className="stat-card">
          <div className="stat-number" style={{ color: '#e74c3c' }}>{pulangCount}</div>
          <div className="stat-label">Absen Pulang</div>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">Memuat data absensi...</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Karyawan</th>
                <th>Posisi</th>
                <th>Tanggal</th>
                <th>Waktu</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr><td colSpan={5} className="empty-state">Tidak ada data pada periode ini.</td></tr>
              ) : records.map((r, i) => (
                <tr key={i}>
                  <td><strong>{r.employeeName}</strong></td>
                  <td>{r.employeePosition}</td>
                  <td>{r.date}</td>
                  <td>{r.time?.slice(0, 5)}</td>
                  <td>
                    <span className={r.status === 'masuk' ? 'badge badge-green' : 'badge badge-red'}>
                      {r.status === 'masuk' ? 'Masuk' : 'Pulang'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
