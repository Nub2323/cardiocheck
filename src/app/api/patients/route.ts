import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'

/**
 * POST /api/patients — VERIFY a patient (NOT create).
 * Only pre-registered patients can access the app.
 * Requires: dni, birthDate (YYYY-MM-DD)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { dni, birthDate } = body

    if (!dni) {
      return NextResponse.json(
        { error: 'DNI es requerido' },
        { status: 400 }
      )
    }

    // Look up patient by DNI using service role (admin can see all)
    const { data: patient, error: dbError } = await supabaseAdmin
      .from('patients')
      .select('*')
      .eq('dni', dni)
      .single()

    if (dbError || !patient) {
      return NextResponse.json(
        { error: 'No se encontró un paciente registrado con ese DNI. Si es paciente del sistema, solicite al equipo médico que lo registre.' },
        { status: 404 }
      )
    }

    // Verify birth date if the patient has one registered
    if (patient.birth_date) {
      if (!birthDate) {
        return NextResponse.json(
          { error: 'Se requiere fecha de nacimiento para verificar su identidad.' },
          { status: 400 }
        )
      }

      // Compare dates as YYYY-MM-DD strings
      const registeredDate = patient.birth_date // Already a date string from Supabase
      const providedDate = String(birthDate).trim()

      if (registeredDate !== providedDate) {
        return NextResponse.json(
          { error: 'La fecha de nacimiento no coincide con nuestros registros. Verifique los datos o contacte al equipo médico.' },
          { status: 403 }
        )
      }
    }

    // Patient verified successfully
    return NextResponse.json({
      patient: {
        id: patient.id,
        name: patient.name,
        dni: patient.dni,
        birthDate: patient.birth_date,
      },
      verified: true,
    })
  } catch (error) {
    console.error('Error verifying patient:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/patients — List all patients (for admin panel)
 */
export async function GET() {
  try {
    // Get all patients
    const { data: patients, error: pError } = await supabaseAdmin
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false })

    if (pError) throw pError

    // Get latest check-in for each patient
    const patientIds = patients.map((p: { id: string }) => p.id)

    const { data: checkIns } = await supabaseAdmin
      .from('check_ins')
      .select('*')
      .in('patient_id', patientIds)
      .order('created_at', { ascending: false })

    // Group latest check-in by patient
    const latestByPatient: Record<string, unknown> = {}
    for (const ci of (checkIns || [])) {
      if (!latestByPatient[ci.patient_id]) {
        latestByPatient[ci.patient_id] = {
          id: ci.id,
          patientId: ci.patient_id,
          comment: ci.comment,
          severity: ci.severity,
          createdAt: ci.created_at,
        }
      }
    }

    const result = patients.map((p: { id: string; name: string; dni: string; birth_date: string; created_at: string }) => ({
      id: p.id,
      name: p.name,
      dni: p.dni,
      birthDate: p.birth_date,
      createdAt: p.created_at,
      latestCheckIn: latestByPatient[p.id] ?? null,
    }))

    return NextResponse.json({ patients: result })
  } catch (error) {
    console.error('Error listing patients:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
