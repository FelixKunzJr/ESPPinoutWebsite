import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'

// The phone presentation for anything that would be a side panel or a modal
// on desktop. Shared by the bottom action bar's sections and by the pin
// detail panel, so every sheet in the app dismisses the same way: tap the
// backdrop, press Escape, or drag the handle down.

// How far the sheet has to be dragged before release dismisses it.
const DISMISS_PX = 90
const ENTER_MS = 240
const EXIT_MS = 180

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export function BottomSheet({ ariaLabel, onClose, header, children }: {
  ariaLabel: string
  /** Called once the exit animation has finished. */
  onClose: () => void
  /**
   * Receives the animated dismiss function - a header's own close button has
   * to run the exit transition rather than unmounting the sheet outright.
   */
  header?: (close: () => void) => ReactNode
  children: ReactNode
}) {
  // entered: false for the first frame only, so the sheet has somewhere to
  // animate up from. closing: holds it mounted while it animates back down.
  const [entered, setEntered] = useState(false)
  const [closing, setClosing] = useState(false)
  const [dragY, setDragY] = useState(0)
  const startY = useRef<number | null>(null)
  // Tracked as state, not derived from the ref: the render needs to know
  // whether a finger is down in order to drop the transition, and a ref read
  // during render is not a legal dependency.
  const [dragging, setDragging] = useState(false)
  const reduce = prefersReducedMotion()

  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true))
    return () => cancelAnimationFrame(id)
  }, [])

  const dismiss = useCallback(() => {
    if (closing) return
    if (prefersReducedMotion()) { onClose(); return }
    setClosing(true)
    window.setTimeout(onClose, EXIT_MS)
  }, [closing, onClose])

  // Lock the page behind the sheet so a scroll gesture moves the sheet's own
  // content rather than the studio underneath it.
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') dismiss() }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [dismiss])

  // Drag-to-dismiss, bound to the handle and header only: binding it to the
  // whole sheet would swallow scrolling inside the content.
  const drag = {
    onTouchStart: (e: React.TouchEvent) => {
      startY.current = e.touches[0].clientY
      setDragging(true)
    },
    onTouchMove: (e: React.TouchEvent) => {
      if (startY.current === null) return
      const dy = e.touches[0].clientY - startY.current
      if (dy > 0) setDragY(dy)
    },
    onTouchEnd: () => {
      const dragged = dragY
      startY.current = null
      setDragging(false)
      // Past the threshold the sheet keeps going and dismisses; short of it,
      // it springs back to rest.
      if (dragged > DISMISS_PX) dismiss()
      else setDragY(0)
    },
  }

  // Off-screen before the first frame and again while closing; otherwise it
  // sits at rest, offset by whatever the finger has dragged.
  const offset = !entered || closing ? '100%' : `${dragY}px`
  const open = entered && !closing

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div
        className="absolute inset-0 bg-black/60 motion-safe:transition-opacity"
        style={{ opacity: open ? 1 : 0, transitionDuration: `${closing ? EXIT_MS : ENTER_MS}ms` }}
        onClick={dismiss}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className="relative rounded-t-2xl border-t border-gray-700 bg-gray-900 flex flex-col will-change-transform"
        style={{
          maxHeight: '85vh',
          transform: `translateY(${offset})`,
          // No transition while the finger is down - the sheet has to track
          // the drag exactly, not lag behind it.
          transition: dragging || reduce
            ? 'none'
            : `transform ${closing ? EXIT_MS : ENTER_MS}ms cubic-bezier(0.32, 0.72, 0, 1)`,
        }}
      >
        <div {...drag} className="pt-2.5 pb-1 flex justify-center flex-shrink-0 touch-none">
          <span className="h-1 w-10 rounded-full bg-gray-600" aria-hidden="true" />
        </div>
        {header && <div {...drag} className="flex-shrink-0 touch-none">{header(dismiss)}</div>}
        <div className="overflow-y-auto overscroll-contain">{children}</div>
      </div>
    </div>
  )
}
