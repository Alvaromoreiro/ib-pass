import { Injectable } from "@angular/core";
import { BehaviorSubject, map } from "rxjs";
import { IberiaWebUser, State } from "ib-web-commons/models";
import { IbAnonymousInitialValue } from "./ib-commons-user-store.constants";

@Injectable({
  providedIn: "root",
})
export class IbCUserStoreService {
  private readonly userInfoSubject = new BehaviorSubject<State<IberiaWebUser>>({
    isLoading: false,
    value: IbAnonymousInitialValue,
  });

  get() {
    return this.userInfoSubject.asObservable();
  }

  getLoading() {
    return this.get().pipe(map((store) => store.isLoading));
  }

  getUser() {
    return this.get().pipe(map((store) => store.value));
  }

  /**
   * Get the actual or last value of the store, as a copy
   * @returns A copy of the last value of the store
   */
  getActualUser() {
    return this.userInfoSubject.getValue().value;
  }

  getActualLoading() {
    return this.userInfoSubject.getValue().isLoading;
  }

  setUser(iberiaUser: IberiaWebUser) {
    this.userInfoSubject.next({
      isLoading: this.getActualLoading(),
      value: iberiaUser,
    });
  }

  setLoading(loading: boolean) {
    this.userInfoSubject.next({
      isLoading: loading,
      value: this.getActualUser(),
    });
  }
}
