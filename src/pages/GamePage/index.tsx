import { useEffect } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { GAME_DATA } from '../../components/GamePage/data'
import ProjectPage from '../../components/GamePage/ProjectPage'

export default function GamePage() {
  const { game } = useParams<{ game: string }>()

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', '#c8a878')
    document.documentElement.style.setProperty('--bg', '#0c0c0d')
  }, [])

  const data = game ? GAME_DATA[game] : undefined
  if (!data) return <Navigate to="/" replace />

  return <ProjectPage {...data} />
}
