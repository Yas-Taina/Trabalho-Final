import { lastValueFrom, Observable } from "rxjs";

export class AsyncUtils {
  static async awaitObservable<T>(observable: Observable<T>): Promise<T> {
    return await lastValueFrom(observable);
  }
}