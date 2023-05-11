import { sql } from '@vercel/postgres'
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method === 'POST') {
    const body = JSON.parse(request.body)
    if (!body.id) {
      return response.status(200).json({})
    }

    await sql`INSERT INTO Users (id, email, first_name, last_name) 
      VALUES (${body.id}, ${body.email}, '', '');`;
    return response.status(200).json(body)
  } else {
    if (!request.query.id) {
      return response.status(200).json({})
    }

    const { rows } = await sql`SELECT * FROM Users WHERE id=${request.query.id.toString()};`
    if (rows.length > 0) {
      return response.status(200).json(rows[0])
    }
  }

  return response.status(200).json({})
}