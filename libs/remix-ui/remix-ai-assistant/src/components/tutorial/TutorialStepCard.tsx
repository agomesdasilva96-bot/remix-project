import React, { useState } from 'react'
import { TutorialStep } from '../../lib/tutorials/types'
import './tutorial-styles.css'

export interface TutorialStepCardProps {
  step: TutorialStep
  stepIndex: number
  totalSteps: number
  onNext?: () => void
  onSkip?: () => void
  onExit?: () => void
  onAskAI?: (question: string) => void
  showHints?: boolean
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'center'
}

/**
 * TutorialStepCard Component
 * Displays the current tutorial step with description, hints, and navigation
 */
export const TutorialStepCard: React.FC<TutorialStepCardProps> = ({
  step,
  stepIndex,
  totalSteps,
  onNext,
  onSkip,
  onExit,
  onAskAI,
  showHints = false,
  position = 'bottom-right'
}) => {
  const [hintsExpanded, setHintsExpanded] = useState(showHints)
  const [aiQuestion, setAiQuestion] = useState('')
  const [showAIInput, setShowAIInput] = useState(false)

  const progress = ((stepIndex + 1) / totalSteps) * 100

  const getPositionStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      position: 'fixed',
      zIndex: 10001
    }

    switch (position) {
      case 'top-right':
        return { ...baseStyles, top: '20px', right: '20px' }
      case 'top-left':
        return { ...baseStyles, top: '20px', left: '20px' }
      case 'bottom-right':
        return { ...baseStyles, bottom: '20px', right: '20px' }
      case 'bottom-left':
        return { ...baseStyles, bottom: '20px', left: '20px' }
      case 'center':
        return {
          ...baseStyles,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        }
      default:
        return { ...baseStyles, bottom: '20px', right: '20px' }
    }
  }

  const handleAskAI = () => {
    if (aiQuestion.trim() && onAskAI) {
      onAskAI(aiQuestion)
      setAiQuestion('')
      setShowAIInput(false)
    }
  }

  return (
    <div
      className="tutorial-step-card"
      style={getPositionStyles()}
      data-id="tutorial-step-card"
    >
      {/* Header */}
      <div className="tutorial-step-card-header">
        <h3 className="tutorial-step-card-title">{step.title}</h3>
        <span className="tutorial-step-card-progress">
          Step {stepIndex + 1} of {totalSteps}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="tutorial-progress-bar">
        <div
          className="tutorial-progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Body */}
      <div className="tutorial-step-card-body">
        <p className="tutorial-step-description">{step.description}</p>

        {step.targetDescription && (
          <div className="tutorial-target-info">
            <small style={{ color: 'var(--secondary-text-color, #666)' }}>
              <i className="fas fa-bullseye me-1"></i>
              Target: {step.targetDescription}
            </small>
          </div>
        )}

        {step.estimatedTime && (
          <div className="tutorial-time-info" style={{ marginTop: '8px' }}>
            <small style={{ color: 'var(--secondary-text-color, #666)' }}>
              <i className="far fa-clock me-1"></i>
              Estimated time: {step.estimatedTime}
            </small>
          </div>
        )}

        {/* Hints Section */}
        {step.hints && step.hints.length > 0 && (
          <div className="tutorial-step-hints">
            <div
              className="tutorial-step-hints-title"
              onClick={() => setHintsExpanded(!hintsExpanded)}
              style={{ cursor: 'pointer' }}
            >
              <i className={`fas fa-lightbulb`}></i>
              <span>Hints</span>
              <i className={`fas fa-chevron-${hintsExpanded ? 'up' : 'down'} ms-auto`}></i>
            </div>
            {hintsExpanded && (
              <ul className="tutorial-step-hints-list">
                {step.hints.map((hint, index) => (
                  <li key={index}>{hint}</li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* AI Help Section */}
        {onAskAI && (
          <div className="tutorial-ai-help" style={{ marginTop: '16px' }}>
            {!showAIInput ? (
              <button
                className="tutorial-btn tutorial-btn-secondary"
                onClick={() => setShowAIInput(true)}
                style={{ width: '100%' }}
              >
                <i className="fas fa-robot me-2"></i>
                Ask AI for Help
              </button>
            ) : (
              <div className="tutorial-ai-input-group">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  placeholder="Ask a question about this step..."
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAskAI()}
                  autoFocus
                />
                <div className="d-flex gap-2 mt-2">
                  <button
                    className="tutorial-btn tutorial-btn-primary flex-grow-1"
                    onClick={handleAskAI}
                    disabled={!aiQuestion.trim()}
                  >
                    Ask
                  </button>
                  <button
                    className="tutorial-btn tutorial-btn-secondary"
                    onClick={() => {
                      setShowAIInput(false)
                      setAiQuestion('')
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="tutorial-step-card-footer">
        <button
          className="tutorial-btn tutorial-btn-danger"
          onClick={onExit}
          title="Exit tutorial"
        >
          <i className="fas fa-times"></i>
        </button>

        <div style={{ flex: 1 }}></div>

        {step.optional && onSkip && (
          <button
            className="tutorial-btn tutorial-btn-secondary"
            onClick={onSkip}
          >
            Skip
          </button>
        )}

        {onNext && (
          <button
            className="tutorial-btn tutorial-btn-primary"
            onClick={onNext}
          >
            {stepIndex < totalSteps - 1 ? 'Next' : 'Complete'}
            <i className="fas fa-arrow-right ms-2"></i>
          </button>
        )}
      </div>
    </div>
  )
}
