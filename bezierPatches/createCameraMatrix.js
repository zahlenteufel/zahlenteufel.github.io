function createCameraMatrix(){	
	var cameraMatrix = mat4.create();
	mat4.identity(cameraMatrix);

	mat4.translate(cameraMatrix, [parseFloat(gid("TX").value) / 100, parseFloat(gid("TY").value) / 100, parseFloat(gid("TZ").value) / 100]);
	
	mat4.scale(cameraMatrix, [parseFloat(gid("SX").value) / 100, parseFloat(gid("SY").value) / 100, parseFloat(gid("SZ").value) / 100]);
	
	var rotateX = parseInt(gid("RX").value); 
	mat4.rotate(cameraMatrix, -(rotateX / 180 ) * Math.PI, [1, 0, 0]); //rotamos alrededor del eje x

	var rotateY = parseInt(gid("RY").value); 
	mat4.rotate(cameraMatrix, -(rotateY / 180 ) * Math.PI, [0, 1, 0]); //rotamos alrededor del eje y  

	var rotateZ = parseInt(gid("RZ").value); 
	mat4.rotate(cameraMatrix, -(rotateZ / 180 ) * Math.PI, [0, 0, 1]); //rotamos alrededor del eje z
	
	return cameraMatrix;
}
