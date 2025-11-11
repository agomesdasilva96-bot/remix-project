import React, { useEffect, useState, useRef } from 'react'
import { PointingHandPosition } from '../../lib/tutorials/types'
import './tutorial-styles.css'

export interface PointingHandProps {
  targetElement?: string | HTMLElement | null
  position?: PointingHandPosition
  visible: boolean
  animationSpeed?: 'slow' | 'normal' | 'fast'
  onAnimationComplete?: () => void
}

/**
 * PointingHand Component
 * Displays an animated hand icon that points to tutorial target elements
 */
export const PointingHand: React.FC<PointingHandProps> = ({
  targetElement,
  position,
  visible,
  animationSpeed = 'normal',
  onAnimationComplete
}) => {
  const [handPosition, setHandPosition] = useState<PointingHandPosition>({
    top: 0,
    left: 0,
    rotation: 0,
    visible: false
  })
  const handRef = useRef<HTMLDivElement>(null)
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const highlightedElementRef = useRef<HTMLElement | null>(null)

  // Calculate position based on target element
  useEffect(() => {
    // Remove previous highlight
    if (highlightedElementRef.current) {
      highlightedElementRef.current.classList.remove('tutorial-spotlight')
      highlightedElementRef.current = null
    }

    if (!visible) {
      setHandPosition(prev => ({ ...prev, visible: false }))
      return
    }

    // If explicit position is provided, use it
    if (position) {
      setHandPosition({ ...position, visible: true })
      return
    }

    // Otherwise, calculate position from target element
    if (!targetElement) {
      setHandPosition(prev => ({ ...prev, visible: false }))
      return
    }

    const element = typeof targetElement === 'string'
      ? document.querySelector(targetElement) as HTMLElement
      : targetElement

    if (!element) {
      console.warn(`[PointingHand] Target element not found: ${targetElement}`)
      setHandPosition(prev => ({ ...prev, visible: false }))
      return
    }

    // Calculate position relative to the element
    const calculatePosition = () => {
      const rect = element.getBoundingClientRect()

      // Center the hand on the target element
      const handSize = 48 // emoji size in pixels
      const top = rect.top + (rect.height / 2) - (handSize / 2) - 30
      const left = rect.left + (rect.width / 2) - (handSize / 2) + 20
      const rotation = 0

      setHandPosition({
        top,
        left,
        rotation,
        visible: true
      })

      // Add highlight to target element
      element.classList.add('tutorial-spotlight')
      highlightedElementRef.current = element
    }

    calculatePosition()

    // Recalculate on scroll or resize
    const handleUpdate = () => calculatePosition()
    window.addEventListener('scroll', handleUpdate, true)
    window.addEventListener('resize', handleUpdate)

    return () => {
      window.removeEventListener('scroll', handleUpdate, true)
      window.removeEventListener('resize', handleUpdate)

      // Remove highlight on cleanup
      if (highlightedElementRef.current) {
        highlightedElementRef.current.classList.remove('tutorial-spotlight')
        highlightedElementRef.current = null
      }
    }
  }, [targetElement, position, visible])

  // Handle animation complete callback
  useEffect(() => {
    if (!handPosition.visible || !onAnimationComplete) return

    const duration = animationSpeed === 'slow' ? 3000 : animationSpeed === 'fast' ? 1000 : 2000

    animationTimeoutRef.current = setTimeout(() => {
      onAnimationComplete()
    }, duration)

    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current)
      }
    }
  }, [handPosition.visible, animationSpeed, onAnimationComplete])

  if (!handPosition.visible) return null

  const animationClass = `tutorial-hand-animation-${animationSpeed}`

  return (
    <div
      ref={handRef}
      className={`tutorial-pointing-hand ${animationClass}`}
      style={{
        top: `${handPosition.top}px`,
        left: `${handPosition.left}px`,
        transform: `rotate(${handPosition.rotation}deg)`,
        position: 'fixed',
        zIndex: 10000,
        pointerEvents: 'none'
      }}
      data-id="tutorial-pointing-hand"
    >
      {/* Pointing hand emoji with enhanced visibility */}
      <div style={{
        fontSize: '48px',
        filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5))',
        transform: 'scaleX(-1)', // Mirror the hand to point left-to-right
        userSelect: 'none'
      }}>
        👉
      </div>
      <div className="tutorial-hand-pulse"></div>
    </div>
  )
}

/**
 * Hook to get element position
 */
export function useElementPosition(elementSelector: string | null): PointingHandPosition | null {
  const [position, setPosition] = useState<PointingHandPosition | null>(null)

  useEffect(() => {
    if (!elementSelector) {
      setPosition(null)
      return
    }

    const element = document.querySelector(elementSelector) as HTMLElement
    if (!element) {
      setPosition(null)
      return
    }

    const updatePosition = () => {
      const rect = element.getBoundingClientRect()
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft

      setPosition({
        top: rect.top + scrollTop - 40,
        left: rect.left + scrollLeft - 60,
        rotation: -45,
        visible: true
      })
    }

    updatePosition()

    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)

    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [elementSelector])

  return position
}
