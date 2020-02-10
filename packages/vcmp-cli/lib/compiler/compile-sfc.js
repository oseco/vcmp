"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const compiler = __importStar(require("vue-template-compiler"));
const compileUtils = __importStar(require("@vue/component-compiler-utils"));
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
const common_1 = require("../common");
const compile_js_1 = require("./compile-js");
const compile_style_1 = require("./compile-style");
const RENDER_FN = '__vue_render__';
const STATIC_RENDER_FN = '__vue_staticRenderFns__';
const EXPORT = 'export default {';
// trim some unused code
function trim(code) {
    return code.replace(/\/\/\n/g, '').trim();
}
function getSfcStylePath(filePath, ext, index) {
    const number = index !== 0 ? `-${index + 1}` : '';
    return common_1.replaceExt(filePath, `-sfc${number}.${ext}`);
}
// inject render fn to script
function injectRender(script, render) {
    script = trim(script);
    render = render
        .replace('var render', `var ${RENDER_FN}`)
        .replace('var staticRenderFns', `var ${STATIC_RENDER_FN}`);
    return script.replace(EXPORT, `${render}\n${EXPORT}\n  render: ${RENDER_FN},\n\n  staticRenderFns: ${STATIC_RENDER_FN},\n`);
}
function injectStyle(script, styles, filePath) {
    if (styles.length) {
        const imports = styles
            .map((style, index) => {
            const { base } = path_1.parse(getSfcStylePath(filePath, 'css', index));
            return `import './${base}';`;
        })
            .join('\n');
        return script.replace(EXPORT, `${imports}\n\n${EXPORT}`);
    }
    return script;
}
function compileTemplate(template) {
    const result = compileUtils.compileTemplate({
        compiler,
        source: template,
        isProduction: true,
    });
    return result.code;
}
function parseSfc(filePath) {
    const source = fs_extra_1.readFileSync(filePath, 'utf-8');
    const descriptor = compileUtils.parse({
        source,
        compiler,
        needMap: false,
    });
    return descriptor;
}
exports.parseSfc = parseSfc;
async function compileSfc(filePath, options = {}) {
    const tasks = [fs_extra_1.remove(filePath)];
    const jsFilePath = common_1.replaceExt(filePath, '.js');
    const descriptor = parseSfc(filePath);
    const { template, styles } = descriptor;
    // compile js part
    if (descriptor.script) {
        tasks.push(new Promise((resolve, reject) => {
            let script = descriptor.script.content;
            script = injectStyle(script, styles, filePath);
            if (template) {
                const render = compileTemplate(template.content);
                script = injectRender(script, render);
            }
            fs_extra_1.writeFileSync(jsFilePath, script);
            compile_js_1.compileJs(jsFilePath)
                .then(resolve)
                .catch(reject);
        }));
    }
    // compile style part
    if (!options.skipStyle) {
        tasks.push(...styles.map((style, index) => {
            const cssFilePath = getSfcStylePath(filePath, style.lang || 'css', index);
            fs_extra_1.writeFileSync(cssFilePath, trim(style.content));
            return compile_style_1.compileStyle(cssFilePath);
        }));
    }
    return Promise.all(tasks);
}
exports.compileSfc = compileSfc;
