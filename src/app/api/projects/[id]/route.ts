import { cookies } from 'next/headers'
import prisma from '@animato/lib/prisma'
import { firebaseAdminSDK } from '@animato/lib/firebase/FirebaseAdminSDK'

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const user = cookies().get('user')

  if (!user) {
    return new Response('Unauthorized', {
      status: 401,
    })
  }

  const token = await firebaseAdminSDK.auth().verifySessionCookie(user.value, true);
  if (!token) {
    return new Response('Unauthorized', {
      status: 401,
    })
  }

  const project = await prisma.project.findUnique({
    where: { id: params.id },
  })
  if (!project) {
    return new Response('Project not found', {
      status: 404,
    })
  }
  if (project.userId !== token.user_id) {
    return new Response('Permission denied', {
      status: 403,
    })
  }

  try {
    await prisma.project.delete({
      where: {
        id: params.id,
      },
    })
    return new Response('', {
      status: 200,
    })
  } catch (error) {
    return new Response('Failed to delete the project', {
      status: 500,
    })
  } finally {
    await prisma.$disconnect()
  }
}