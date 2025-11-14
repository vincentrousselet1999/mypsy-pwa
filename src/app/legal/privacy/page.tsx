import { PageContainer } from '@/components/PageContainer';

export default function PrivacyPage() {
  return (
    <PageContainer>
      <h1>Politique de confidentialité</h1>
      <p>MyPsy traite un volume limité de données afin de fournir le service de soutien.</p>
      <h2>Finalités</h2>
      <ul>
        <li>Assurer le fonctionnement du chat (messages, quotas, sécurité).</li>
        <li>Personnaliser les réponses grâce au questionnaire local (stocké côté appareil).</li>
        <li>Lutter contre les abus et assurer l’intégrité de la plateforme.</li>
      </ul>
      <h2>Base légale</h2>
      <p>Exécution du service demandé et intérêt légitime à sécuriser MyPsy.</p>
      <h2>Données traitées</h2>
      <p>E-mail si renseigné, identifiant technique, quotas quotidiens, résumés techniques minimaux.</p>
      <h2>Conservation</h2>
      <p>Les journaux techniques sont conservés pour une durée limitée (maximum 12 mois) puis supprimés ou anonymisés.</p>
      <h2>Droits des personnes</h2>
      <p>Tu peux exercer tes droits d’accès, rectification ou suppression via mypsy.comani@gmail.com.</p>
      <h2>Contact</h2>
      <p>mypsy.comani@gmail.com — 06 58 31 87 51.</p>
    </PageContainer>
  );
}
