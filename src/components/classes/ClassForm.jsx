// Formulaire d'ajout / d'édition d'un cours — utilisé en mode "add" ou "edit".
import { useMemo, useState } from 'react'
import {
  Field,
  Input,
  Select,
  Label,
  FormActions,
  PrimaryButton,
  GhostButton,
} from '../ui/form'
import { days, levels } from '../../data/classes'
import { coaches } from '../../data/coaches'

const ACCENTS = [
  { value: 'yellow', label: 'Jaune' },
  { value: 'purple', label: 'Violet' },
  { value: 'lime', label: 'Vert' },
]

// Différence en minutes entre deux heures "HH:MM" (gère le passage de minuit).
function diffMinutes(start, end) {
  if (!start || !end) return 0
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  let d = eh * 60 + em - (sh * 60 + sm)
  if (d < 0) d += 24 * 60
  return d
}

function emptyForm() {
  return {
    title: '',
    category: '',
    coachId: '',
    day: days[0],
    startTime: '',
    endTime: '',
    room: '',
    level: levels[0],
    calories: '',
    maxPlaces: '',
    placesBooked: '0',
    accent: 'yellow',
  }
}

export default function ClassForm({ gymClass, onSubmit, onClose }) {
  const isEdit = Boolean(gymClass)

  const [form, setForm] = useState(() =>
    gymClass
      ? {
          title: gymClass.title ?? '',
          category: gymClass.category ?? '',
          coachId: gymClass.coachId ?? '',
          day: gymClass.day ?? days[0],
          startTime: gymClass.startTime ?? '',
          endTime: gymClass.endTime ?? '',
          room: gymClass.room ?? '',
          level: gymClass.level ?? levels[0],
          calories: String(gymClass.calories ?? ''),
          maxPlaces: String(gymClass.maxPlaces ?? ''),
          placesBooked: String(gymClass.placesBooked ?? '0'),
          accent: gymClass.accent ?? 'yellow',
        }
      : emptyForm(),
  )
  const [errors, setErrors] = useState({})

  const durationMin = useMemo(
    () => diffMinutes(form.startTime, form.endTime),
    [form.startTime, form.endTime],
  )

  const set = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }))
    setErrors((er) => ({ ...er, [key]: undefined }))
  }

  function validate() {
    const er = {}
    if (!form.title.trim()) er.title = 'Titre requis'
    if (!form.category.trim()) er.category = 'Catégorie requise'
    if (!form.coachId) er.coachId = 'Coach requis'
    if (!form.startTime) er.startTime = 'Heure de début requise'
    if (!form.endTime) er.endTime = 'Heure de fin requise'
    const maxP = Number(form.maxPlaces)
    if (!form.maxPlaces || Number.isNaN(maxP) || maxP <= 0)
      er.maxPlaces = 'Nombre de places invalide'
    const bookedP = Number(form.placesBooked || 0)
    if (Number.isNaN(bookedP) || bookedP < 0)
      er.placesBooked = 'Valeur invalide'
    else if (!Number.isNaN(maxP) && bookedP > maxP)
      er.placesBooked = 'Ne peut pas dépasser le nombre de places'
    setErrors(er)
    return Object.keys(er).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return

    const coach = coaches.find((c) => c.id === form.coachId)
    const payload = {
      title: form.title.trim(),
      category: form.category.trim(),
      coachId: form.coachId,
      coach: coach ? coach.fullName : '',
      day: form.day,
      startTime: form.startTime,
      endTime: form.endTime,
      durationMin,
      room: form.room.trim(),
      level: form.level,
      calories: Number(form.calories || 0),
      maxPlaces: Number(form.maxPlaces),
      placesBooked: Number(form.placesBooked || 0),
      accent: form.accent,
    }
    onSubmit(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Titre" htmlFor="cf-title">
          <Input
            id="cf-title"
            value={form.title}
            onChange={set('title')}
            placeholder="Cross Power"
          />
          {errors.title && (
            <p className="mt-1 text-xs font-semibold text-red-500">
              {errors.title}
            </p>
          )}
        </Field>

        <Field label="Catégorie" htmlFor="cf-category">
          <Input
            id="cf-category"
            value={form.category}
            onChange={set('category')}
            placeholder="Cross Training"
          />
          {errors.category && (
            <p className="mt-1 text-xs font-semibold text-red-500">
              {errors.category}
            </p>
          )}
        </Field>

        <Field label="Coach" htmlFor="cf-coach">
          <Select id="cf-coach" value={form.coachId} onChange={set('coachId')}>
            <option value="">— Choisir un coach —</option>
            {coaches.map((c) => (
              <option key={c.id} value={c.id}>
                {c.fullName}
              </option>
            ))}
          </Select>
          {errors.coachId && (
            <p className="mt-1 text-xs font-semibold text-red-500">
              {errors.coachId}
            </p>
          )}
        </Field>

        <Field label="Jour" htmlFor="cf-day">
          <Select id="cf-day" value={form.day} onChange={set('day')}>
            {days.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Heure de début" htmlFor="cf-start">
          <Input
            id="cf-start"
            type="time"
            value={form.startTime}
            onChange={set('startTime')}
          />
          {errors.startTime && (
            <p className="mt-1 text-xs font-semibold text-red-500">
              {errors.startTime}
            </p>
          )}
        </Field>

        <Field label="Heure de fin" htmlFor="cf-end">
          <Input
            id="cf-end"
            type="time"
            value={form.endTime}
            onChange={set('endTime')}
          />
          {errors.endTime && (
            <p className="mt-1 text-xs font-semibold text-red-500">
              {errors.endTime}
            </p>
          )}
        </Field>

        <Field label="Durée">
          <div className="w-full rounded-xl border border-hairline bg-elevated px-3 py-2 text-sm font-semibold text-muted">
            {durationMin} min
          </div>
        </Field>

        <Field label="Salle" htmlFor="cf-room">
          <Input
            id="cf-room"
            value={form.room}
            onChange={set('room')}
            placeholder="Salle A — Box"
          />
        </Field>

        <Field label="Niveau" htmlFor="cf-level">
          <Select id="cf-level" value={form.level} onChange={set('level')}>
            {levels.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Calories (kcal)" htmlFor="cf-calories">
          <Input
            id="cf-calories"
            type="number"
            min="0"
            value={form.calories}
            onChange={set('calories')}
            placeholder="450"
          />
        </Field>

        <Field label="Places max" htmlFor="cf-max">
          <Input
            id="cf-max"
            type="number"
            min="1"
            value={form.maxPlaces}
            onChange={set('maxPlaces')}
            placeholder="20"
          />
          {errors.maxPlaces && (
            <p className="mt-1 text-xs font-semibold text-red-500">
              {errors.maxPlaces}
            </p>
          )}
        </Field>

        <Field label="Places réservées" htmlFor="cf-booked">
          <Input
            id="cf-booked"
            type="number"
            min="0"
            value={form.placesBooked}
            onChange={set('placesBooked')}
            placeholder="0"
          />
          {errors.placesBooked && (
            <p className="mt-1 text-xs font-semibold text-red-500">
              {errors.placesBooked}
            </p>
          )}
        </Field>

        <Field label="Couleur" htmlFor="cf-accent">
          <Select id="cf-accent" value={form.accent} onChange={set('accent')}>
            {ACCENTS.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      <FormActions>
        <GhostButton type="button" onClick={onClose}>
          Annuler
        </GhostButton>
        <PrimaryButton type="submit">
          {isEdit ? 'Enregistrer' : 'Ajouter le cours'}
        </PrimaryButton>
      </FormActions>
    </form>
  )
}
