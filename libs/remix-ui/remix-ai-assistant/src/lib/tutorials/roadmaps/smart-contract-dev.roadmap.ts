import { TutorialRoadmap } from '../types'

/**
 * Smart Contract Development Tutorial
 * Teaches users how to write, compile, and deploy their first smart contract
 */
export const smartContractDevRoadmap: TutorialRoadmap = {
  id: 'smart-contract-dev',
  title: 'Your First Smart Contract',
  description: 'Learn how to write, compile, and deploy a simple smart contract on Remix IDE',
  category: 'development',
  difficulty: 'beginner',
  estimatedTime: '15 minutes',
  prerequisites: ['basic-navigation'],
  tags: ['solidity', 'compile', 'deploy', 'smart-contract'],
  thumbnail: 'assets/img/tutorials/smart-contract-dev.webp',

  steps: [
    {
      id: 'intro',
      title: 'Building Your First Smart Contract',
      description: 'In this tutorial, you\'ll create a simple storage contract that can store and retrieve a number. Let\'s get started!',
      aiPrompt: 'Introduce smart contracts and explain what we\'ll be building in this tutorial',
      hints: [
        'Smart contracts are programs that run on the blockchain',
        'Solidity is the most popular language for Ethereum smart contracts',
        'We\'ll build something simple but functional'
      ],
      eventTriggers: [{
        type: 'manual'
      }],
      estimatedTime: '30 seconds'
    },
    {
      id: 'create-contract-file',
      title: 'Create a New Contract File',
      description: 'Create a new file called "Storage.sol" in the contracts folder.',
      aiPrompt: 'Guide the user to create a new Solidity file and explain the .sol extension',
      targetElement: '[data-id="fileExplorerNewFilecreateNewFile"]',
      targetDescription: 'New File button in File Explorer',
      eventTriggers: [
        {
          type: 'plugin',
          pluginName: 'fileManager',
          eventName: 'fileAdded',
          validator: (filePath: string) => {
            return filePath && (filePath.includes('Storage.sol') || filePath.endsWith('.sol'))
          }
        }
      ],
      hints: [
        'Click the "+" icon in the File Explorer',
        'Name it "Storage.sol"',
        'Make sure to include the .sol extension'
      ],
      estimatedTime: '1 minute'
    },
    {
      id: 'write-contract',
      title: 'Write the Contract Code',
      description: 'Copy and paste this simple storage contract into your file, or type it yourself to learn the syntax.',
      aiPrompt: 'Explain the basic structure of a Solidity contract and what each part of the Storage contract does',
      targetElement: '#editorView',
      targetDescription: 'Code editor',
      eventTriggers: [
        {
          type: 'plugin',
          pluginName: 'fileManager',
          eventName: 'fileSaved',
          validator: (filePath: string) => {
            return filePath && filePath.endsWith('.sol')
          }
        },
        {
          type: 'manual'
        }
      ],
      hints: [
        'Start with: pragma solidity ^0.8.0;',
        'Define your contract: contract Storage { }',
        'Add a state variable and functions inside the contract'
      ],
      estimatedTime: '3 minutes'
    },
    {
      id: 'open-compiler',
      title: 'Open the Solidity Compiler',
      description: 'Click on the Solidity Compiler icon in the left panel to open the compiler.',
      aiPrompt: 'Explain what compilation does and why it\'s necessary for smart contracts',
      targetElement: '[data-id="verticalIconsKindsolidity"]',
      targetDescription: 'Solidity Compiler icon',
      eventTriggers: [
        {
          type: 'dom',
          selector: '[data-id="verticalIconsKindsolidity"]',
          eventType: 'click'
        }
      ],
      hints: [
        'Look for the "S" icon on the left sidebar',
        'It\'s the Solidity Compiler plugin',
        'Click it to see compilation options'
      ],
      estimatedTime: '30 seconds'
    },
    {
      id: 'compile-contract',
      title: 'Compile Your Contract',
      description: 'Click the "Compile Storage.sol" button to compile your smart contract.',
      aiPrompt: 'Explain the compilation process, compiler versions, and what to do if there are errors',
      targetElement: '[data-id="compilerContainerCompileBtn"]',
      targetDescription: 'Compile button in Solidity Compiler panel',
      eventTriggers: [
        {
          type: 'plugin',
          pluginName: 'solidity',
          eventName: 'compilationFinished',
          validator: (data: any) => {
            return data && !data.error && data.data && data.data.contracts
          }
        },
        {
          type: 'dom',
          selector: '[data-id="compilerContainerCompileBtn"]',
          eventType: 'click'
        }
      ],
      hints: [
        'The button is in the Solidity Compiler panel',
        'Make sure your code has no errors first',
        'A green checkmark means successful compilation'
      ],
      estimatedTime: '2 minutes'
    },
    {
      id: 'open-deploy',
      title: 'Open Deploy & Run',
      description: 'Click on the "Deploy & Run Transactions" icon to open the deployment panel.',
      aiPrompt: 'Introduce the Deploy & Run plugin and explain different deployment environments',
      targetElement: '[data-id="verticalIconsKindudapp"]',
      targetDescription: 'Deploy & Run Transactions icon',
      eventTriggers: [
        {
          type: 'dom',
          selector: '[data-id="verticalIconsKindudapp"]',
          eventType: 'click'
        }
      ],
      hints: [
        'Look for the Ethereum logo icon',
        'It\'s usually right after the compiler icon',
        'This is where you deploy and interact with contracts'
      ],
      estimatedTime: '30 seconds'
    },
    {
      id: 'select-environment',
      title: 'Choose Deployment Environment',
      description: 'Make sure "Remix VM (Shanghai)" is selected in the Environment dropdown. This is a safe, local testing environment.',
      aiPrompt: 'Explain the different environments (Remix VM, Injected Provider, etc.) and when to use each',
      targetElement: '[data-id="settingsSelectEnvOptions"]',
      targetDescription: 'Environment dropdown',
      eventTriggers: [{
        type: 'manual'
      }],
      hints: [
        'Remix VM runs entirely in your browser',
        'No real cryptocurrency is needed',
        'Perfect for testing and learning'
      ],
      estimatedTime: '1 minute'
    },
    {
      id: 'deploy-contract',
      title: 'Deploy Your Contract',
      description: 'Click the orange "Deploy" button to deploy your Storage contract to the Remix VM.',
      aiPrompt: 'Explain what happens when you deploy a contract and what the deployment transaction does',
      targetElement: '[data-id="contractActionsContainerSingle"]',
      targetDescription: 'Deploy button',
      eventTriggers: [
        {
          type: 'plugin',
          pluginName: 'udapp',
          eventName: 'newContractInstanceAdded',
          validator: (data: any) => {
            return data && data.address
          }
        },
        {
          type: 'dom',
          selector: '[data-id="Deploy - transact (not payable)"]',
          eventType: 'click'
        }
      ],
      hints: [
        'The Deploy button is orange',
        'Make sure your contract is compiled first',
        'Check the terminal for deployment confirmation'
      ],
      estimatedTime: '1 minute'
    },
    {
      id: 'interact-contract',
      title: 'Interact with Your Contract',
      description: 'Your contract is now deployed! Expand it in the "Deployed Contracts" section to see its functions. Try calling the store function with a number.',
      aiPrompt: 'Explain how to interact with deployed contracts and what the different buttons mean',
      targetElement: '[data-id="universalDappUiInstance"]',
      targetDescription: 'Deployed contract instance',
      eventTriggers: [
        {
          type: 'plugin',
          pluginName: 'udapp',
          eventName: 'transactionExecuted',
          validator: (data: any) => {
            return data && data.receipt
          }
        },
        {
          type: 'manual'
        }
      ],
      hints: [
        'Orange buttons are state-changing functions',
        'Blue buttons are view functions (read-only)',
        'Enter a number and click the store button'
      ],
      estimatedTime: '2 minutes'
    },
    {
      id: 'retrieve-value',
      title: 'Retrieve the Stored Value',
      description: 'Click the "retrieve" button to read back the number you stored. See it in the terminal!',
      aiPrompt: 'Explain the difference between state-changing transactions and view functions',
      targetElement: '[data-id="universalDappUiInstance"]',
      targetDescription: 'Retrieve button on deployed contract',
      eventTriggers: [{
        type: 'manual'
      }],
      hints: [
        'The retrieve button is blue (view function)',
        'It doesn\'t cost gas because it only reads data',
        'The result appears below the button'
      ],
      estimatedTime: '1 minute'
    },
    {
      id: 'completion',
      title: 'Congratulations!',
      description: 'You\'ve successfully created, compiled, deployed, and interacted with your first smart contract! This is the foundation of blockchain development.',
      aiPrompt: 'Congratulate the user and suggest advanced topics or next tutorials to explore',
      eventTriggers: [{
        type: 'manual'
      }],
      hints: [
        'Try the "Testing & Debugging" tutorial next',
        'Experiment with modifying the contract',
        'Learn about more complex Solidity features'
      ],
      estimatedTime: '30 seconds'
    }
  ]
}
