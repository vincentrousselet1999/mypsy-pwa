import { PlanId } from './plans';

export interface PaymentProviderAdapter {
  createCheckoutSession(planId: PlanId, userId: string): Promise<string>;
  handleWebhookEvent(payload: unknown): Promise<void>;
}

export interface EntitlementStore {
  assign(userId: string, planId: PlanId): Promise<void>;
  getPlan(userId: string): Promise<PlanId | null>;
}

export const noopPaymentProvider: PaymentProviderAdapter = {
  async createCheckoutSession() {
    throw new Error('Payment provider non implémenté');
  },
  async handleWebhookEvent() {
    throw new Error('Payment provider non implémenté');
  }
};

export const inMemoryEntitlementStore: EntitlementStore = {
  async assign() {
    throw new Error('Entitlement store non implémenté');
  },
  async getPlan() {
    return null;
  }
};
