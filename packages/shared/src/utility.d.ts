declare function debounce(callback: TimerHandler, frequency?: number, timer?: number): (...args: any[]) => number;
declare function getRandomId(length?: number): string;
declare function getHashId(value: string, length?: number): string;
declare function getScrollPercentage(): number;
declare function isTargetElement(element: Element, selector: string): Element | null;
declare function getUrlData(urlValue?: string): {
    isExternal: boolean;
    hostname: any;
    pathname: any;
};
export { debounce, getRandomId, getHashId, getScrollPercentage, isTargetElement, getUrlData, };
