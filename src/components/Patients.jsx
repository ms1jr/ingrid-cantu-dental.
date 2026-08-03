import { useState } from 'react';
import { db } from '../db';

export default function Patients({ patients, reload }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', notes: '' });

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    await db.put('patients', { id: db.uid(), ...form, createdAt: Date.now() });
    setForm({ name: '', phone: '', notes: '' });
    setShowForm(false);
    reload();
  }

  async function handleDelete(id) {
    await db.remove('patients', id);
    reload();
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Pacientes</h1>
          <div className="sub">{patients.length} registrados</div>
        </div>
        <button className="primary" onClick={() => setShowForm((s) => !s)}>
          {showForm ? 'Cancelar' : '+ Nuevo paciente'}
        </button>
      </div>

      {showForm && (
        <form className="panel" onSubmit={handleSubmit}>
          <div className="row">
            <div className="field">
              <label>Nombre completo</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nombre del paciente"
                required
              />
            </div>
            <div className="field">
              <label>Teléfono</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="10 dígitos"
              />
            </div>
          </div>
          <div className="field">
            <label>Historial / notas clínicas</label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Alergias, tratamientos previos, observaciones..."
            />
          </div>
          <div className="form-actions">
            <button className="primary" type="submit">Guardar paciente</button>
          </div>
        </form>
      )}

      {patients.length === 0 && !showForm && (
        <div className="empty-state">
          <div className="leaf">🦷</div>
          Aún no hay pacientes registrados.
        </div>
      )}

      {patients
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((p) => (
          <div className="card" key={p.id}>
            <div className="card-row">
              <div>
                <h3>{p.name}</h3>
                <div className="meta">{p.phone || 'Sin teléfono'}</div>
                {p.notes && <div className="meta" style={{ marginTop: 6 }}>{p.notes}</div>}
              </div>
              <div className="actions">
                <button className="ghost" onClick={() => handleDelete(p.id)}>Eliminar</button>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
