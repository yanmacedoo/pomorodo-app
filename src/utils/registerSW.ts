export async function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/',
            });

            console.log('Service Worker registrado com sucesso:', registration);

            // Verificar atualizações
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                if (newWorker) {
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('Nova versão disponível! Recarregue a página para atualizar.');
                        }
                    });
                }
            });

            return registration;
        } catch (error) {
            console.error('Erro ao registrar Service Worker:', error);
            return null;
        }
    } else {
        console.warn('Service Workers não são suportados neste navegador');
        return null;
    }
}
