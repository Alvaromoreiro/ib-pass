import { Injectable } from "@angular/core";
import { IbAvatarService } from "ib-web-commons/http-services";
import { DomSanitizer, SafeUrl } from "@angular/platform-browser";
import {
  map,
  Observable,
  of,
  tap,
  switchMap,
  zip,
  merge,
  catchError,
  from,
  EMPTY,
  NEVER,
} from "rxjs";
import { CommonsBrowserStorageService } from "ib-web-commons/utils";
import { AvatarResponse } from "ib-web-commons/models";

@Injectable({
  providedIn: "root",
})
export class IbAvatarStoreService {
  private objectUrl: string | undefined;
  private readonly updateAvatarEvent = "ibAvatarUpdate";
  private readonly avatarKey = "ib-avatar-cache";

  constructor(
    private avatarService: IbAvatarService,
    private localStorageService: CommonsBrowserStorageService,
    private domSanitizer: DomSanitizer,
  ) {}

  /**
   * @description [CPA-143] Gets a subcription from the avatar, returns the cached avatar if possible, if not recovers it from
   * server. ATTENTION to unsubscribe from this observable, because it never completes.
   */
  getAvatar(): Observable<SafeUrl> {
    return this.getCachedAvatarAsObservable().pipe(
      switchMap((res) => {
        if (res) return of(this.transformBlobToSrc(res));
        return this.getAvatarFromServer();
      }),
    );
  }

  /**
   * @description [CPA-143] Gets the avatar url directly from server and updates the store accordingly.
   */
  getAvatarFromServer(): Observable<SafeUrl> {
    return this.avatarService.getAvatarImg().pipe(
      switchMap((res) => this.deleteDefaultAvatar(res)),
      switchMap((res) => {
        return zip(of(res.image), this.setAvatarCache(res.image));
      }),
      switchMap((res) => of(this.transformBlobToSrc(res[0]!))),
    );
  }

  /**
   * @description [CPA-143]  Update the avatar from server and updates the cached data.
   */
  updateAvatar(eventImage: Event): Observable<SafeUrl> {
    return this.avatarService
      .postAvatarImg(this.getFormDataFromEvent(eventImage))
      .pipe(
        switchMap(() => this.setAvatarCache(this.getBlobFromEvent(eventImage))),
        map((res) => this.transformBlobToSrc(res)),
        tap(() => {
          this.emitAvatarUpdateEvent();
        }),
      );
  }

  /**
   * @description [CPA-143] Removes the avatar cached data.
   */
  removeAvatarCache(): void {
    this.deleteAvatarURL();
    this.localStorageService.remove(this.avatarKey);
  }

  /**
   * @description [CPA-143] Saves the avatar in localStorage as cache.
   * @private
   */
  private setAvatarCache(blob: Blob | null | undefined): Observable<Blob> {
    if (!blob) {
      this.localStorageService.set(this.avatarKey, "EMPTY");
      return EMPTY;
    }

    return this.transformBlobToBase64(blob).pipe(
      tap((res) => {
        this.localStorageService.set(this.avatarKey, res as any); // TODO fix from ts upgrade
      }),
      switchMap(() => of(blob)),
    );
  }

  /**
   * @description [CPA-143] Revokes the avatar URL to clean the memory usage from objectURL.
   */
  deleteAvatarURL() {
    if (this.objectUrl) {
      window.URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = undefined;
    }
  }

  /**
   * @description [CPA-143] Gets the cached avatar as an observable
   * @private
   */
  private getCachedAvatarAsObservable(): Observable<Blob | null> {
    return merge(
      of({
        newValue: this.localStorageService.get<string>(this.avatarKey),
        oldValue: undefined,
      }),
      this.localStorageService.getAsObservable<string>(this.avatarKey),
    ).pipe(
      switchMap((res) => {
        if (res.newValue)
          return res.newValue === "EMPTY"
            ? NEVER
            : this.transformBase64ToBlob(res.newValue);
        return res.oldValue === undefined ? of(null) : NEVER;
      }),
      catchError(() => of(null)),
    );
  }

  /**
   * @description [CPA-143] Emits event that WCS listens to update the avatar header.
   * @private
   */
  private emitAvatarUpdateEvent() {
    const event = new Event(this.updateAvatarEvent);
    document.dispatchEvent(event);
  }

  /**
   * @description [CPA-143] Transforms Blob to a objectURL to be capable of show it with a link.
   * @private
   */
  private transformBlobToSrc(image: Blob): SafeUrl {
    this.deleteAvatarURL();
    this.objectUrl = window.URL.createObjectURL(image);
    return this.domSanitizer.bypassSecurityTrustUrl(this.objectUrl);
  }

  /**
   * @description [CPA-143] Transforms a File Input Event to a Blob.
   * @private
   */
  private getBlobFromEvent(event: Event): Blob {
    const target: HTMLInputElement = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return new Blob();
    return new Blob([file], { type: file.type });
  }

  /**
   * @description [CPA-143] Transforms a File Input Event to a Form Data to be capable to send it to server.
   * @private
   */
  private getFormDataFromEvent(event: Event): FormData {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    const formData = new FormData();
    if (file) {
      const blob = new Blob([file], { type: "application/octet-stream" });
      formData.append("fileUpload", blob, file.name);
    }
    return formData;
  }

  /**
   * @description [CPA-143] Transforms a Blob into a Base64 codified string to be able to cache it
   * @private
   */
  private transformBlobToBase64(blob: Blob) {
    return new Observable<string | ArrayBuffer | null>((subscriber) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = function () {
        const base64data = reader.result;
        subscriber.next(base64data);
        subscriber.complete();
      };
    });
  }

  /**
   * @description [CPA-143] Decodifies a Base64 string into Blob
   * @private
   */
  private transformBase64ToBlob(dataURI: string): Observable<Blob> {
    return from(fetch(dataURI).then(async (res) => res.blob()));
  }

  /**
   * Delete the default avatar of some of the users
   * @param blob Blob of image data from server
   * @returns The blob if it is not the default avatar, null otherwise
   */
  private deleteDefaultAvatar(
    avatar: AvatarResponse,
  ): Observable<AvatarResponse> {
    if (avatar.image?.size !== 2207 || avatar.image.type !== "image/jpg") {
      return of(avatar);
    }
    const defaultAvatarEncoded =
      "data:image/jpg;base64,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";
    return this.transformBlobToBase64(avatar.image).pipe(
      map((base64) =>
        base64 !== defaultAvatarEncoded
          ? avatar
          : { image: undefined, status: 204 },
      ),
    );
  }
}
