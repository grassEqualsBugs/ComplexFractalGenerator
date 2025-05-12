precision mediump float;
varying vec2 v_uv;

void main() {
	vec3 color = vec3(v_uv, 0.0);
	gl_FragColor = vec4(color, 1.0);
}
