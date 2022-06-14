import Wallet from "../../service-layer/controllers/models/wallet";
import IWallet from "../../service-layer/controllers/models/wallet.interface";
import BaseService from "./base.service";
import CoincapRateService from "./coincap-rate.service";

export default class WalletService extends BaseService {
  public static baseUrl = "http://localhost:8080/wallet";

  public static get(id: string): Promise<Wallet> {
    return this._get<Wallet>(WalletService.baseUrl, id);
  }

  public static getGain(id: string): Promise<number> {
    return this.get(id).then((wallet: IWallet) => {
      return Promise.all(
        Array.from(Object.entries(wallet.balances)).map(([key, value]) => {
          return CoincapRateService.getCurrentUSDValue({ assetId: key, quantity: value });
        }),
      ).then((usdEquivalences: number[]) => {
        return this.sum(usdEquivalences) - wallet.balanceUSDEquivalenceAtPurchase;
      });
    });
  }

  public static create(): Promise<Wallet> {
    return this._create<Wallet>(WalletService.baseUrl, new Wallet());
  }

  public static update(wallet: Wallet): Promise<Wallet> {
    return this._update<Wallet>(WalletService.baseUrl, wallet);
  }

  public static delete(id: string): Promise<void> {
    return this._delete(WalletService.baseUrl, id);
  }

  private static sum(numbers: number[]) {
    return numbers.reduce((prev, current) => {
      return prev + current;
    }, 0);
  }
}
