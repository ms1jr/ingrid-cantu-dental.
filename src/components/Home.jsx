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
      <div className="page-header">
        <div>
          <h1>Hola, Dra. Cantú</h1>
          <div className="sub">
            {new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div className="card" style={{ flex: 1, minWidth: 140 }}>
          <div className="meta">Pacientes</div>
          <h2 style={{ fontSize: 28, marginTop: 4 }}>{patients.length}</h2>
        </div>
        <div className="card" style={{ flex: 1, minWidth: 140 }}>
          <div className="meta">Citas hoy</div>
          <h2 style={{ fontSize: 28, marginTop: 4 }}>{todayAppointments.length}</h2>
        </div>
        <div className="card" style={{ flex: 1, minWidth: 140 }}>
          <div className="meta">Ingresos del mes</div>
          <h2 style={{ fontSize: 28, marginTop: 4 }}>${monthTotal.toLocaleString('es-MX')}</h2>
        </div>
      </div>

      <div className="divider-leaf">🌿</div>

      <h3 style={{ marginBottom: 12 }}>Agenda de hoy</h3>
      {todayAppointments.length === 0 && (
        <div className="empty-state">No hay citas para hoy.</div>
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
