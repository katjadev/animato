import { getTranslations } from 'next-intl/server'

export default async function getTranslationStrings() {
  const t = await getTranslations()
 
  return {
    projects: t('home.projects'),
    title: t('home.title'),
    description: t('home.description'),
    getStarted: t('home.get-started'),
    exploreDemoProject: t('home.explore-demo-project'),
    login: t('home.login'),
    logout: t('home.logout'),
    signupDialog: {
      heading: t('signup-dialog.heading'),
      createAccount: t('signup-dialog.create-account'),
      email: t('email'),
      password: t('password'),
      invalidEmail: t('invalid-email'),
      missingPassword: t('missing-password'),
      weakPassword: t('weak-password'),
      unknownError: t('unknown-error'),
      close: t('close'),
    },
    loginDialog: {
      heading: t('login-dialog.heading'),
      logIn: t('login-dialog.log-in'),
      email: t('email'),
      password: t('password'),
      invalidEmail: t('invalid-email'),
      missingPassword: t('missing-password'),
      userNotFound: t('user-not-found'),
      wrongPassword: t('wrong-password'),
      unknownError: t('unknown-error'),
      close: t('close'),
    },
    projectList: {
      projects: t('project-list.projects'),
      profile: t('project-list.profile'),
      newProject: t('project-list.new-project'),
      emptyMessage: t('project-list.empty-message'),
      errorMessage: t('project-list.error-message'),
      title: t('project-list.title'),
      lastModified: t('project-list.last-modified'),
      actions: t('project-list.actions'),
      open: t('project-list.open'),
      deleteProject: t('project-list.delete-project'),
      deleteProjectErrorTitle: t('project-list.delete-project-error-title'),
      deleteProjectErrorMessage: t('project-list.delete-project-error-message'),
    },
    project: {
      profile: t('project.profile'),
      undo: t('project.undo'),
      redo: t('project.redo'),
      elements: t('project.elements'),
      errorMessage: t('project.error-message'),
      timelinePointerAriaLabel: t('project.timeline-pointer-aria-label'),
      importSvg: t('project.import-svg'),
      export: t('project.export'),
      backToProjects: t('project.back-to-projects'),
      restart: t('project.restart'),
      play: t('project.play'),
      pause: t('project.pause'),
      repeat: t('project.repeat')
    },
  }
}