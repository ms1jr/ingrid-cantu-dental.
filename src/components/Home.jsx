import LeafMotif from './LeafMotif';

export default function Home({ patients, appointments, treatments }) {
  const today = new Date().toISOString().slice(0, 10);
  const todayAppointments = appointments
    .filter((a) => a.datetime.slice(0, 10) === today)
    .sort((a, b) => new Date(a.datetime) - new Date(b.datetime));

  const monthTotal = treatments
    .filter((t) => t.date.slice(0, 7) === today.slice(0, 7))
    .reduce((sum, t) => sum + (t.cost || 0), 0);

  return (
    <div>
      <div className="hero">
        <LeafMotif className="hero-leaf" color="#ffffff" />
        <div className="hero-content">
          <div className="sub" style={{ color: 'rgba(255,255,255,0.85)' }}>
            {new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
          <h1 style={{ color: '#fff', fontSize: 30, marginTop: 4 }}>Hola, Dra. Cantú 🦷</h1>
          <div style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, marginTop: 6 }}>
            Este es el resumen de tu consultorio hoy.
          </div>
        </div>
      </div>

      <div className="stat-grid">
        <div className="card stat-card accent-copper">
          <div className="meta">Pacientes</div>
          <h2 className="stat-number">{patients.length}</h2>
        </div>
        <div className="card stat-card accent-terracotta">
          <div className="meta">Citas hoy</div>
          <h2 className="stat-number">{todayAppointments.length}</h2>
        </div>
        <div className="card stat-card accent-gold">
          <div className="meta">Ingresos del mes</div>
          <h2 className="stat-number">${monthTotal.toLocaleString('es-MX')}</h2>
        </div>
      </div>

      <h3 style={{ margin: '28px 0 12px' }}>Agenda de hoy</h3>
      {todayAppointments.length === 0 && (
        <div className="empty-state">
          <LeafMotif className="empty-leaf" color="#d8c4a8" />
          <div style={{ marginTop: 10 }}>No hay citas para hoy. Buen momento para ponerte al día. 🌿</div>
        </div>
      )}
      {todayAppointments.map((a) => (
        <div className="card" key={a.id}>
          <div className="card-row">
            <div>
              <h3>{a.patientName}</h3>
              <div className="meta">
                {new Date(a.datetime).toLocaleTimeString('es-MX', { timeStyle: 'short' })}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
