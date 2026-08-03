// Construye un link de WhatsApp con mensaje precargado.
// Si el teléfono tiene 10 dígitos (México), le agrega el 52 automáticamente.
export function buildWhatsAppLink(phone, message) {
  let digits = (phone || '').replace(/\D/g, '');
  if (digits.length === 10) digits = '52' + digits;
  const text = encodeURIComponent(message);
  return `https://wa.me/${digits}?text=${text}`;
}
