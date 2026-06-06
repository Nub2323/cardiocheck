import { create } from 'zustand'

export type ScreenId =
  | 'welcome'
  | 'patient-data'
  | 'consent'
  | 'flow'
  | 'checkin'
  | 'comments'
  | 'complete'
  | 'pin'
  | 'admin'

export type AnswerSeverity = 'green' | 'neutral' | 'yellow-low' | 'yellow' | 'yellow-high' | 'red'

export interface CheckinQuestion {
  id: number
  emoji: string
  question: string
  options: { label: string; severity: AnswerSeverity }[]
}

export const CHECKIN_QUESTIONS: CheckinQuestion[] = [
  {
    id: 0,
    emoji: '😊',
    question: '¿Cómo se siente hoy en comparación a su última consulta?',
    options: [
      { label: 'Mejor que antes', severity: 'green' },
      { label: 'Igual que antes', severity: 'neutral' },
      { label: 'Peor que antes', severity: 'yellow' },
      { label: 'Mucho peor / me cuesta hablar', severity: 'red' },
    ],
  },
  {
    id: 1,
    emoji: '⚖️',
    question: '¿Subió de peso desde su última consulta?',
    options: [
      { label: 'No subí', severity: 'green' },
      { label: 'Subí menos de 1 kg', severity: 'neutral' },
      { label: 'Subí entre 1 y 2 kg', severity: 'yellow' },
      { label: 'Subí más de 2 kg', severity: 'red' },
    ],
  },
  {
    id: 2,
    emoji: '🫁',
    question: '¿Tiene dificultad para respirar?',
    options: [
      { label: 'No, me siento bien', severity: 'green' },
      { label: 'Un poco al hacer esfuerzo', severity: 'yellow-low' },
      { label: 'Sí, incluso al estar quieto', severity: 'yellow-high' },
      { label: 'Me cuesta hablar por la falta de aire', severity: 'red' },
    ],
  },
  {
    id: 3,
    emoji: '🦶',
    question: '¿Notó hinchazón en los tobillos o piernas?',
    options: [
      { label: 'No', severity: 'green' },
      { label: 'Leve, solo de noche', severity: 'yellow-low' },
      { label: 'Sí, durante el día', severity: 'yellow-high' },
      { label: 'Muy hinchado', severity: 'red' },
    ],
  },
  {
    id: 4,
    emoji: '🛏️',
    question: '¿Necesita más almohadas que antes para dormir sin ahogarse?',
    options: [
      { label: 'No, igual que siempre', severity: 'neutral' },
      { label: 'Sí, una almohada más', severity: 'yellow' },
      { label: 'Varias más / no puedo acostarme', severity: 'yellow-high' },
    ],
  },
]

interface AppState {
  currentScreen: ScreenId
  patientName: string
  patientDni: string
  currentQuestion: number
  answers: Record<number, string>
  additionalComment: string
  isAdmin: boolean
  consentAccepted: boolean

  setScreen: (screen: ScreenId) => void
  setPatientName: (name: string) => void
  setPatientDni: (dni: string) => void
  setCurrentQuestion: (q: number) => void
  setAnswer: (questionIndex: number, answer: string) => void
  setAdditionalComment: (comment: string) => void
  setIsAdmin: (admin: boolean) => void
  setConsentAccepted: (accepted: boolean) => void
  resetFlow: () => void
}

export const useAppState = create<AppState>((set) => ({
  currentScreen: 'welcome',
  patientName: '',
  patientDni: '',
  currentQuestion: 0,
  answers: {},
  additionalComment: '',
  isAdmin: false,
  consentAccepted: false,

  setScreen: (screen) => set({ currentScreen: screen }),
  setPatientName: (name) => set({ patientName: name }),
  setPatientDni: (dni) => set({ patientDni: dni }),
  setCurrentQuestion: (q) => set({ currentQuestion: q }),
  setAnswer: (questionIndex, answer) =>
    set((state) => ({
      answers: { ...state.answers, [questionIndex]: answer },
    })),
  setAdditionalComment: (comment) => set({ additionalComment: comment }),
  setIsAdmin: (admin) => set({ isAdmin: admin }),
  setConsentAccepted: (accepted) => set({ consentAccepted: accepted }),
  resetFlow: () =>
    set({
      currentQuestion: 0,
      answers: {},
      additionalComment: '',
    }),
}))
