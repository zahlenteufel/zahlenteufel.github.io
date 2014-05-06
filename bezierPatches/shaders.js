var shaderProgram;
function getShader(gl, id) {
	var shaderScript = document.getElementById(id);
	if (!shaderScript) {
		return null;
	}

	var str = "";
	var k = shaderScript.firstChild;
	while (k) {
		if (k.nodeType == 3) {
			str += k.textContent;
		}
		k = k.nextSibling;
	}

	var shader;
	if (shaderScript.type == "x-shader/x-fragment") {
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (shaderScript.type == "x-shader/x-vertex") {
		shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
		return null;
	}

	gl.shaderSource(shader, str);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(gl.getShaderInfoLog(shader));
		return null;
	}

	return shader;
}


function initShaders() {
	var fragmentShader = getShader(gl, "shader-fs");
	var vertexShader = getShader(gl, "shader-vs");

	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);

	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
		alert(gl.getProgramInfoLog(shaderProgram));
		return;
	}
	
	gl.useProgram(shaderProgram);

	shaderProgram.cameraMatrixUniform = gl.getUniformLocation(shaderProgram, "cameraMatrix");
	shaderProgram.perspectiveMatrixUniform = gl.getUniformLocation(shaderProgram, "perspectiveMatrix");
	shaderProgram.lightPositionUniform = gl.getUniformLocation(shaderProgram, "lightPosition");
	shaderProgram.lightColorUniform = gl.getUniformLocation(shaderProgram, "lightColor");
	shaderProgram.ambientLightColorUniform = gl.getUniformLocation(shaderProgram, "ambientLightColor");
	shaderProgram.drawNormalsUniform = gl.getUniformLocation(shaderProgram, "drawNormals");
	shaderProgram.ambientShadingUniform = gl.getUniformLocation(shaderProgram, "ambientShading");
	shaderProgram.diffuseShadingUniform = gl.getUniformLocation(shaderProgram, "diffuseShading");
	shaderProgram.specularShadingUniform = gl.getUniformLocation(shaderProgram, "specularShading");

	shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertexPosition");
	shaderProgram.vertexNormalAttribute = gl.getAttribLocation(shaderProgram, "vertexNormal");
	shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "vertexColor");
		
	shaderProgram.glossinessAttribute = gl.getAttribLocation(shaderProgram, "glossiness");
	

	gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);
	gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
	gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);	
	gl.enableVertexAttribArray(shaderProgram.glossinessAttribute);
}
