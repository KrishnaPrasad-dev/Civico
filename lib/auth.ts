import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!

export function getUserIdFromRequest(req: Request): string | null {
  const authHeader = req.headers.get('authorization')

  if (!authHeader?.startsWith('Bearer ')) return null

  try {
    const token = authHeader.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string }
    return decoded.id
  } catch {
    return null
  }
}
