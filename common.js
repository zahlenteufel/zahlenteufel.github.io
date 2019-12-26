function $(s) {
    console.assert(s.length > 0 && s[0] == "#", "Can't handle that.");
    return document.getElementById(s.substring(1));
}

function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function () {
            if (oldonload) {
                oldonload();
            }
            func();
        }
    }
}
