import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Service Worker kaydı - GEÇİCİ OLARAK DEVRE DIŞI
// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', async () => {
//     try {
//       const registration = await navigator.serviceWorker.register('/sw.js');
//       console.log('SW registered: ', registration);
      
//       // Background sync registration
//       if ('sync' in registration) {
//         await registration.sync.register('background-sync');
//       }
      
//       // Periodic background sync registration
//       if ('periodicSync' in registration) {
//         const status = await navigator.permissions.query({
//           name: 'periodic-background-sync',
//         });
        
//         if (status.state === 'granted') {
//           await registration.periodicSync.register('periodic-sync', {
//             minInterval: 24 * 60 * 60 * 1000, // 24 hours
//           });
//         }
//       }
      
//       // Push notifications registration
//       if ('pushManager' in registration) {
//         const permission = await Notification.requestPermission();
//         if (permission === 'granted') {
//           const subscription = await registration.pushManager.subscribe({
//             userVisibleOnly: true,
//             applicationServerKey: 'BEl62iUYgUivxIkv69yViEuiBIa1l9aTvz0jqQ0aX_wx_3EFlYho_RgTk1XXOnZi06CEWRSdY1kF0Gj2ox_uoXE'
//           });
//           console.log('Push subscription: ', subscription);
//         }
//       }
      
//     } catch (registrationError) {
//       console.log('SW registration failed: ', registrationError);
//     }
//   });
// }

// Service Worker'ı temizle
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations()
    .then(rs => rs.forEach(r => r.unregister()))
    .then(() => caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k)))))
    .then(() => console.log('Service Worker temizlendi'));
}
