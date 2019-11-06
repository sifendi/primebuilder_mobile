declare namespace mobiscroll {
    export interface IInstance<T> {
        settings: any;

        getVal(temp?: boolean): T;
        setVal(value: T, fill?: boolean, change?: boolean, temp?: boolean): void;
        destroy(): void;
    }

    let settings: any;
    let $: any;
    let apiKey: string;
    let apiUrl: string;

    function alert(config: object): Promise<boolean>;
    function confirm(config: object): Promise<boolean>;
    function prompt(config: object): Promise<string>;
    function toast(config: object): Promise<boolean>;
    function snackbar(config: object): Promise<boolean>;
}
export default mobiscroll;
