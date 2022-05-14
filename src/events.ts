interface ApplicationEventMap {
  "listening": ListeningEvent;
}

export class ListeningEvent extends CustomEvent<Deno.ListenOptions> {
  constructor(detail: Deno.ListenOptions) {
    super("listening", { detail });
  }
}

interface ApplicationEventTarget extends EventTarget {
  addEventListener<K extends keyof ApplicationEventMap>(
    type: K,
    listener: (ev: ApplicationEventMap[K]) => void,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(
    type: string,
    callback: EventListenerOrEventListenerObject | null,
    options?: EventListenerOptions | boolean,
  ): void;
}

const TypedEventTarget = EventTarget as {
  new (): ApplicationEventTarget;
  prototype: ApplicationEventTarget;
};

export class ApplicationEvents extends TypedEventTarget {}
