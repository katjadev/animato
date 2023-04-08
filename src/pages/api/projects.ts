import { User } from 'firebase/auth'
import { getDatabase, onValue, ref, remove, set } from 'firebase/database'
import { v4 as uuidv4 } from 'uuid'
import { Project, RawProject } from '@animato/types'

export async function subscribeToProjects(currentUser: User | null, callback: (projects: Project[]) => void): Promise<void> {
  if (!currentUser) { 
    return Promise.reject()
  }

  const db = getDatabase()
  const projectsRef = ref(db, 'projects/' + currentUser.uid)
  onValue(projectsRef, (snapshot) => {
    const data = snapshot.val()
    if (data) {
      callback(Object.entries(data).map(([ id, project ]) => ({
        id,
        ...project as RawProject,
      })))
    }
  })
}

export async function subscribeToProject(projectId: string, currentUser: User | null, callback: (project: Project) => void): Promise<void> {
  if (!currentUser && projectId !== 'demo-project') { 
    return Promise.reject()
  }

  const userId = projectId === 'demo-project' ? 'demo-user' : currentUser?.uid;
  const db = getDatabase()
  const projectsRef = ref(db, `projects/${userId}/${projectId}`)
  onValue(projectsRef, (snapshot) => {
    const data = snapshot.val()
    if (data) {
      callback(data)
    }
  })
}

export async function createProject(currentUser: User | null): Promise<string> {
  if (!currentUser) { 
    return Promise.reject()
  }

  const db = getDatabase()
  const projectId = uuidv4()
  return set(ref(db, `projects/${currentUser.uid}/${projectId}`), {
    title: 'Untitled project',
    createdAt: Date.now(),
    modifiedAt: Date.now(),
    data: '',
  })
    .then(() => projectId)
}

export async function deleteProject(projectId: string, currentUser: User | null): Promise<void> {
  if (!currentUser) { 
    return Promise.reject()
  }

  const db = getDatabase()
  return remove(ref(db, `projects/${currentUser.uid}/${projectId}`))
}
