import { FC, ReactNode, createContext, useReducer } from 'react'
import { Project } from '@animato/types'
import { projectsReducer, projectsState } from './reducer'
import { projectsActions } from './actions'

export type ProjectsState = {
  projects: Project[],
  loading: boolean,
  error: boolean,
}

export const ProjectsContext = createContext<{
  state: ProjectsState,
  actions: {[key: string]: (payload?: any) => void},
}>({
  state: projectsState,
  actions: {},
})

interface ProjectsProviderProps {
  children?: ReactNode;
}

export const ProjectsProvider: FC<ProjectsProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(projectsReducer, projectsState)
  const actions = projectsActions(dispatch)

  return (
    <ProjectsContext.Provider value={{ state, actions }}>
      {children}
    </ProjectsContext.Provider>
  )
}