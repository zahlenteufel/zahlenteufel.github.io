function Luz(lightPos) {
	var vertices = [];
	
	vertices.push(lightPos[0] - 0.1, lightPos[1], lightPos[2],
				  lightPos[0] + 0.1, lightPos[1], lightPos[2],
				  lightPos[0], lightPos[1] - 0.1, lightPos[2],
				  lightPos[0], lightPos[1] + 0.1, lightPos[2],
				  lightPos[0], lightPos[1], lightPos[2] - 0.1,
				  lightPos[0], lightPos[1], lightPos[2] + 0.1);

	
	this.vertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);        
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	this.vertexPositionBuffer.itemSize = 3;
	this.vertexPositionBuffer.numItems = 6;
	this.draw = function() {
		gl.uniform1i(shaderProgram.drawNormalsUniform, 1);
		gl.disableVertexAttribArray(shaderProgram.vertexNormalAttribute);
		gl.disableVertexAttribArray(shaderProgram.vertexColorAttribute);
		gl.disableVertexAttribArray(shaderProgram.glossinessAttribute);
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
		
		gl.drawArrays(gl.LINES, 0, 6);
		
		gl.uniform1i(shaderProgram.drawNormalsUniform, 0);
		gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
		gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
		gl.enableVertexAttribArray(shaderProgram.glossinessAttribute);
	};
}

function aMano(){
	var vertices = [], normals = [], ambientColors = [], vertexColors = [];
	vertices.push(0.0, 0.0, 0.0);
	normals.push(0.0, 0.0, 0.0);
	
	vertices.push(0.5, 0.5, -1);
	normals.push(0.0, 0.0, 0.0);
	
	vertices.push(-0.5, -0.5, 0.0);
	normals.push(0.0, 0.0, 0.0);
	
	vertexColors.push(1.0, 1.0, 1.0, 1.0);
	vertexColors.push(0.0, 0.0, 1.0, 1.0);
	vertexColors.push(1.0, 0.0, 0.0, 1.0);

	return new object3d(gl.POINTS, vertices, normals, vertexColors, 1);
}

function teapot(subdivisiones, ambientColor, vertexColor, glossiness) {
	this.children = [];
	var ustep = 1 / subdivisiones;
	var vstep = 1 / subdivisiones;
	var patches = teapotBezierPatches();
	for (var p in patches) {
		var patch = patches[p];
		if (true) {
		for (var u=0;u<1;u+=ustep) {
			var vertices = [], normals = [], vertexColors = [];
				for (var v=0;v<1;v+=vstep) {
					var vertex = patch.evaluate(u,v);
					var normal = patch.evaluateNormal(u,v);
					vertices.push(vertex[0], vertex[1], vertex[2]);
					normals.push(normal[0], normal[1], normal[2]);
					vertexColors = vertexColors.concat(vertexColor);
					
					vertex = patch.evaluate(u,v+vstep);
					normal = patch.evaluateNormal(u,v+vstep);
					vertices.push(vertex[0], vertex[1], vertex[2]);
					normals.push(normal[0], normal[1], normal[2]);
					vertexColors = vertexColors.concat(vertexColor);
				
					vertex = patch.evaluate(u+ustep,v);
					normal = patch.evaluateNormal(u+ustep,v);
					vertices.push(vertex[0], vertex[1], vertex[2]);
					normals.push(normal[0], normal[1], normal[2]);
					vertexColors = vertexColors.concat(vertexColor);
					
					vertex = patch.evaluate(u+ustep,v+vstep);
					normal = patch.evaluateNormal(u+ustep,v+vstep);
					vertices.push(vertex[0], vertex[1], vertex[2]);
					normals.push(normal[0], normal[1], normal[2]);
					vertexColors = vertexColors.concat(vertexColor);
				}
			this.children.push(new object3d(gl.TRIANGLE_STRIP, vertices, normals, vertexColors, glossiness));
		}
		}
	}
	this.draw = function () {
		for (var c in this.children) {
			this.children[c].draw();
		}
	};
}

