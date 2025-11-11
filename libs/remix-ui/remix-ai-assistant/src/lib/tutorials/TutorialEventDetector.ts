import { Plugin } from '@remixproject/engine'
import {
  TutorialStep,
  EventTrigger,
  DOMEventTrigger,
  PluginEventTrigger,
  TutorialEventCallbacks
} from './types'

/**
 * TutorialEventDetector
 * Monitors DOM and plugin events to automatically detect step completion
 */
export class TutorialEventDetector {
  private plugin: Plugin
  private callbacks: TutorialEventCallbacks
  private activeListeners: Map<string, () => void> = new Map()
  private pluginEventListeners: Map<string, any> = new Map()
  private stepCompleted: boolean = false
  private currentStepId: string | null = null

  constructor(plugin: Plugin, callbacks: TutorialEventCallbacks) {
    this.plugin = plugin
    this.callbacks = callbacks
  }

  /**
   * Start monitoring events for a specific step
   */
  public startMonitoring(step: TutorialStep): void {
    this.cleanup() // Clean up previous listeners
    this.stepCompleted = false
    this.currentStepId = step.id

    console.log(`[TutorialEventDetector] Starting monitoring for step: ${step.id}`)

    // Notify that step has started
    this.callbacks.onStepStart(step.id)

    // Set up listeners for each event trigger
    step.eventTriggers.forEach((trigger, index) => {
      this.setupEventListener(trigger, step, index)
    })
  }

  /**
   * Set up an individual event listener
   */
  private setupEventListener(
    trigger: EventTrigger,
    step: TutorialStep,
    index: number
  ): void {
    switch (trigger.type) {
      case 'dom':
        this.setupDOMListener(trigger, step, index)
        break
      case 'plugin':
        this.setupPluginListener(trigger, step, index)
        break
      case 'manual':
        // Manual triggers are handled by the UI (Next button)
        console.log(`[TutorialEventDetector] Manual trigger for step: ${step.id}`)
        break
    }
  }

  /**
   * Set up a DOM event listener
   */
  private setupDOMListener(
    trigger: DOMEventTrigger,
    step: TutorialStep,
    index: number
  ): void {
    const listenerKey = `dom-${step.id}-${index}`
    let retryCount = 0
    const maxRetries = 10

    // Wait for element to be available
    const checkElement = () => {
      // Stop retrying if we've moved to a different step
      if (this.currentStepId !== step.id) {
        console.log(`[TutorialEventDetector] Step changed, stopping element search for ${trigger.selector}`)
        return
      }

      const element = document.querySelector(trigger.selector)

      if (element) {
        const handler = (event: Event) => {
          // Ignore events for previous steps
          if (this.currentStepId !== step.id) {
            console.log(`[TutorialEventDetector] Ignoring event for previous step: ${step.id}`)
            return
          }

          // Validate event if validator is provided
          if (trigger.validator && !trigger.validator(event)) {
            return
          }

          console.log(`[TutorialEventDetector] DOM event triggered: ${trigger.eventType} on ${trigger.selector}`)
          this.handleStepCompletion(step)
        }

        element.addEventListener(trigger.eventType, handler)

        // Store cleanup function
        this.activeListeners.set(listenerKey, () => {
          element.removeEventListener(trigger.eventType, handler)
        })

        console.log(`[TutorialEventDetector] DOM listener added for ${trigger.selector}`)
      } else if (retryCount < maxRetries) {
        // Retry after a short delay
        retryCount++
        console.log(`[TutorialEventDetector] Element not found: ${trigger.selector}, retrying... (${retryCount}/${maxRetries})`)
        setTimeout(checkElement, 500)
      } else {
        console.warn(`[TutorialEventDetector] Element not found after ${maxRetries} retries: ${trigger.selector}`)
      }
    }

    checkElement()
  }

  /**
   * Set up a plugin event listener
   */
  private setupPluginListener(
    trigger: PluginEventTrigger,
    step: TutorialStep,
    index: number
  ): void {
    const listenerKey = `plugin-${step.id}-${index}`

    try {
      const handler = (data: any) => {
        // Ignore events for previous steps
        if (this.currentStepId !== step.id) {
          console.log(`[TutorialEventDetector] Ignoring plugin event for previous step: ${step.id}`)
          return
        }

        // Validate data if validator is provided
        if (trigger.validator && !trigger.validator(data)) {
          console.log(`[TutorialEventDetector] Plugin event validation failed for ${trigger.eventName}`)
          return
        }

        console.log(`[TutorialEventDetector] Plugin event triggered: ${trigger.pluginName}.${trigger.eventName}`)
        this.handleStepCompletion(step)
      }

      // Listen to the plugin event
      this.plugin.on(trigger.pluginName, trigger.eventName, handler)

      // Store reference for cleanup
      this.pluginEventListeners.set(listenerKey, {
        pluginName: trigger.pluginName,
        eventName: trigger.eventName,
        handler
      })

      console.log(`[TutorialEventDetector] Plugin listener added for ${trigger.pluginName}.${trigger.eventName}`)
    } catch (error) {
      console.error(`[TutorialEventDetector] Failed to set up plugin listener:`, error)
    }
  }

  /**
   * Handle step completion
   */
  private async handleStepCompletion(step: TutorialStep): Promise<void> {
    // Prevent multiple completions
    if (this.stepCompleted) {
      return
    }

    // Run additional validations if provided
    if (step.validations && step.validations.length > 0) {
      const validationResults = await Promise.all(
        step.validations.map(validation => validation.check())
      )

      if (!validationResults.every(result => result === true)) {
        console.log(`[TutorialEventDetector] Step validation failed for: ${step.id}`)
        return
      }
    }

    this.stepCompleted = true
    console.log(`[TutorialEventDetector] Step completed: ${step.id}`)

    // Notify callback
    this.callbacks.onStepComplete(step.id)
  }

  /**
   * Manually mark step as complete
   */
  public completeCurrentStep(stepId: string): void {
    if (!this.stepCompleted) {
      this.stepCompleted = true
      this.callbacks.onStepComplete(stepId)
    }
  }

  /**
   * Check if current step is completed
   */
  public isStepCompleted(): boolean {
    return this.stepCompleted
  }

  /**
   * Clean up all active listeners
   */
  public cleanup(): void {
    // Clean up DOM listeners
    this.activeListeners.forEach((cleanup, key) => {
      cleanup()
    })
    this.activeListeners.clear()

    // Clean up plugin listeners
    this.pluginEventListeners.forEach((listener, key) => {
      try {
        this.plugin.off(listener.pluginName, listener.eventName)
      } catch (error) {
        console.error(`[TutorialEventDetector] Failed to remove plugin listener:`, error)
      }
    })
    this.pluginEventListeners.clear()

    this.currentStepId = null

    console.log('[TutorialEventDetector] All listeners cleaned up')
  }

  /**
   * Destroy the detector and clean up
   */
  public destroy(): void {
    this.cleanup()
    this.stepCompleted = false
    this.currentStepId = null
  }
}

/**
 * Helper function to wait for element to appear
 */
export function waitForElement(
  selector: string,
  timeout: number = 10000
): Promise<HTMLElement | null> {
  return new Promise((resolve) => {
    const element = document.querySelector(selector) as HTMLElement

    if (element) {
      resolve(element)
      return
    }

    const observer = new MutationObserver((mutations) => {
      const element = document.querySelector(selector) as HTMLElement
      if (element) {
        observer.disconnect()
        resolve(element)
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    // Timeout
    setTimeout(() => {
      observer.disconnect()
      resolve(null)
    }, timeout)
  })
}
