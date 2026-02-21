// Este arquivo existe para desregistrar qualquer Service Worker instalado previamente.
// O projeto não utiliza PWA/Service Worker.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function (registrations) {
    registrations.forEach(function (registration) {
      registration.unregister();
    });
  });
}
