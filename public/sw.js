self.addEventListener('push', function (event) {
  if (!event.data) return;

  try {
    const payload = event.data.json();
    const title = payload.title || 'Pokketfit Coach';
    const options = {
      body: payload.body || 'You have a new fitness goal waiting.',
      icon: payload.icon || '/icon-192.png',
      badge: '/icon-192.png',
      vibrate: [100, 50, 100],
      sound: '/notification.wav',
      data: {
        url: payload.url || '/dashboard',
        taskId: payload.taskId,
      },
      actions: [
        { action: 'open', title: 'Open Task' },
        { action: 'dismiss', title: 'Dismiss' }
      ]
    };

    event.waitUntil(self.registration.showNotification(title, options));
  } catch (err) {
    const text = event.data.text();
    event.waitUntil(
      self.registration.showNotification('Pokketfit Coach', {
        body: text,
        icon: '/icon-192.png',
      sound: payload.sound ? '/' + payload.sound + '.wav' : '/notification.wav',
        data: { url: '/dashboard' }
      })
    );
  }
});

self.addEventListener('notificationclick', function (event) {
  event.notification.close();

  if (event.action === 'dismiss') {
    return;
  }

  const targetUrl = (event.notification.data && event.notification.data.url) || '/dashboard';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (clientList) {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url.includes(targetUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
