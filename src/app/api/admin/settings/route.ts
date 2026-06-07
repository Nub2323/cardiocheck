import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

const DEFAULT_SETTINGS: { key: string; value: string; label: string }[] = [
  { key: 'whatsapp_number', value: '5491100000000', label: 'WhatsApp del Médico (formato: 54911...)' },
  { key: 'doctor_phone', value: '+5491100000001', label: 'Teléfono del Médico' },
  { key: 'doctor_email', value: 'contacto@cardiocheck.app', label: 'Email de contacto' },
  { key: 'hospital_name', value: 'Centro Cardiológico', label: 'Nombre del Centro / Hospital' },
  { key: 'alert_message', value: 'Hola, contacto desde CardioCheck respecto al paciente', label: 'Mensaje de alerta WhatsApp' },
]

async function ensureDefaults() {
  const count = await db.appSetting.count()
  if (count === 0) {
    await db.appSetting.createMany({ data: DEFAULT_SETTINGS })
  }
}

// GET — list all settings
export async function GET() {
  try {
    await ensureDefaults()
    const settings = await db.appSetting.findMany()
    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

// PUT — update a setting
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { key, value } = body as { key: string; value: string }

    if (!key || value === undefined) {
      return NextResponse.json({ error: 'key y value son requeridos' }, { status: 400 })
    }

    const updated = await db.appSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value, label: key },
    })

    return NextResponse.json({ setting: updated })
  } catch (error) {
    console.error('Error updating setting:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
