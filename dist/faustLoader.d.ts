import { LoaderDefinitionFunction } from "webpack";
interface Options {
    outputPath?: string;
    publicPath?: string;
}
export interface FaustAudioProcessorNode extends AudioWorkletNode {
    getNumInputs(): number;
    getNumOutputs(): number;
    getParam(address: string): number;
    getParams(): string[];
    setParam(address: string, value: number): void;
    getJson(): string;
    getState(): Promise<Record<string, number>>;
    destroy(): void;
}
export declare type ProcessorLoader = (context: any) => Promise<FaustAudioProcessorNode | null | undefined>;
declare const faustLoader: LoaderDefinitionFunction<Options>;
export default faustLoader;
