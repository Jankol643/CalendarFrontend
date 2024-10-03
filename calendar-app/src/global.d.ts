// global.d.ts
declare global {
    interface Window {
        ngRef?: any; // or replace 'any' with the specific type if known
    }
}

export { }; // This line is necessary to make this file a module
