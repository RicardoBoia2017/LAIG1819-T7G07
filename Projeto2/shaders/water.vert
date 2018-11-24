
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;
uniform sampler2D heightMap;

uniform float time;
uniform float normScale;
uniform float texScale;

void main() {
	float offset = 0.0;
	vTextureCoord = aTextureCoord;

	offset = texture2D(heightMap, vTextureCoord * texScale + time).r * normScale * 0.1;

	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition.x, aVertexPosition.y  + offset, aVertexPosition.z,1.0);
}

