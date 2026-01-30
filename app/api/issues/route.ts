import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Issue from '@/models/Issue'

export async function POST(req: Request) {
  try {
    await connectDB()

    const body = await req.json()
    console.log('CREATE ISSUE BODY:', body)

    const { title, description, location, department, userId } = body

    if (!title || !description || !location || !department || !userId) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      )
    }

    const issue = await Issue.create({
      title,
      description,
      location,
      department,
      userId,
    })

    return NextResponse.json(issue, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: 'Failed to create issue' },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { message: 'userId is required' },
        { status: 400 }
      )
    }

    const issues = await Issue.find({ userId }).sort({ createdAt: -1 })

    return NextResponse.json(issues)
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: 'Failed to fetch issues' },
      { status: 500 }
    )
  }
}
