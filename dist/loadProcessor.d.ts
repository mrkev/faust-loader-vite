import { FaustAudioProcessorNode } from "./FaustAudioProcessorNode";
export default function loadProcessor(context: BaseAudioContext, name: string, baseURL: string): Promise<FaustAudioProcessorNode | null | undefined>;
