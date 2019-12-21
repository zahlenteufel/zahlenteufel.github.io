function updateTranslation() {
    console.log('updateTranslation');
    document.getElementById("result").innerText = translation(
        document.getElementById("phrase").value);
}

function translation(s) {
    return s.toUpperCase();
}

addLoadEvent(function () {
    updateTranslation();
});