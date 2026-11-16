import { Injectable } from "@angular/core";
import { filter, Observable, Subject, map, EMPTY } from "rxjs";

export type BroadcastMessage<T = unknown> = {
  type: string;
  payload: T;
};

@Injectable({
  providedIn: "root",
})
export class IbCBroadcastService {
  private readonly CHANNEL_NAME = "ib-idt-channel";
  private broadcastChannel: BroadcastChannel | undefined;
  private onMessage = new Subject<BroadcastMessage>();

  constructor() {
    try {
      if (window.BroadcastChannel) {
        this.broadcastChannel = new BroadcastChannel(this.CHANNEL_NAME);
        this.broadcastChannel.onmessage = (
          message: MessageEvent<BroadcastMessage>,
        ) => this.onMessage.next(message.data);
      }
    } catch {
      // continue regardless of error
    }
  }

  postMessage(message: BroadcastMessage): void {
    this.broadcastChannel?.postMessage(message);
  }

  getMessage<T = unknown>(type: string): Observable<T> {
    if (!this.broadcastChannel) {
      return EMPTY;
    }
    return this.onMessage.pipe(
      filter((message) => message.type === type),
      map((res) => res.payload),
    ) as Observable<T>;
  }
}
