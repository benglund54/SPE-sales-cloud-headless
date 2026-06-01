import { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '../../hooks/useTheme';
import { themeList } from '../../themes';
import type { ThemeId } from '../../types';

const themeIcons: Record<ThemeId, string> = {
  claude: 'C',
  chatgpt: 'G',
  google: 'GC',
  slack: 'S',
  teams: 'T',
};

function AgentModeToggle() {
  const [live, setLive] = useState(true);

  useEffect(() => {
    fetch('/api/agent-mode').then(r => r.json()).then(d => setLive(d.live)).catch(() => {});
  }, []);

  async function toggle() {
    const next = !live;
    setLive(next);
    await fetch('/api/agent-mode', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ live: next }),
    });
  }

  return (
    <button className="agent-mode-toggle" onClick={toggle} title={live ? 'Using live Claude + Salesforce' : 'Using mock responses'}>
      <span className={`agent-mode-dot ${live ? 'agent-mode-live' : 'agent-mode-mock'}`} />
      <span>{live ? 'Live' : 'Mock'}</span>
    </button>
  );
}

const DRAG_THRESHOLD = 5;

function useDraggable() {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 20, y: 20 });
  const state = useRef({ active: false, didDrag: false, startX: 0, startY: 0, offX: 0, offY: 0 });

  useEffect(() => {
    function onMove(e: PointerEvent) {
      const s = state.current;
      if (!s.active || !ref.current) return;
      const dx = Math.abs(e.clientX - s.startX);
      const dy = Math.abs(e.clientY - s.startY);
      if (!s.didDrag && dx < DRAG_THRESHOLD && dy < DRAG_THRESHOLD) return;
      s.didDrag = true;
      const el = ref.current;
      const newRight = window.innerWidth - e.clientX - (el.offsetWidth - s.offX);
      const newBottom = window.innerHeight - e.clientY - (el.offsetHeight - s.offY);
      setPos({
        x: Math.max(0, Math.min(newRight, window.innerWidth - el.offsetWidth)),
        y: Math.max(0, Math.min(newBottom, window.innerHeight - el.offsetHeight)),
      });
    }
    function onUp() {
      state.current.active = false;
    }
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
    return () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
    };
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    state.current = { active: true, didDrag: false, startX: e.clientX, startY: e.clientY, offX: e.clientX - rect.left, offY: e.clientY - rect.top };
  }, []);

  const suppressClick = useCallback((e: React.MouseEvent) => {
    if (state.current.didDrag) {
      e.stopPropagation();
      e.preventDefault();
    }
  }, []);

  return { ref, pos, onPointerDown, suppressClick };
}

export function ThemeSwitcher() {
  const { activeTheme, setTheme } = useTheme();
  const { ref, pos, onPointerDown, suppressClick } = useDraggable();

  return (
    <div
      ref={ref}
      className="theme-switcher"
      style={{ right: pos.x, bottom: pos.y, cursor: 'grab' }}
      onPointerDown={onPointerDown}
      onClickCapture={suppressClick}
    >
      <AgentModeToggle />
      <span className="agent-mode-divider" />
      <span className="theme-switcher-label">UI:</span>
      {themeList.map((t) => (
        <button
          key={t.id}
          className={`theme-switcher-btn ${activeTheme === t.id ? 'theme-switcher-btn-active' : ''}`}
          onClick={() => setTheme(t.id)}
          title={t.name}
        >
          <span className="theme-switcher-icon">{themeIcons[t.id]}</span>
          <span className="theme-switcher-name">{t.name}</span>
        </button>
      ))}
    </div>
  );
}
