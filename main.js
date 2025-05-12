const canvas = document.getElementById("glcanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const gl = canvas.getContext("webgl");

const vertexShaderSource = `
attribute vec2 a_position;
varying vec2 v_uv;

void main() {
  v_uv = a_position * 1.5;
  gl_Position = vec4(a_position, 0, 1);
}
`;

async function loadFragmentShader(url) {
	const res = await fetch(url);
	return res.text();
}

function compileShader(gl, source, type) {
	const shader = gl.createShader(type);
	gl.shaderSource(shader, source);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		console.error(
			"Shader compile failed with: " + gl.getShaderInfoLog(shader),
		);
		gl.deleteShader(shader);
		return null;
	}
	return shader;
}

function createProgram(gl, vsSource, fsSource) {
	const program = gl.createProgram();
	const vShader = compileShader(gl, vsSource, gl.VERTEX_SHADER);
	const fShader = compileShader(gl, fsSource, gl.FRAGMENT_SHADER);
	gl.attachShader(program, vShader);
	gl.attachShader(program, fShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error(
			"Program failed to link: " + gl.getProgramInfoLog(program),
		);
		return null;
	}
	return program;
}

loadFragmentShader("fragment.frag").then((fragmentShaderSource) => {
	const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
	gl.useProgram(program);

	const positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	gl.bufferData(
		gl.ARRAY_BUFFER,
		new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
		gl.STATIC_DRAW,
	);

	const positionLocation = gl.getAttribLocation(program, "a_position");
	gl.enableVertexAttribArray(positionLocation);
	gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

	gl.viewport(0, 0, canvas.width, canvas.height);
	gl.drawArrays(gl.TRIANGLES, 0, 6);
});
