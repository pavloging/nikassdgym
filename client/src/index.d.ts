declare module '*.mp4';
declare module '*.mov';
declare module '*.png';

declare module '*.jpg' {
    const value: string;
    export = value;
}

declare module '*.png' {
    const value: string;
    export = value;
}

declare module '*.svg' {
    const content: string;
    export default content;
}