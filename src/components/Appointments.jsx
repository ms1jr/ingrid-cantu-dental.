import { useState } from 'react';
import { db } from '../db';
import { downloadAppointmentICS } from '../utils/ics';
import { buildReminderShortcutURL } from '../utils/shortcuts';
import WhatsAppButton from './WhatsAppButton';

const EMPTY = { patientId: '', date: '', time: '', notes: '' };

export default function Appointments({ appointments, patients, reload }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);

  function startCreate() {
    setForm(EMPTY);
    setEditingId(null);
    setShowForm(true);
  }

  function startEdit(a) {
    const [date, time] = a.datetime.split('T');
    setForm({ patientId: a.patientId, date, time: time.slice(0, 5), notes: a.notes || '' });
    setEditingId(a.id);
    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.patientId || !form.date || !form.time) return;
    const patient = patients.find((p) => p.id === form.patientId);
    const existing = editingId ? appointments.find((a) => a.id === editingId) : null;
    const appointment = {
      id: editingId || db.uid(),
      patientId: form.patientId,
      patientName: patient ? patient.name : 'Paciente',
      datetime: `${form.date}T${form.time}:00`,
      durationMinutes: 30,
      notes: form.notes,
      createdAt: existing ? existing.createdAt : Date.now(),
    };
    await db.put('appointments', appointment);
    cancelForm();
    reload();
  }

  async function handleDelete(id) {
    await db.remove('appointments', id);
    reload();
  }

  const upcoming = [...appointments].sort(
    (a, b) => new Date(a.datetime) - new Date(b.datetime)
  );

  function templatesFor(a) {
    const label = new Date(a.datetime).toLocaleString('es-MX', { dateStyle: 'full', timeStyle: 'short' });
    return [
      { label: 'Confirmar cita', text: `Hola ${a.patientName}, te confirmamos tu cita en Ingrid Cantú Dental el ${label}. ¿Puedes confirmarnos tu asistencia?` },
      { label: 'Reagendar cita', text: `Hola ${a.patientName}, necesitamos reagendar tu cita del ${label}. ¿Qué otro día te funciona?` },
      { label: 'Recordatorio amistoso', text: `Hola ${a.patientName}, te recordamos tu cita en Ingrid Cantú Dental el ${label}. ¡Te esperamos!` },
    ];
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Citas</h1>
          <div className="sub">{appointments.length} programadas</div>
        </div>
        <button className="primary" onClick={showForm ? cancelForm : startCreate}>
          {showForm ? 'Cancelar' : '+ Nueva cita'}
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
              <label>Fecha</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
              />
            </div>
            <div className="field">
              <label>Hora</label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="field">
            <label>Notas</label>
            <textarea
              rows={2}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Motivo de la consulta..."
            />
          </div>
          <div className="form-actions">
            <button className="primary" type="submit">
              {editingId ? 'Guardar cambios' : 'Agendar cita'}
            </button>
          </div>
          {patients.length === 0 && (
            <div className="meta" style={{ marginTop: 10 }}>
              Primero registra al menos un paciente en la sección Pacientes.
            </div>
          )}
        </form>
      )}

      {upcoming.length === 0 && !showForm && (
        <div className="empty-state">
          <div className="leaf">🗓️</div>
          No hay citas programadas todavía.
        </div>
      )}

      {upcoming.map((a) => {
        const patient = patients.find((p) => p.id === a.patientId);
        return (
          <div className="card" key={a.id}>
            <div className="card-row">
              <div>
                <h3>{a.patientName}</h3>
                <div className="meta">
                  {new Date(a.datetime).toLocaleString('es-MX', {
                    dateStyle: 'full',
                    timeStyle: 'short',
                  })}
                </div>
                {a.notes && <div className="meta" style={{ marginTop: 6 }}>{a.notes}</div>}
              </div>
              <div className="actions" style={{ flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                  <button className="ghost" onClick={() => downloadAppointmentICS(a)}>📅 Calendario</button>
                  <a className="ghost" style={{ textDecoration: 'none' }} href={buildReminderShortcutURL(a)}>
                    ⏰ Recordatorio
                  </a>
                  {patient?.phone && <WhatsAppButton phone={patient.phone} templates={templatesFor(a)} />}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="ghost" onClick={() => startEdit(a)}>Editar</button>
                  <button className="ghost" onClick={() => handleDelete(a.id)}>Eliminar</button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
