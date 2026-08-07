import { useEffect, useState, useCallback } from 'react';
import { db } from './db';
import Home from './components/Home';
import Patients from './components/Patients';
import Appointments from './components/Appointments';
import Treatments from './components/Treatments';
import Prescriptions from './components/Prescriptions';
import Footer from './components/Footer';

const TABS = [
  { id: 'home', label: 'Inicio', icon: '🏠' },
  { id: 'patients', label: 'Pacientes', icon: '🦷' },
  { id: 'appointments', label: 'Citas', icon: '🗓️' },
  { id: 'treatments', label: 'Tratamientos', icon: '💰' },
  { id: 'prescriptions', label: 'Recetas', icon: '📄' },
];

export default function App() {
  const [tab, setTab] = useState('home');
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [treatments, setTreatments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  const reload = useCallback(async () => {
    setPatients(await db.getAll('patients'));
    setAppointments(await db.getAll('appointments'));
    setTreatments(await db.getAll('treatments'));
    setPrescriptions(await db.getAll('prescriptions'));
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <img src="/icon-192.png" alt="Ingrid Cantú Dental" />
          <div className="brand">
            Ingrid Cantú
            <small>Dental</small>
          </div>
        </div>
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`nav-btn ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            <span>{t.icon}</span> {t.label}
          </button>
        ))}
      </aside>

      <main className="main">
        {tab === 'home' && (
          <Home patients={patients} appointments={appointments} treatments={treatments} />
        )}
        {tab === 'patients' && <Patients patients={patients} reload={reload} />}
        {tab === 'appointments' && (
          <Appointments appointments={appointments} patients={patients} reload={reload} />
        )}
        {tab === 'treatments' && (
          <Treatments treatments={treatments} patients={patients} reload={reload} />
        )}
        {tab === 'prescriptions' && (
          <Prescriptions prescriptions={prescriptions} patients={patients} reload={reload} />
        )}
        <Footer />
      </main>
    </div>
  );
}
