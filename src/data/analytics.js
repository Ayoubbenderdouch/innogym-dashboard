// Mock data — statistiques du tableau de bord. Aucune API.

export const kpis = [
  { id: 'members', label: 'Membres actifs', value: 1284, delta: 8.4, trend: 'up', unit: '', spark: [42, 48, 45, 53, 60, 58, 67, 72, 78, 81] },
  { id: 'revenue', label: 'Revenu mensuel', value: 5180000, delta: 12.1, trend: 'up', unit: 'DZD', spark: [22, 25, 24, 28, 31, 30, 34, 36, 35, 38] },
  { id: 'classes', label: 'Cours cette semaine', value: 96, delta: 3.2, trend: 'up', unit: '', spark: [70, 74, 72, 80, 78, 85, 88, 90, 92, 96] },
  { id: 'occupancy', label: "Taux d'occupation", value: 87, delta: -2.3, trend: 'down', unit: '%', spark: [80, 84, 88, 91, 89, 86, 90, 88, 85, 87] },
]

// Fréquentation des 12 derniers mois
export const visitsByMonth = [
  { month: 'Juin', visits: 4200, newMembers: 78 },
  { month: 'Juil', visits: 3900, newMembers: 64 },
  { month: 'Août', visits: 3100, newMembers: 41 },
  { month: 'Sept', visits: 4800, newMembers: 96 },
  { month: 'Oct', visits: 5200, newMembers: 112 },
  { month: 'Nov', visits: 5600, newMembers: 124 },
  { month: 'Déc', visits: 4900, newMembers: 88 },
  { month: 'Jan', visits: 6100, newMembers: 156 },
  { month: 'Fév', visits: 5800, newMembers: 132 },
  { month: 'Mars', visits: 6400, newMembers: 168 },
  { month: 'Avr', visits: 6900, newMembers: 184 },
  { month: 'Mai', visits: 7250, newMembers: 142 },
]

// Revenu par formule d'abonnement
export const revenueByPlan = [
  { plan: 'Découverte', value: 620000, color: '#B5A8E8' },
  { plan: 'Standard', value: 1540000, color: '#8E7CD9' },
  { plan: 'Premium', value: 1980000, color: '#F5D90A' },
  { plan: 'Élite', value: 1040000, color: '#D2FB52' },
]

// Affluence par créneau horaire (une journée type)
export const trafficByHour = [
  { hour: '06h', value: 18 },
  { hour: '08h', value: 64 },
  { hour: '10h', value: 42 },
  { hour: '12h', value: 71 },
  { hour: '14h', value: 38 },
  { hour: '16h', value: 55 },
  { hour: '18h', value: 96 },
  { hour: '20h', value: 82 },
  { hour: '22h', value: 29 },
]

// Répartition des cours par catégorie
export const classCategories = [
  { category: 'Musculation', sessions: 28, color: '#D2FB52' },
  { category: 'Cross Training', sessions: 22, color: '#F5D90A' },
  { category: 'Yoga / Mobilité', sessions: 18, color: '#B5A8E8' },
  { category: 'Danse', sessions: 16, color: '#8E7CD9' },
  { category: 'Boxe', sessions: 12, color: '#F5D90A' },
]

// Flux d'activité récent
export const recentActivity = [
  { id: 'a1', type: 'inscription', who: 'Omar Zerrouki', detail: 'a souscrit la formule Découverte', time: 'il y a 12 min', accent: 'lime' },
  { id: 'a2', type: 'réservation', who: 'Yousra Belaid', detail: 'a réservé Boxe Énergie — Jeu 18:30', time: 'il y a 38 min', accent: 'yellow' },
  { id: 'a3', type: 'renouvellement', who: 'Selma Aouad', detail: 'a renouvelé son abonnement Élite', time: 'il y a 1 h', accent: 'purple' },
  { id: 'a4', type: 'cours complet', who: 'Dance Cardio', detail: 'affiche complet (30/30 places)', time: 'il y a 2 h', accent: 'purple' },
  { id: 'a5', type: 'paiement', who: 'Riad Hamadi', detail: 'paiement Premium confirmé — 5 000 DZD', time: 'il y a 3 h', accent: 'yellow' },
  { id: 'a6', type: 'expiration', who: 'Nadia Brahimi', detail: 'abonnement Découverte expiré', time: 'il y a 5 h', accent: 'lime' },
]

// Objectifs du mois
export const monthlyGoals = [
  { label: 'Nouveaux membres', current: 142, target: 180 },
  { label: 'Revenu (M DZD)', current: 5.18, target: 6.5 },
  { label: 'Cours animés', current: 96, target: 110 },
  { label: 'Note moyenne coachs', current: 4.8, target: 5 },
]
