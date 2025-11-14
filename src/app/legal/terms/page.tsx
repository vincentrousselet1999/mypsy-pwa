import { PageContainer } from '@/components/PageContainer';

export default function TermsPage() {
  return (
    <PageContainer>
      <h1>Conditions générales</h1>
      <p>Dernière mise à jour : {new Date().getFullYear()}</p>
      <h2>Nature du service</h2>
      <p>
        MyPsy propose un soutien psycho-émotionnel non médical, réalisé par écrit. Nous ne gérons pas les urgences. En cas de
        risque vital, contacte immédiatement le 112 ou le 3114 (France). Le service est réservé aux personnes majeures (18 ans
        et plus) accédant à la PWA hors-store via un lien partagé.
      </p>
      <h2>Offres et quotas (informations indicatives)</h2>
      <ul>
        <li>Essentiel — 40 €/mois : 10h–22h, 6j/7, ≤ 100 msgs/j.</li>
        <li>Plus — 60 €/mois : 9h–23h, 7j/7, ≤ 150 msgs/j.</li>
        <li>Premium — 70 €/mois : 8h–23h, 7j/7, illimité, priorité.</li>
      </ul>
      <p>
        Le paiement externe sera activé ultérieurement. L’accès définitif sera confirmé via un webhook sécurisé. Pour l’instant,
        seul le plan FREE_TRIAL (50 msgs/j, 10h–22h, 6j/7) est actif.
      </p>
      <h2>Paiement et rétractation</h2>
      <p>
        Lors de l’activation des offres payantes, tu pourras renoncer à ton droit de rétractation afin de recevoir le service
        numérique immédiatement. Aucune facturation n’est réalisée à ce jour.
      </p>
      <h2>Suspension et responsabilité</h2>
      <p>
        Tout abus (harcèlement, contenu illégal, contournement des quotas, non-respect des règles) peut conduire à une
        suspension sans remboursement une fois les paiements actifs. MyPsy n’offre aucune garantie de résultat et ne remplace
        pas un professionnel de santé ou un service d’urgence.
      </p>
      <h2>Données personnelles</h2>
      <p>E-mail, métadonnées techniques et résumés de session minimaux sont traités. Consulte la politique de confidentialité.</p>
      <h2>Droit applicable</h2>
      <p>
        Le droit français s’applique. Une médiation consommation sera précisée ultérieurement. Contact : mypsy.comani@gmail.com
        — 06 58 31 87 51.
      </p>
    </PageContainer>
  );
}
