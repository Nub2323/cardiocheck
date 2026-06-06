---
name: Cardiology Post-Discharge Monitor
colors:
  surface: '#fbf8ff'
  surface-dim: '#dad9e3'
  surface-bright: '#fbf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f2fc'
  surface-container: '#eeedf7'
  surface-container-high: '#e8e7f1'
  surface-container-highest: '#e3e1eb'
  on-surface: '#1a1b22'
  on-surface-variant: '#444653'
  inverse-surface: '#2f3037'
  inverse-on-surface: '#f1f0fa'
  outline: '#757684'
  outline-variant: '#c4c5d5'
  surface-tint: '#3755c3'
  primary: '#00288e'
  on-primary: '#ffffff'
  primary-container: '#1e40af'
  on-primary-container: '#a8b8ff'
  inverse-primary: '#b8c4ff'
  secondary: '#006c4b'
  on-secondary: '#ffffff'
  secondary-container: '#64f9bc'
  on-secondary-container: '#00714e'
  tertiary: '#611e00'
  on-tertiary: '#ffffff'
  tertiary-container: '#872d00'
  on-tertiary-container: '#ffa583'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b8c4ff'
  on-primary-fixed: '#001453'
  on-primary-fixed-variant: '#173bab'
  secondary-fixed: '#68fcbf'
  secondary-fixed-dim: '#45dfa4'
  on-secondary-fixed: '#002114'
  on-secondary-fixed-variant: '#005137'
  tertiary-fixed: '#ffdbce'
  tertiary-fixed-dim: '#ffb59a'
  on-tertiary-fixed: '#380d00'
  on-tertiary-fixed-variant: '#802a00'
  background: '#fbf8ff'
  on-background: '#1a1b22'
  surface-variant: '#e3e1eb'
  header-dark: '#1E3A8A'
  background-start: '#DBEAFE'
  background-mid: '#E0F2FE'
  background-end: '#D1FAE5'
  text-main: '#0F172A'
  text-muted: '#475569'
  border-soft: '#E2E8F0'
  status-green-bg: '#DCFCE7'
  status-green-border: '#16A34A'
  status-green-text: '#14532D'
  status-yellow-low-bg: '#FEF9C3'
  status-yellow-low-border: '#CA8A04'
  status-yellow-low-text: '#713F12'
  status-yellow-high-bg: '#FEF3C7'
  status-yellow-high-border: '#D97706'
  status-yellow-high-text: '#78350F'
  status-red-bg: '#FEE2E2'
  status-red-border: '#DC2626'
  status-red-text: '#7F1D1D'
  tip-bg: '#F0FDF4'
  tip-border: '#BBF7D0'
  tip-text: '#166534'
typography:
  headline-lg:
    fontFamily: Nunito Sans
    fontSize: 22px
    fontWeight: '800'
    lineHeight: 28px
  headline-md:
    fontFamily: Nunito Sans
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
  body-lg:
    fontFamily: Nunito Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  button-label:
    fontFamily: Nunito Sans
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 20px
  caption:
    fontFamily: Nunito Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  header-title:
    fontFamily: Nunito Sans
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 16px
  header-subtitle:
    fontFamily: Nunito Sans
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max-width: 400px
  padding-h: 22px
  padding-v: 18px
  stack-gap: 16px
  section-gap: 24px
---

# DESIGN.md — Aplicación de Seguimiento Post Alta en Insuficiencia Cardíaca
## Hospital Dr. T. Álvarez · Unidad de Cuidados Cardiológicos

---

## 1. DESCRIPCIÓN GENERAL

Aplicación web mobile-first de seguimiento remoto post alta para pacientes con insuficiencia cardíaca. Funciona como un bot conversacional guiado por botones — sin escritura libre — diseñado para adultos mayores con baja alfabetización digital. El sistema clasifica automáticamente el estado clínico del paciente mediante un algoritmo de triage de dos niveles (semáforo verde/amarillo/rojo) y notifica al equipo de enfermería ante hallazgos relevantes.

---

## 2. USUARIOS

### Usuario primario — Paciente
- Adulto mayor, 60-85 años
- Baja alfabetización digital y sanitaria
- Accede desde smartphone vía link de WhatsApp
- Solo usa botones, nunca escribe texto libre

### Usuario secundario — Enfermería
- Accede al panel interno con PIN de 4 dígitos
- Monitorea respuestas, alertas y estadísticas
- Gestiona configuración y contenidos

---

## 3. IDENTIDAD VISUAL

### Paleta de colores
```
Primario:        #1E40AF  (azul institucional)
Primario oscuro: #1E3A8A  (encabezados)
Acento verde:    #34D399  (barra de progreso, éxito)
Fondo:           Gradiente linear 150deg → #DBEAFE 0% → #E0F2FE 45% → #D1FAE5 100%
Tarjeta:         #FFFFFF
Texto principal: #0F172A
Texto secundario:#475569
Borde suave:     #E2E8F0

Semáforo verde:  fondo #DCFCE7  borde #16A34A  texto #14532D
Semáforo amarillo bajo:  fondo #FEF9C3  borde #CA8A04  texto #713F12
Semáforo amarillo alto:  fondo #FEF3C7  borde #D97706  texto #78350F
Semáforo rojo:   fondo #FEE2E2  borde #DC2626  texto #7F1D1D

Consejo del día: fondo #F0FDF4  borde #BBF7D0  texto #166534
```

### Tipografía
- Familia: **Nunito** (Google Fonts)
- Pesos: 400, 600, 700, 800, 900
- Tamaño base: 16px (mínimo accesible para adultos mayores)
- Títulos principales: 18-22px bold
- Botones de opciones: 15px semibold
- Texto de ayuda: 13px regular

### Bordes y espaciado
- Border radius tarjeta principal: 24px
- Border radius botones: 13-14px
- Border radius badges: 20px (pill)
- Sombra tarjeta: `0 24px 64px rgba(15,40,100,0.14), 0 4px 16px rgba(15,40,100,0.07)`
- Padding body: 22px horizontal, 18px vertical

---

## 4. ESTRUCTURA DE LA APP

### Ancho máximo: 400px (centrado en pantalla)
### Componente permanente — Encabezado
```
Fondo: gradiente 135deg #1E3A8A → #1D4ED8
Contenido:
  - Ícono 🫀 en cuadrado redondeado (fondo rgba blanco 18%, 44x44px)
  - Título: "Seguimiento Post Alta" (14px bold blanco)
  - Subtítulo: "Unidad de Cuidados Cardiológicos · Hospital Dr. T. Álvarez" (11px blanco 72% opacidad)
```

---

## 11. NOTAS ADICIONALES (REQUERIMIENTOS USUARIO)
- Alertas: Enviar alertas en estado AMARILLO (bajo/alto) y ROJO al administrador.
- Gestión: Preguntas editables (agregar/quitar), consejos editables.
- Búsqueda: Buscar pacientes por DNI en el panel.
- Horarios: Control permitido solo de 8:00 AM a 11:00 AM. 
- Fuera de rango: Mostrar mensaje informativo y alerta de guardia (ahogo/dolor pecho).
- Pacientes: Pestaña para ingresar nuevos pacientes y borrar datos.
- Frecuencia: Apartado de opciones de frecuencia (Mes 1: 3 veces/semana, Mes 2: 2 veces/semana, Mes 3: 1 vez/semana).
