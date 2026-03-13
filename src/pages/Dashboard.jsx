import { useState, useEffect } from 'react';
import { employeeAPI, attendanceAPI } from '../services/api.jsx';

export default function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [todayAtt, setTodayAtt] = useState([]);
  const [loading, setLoading] = useState(true);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    Promise.all([
      employeeAPI.getAll(),
      attendanceAPI.getAll({ startDate: today, endDate: today }),
    ]).then(([empRes, attRes]) => {
      setEmployees(empRes.data);
      setTodayAtt(attRes.data);
    }).finally(() => setLoading(false));
  }, []);

  const activeCount = employees.filter(e => e.isActive && e.role === 'USER').length;
  const masukCount = todayAtt.filter(a => a.status === 'CLOCK_IN').length;
  const pulangCount = todayAtt.filter(a => a.status === 'CLOCK_OUT').length;

  const dateLabel = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  if (loading) return <div className="empty-state" style={{ paddingTop: 80 }}>Memuat dashboard...</div>;

  return (
    <div className="page">
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle" style={{ textTransform: 'capitalize' }}>{dateLabel}</p>

      <div className="stats-grid">
        {[
          { label: 'Total Karyawan Aktif', value: activeCount },
          { label: 'Absen Masuk Hari Ini', value: masukCount, color: '#2ecc71' },
          { label: 'Absen Pulang Hari Ini', value: pulangCount, color: '#e74c3c' },
          { label: 'Total Absensi Hari Ini', value: todayAtt.length, color: '#e67e22' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-number" style={s.color ? { color: s.color } : {}}>{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12 }}>Absensi Hari Ini</div>
      {todayAtt.length === 0 ? (
        <div className="empty-state">Belum ada absensi hari ini.</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Karyawan</th>
                <th>Posisi</th>
                <th>Waktu</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {todayAtt.map((a, i) => (
                <tr key={i}>
                  <td>{a.employeeName}</td>
                  <td>{a.employeePosition}</td>
                  <td>{a.time?.slice(0, 5)}</td>
                  <td>
                    <span className={a.status === 'masuk' ? 'badge badge-green' : 'badge badge-red'}>
                      {a.status === 'masuk' ? 'Masuk' : 'Pulang'}
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
