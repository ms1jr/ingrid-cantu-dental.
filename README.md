# Ingrid Cantú Dental — App de administración

App web (PWA) para administrar el consultorio: pacientes, citas y tratamientos/pagos.
Funciona sin internet una vez cargada, y se puede "instalar" en la pantalla de inicio
del iPad/iPhone como si fuera una app nativa.

## 1. Desplegar en Netlify (gratis)

**Opción fácil — arrastrar y soltar:**
1. En tu computadora, dentro de esta carpeta, corre: `npm install` y luego `npm run build`.
   Esto crea una carpeta `dist/`.
2. Entra a https://app.netlify.com, crea una cuenta gratis.
3. En el dashboard, arrastra la carpeta `dist/` al área que dice "Deploy manually".
4. Netlify te da una URL pública al instante (ej. `ingrid-cantu-dental.netlify.app`).

**Opción recomendada — conectar con Git (se actualiza sola):**
1. Sube esta carpeta a un repositorio de GitHub.
2. En Netlify: "Add new site" → "Import an existing project" → conecta tu repo.
3. Netlify detecta automáticamente la configuración en `netlify.toml`
   (`npm run build`, carpeta `dist`). Solo da clic en "Deploy".

## 2. Instalar la app en el iPad/iPhone

1. Abre la URL de Netlify en Safari (no en Chrome — el "guardar como app" de Apple
   solo funciona bien desde Safari).
2. Toca el ícono de compartir → "Agregar a pantalla de inicio".
3. Listo: aparece como una app normal, con el logo, y abre sin internet.

## 3. Conectar con Calendario (automático)

Ya está integrado: en cada cita hay un botón "📅 Calendario" que descarga un
archivo `.ics`. Al tocarlo, iOS pregunta si quieres agregarlo a Calendario — un
toque más y queda agendado. No requiere configuración adicional.

## 4. Conectar con Recordatorios (requiere un Atajo, una sola vez)

La web no puede escribir directo en Recordatorios, pero un Atajo de Apple sí.
Configúralo una sola vez:

1. Abre la app **Atajos** en el iPad.
2. Toca "+" para crear un atajo nuevo.
3. Nómbralo exactamente: **NuevaCita**
4. Agrega la acción "Recibir texto de entrada" (Receive text input).
5. Agrega la acción "Crear recordatorio" (Create Reminder):
   - Título: usa el texto recibido ("Texto de entrada").
   - Lista: elige la lista donde Ingrid quiere ver sus citas (ej. "Consultorio").
   - Fecha: puedes dejarla vacía o ajustarla manualmente si quieres una fecha exacta.
6. Guarda el Atajo.

Desde ese momento, el botón "⏰ Recordatorio" en cada cita abre Atajos y crea el
recordatorio automáticamente con el nombre del paciente y la fecha/hora.

## 3 módulos incluidos

- **Pacientes**: nombre, teléfono, historial/notas.
- **Citas**: fecha, hora, notas — con botones directos a Calendario y Recordatorios.
- **Tratamientos**: servicio realizado, costo, fecha — con total acumulado.

Todos los datos se guardan localmente en el dispositivo (IndexedDB). No se
suben a ningún servidor ni requieren internet para usarse día a día — solo la
primera carga de la app necesita conexión (o después de instalada, ni eso).

## Personalizar colores/logo

Los colores de marca están centralizados en `src/styles.css` (bloque `:root`).
El logo se usa en `public/icon-192.png` / `icon-512.png` y en el encabezado del menú.
