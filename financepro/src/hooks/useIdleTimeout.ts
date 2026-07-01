import { useEffect, useRef, useCallback } from 'react'

const IDLE_TIMEOUT_MS = 60 * 60 * 1000   // 1 hora
const WARN_BEFORE_MS  = 5  * 60 * 1000   // avisa 5 min antes

const ACTIVITY_EVENTS = [
  'mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click',
]

interface UseIdleTimeoutOptions {
  onIdle: () => void
  onWarn?: () => void
  disabled?: boolean
}

/**
 * Detecta inatividade do usuário e chama onIdle() após IDLE_TIMEOUT_MS.
 * Chama onWarn() WARN_BEFORE_MS antes do timeout (para exibir modal).
 * Qualquer evento de interação reinicia o contador.
 */
export function useIdleTimeout({ onIdle, onWarn, disabled = false }: UseIdleTimeoutOptions) {
  const idleTimer  = useRef<ReturnType<typeof setTimeout> | null>(null)
  const warnTimer  = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimers = useCallback(() => {
    if (idleTimer.current)  clearTimeout(idleTimer.current)
    if (warnTimer.current)  clearTimeout(warnTimer.current)
  }, [])

  const resetTimers = useCallback(() => {
    if (disabled) return
    clearTimers()

    if (onWarn) {
      warnTimer.current = setTimeout(onWarn, IDLE_TIMEOUT_MS - WARN_BEFORE_MS)
    }
    idleTimer.current = setTimeout(onIdle, IDLE_TIMEOUT_MS)
  }, [disabled, clearTimers, onIdle, onWarn])

  useEffect(() => {
    if (disabled) { clearTimers(); return }

    resetTimers()

    ACTIVITY_EVENTS.forEach((ev) => window.addEventListener(ev, resetTimers, { passive: true }))

    return () => {
      clearTimers()
      ACTIVITY_EVENTS.forEach((ev) => window.removeEventListener(ev, resetTimers))
    }
  }, [disabled, resetTimers, clearTimers])
}
