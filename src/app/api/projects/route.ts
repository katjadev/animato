import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import prisma from '@animato/lib/prisma'
import { firebaseAdminSDK } from '@animato/lib/firebase/FirebaseAdminSDK'

export async function POST() {
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

  const id = uuidv4()
  try {
    const project = await prisma.project.create({
      data: { 
        id,
        title: 'Untitled project',
        data: '',
        user: {
          connect: { id: token.user_id },
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })
    return NextResponse.json(project)
  } catch (error) {
    return new Response('Failed to create a project', {
      status: 500,
    })
  } finally {
    await prisma.$disconnect()
  }
}