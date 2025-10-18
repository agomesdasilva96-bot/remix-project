// Global ambient types for browser window extensions used across the repo
// Ensures TS knows about window._matomoManagerInstance in projects that reference it

interface MatomoManagerLike {
  trackEvent: (category: string, action: string, name?: string) => void
}

declare global {
  interface Window {
    _matomoManagerInstance?: MatomoManagerLike
  }
}

export {}
