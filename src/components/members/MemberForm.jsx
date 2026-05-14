// Formulaire membre — utilisé pour l'ajout ET l'édition.
import { useMemo, useState } from 'react'
import { useData } from '../../store/DataContext'
import { useToast } from '../../store/ToastContext'
import { plans, memberStatuses } from '../../data/members'
import {
  Field,
  Input,
  Select,
  FormActions,
  PrimaryButton,
  GhostButton,
} from '../ui/form'

const todayISO = () => new Date().toISOString().slice(0, 10)

// État initial du formulaire selon le mode (ajout ou édition).
const initialForm = (member) => ({
  name: member?.name ?? '',
  email: member?.email ?? '',
  plan: member?.plan ?? plans[0],
  status: member?.status ?? memberStatuses[0],
  joined: member?.joined ?? todayISO(),
  renews: member?.renews ?? '',
  coach: member?.coach ?? '',
  favoriteClass: member?.favoriteClass ?? '',
  visits: member?.visits ?? 0,
  progress: member?.progress ?? 0,
})

export default function MemberForm({ member, onClose }) {
  const { coaches, classes, addMember, updateMember } = useData()
  const toast = useToast()
  const isEdit = Boolean(member)

  const [form, setForm] = useState(() => initialForm(member))
  const [errors, setErrors] = useState({})

  // Titres de cours distincts pour le select.
  const classTitles = useMemo(
    () => [...new Set(classes.map((c) => c.title))].sort(),
    [classes],
  )

  const set = (key) => (e) => {
    const value = e.target.value
    setForm((f) => ({ ...f, [key]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const nextErrors = {}
    if (!form.name.trim()) nextErrors.name = 'Le nom est requis'
    if (!form.email.trim()) nextErrors.email = "L'email est requis"
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      plan: form.plan,
      status: form.status,
      joined: form.joined,
      renews: form.renews,
      coach: form.coach,
      favoriteClass: form.favoriteClass,
      visits: Number(form.visits) || 0,
      progress: Math.max(0, Math.min(100, Number(form.progress) || 0)),
    }

    if (isEdit) {
      updateMember(member.id, payload)
      toast('Membre mis à jour', 'success')
    } else {
      addMember({
        ...payload,
        avatar: `https://i.pravatar.cc/120?img=${Math.floor(Math.random() * 70) + 1}`,
        lastVisit: todayISO(),
      })
      toast('Membre ajouté', 'success')
    }
    onClose()
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Nom" htmlFor="mf-name" className="sm:col-span-2">
          <Input
            id="mf-name"
            value={form.name}
            onChange={set('name')}
            placeholder="Nom complet"
          />
          {errors.name && (
            <p className="mt-1 text-xs font-semibold text-red-500">
              {errors.name}
            </p>
          )}
        </Field>

        <Field label="Email" htmlFor="mf-email" className="sm:col-span-2">
          <Input
            id="mf-email"
            type="email"
            value={form.email}
            onChange={set('email')}
            placeholder="email@exemple.com"
          />
          {errors.email && (
            <p className="mt-1 text-xs font-semibold text-red-500">
              {errors.email}
            </p>
          )}
        </Field>

        <Field label="Formule" htmlFor="mf-plan">
          <Select id="mf-plan" value={form.plan} onChange={set('plan')}>
            {plans.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Statut" htmlFor="mf-status">
          <Select id="mf-status" value={form.status} onChange={set('status')}>
            {memberStatuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Inscrit le" htmlFor="mf-joined">
          <Input
            id="mf-joined"
            type="date"
            value={form.joined}
            onChange={set('joined')}
          />
        </Field>

        <Field label="Renouvellement" htmlFor="mf-renews">
          <Input
            id="mf-renews"
            type="date"
            value={form.renews}
            onChange={set('renews')}
          />
        </Field>

        <Field label="Coach assigné" htmlFor="mf-coach">
          <Select id="mf-coach" value={form.coach} onChange={set('coach')}>
            <option value="">— Aucun —</option>
            {coaches.map((c) => (
              <option key={c.id} value={c.fullName}>
                {c.fullName}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Cours favori" htmlFor="mf-class">
          <Select
            id="mf-class"
            value={form.favoriteClass}
            onChange={set('favoriteClass')}
          >
            <option value="">— Aucun —</option>
            {classTitles.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Visites" htmlFor="mf-visits">
          <Input
            id="mf-visits"
            type="number"
            min="0"
            value={form.visits}
            onChange={set('visits')}
          />
        </Field>

        <Field label="Progression (%)" htmlFor="mf-progress">
          <Input
            id="mf-progress"
            type="number"
            min="0"
            max="100"
            value={form.progress}
            onChange={set('progress')}
          />
        </Field>
      </div>

      <FormActions>
        <GhostButton type="button" onClick={onClose}>
          Annuler
        </GhostButton>
        <PrimaryButton type="submit">
          {isEdit ? 'Enregistrer' : 'Ajouter le membre'}
        </PrimaryButton>
      </FormActions>
    </form>
  )
}
