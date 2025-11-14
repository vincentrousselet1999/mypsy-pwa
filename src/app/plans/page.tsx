import { PageContainer } from '@/components/PageContainer';
import { PlanCard } from '@/components/PlanCard';
import { PLAN_DEFINITIONS } from '@/lib/plans';

export default function PlansPage() {
  return (
    <PageContainer>
      <h1>Plans MyPsy</h1>
      <p>Choisis l’offre qui te correspond. Les boutons de paiement sont désactivés pour le moment.</p>
      <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        {PLAN_DEFINITIONS.filter((plan) => plan.id !== 'FREE_TRIAL').map((plan) => (
          <PlanCard
            key={plan.id}
            plan={{
              name: plan.name,
              price: plan.price,
              availability: `${plan.schedule.hours}, ${plan.schedule.days}`,
              quota: plan.quotaPerDay === 'unlimited' ? 'Illimité' : `≤ ${plan.quotaPerDay} msgs/j`,
              description: plan.description,
              priority: plan.priority
            }}
            cta={
              <button
                type="button"
                disabled
                style={{
                  padding: '0.7rem 1.4rem',
                  borderRadius: '999px',
                  border: '1px dashed var(--color-border)',
                  background: 'transparent'
                }}
              >
                Bientôt
              </button>
            }
          />
        ))}
      </div>
      <div style={{ border: '1px solid var(--color-border)', borderRadius: '1rem', padding: '1rem' }}>
        <strong>Essai actif :</strong> FREE_TRIAL — 50 msgs/j, 10h–22h, 6j/7.
      </div>
    </PageContainer>
  );
}
