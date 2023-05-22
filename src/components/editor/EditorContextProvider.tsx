import { ReactNode, createContext, useContext, useReducer } from 'react'
import { EditorState, editorReducer, initialEditorState } from './reducer'
import { editorActions } from './actions'



export const EditorContext = createContext<{
  state: EditorState;
  actions: any;
}>({
  state: initialEditorState,
  actions: {},
})

interface EditorContextProviderProps {
  children: ReactNode;
}

export default function EditorContextProvider({children}: EditorContextProviderProps) {
  const [state, dispatch] = useReducer(editorReducer, initialEditorState)
  const actions = editorActions(dispatch)

  return (
    <EditorContext.Provider value={{ state, actions }}>
      {children}
    </EditorContext.Provider>
  )
}

export const useEditorState = () => useContext(EditorContext)