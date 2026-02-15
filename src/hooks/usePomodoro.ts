import { useState, useEffect, useCallback, useRef } from 'react';

export type PomodoroMode = 'work' | 'shortBreak' | 'longBreak';

export interface PomodoroConfig {
    workDuration: number; // em minutos
    shortBreakDuration: number;
    longBreakDuration: number;
    sessionsUntilLongBreak: number;
}

const DEFAULT_CONFIG: PomodoroConfig = {
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsUntilLongBreak: 4,
};

export function usePomodoro(config: PomodoroConfig = DEFAULT_CONFIG, onComplete?: () => void) {
    const [mode, setMode] = useState<PomodoroMode>('work');
    const [timeLeft, setTimeLeft] = useState(config.workDuration * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [sessionsCompleted, setSessionsCompleted] = useState(0);
    const intervalRef = useRef<number | null>(null);

    const getDuration = useCallback((currentMode: PomodoroMode) => {
        switch (currentMode) {
            case 'work':
                return config.workDuration * 60;
            case 'shortBreak':
                return config.shortBreakDuration * 60;
            case 'longBreak':
                return config.longBreakDuration * 60;
        }
    }, [config]);

    const start = useCallback(() => {
        setIsRunning(true);
    }, []);

    const pause = useCallback(() => {
        setIsRunning(false);
    }, []);

    const reset = useCallback(() => {
        setIsRunning(false);
        setTimeLeft(getDuration(mode));
    }, [mode, getDuration]);

    const skip = useCallback(() => {
        setIsRunning(false);
        if (mode === 'work') {
            const newSessionsCompleted = sessionsCompleted + 1;
            setSessionsCompleted(newSessionsCompleted);

            if (newSessionsCompleted % config.sessionsUntilLongBreak === 0) {
                setMode('longBreak');
                setTimeLeft(getDuration('longBreak'));
            } else {
                setMode('shortBreak');
                setTimeLeft(getDuration('shortBreak'));
            }
        } else {
            setMode('work');
            setTimeLeft(getDuration('work'));
        }
    }, [mode, sessionsCompleted, config.sessionsUntilLongBreak, getDuration]);

    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            intervalRef.current = window.setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        setIsRunning(false);
                        onComplete?.();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning, timeLeft, onComplete]);

    const progress = ((getDuration(mode) - timeLeft) / getDuration(mode)) * 100;

    return {
        mode,
        timeLeft,
        isRunning,
        sessionsCompleted,
        progress,
        start,
        pause,
        reset,
        skip,
    };
}
