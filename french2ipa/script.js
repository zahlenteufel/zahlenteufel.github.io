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
    let explanation = "<add explanation hre>";
    for (let i = 0; i < s.length; i++) {
        console.log(i, s[i], i < s.length - 1, handle2Letters(s[i], s[i+1]) );
        if (i < s.length - 1 && handle2Letters(s[i], s[i+1])) {
            console.log(`handle ${i}`);
            result += translate2Letters(s[i], s[i+1]);
            i++;
            continue; 
        }
        result += translateLetter(s[i]);
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

translate2Letters = (a, b) => twoLettersTrad[twoLetters.indexOf(`${a}${b}`)];

function translateLetter(c) {
    if (constant.indexOf(c) != -1)
        return c;
    if (c in others)
        return others[c];
    return "?";
}
