import { useContext } from 'react'
import { ProjectsContext } from '../context/projects/ProjectsContext'

const useProjects = () => {
  const { state, actions } = useContext(ProjectsContext)
  return { state, actions }
}

export default useProjects