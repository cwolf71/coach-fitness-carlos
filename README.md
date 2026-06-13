# Coach Fitness Carlos Wolf v3

App web instalable (PWA) para Android/Chrome con:

- Rutina día por día.
- Nutrición para recomposición corporal y control metabólico.
- Suplementación.
- Historial de peso, cintura, pasos, energía y entrenamientos.
- Gráficas.
- Fotos de progreso.
- Exportación/importación de respaldo.
- Instalación en pantalla de inicio.

## Cómo subir a GitHub Pages

1. Entra a https://github.com
2. Crea un repositorio nuevo, por ejemplo:
   `coach-fitness-carlos`
3. Sube todos los archivos de esta carpeta:
   - index.html
   - styles.css
   - app.js
   - manifest.json
   - service-worker.js
   - chart.umd.min.js
   - carpeta icons
4. En GitHub, entra a:
   Settings → Pages
5. En "Build and deployment":
   - Source: Deploy from a branch
   - Branch: main
   - Folder: /root
6. Guarda.
7. Espera 1–3 minutos.
8. Abre la liga que GitHub te da, algo como:
   `https://TU-USUARIO.github.io/coach-fitness-carlos/`

## Cómo instalar en Android

1. Abre la liga pública en Chrome.
2. Toca el botón "Instalar app" si aparece.
3. Si no aparece, toca menú ⋮ → Instalar aplicación / Añadir a pantalla principal.
4. La app quedará como ícono en tu inicio.

## Nota importante

Los datos se guardan localmente en el celular mediante LocalStorage. Usa la opción "Exportar datos JSON" cada semana para tener respaldo.
