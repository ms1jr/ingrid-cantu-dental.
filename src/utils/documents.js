// Abre un documento HTML imprimible (recibo o receta) en una pestaña nueva.
// Desde ahí, con "Compartir" en Safari, se puede guardar como PDF o imprimir.
export function openPrintableDocument(html) {
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
}

const BASE_STYLE = `
  body { font-family: Georgia, serif; color: #4a3222; max-width: 640px; margin: 40px auto; padding: 0 24px; }
  .header { display: flex; align-items: center; gap: 14px; border-bottom: 3px solid #a9714e; padding-bottom: 16px; margin-bottom: 24px; }
  .header img { width: 56px; height: 56px; }
  .header h1 { font-size: 20px; margin: 0; }
  .header small { color: #8c7a68; letter-spacing: 0.1em; text-transform: uppercase; font-size: 10px; }
  .row { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 14px; }
  .label { color: #8c7a68; font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em; }
  .box { border: 1px solid #e4d8c8; border-radius: 10px; padding: 16px 18px; margin: 18px 0; }
  .total { font-size: 22px; font-weight: bold; color: #8a5a3b; text-align: right; margin-top: 10px; }
  .print-btn { background: #a9714e; color: #fff; border: none; padding: 10px 20px; border-radius: 8px; font-size: 14px; cursor: pointer; margin-top: 20px; }
  .whitespace { white-space: pre-wrap; font-size: 14px; }
  @media print { .print-btn { display: none; } }
`;

export function receiptHTML({ folio, patientName, service, cost, date, notes }) {
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Recibo ${folio}</title><style>${BASE_STYLE}</style></head>
  <body>
    <div class="header">
      <img src="/icon-192.png" alt="logo" />
      <div><h1>Ingrid Cantú Dental</h1><small>Recibo de pago</small></div>
    </div>
    <div class="row"><span class="label">Folio</span><span>${folio}</span></div>
    <div class="row"><span class="label">Fecha</span><span>${date}</span></div>
    <div class="row"><span class="label">Paciente</span><span>${patientName}</span></div>
    <div class="box">
      <div class="row"><span>${service}</span><span>$${Number(cost).toLocaleString('es-MX')}</span></div>
      <div class="total">Total: $${Number(cost).toLocaleString('es-MX')} MXN</div>
    </div>
    ${notes ? `<p class="whitespace">${notes}</p>` : ''}
    <p style="font-size:12px;color:#8c7a68;margin-top:30px;">Este comprobante es un recibo interno, no sustituye una factura fiscal (CFDI).</p>
    <button class="print-btn" onclick="window.print()">🖨️ Imprimir / Guardar como PDF</button>
  </body></html>`;
}

export function prescriptionHTML({ patientName, date, medications, instructions }) {
  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Receta ${patientName}</title><style>${BASE_STYLE}</style></head>
  <body>
    <div class="header">
      <img src="/icon-192.png" alt="logo" />
      <div><h1>Ingrid Cantú Dental</h1><small>Receta médica</small></div>
    </div>
    <div class="row"><span class="label">Fecha</span><span>${date}</span></div>
    <div class="row"><span class="label">Paciente</span><span>${patientName}</span></div>
    <div class="box">
      <div class="label" style="margin-bottom:8px;">℞ Medicamentos</div>
      <p class="whitespace">${medications}</p>
    </div>
    ${instructions ? `<div class="box"><div class="label" style="margin-bottom:8px;">Indicaciones</div><p class="whitespace">${instructions}</p></div>` : ''}
    <p style="font-size:13px;margin-top:30px;">___________________________<br>Dra. Ingrid Cantú — Cédula profesional</p>
    <button class="print-btn" onclick="window.print()">🖨️ Imprimir / Guardar como PDF</button>
  </body></html>`;
}
