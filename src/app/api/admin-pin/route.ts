import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const DEFAULT_PIN = '1234'

// Auto-seed default PIN if no pins exist
async function ensureDefaultPin() {
  const count = await db.adminPin.count()
  if (count === 0) {
    await db.adminPin.create({
      data: { pin: DEFAULT_PIN, label: 'default' },
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Ensure at least the default PIN exists
    await ensureDefaultPin()

    const body = await request.json()
    const { pin } = body as { pin: string }

    if (!pin) {
      return NextResponse.json({ valid: false }, { status: 400 })
    }

    const found = await db.adminPin.findUnique({ where: { pin } })

    return NextResponse.json({ valid: !!found })
  } catch (error) {
    console.error('Error verifying PIN:', error)
    return NextResponse.json({ valid: false }, { status: 500 })
  }
}

// GET - list all PINs (for admin management)
export async function GET() {
  try {
    await ensureDefaultPin()
    const pins = await db.adminPin.findMany({
      select: { id: true, pin: true, label: true },
    })
    return NextResponse.json({ pins })
  } catch (error) {
    console.error('Error listing PINs:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

// PUT - update PIN
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, newPin, label } = body as { id: string; newPin: string; label?: string }

    if (!id || !newPin) {
      return NextResponse.json({ error: 'id y newPin son requeridos' }, { status: 400 })
    }

    const updated = await db.adminPin.update({
      where: { id },
      data: { pin: newPin, label: label || undefined },
    })

    return NextResponse.json({ pin: updated })
  } catch (error) {
    console.error('Error updating PIN:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
