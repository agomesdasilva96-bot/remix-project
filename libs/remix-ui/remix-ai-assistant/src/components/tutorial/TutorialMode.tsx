import React, { useEffect, useRef, useState, useCallback } from 'react'
import { Plugin } from '@remixproject/engine'
import { useTutorialState } from '../../lib/tutorials/useTutorialState'
import { TutorialEventDetector } from '../../lib/tutorials/TutorialEventDetector'
import { TutorialRoadmap, TutorialEventCallbacks } from '../../lib/tutorials/types'
import { tutorialRoadmaps, getRecommendedTutorial } from '../../lib/tutorials/roadmaps'
import { PointingHand } from './PointingHand'
import { TutorialStepCard } from './TutorialStepCard'
import { TutorialRoadmapView } from './TutorialRoadmapView'
import './tutorial-styles.css'

export interface TutorialModeProps {
  plugin: Plugin
  onAskAI?: (question: string, context: any) => void
  onExit?: () => void
}

/**
 * TutorialMode Component
 * Main component that manages the tutorial experience
 */
export const TutorialMode: React.FC<TutorialModeProps> = ({
  plugin,
  onAskAI,
  onExit
}) => {
  const {
    state,
    preferences,
    startTutorial,
    resumeTutorial,
    completeStep,
    goToStep,
    skipStep,
    exitTutorial,
    isTutorialCompleted
  } = useTutorialState()

  const [showRoadmapSelector, setShowRoadmapSelector] = useState(true)
  const eventDetectorRef = useRef<TutorialEventDetector | null>(null)
  const completionInProgress = useRef(false)

  /**
   * Handle automatic step completion from event detector
   * Protected against multiple rapid calls
   */
  const handleAutoStepComplete = useCallback((stepId: string) => {
    // Prevent multiple simultaneous completions
    if (completionInProgress.current) {
      console.log('[TutorialMode] Completion already in progress, ignoring:', stepId)
      return
    }

    completionInProgress.current = true
    console.log('[TutorialMode] Auto-completing step:', stepId)

    // Add a small delay for visual feedback
    setTimeout(() => {
      const isComplete = completeStep()

      if (isComplete) {
        // Tutorial finished
        setShowRoadmapSelector(true)
      } else if (preferences.autoAdvance) {
        // Auto-advance to next step
        console.log('[TutorialMode] Auto-advancing to next step')
      }

      // Reset completion flag after a brief delay
      setTimeout(() => {
        completionInProgress.current = false
      }, 300)
    }, 500)
  }, [completeStep, preferences.autoAdvance])

  // Initialize event detector
  useEffect(() => {
    if (!state.isActive || !state.currentRoadmap) {
      return
    }

    const callbacks: TutorialEventCallbacks = {
      onStepComplete: handleAutoStepComplete,
      onStepStart: (stepId) => {
        console.log('[TutorialMode] Step started:', stepId)
      },
      onTutorialComplete: (roadmapId) => {
        console.log('[TutorialMode] Tutorial completed:', roadmapId)
      },
      onTutorialExit: () => {
        console.log('[TutorialMode] Tutorial exited')
      }
    }

    eventDetectorRef.current = new TutorialEventDetector(plugin, callbacks)

    return () => {
      if (eventDetectorRef.current) {
        eventDetectorRef.current.destroy()
      }
    }
  }, [plugin, state.isActive, handleAutoStepComplete])

  // Monitor current step and set up event detection
  useEffect(() => {
    if (!state.isActive || !state.currentRoadmap || !eventDetectorRef.current) {
      return
    }

    // Reset completion flag when moving to a new step
    completionInProgress.current = false

    const currentStep = state.currentRoadmap.steps[state.currentStepIndex]
    if (currentStep) {
      eventDetectorRef.current.startMonitoring(currentStep)
    }
  }, [state.isActive, state.currentRoadmap, state.currentStepIndex])

  /**
   * Handle manual step completion (Next button)
   */
  const handleManualNext = useCallback(() => {
    const currentStep = state.currentRoadmap?.steps[state.currentStepIndex]
    if (currentStep) {
      // Simply trigger the step completion handler
      // No need to call completeCurrentStep as handleAutoStepComplete will handle it
      handleAutoStepComplete(currentStep.id)
    }
  }, [state.currentRoadmap, state.currentStepIndex, handleAutoStepComplete])

  /**
   * Handle tutorial selection
   */
  const handleSelectTutorial = (roadmap: TutorialRoadmap) => {
    if (state.progress?.roadmapId === roadmap.id && !isTutorialCompleted(roadmap.id)) {
      resumeTutorial(roadmap)
    } else {
      startTutorial(roadmap)
    }
    setShowRoadmapSelector(false)
  }

  /**
   * Handle exit tutorial
   */
  const handleExitTutorial = () => {
    if (eventDetectorRef.current) {
      eventDetectorRef.current.cleanup()
    }
    exitTutorial()
    setShowRoadmapSelector(true)
    onExit?.()
  }

  /**
   * Handle ask AI with tutorial context
   */
  const handleAskAI = (question: string) => {
    if (!state.currentRoadmap || !onAskAI) return

    const currentStep = state.currentRoadmap.steps[state.currentStepIndex]
    const context = {
      roadmapId: state.currentRoadmap.id,
      roadmapTitle: state.currentRoadmap.title,
      stepId: currentStep.id,
      stepIndex: state.currentStepIndex,
      totalSteps: state.currentRoadmap.steps.length,
      stepTitle: currentStep.title,
      stepDescription: currentStep.description,
      aiPrompt: currentStep.aiPrompt,
      userQuestion: question
    }

    onAskAI(question, context)
  }

  // Show roadmap selector when not in active tutorial
  if (showRoadmapSelector || !state.isActive || !state.currentRoadmap) {
    return (
      <div className="tutorial-mode-container" data-id="tutorial-mode">
        <TutorialSelectorView
          roadmaps={tutorialRoadmaps}
          completedTutorials={state.completedTutorials}
          onSelectTutorial={handleSelectTutorial}
          onClose={onExit}
        />
      </div>
    )
  }

  const currentStep = state.currentRoadmap.steps[state.currentStepIndex]

  return (
    <div className="tutorial-mode-container" data-id="tutorial-mode-active">
      {/* Pointing hand indicator */}
      {currentStep.targetElement && (
        <PointingHand
          targetElement={currentStep.targetElement}
          visible={state.isActive}
          animationSpeed={preferences.animationSpeed}
        />
      )}

      {/* Step card */}
      <TutorialStepCard
        step={currentStep}
        stepIndex={state.currentStepIndex}
        totalSteps={state.currentRoadmap.steps.length}
        onNext={handleManualNext}
        onSkip={currentStep.optional ? skipStep : undefined}
        onExit={handleExitTutorial}
        onAskAI={onAskAI ? handleAskAI : undefined}
        showHints={state.showHints}
        position="bottom-right"
      />
    </div>
  )
}

