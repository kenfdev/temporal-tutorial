export type Customer = {
  firstName: string;
  lastName: string;
  email: string;
  subscription: {
    trialPeriod: number;
    billingPeriod: number;
    maxBillingPeriods: number;
    initialBillingPeriodCharge: number;
  };
  id: string;
};
