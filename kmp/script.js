// To make sure the draw button is disabled if the pattern is invalid.
function patternChanged() {
    let pattern = document.getElementById("pattern").value;
    document.getElementById("drawButton").disabled = 
        pattern === "" || pattern.indexOf(" ") >= 0;
}

function drawCircle(ctx, x, y, radius) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.stroke();
}

function drawKMP() {
    let pattern = document.getElementById("pattern").value;
    console.log("draw kmp for " + pattern);

    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    ctx.font = "25px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    let height = canvas.height;
    let width = canvas.width;

    ctx.clearRect(0, 0, width, height);

    let stepx = width / (pattern.length + 1);
    for (let i = 0; i <= pattern.length; i++) {
        let px = stepx * i + stepx / 2;
        let py = height / 2;
        drawCircle(ctx, px, py, 40);
        if (i == pattern.length) {
            drawCircle(ctx, px, py, 44);
        }
        ctx.fillText("*" + pattern.substring(0, i), px, py);
    }
}

addLoadEvent(drawKMP);