/**
 * Tutorial Selector View
 * Shows available tutorials and recommendations
 */
interface TutorialSelectorViewProps {
  roadmaps: TutorialRoadmap[]
  completedTutorials: string[]
  onSelectTutorial: (roadmap: TutorialRoadmap) => void
  onClose?: () => void
}

const TutorialSelectorView: React.FC<TutorialSelectorViewProps> = ({
  roadmaps,
  completedTutorials,
  onSelectTutorial,
  onClose
}) => {
  return (
    <div className="tutorial-selector-view p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Choose a Tutorial</h3>
        {onClose && (
          <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>

      {/* All Tutorials */}
      <div className="tutorial-grid">
        {roadmaps.map(roadmap => (
          <TutorialCard
            key={roadmap.id}
            roadmap={roadmap}
            isCompleted={completedTutorials.includes(roadmap.id)}
            onSelect={() => onSelectTutorial(roadmap)}
          />
        ))}
      </div>
    </div>
  )
}

/**
 * Tutorial Card Component
 */
interface TutorialCardProps {
  roadmap: TutorialRoadmap
  isCompleted: boolean
  onSelect: () => void
  highlighted?: boolean
}

const TutorialCard: React.FC<TutorialCardProps> = ({
  roadmap,
  isCompleted,
  onSelect,
  highlighted = false
}) => {
  return (
    <div
      className={`tutorial-card ${highlighted ? 'tutorial-card-highlighted' : ''} ${isCompleted ? 'tutorial-card-completed' : ''}`}
      onClick={onSelect}
      style={{
        border: '1px solid var(--border-color, #e0e0e0)',
        borderRadius: '8px',
        padding: '16px',
        cursor: 'pointer',
        marginBottom: '12px',
        transition: 'all 0.2s ease',
        borderColor: highlighted ? 'var(--primary-color, #2196f3)' : 'var(--border-color, #e0e0e0)'
      }}
    >
      <div className="d-flex justify-content-between align-items-start mb-2">
        <h4 className="mb-0" style={{ fontSize: '16px' }}>
          {roadmap.title}
          {isCompleted && (
            <i className="fas fa-check-circle text-success ms-2" title="Completed"></i>
          )}
        </h4>
        <span
          className={`badge bg-${roadmap.difficulty === 'beginner' ? 'success' : roadmap.difficulty === 'intermediate' ? 'warning' : 'danger'}`}
          style={{ fontSize: '11px' }}
        >
          {roadmap.difficulty}
        </span>
      </div>

      <p className="text-secondary mb-2" style={{ fontSize: '14px' }}>
        {roadmap.description}
      </p>

      <div className="d-flex gap-3 text-secondary" style={{ fontSize: '12px' }}>
        <span>
          <i className="far fa-clock me-1"></i>
          {roadmap.estimatedTime}
        </span>
        <span>
          <i className="fas fa-tasks me-1"></i>
          {roadmap.steps.length} steps
        </span>
      </div>

      {roadmap.tags && roadmap.tags.length > 0 && (
        <div className="mt-2">
          {roadmap.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="badge bg-secondary me-1"
              style={{ fontSize: '10px' }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
