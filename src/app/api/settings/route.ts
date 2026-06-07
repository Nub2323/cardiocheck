import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET — public settings (only safe ones for client use)
export async function GET() {
  try {
    const settings = await db.appSetting.findMany({
      where: {
        key: { in: ['whatsapp_number', 'doctor_phone', 'doctor_email', 'hospital_name', 'alert_message'] },
      },
    })
    const map: Record<string, string> = {}
    for (const s of settings) {
      map[s.key] = s.value
    }
    return NextResponse.json({ settings: map })
  } catch (error) {
    console.error('Error fetching public settings:', error)
    return NextResponse.json({ settings: {} }, { status: 500 })
  }
}
