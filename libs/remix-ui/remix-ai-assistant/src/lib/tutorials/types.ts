import { Plugin } from '@remixproject/engine'

/**
 * Tutorial category types
 */
export type TutorialCategory = 'navigation' | 'development' | 'testing' | 'advanced'

/**
 * Event trigger types for detecting step completion
 */
export type EventTriggerType = 'dom' | 'plugin' | 'manual'

/**
 * DOM event types
 */
export type DOMEventType = 'click' | 'input' | 'change' | 'focus'

/**
 * Plugin event trigger configuration
 */
export interface PluginEventTrigger {
  type: 'plugin'
  pluginName: string
  eventName: string
  validator?: (data: any) => boolean
}

/**
 * DOM event trigger configuration
 */
export interface DOMEventTrigger {
  type: 'dom'
  selector: string
  eventType: DOMEventType
  validator?: (event: Event) => boolean
}

/**
 * Manual confirmation trigger
 */
export interface ManualTrigger {
  type: 'manual'
}

/**
 * Union type for all event triggers
 */
export type EventTrigger = PluginEventTrigger | DOMEventTrigger | ManualTrigger

/**
 * Step validation configuration
 */
export interface StepValidation {
  type: 'dom' | 'plugin' | 'custom'
  check: () => Promise<boolean> | boolean
  errorMessage?: string
}

/**
 * Tutorial step definition
 */
export interface TutorialStep {
  id: string
  title: string
  description: string
  aiPrompt: string // AI uses this for enhanced explanations
  targetElement?: string // CSS selector or data-id attribute
  targetDescription?: string // Human-readable description of target
  eventTriggers: EventTrigger[] // For auto-detection
  validations?: StepValidation[] // Additional validation checks
  hints: string[]
  optional?: boolean
  estimatedTime?: string // e.g., "2 minutes"
}

/**
 * Tutorial roadmap definition
 */
export interface TutorialRoadmap {
  id: string
  title: string
  description: string
  category: TutorialCategory
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: string
  prerequisites?: string[] // IDs of required tutorials
  steps: TutorialStep[]
  thumbnail?: string
  tags: string[]
}

/**
 * Tutorial progress tracking
 */
export interface TutorialProgress {
  roadmapId: string
  currentStepIndex: number
  completedSteps: string[] // Step IDs
  startedAt: number // Timestamp
  lastUpdated: number // Timestamp
  completed: boolean
  completedAt?: number // Timestamp
}

/**
 * Tutorial state for React components
 */
export interface TutorialState {
  isActive: boolean
  currentRoadmap: TutorialRoadmap | null
  currentStepIndex: number
  progress: TutorialProgress | null
  completedTutorials: string[] // Roadmap IDs
  showHints: boolean
  autoAdvance: boolean
}

/**
 * Tutorial preferences
 */
export interface TutorialPreferences {
  autoAdvance: boolean // Automatically move to next step when completed
  showHints: boolean // Show hints by default
  playSound: boolean // Play sound on step completion
  highlightIntensity: 'subtle' | 'normal' | 'strong'
  animationSpeed: 'slow' | 'normal' | 'fast'
}

/**
 * Tutorial event detector callbacks
 */
export interface TutorialEventCallbacks {
  onStepComplete: (stepId: string) => void
  onStepStart: (stepId: string) => void
  onTutorialComplete: (roadmapId: string) => void
  onTutorialExit: () => void
}

/**
 * Pointing hand position configuration
 */
export interface PointingHandPosition {
  top: number
  left: number
  rotation?: number // degrees
  visible: boolean
}

/**
 * Tutorial context for AI enhancement
 */
export interface TutorialAIContext {
  roadmapId: string
  stepId: string
  stepIndex: number
  totalSteps: number
  userQuestion?: string
  previousAttempts?: number
  errorMessages?: string[]
}
