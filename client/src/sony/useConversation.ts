import { useCallback, useEffect, useReducer, useRef } from 'react';

/**
 * Shared deterministic conversation primitive for the interactive scenes
 * (Teams, Claude, Slack fallback). It drives one preloaded prompt through:
 *
 *   idle → sent (user message shown) → progress stages (cycled) →
 *   revealing (answer sections appear one-by-one) → done
 *
 * Guarantees:
 *   - Enter submits; Shift+Enter never submits (handled by the caller via
 *     `handleComposerKeyDown`).
 *   - Duplicate submissions during generation are ignored.
 *   - All timers are tracked and cleared on reset, unmount, and phase change,
 *     so scene switching never leaks timers or continues hidden animations.
 *   - Deterministic timing/copy. Under reduced motion, stage cycling and the
 *     progressive reveal collapse to a single fast step while preserving the
 *     state sequence.
 */

export type ConvoPhase = 'idle' | 'thinking' | 'revealing' | 'done';

export interface ConversationConfig {
  /** Ordered progress summaries cycled during the thinking phase. */
  progressStages: string[];
  /** Number of answer sections that reveal progressively. */
  sectionCount: number;
  /** Per-stage dwell (ms) while thinking. */
  stageMs?: number;
  /** Per-section reveal interval (ms) while revealing. */
  revealMs?: number;
  /** Reduced motion collapses decorative timing. */
  reducedMotion?: boolean;
}

interface ConvoState {
  phase: ConvoPhase;
  /** True once the prompt has been submitted (user message visible). */
  submitted: boolean;
  /** Index into progressStages currently shown. */
  stageIndex: number;
  /** Number of answer sections revealed so far. */
  revealed: number;
}

type Action =
  | { type: 'submit' }
  | { type: 'advanceStage' }
  | { type: 'startReveal' }
  | { type: 'revealNext' }
  | { type: 'complete' }
  | { type: 'reset' };

const INITIAL: ConvoState = { phase: 'idle', submitted: false, stageIndex: 0, revealed: 0 };

function reducer(state: ConvoState, action: Action): ConvoState {
  switch (action.type) {
    case 'submit':
      if (state.submitted) return state; // duplicate-send guard
      return { phase: 'thinking', submitted: true, stageIndex: 0, revealed: 0 };
    case 'advanceStage':
      return { ...state, stageIndex: state.stageIndex + 1 };
    case 'startReveal':
      return { ...state, phase: 'revealing', revealed: 1 };
    case 'revealNext':
      return { ...state, revealed: state.revealed + 1 };
    case 'complete':
      return { ...state, phase: 'done' };
    case 'reset':
      return INITIAL;
    default:
      return state;
  }
}

export interface ConversationApi {
  phase: ConvoPhase;
  submitted: boolean;
  /** Current progress-stage label, or null when not thinking. */
  currentStage: string | null;
  /** Index of the current progress stage (0..stages-1); 0 when not thinking. */
  stageIndex: number;
  /** Number of answer sections currently visible (0..sectionCount). */
  revealed: number;
  /** True while generating (thinking or still revealing) — disables re-submit. */
  busy: boolean;
  /** Submit the preloaded prompt (idempotent while busy/done). */
  submit: () => void;
  /** Restore untouched initial state and clear all timers. */
  reset: () => void;
  /** Composer keydown handler: Enter submits, Shift+Enter does not. */
  handleComposerKeyDown: (e: { key: string; shiftKey: boolean; preventDefault: () => void }) => void;
}

export function useConversation(config: ConversationConfig): ConversationApi {
  const { progressStages, sectionCount, reducedMotion = false } = config;
  const stageMs = reducedMotion ? 120 : config.stageMs ?? 1200;
  const revealMs = reducedMotion ? 60 : config.revealMs ?? 260;

  const [state, dispatch] = useReducer(reducer, INITIAL);
  const timers = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    for (const t of timers.current) window.clearTimeout(t);
    timers.current = [];
  }, []);

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
  }, []);

  const submit = useCallback(() => {
    dispatch({ type: 'submit' });
  }, []);

  const reset = useCallback(() => {
    clearTimers();
    dispatch({ type: 'reset' });
  }, [clearTimers]);

  const handleComposerKeyDown = useCallback(
    (e: { key: string; shiftKey: boolean; preventDefault: () => void }) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        submit();
      }
      // Shift+Enter: allow default (newline); never submit.
    },
    [submit]
  );

  // Drive the thinking → revealing → done sequence deterministically.
  useEffect(() => {
    if (state.phase === 'thinking') {
      // Cycle through the remaining progress stages, then start revealing.
      if (state.stageIndex < progressStages.length - 1) {
        schedule(() => dispatch({ type: 'advanceStage' }), stageMs);
      } else {
        schedule(() => dispatch({ type: 'startReveal' }), stageMs);
      }
    } else if (state.phase === 'revealing') {
      if (state.revealed < sectionCount) {
        schedule(() => dispatch({ type: 'revealNext' }), revealMs);
      } else {
        schedule(() => dispatch({ type: 'complete' }), revealMs);
      }
    }
    // Cleanup on each phase/index change and on unmount clears pending timers.
    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.phase, state.stageIndex, state.revealed]);

  // Final safety: clear timers if the component unmounts mid-sequence.
  useEffect(() => clearTimers, [clearTimers]);

  const busy = state.phase === 'thinking' || state.phase === 'revealing';
  const currentStage =
    state.phase === 'thinking' ? progressStages[Math.min(state.stageIndex, progressStages.length - 1)] : null;

  return {
    phase: state.phase,
    submitted: state.submitted,
    currentStage,
    stageIndex: Math.min(state.stageIndex, progressStages.length - 1),
    revealed: state.revealed,
    busy,
    submit,
    reset,
    handleComposerKeyDown,
  };
}
