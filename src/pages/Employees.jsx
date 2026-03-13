import { useState, useEffect } from 'react';
import { employeeAPI } from '../services/api.jsx';

function EmployeeModal({ employee, onClose, onSave }) {
  const isEdit = !!employee;
  const [form, setForm] = useState({
    name: employee?.name || '',
    email: employee?.email || '',
    password: '',
    position: employee?.position || '',
    phone: employee?.phone || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const set = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (isEdit) {
        const data = {};
        if (form.name) data.name = form.name;
        if (form.phone) data.phone = form.phone;
        if (form.position) data.position = form.position;
        if (form.password) data.password = form.password;
        await employeeAPI.updateJson(employee.id, data);
      } else {
        await employeeAPI.create(form);
      }
      onSave();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-box">
        <div className="modal-header">
          <span className="modal-title">{isEdit ? 'Edit Karyawan' : 'Tambah Karyawan'}</span>
          <button className="modal-close" onClick={onClose}>x</button>
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          {[
            { key: 'name', label: 'Nama Lengkap', type: 'text', required: !isEdit },
            { key: 'email', label: 'Email Perusahaan', type: 'email', required: !isEdit, disabled: isEdit },
            { key: 'password', label: isEdit ? 'Password Baru (kosongkan jika tidak diubah)' : 'Password', type: 'password', required: !isEdit },
            { key: 'position', label: 'Posisi / Jabatan', type: 'text', required: !isEdit },
            { key: 'phone', label: 'Nomor Handphone', type: 'tel' },
          ].map(f => (
            <div key={f.key} className="form-field">
              <label className="form-label">{f.label}</label>
              <input
                className="form-input"
                type={f.type}
                value={form[f.key]}
                onChange={set(f.key)}
                required={f.required}
                disabled={f.disabled}
              />
            </div>
          ))}
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn btn-ghost">Batal</button>
            <button type="submit" disabled={saving} className="btn btn-primary">
              {saving ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [search, setSearch] = useState('');

  const API_URL = 'http://localhost:5173/api';

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await employeeAPI.getAll();
      setEmployees(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEmployees(); }, []);

  const filtered = employees.filter(e =>
    e.name?.toLowerCase().includes(search.toLowerCase()) ||
    e.email?.toLowerCase().includes(search.toLowerCase()) ||
    e.position?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="page">
      {showModal && (
        <EmployeeModal
          employee={editEmployee}
          onClose={() => { setShowModal(false); setEditEmployee(null); }}
          onSave={() => { setShowModal(false); setEditEmployee(null); fetchEmployees(); }}
        />
      )}

      <div className="page-header">
        <div>
          <h1 className="page-title">Manajemen Karyawan</h1>
          <p className="page-subtitle">Tambah, edit, dan kelola data karyawan</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setEditEmployee(null); setShowModal(true); }}>
          Tambah Karyawan
        </button>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <input
          className="form-input"
          placeholder="Cari nama, email, posisi..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="empty-state">Memuat data karyawan...</div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Karyawan</th>
                <th>Posisi</th>
                <th>No. HP</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="empty-state">Tidak ada karyawan ditemukan.</td></tr>
              ) : filtered.map(emp => (
                <tr key={emp.id}>
                  <td>
                    <div className="employee-cell">
                      {emp.photo
                        ? <img src={`${API_URL}${emp.photo}`} alt="" className="avatar avatar-sm" />
                        : <div className="avatar avatar-sm">{emp.name?.[0]}</div>}
                      <div>
                        <div className="employee-name">{emp.name}</div>
                        <div className="employee-email">{emp.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{emp.position}</td>
                  <td>{emp.phone || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
