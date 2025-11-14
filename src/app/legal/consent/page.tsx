import { PageContainer } from '@/components/PageContainer';

export default function ConsentPage() {
  return (
    <PageContainer>
      <h1>Consentement éclairé</h1>
      <p>
        En utilisant MyPsy, tu confirmes avoir au moins 18 ans, comprendre que le service est un accompagnement écrit non
        médical et qu’il ne remplace ni une thérapie, ni un avis médical, ni un service d’urgence.
      </p>
      <p>Tu es informé·e que :</p>
      <ul>
        <li>Camille ne réalise pas de diagnostics, prescriptions ou exercices de respiration/sophrologie.</li>
        <li>En cas de danger, tu dois contacter le 3114 (France) ou le 112 sans attendre.</li>
        <li>Les quotas journaliers peuvent limiter la fréquence des messages.</li>
      </ul>
      <p>Tu peux retirer ton consentement en cessant d’utiliser l’application et en demandant la suppression de tes données.</p>
    </PageContainer>
  );
}
