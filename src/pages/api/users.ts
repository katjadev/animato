import { sql } from '@vercel/postgres'
import { NextApiRequest, NextApiResponse } from 'next'
import { serialize } from 'cookie'
import { firebaseAdminSDK } from '@animato/lib/firebase/FirebaseAdminSDK'

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const expiresIn = 24 * 60 * 60 * 1000
  if (request.method === 'POST') {
    const { id, token, email } = request.body
    if (!id || !token) {
      response.status(400).send({ error: 'Missing token or user id' })
    }

    const cookie = await firebaseAdminSDK.auth().verifyIdToken(token)
      .then((decodedIdToken) => {
          if (new Date().getTime() / 1000 - decodedIdToken.auth_time < 5 * 60) {
            return firebaseAdminSDK.auth().createSessionCookie(token, { expiresIn })
          }
          response.status(401).send('Recent sign in required!')
      });

    if (!cookie) {
      response.status(401).send('Invalid authentication')
    }

    const { rows } = await sql`SELECT * FROM Users WHERE id=${id};`
    if (rows.length === 0) {
      await sql`INSERT INTO Users (id, email, first_name, last_name) 
        VALUES (${id}, ${email}, '', '');`
    }

    const options = { maxAge: expiresIn, httpOnly: true, secure: true, path: '/' }
    response.setHeader('Set-Cookie', serialize('user', cookie!, options))
    return response.status(200).json(rows.length !== 0 ? rows[0] : { id, email })
  } else if (request.method === 'DELETE') {
    const options = { maxAge: expiresIn, httpOnly: true, secure: true, path: '/' }
    response.setHeader('Set-Cookie', serialize('user', '', options))
    return response.status(200).json({})
  }

  return response.status(200).json({})
}