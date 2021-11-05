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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const loader_utils_1 = require("loader-utils");
const util_1 = __importDefault(require("util"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
const exec = util_1.default.promisify(child_process_1.exec);
const fs_extra_1 = __importDefault(require("fs-extra"));
const tmp_promise_1 = __importDefault(require("tmp-promise"));
const faustLoader = function (content) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = loader_utils_1.getOptions(this);
        const { outputPath = "", publicPath = "/" } = options;
        const context = this.rootContext;
        const workDir = yield tmp_promise_1.default.dir();
        const faust2wasmPath = yield new Promise((res) => {
            this.resolve(context, "faust-loader", (err, result) => {
                if (err)
                    throw err;
                if (typeof result !== "string")
                    throw new Error("Unable to find faust2wasm command");
                res(path_1.default.resolve(result, "../../faust2appls"));
            });
        });
        yield fs_extra_1.default.copy(faust2wasmPath, workDir.path);
        const dspName = loader_utils_1.interpolateName(this, "[name]", { content, context });
        const dspPath = path_1.default.resolve(workDir.path, dspName);
        yield fs_extra_1.default.writeFile(dspPath, content);
        const { stderr } = yield exec(`./faust2wasm -worklet ${dspPath}`, {
            cwd: workDir.path,
        });
        if (stderr)
            this.emitError(new Error(stderr));
        const wasmName = loader_utils_1.interpolateName(this, "[name].wasm", { context, content });
        const wasmPath = path_1.default.resolve(workDir.path, wasmName);
        const wasmContent = yield fs_extra_1.default.readFile(wasmPath);
        // TODO: this method should accept a buffer
        // PR: https://github.com/webpack/webpack/pull/13577
        this.emitFile(path_1.default.join(outputPath, wasmName), wasmContent);
        const processorName = loader_utils_1.interpolateName(this, "[name]-processor.js", {
            context,
            content,
        });
        const processorPath = path_1.default.resolve(workDir.path, processorName);
        const processorContent = yield fs_extra_1.default.readFile(processorPath, {
            encoding: "utf8",
        });
        const cleanedProcessorContent = processorContent.replace(/console\.log\(this\);/, "");
        this.emitFile(path_1.default.join(outputPath, processorName), cleanedProcessorContent);
        const importPath = yield new Promise((res) => {
            this.resolve(context, "faust-loader", (err, result) => {
                if (err)
                    throw err;
                if (typeof result !== "string")
                    throw new Error("Unable to find faust2wasm command");
                res(path_1.default.resolve(result, "../loadProcessor.js"));
            });
        });
        return `
  import loadProcessor from "${importPath}";

  function create${dspName}Node(context) {
    return loadProcessor(context, "${dspName}", "${publicPath}")
  }

  export default create${dspName}Node;
`;
    });
};
exports.default = faustLoader;