function cylinder(x0, y0, z0, N, H, R1, R2, color1, color2, glossiness, orientation) {
	var vertices = [], normals = [], ambientColors = [], vertexColors = [];
	var phi = Math.atan2(H, R2 - R1), ny = orientation * Math.cos(phi), nx = orientation * Math.sin(phi);
	
	for (var i = 0; i <= N; i++) {
		var theta = i * 2 * Math.PI / N;
		
		vertices.push(x0 + Math.cos(theta) * R2, y0, z0 + Math.sin(theta) * R2);
		normals.push(Math.cos(theta) * nx, ny,  Math.sin(theta) * nx);
		vertexColors = vertexColors.concat(color2);

		vertices.push(x0 + Math.cos(theta) * R1, y0 + H, z0 + Math.sin(theta) * R1);
		normals.push(Math.cos(theta) * nx, ny, Math.sin(theta)  * nx);
		vertexColors = vertexColors.concat(color1);
	}
	return new object3d(gl.TRIANGLE_STRIP, vertices, normals, vertexColors, glossiness);
}

function rep(arr, veces) {
	var res = [];
	while (veces--) {
		res = res.concat(arr);
	}
	return res;
}

function mult(scalar, arr) {
	var a = arr.concat([]); // ARRAY CLONE
	for (var i=0;i<a.length;i++) {
		a[i] *= scalar;
	}
	return a;
}

function plane(x1, z1, x2, z2, color, glossiness) {
	var vertices = [x1, 0, z1, 
	                x2, 0, z1,
	                x1, 0, z2,
	                x2, 0, z2];
	var normals =  [0, 1, 0,
	                0, 1, 0,
	                0, 1, 0,
	                0, 1, 0];
	var vertexColors = rep(color, 4);
	return new object3d(gl.TRIANGLE_STRIP, vertices, normals, vertexColors, glossiness);                     
}

function object3d(primitive, vertices, normals, vertexColors, glossiness) {
	this.N = vertices.length / 3;
	this.vertexPositionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);        
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
	this.vertexPositionBuffer.itemSize = 3;
	this.vertexPositionBuffer.numItems = this.N;
	
	this.vertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);        
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
	this.vertexNormalBuffer.itemSize = 3;
	this.vertexNormalBuffer.numItems = this.N;
	
	this.vertexColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);        
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);
	this.vertexColorBuffer.itemSize = 3;
	this.vertexColorBuffer.numItems = this.N;
	
	var glossinessArray = rep([glossiness], this.N);
	this.glossinessBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.glossinessBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(glossinessArray), gl.STATIC_DRAW);
	this.glossinessBuffer.itemSize = 1;
	this.glossinessBuffer.numItems= this.N;

	this.normalArrowsBuffer = gl.createBuffer();
	var normalArrows = [];
	for (var i=0;i<this.N;i++) {
		normalArrows.push(vertices[3*i]);
		normalArrows.push(vertices[3*i+1]);
		normalArrows.push(vertices[3*i+2]);
		normalArrows.push(vertices[3*i]   + 0.1 * normals[3*i]);
		normalArrows.push(vertices[3*i+1] + 0.1 * normals[3*i+1]);
		normalArrows.push(vertices[3*i+2] + 0.1 * normals[3*i+2]);
	}
	gl.bindBuffer(gl.ARRAY_BUFFER, this.normalArrowsBuffer);        
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normalArrows), gl.STATIC_DRAW);
	this.normalArrowsBuffer.itemSize = 3;
	this.normalArrowsBuffer.numItems = 2 * this.N;
	
	this.primitive = primitive;
	this.draw = drawObject;
}

function drawObject() {
		if (gid("mostrarNormales").checked) {
			gl.uniform1i(shaderProgram.drawNormalsUniform, 1);
			
			gl.disableVertexAttribArray(shaderProgram.vertexNormalAttribute);
			gl.disableVertexAttribArray(shaderProgram.vertexColorAttribute);
			gl.disableVertexAttribArray(shaderProgram.glossinessAttribute);
			
			gl.bindBuffer(gl.ARRAY_BUFFER, this.normalArrowsBuffer);
			gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
			
			gl.drawArrays(gl.LINES, 0, this.normalArrowsBuffer.numItems);
			
			gl.uniform1i(shaderProgram.drawNormalsUniform, 0);
			gl.enableVertexAttribArray(shaderProgram.vertexNormalAttribute);
			gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);
			gl.enableVertexAttribArray(shaderProgram.glossinessAttribute);
		}
		
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexPositionBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
	
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexNormalBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
	
		gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
		gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, this.vertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);
	
		gl.bindBuffer(gl.ARRAY_BUFFER, this.glossinessBuffer);
		gl.vertexAttribPointer(shaderProgram.glossinessAttribute, this.glossinessBuffer.itemSize, gl.FLOAT, false, 0, 0);	
		
		gl.drawArrays(this.primitive, 0, this.N);
}
