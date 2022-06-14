import { UUID } from "./uuid";

export default interface IWallet {
  id: UUID;

  balances: Record<string, number>;

  balanceUSDEquivalenceAtPurchase: number;
}
