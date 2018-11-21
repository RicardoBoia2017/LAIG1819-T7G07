
attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec2 vTextureCoord;
uniform sampler2D uSampler2;

uniform float normScale;

void main() {
	vec3 offset=vec3(0.0,0.0,0.0);
	float offset2 = 0.0;
	vTextureCoord = aTextureCoord;

	float r = texture2D(uSampler2, vTextureCoord).r;
	float g = texture2D(uSampler2, vTextureCoord).g;
	float b = texture2D(uSampler2, vTextureCoord).b;
	float average = (r+g+b)/3.0;
	offset2=average*normScale*0.1;
	gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition.x,aVertexPosition.y+offset2, aVertexPosition.z,1.0);
}

