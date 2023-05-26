import { ReactNode, createContext, useContext, useReducer } from 'react'
import { Project } from '@animato/types'
import { ProjectState, projectReducer, initialProjectState } from './reducer'
import { projectActions } from './actions'

export const ProjectContext = createContext<{
  state: ProjectState;
  actions: any;
}>({
  state: initialProjectState,
  actions: {},
})

interface ProjectContextProviderProps {
  project: Project;
  children: ReactNode;
}

export default function ProjectContextProvider({ project, children }: ProjectContextProviderProps) {
  const [state, dispatch] = useReducer(projectReducer, {
    ...initialProjectState,
    id: project.id,
    title: project.title,
    data: project.data,
  })
  const actions = projectActions(dispatch)

  return (
    <ProjectContext.Provider value={{ state, actions }}>
      {children}
    </ProjectContext.Provider>
  )
}

export const useProjectState = () => useContext(ProjectContext)