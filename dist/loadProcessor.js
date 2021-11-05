"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const FaustAudioProcessorNode_1 = require("./FaustAudioProcessorNode");
function heap2Str(buf) {
    let str = "";
    let i = 0;
    while (buf[i] !== 0) {
        str += String.fromCharCode(buf[i++]);
    }
    return str;
}
const processorModules = {};
function loadProcessorModule(context, url) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("HERE");
        if (!context.audioWorklet) {
            console.error("Error loading FaustAudioProcessorNode: standardized-audio-context AudioWorklet isn't supported in this environment.");
            return null;
        }
        const existing = processorModules[url];
        if (existing) {
            return existing;
        }
        processorModules[url] = context.audioWorklet.addModule(url);
        return processorModules[url];
    });
}
const wasmModules = {};
function getWasmModule(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const existing = wasmModules[url];
        if (existing) {
            return existing;
        }
        wasmModules[url] = fetch(url)
            .then((response) => response.arrayBuffer())
            .then((dspBuffer) => WebAssembly.compile(dspBuffer));
        return wasmModules[url];
    });
}
const importObject = {
    env: {
        memoryBase: 0,
        tableBase: 0,
        _abs: Math.abs,
        // Float version
        _acosf: Math.acos,
        _asinf: Math.asin,
        _atanf: Math.atan,
        _atan2f: Math.atan2,
        _ceilf: Math.ceil,
        _cosf: Math.cos,
        _expf: Math.exp,
        _floorf: Math.floor,
        _fmodf: (x, y) => x % y,
        _logf: Math.log,
        _log10f: Math.log10,
        _max_f: Math.max,
        _min_f: Math.min,
        _remainderf: (x, y) => x - Math.round(x / y) * y,
        _powf: Math.pow,
        _roundf: Math.fround,
        _sinf: Math.sin,
        _sqrtf: Math.sqrt,
        _tanf: Math.tan,
        _acoshf: Math.acosh,
        _asinhf: Math.asinh,
        _atanhf: Math.atanh,
        _coshf: Math.cosh,
        _sinhf: Math.sinh,
        _tanhf: Math.tanh,
        // Double version
        _acos: Math.acos,
        _asin: Math.asin,
        _atan: Math.atan,
        _atan2: Math.atan2,
        _ceil: Math.ceil,
        _cos: Math.cos,
        _exp: Math.exp,
        _floor: Math.floor,
        _fmod: (x, y) => x % y,
        _log: Math.log,
        _log10: Math.log10,
        _max_: Math.max,
        _min_: Math.min,
        _remainder: (x, y) => x - Math.round(x / y) * y,
        _pow: Math.pow,
        _round: Math.fround,
        _sin: Math.sin,
        _sqrt: Math.sqrt,
        _tan: Math.tan,
        _acosh: Math.acosh,
        _asinh: Math.asinh,
        _atanh: Math.atanh,
        _cosh: Math.cosh,
        _sinh: Math.sinh,
        _tanh: Math.tanh,
        table: new WebAssembly.Table({ initial: 0, element: "anyfunc" }),
    },
};
function loadProcessor(context, name, baseURL) {
    return __awaiter(this, void 0, void 0, function* () {
        const cleanedBaseURL = baseURL.endsWith("/") ? baseURL : `${baseURL}/`;
        const [dspModule] = yield Promise.all([
            getWasmModule(`${cleanedBaseURL}${name}.wasm`),
            loadProcessorModule(context, `${cleanedBaseURL}${name}-processor.js`),
        ]);
        const dspInstance = yield WebAssembly.instantiate(dspModule, importObject);
        const HEAPU8 = new Uint8Array(dspInstance.exports.memory.buffer);
        const json = heap2Str(HEAPU8);
        const json_object = JSON.parse(json);
        const processorOptions = { wasm_module: dspModule, json: json };
        const nodeOptions = {
            numberOfInputs: parseInt(json_object.inputs) > 0 ? 1 : 0,
            numberOfOutputs: parseInt(json_object.outputs) > 0 ? 1 : 0,
            channelCount: Math.max(1, parseInt(json_object.inputs)),
            outputChannelCount: [parseInt(json_object.outputs)],
            channelCountMode: "explicit",
            channelInterpretation: "speakers",
            processorOptions,
        };
        if (!FaustAudioProcessorNode_1.FaustAudioProcessorNode) {
            console.error("Error loading FaustAudioProcessorNode: Web audio API isn't supported in this environment.");
            return null;
        }
        try {
            const node = new FaustAudioProcessorNode_1.FaustAudioProcessorNode(context, name, nodeOptions);
            node.onprocessorerror = () => {
                console.log(`An error from ${name}-processor was detected.`);
            };
            return node;
        }
        catch (e) {
            console.error("AA FaustAudioProcessorNode initialization failed: make sure you are passing a standardized-audio-context AudioContext.");
            console.error(e);
        }
    });
}
exports.default = loadProcessor;
