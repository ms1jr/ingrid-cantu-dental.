import { useState } from 'react';
import { db } from '../db';

export default function Treatments({ treatments, patients, reload }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ patientId: '', service: '', cost: '', date: '' });

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.patientId || !form.service) return;
    const patient = patients.find((p) => p.id === form.patientId);
    await db.put('treatments', {
      id: db.uid(),
      patientId: form.patientId,
      patientName: patient ? patient.name : 'Paciente',
      service: form.service,
      cost: Number(form.cost) || 0,
      date: form.date || new Date().toISOString().slice(0, 10),
      createdAt: Date.now(),
    });
    setForm({ patientId: '', service: '', cost: '', date: '' });
    setShowForm(false);
    reload();
  }

  async function handleDelete(id) {
    await db.remove('treatments', id);
    reload();
  }

  const sorted = [...treatments].sort((a, b) => new Date(b.date) - new Date(a.date));
  const total = treatments.reduce((sum, t) => sum + (t.cost || 0), 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Tratamientos y pagos</h1>
          <div className="sub">
            {treatments.length} registros · Total: ${total.toLocaleString('es-MX')}
          </div>
        </div>
        <button className="primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Cancelar' : '+ Nuevo registro'}
        </button>
      </div>

      {showForm && (
        <form className="panel" onSubmit={handleSubmit}>
          <div className="field">
            <label>Paciente</label>
            <select
              value={form.patientId}
              onChange={(e) => setForm({ ...form, patientId: e.target.value })}
              required
            >
              <option value="">Selecciona un paciente</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="row">
            <div className="field">
              <label>Servicio realizado</label>
              <input
                value={form.service}
                onChange={(e) => setForm({ ...form, service: e.target.value })}
                placeholder="Limpieza, resina, extracción..."
                required
              />
            </div>
            <div className="field">
              <label>Costo (MXN)</label>
              <input
                type="number"
                value={form.cost}
                onChange={(e) => setForm({ ...form, cost: e.target.value })}
                placeholder="0"
              />
            </div>
          </div>
          <div className="field">
            <label>Fecha</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>
          <div className="form-actions">
            <button className="primary" type="submit">Guardar registro</button>
          </div>
        </form>
      )}

      {sorted.length === 0 && !showForm && (
        <div className="empty-state">
          <div className="leaf">💰</div>
          Sin tratamientos registrados todavía.
        </div>
      )}

      {sorted.map((t) => (
        <div className="card" key={t.id}>
          <div className="card-row">
            <div>
              <h3>{t.service}</h3>
              <div className="meta">{t.patientName} · {t.date}</div>
            </div>
            <div className="actions" style={{ alignItems: 'center' }}>
              <span className="badge">${t.cost.toLocaleString('es-MX')}</span>
              <button className="ghost" onClick={() => handleDelete(t.id)}>Eliminar</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
