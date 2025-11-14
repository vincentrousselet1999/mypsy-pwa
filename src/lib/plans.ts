export type PlanId = 'FREE_TRIAL' | 'ESSENTIEL' | 'PLUS' | 'PREMIUM';

export interface PlanDefinition {
  id: PlanId;
  name: string;
  price: string;
  quotaPerDay: number | 'unlimited';
  availability: string;
  description: string;
  schedule: {
    days: string;
    hours: string;
  };
  sla: string;
  priority?: boolean;
}

export const PLAN_DEFINITIONS: PlanDefinition[] = [
  {
    id: 'FREE_TRIAL',
    name: 'Free Trial',
    price: 'Offert',
    quotaPerDay: 50,
    availability: '10h–22h, 6j/7',
    description: 'Découvre MyPsy sans paiement. Soutien textuel, guidage doux.',
    schedule: { days: '6j/7', hours: '10h–22h' },
    sla: 'Réponse indicative sous quelques heures (pas garanti).'
  },
  {
    id: 'ESSENTIEL',
    name: 'Essentiel',
    price: '40 € / mois',
    quotaPerDay: 100,
    availability: '10h–22h, 6j/7',
    description: 'Accompagnement régulier sur les heures coeur de journée.',
    schedule: { days: '6j/7', hours: '10h–22h' },
    sla: 'Réponse cible : < 2h en journée.'
  },
  {
    id: 'PLUS',
    name: 'Plus',
    price: '60 € / mois',
    quotaPerDay: 150,
    availability: '9h–23h, 7j/7',
    description: 'Cadence plus rapide, amplitude élargie.',
    schedule: { days: '7j/7', hours: '9h–23h' },
    sla: 'Réponse cible : < 90 min.'
  },
  {
    id: 'PREMIUM',
    name: 'Premium',
    price: '70 € / mois',
    quotaPerDay: 'unlimited',
    availability: '8h–23h, 7j/7',
    description: 'Priorité d’accès et messages illimités.',
    schedule: { days: '7j/7', hours: '8h–23h' },
    sla: 'Réponse cible : < 1h.',
    priority: true
  }
];

export function getPlan(id: PlanId) {
  return PLAN_DEFINITIONS.find((plan) => plan.id === id);
}
