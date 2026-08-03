import { useState } from 'react';
import { db } from '../db';
import { buildWhatsAppLink } from '../utils/whatsapp';

const EMPTY = { name: '', phone: '', notes: '' };

export default function Patients({ patients, reload }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);

  function startCreate() {
    setForm(EMPTY);
    setEditingId(null);
    setShowForm(true);
  }

  function startEdit(p) {
    setForm({ name: p.name, phone: p.phone, notes: p.notes || '' });
    setEditingId(p.id);
    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    const existing = editingId ? patients.find((p) => p.id === editingId) : null;
    await db.put('patients', {
      id: editingId || db.uid(),
      ...form,
      createdAt: existing ? existing.createdAt : Date.now(),
    });
    cancelForm();
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
        <button className="primary" onClick={showForm ? cancelForm : startCreate}>
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
              <label>Teléfono (WhatsApp)</label>
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
            <button className="primary" type="submit">
              {editingId ? 'Guardar cambios' : 'Guardar paciente'}
            </button>
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
              <div className="actions" style={{ flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                {p.phone && (
                  <a
                    className="ghost whatsapp-btn"
                    href={buildWhatsAppLink(
                      p.phone,
                      `Hola ${p.name}, te escribimos de Ingrid Cantú Dental. Podemos confirmar tu próxima cita, agendar una nueva o darte seguimiento a tu tratamiento — ¿qué necesitas?`
                    )}
                    target="_blank"
                    rel="noreferrer"
                  >
                    💬 WhatsApp
                  </a>
                )}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="ghost" onClick={() => startEdit(p)}>Editar</button>
                  <button className="ghost" onClick={() => handleDelete(p.id)}>Eliminar</button>
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}
