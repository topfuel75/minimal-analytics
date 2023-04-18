declare global {
    interface Window {
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
    event?: string[][];
}
declare function track(trackingId: string, props?: IProps): any;
declare function track(props?: IProps): any;
export { track };
