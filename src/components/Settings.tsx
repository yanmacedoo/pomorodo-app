import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings as SettingsIcon } from 'lucide-react';
import type { PomodoroConfig } from '@/hooks/usePomodoro';

interface SettingsProps {
    config: PomodoroConfig;
    onSave: (config: PomodoroConfig) => void;
}

export function Settings({ config, onSave }: SettingsProps) {
    const [open, setOpen] = useState(false);
    const [workDuration, setWorkDuration] = useState(config.workDuration);
    const [shortBreakDuration, setShortBreakDuration] = useState(config.shortBreakDuration);
    const [longBreakDuration, setLongBreakDuration] = useState(config.longBreakDuration);
    const [sessionsUntilLongBreak, setSessionsUntilLongBreak] = useState(config.sessionsUntilLongBreak);

    const handleSave = () => {
        onSave({
            workDuration,
            shortBreakDuration,
            longBreakDuration,
            sessionsUntilLongBreak,
        });
        setOpen(false);
    };

    const handleReset = () => {
        setWorkDuration(25);
        setShortBreakDuration(5);
        setLongBreakDuration(15);
        setSessionsUntilLongBreak(4);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="absolute top-4 left-4"
                    aria-label="Configurações"
                >
                    <SettingsIcon className="h-5 w-5" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>⚙️ Configurações do Timer</DialogTitle>
                    <DialogDescription>
                        Personalize os tempos do seu Pomodoro. Os valores são em minutos.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <label htmlFor="work" className="text-sm font-medium">
                            🍅 Tempo de Foco
                        </label>
                        <Input
                            id="work"
                            type="number"
                            min="1"
                            max="60"
                            value={workDuration}
                            onChange={(e) => setWorkDuration(Number(e.target.value))}
                            className="w-full"
                        />
                        <p className="text-xs text-muted-foreground">
                            Padrão: 25 minutos
                        </p>
                    </div>

                    <div className="grid gap-2">
                        <label htmlFor="shortBreak" className="text-sm font-medium">
                            ☕ Pausa Curta
                        </label>
                        <Input
                            id="shortBreak"
                            type="number"
                            min="1"
                            max="30"
                            value={shortBreakDuration}
                            onChange={(e) => setShortBreakDuration(Number(e.target.value))}
                            className="w-full"
                        />
                        <p className="text-xs text-muted-foreground">
                            Padrão: 5 minutos
                        </p>
                    </div>

                    <div className="grid gap-2">
                        <label htmlFor="longBreak" className="text-sm font-medium">
                            🌴 Pausa Longa
                        </label>
                        <Input
                            id="longBreak"
                            type="number"
                            min="1"
                            max="60"
                            value={longBreakDuration}
                            onChange={(e) => setLongBreakDuration(Number(e.target.value))}
                            className="w-full"
                        />
                        <p className="text-xs text-muted-foreground">
                            Padrão: 15 minutos
                        </p>
                    </div>

                    <div className="grid gap-2">
                        <label htmlFor="sessions" className="text-sm font-medium">
                            🔄 Sessões até Pausa Longa
                        </label>
                        <Input
                            id="sessions"
                            type="number"
                            min="1"
                            max="10"
                            value={sessionsUntilLongBreak}
                            onChange={(e) => setSessionsUntilLongBreak(Number(e.target.value))}
                            className="w-full"
                        />
                        <p className="text-xs text-muted-foreground">
                            Padrão: 4 sessões
                        </p>
                    </div>
                </div>
                <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={handleReset}>
                        Restaurar Padrões
                    </Button>
                    <Button onClick={handleSave}>
                        Salvar Configurações
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
