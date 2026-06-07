import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

// GET — public settings (only safe ones for client use)
export async function GET() {
  try {
    const { data: settings, error } = await supabase
      .from('app_settings')
      .select('key, value')
      .in('key', ['whatsapp_number', 'doctor_phone', 'doctor_email', 'hospital_name', 'alert_message'])

    if (error) throw error

    const map: Record<string, string> = {}
    for (const s of (settings || [])) {
      map[s.key] = s.value
    }
    return NextResponse.json({ settings: map })
  } catch (error) {
    console.error('Error fetching public settings:', error)
    return NextResponse.json({ settings: {} }, { status: 500 })
  }
}
