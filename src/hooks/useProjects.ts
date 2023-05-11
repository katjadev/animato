import { useContext } from 'react'
import { ProjectsContext } from '../context/projects/ProjectsContext'

const useProjects = () => {
  const { state, actions, dispatch } = useContext(ProjectsContext)
  return {
    state,
    actions,
    dispatch,
  }
}

export default useProjects