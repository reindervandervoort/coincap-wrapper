import { v4 as uuidv4 } from "uuid";
import IBalance from "./balance.interface";
import IBase from "./base.interface";
import ITransaction from "./transaction.interface";
import { UUID } from "./uuid";

export default class Transaction implements ITransaction, IBase {
  id: UUID;

  purchased: IBalance;

  mediumOfExchange: IBalance;

  walletTo: UUID;

  walletFrom: UUID;

  constructor(transaction: ITransaction) {
    this.purchased = transaction.purchased;
    this.mediumOfExchange = transaction.mediumOfExchange;
    this.walletTo = transaction.walletTo;
    this.walletFrom = transaction.walletFrom;
    this.id = uuidv4();
  }
}
