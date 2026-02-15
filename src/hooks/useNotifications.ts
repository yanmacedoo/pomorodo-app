import { useState, useEffect, useCallback } from 'react';

export function useNotifications() {
    const [permission, setPermission] = useState<NotificationPermission>('default');
    const [supported, setSupported] = useState(false);

    useEffect(() => {
        if ('Notification' in window) {
            setSupported(true);
            setPermission(Notification.permission);
        }
    }, []);

    const requestPermission = useCallback(async () => {
        if (!supported) {
            console.warn('Notificações não são suportadas neste navegador');
            return false;
        }

        try {
            const result = await Notification.requestPermission();
            setPermission(result);
            return result === 'granted';
        } catch (error) {
            console.error('Erro ao solicitar permissão de notificação:', error);
            return false;
        }
    }, [supported]);

    const sendNotification = useCallback((title: string, options?: NotificationOptions) => {
        if (!supported) {
            console.warn('Notificações não são suportadas neste navegador');
            return;
        }

        if (permission !== 'granted') {
            console.warn('Permissão de notificação não concedida');
            return;
        }

        try {
            // Se o Service Worker estiver registrado, usar notificações PWA
            if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
                navigator.serviceWorker.ready.then((registration) => {
                    registration.showNotification(title, {
                        icon: '/icon-192x192.png',
                        badge: '/icon-192x192.png',
                        requireInteraction: true,
                        ...options,
                    });
                });
            } else {
                // Fallback para notificações padrão
                new Notification(title, {
                    icon: '/icon-192x192.png',
                    ...options,
                });
            }
        } catch (error) {
            console.error('Erro ao enviar notificação:', error);
        }
    }, [supported, permission]);

    return {
        supported,
        permission,
        requestPermission,
        sendNotification,
    };
}
