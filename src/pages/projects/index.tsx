import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '@animato/context/AuthUserContext'

export default function Projects() {
  const { authUser, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !authUser) {
      router.push('/')
    }
  }, [authUser, loading])

  return(
    <h1>Projects</h1>
  );
}