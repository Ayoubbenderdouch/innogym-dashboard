// Store global — CRUD members / classes / coaches, persisté dans localStorage.
// Aucune API : les données de src/data/* servent de "seed" initial.
import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { members as seedMembers } from '../data/members'
import { gymClasses as seedClasses } from '../data/classes'
import { coaches as seedCoaches } from '../data/coaches'

const STORAGE_KEY = 'innogym-data-v1'
const DataContext = createContext(null)

// id court et unique pour les nouveaux éléments
const uid = (prefix) =>
  `${prefix}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`

function seed() {
  return {
    members: seedMembers,
    classes: seedClasses,
    coaches: seedCoaches,
  }
}

function loadInitial() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (parsed?.members && parsed?.classes && parsed?.coaches) return parsed
    }
  } catch {
    /* localStorage indisponible ou corrompu — on repart du seed */
  }
  return seed()
}

export function DataProvider({ children }) {
  const [data, setData] = useState(loadInitial)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch {
      /* quota dépassé / mode privé — on ignore */
    }
  }, [data])

  // Helpers génériques (key = 'members' | 'classes' | 'coaches')
  const add = useCallback(
    (key, prefix) => (item) => {
      const withId = { ...item, id: item.id || uid(prefix) }
      setData((d) => ({ ...d, [key]: [withId, ...d[key]] }))
      return withId
    },
    [],
  )
  const update = useCallback(
    (key) => (id, patch) => {
      setData((d) => ({
        ...d,
        [key]: d[key].map((x) => (x.id === id ? { ...x, ...patch } : x)),
      }))
    },
    [],
  )
  const remove = useCallback(
    (key) => (id) => {
      setData((d) => ({ ...d, [key]: d[key].filter((x) => x.id !== id) }))
    },
    [],
  )

  const resetData = useCallback(() => setData(seed()), [])

  const value = {
    members: data.members,
    classes: data.classes,
    coaches: data.coaches,

    addMember: add('members', 'm'),
    updateMember: update('members'),
    deleteMember: remove('members'),

    addClass: add('classes', 'c'),
    updateClass: update('classes'),
    deleteClass: remove('classes'),

    addCoach: add('coaches', 'co'),
    updateCoach: update('coaches'),
    deleteCoach: remove('coaches'),

    resetData,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData doit être utilisé dans <DataProvider>')
  return ctx
}
