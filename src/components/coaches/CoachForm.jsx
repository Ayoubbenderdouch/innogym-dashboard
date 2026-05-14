// Formulaire coach — sert à la fois pour l'ajout et la modification.
// Si la prop `coach` est fournie → mode édition, sinon mode ajout.
import { useState } from 'react'
import { useData } from '../../store/DataContext'
import { useToast } from '../../store/ToastContext'
import {
  Field,
  Input,
  Select,
  Textarea,
  FormActions,
  PrimaryButton,
  GhostButton,
} from '../ui/form'

const EMPTY = {
  fullName: '',
  title: '',
  years: '',
  weeklyHours: '',
  rating: '',
  reviews: '',
  members: '',
  followers: '',
  status: 'actif',
  bio: '',
  specialties: '',
  accent: 'yellow',
}

export default function CoachForm({ coach, onClose }) {
  const { addCoach, updateCoach } = useData()
  const toast = useToast()
  const isEdit = Boolean(coach)

  const [form, setForm] = useState(() =>
    coach
      ? {
          fullName: coach.fullName ?? '',
          title: coach.title ?? '',
          years: coach.years ?? '',
          weeklyHours: coach.weeklyHours ?? '',
          rating: coach.rating ?? '',
          reviews: coach.reviews ?? '',
          members: coach.members ?? '',
          followers: coach.followers ?? '',
          status: coach.status ?? 'actif',
          bio: coach.bio ?? '',
          specialties: (coach.specialties ?? []).join(', '),
          accent: coach.accent ?? 'yellow',
        }
      : EMPTY,
  )

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const num = (v, fallback = 0) => {
    const n = Number(v)
    return Number.isFinite(n) ? n : fallback
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.fullName.trim() || !form.title.trim()) {
      toast('Le nom et le titre sont obligatoires', 'error')
      return
    }

    const specialties = form.specialties
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    const payload = {
      fullName: form.fullName.trim(),
      title: form.title.trim(),
      years: num(form.years),
      weeklyHours: num(form.weeklyHours),
      rating: Math.max(0, Math.min(5, num(form.rating))),
      reviews: num(form.reviews),
      members: num(form.members),
      followers: form.followers.trim(),
      status: form.status,
      bio: form.bio.trim(),
      specialties,
      accent: form.accent,
    }

    if (isEdit) {
      updateCoach(coach.id, payload)
      toast('Coach modifié', 'success')
    } else {
      addCoach({
        ...payload,
        classes: [],
        avatar: `https://i.pravatar.cc/240?img=${Math.floor(Math.random() * 70) + 1}`,
      })
      toast('Coach ajouté', 'success')
    }
    onClose()
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Nom complet" htmlFor="fullName" className="sm:col-span-2">
          <Input
            id="fullName"
            value={form.fullName}
            onChange={set('fullName')}
            placeholder="Nourine Aïssa"
            required
          />
        </Field>

        <Field label="Titre" htmlFor="title" className="sm:col-span-2">
          <Input
            id="title"
            value={form.title}
            onChange={set('title')}
            placeholder="Cross Training & Boxe"
            required
          />
        </Field>

        <Field label="Ancienneté (ans)" htmlFor="years">
          <Input
            id="years"
            type="number"
            min="0"
            value={form.years}
            onChange={set('years')}
            placeholder="7"
          />
        </Field>

        <Field label="Heures / semaine" htmlFor="weeklyHours">
          <Input
            id="weeklyHours"
            type="number"
            min="0"
            value={form.weeklyHours}
            onChange={set('weeklyHours')}
            placeholder="28"
          />
        </Field>

        <Field label="Note (0–5)" htmlFor="rating">
          <Input
            id="rating"
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={form.rating}
            onChange={set('rating')}
            placeholder="4.9"
          />
        </Field>

        <Field label="Nombre d'avis" htmlFor="reviews">
          <Input
            id="reviews"
            type="number"
            min="0"
            value={form.reviews}
            onChange={set('reviews')}
            placeholder="214"
          />
        </Field>

        <Field label="Membres encadrés" htmlFor="members">
          <Input
            id="members"
            type="number"
            min="0"
            value={form.members}
            onChange={set('members')}
            placeholder="86"
          />
        </Field>

        <Field label="Abonnés" htmlFor="followers">
          <Input
            id="followers"
            value={form.followers}
            onChange={set('followers')}
            placeholder="12K"
          />
        </Field>

        <Field label="Statut" htmlFor="status">
          <Select id="status" value={form.status} onChange={set('status')}>
            <option value="actif">actif</option>
            <option value="congé">congé</option>
          </Select>
        </Field>

        <Field label="Couleur d'accent" htmlFor="accent">
          <Select id="accent" value={form.accent} onChange={set('accent')}>
            <option value="yellow">yellow</option>
            <option value="purple">purple</option>
            <option value="lime">lime</option>
          </Select>
        </Field>

        <Field
          label="Spécialités (séparées par des virgules)"
          htmlFor="specialties"
          className="sm:col-span-2"
        >
          <Input
            id="specialties"
            value={form.specialties}
            onChange={set('specialties')}
            placeholder="Cross Training, Boxe, HIIT, Cardio"
          />
        </Field>

        <Field label="Biographie" htmlFor="bio" className="sm:col-span-2">
          <Textarea
            id="bio"
            rows={4}
            value={form.bio}
            onChange={set('bio')}
            placeholder="Présentation du coach…"
          />
        </Field>
      </div>

      <FormActions>
        <GhostButton type="button" onClick={onClose}>
          Annuler
        </GhostButton>
        <PrimaryButton type="submit">
          {isEdit ? 'Enregistrer' : 'Ajouter le coach'}
        </PrimaryButton>
      </FormActions>
    </form>
  )
}
