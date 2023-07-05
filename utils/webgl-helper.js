

function randomColor() {
    return {
        r: Math.random() * 255,
        g: Math.random() * 255,
        b: Math.random() * 255,
        a: Math.random() * 1
    };
}

/**
 * dom查询
 * @param {string} str
 * @return Element
 */
function $$(str) {
    if (!str) return null;
    if (str.startsWith('#')) {
        return document.querySelector(str);
    }
    let result = document.querySelectorAll(str);
    if (result.length == 1) {
        return result[0];
    }
    return result;
}

/**
 * 获取canvas实例
 * @param {string} id
 */
function getCanvas(id) {
    return $$(id);
}

/**
 * 根据canvas获取webgl实例
 * @param {Element} canvas
 * @return WebGLRenderingContext
 */
function getContext(canvas) {
    // 做浏览器兼容处理，加上实验前缀
    return canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
}

/**
 * 重置canvas画布宽高
 * @param {Element} canvas
 * @param {number} width
 * @param {number} height
 */
function resizeCanvas(canvas, width, height) {
    if (canvas.width !== width) {
        canvas.width = width ? width : window.innerWidth;
    }
    if (canvas.height !== height) {
        canvas.height = height ? height : window.innerHeight;
    }
}


/**
 * 创建着色器源码
 * @param {WebGLRenderingContext} gl  webgl实例
 * @param {GLenum} type 着色器类型
 * @param {string} source
 */
function createShader(gl, type, source) {
    let shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    //检测是否编译正常。
    let success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}

/**
 * 根据script标签创建着色器源码
 * @param {WebGLRenderingContextBase} gl
 * @param {*} type
 * @param {string} scriptId
 */
function createShaderFromScript(gl, type, scriptId) {
    let sourceScript = $$('#' + scriptId);
    if (!sourceScript) {
        return null;
    }
    return createShader(gl, type, sourceScript.innerHTML);
}


/**
 * 创建着色器程序
 * @param {WebGLRenderingContext} gl
 * @param {WebGLShader} vertexShader
 * @param {WebGLShader} fragmentShader
 */
function createSimpleProgram(gl, vertexShader, fragmentShader) {
    if (!vertexShader || !fragmentShader) {
        console.warn('着色器不能为空');
        return;
    }
    let program = gl.createProgram();
    // 绑定着色器对象
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    // 链接着色器程序
    gl.linkProgram(program);
    // 查看链接状态
    let success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }
    console.error(gl.getProgramInfoLog(program));
    // 删除程序
    gl.deleteProgram(program);
}