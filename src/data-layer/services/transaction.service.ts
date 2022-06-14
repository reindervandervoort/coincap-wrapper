import Transaction from "../../service-layer/controllers/models/transaction";
import ITransaction from "../../service-layer/controllers/models/transaction.interface";
import Wallet from "../../service-layer/controllers/models/wallet";
import BaseService from "./base.service";
import CoincapRateService from "./coincap-rate.service";
import WalletService from "./wallet.service";

export default class TransactionService extends BaseService {
  public static baseUrl = "http://localhost:8080/Transaction";

  public static get(id: string): Promise<Transaction> {
    return this._get<Transaction>(TransactionService.baseUrl, id);
  }

  public static create(transaction: ITransaction): Promise<Transaction> {
    return Promise.all([
      this.getUsdEquivalence(transaction),
      WalletService.get(transaction.walletFrom),
      WalletService.get(transaction.walletTo),
    ]).then(([USDEquavalenceTo, walletTo, walletFrom]) => {
      const updatedWalletTo: Wallet = new Wallet(walletTo);
      updatedWalletTo.processTransaction(transaction, USDEquavalenceTo);
      const updatedWalletFrom: Wallet = new Wallet(walletFrom);
      updatedWalletFrom.processTransaction(transaction, USDEquavalenceTo);

      // if we made it this far, all exceptions should be handled. time to save.
      // TODO: this should implement error handling (what if one of the requests fails?)
      return Promise.all([
        this._create<Transaction>(TransactionService.baseUrl, new Transaction(transaction)),
        WalletService.update(updatedWalletTo),
        WalletService.update(updatedWalletFrom),
      ]).then(([savedTransaction]) => {
        return savedTransaction;
      });
    });
  }

  private static getUsdEquivalence(transaction: ITransaction): Promise<number> {
    return Promise.all([
      CoincapRateService.getCurrentUSDValue(transaction.purchased),
      CoincapRateService.getCurrentUSDValue(transaction.mediumOfExchange),
    ]).then((rates: number[]) => {
      return rates[0] + rates[1];
    });
  }
}
