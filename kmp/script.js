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

function drawLine(ctx, x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function drawArrow(ctx, x1, y1, x2, y2) {
    drawLine(ctx, x1, y1, x2, y2);
    // Draw arrow head.
    ctx.save();
    ctx.translate(x2, y2);
    ctx.rotate(Math.atan2(y2 - y1, x2 - x2));

    let arrowHeadLong = 16;
    let arrowHeadThickness = 10; 
    ctx.beginPath();
    ctx.moveTo(-arrowHeadLong, -arrowHeadThickness / 2);
    ctx.lineTo(0, 0);
    ctx.lineTo(-arrowHeadLong, arrowHeadThickness / 2);
    ctx.fill();

    ctx.restore();
}

function drawBackArrow(ctx, sourceI, targetI, stepx, py, slots) {
    console.log(slots);
    let maxSlot = 0;
    for (let i = targetI; i <= sourceI; i++) {
        maxSlot = Math.max(slots[i], maxSlot);
    }
    for (let i = targetI; i <= sourceI; i++) {
        slots[i] = maxSlot + 1;
    }
    ctx.beginPath();
    let extra = 30 * (maxSlot + 1);
    let sourceX = stepx * sourceI + stepx / 2;
    let targetX = stepx * targetI + stepx / 2;
    ctx.moveTo(sourceX, py - 40);
    ctx.lineTo(sourceX, py - (40 + extra));
    ctx.lineTo(targetX, py - (40 + extra));
    ctx.stroke();
    drawArrow(ctx, targetX, py - (40 + extra), targetX, py - 40); 
}

function drawKMP() {
    let pattern = document.getElementById("pattern").value;
    let canvas = document.getElementById("canvas");
    let ctx = canvas.getContext("2d");
    ctx.font = "25px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    let height = canvas.height;
    let width = canvas.width;

    ctx.clearRect(0, 0, width, height);

    let slots = [];
    for (let i = 0; i <= pattern.length; i++) {
        slots.push(0);
    }
    let stepx = width / (pattern.length + 1);
    let py = 2 * height / 3;
    for (let i = 0; i <= pattern.length; i++) {
        let px = stepx * i + stepx / 2;
        drawCircle(ctx, px, py, 40);
        if (i == pattern.length) {
            drawCircle(ctx, px, py, 36);
        }
        drawArrow(ctx,
            px - stepx + ((i == 0) ? 90 : 40),
            py,
            px - 40,
            py);
        ctx.fillText("*" + pattern.substring(0, i), px, py);
    }

    drawBackArrow(ctx, 1, 0, stepx, py, slots);
    drawBackArrow(ctx, 2, 0, stepx, py, slots);
    drawBackArrow(ctx, 3, 1, stepx, py, slots);
    drawBackArrow(ctx, 4, 0, stepx, py, slots);
}

addLoadEvent(drawKMP);