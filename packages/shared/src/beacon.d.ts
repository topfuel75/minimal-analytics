declare function sendBeaconXHR(url: string | URL, data?: XMLHttpRequestBodyInit | null): boolean;
declare function sendBeaconFetch(url: string | URL, data?: XMLHttpRequestBodyInit | null): boolean;
declare function sendBeacon(url: string | URL, data?: XMLHttpRequestBodyInit | null): boolean;
export { sendBeaconXHR, sendBeaconFetch, sendBeacon, };
