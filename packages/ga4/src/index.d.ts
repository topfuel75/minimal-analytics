import type { EventParams } from '@minimal-analytics/shared';
declare global {
    interface Window {
        track?: typeof track;
        minimalAnalytics?: {
            defineGlobal?: boolean;
            analyticsEndpoint?: string;
            trackingId?: string;
            autoTrack?: boolean;
        };
    }
}
interface IProps {
    type?: string;
    event?: EventParams;
    debug?: boolean;
}
declare function track(trackingId: string, props?: IProps): any;
declare function track(props?: IProps): any;
export { EventParams, track };
