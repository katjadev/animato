import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import prisma from '@animato/lib/prisma/prisma'
import verifyCookie from '@animato/utils/verifyCookie'
import { getTranslations } from 'next-intl/server'
import parseProjectData from '@animato/utils/parseProjectData'
import Editor from '@animato/components/editor/Editor'
import styles from './page.module.css'

export default async function Project({ params }: { params: { id: string } }) {
  const t = await getTranslations()
  const { authenticated, userId } = await getAuthentication()
  const { project, error } = await getProject(params.id, userId)
  if (error) {
    return (
      <main className={styles.main}>
        {error && (
          <>{t('project.error-message')}</>
        )}
      </main>
    )
  }

  const { elements, animations, duration } = parseProjectData(project!.data)

  return (
    <main className={styles.main}>
      <Editor
        project={project!}
        elements={elements}
        animations={animations}
        duration={duration}
        isAuthenticated={authenticated} 
        translations={{
          profile: t('project.profile'),
          undo: t('project.undo'),
          redo: t('project.redo'),
          elements: t('project.elements'),
          expand: t('project.expand'),
          collapse: t('project.collapse'),
          timelinePointerAriaLabel: t('project.timeline-pointer-aria-label'),
          importSvg: t('project.import-svg'),
          export: t('project.export'),
          backToProjects: t('project.back-to-projects'),
          restart: t('project.restart'),
          play: t('project.play'),
          pause: t('project.pause'),
          repeat: t('project.repeat')
        }}
      />
    </main>
  )
}

const getAuthentication = async () => {
  const user = cookies().get('user')
  return verifyCookie(user?.value || '')
}

const getProject = async (id: string, userId: string | undefined) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id },
    })
    if (!project || project.userId !== userId && project.id !== 'demo-project') {
      redirect('/')
    }

    return { project }
  } catch (error) {
    return { error: true }
  } finally {
    await prisma.$disconnect()
  }
}
