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
            $("#explanation").innerText = translatedChunk.explanation;
            originChunk.classList.add("highlight");
            targetChunk.classList.add("highlight");
        };
}

function clearHighlights() {
    $("#result").childNodes.forEach(node => node.classList.remove("highlight"));
    $("#replicated").childNodes.forEach(node => node.classList.remove("highlight"));
}

addLoadEvent(updateTranslation);

function translate(s) {
    s = s.toLowerCase();
    let translatedChunks = [];
    for (let i = 0; i < s.length; i++) {
        let translatedChunk;
        if (i < s.length - 1 && handle2Letters(s[i], s[i + 1])) {
            translatedChunk = translateChunk2Letters(s[i] + s[i + 1]);
            i++;
        } else {
            translatedChunk = translateChunk1Letter(s[i]);
        }
        translatedChunks.push(translatedChunk);
    }
    return translatedChunks;
}

const constant = "abdfiklmnop ";
const others = {
    "j": "ʒ",
    "e": "ə",
    "c": "k",
    "'": "",
    ".": "",
}

// Order matters.
const twoLetters = ["au", "je", "e ", "e.", "ll"];
const twoLettersTrad = ["o", "ʒə", " ", " ", "l"];

handle2Letters = (a, b) => twoLetters.indexOf(`${a}${b}`) != -1;

function translateChunk2Letters(letters) {
    let result = twoLettersTrad[twoLetters.indexOf(letters)];
    return { "result": result, "explanation": `${letters} 🡢 ${result}`, chunk: letters };
}

function translateChunk1Letter(c) {
    if (constant.indexOf(c) != -1)
        return { result: c, explanation: `${c} 🡢 ${c}`, chunk: c };
    if (c in others)
        return { result: others[c], explanation: `${c} 🡢 ${others[c]}`, chunk: c };
    return { result: "?", explanation: "<unhandled case>", chunk: c };
}
