import { useState } from 'react';
import { buildWhatsAppLink } from '../utils/whatsapp';

export default function WhatsAppButton({ phone, templates = [], label = '💬 WhatsApp' }) {
  const [open, setOpen] = useState(false);
  const [custom, setCustom] = useState('');

  if (!phone) return null;

  function send(message) {
    window.open(buildWhatsAppLink(phone, message), '_blank');
    setOpen(false);
    setCustom('');
  }

  return (
    <div className="wa-wrap">
      <button type="button" className="ghost whatsapp-btn" onClick={() => setOpen((o) => !o)}>
        {label}
      </button>
      {open && (
        <div className="wa-popover">
          <div className="wa-popover-title">¿Qué quieres enviar?</div>
          {templates.map((t, i) => (
            <button key={i} type="button" className="wa-option" onClick={() => send(t.text)}>
              {t.label}
            </button>
          ))}
          <div className="wa-custom">
            <textarea
              rows={2}
              placeholder="O escribe tu propio mensaje..."
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
            />
            <button
              type="button"
              className="primary"
              style={{ marginTop: 6, width: '100%' }}
              disabled={!custom.trim()}
              onClick={() => send(custom)}
            >
              Enviar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

