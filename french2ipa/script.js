function updateTranslation() {
    let translatedChunks = translate($("#phrase").value);
    $("#replicated").innerHTML = "";
    $("#result").innerText = "";
    for (let translatedChunk of translatedChunks) {
        let originChunk = document.createElement("span");
        originChunk.innerText = translatedChunk.chunk;
        $("#replicated").appendChild(originChunk);
        let targetChunk = document.createElement("span");
        targetChunk.innerText = translatedChunk.result;
        $("#result").appendChild(targetChunk);
        explain(translatedChunk, originChunk, targetChunk);
    }
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

function clearHighlights() {
    $("#result").childNodes.forEach(node => node.classList.remove("highlight"));
    $("#replicated").childNodes.forEach(node => node.classList.remove("highlight"));
}

addLoadEvent(updateTranslation);
