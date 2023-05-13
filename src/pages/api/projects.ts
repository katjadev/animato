import { v4 as uuidv4 } from 'uuid'
import { sql } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';
import { firebaseAdminSDK } from '../../lib/firebase/FirebaseAdminSDK'

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method === 'GET' && request.query.id === 'demo-project') {
    const { rows } = await sql`SELECT * FROM Projects WHERE id='demo-project';`
    return response.status(200).json(rows[0])
  }

  if (!request.cookies.user) {
    return response.status(403).json({ error: 'Permission denied' })
  }

  const token = await firebaseAdminSDK.auth().verifySessionCookie(request.cookies.user!, true);
  if (!token) {
    return response.status(403).json({ error: 'Permission denied' })
  }

  if (request.method === 'POST') {
    const id = uuidv4()
    await sql`INSERT INTO Projects (id, title, data, user_id) VALUES (${id}, 'Untitled project', '', ${token.user_id});`
    return response.status(200).json({ id })
  } else if (request.method === 'DELETE') {
    const { id } = JSON.parse(request.body)
    await sql`DELETE FROM Projects WHERE user_id=${token.user_id} AND id=${id};`
    return response.status(200).json({ id })
  } else {
    if (request.query.id) {
      const { rows } = await sql`SELECT * FROM Projects WHERE user_id=${token.user_id} AND id=${request.query.id.toString()};`
      return response.status(200).json(rows[0])
    }

    const { rows } = await sql`SELECT * FROM Projects WHERE user_id=${token.user_id};`
    return response.status(200).json(rows)
  }
}