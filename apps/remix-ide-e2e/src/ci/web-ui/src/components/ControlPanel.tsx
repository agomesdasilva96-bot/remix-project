import type { Browser, Layout } from '../types'
import './ControlPanel.css'

interface ControlPanelProps {
  filter: string
  onFilterChange: (value: string) => void
  browser: Browser
  onBrowserChange: (value: Browser) => void
  layout: Layout
  onLayoutChange: (value: Layout) => void
  pinDetails: boolean
  onPinDetailsChange: (value: boolean) => void
  darkMode: boolean
  onDarkModeChange: (value: boolean) => void
  logCollapsed: boolean
  onToggleLog: () => void
  onClearLog: () => void
  onLogAdjust: (delta: number) => void
  onSetToken: () => void
}

export function ControlPanel(props: ControlPanelProps) {
  return (
    <div className="control-panel">
      <div className="control-group">
        <label htmlFor="filter">Filter</label>
        <input
          id="filter"
          type="text"
          value={props.filter}
          onChange={(e) => props.onFilterChange(e.target.value)}
          placeholder="type to filter by name"
        />
      </div>

      <div className="control-group">
        <label htmlFor="browser">Browser</label>
        <select
          id="browser"
          value={props.browser}
          onChange={(e) => props.onBrowserChange(e.target.value as Browser)}
        >
          <option value="chrome">chrome</option>
          <option value="firefox">firefox</option>
        </select>
      </div>

      <div className="control-group">
        <label htmlFor="layout">Layout</label>
        <select
          id="layout"
          value={props.layout}
          onChange={(e) => props.onLayoutChange(e.target.value as Layout)}
        >
          <option value="inline">Inline</option>
          <option value="split">Split</option>
        </select>
      </div>

      <div className="control-group">
        <label>
          <input
            type="checkbox"
            checked={props.pinDetails}
            onChange={(e) => props.onPinDetailsChange(e.target.checked)}
          />
          Pin details
        </label>
      </div>

      <div className="control-group">
        <label>
          <input
            type="checkbox"
            checked={props.darkMode}
            onChange={(e) => props.onDarkModeChange(e.target.checked)}
          />
          Dark mode
        </label>
      </div>

      <div className="divider" />

      <button className="btn btn-sm btn-secondary" onClick={props.onClearLog}>
        Clear log
      </button>
      <button className="btn btn-sm btn-secondary" onClick={() => props.onLogAdjust(-5)}>
        Log -
      </button>
      <button className="btn btn-sm btn-secondary" onClick={() => props.onLogAdjust(5)}>
        Log +
      </button>
      <button className="btn btn-sm btn-secondary" onClick={props.onToggleLog}>
        {props.logCollapsed ? 'Show' : 'Hide'} log
      </button>

      <div className="divider" />

      <button className="btn btn-sm btn-primary" onClick={props.onSetToken}>
        Set token
      </button>
    </div>
  )
}
