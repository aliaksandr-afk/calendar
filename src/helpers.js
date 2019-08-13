// function createElement(tag, props, ...children) {
//     const element = document.createElement(tag);

//     Object.keys(props).forEach(key => {
//         if (key.startsWith('data-')) {
//             element.setAttribute(key, props[key]);
//         } else {
//             element[key] = props[key];
//         }
//     });

//     children.forEach(child => {
//         if (typeof child === 'string') {
//             child = document.createTextNode(child);
//         }

//         element.appendChild(child);
//     });

//     return element;
// }

function createElement(tag, props, ...children) {
    const element = document.createElement(tag);

    if (props) {
        Object.entries(props).forEach(([key, value]) => {
            if (key.startsWith('on') && typeof value === 'function') {
                element.addEventListener(key.substring(2), value);
            } else if (key.startsWith('data-')) {
                element.setAttribute(key, value);
            } else {
                element[key] = value;
            }
        });
    }
    
    children.forEach(child => {
        if (Array.isArray(child)) {
            return element.append(...child);
        }

        if (typeof child === 'string' || typeof child === 'number') {
            child = document.createTextNode(child);
        }
        
        if (child instanceof Node) {
            element.appendChild(child);
        }
    });

    return element;
}

class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(type, listener) {
        this.events[type] = this.events[type] || [];
        this.events[type].push(listener);
    }

    emit(type, arg) {
        if (this.events[type]) {
            this.events[type].forEach(listener => listener(arg));
        }
    }
}

function save(data) {
    const string = JSON.stringify(data);

    localStorage.setItem('todos', string);
}

function load() {
    const string = localStorage.getItem('todos');
    const data = JSON.parse(string);

    return data;
}

export { createElement, EventEmitter, save, load };