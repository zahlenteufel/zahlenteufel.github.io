
function B(i,j,u) {
	if (j==3) {
		if (i == 0)
			return (1-u)*(1-u)*(1-u);
		else if (i == 1)
			return 3*u*(1-u)*(1-u);
		else if (i == 2)
			return 3*u*u*(1-u);
		else if (i == 3)
			return u*u*u;
	}
}

function normalize(v) {
	var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
	return [v[0] / length, v[1] / length, v[2] / length];
}

function Bprima(i,j,u) {
	if (j==3) {
		if (i == 0)
			return -3*(1-u)*(1-u);
		else if (i == 1)
			return 3*(1-u)*(1-u)-6*u*(1-u);
		else if (i == 2)
			return 6*u*(1-u)-3*u*u;
		else if (i == 3)
			return 3*u*u;
	}
}

function BezierPatch(controlPoints) {
	this.p = controlPoints.concat([]);
	this.evaluate = evaluateBiquadraticBezier;
	this.evaluateNormal = evaluateBiquadraticBezierNormal;
}

function mul(v, s) {
	return [v[0] * s, v[1] * s, v[2] * s];
}

function add(v1, v2) {
	v1[0] = v1[0] + v2[0];
	v1[1] = v1[1] + v2[1];
	v1[2] = v1[2] + v2[2];
}

function cross(a, b) {
	return [a[1]*b[2] - a[2]*b[1], a[2]*b[0] - a[0]*b[2], a[0]*b[1] - a[1]*b[0]];
}

function evaluateBiquadraticBezier(u,v) {
	var res = [0, 0, 0];
	for (var i=0;i<4;i++)
		for (var j=0;j<4;j++) {
			add(res, mul(this.p[i][j], B(i,3,u) * B(j,3,v)));
		}
	return res;
}

function evaluateBiquadraticBezierNormal(u,v) {
	var d1 = [0, 0, 0], d2 = [0, 0, 0];
	for (var i=0;i<4;i++)
		for (var j=0;j<4;j++) {
			add(d1, mul(this.p[i][j], Bprima(i,3,u) * B(j,3,v)));
			add(d2, mul(this.p[i][j], B(i,3,u) * Bprima(j,3,v)));
		}
	return normalize(cross(d1,d2));
}
