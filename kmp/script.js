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
    drawArrowHead(ctx, x2, y2, Math.atan2(y2 - y1, x2 - x1));
}

function drawArrowHead(ctx, x, y, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);

    let arrowHeadLong = 16;
    let arrowHeadThickness = 10;
    ctx.beginPath();
    ctx.moveTo(-arrowHeadLong, -arrowHeadThickness / 2);
    ctx.lineTo(0, 0);
    ctx.lineTo(-arrowHeadLong, arrowHeadThickness / 2);
    ctx.fill();

    ctx.restore();
}

function drawInitialSelfLoop(ctx, stepx, py) {
    ctx.save();
    ctx.translate(stepx / 2, py);

    let loopRadius = 20;
    let nodeRadius = 40;
    let dx = 35;
    let d = Math.SQRT2 * dx;
    ctx.beginPath();
    // Use law of cosines to get the angle.
    let angle = Math.acos(
        (loopRadius * loopRadius + d * d - nodeRadius * nodeRadius)
         / 2 / loopRadius / d);
    let startAngle = angle + Math.PI / 4;
    let endAngle = 2 * Math.PI - angle + Math.PI / 4;
    ctx.arc(-dx, -dx, loopRadius, startAngle, endAngle);
    ctx.stroke();
    let intersectionX = -dx + Math.cos(startAngle) * loopRadius;
    let intersectionY = -dx + Math.sin(startAngle) * loopRadius;
    let correctingAngle = Math.PI / 8; // To make the arrow head look better.
    drawArrowHead(ctx, intersectionX, intersectionY,  startAngle - Math.PI / 2 + correctingAngle);
    ctx.restore();
}

function drawBackArrow(ctx, sourceI, targetI, stepx, py, slotsAbove, slotsBelow) {
    let maxSlotAbove = Math.max(...slotsAbove.slice(targetI, sourceI));
    let maxSlotBelow = Math.max(...slotsBelow.slice(targetI, sourceI));
    let useSlotsAbove = maxSlotAbove <= maxSlotBelow;
    let maxSlot;

    if (useSlotsAbove) {
        maxSlot = maxSlotAbove;
        for (let i = targetI; i <= sourceI; i++) {
            slotsAbove[i] = maxSlotAbove + 1;
        }
    } else {
        maxSlot = maxSlotBelow
        for (let i = targetI; i <= sourceI; i++) {
            slotsBelow[i] = maxSlotBelow + 1;
        }
    }
    ctx.beginPath();
    let extra = 30 * (maxSlot + 1);
    let sourceX = stepx * sourceI + stepx / 2;
    let targetX = stepx * targetI + stepx / 2;
    if (useSlotsAbove) {
        ctx.moveTo(sourceX, py - 40);
        ctx.lineTo(sourceX, py - (40 + extra));
        ctx.lineTo(targetX, py - (40 + extra));
        ctx.stroke();
        drawArrow(ctx, targetX, py - (40 + extra), targetX, py - 40);
    } else {
        ctx.moveTo(sourceX, py + 40);
        ctx.lineTo(sourceX, py + (40 + extra));
        ctx.lineTo(targetX, py + (40 + extra));
        ctx.stroke();
        drawArrow(ctx, targetX, py + (40 + extra), targetX, py + 40);
    }
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

    let slotsAbove = [];
    let slotsBelow = [];
    for (let i = 0; i <= pattern.length; i++) {
        slotsAbove.push(0);
        slotsBelow.push(0);
    }
    let stepx = width / (pattern.length + 1);
    let py = height / 2;
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

    drawBackArrow(ctx, 1, 0, stepx, py, slotsAbove, slotsBelow);
    drawBackArrow(ctx, 2, 0, stepx, py, slotsAbove, slotsBelow);
    drawBackArrow(ctx, 3, 1, stepx, py, slotsAbove, slotsBelow);
    drawBackArrow(ctx, 4, 0, stepx, py, slotsAbove, slotsBelow);
    drawInitialSelfLoop(ctx, stepx, py);
}

addLoadEvent(drawKMP);