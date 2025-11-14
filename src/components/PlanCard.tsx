import { ReactNode } from 'react';

export interface Plan {
  name: string;
  price: string;
  availability: string;
  quota: string;
  description: string;
  priority?: boolean;
}

export function PlanCard({ plan, cta }: { plan: Plan; cta?: ReactNode }) {
  return (
    <article
      style={{
        border: '1px solid var(--color-border)',
        borderRadius: '1.25rem',
        padding: '1.5rem',
        background: 'var(--color-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}
    >
      <div>
        <h3 style={{ margin: 0 }}>{plan.name}</h3>
        <p style={{ margin: '0.25rem 0', fontWeight: 600 }}>{plan.price}</p>
      </div>
      <p style={{ margin: 0 }}>{plan.description}</p>
      <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
        <li>Horaires : {plan.availability}</li>
        <li>Messages : {plan.quota}</li>
        {plan.priority && <li>Priorité support</li>}
      </ul>
      {cta}
    </article>
  );
}
