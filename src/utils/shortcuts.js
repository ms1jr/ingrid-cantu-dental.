export const SHORTCUT_NAME = 'NuevaCita';

export function buildReminderShortcutURL({ patientName, datetime, notes }) {
  const date = new Date(datetime);
  const dateLabel = date.toLocaleString('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const inputText = `Cita: ${patientName} - ${dateLabel}${notes ? ` - ${notes}` : ''}`;

  const params = new URLSearchParams({
    name: SHORTCUT_NAME,
    input: 'text',
    text: inputText,
  });

  return `shortcuts://run-shortcut?${params.toString()}`;
}
