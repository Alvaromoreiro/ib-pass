import { KeepAliveWorkerComponent, KeepAliveWorkerComponentInput, KeepAliveWorkerComponentOutput } from './components/ib-booking-keep-alive-worker-component';
import { InactivityWorkerComponent, InactivityWorkerComponentInput, InactivityWorkerComponentOutput } from './components/ib-booking-user-inactivity-worker-component';
import { OrderAliveWorkerComponent, OrderAliveWorkerComponentInput, OrderAliveWorkerComponentOutput } from './components/ib-booking-order-alive-worker-component';

export interface KeepAliveWorkerInput {
    component: 'keepAlive' | 'inactivity' | 'orderAlive';
    data: InactivityWorkerComponentInput | KeepAliveWorkerComponentInput | OrderAliveWorkerComponentInput;
}
export type KeepAliveWorkerOutput = KeepAliveWorkerComponentOutput | InactivityWorkerComponentOutput | OrderAliveWorkerComponentOutput;

export class KeepAliveWorker {
    private keepAliveWorkerComponent: KeepAliveWorkerComponent;
    private inactivityWorkerComponent: InactivityWorkerComponent;
    private orderAliveWorkerComponent: OrderAliveWorkerComponent;
    constructor () {
        this.keepAliveWorkerComponent = new KeepAliveWorkerComponent();
        this.inactivityWorkerComponent = new InactivityWorkerComponent();
        this.orderAliveWorkerComponent = new OrderAliveWorkerComponent();
        this.setIO();
    }

    private sendMessage = (message: KeepAliveWorkerOutput) => {
        postMessage(message);
    };

    private messageHandler = (e: MessageEvent<KeepAliveWorkerInput>) => {
        const { component, data} = e.data;
        let origin = e.origin ?? '';
        if (origin !== '') return; // Web worker security check
        switch (component) {
                case 'keepAlive':
                    this.keepAliveWorkerComponent.manageOperations(data as KeepAliveWorkerComponentInput);
                    break;
                case 'inactivity':
                    this.inactivityWorkerComponent.manageOperations(data as InactivityWorkerComponentInput);
                    break;
                case 'orderAlive':
                    this.orderAliveWorkerComponent.manageOperations(data as OrderAliveWorkerComponentInput);
                    break;
        }


    };
    private setIO = () => {
        // Outputs
        this.keepAliveWorkerComponent.postMessage = this.sendMessage;
        this.inactivityWorkerComponent.postMessage = this.sendMessage;
        this.orderAliveWorkerComponent.postMessage = this.sendMessage;
        // Inputs
        removeEventListener('message', this.messageHandler);
        addEventListener('message', this.messageHandler);
    };
}


new KeepAliveWorker();