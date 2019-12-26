function updateTranslation() {
    let xx = translation(document.getElementById("phrase").value);
    document.getElementById("result").innerText = xx.result;
    document.getElementById("explanation").innerText = xx.explanation;
}

addLoadEvent(function () {
    updateTranslation();
});

function translation(s) {
    s = s.toLowerCase();
    let result = "";
    let explanation = "";
    for (let i = 0; i < s.length; i++) {
        if (i < s.length - 1 && handle2Letters(s[i], s[i+1])) {
            let handledChunk = translate2Letters(s[i], s[i+1]); 
            result += handledChunk.result;
            explanation += "\n" + handledChunk.explanation;
            i++;
            continue; 
        }
        let handledChunk = translateLetter(s[i]);
        result += handledChunk.result;
        explanation += "\n" + handledChunk.explanation;
    }
    return {"result": result, "explanation": explanation};
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

function translate2Letters(a, b) {
    let letters = `${a}${b}`;
    let result = twoLettersTrad[twoLetters.indexOf(letters)];
    return {"result": result, "explanation": `${letters} 🡢 ${result}`};
}
    

function translateLetter(c) {
    if (constant.indexOf(c) != -1)
        return {result: c, explanation: `${c} 🡢 ${c}`};
    if (c in others)
        return {result: others[c], explanation: `${c} 🡢 ${others[c]}`};
    return {result: "?", explanation: "<unhandled case>"};
}
