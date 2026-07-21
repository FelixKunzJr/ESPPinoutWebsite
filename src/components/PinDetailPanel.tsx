import { useEffect, useRef } from 'react'
import { useApp } from '../context/AppContext'
import { useMediaQuery } from '../utils/useMediaQuery'
import { PinDetailHeader, PinDetailBody } from './PinDetailContent'

// The desktop presentation: a panel docked to the right edge.
//
// Phones do not use this at all - there, MobileActionBar is the single sheet
// host, so selecting a pin from inside the pin-table sheet drills down in
// place instead of stacking a second sheet on top of the first.
export function PinDetailPanel() {
  const { selectedPin, setSelectedPin } = useApp()
  const panelRef = useRef<HTMLDivElement>(null)
  const isPhone = useMediaQuery('(max-width: 767px)')
  const close = () => setSelectedPin(null)

  // Close when clicking anywhere outside the panel. Uses a document listener
  // (not a backdrop) so a click on another pin selects it directly instead of
  // just dismissing. The pin-diagram click that opened the panel has already
  // finished before this effect attaches, so it won't self-close.
  //
  // Clicks that land on a pin are exempt: mousedown used to clear the
  // selection a beat before the pin's own click handler ran, so the toggle
  // saw an empty selection and re-opened instead of closing. Re-clicking the
  // open pin now closes it, which is what the toggle always intended.
  useEffect(() => {
    if (!selectedPin || isPhone) return
    const onDown = (e: MouseEvent) => {
      const target = e.target as Element | null
      if (target?.closest?.('[data-pin-anchor]')) return
      if (panelRef.current && !panelRef.current.contains(target as Node)) {
        setSelectedPin(null)
      }
    }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSelectedPin(null) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [selectedPin, setSelectedPin, isPhone])

  if (!selectedPin || isPhone) return null

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-label={`GPIO${selectedPin.gpio} details`}
      className="fixed right-0 top-0 h-full w-80 bg-gray-900 border-l border-gray-800 shadow-2xl flex flex-col z-50 overflow-y-auto"
    >
      <div className="sticky top-0 bg-gray-900 z-10">
        <PinDetailHeader pin={selectedPin} onClose={close} />
      </div>
      <PinDetailBody pin={selectedPin} />
    </div>
  )
}
