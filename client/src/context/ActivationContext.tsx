import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { SonyActivationContext } from 'shared/src/sonyActivation';
import { fetchActivationContext } from '../utils/activationApi';

export type ActivationStatus = 'loading' | 'success' | 'error';

export interface ActivationContextValue {
  status: ActivationStatus;
  /** The validated Sony Activation context, or null until loaded. */
  context: SonyActivationContext | null;
  /** Browser-visible Activation URL, or null when unset/unavailable. */
  activationUrl: string | null;
  /** Sanitized error message for the UI (never contains internals). */
  error: string | null;
}

const DEFAULT_VALUE: ActivationContextValue = {
  status: 'loading',
  context: null,
  activationUrl: null,
  error: null,
};

const ActivationContext = createContext<ActivationContextValue>(DEFAULT_VALUE);

/**
 * Provider that fetches `/api/activation-context` exactly once and exposes
 * loading / success / error states. It introduces NO scene or navigation
 * behavior — it only makes the sanitized context available to consumers.
 *
 * Deliberately not mounted into the app yet (that happens in a later phase
 * alongside the scene components), so current visual behavior is unchanged.
 */
export function ActivationProvider({ children }: { children: ReactNode }) {
  const [value, setValue] = useState<ActivationContextValue>(DEFAULT_VALUE);
  // Guard against duplicate fetches (e.g. StrictMode double-invoke) so scene
  // changes never trigger repeated requests.
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const controller = new AbortController();

    fetchActivationContext(controller.signal)
      .then((res) => {
        setValue({
          status: 'success',
          context: res.context,
          activationUrl: res.activationUrl,
          error: null,
        });
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setValue({
          status: 'error',
          context: null,
          activationUrl: null,
          error: 'Unable to load the Activation context.',
        });
        // Sanitized server-shaped message only; no payload dump.
        console.error('[ActivationProvider]', err instanceof Error ? err.message : 'load failed');
      });

    return () => controller.abort();
  }, []);

  return <ActivationContext.Provider value={value}>{children}</ActivationContext.Provider>;
}

/** Access the Activation context value (status, context, activationUrl, error). */
export function useActivation(): ActivationContextValue {
  return useContext(ActivationContext);
}

export { ActivationContext };
