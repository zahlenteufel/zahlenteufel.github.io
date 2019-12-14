function preview(url) {
    var preview = document.getElementsByClassName("preview")[0];
    preview.style.backgroundImage = "url(" + url + ")";
}

function populateItems() {
    let itemContainer = document.getElementsByClassName("items")[0];
    for (let item of items) {
        let renderedItem = document.createElement("a");
        if (item.preview) {
            renderedItem.onmouseover = (_) => preview(item.preview);
        }
        renderedItem.href = item.href;
        renderedItem.innerText = item.title;
        if (item.description) {
            let renderedDescription = document.createElement("span");
            renderedDescription.innerText = item.description;
            renderedItem.appendChild(renderedDescription);
        }
        let li = document.createElement("li");
        li.appendChild(renderedItem);
        itemContainer.appendChild(li);
    }
}

var items = [
    {
        "href": "appolonius-cone/index.html",
        "preview": "appolonius-cone/screenshot.png",
        "title": "Appolonius Cone",
        "description": "3D manipulable model in Processing"
    },
    {
        "href": "31/index.html",
        "preview": "31/preview.png",
        "title": "31",
        "description": "Combinatorial Game optimal player using dynamic programming"
    },
    {
        "href": "https://gist.github.com/zahlenteufel/9513461",
        "preview": "lupa/butterfly_with_effect.png",
        "title": "Lupa",
        "description": "Magnifier Glass Effect in MATLAB"
    },
    {
        "href": "https://gist.github.com/zahlenteufel/10236760",
        "title": "Earley Algorithm",
        "description": "CFG Non-deterministic parsing in Python"
    },
    {
        "href": "https://gist.github.com/zahlenteufel/0ea490a1b28b7cc62492",
        "title": "Parzen Window",
        "description": "Experimenting with Parzen Window in MATLAB for Density Estimation"
    },
    {
        "href": "kmp/index.html",
        "title": "KMP Drawer",
        "description": "KMP Automaton Drawer with Graphviz"
    },
    {
        "href": "https://gist.github.com/zahlenteufel/9718295",
        "title": "Transitive Reduction",
        "description": "Transitive Reduction of a Graph in Python"
    },
    {
        "href": "https://github.com/zahlenteufel/LearningFromData/tree/master/Homework%201%20-%20PLA",
        "title": "Perceptron Plotter",
        "description": "Learning From Data Homework - Perceptron Learning Algorithm in MATLAB with plotting of the hyperplanes."
    },
    {
        "href": "https://github.com/zahlenteufel/pytomaton",
        "title": "Pytomaton",
        "description": "Finite State Automaton simulator in Python with determinization/minimization algorithms."
    },
    {
        "href": "bezierPatches/index.htm",
        "title": "3D Scene in WebGL with shaders",
        "preview": "bezierPatches/preview.png",
        "description": "Utah Teapot made with Bezier Patches, featuring normal display and different types of illumination."
    },
    {
        "href": "https://gist.github.com/zahlenteufel/",
        "title": "..."
    }
];

addLoadEvent(populateItems);
