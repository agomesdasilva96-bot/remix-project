import { TutorialRoadmap } from '../types'
import { basicNavigationRoadmap } from './basic-navigation.roadmap'
import { smartContractDevRoadmap } from './smart-contract-dev.roadmap'

/**
 * All available tutorial roadmaps
 */
export const tutorialRoadmaps: TutorialRoadmap[] = [
  basicNavigationRoadmap,
  smartContractDevRoadmap
  // Additional roadmaps will be added here
]

/**
 * Get roadmap by ID
 */
export function getRoadmapById(id: string): TutorialRoadmap | undefined {
  return tutorialRoadmaps.find(roadmap => roadmap.id === id)
}

/**
 * Get roadmaps by category
 */
export function getRoadmapsByCategory(category: string): TutorialRoadmap[] {
  return tutorialRoadmaps.filter(roadmap => roadmap.category === category)
}

/**
 * Get roadmaps by difficulty
 */
export function getRoadmapsByDifficulty(difficulty: string): TutorialRoadmap[] {
  return tutorialRoadmaps.filter(roadmap => roadmap.difficulty === difficulty)
}

/**
 * Get recommended next tutorial based on completed ones
 */
export function getRecommendedTutorial(completedIds: string[]): TutorialRoadmap | null {
  // Find tutorials that haven't been completed
  const remaining = tutorialRoadmaps.filter(roadmap => !completedIds.includes(roadmap.id))

  if (remaining.length === 0) return null

  // Filter by tutorials whose prerequisites are met
  const available = remaining.filter(roadmap => {
    if (!roadmap.prerequisites || roadmap.prerequisites.length === 0) return true
    return roadmap.prerequisites.every(prereq => completedIds.includes(prereq))
  })

  // Return the first beginner tutorial if none are completed
  if (completedIds.length === 0) {
    return available.find(r => r.difficulty === 'beginner') || available[0]
  }

  // Otherwise, return the first available tutorial
  return available[0] || null
}

export {
  basicNavigationRoadmap,
  smartContractDevRoadmap
}
