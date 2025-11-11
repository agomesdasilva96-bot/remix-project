import React from 'react'
import { TutorialRoadmap, TutorialProgress } from '../../lib/tutorials/types'
import './tutorial-styles.css'

export interface TutorialRoadmapViewProps {
  roadmap: TutorialRoadmap
  progress?: TutorialProgress
  onStartStep?: (stepIndex: number) => void
  onClose?: () => void
}

/**
 * TutorialRoadmapView Component
 * Displays the tutorial roadmap with progress visualization
 */
export const TutorialRoadmapView: React.FC<TutorialRoadmapViewProps> = ({
  roadmap,
  progress,
  onStartStep,
  onClose
}) => {
  const currentStepIndex = progress?.currentStepIndex ?? 0
  const completedSteps = progress?.completedSteps ?? []

  const getStepIcon = (stepIndex: number, stepId: string): string => {
    if (completedSteps.includes(stepId)) {
      return '✓'
    }
    if (stepIndex === currentStepIndex) {
      return '▶'
    }
    return (stepIndex + 1).toString()
  }

  const getStepClass = (stepIndex: number, stepId: string): string => {
    if (completedSteps.includes(stepId)) {
      return 'completed'
    }
    if (stepIndex === currentStepIndex) {
      return 'current'
    }
    return ''
  }

  return (
    <div className="tutorial-roadmap-view" data-id="tutorial-roadmap-view">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
        <div>
          <h3 className="mb-1">{roadmap.title}</h3>
          <p className="text-secondary mb-0" style={{ fontSize: '14px' }}>
            {roadmap.description}
          </p>
        </div>
        {onClose && (
          <button
            className="btn btn-sm btn-outline-secondary"
            onClick={onClose}
          >
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>

      {/* Roadmap Info */}
      <div className="d-flex gap-3 p-3 border-bottom bg-light">
        <div className="d-flex align-items-center gap-2">
          <i className="fas fa-clock text-secondary"></i>
          <small>{roadmap.estimatedTime}</small>
        </div>
        <div className="d-flex align-items-center gap-2">
          <i className="fas fa-signal text-secondary"></i>
          <small className="text-capitalize">{roadmap.difficulty}</small>
        </div>
        <div className="d-flex align-items-center gap-2">
          <i className="fas fa-tasks text-secondary"></i>
          <small>
            {completedSteps.length} / {roadmap.steps.length} completed
          </small>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-3 pt-3">
        <div className="tutorial-progress-bar">
          <div
            className="tutorial-progress-fill"
            style={{
              width: `${(completedSteps.length / roadmap.steps.length) * 100}%`
            }}
          />
        </div>
      </div>

      {/* Steps List */}
      <div className="tutorial-roadmap-container">
        {roadmap.steps.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id)
          const isCurrent = index === currentStepIndex
          const isClickable = index <= currentStepIndex || isCompleted

          return (
            <div
              key={step.id}
              className="tutorial-roadmap-step"
              onClick={() => isClickable && onStartStep?.(index)}
              style={{
                cursor: isClickable ? 'pointer' : 'default',
                opacity: isClickable ? 1 : 0.6
              }}
            >
              <div className={`tutorial-roadmap-icon ${getStepClass(index, step.id)}`}>
                {getStepIcon(index, step.id)}
              </div>
              <div className="tutorial-roadmap-content">
                <div className="tutorial-roadmap-step-title">
                  {step.title}
                  {step.optional && (
                    <span
                      className="badge bg-secondary ms-2"
                      style={{ fontSize: '10px' }}
                    >
                      Optional
                    </span>
                  )}
                </div>
                <div className="tutorial-roadmap-step-description">
                  {step.description}
                </div>
                {step.estimatedTime && (
                  <div className="mt-1">
                    <small className="text-secondary">
                      <i className="far fa-clock me-1"></i>
                      {step.estimatedTime}
                    </small>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer Actions */}
      <div className="p-3 border-top">
        {progress?.completed ? (
          <div className="text-center">
            <div className="mb-2">
              <i
                className="fas fa-check-circle text-success"
                style={{ fontSize: '48px' }}
              ></i>
            </div>
            <h4>Tutorial Completed!</h4>
            <p className="text-secondary">
              Great job! You've completed this tutorial.
            </p>
          </div>
        ) : (
          <button
            className="tutorial-btn tutorial-btn-primary w-100"
            onClick={() => onStartStep?.(currentStepIndex)}
          >
            {currentStepIndex === 0 ? 'Start Tutorial' : 'Continue Tutorial'}
          </button>
        )}
      </div>
    </div>
  )
}
