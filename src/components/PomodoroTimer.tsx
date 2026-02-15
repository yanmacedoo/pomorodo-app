import { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { usePomodoro, type PomodoroMode, type PomodoroConfig } from '@/hooks/usePomodoro';
import { useNotifications } from '@/hooks/useNotifications';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';

const MODE_LABELS: Record<PomodoroMode, string> = {
    work: 'Foco',
    shortBreak: 'Pausa Curta',
    longBreak: 'Pausa Longa',
};

const MODE_EMOJIS: Record<PomodoroMode, string> = {
    work: '🍅',
    shortBreak: '☕',
    longBreak: '🌴',
};

interface PomodoroTimerProps {
    config: PomodoroConfig;
}

function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function PomodoroTimer({ config }: PomodoroTimerProps) {
    const { sendNotification, requestPermission, permission } = useNotifications();

    const handleComplete = () => {
        // Reproduzir som de notificação
        try {
            const audio = new Audio('/notification.mp3');
            audio.volume = 0.5; // Volume a 50%
            audio.play().catch((error) => {
                console.log('Não foi possível reproduzir o áudio:', error);
                // Tentar tocar beep do sistema como fallback
                try {
                    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();

                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);

                    oscillator.frequency.value = 800; // Frequência em Hz
                    gainNode.gain.value = 0.3; // Volume

                    oscillator.start();
                    setTimeout(() => oscillator.stop(), 200); // Duração de 200ms
                } catch (fallbackError) {
                    console.log('Fallback de áudio também falhou:', fallbackError);
                }
            });
        } catch (error) {
            console.error('Erro ao tentar reproduzir som:', error);
        }

        sendNotification('Timer Finalizado! ⏰', {
            body: mode === 'work'
                ? 'Hora de fazer uma pausa! ☕'
                : 'Hora de voltar ao trabalho! 🍅',
            tag: 'pomodoro-timer',
        });
    };

    const {
        mode,
        timeLeft,
        isRunning,
        sessionsCompleted,
        progress,
        start,
        pause,
        reset,
        skip,
    } = usePomodoro(config, handleComplete);

    useEffect(() => {
        if (permission === 'default') {
            requestPermission();
        }
    }, [permission, requestPermission]);

    // Atualizar título da página com o tempo restante
    useEffect(() => {
        if (isRunning) {
            document.title = `${formatTime(timeLeft)} - ${MODE_LABELS[mode]} - Pomodoro`;
        } else {
            document.title = 'Pomodoro - Timer de Produtividade';
        }
    }, [isRunning, timeLeft, mode]);

    return (
        <Card className="w-full max-w-md mx-auto shadow-2xl">
            <CardContent className="pt-6">
                <div className="space-y-8">
                    {/* Modo e Emoji */}
                    <div className="text-center">
                        <div className="text-6xl mb-4 animate-pulse-subtle">
                            {MODE_EMOJIS[mode]}
                        </div>
                        <h2 className="text-2xl font-bold text-foreground">
                            {MODE_LABELS[mode]}
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Sessões completadas: {sessionsCompleted}
                        </p>
                    </div>

                    {/* Timer Display */}
                    <div className="text-center">
                        <div className="text-7xl font-bold font-mono tracking-tight text-primary">
                            {formatTime(timeLeft)}
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <Progress value={progress} className="h-3" />

                    {/* Controles */}
                    <div className="flex gap-3 justify-center">
                        {!isRunning ? (
                            <Button
                                onClick={start}
                                size="lg"
                                className="flex-1 max-w-[200px]"
                            >
                                <Play className="mr-2 h-5 w-5" />
                                Iniciar
                            </Button>
                        ) : (
                            <Button
                                onClick={pause}
                                size="lg"
                                variant="secondary"
                                className="flex-1 max-w-[200px]"
                            >
                                <Pause className="mr-2 h-5 w-5" />
                                Pausar
                            </Button>
                        )}

                        <Button
                            onClick={reset}
                            size="lg"
                            variant="outline"
                        >
                            <RotateCcw className="h-5 w-5" />
                        </Button>

                        <Button
                            onClick={skip}
                            size="lg"
                            variant="outline"
                        >
                            <SkipForward className="h-5 w-5" />
                        </Button>
                    </div>

                    {/* Informação sobre notificações */}
                    {permission !== 'granted' && (
                        <div className="text-center">
                            <p className="text-xs text-muted-foreground">
                                💡 Ative as notificações para ser alertado quando o timer terminar
                            </p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
