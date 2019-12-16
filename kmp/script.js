// To make sure the draw button is disabled if the pattern is invalid.
function patternChanged() {
    let pattern = document.getElementById("pattern").value;
    document.getElementById("drawButton").disabled =
        pattern === "" || pattern.indexOf(" ") >= 0;
}

var canvas;
var ctx;
var height;
var width;
var nodeY;

function drawNode(x, radius, label, isFinal) {
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(x, nodeY, radius, 0, 2 * Math.PI);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x, nodeY, radius, 0, 2 * Math.PI);
    ctx.stroke();
    if (isFinal) {
        ctx.beginPath();
        ctx.arc(x, nodeY, radius - 4, 0, 2 * Math.PI);
        ctx.stroke();
    }
    ctx.fillStyle = "black";
    ctx.fillText(label, x, nodeY);
}

function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function drawArrow(x1, y1, x2, y2) {
    drawLine(x1, y1, x2, y2);
    drawArrowHead(x2, y2, Math.atan2(y2 - y1, x2 - x1));
}

function drawArrowHead(x, y, angle) {
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

// To make the arrow head look better.
// TODO: Get rid of this.
const correctingAngle = Math.PI / 8; 

function nodeX(i, n) {
    let stepx = width / (n + 1); 
    return i * stepx + stepx / 2 + 10;
}

function drawSelfLoop(i, n) {
    ctx.save();
    ctx.translate(nodeX(i, n), nodeY);

    let loopRadius = 20;
    let nodeRadius = 40;
    let dx = 35;
    let d = Math.SQRT2 * dx;
    ctx.beginPath();
    // Use the Law of Cosines to get the angle.
    let angle = Math.acos(
        (loopRadius * loopRadius + d * d - nodeRadius * nodeRadius)
         / 2 / loopRadius / d);
    let startAngle = angle + Math.PI / 4;
    let endAngle = 2 * Math.PI - angle + Math.PI / 4;
    ctx.arc(-dx, -dx, loopRadius, startAngle, endAngle);
    ctx.stroke();
    let intersectionX = -dx + Math.cos(startAngle) * loopRadius;
    let intersectionY = -dx + Math.sin(startAngle) * loopRadius;
    drawArrowHead(
        intersectionX,
        intersectionY, startAngle - Math.PI / 2 + correctingAngle);
    ctx.restore();
}

function intersectionEllipseCircle(
    circleX, circleRadius, ellipseX, ellipseHRadius, ellipseVRadius) {
    
    // Do bisection on the ellipse circumference and testing inside/outside circle.
    let outerAng = Math.PI / 2;
    let innerAng = Math.PI;
    let midAng;
    let midAngX
    let midAngY;
    while (innerAng - outerAng > 0.01) {
        midAng = (innerAng + outerAng) / 2;
        midAngX = ellipseX + ellipseHRadius * Math.cos(midAng);
        midAngY = ellipseVRadius * Math.sin(midAng);
        if (Math.hypot(midAngX - circleX, midAngY) < circleRadius) {
            innerAng = midAng;
        } else {
            outerAng = midAng;
        }
    }
    return {x: midAngX, y: nodeY + midAngY};
}

// slotsAbove/Below[i] == slots above/below in the space between [i] and [i+1]

function drawBackArrow(sourceI, targetI, n, slotsAbove, slotsBelow) {
    if (sourceI == targetI) {
        drawSelfLoop(sourceI, n);
        return;
    }
    let maxSlotAbove = Math.max(...slotsAbove.slice(targetI, sourceI + 1));
    let maxSlotBelow = Math.max(...slotsBelow.slice(targetI, sourceI + 1));
    let useSlotsAbove = maxSlotAbove <= maxSlotBelow;
    let maxSlot;

    if (useSlotsAbove) {
        maxSlot = maxSlotAbove;
        for (let i = targetI; i < sourceI; i++) {
            slotsAbove[i] = maxSlotAbove + 1;
        }
    } else {
        maxSlot = maxSlotBelow;
        for (let i = targetI; i < sourceI; i++) {
            slotsBelow[i] = maxSlotBelow + 1;
        }
    }
    ctx.beginPath();
    let extra = 40 * (maxSlot + 1);
    let sourceX = nodeX(sourceI, n);
    let targetX = nodeX(targetI, n);
    
    ctx.ellipse(
        (sourceX + targetX) / 2,
        nodeY,
        (sourceX - targetX) / 2,
        40 + extra,
        0,
        0,
        Math.PI,
        useSlotsAbove);
    ctx.stroke();
    var intPoint = intersectionEllipseCircle(
        targetX,
        40,
        (sourceX + targetX) / 2,
        (sourceX - targetX) / 2,
        40 + extra);
    let ang = invertedIf(useSlotsAbove, 
        Math.atan2(intPoint.y - nodeY, intPoint.x - targetX));
    drawArrowHead(
        targetX + 40 * Math.cos(ang),
        nodeY + 40 * Math.sin(ang),
        ang + Math.PI + invertedIf(!useSlotsAbove, correctingAngle));
}

function invertedIf(condition, value) {
    return condition ? -value : value;
}

function drawKMP() {
    let pattern = document.getElementById("pattern").value;
    ctx.clearRect(0, 0, width, height);

    let slotsAbove = Array(pattern.length - 1).fill(0);
    let slotsBelow = Array(pattern.length - 1).fill(0);
    let stepx = width / (pattern.length + 1);
    let f = buildFailureFunction(pattern);
    for (let i = 0; i <= pattern.length; i++) {
        drawBackArrow(i, f[i], pattern.length, slotsAbove, slotsBelow);
    }
    for (let i = 0; i <= pattern.length; i++) {
        let px = nodeX(i, pattern.length);
        drawNode(px, 40, "*" + pattern.substring(0, i), i == pattern.length);
        drawArrow(px - stepx + 40, nodeY, px - 40, nodeY);
        // TODO: include it inside drawArrow.
        if (i < pattern.length) {
            ctx.fillText(pattern[i], px + stepx / 2, nodeY - 20);
        }
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

addLoadEvent(function () {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    ctx.font = "italic 20px Times New Roman";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    height = canvas.height;
    width = canvas.width; 
    nodeY = height / 2;  
    drawKMP();
});