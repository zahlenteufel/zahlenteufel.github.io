class Rule {
    constructor(matcher, substitute, explanation) {
        // Has to say how many it takes, or 0 if not match.
        this.matcher = matcher;
        this.substitute = substitute;
        this.explanation = explanation;
    }
}

function rule(origin, target, explanation) {
    return new Rule(
        (s) => s.startsWith(origin) ? origin.length : 0,
        target,
        explanation ? `${origin} 🡢 ${target}: ${explanation}`
            : `${origin} 🡢 ${target}`);
}

function liaisionRule(letter, nextWord) {
    return new Rule(
        (s) => s.startsWith(letter + " " + nextWord) ? 2 : 0,
        `‿${letter}`,
        `${letter}‿${nextWord}: liaison`
    )
}

const constantRules = "abdfklmnoptvwz ".split('').map(c => rule(c, c));

// Skip character.
const fallbackRule = new Rule((s) => 1, "?", "<unhandled>");

// TODO: put nn/mm rule above this somehow.
const nasalVowels = [
    rule("an", "ɑ̃"),
    rule("am", "ɑ̃"),
    rule("en ", "ɛ̃ "), // overrule the next one.
    rule("en", "ɑ̃"),
    rule("em", "ɑ̃"),
    rule("ean", "ɑ̃"),
    rule("aon", "ɑ̃"),
    rule("in", "ɛ̃"),
    rule("im", "ɛ̃"),
    rule("ain", "ɛ̃"),
    rule("aim", "ɛ̃"),
    rule("ein", "ɛ̃"),
    rule("eim", "ɛ̃"),
    rule("yn", "ɛ̃"),
    rule("un", "œ̃̃"),
    rule("um", "ɛ̃̃"),
    rule("on", "ɔ̃"),
    rule("om", "ɔ̃"),
]

// Order matters, so put longer rules first.
const rules = [
    ...nasalVowels,
    liaisionRule("s", "a"),
    liaisionRule("s", "i"),
    rule("au", "o", "dipthong"),
    rule("je", "ʒə", "not sure.."),
    rule("e ", " ", "e at end of word is silent"),
    rule("e.", "", "e at end of word is silent"),
    rule("et ", "ə "),
    rule("i", "j"),
    rule("il", "j"),
    rule("y", "j"),
    rule("ll", "j"), // have to refine this one.
    rule("ou", "w"),
    rule("oi", "wa"),
    rule("oy", "wa"),
    rule("ou", "w"),
    rule("nn", "n"),
    rule("ng", "ŋ"),
    rule("gn", "ɲ"),
    rule("ga", "ga"),
    rule("go", "go"),
    rule("gu", "g"),
    rule("g", "ʒ"),
    rule("j", "ʒ"),
    rule("eu", "œ"),
    rule("é", "e"),
    rule("e", "ə"),
    rule("ch", "ʃ"),
    rule("c", "k"),
    rule("r", "ʁ"),
    rule("ç", "s"),
    rule("ss", "s"),
    rule("s ", " ", "s at end of word is silent."),
    rule(" s", " s", "s at start of word is s (otherwise z)"),
    rule("s", "z"),
    rule("th", "t"),
    rule("w", "v"),
    rule("f ", "v"),
    rule("u", "y"),
    rule("'", ""),
    rule(".", ""),
    // TODO: ɥ
    ...constantRules,
    fallbackRule,
];

function translate(s) {
    s = s.toLowerCase();
    let translatedChunks = [];
    let i = 0;
    while (i < s.length) {
        let matchingRules = rules.filter(rule => rule.matcher(s.substring(i)) > 0);
        let matchedRule = matchingRules[0];
        let matchedLength = matchedRule.matcher(s.substring(i));
        let translatedChunk = {
            result: matchedRule.substitute,
            chunk: s.substring(i, i + matchedLength),
            explanation: matchedRule.explanation,
            otherRules: matchingRules.slice(1, -1).map(rule => rule.explanation)
        };
        translatedChunks.push(translatedChunk);
        i += matchedLength;
    }
    return translatedChunks;
}
