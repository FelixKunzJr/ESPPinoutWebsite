import { useEffect, useRef, useState, type ReactNode } from 'react'

// The phone presentation for anything that would be a side panel or a modal
// on desktop. Shared by the bottom action bar's sections and by the pin
// detail panel, so every sheet in the app dismisses the same way: tap the
// backdrop, press Escape, or drag the handle down.

// How far the sheet has to be dragged before release dismisses it.
const DISMISS_PX = 90

export function BottomSheet({ ariaLabel, onClose, header, children }: {
  ariaLabel: string
  onClose: () => void
  /** Rendered in the sticky area under the grab handle. */
  header?: ReactNode
  children: ReactNode
}) {
  const [dragY, setDragY] = useState(0)
  const startY = useRef<number | null>(null)

  // Lock the page behind the sheet so a scroll gesture moves the sheet's own
  // content rather than the studio underneath it.
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      document.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  // Drag-to-dismiss, bound to the handle and header only: binding it to the
  // whole sheet would swallow scrolling inside the content.
  const drag = {
    onTouchStart: (e: React.TouchEvent) => { startY.current = e.touches[0].clientY },
    onTouchMove: (e: React.TouchEvent) => {
      if (startY.current === null) return
      const dy = e.touches[0].clientY - startY.current
      if (dy > 0) setDragY(dy)
    },
    onTouchEnd: () => {
      startY.current = null
      if (dragY > DISMISS_PX) onClose()
      else setDragY(0)
    },
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className="relative rounded-t-2xl border-t border-gray-700 bg-gray-900 flex flex-col"
        style={{
          maxHeight: '85vh',
          transform: dragY ? `translateY(${dragY}px)` : undefined,
          transition: dragY ? 'none' : 'transform 150ms ease-out',
        }}
      >
        <div {...drag} className="pt-2.5 pb-1 flex justify-center flex-shrink-0 touch-none">
          <span className="h-1 w-10 rounded-full bg-gray-600" aria-hidden="true" />
        </div>
        {header && <div {...drag} className="flex-shrink-0 touch-none">{header}</div>}
        <div className="overflow-y-auto overscroll-contain">{children}</div>
      </div>
    </div>
  )
}
