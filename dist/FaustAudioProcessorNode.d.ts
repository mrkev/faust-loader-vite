export declare class FaustAudioProcessorNode extends AudioWorkletNode {
    private json;
    private json_object;
    output_handler: null;
    inputs_items: never[];
    outputs_items: never[];
    descriptor: never[];
    fPitchwheelLabel: never[];
    fCtrlLabel: any[];
    constructor(context: BaseAudioContext, name: string, nodeOptions?: any);
    protected parse_ui(ui: any, obj: any): void;
    protected parse_group(group: any, obj: any): void;
    protected parse_items(items: any, obj: any): void;
    protected parse_item(item: any, obj: any): void;
    handleMessage(event: any): void;
    /**
     * Destroy the node, deallocate resources.
     */
    destroy(): void;
    /**
     *  Returns a full JSON description of the DSP.
     */
    getJSON(): string;
    getMetadata(): Promise<unknown>;
    /**
     *  Set the control value at a given path.
     *
     * @param path - a path to the control
     * @param val - the value to be set
     */
    setParamValue: (path: any, val: any) => void;
    setParam: (path: any, val: any) => void;
    /**
     *  Get the control value at a given path.
     *
     * @return the current control value
     */
    getParamValue: (path: string) => any;
    getParam: (path: string) => any;
    /**
     * Setup a control output handler with a function of type (path, value)
     * to be used on each generated output value. This handler will be called
     * each audio cycle at the end of the 'compute' method.
     *
     * @param handler - a function of type function(path, value)
     */
    setOutputParamHandler(handler: any): void;
    /**
     * Get the current output handler.
     */
    getOutputParamHandler(): null;
    getNumInputs(): number;
    getNumOutputs(): number;
    inputChannelCount(): number;
    outputChannelCount(): number;
    /**
     * Returns an array of all input paths (to be used with setParamValue/getParamValue)
     */
    getParams(): never[];
    getDescriptor(): {};
    /**
     * Control change
     *
     * @param channel - the MIDI channel (0..15, not used for now)
     * @param ctrl - the MIDI controller number (0..127)
     * @param value - the MIDI controller value (0..127)
     */
    ctrlChange(channel: any, ctrl: any, value: any): void;
    /**
     * PitchWeel
     *
     * @param channel - the MIDI channel (0..15, not used for now)
     * @param value - the MIDI controller value (0..16383)
     */
    pitchWheel(channel: any, wheel: any): void;
    /**
     * Generic MIDI message handler.
     */
    midiMessage(data: any): void;
    onMidi(data: any): void;
    /**
     * @returns {Object} describes the path for each available param and its current value
     */
    getState(): Promise<unknown>;
    /**
     * Sets each params with the value indicated in the state object
     * @param {Object} state
     */
    setState(state: any): Promise<unknown>;
    /**
     * A different call closer to the preset management
     * @param {Object} patch to assign as a preset to the node
     */
    setPatch(patch: any): void;
    static remap(v: number, mn0: number, mx0: number, mn1: number, mx1: number): number;
}
