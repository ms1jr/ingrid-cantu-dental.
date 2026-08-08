import { useState } from 'react';
import { db } from '../db';
import WhatsAppButton from './WhatsAppButton';
import { openPrintableDocument, receiptHTML } from '../utils/documents';

const EMPTY = { patientId: '', service: '', cost: '', date: '' };

function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function Treatments({ treatments, patients, reload }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY);

  function startCreate() {
    setForm(EMPTY);
    setEditingId(null);
    setShowForm(true);
  }

  function startEdit(t) {
    setForm({ patientId: t.patientId, service: t.service, cost: String(t.cost), date: t.date });
    setEditingId(t.id);
    setShowForm(true);
  }

  function cancelForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.patientId || !form.service) return;
    const patient = patients.find((p) => p.id === form.patientId);
    const existing = editingId ? treatments.find((t) => t.id === editingId) : null;
    await db.put('treatments', {
      id: editingId || db.uid(),
      patientId: form.patientId,
      patientName: patient ? patient.name : 'Paciente',
      service: form.service,
      cost: Number(form.cost) || 0,
      date: form.date || new Date().toISOString().slice(0, 10),
      folio: existing ? existing.folio : null,
      createdAt: existing ? existing.createdAt : Date.now(),
    });
    cancelForm();
    reload();
  }

  async function handleDelete(id) {
    await db.remove('treatments', id);
    reload();
  }

  async function handleReceipt(t) {
    let folio = t.folio;
    if (!folio) {
      const withFolio = treatments.filter((x) => x.folio).length;
      folio = `IC-${String(withFolio + 1).padStart(5, '0')}`;
      await db.put('treatments', { ...t, folio });
      reload();
    }
    openPrintableDocument(
      receiptHTML({ folio, patientName: t.patientName, service: t.service, cost: t.cost, date: t.date })
    );
  }

  const sorted = [...treatments].sort((a, b) => new Date(b.date) - new Date(a.date));

  const now = new Date();
  const todayStr = now.toISOString().slice(0, 10);
  const weekStart = startOfWeek(now);
  const monthStr = todayStr.slice(0, 7);
  const yearStr = todayStr.slice(0, 4);

  const sum = (list) => list.reduce((s, t) => s + (t.cost || 0), 0);
  const dailyTotal = sum(treatments.filter((t) => t.date === todayStr));
  const weeklyTotal = sum(treatments.filter((t) => new Date(t.date) >= weekStart));
  const monthlyTotal = sum(treatments.filter((t) => t.date.slice(0, 7) === monthStr));
  const annualTotal = sum(treatments.filter((t) => t.date.slice(0, 4) === yearStr));

  function templatesFor(t) {
    return [
      { label: 'Seguimiento de tratamiento', text: `Hola ${t.patientName}, te damos seguimiento a tu tratamiento (${t.service}) en Ingrid Cantú Dental. ¿Cómo te has sentido?` },
      { label: 'Recordatorio de pago', text: `Hola ${t.patientName}, te escribimos para recordarte el pago pendiente de tu tratamiento (${t.service}) en Ingrid Cantú Dental.` },
      { label: 'Enviar recibo', text: `Hola ${t.patientName}, aquí tienes el resumen de tu pago en Ingrid Cantú Dental${t.folio ? ` (folio ${t.folio})` : ''}: ${t.service} - $${Number(t.cost).toLocaleString('es-MX')} MXN, fecha ${t.date}. El comprobante en PDF te lo comparto por aquí también.` },
    ];
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Tratamientos y pagos</h1>
          <div className="sub">{treatments.length} registros</div>
        </div>
        <button className="primary" onClick={showForm ? cancelForm : startCreate}>
          {showForm ? 'Cancelar' : '+ Nuevo registro'}
        </button>
      </div>

      <div className="stat-grid">
        <div className="card stat-card accent-copper">
          <div className="meta">Hoy</div>
          <h2 className="stat-number" style={{ fontSize: 22 }}>${dailyTotal.toLocaleString('es-MX')}</h2>
        </div>
        <div className="card stat-card accent-terracotta">
          <div className="meta">Esta semana</div>
          <h2 className="stat-number" style={{ fontSize: 22 }}>${weeklyTotal.toLocaleString('es-MX')}</h2>
        </div>
        <div className="card stat-card accent-gold">
          <div className="meta">Este mes</div>
          <h2 className="stat-number" style={{ fontSize: 22 }}>${monthlyTotal.toLocaleString('es-MX')}</h2>
        </div>
        <div className="card stat-card accent-copper">
          <div className="meta">Este año</div>
          <h2 className="stat-number" style={{ fontSize: 22 }}>${annualTotal.toLocaleString('es-MX')}</h2>
        </div>
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
            <button className="primary" type="submit">
              {editingId ? 'Guardar cambios' : 'Guardar registro'}
            </button>
          </div>
        </form>
      )}

      {sorted.length === 0 && !showForm && (
        <div className="empty-state">
          <div className="leaf">💰</div>
          Sin tratamientos registrados todavía.
        </div>
      )}

      {sorted.map((t) => {
        const patient = patients.find((p) => p.id === t.patientId);
        return (
          <div className="card" key={t.id}>
            <div className="card-row">
              <div>
                <h3>{t.service}</h3>
                <div className="meta">{t.patientName} · {t.date}{t.folio ? ` · Folio ${t.folio}` : ''}</div>
              </div>
              <div className="actions" style={{ flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                <span className="badge">${t.cost.toLocaleString('es-MX')}</span>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="ghost" onClick={() => handleReceipt(t)}>🧾 Recibo</button>
                  {patient?.phone && <WhatsAppButton phone={patient.phone} templates={templatesFor(t)} label="💬" />}
                  <button className="ghost" onClick={() => startEdit(t)}>Editar</button>
                  <button className="ghost" onClick={() => handleDelete(t.id)}>Eliminar</button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
