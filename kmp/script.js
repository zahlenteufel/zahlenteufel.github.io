// To make sure the draw button is disabled if the pattern is invalid.
function patternChanged() {
    let pattern = document.getElementById("pattern").value;
    document.getElementById("drawButton").disabled =
        pattern === "" || pattern.indexOf(" ") >= 0;
}

function drawCircle(ctx, x, y, radius) {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fill();
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
    ctx.fillStyle = "black";
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

const correctingAngle = Math.PI / 8; // To make the arrow head look better.

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
    drawArrowHead(ctx, intersectionX, intersectionY,  startAngle - Math.PI / 2 + correctingAngle);
    ctx.restore();
}

function intersectionEllipseCircle(
    y, circleX, circleRadius, ellipseX, ellipseHRadius, ellipseVRadius) {
    
    // Do bisection on the ellipse circumference and testing inside/outside circle.
    let outerAng = Math.PI / 2;
    let innerAng = Math.PI;
    let midAng;
    while (innerAng - outerAng > 0.01) {
        midAng = (innerAng + outerAng) / 2;
        let px = ellipseX + ellipseHRadius * Math.cos(midAng);
        if (Math.hypot(px - circleX, ellipseVRadius * Math.sin(midAng)) < circleRadius) {
            innerAng = midAng;
        } else {
            outerAng = midAng;
        }
    }
    return {"x": ellipseX + ellipseHRadius * Math.cos(midAng),
            "y": y + ellipseVRadius * Math.sin(midAng)};
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
        maxSlot = maxSlotBelow;
        for (let i = targetI; i <= sourceI; i++) {
            slotsBelow[i] = maxSlotBelow + 1;
        }
    }
    ctx.beginPath();
    let extra = 40 * (maxSlot + 1);
    let sourceX = stepx * sourceI + stepx / 2;
    let targetX = stepx * targetI + stepx / 2;
    
    ctx.ellipse(
        (sourceX + targetX) / 2,
        py,
        (sourceX - targetX) / 2,
        40 + extra,
        0,
        0,
        Math.PI,
        useSlotsAbove);
    ctx.stroke();
    var intPoint = intersectionEllipseCircle(
        py,
        targetX,
        40,
        (sourceX + targetX) / 2,
        (sourceX - targetX) / 2,
        40 + extra);
    let ang = invertedIf(useSlotsAbove, Math.atan2(intPoint["y"] - py, intPoint["x"] - targetX));
    drawArrowHead(ctx, targetX + 40 * Math.cos(ang), py + 40 * Math.sin(ang),
       ang + Math.PI + invertedIf(!useSlotsAbove, correctingAngle / 1.5));
}

function invertedIf(condition, value) {
    return condition ? -value : value;
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
    let f = buildFailureFunction(pattern);
    for (let i = 1; i <= pattern.length; i++) {
        drawBackArrow(ctx, i, f[i], stepx, py, slotsAbove, slotsBelow);
    }
    drawInitialSelfLoop(ctx, stepx, py);
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
}

// Code taken from http://community.topcoder.com/tc?module=Static&d1=tutorials&d2=stringSearching
// Pay attention! 
// The prefix under index i in the table above is 
// is the string from pattern[0] to pattern[i - 1] 
// inclusive, so the last character of the string under 
// index i is pattern[i - 1].

function buildFailureFunction(pattern) {
  let m = pattern.length;
  let f = [0, 0];
  
  for(let i = 2; i <= m; i++) {
    // j is the index of the largest next partial match 
    // (the largest suffix/prefix) of the string under  
    // index i - 1.
    let j = f[i - 1];
    for( ; ; ) {
      // Check to see if the last character of string i - 
      // - pattern[i - 1] "expands" the current "candidate"
      // best partial match - the prefix under index j.
      if (pattern[j] == pattern[i - 1]) { 
        f[i] = j + 1;
        break; 
      }
      // If we cannot "expand" even the empty string.
      if (j == 0) {
          f[i] = 0;
          break;
      }
      // Else go to the next best "candidate" partial match.
      j = f[j];
    }
  }
  return f;
}

addLoadEvent(drawKMP);