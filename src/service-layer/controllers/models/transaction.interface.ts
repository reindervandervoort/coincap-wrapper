import IBalance from "./balance.interface";
import { UUID } from "./uuid";

export default interface ITransaction {
  purchased: IBalance;

  mediumOfExchange: IBalance;

  walletTo: UUID;

  walletFrom: UUID;
}
