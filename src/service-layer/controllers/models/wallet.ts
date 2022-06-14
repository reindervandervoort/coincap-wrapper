import { v4 as uuidv4 } from "uuid";
import { UUID } from "./uuid";
import IBase from "./base.interface";
import ClientError from "./client.error";
import IBalance from "./balance.interface";
import ITransaction from "./transaction.interface";
import IWallet from "./wallet.interface";

export default class Wallet implements IWallet, IBase {
  id: UUID;

  balances: Record<string, number> = {};

  balanceUSDEquivalenceAtPurchase = 0;

  constructor(wallet?: IWallet) {
    this.id = wallet?.id ?? uuidv4();
    this.balances = wallet?.balances ?? {};
    this.balanceUSDEquivalenceAtPurchase = wallet?.balanceUSDEquivalenceAtPurchase ?? 0;
  }

  public processTransaction(transaction: ITransaction, USDEquivalenceTo: number) {
    if (transaction.walletFrom === this.id) {
      this.removeFromBalance(transaction.mediumOfExchange);
      this.AddToBalance(transaction.purchased);
      this.balanceUSDEquivalenceAtPurchase -= USDEquivalenceTo;
    } else if (transaction.walletTo === this.id) {
      this.removeFromBalance(transaction.purchased);
      this.AddToBalance(transaction.mediumOfExchange);
      this.balanceUSDEquivalenceAtPurchase += USDEquivalenceTo;
    } else {
      throw new Error("wrong wallet for this transaction");
    }
  }

  private AddToBalance(balanceChange: IBalance) {
    this.balances[balanceChange.assetId] =
      this.balances[balanceChange.assetId] === undefined
        ? balanceChange.quantity
        : this.balances[balanceChange.assetId] + balanceChange.quantity;
  }

  private removeFromBalance(balanceChange: IBalance) {
    if ((this.balances[balanceChange.assetId] ?? 0) < balanceChange.quantity) {
      throw new ClientError(422, "Insufficient balance in 'from' wallet");
    }

    this.balances[balanceChange.assetId] =
      this.balances[balanceChange.assetId] === undefined
        ? -balanceChange.quantity
        : this.balances[balanceChange.assetId] - balanceChange.quantity;
  }
}
