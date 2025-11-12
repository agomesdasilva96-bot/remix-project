/**
 * Fireworks AI Prompt Refinement Service
 * Uses DeepSeek model to enhance and refine user prompts
 */

export class PromptRefinementError extends Error {
  public readonly statusCode?: number
  public readonly response?: any

  constructor(message: string, statusCode?: number, response?: any) {
    super(message)
    this.name = 'PromptRefinementError'
    this.statusCode = statusCode
    this.response = response
  }
}

/**
 * Refine a prompt using Fireworks AI DeepSeek model
 * @param apiKey - Fireworks API key
 * @param prompt - The prompt to refine
 * @returns Promise<string> - The refined prompt
 */
export async function refinePrompt(
  apiKey: string,
  prompt: string
): Promise<string> {
  if (!apiKey) {
    throw new PromptRefinementError('Fireworks API key is required')
  }

  if (!prompt || !prompt.trim()) {
    throw new PromptRefinementError('Prompt text is required')
  }

  try {
    const response = await fetch('https://api.fireworks.ai/inference/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'accounts/fireworks/models/deepseek-v3p1-terminus',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful AI assistant that refines and improves user prompts. Your task is to take a user\'s prompt and make it clearer, more specific, and more effective while preserving the original intent. Return only the refined prompt without any additional explanation or commentary.'
          },
          {
            role: 'user',
            content: `Please refine and improve this prompt:\n\n${prompt}`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new PromptRefinementError(
        `Fireworks API request failed: ${response.statusText}`,
        response.status,
        errorText
      )
    }

    const result = await response.json()

    if (result.choices && result.choices[0] && result.choices[0].message) {
      return result.choices[0].message.content.trim()
    } else {
      throw new PromptRefinementError('No refined prompt in response', undefined, result)
    }

  } catch (error) {
    // Re-throw if already our error type
    if (error instanceof PromptRefinementError) {
      throw error
    }

    // Wrap other errors
    const message = error instanceof Error ? error.message : String(error)
    throw new PromptRefinementError(`Network error: ${message}`)
  }
}
