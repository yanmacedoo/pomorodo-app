import { useEffect, useState } from 'react';
import { PomodoroTimer } from '@/components/PomodoroTimer';
import { Settings } from '@/components/Settings';
import { registerServiceWorker } from '@/utils/registerSW';
import { Moon, Sun } from 'lucide-react';
import type { PomodoroConfig } from '@/hooks/usePomodoro';

const DEFAULT_CONFIG: PomodoroConfig = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  sessionsUntilLongBreak: 4,
};

function App() {
  const [isDark, setIsDark] = useState(false);
  const [config, setConfig] = useState<PomodoroConfig>(() => {
    const saved = localStorage.getItem('pomodoroConfig');
    return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
  });

  useEffect(() => {
    // Registrar Service Worker
    registerServiceWorker();

    // Verificar preferência de tema
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const handleSaveConfig = (newConfig: PomodoroConfig) => {
    setConfig(newConfig);
    localStorage.setItem('pomodoroConfig', JSON.stringify(newConfig));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary flex flex-col items-center justify-center p-4 relative">
      {/* Settings Button */}
      <Settings config={config} onSave={handleSaveConfig} />

      {/* Toggle de Tema */}
      <button
        onClick={toggleTheme}
        className="absolute top-4 right-4 p-3 rounded-full bg-card shadow-lg hover:shadow-xl transition-all"
        aria-label="Alternar tema"
      >
        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>

      {/* Cabeçalho */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-primary mb-2">
          🍅 Pomodoro Timer
        </h1>
        <p className="text-muted-foreground">
          Aumente sua produtividade com a técnica Pomodoro
        </p>
      </div>

      {/* Timer Component */}
      <PomodoroTimer config={config} />

      {/* Rodapé */}
      <footer className="mt-12 text-center">
        <p className="text-sm text-muted-foreground">
          Técnica Pomodoro: {config.workDuration} min de foco + {config.shortBreakDuration} min de pausa
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Adicione à tela inicial para usar como app 📱
        </p>
      </footer>
    </div>
  );
}

export default App;


