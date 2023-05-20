import prisma from '@animato/lib/prisma'
import { firebaseAdminSDK } from '@animato/lib/firebase/FirebaseAdminSDK'

const COOKIE_EXPIRES_IN = 24 * 60 * 60 * 1000

export async function POST(request: Request) {
  const { id, token, email } = await request.json();

  if (!id || !token) {
    return new Response('Missing token or user id', {
      status: 400,
    })
  }

  const cookie = await firebaseAdminSDK.auth().verifyIdToken(token)
    .then((decodedIdToken) => {
        if (new Date().getTime() / 1000 - decodedIdToken.auth_time < 5 * 60) {
          return firebaseAdminSDK.auth().createSessionCookie(token, { expiresIn: COOKIE_EXPIRES_IN })
        }
        
        return null
    })

  if (!cookie) {
    return new Response('Invalid authentication', {
      status: 401,
    })
  }

  const user = await prisma.user.findUnique({
    where: { id },
  })
  if (!user) {
    await prisma.user.create({
      data: {
        id,
        email,
      },
    });
  }
  prisma.$disconnect()

  return new Response('', {
    status: 200,
    headers: { 'Set-Cookie': `user=${cookie}; Max-Age=${COOKIE_EXPIRES_IN}; Path=/; HttpOnly; Secure;` },
  })
}

export async function DELETE() {
  return new Response('', {
    status: 200,
    headers: { 'Set-Cookie': `user=; Max-Age=${COOKIE_EXPIRES_IN}; Path=/; HttpOnly; Secure;` },
  })
}