function updateTranslation() {
    let translatedChunks = translate($("#phrase").value);
    $("#replicated").innerHTML = "";
    $("#result").innerText = "";
    for (let translatedChunk of translatedChunks) {
        let originChunk = createChunk(translatedChunk.chunk);
        let targetChunk = createChunk(translatedChunk.result);
        $("#replicated").appendChild(originChunk);
        $("#result").appendChild(targetChunk);
        explain(translatedChunk, originChunk, targetChunk);
    }
    drawOtherChunks();
}

function explain(translatedChunk, originChunk, targetChunk) {
    originChunk.onmouseover = targetChunk.onmouseover =
        function (_) {
            clearHighlights();
            $("#explanation").innerHTML = "";
            let item = document.createElement("li");
            item.innerText = translatedChunk.explanation;
            $("#explanation").appendChild(item);
            for (let other of translatedChunk.otherRules) {
                let item = document.createElement("li");
                item.innerText = other;
                item.classList.add("overruled");
                $("#explanation").appendChild(item);
            }
            originChunk.classList.add("highlight");
            targetChunk.classList.add("highlight");
        };
}

function createChunk(label) {
    let chunk = document.createElement("span");
    chunk.innerText = label;
    return chunk;
}

function clearHighlights() {
    $("#result").childNodes.forEach(node => node.classList.remove("highlight"));
    $("#replicated").childNodes.forEach(node => node.classList.remove("highlight"));
}

function centerOfChunk(i) {
    let rect = $("#replicated").childNodes[i].getBoundingClientRect();
    return rect.x + rect.width / 2;
}

function createAnotherChunkCenteredAtX(label, centerX) {
    let otherChunk = createChunk(label);
    otherChunk.style.position = "absolute";
    $("#more-chunks").appendChild(otherChunk);
    let x = centerX - otherChunk.clientWidth / 2;
    otherChunk.style.left = `${x}px`;
}

function drawOtherChunks() {
    for (var i = 0; i < $("#replicated").childNodes.length; i++) {
        createAnotherChunkCenteredAtX(i, centerOfChunk(i));
    }
}

addLoadEvent(updateTranslation);
