import { useState } from 'react';
import { buildWhatsAppLink } from '../utils/whatsapp';

export default function WhatsAppButton({ phone, templates, label = '💬 WhatsApp' }) {
  const [open, setOpen] = useState(false);
  const [customText, setCustomText] = useState('');

  if (!phone) return null;

  function send(text) {
    if (!text.trim()) return;
    window.open(buildWhatsAppLink(phone, text), '_blank');
    setOpen(false);
    setCustomText('');
  }

  return (
    <div className="wa-wrap">
      <button type="button" className="ghost whatsapp-btn" onClick={() => setOpen((o) => !o)}>
        {label}
      </button>
      {open && (
        <div className="wa-popover">
          <div className="wa-popover-title">Elige un mensaje</div>
          {templates.map((t, i) => (
            <button key={i} type="button" className="wa-option" onClick={() => send(t.text)}>
              {t.label}
            </button>
          ))}
          <div className="wa-custom">
            <textarea
              rows={2}
              placeholder="O escribe tu propio mensaje..."
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
            />
            <button
              type="button"
              className="primary"
              disabled={!customText.trim()}
              onClick={() => send(customText)}
            >
              Enviar mensaje
            </button>
          </div>
          <button type="button" className="wa-close" onClick={() => setOpen(false)}>Cerrar</button>
        </div>
      )}
    </div>
  );
}
