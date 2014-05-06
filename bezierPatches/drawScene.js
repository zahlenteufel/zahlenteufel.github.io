var plane1, outsideCylinder, insideCylinder, teapot1;

function drawScene() {
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	var cameraMatrix = createCameraMatrix();
	gl.uniformMatrix4fv(shaderProgram.cameraMatrixUniform, false, cameraMatrix);

	var perspectiveMatrix = mat4.create();
	mat4.identity(perspectiveMatrix);
	mat4.perspective(45, 1, .1, 1, perspectiveMatrix);
	gl.uniformMatrix4fv(shaderProgram.perspectiveMatrixUniform, false, perspectiveMatrix);
	
	var lightPos = parseLightPosition();
	gl.uniform3fv(shaderProgram.lightPositionUniform, lightPos);
	gl.uniform3fv(shaderProgram.lightColorUniform, parseColor("colorDif"));
	gl.uniform3fv(shaderProgram.ambientLightColorUniform, parseColor("colorAmb"));
	
	gl.uniform1f(shaderProgram.ambientShadingUniform, gid("ambientShadingCheckBox").checked ? 1.0 : 0.0);
	gl.uniform1f(shaderProgram.diffuseShadingUniform, gid("diffuseShadingCheckBox").checked ? 1.0 : 0.0);
	gl.uniform1f(shaderProgram.specularShadingUniform, gid("specularShadingCheckBox").checked ? 1.0 : 0.0);

	if (!plane1) {
		plane1 = plane(-1, -1, 1, 1, [0.8, 0.1, 0.1], 1);
		outsideCylinder = cylinder(1, 0.5, 0.5, 64, 1, 0.6, 0.6, [0, 0.6, 0.8], [0.8, 0.6, 0.1], 1, 1);
		insideCylinder = cylinder(1, 0.5, 0.5, 64, 1, 0.58, 0.58, [0, 0.6, 0.8], [0.8, 0.6, 0.1], 1, -1);
		teapot1 = new teapot(20, [0.8, 0.6, 0.1], [0.8, 0.6, 0.1], 1);
	}
	//plane1.draw();
	teapot1.draw();
	
	var luz = new Luz(lightPos);
	luz.draw();
}


