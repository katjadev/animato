'use client'

import { FC, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@animato/components/button/Button'
import { DialogProvider } from '@animato/context/DialogContext/DialogContextProvider'

interface CreateProjectButtonProps {
  children: ReactNode;
  disabled?: boolean;
}

const CreateProjectButtonComponent: FC<CreateProjectButtonProps> = ({ children, disabled }) => {
  const router = useRouter()

  const handleCreateProject = async () => {
    if (disabled) return
    
    try {
      const response = await fetch('/api/projects', { method: 'POST' })
      if (!response.ok) {
        throw Error()
      }
      const { id } = await response.json()
      router.push(`/editor/${id}`)
    } catch (_) {
      // showErrorDialog(
      //   translations.deleteProjectErrorTitle, 
      //   translations.deleteProjectErrorMessage,
      // )
    }
  }

  return (
    <Button
      variant='primary'
      size='medium'
      onClick={handleCreateProject}
    >
      {children}
    </Button>
  )
}

export default function CreateProjectButton(props: CreateProjectButtonProps) {
  return (
    <DialogProvider>
      <CreateProjectButtonComponent {...props} />
    </DialogProvider>
  )
}