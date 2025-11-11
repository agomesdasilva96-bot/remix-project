import { TutorialRoadmap } from '../types'

/**
 * Basic Navigation Tutorial
 * Introduces users to the Remix IDE interface and basic navigation
 */
export const basicNavigationRoadmap: TutorialRoadmap = {
  id: 'basic-navigation',
  title: 'Remix IDE Basics',
  description: 'Learn how to navigate the Remix IDE interface, manage files, and use essential panels',
  category: 'navigation',
  difficulty: 'beginner',
  estimatedTime: '10 minutes',
  tags: ['beginner', 'interface', 'navigation', 'files'],
  thumbnail: 'assets/img/tutorials/basic-navigation.webp',

  steps: [
    {
      id: 'welcome',
      title: 'Welcome to Remix IDE!',
      description: 'Remix IDE is a powerful web-based development environment for Ethereum smart contracts. Let\'s explore the interface together.',
      aiPrompt: 'Introduce the user to Remix IDE and explain its main purpose as a smart contract development environment',
      hints: [
        'Remix IDE works entirely in your browser',
        'No installation required',
        'Perfect for learning and developing smart contracts'
      ],
      eventTriggers: [{
        type: 'manual'
      }],
      estimatedTime: '30 seconds'
    },
    {
      id: 'file-explorer',
      title: 'File Explorer Panel',
      description: 'The File Explorer on the left shows your workspace files. Click on the File Explorer icon to open it.',
      aiPrompt: 'Explain the File Explorer panel, its purpose, and how users can organize their smart contract projects',
      targetElement: '[data-id="verticalIconsKindfilePanel"]',
      targetDescription: 'File Explorer icon on the left sidebar',
      eventTriggers: [
        {
          type: 'dom',
          selector: '[data-id="verticalIconsKindfilePanel"]',
          eventType: 'click'
        }
      ],
      hints: [
        'Look for the folder icon on the left sidebar',
        'It\'s usually the second icon from the top',
        'Click it to open the File Explorer'
      ],
      estimatedTime: '1 minute'
    },
    {
      id: 'editor-basics',
      title: 'Understanding the Editor',
      description: 'The center area is the code editor where you write your smart contracts. It supports syntax highlighting, auto-completion, and more!',
      aiPrompt: 'Explain the code editor features including syntax highlighting, auto-completion, and error detection',
      targetDescription: 'Main code editor area',
      eventTriggers: [
        {
          type: 'plugin',
          pluginName: 'fileManager',
          eventName: 'currentFileChanged'
        },
        {
          type: 'manual'
        }
      ],
      hints: [
        'Try typing in the editor to see syntax highlighting',
        'Press Space for auto-completion suggestions',
        'Errors will appear with red squiggly lines'
      ],
      estimatedTime: '2 minutes'
    },
    {
      id: 'icon-panel',
      title: 'Left Icon Panel',
      description: 'The icon panel on the left provides access to different plugins and features like compiler, deploy & run, and more.',
      aiPrompt: 'Introduce the left icon panel and explain how users can access different plugins and tools',
      targetElement: '[data-id="remixIdeIconPanel"]',
      targetDescription: 'Vertical icon panel on the left side',
      eventTriggers: [{
        type: 'manual'
      }],
      hints: [
        'Each icon represents a different plugin or tool',
        'Hover over icons to see their names',
        'Click an icon to open that plugin'
      ],
      estimatedTime: '2 minutes'
    },
    {
      id: 'solidity-compiler',
      title: 'Solidity Compiler',
      description: 'Click the Solidity Compiler icon (looks like "S" letter) to open the compiler panel.',
      aiPrompt: 'Explain the Solidity Compiler plugin, its purpose, and how it compiles smart contracts',
      targetElement: '[data-id="verticalIconsKindsolidity"]',
      targetDescription: 'Solidity Compiler icon',
      eventTriggers: [
        {
          type: 'dom',
          selector: '[data-id="verticalIconsKindsolidity"]',
          eventType: 'click'
        },
        {
          type: 'plugin',
          pluginName: 'solidity',
          eventName: 'activate'
        }
      ],
      hints: [
        'Look for the "S" icon in the left panel',
        'It\'s typically the third or fourth icon',
        'This is where you\'ll compile your contracts'
      ],
      estimatedTime: '1 minute'
    },
    {
      id: 'terminal-panel',
      title: 'Terminal Panel',
      description: 'The terminal at the bottom shows output, errors, and transaction details. It\'s your window into what\'s happening in Remix.',
      aiPrompt: 'Explain the terminal panel, what information it displays, and how users can interact with it',
      targetElement: '[data-id="terminalContainer-view"]',
      targetDescription: 'Terminal panel at the bottom',
      eventTriggers: [{
        type: 'manual'
      }],
      hints: [
        'The terminal is usually at the bottom of the screen',
        'You can drag the divider to resize it',
        'All compilation and deployment logs appear here'
      ],
      estimatedTime: '1 minute'
    },
    {
      id: 'terminal-panel-open-or-close',
      title: 'Terminal Panel',
      description: 'Use this button for hiding and opening the terminal',
      aiPrompt: 'Explain the terminal panel, what information it displays, and how users can interact with it',
      targetElement: '[data-id="terminalToggleIcon"]',
      targetDescription: 'Terminal panel at the bottom',
      eventTriggers: [
        {
          type: 'manual'
        },
        {
          type: 'dom',
          selector: '[data-id="terminalToggleIcon"]',
          eventType: 'click'
        },
      ],
      hints: [
        'Open or hide the terminal',
        'Listen on transactions',
        'Filter on secific inputs'
      ],
      estimatedTime: '1 minute'
    },
    {
      id: 'completion',
      title: 'Congratulations!',
      description: 'You\'ve completed the basics! You now know how to navigate Remix IDE. Ready to start developing smart contracts?',
      aiPrompt: 'Congratulate the user and suggest next steps or related tutorials they might want to try',
      eventTriggers: [{
        type: 'manual'
      }],
      hints: [
        'Try the "Smart Contract Development" tutorial next',
        'Explore the other plugins and features',
        'Start writing your first smart contract!'
      ],
      estimatedTime: '30 seconds'
    }
  ]
}
