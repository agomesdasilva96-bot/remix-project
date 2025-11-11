import { useState, useEffect, useCallback } from 'react'
import {
  TutorialRoadmap,
  TutorialProgress,
  TutorialState,
  TutorialPreferences
} from './types'

const STORAGE_KEYS = {
  PROGRESS: 'remix-tutorial-progress',
  COMPLETED: 'remix-tutorial-completed',
  PREFERENCES: 'remix-tutorial-preferences'
}

const DEFAULT_PREFERENCES: TutorialPreferences = {
  autoAdvance: false,
  showHints: true,
  playSound: false,
  highlightIntensity: 'normal',
  animationSpeed: 'normal'
}

/**
 * Custom hook for managing tutorial state
 * Handles tutorial progress, persistence, and state management
 */
export function useTutorialState() {
  const [state, setState] = useState<TutorialState>({
    isActive: false,
    currentRoadmap: null,
    currentStepIndex: 0,
    progress: null,
    completedTutorials: [],
    showHints: DEFAULT_PREFERENCES.showHints,
    autoAdvance: DEFAULT_PREFERENCES.autoAdvance
  })

  const [preferences, setPreferences] = useState<TutorialPreferences>(DEFAULT_PREFERENCES)

  // Load persisted data on mount
  useEffect(() => {
    loadPersistedData()
  }, [])

  // Persist state changes
  useEffect(() => {
    if (state.progress) {
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(state.progress))
    }
    if (state.completedTutorials.length > 0) {
      localStorage.setItem(STORAGE_KEYS.COMPLETED, JSON.stringify(state.completedTutorials))
    }
  }, [state.progress, state.completedTutorials])

  // Persist preferences
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(preferences))
  }, [preferences])

  /**
   * Load persisted data from localStorage
   */
  const loadPersistedData = useCallback(() => {
    try {
      // Load preferences
      const savedPrefs = localStorage.getItem(STORAGE_KEYS.PREFERENCES)
      if (savedPrefs) {
        const prefs = JSON.parse(savedPrefs)
        setPreferences({ ...DEFAULT_PREFERENCES, ...prefs })
        setState(prev => ({
          ...prev,
          showHints: prefs.showHints ?? prev.showHints,
          autoAdvance: prefs.autoAdvance ?? prev.autoAdvance
        }))
      }

      // Load completed tutorials
      const savedCompleted = localStorage.getItem(STORAGE_KEYS.COMPLETED)
      if (savedCompleted) {
        setState(prev => ({
          ...prev,
          completedTutorials: JSON.parse(savedCompleted)
        }))
      }

      // Load progress
      const savedProgress = localStorage.getItem(STORAGE_KEYS.PROGRESS)
      if (savedProgress) {
        setState(prev => ({
          ...prev,
          progress: JSON.parse(savedProgress)
        }))
      }
    } catch (error) {
      console.error('[Tutorial] Failed to load persisted data:', error)
    }
  }, [])

  /**
   * Start a tutorial roadmap
   */
  const startTutorial = useCallback((roadmap: TutorialRoadmap, resumeFromStep?: number) => {
    const startStepIndex = resumeFromStep ?? 0
    const now = Date.now()

    const progress: TutorialProgress = {
      roadmapId: roadmap.id,
      currentStepIndex: startStepIndex,
      completedSteps: [],
      startedAt: now,
      lastUpdated: now,
      completed: false
    }

    setState({
      isActive: true,
      currentRoadmap: roadmap,
      currentStepIndex: startStepIndex,
      progress,
      completedTutorials: state.completedTutorials,
      showHints: preferences.showHints,
      autoAdvance: preferences.autoAdvance
    })
  }, [preferences, state.completedTutorials])

  /**
   * Resume an existing tutorial
   */
  const resumeTutorial = useCallback((roadmap: TutorialRoadmap) => {
    if (state.progress && state.progress.roadmapId === roadmap.id) {
      setState(prev => ({
        ...prev,
        isActive: true,
        currentRoadmap: roadmap,
        currentStepIndex: state.progress?.currentStepIndex ?? 0
      }))
    } else {
      startTutorial(roadmap)
    }
  }, [state.progress, startTutorial])

  /**
   * Complete the current step and move to next
   */
  const completeStep = useCallback(() => {
    if (!state.currentRoadmap || !state.progress) {
      console.warn('[Tutorial] Cannot complete step: no active roadmap or progress')
      return false
    }

    const currentStep = state.currentRoadmap.steps[state.currentStepIndex]

    // Check if this step was already completed (防止重复完成)
    if (state.progress.completedSteps.includes(currentStep.id)) {
      console.log(`[Tutorial] Step ${currentStep.id} already completed, skipping`)
      return state.currentStepIndex >= state.currentRoadmap.steps.length - 1
    }

    const newCompletedSteps = [...state.progress.completedSteps, currentStep.id]
    const isLastStep = state.currentStepIndex >= state.currentRoadmap.steps.length - 1

    console.log(`[Tutorial] Completing step ${state.currentStepIndex + 1}/${state.currentRoadmap.steps.length}: ${currentStep.id}`)

    const updatedProgress: TutorialProgress = {
      ...state.progress,
      completedSteps: newCompletedSteps,
      currentStepIndex: isLastStep ? state.currentStepIndex : state.currentStepIndex + 1,
      lastUpdated: Date.now(),
      completed: isLastStep,
      completedAt: isLastStep ? Date.now() : undefined
    }

    // If tutorial is completed, add to completed list
    let newCompletedTutorials = state.completedTutorials
    if (isLastStep && !state.completedTutorials.includes(state.currentRoadmap.id)) {
      newCompletedTutorials = [...state.completedTutorials, state.currentRoadmap.id]
    }

    setState(prev => ({
      ...prev,
      currentStepIndex: updatedProgress.currentStepIndex,
      progress: updatedProgress,
      completedTutorials: newCompletedTutorials,
      isActive: !isLastStep || !preferences.autoAdvance
    }))

    return isLastStep
  }, [state, preferences.autoAdvance])

  /**
   * Skip to a specific step
   */
  const goToStep = useCallback((stepIndex: number) => {
    if (!state.currentRoadmap || !state.progress) return

    if (stepIndex < 0 || stepIndex >= state.currentRoadmap.steps.length) {
      console.warn('[Tutorial] Invalid step index:', stepIndex)
      return
    }

    setState(prev => ({
      ...prev,
      currentStepIndex: stepIndex,
      progress: prev.progress ? {
        ...prev.progress,
        currentStepIndex: stepIndex,
        lastUpdated: Date.now()
      } : null
    }))
  }, [state.currentRoadmap, state.progress])

  /**
   * Skip the current step (for optional steps)
   */
  const skipStep = useCallback(() => {
    if (!state.currentRoadmap) return

    const nextStepIndex = state.currentStepIndex + 1
    if (nextStepIndex < state.currentRoadmap.steps.length) {
      goToStep(nextStepIndex)
    }
  }, [state.currentRoadmap, state.currentStepIndex, goToStep])

  /**
   * Exit the current tutorial
   */
  const exitTutorial = useCallback(() => {
    setState(prev => ({
      ...prev,
      isActive: false
    }))
  }, [])

  /**
   * Reset tutorial progress
   */
  const resetTutorial = useCallback((roadmapId?: string) => {
    if (roadmapId) {
      // Reset specific tutorial
      if (state.progress?.roadmapId === roadmapId) {
        setState(prev => ({
          ...prev,
          progress: null,
          isActive: false,
          currentRoadmap: null,
          currentStepIndex: 0
        }))
      }
      const newCompleted = state.completedTutorials.filter(id => id !== roadmapId)
      setState(prev => ({ ...prev, completedTutorials: newCompleted }))
      localStorage.setItem(STORAGE_KEYS.COMPLETED, JSON.stringify(newCompleted))
    } else {
      // Reset all
      setState({
        isActive: false,
        currentRoadmap: null,
        currentStepIndex: 0,
        progress: null,
        completedTutorials: [],
        showHints: preferences.showHints,
        autoAdvance: preferences.autoAdvance
      })
      localStorage.removeItem(STORAGE_KEYS.PROGRESS)
      localStorage.removeItem(STORAGE_KEYS.COMPLETED)
    }
  }, [state.progress, state.completedTutorials, preferences])

  /**
   * Update preferences
   */
  const updatePreferences = useCallback((updates: Partial<TutorialPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }))
    setState(prev => ({
      ...prev,
      showHints: updates.showHints ?? prev.showHints,
      autoAdvance: updates.autoAdvance ?? prev.autoAdvance
    }))
  }, [])

  /**
   * Check if a tutorial is completed
   */
  const isTutorialCompleted = useCallback((roadmapId: string): boolean => {
    return state.completedTutorials.includes(roadmapId)
  }, [state.completedTutorials])

  /**
   * Get progress percentage
   */
  const getProgressPercentage = useCallback((): number => {
    if (!state.currentRoadmap || !state.progress) return 0
    return (state.progress.completedSteps.length / state.currentRoadmap.steps.length) * 100
  }, [state.currentRoadmap, state.progress])

  return {
    // State
    state,
    preferences,

    // Actions
    startTutorial,
    resumeTutorial,
    completeStep,
    goToStep,
    skipStep,
    exitTutorial,
    resetTutorial,
    updatePreferences,

    // Helpers
    isTutorialCompleted,
    getProgressPercentage
  }
}
