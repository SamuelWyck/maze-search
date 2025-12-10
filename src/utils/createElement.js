function createElement(element, id=null, ...classes) {
    const ele = document.createElement(element);

    if (id) {
        ele.id = id;
    }

    for (let classStr of classes) {
        ele.classList.add(classStr);
    }

    return ele;
};



module.exports = createElement;