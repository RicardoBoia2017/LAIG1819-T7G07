#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform float texScale;

void main() {
	vec4 color = texture2D(uSampler, vTextureCoord/texScale);
	gl_FragColor = color;
}
