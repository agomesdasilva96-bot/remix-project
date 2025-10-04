import type {
  StatusResponse,
  TestsResponse,
  TriggerResponse,
  CIStatusResponse,
  ArtifactsResponse
} from './types'

const API_BASE = '/api'

export const api = {
  async getStatus(): Promise<StatusResponse> {
    const res = await fetch(`${API_BASE}/status`)
    return res.json()
  },

  async getTests(): Promise<TestsResponse> {
    const res = await fetch(`${API_BASE}/tests`)
    return res.json()
  },

  async trigger(test: string, browser: string): Promise<TriggerResponse> {
    const res = await fetch(`${API_BASE}/trigger`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test, browser })
    })
    return res.json()
  },

  async getCIStatus(pipelineId: string): Promise<CIStatusResponse> {
    const res = await fetch(`${API_BASE}/ci-status?pipelineId=${encodeURIComponent(pipelineId)}`)
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.details || 'Failed to fetch CI status')
    }
    return res.json()
  },

  async getArtifacts(projectSlug: string, jobNumber: number): Promise<ArtifactsResponse> {
    const res = await fetch(
      `${API_BASE}/ci-artifacts?projectSlug=${encodeURIComponent(projectSlug)}&jobNumber=${jobNumber}`
    )
    if (!res.ok) {
      const error = await res.json()
      throw new Error(error.details || 'Failed to fetch artifacts')
    }
    return res.json()
  },

  async setToken(token: string): Promise<{ ok: boolean }> {
    const res = await fetch(`${API_BASE}/set-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    })
    return res.json()
  },

  async cancelWorkflow(workflowId: string): Promise<{ ok: boolean }> {
    const res = await fetch(`${API_BASE}/ci/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workflowId })
    })
    return res.json()
  },

  async rerunWorkflow(workflowId: string, fromFailed: boolean): Promise<{ ok: boolean }> {
    const res = await fetch(`${API_BASE}/ci/rerun`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workflowId, from_failed: fromFailed })
    })
    return res.json()
  }
}
