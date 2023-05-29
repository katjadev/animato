import { 
  ReactNode, 
  createContext, 
  useCallback, 
  useContext, 
  useEffect, 
  useReducer,
} from 'react'
import debounce from '@animato/utils/debounce'
import { AnimationGroup, ElementTreeNode, Project } from '@animato/types'
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
  elements: ElementTreeNode[];
  animations: AnimationGroup[];
  duration: number;
  children: ReactNode;
}

export default function ProjectContextProvider({ 
  project,
  elements,
  animations,
  duration,
  children,
}: ProjectContextProviderProps) {
  const [state, dispatch] = useReducer(projectReducer, {
    ...initialProjectState,
    id: project.id,
    title: project.title,
    data: project.data,
    elements,
    animations,
    duration,
  })
  const actions = projectActions(dispatch)

  const saveProject = useCallback(debounce(async (data: { title?: string, data?: string }) => {
    actions.savingStart()
    const response = await fetch(`/api/projects/${state.id}`, { 
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      actions.savingError()
      return
    }

    actions.savingSuccess()
  }, 500), [state.id])

  useEffect(() => {
    if (state.id !== 'demo-project') {
      saveProject({ title: state.title, data: state.data })
    }
  }, [state.id, state.title, state.data])

  return (
    <ProjectContext.Provider value={{ state, actions }}>
      {children}
    </ProjectContext.Provider>
  )
}

export const useProjectState = () => useContext(ProjectContext)