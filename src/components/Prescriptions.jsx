import { useState } from 'react';
import { db } from '../db';
import { openPrintableDocument, prescriptionHTML } from '../utils/documents';
import WhatsAppButton from './WhatsAppButton';

const EMPTY = { patientId: '', date: '', medications: '', instructions: '' };

export default function Prescriptions({ prescriptions, patients, reload }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);

  function startCreate() {
    setForm({ ...EMPTY, date: new Date().toISOString().slice(0, 10) });
    setEditingId(null);
    setShowForm(true);
  }

  function startEdit(rx) {
    setForm({
      patientId: rx.patientId,
      date: rx.date,
      medications: rx.medications,
      instructions: rx.instructions || '',
    });
    setEditingId(rx.id);
    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.patientId || !form.medications.trim()) return;
    const patient = patients.find((p) => p.id === form.patientId);
    const existing = editingId ? prescriptions.find((r) => r.id === editingId) : null;
    await db.put('prescriptions', {
      id: editingId || db.uid(),
      patientId: form.patientId,
      patientName: patient ? patient.name : 'Paciente',
      date: form.date || new Date().toISOString().slice(0, 10),
      medications: form.medications,
      instructions: form.instructions,
      createdAt: existing ? existing.createdAt : Date.now(),
    });
    cancelForm();
    reload();
  }

  async function handleDelete(id) {
    await db.remove('prescriptions', id);
    reload();
  }

  function view(rx) {
    openPrintableDocument(prescriptionHTML(rx));
  }

  const sorted = [...prescriptions].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Recetas médicas</h1>
          <div className="sub">{prescriptions.length} generadas</div>
        </div>
        <button className="primary" onClick={showForm ? cancelForm : startCreate}>
          {showForm ? 'Cancelar' : '+ Nueva receta'}
        </button>
      </div>

      {showForm && (
        <form className="panel" onSubmit={handleSubmit}>
          <div className="row">
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
            <div className="field">
              <label>Fecha</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
          </div>
          <div className="field">
            <label>Medicamentos y dosis</label>
            <textarea
              rows={4}
              value={form.medications}
              onChange={(e) => setForm({ ...form, medications: e.target.value })}
              placeholder={'Ej. Amoxicilina 500mg, cada 8 horas por 7 días\nIbuprofeno 400mg, cada 8 horas si hay dolor'}
              required
            />
          </div>
          <div className="field">
            <label>Indicaciones generales</label>
            <textarea
              rows={2}
              value={form.instructions}
              onChange={(e) => setForm({ ...form, instructions: e.target.value })}
              placeholder="Reposo, dieta blanda, evitar alimentos fríos..."
            />
          </div>
          <div className="form-actions">
            <button className="primary" type="submit">
              {editingId ? 'Guardar cambios' : 'Guardar receta'}
            </button>
          </div>
        </form>
      )}

      {sorted.length === 0 && !showForm && (
        <div className="empty-state">
          <div className="leaf">📄</div>
          Aún no hay recetas generadas.
        </div>
      )}

      {sorted.map((rx) => {
        const patient = patients.find((p) => p.id === rx.patientId);
        return (
          <div className="card" key={rx.id}>
            <div className="card-row">
              <div>
                <h3>{rx.patientName}</h3>
                <div className="meta">{rx.date}</div>
                <div className="meta" style={{ marginTop: 6, whiteSpace: 'pre-wrap' }}>{rx.medications}</div>
              </div>
              <div className="actions" style={{ flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                <button className="ghost" onClick={() => view(rx)}>📄 Ver / Imprimir</button>
                {patient?.phone && (
                  <WhatsAppButton
                    phone={patient.phone}
                    label="💬"
                    templates={[
                      {
                        label: 'Enviar receta',
                        text: `Hola ${rx.patientName}, aquí tienes tu receta de Ingrid Cantú Dental (${rx.date}):\n${rx.medications}${rx.instructions ? `\n\nIndicaciones: ${rx.instructions}` : ''}`,
                      },
                    ]}
                  />
                )}
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="ghost" onClick={() => startEdit(rx)}>Editar</button>
                  <button className="ghost" onClick={() => handleDelete(rx.id)}>Eliminar</button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
