import { useAuth } from '@animato/context/authUserContext'

export default function Projects() {
  const authUserContext = useAuth()

  return(
    <>
      <h1>Projects</h1>
      <div>{authUserContext?.email}</div>
    </>
  );
}