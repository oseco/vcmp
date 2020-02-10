import * as compileUtils from '@vue/component-compiler-utils';
declare type CompileSfcOptions = {
    skipStyle?: boolean;
};
export declare function parseSfc(filePath: string): compileUtils.SFCDescriptor;
export declare function compileSfc(filePath: string, options?: CompileSfcOptions): Promise<any>;
export {};
