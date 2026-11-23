# Rescatopia 🐾

Prototipo académico de una aplicación web para la gestión de un refugio de animales y la promoción de adopciones responsables.

## Funcionalidades

- Portal público con catálogo de animales disponibles.
- Búsqueda y filtro por especie.
- Formulario para enviar solicitudes de adopción.
- Panel administrativo con indicadores.
- Registro, edición y actualización de animales.
- Expedientes médicos básicos: vacunas, consultas y tratamientos.
- Gestión de solicitudes: pendiente, en revisión, aprobada, rechazada y completada.
- Confirmación de adopción con actualización del estado del animal.
- Diseño adaptable a computadoras, tabletas y teléfonos.

## Tecnologías

- HTML5
- CSS3
- JavaScript
- localStorage (persistencia local en el navegador)
- GitHub Pages (publicación estática)

## Ejecutar localmente

1. Descarga o clona este repositorio.
2. Abre `index.html` en un navegador moderno.

También puedes utilizar la extensión **Live Server** de Visual Studio Code para servir la aplicación localmente.

## Publicar en GitHub Pages

1. Crea un repositorio nuevo en GitHub, por ejemplo `rescatopia`.
2. Sube `index.html`, `styles.css`, `app.js` y este `README.md` a la raíz del repositorio.
3. En GitHub abre **Settings → Pages**.
4. En **Build and deployment**, selecciona **Deploy from a branch**.
5. Selecciona la rama `main` y la carpeta `/ (root)`.
6. Guarda los cambios. GitHub Pages publicará el sitio y mostrará la URL.

## Datos de demostración

La aplicación carga registros ficticios de ejemplo la primera vez. Los cambios se guardan en `localStorage` del navegador actual.

Para reiniciar la demostración, abre las herramientas de desarrollador del navegador, entra a **Application → Local Storage**, elimina la clave `rescatopia_data_v1` y recarga la página.

## Limitaciones importantes

Este proyecto es un prototipo académico de frontend. GitHub Pages no ejecuta un backend y `localStorage` no es una base de datos centralizada. Por ello:

- Los datos no se sincronizan entre diferentes usuarios o dispositivos.
- No se debe utilizar para almacenar datos personales reales.
- La interfaz administrativa es una demostración y no implementa autenticación segura.
- Las fotografías de ejemplo se cargan desde URLs externas de Unsplash y requieren conexión a internet.

Para una versión de producción se necesitaría un backend, una base de datos centralizada, autenticación segura, autorización por roles, validación del lado del servidor, respaldos y políticas de privacidad.

## Estructura

```text
rescatopia/
├── index.html
├── styles.css
├── app.js
└── README.md
```
