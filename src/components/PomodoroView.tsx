import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  CloudRain, 
  Radio, 
  Headphones, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Timer, 
  Sparkles,
  Flame
} from 'lucide-react';
import { soundEngine } from '../services/sound';

interface PomodoroViewProps {
  secondsLeft: number;
  setSecondsLeft: React.Dispatch<React.SetStateAction<number>>;
  isActive: boolean;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  mode: 'focus' | 'shortBreak' | 'longBreak';
  setMode: React.Dispatch<React.SetStateAction<'focus' | 'shortBreak' | 'longBreak'>>;
  cyclesCompleted: number;
  setCyclesCompleted: React.Dispatch<React.SetStateAction<number>>;
  onFocusMinutesLogged: (minutes: number) => void;
}

export const PomodoroView: React.FC<PomodoroViewProps> = ({
  secondsLeft,
  setSecondsLeft,
  isActive,
  setIsActive,
  mode,
  setMode,
  cyclesCompleted,
  setCyclesCompleted,
  onFocusMinutesLogged,
}) => {
  const [ambientSound, setAmbientSound] = useState<'off' | 'rain' | 'whitenoise' | 'binaural'>('off');
  const [volume, setVolume] = useState(0.3);
  const [tasks, setTasks] = useState<Array<{ id: string; text: string; done: boolean }>>([
    { id: '1', text: 'Revisar baralho de Neurociência (15 min)', done: true },
    { id: '2', text: 'Fazer 1 sessão Feynman sobre Entropia', done: false },
    { id: '3', text: 'Resolver Simulado de 5 questões', done: false }
  ]);
  const [newTaskText, setNewTaskText] = useState('');

  const modeTimes = {
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  };

  const switchMode = (newMode: 'focus' | 'shortBreak' | 'longBreak') => {
    setIsActive(false);
    setMode(newMode);
    setSecondsLeft(modeTimes[newMode]);
  };

  const handleToggleTimer = () => {
    setIsActive(!isActive);
  };

  const handleReset = () => {
    setIsActive(false);
    setSecondsLeft(modeTimes[mode]);
  };

  const handleSkip = () => {
    setIsActive(false);
    if (mode === 'focus') {
      const nextCycles = cyclesCompleted + 1;
      setCyclesCompleted(nextCycles);
      onFocusMinutesLogged(25);
      soundEngine.playChime();
      if (nextCycles % 4 === 0) {
        switchMode('longBreak');
      } else {
        switchMode('shortBreak');
      }
    } else {
      switchMode('focus');
    }
  };

  const handleSoundChange = (type: 'off' | 'rain' | 'whitenoise' | 'binaural') => {
    setAmbientSound(type);
    if (type === 'off') {
      soundEngine.stopAmbient();
    } else {
      soundEngine.playAmbient(type, volume);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    soundEngine.setVolume(newVol);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    setTasks(prev => [...prev, { id: `task-${Date.now()}`, text: newTaskText, done: false }]);
    setNewTaskText('');
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // SVG Progress Ring calculations
  const totalSeconds = modeTimes[mode];
  const progressPercent = ((totalSeconds - secondsLeft) / totalSeconds) * 100;
  const radius = 110;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold mb-2">
            <Timer className="w-3.5 h-3.5 text-rose-400" />
            <span>Ritmo Ultraniano & Gestão de Energia</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Pomodoro & Modo Foco Profundo
          </h2>
          <p className="text-slate-400 text-sm mt-0.5">
            Sincronize 25 minutos de atenção absoluta com gerador sonoro procedural nativo.
          </p>
        </div>

        {/* Cycles counter */}
        <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl">
          <Flame className="w-5 h-5 text-amber-400" />
          <div>
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Ciclos Completos</span>
            <span className="text-sm font-extrabold text-white">{cyclesCompleted} pomodoros hoje</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Timer Column (Left 7) */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col items-center shadow-xl space-y-6">
          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => switchMode('focus')}
              className={`px-4 py-2 rounded-lg transition-all ${
                mode === 'focus' ? 'bg-rose-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Foco (25 min)
            </button>
            <button
              onClick={() => switchMode('shortBreak')}
              className={`px-4 py-2 rounded-lg transition-all ${
                mode === 'shortBreak' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Pausa Curta (5 min)
            </button>
            <button
              onClick={() => switchMode('longBreak')}
              className={`px-4 py-2 rounded-lg transition-all ${
                mode === 'longBreak' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              Pausa Longa (15 min)
            </button>
          </div>

          {/* Circular SVG Timer */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center my-2">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 260 260">
              <circle
                cx="130"
                cy="130"
                r={radius}
                className="stroke-slate-950 fill-none"
                strokeWidth="10"
              />
              <circle
                cx="130"
                cy="130"
                r={radius}
                className={`fill-none transition-all duration-1000 ${
                  mode === 'focus' ? 'stroke-rose-500' : mode === 'shortBreak' ? 'stroke-indigo-500' : 'stroke-emerald-500'
                }`}
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>

            {/* Time inside circle */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-4xl sm:text-5xl font-black text-white tracking-tight font-mono">
                {formattedTime}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-2">
                {mode === 'focus' ? 'Atenção Total' : 'Descanse os Olhos'}
              </span>
            </div>
          </div>

          {/* Timer Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
              title="Reiniciar tempo"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <button
              onClick={handleToggleTimer}
              className={`px-8 py-3.5 rounded-xl font-extrabold text-sm shadow-xl transition-all flex items-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30'
                  : mode === 'focus'
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
              }`}
            >
              {isActive ? (
                <>
                  <Pause className="w-5 h-5" />
                  <span>Pausar</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>Iniciar Foco</span>
                </>
              )}
            </button>

            <button
              onClick={handleSkip}
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer"
              title="Pular ciclo"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Web Audio Procedural Ambience Generator */}
          <div className="w-full pt-4 border-t border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Headphones className="w-4 h-4 text-indigo-400" />
                Áudio Ambiente Procedural (Web Audio)
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Sintetizado ao vivo sem carregar arquivos
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleSoundChange('off')}
                className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  ambientSound === 'off'
                    ? 'bg-slate-800 border-slate-700 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300'
                }`}
              >
                <VolumeX className="w-3.5 h-3.5" />
                <span>Silêncio</span>
              </button>

              <button
                type="button"
                onClick={() => handleSoundChange('rain')}
                className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  ambientSound === 'rain'
                    ? 'bg-cyan-950/60 border-cyan-500 text-cyan-200 shadow-md shadow-cyan-500/20'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300'
                }`}
              >
                <CloudRain className="w-3.5 h-3.5 text-cyan-400" />
                <span>Chuva</span>
              </button>

              <button
                type="button"
                onClick={() => handleSoundChange('whitenoise')}
                className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  ambientSound === 'whitenoise'
                    ? 'bg-violet-950/60 border-violet-500 text-violet-200 shadow-md shadow-violet-500/20'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300'
                }`}
              >
                <Radio className="w-3.5 h-3.5 text-violet-400" />
                <span>Ruído Branco</span>
              </button>

              <button
                type="button"
                onClick={() => handleSoundChange('binaural')}
                className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  ambientSound === 'binaural'
                    ? 'bg-emerald-950/60 border-emerald-500 text-emerald-200 shadow-md shadow-emerald-500/20'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-300'
                }`}
              >
                <Headphones className="w-3.5 h-3.5 text-emerald-400" />
                <span>Ondas Alfa</span>
              </button>
            </div>

            {ambientSound !== 'off' && (
              <div className="flex items-center gap-3 pt-1">
                <Volume2 className="w-4 h-4 text-slate-400" />
                <input
                  type="range"
                  min="0.05"
                  max="0.8"
                  step="0.05"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
                <span className="text-xs text-slate-400 w-8">{Math.round(volume * 100)}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Sprint Tasks Column (Right 5) */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-rose-400" />
                Metas do Sprint Atual
              </span>
              <span className="text-xs text-slate-500">
                {tasks.filter(t => t.done).length}/{tasks.length} concluídas
              </span>
            </div>

            {/* Task list */}
            <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
              {tasks.map(task => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                    task.done 
                      ? 'bg-slate-950/40 border-slate-900 text-slate-500 line-through' 
                      : 'bg-slate-950/80 border-slate-800 text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-4 h-4 rounded-md border flex items-center justify-center flex-shrink-0 transition-colors ${
                      task.done ? 'bg-emerald-500 border-emerald-500 text-slate-950' : 'border-slate-700'
                    }`}>
                      {task.done && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                    <span className="text-xs sm:text-sm font-medium truncate">{task.text}</span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTask(task.id);
                    }}
                    className="text-slate-600 hover:text-rose-400 p-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add task form */}
          <form onSubmit={handleAddTask} className="pt-3 border-t border-slate-800">
            <div className="flex gap-2">
              <input
                type="text"
                value={newTaskText}
                onChange={(e) => setNewTaskText(e.target.value)}
                placeholder="Adicionar meta para este bloco..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-rose-500"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
