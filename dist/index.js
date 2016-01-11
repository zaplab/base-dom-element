'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.create = create;
exports.replace = replace;
exports.remove = remove;
exports.destroy = destroy;
exports.prepend = prepend;
exports.append = append;
exports.before = before;
exports.after = after;
exports.addEvent = addEvent;
exports.addEvents = addEvents;
exports.removeEvent = removeEvent;
exports.fireEvent = fireEvent;
exports.getSupportedVendorProperty = getSupportedVendorProperty;
exports.getSize = getSize;
exports.getPosition = getPosition;
exports.getScroll = getScroll;
exports.setStyles = setStyles;
exports.getStyle = getStyle;
exports.setVendorStyle = setVendorStyle;

var _zapBaseDomData = require('zap-base-dom-data');

var _zapBaseJsNumber = require('zap-base-js-number');

var _zapBaseJsString = require('zap-base-js-string');

/**
 * @type {Element}
 */
const document = window.document;

/**
 * @type {Number}
 */
let uniqueID = 0;

/**
 * @type {Object}
 */
const specialEvents = {
    transitionstart: {
        '': 'transitionstart',
        'webkit': 'webkitTransitionStart',
        'Moz': 'transitionstart',
        'ms': 'MSTransitionStart',
        'O': 'otransitionstart'
    },
    transitionend: {
        '': 'transitionend',
        'webkit': 'webkitTransitionEnd',
        'Moz': 'transitionend',
        'ms': 'MSTransitionEnd',
        'O': 'otransitionend'
    },
    animationstart: {
        '': 'animationstart',
        'webkit': 'webkitAnimationStart',
        'Moz': 'animationstart',
        'ms': 'MSAnimationStart',
        'O': 'oanimationstart'
    },
    animationend: {
        '': 'animationend',
        'webkit': 'webkitAnimationEnd',
        'Moz': 'animationend',
        'ms': 'MSAnimationEnd',
        'O': 'oanimationend'
    },
    animationiteration: {
        '': 'animationiteration',
        'webkit': 'webkitIteration',
        'Moz': 'animationiteration',
        'ms': 'MSAnimationIteration',
        'O': 'oanimationiteration'
    }
};

/**
 * @param {Element} element
 * @returns {Number|undefined}
 */
function _uniqueID(element) {
    return element.zapBaseUID || (element.zapBaseUID = uniqueID++);
}

/**
 * @param {String} tagName
 * @param {Object} [options]
 * @returns {Element}
 */
function create(tagName, options) {
    const element = document.createElement(tagName);

    _uniqueID(element);

    if (typeof options !== 'undefined') {
        if (typeof options.text !== 'undefined') {
            element.textContent = options.text;
        }

        if (typeof options.id !== 'undefined') {
            element.setAttribute('id', options.id);
        }

        if (typeof options.classes !== 'undefined') {
            element.className = options.classes.join(' ');
        }

        if (typeof options.attributes !== 'undefined') {
            for (const attribute in options.attributes) {
                if (options.attributes.hasOwnProperty(attribute)) {
                    element.setAttribute(attribute, options.attributes[attribute]);
                }
            }
        }

        if (typeof options.styles !== 'undefined') {
            setStyles(element, options.styles);
        }

        if (typeof options.events !== 'undefined') {
            addEvents(element, options.events);
        }
    }

    return element;
}

/**
 * @param {Element} element
 * @param {Element} target
 * @returns void
 */
function replace(element, target) {
    target.parentNode.replaceChild(element, target);
}

/**
 * @param {Element} element
 * @returns void
 */
function remove(element) {
    const parent = element.parentNode;

    if (parent) {
        parent.removeChild(element);
    }
}

/**
 * @param {Element} element
 * @returns void
 */
function destroy(element) {
    removeEvent(element);
    (0, _zapBaseDomData.clear)(element, 'zapEvents');

    const children = element.children;

    for (let i = children.length - 1; i >= 0; --i) {
        destroy(children[i]);
    }

    remove(element);
}

/**
 * @param {Element} element
 * @param {Element} target
 * @returns void
 */
function prepend(element, target) {
    target.insertBefore(element, target.firstChild);
}

/**
 * @param {Element} element
 * @param {Element} target
 * @returns void
 */
function append(element, target) {
    target.appendChild(element);
}

/**
 * @param {Element} element
 * @param {Element} target
 * @returns void
 */
function before(element, target) {
    const parent = target.parentNode;

    if (parent) {
        parent.insertBefore(element, target);
    }
}

/**
 * @param {Element} element
 * @param {Element} target
 * @returns void
 */
function after(element, target) {
    const parent = target.parentNode;

    if (parent) {
        parent.insertBefore(element, target.nextSibling);
    }
}

/**
 * @access static
 * @param {Element} element
 * @param {String} eventName
 * @param {Function} eventFunction
 * @returns void
 */
function addEvent(element, eventName, eventFunction) {
    _uniqueID(element);

    let events = (0, _zapBaseDomData.retrieve)(element, 'zapEvents');

    if (!events) {
        events = {};
        (0, _zapBaseDomData.store)(element, 'zapEvents', events);
    }

    if (typeof specialEvents[eventName] !== 'undefined') {
        const vendor = getSupportedVendorProperty(specialEvents[eventName]);

        if (vendor !== false) {
            eventName = specialEvents[eventName][vendor]; // eslint-disable-line no-param-reassign
        }
    }

    if (!events[eventName]) {
        events[eventName] = [];
    }

    if (events[eventName].indexOf(eventFunction) !== -1) {
        return;
    }

    events[eventName].push(eventFunction);

    element.addEventListener(eventName, eventFunction, false);
}

/**
 * @param {Element} element
 * @param {Object} events
 * @returns void
 */
function addEvents(element, events) {
    for (const event in events) {
        if (events.hasOwnProperty(event)) {
            addEvent(element, event, events[event]);
        }
    }
}

/**
 * @param {Element} element
 * @param {String} [eventName]
 * @param {Function} [eventFunction]
 * @returns void
 */
function removeEvent(element, eventName, eventFunction) {
    let events = (0, _zapBaseDomData.retrieve)(element, 'zapEvents');

    if (!events) {
        events = {};
        (0, _zapBaseDomData.store)(element, 'zapEvents', events);
    }

    if (eventName) {
        if (typeof specialEvents[eventName] !== 'undefined') {
            const vendor = getSupportedVendorProperty(specialEvents[eventName]);

            if (vendor !== false) {
                eventName = specialEvents[eventName][vendor]; // eslint-disable-line no-param-reassign
            }
        }

        if (events[eventName]) {
            if (eventFunction) {
                const i = events[eventName].indexOf(eventFunction);

                if (i !== -1) {
                    element.removeEventListener(eventName, eventFunction, false);
                    events[eventName].splice(i, 1);
                }
            } else {
                const eventsLength = events[eventName].length;

                for (let i = 0; i < eventsLength; ++i) {
                    element.removeEventListener(eventName, events[eventName][i], false);
                }

                delete events[eventName];
            }
        }
    } else {
        for (const i in events) {
            if (events.hasOwnProperty(i)) {
                const eventsLength = events[i].length;

                for (let j = 0; j < eventsLength; ++j) {
                    element.removeEventListener(i, events[i][j], false);
                }

                delete events[i];
            }
        }
    }
}

/**
 * TODO: real events?
 * @param {Element} element
 * @param {String} eventName
 * @param {*} [args]
 */
function fireEvent(element, eventName, args) {
    let events = (0, _zapBaseDomData.retrieve)(element, 'zapEvents');

    if (!events) {
        events = {};
        (0, _zapBaseDomData.store)(element, 'zapEvents', events);
    }

    if (typeof specialEvents[eventName] !== 'undefined') {
        const vendor = getSupportedVendorProperty(specialEvents[eventName]);

        if (vendor !== false) {
            eventName = specialEvents[eventName][vendor]; // eslint-disable-line no-param-reassign
        }
    }

    if (!events || !events[eventName]) {
        return;
    }

    const eventsLength = events[eventName].length;

    for (let i = 0; i < eventsLength; ++i) {
        events[eventName][i](args);
    }
}

const dummyStyle = document.createElement('div').style;

/**
 * example: zapBaseElement.getSupportedVendorProperty('transform'); -> webkitTransform
 * @param {String} property
 * @returns {Boolean|String}
 */
function getSupportedVendorProperty(property) {
    const vendors = ['', 'webkit', 'Moz', 'ms', 'O'];
    const vendorsLength = vendors.length;

    for (let i = 0; i < vendorsLength; ++i) {
        const finalPropertyName = i ? vendors[i] + (0, _zapBaseJsString.capitalizeFirstLetter)(property) : property;

        if (finalPropertyName in dummyStyle) {
            return finalPropertyName;
        }
    }

    return false;
}

/**
 * @param {Element} element
 * @returns {{x: Number, y: Number}}
 */
function getSize(element) {
    const doc = document;
    const win = window;
    let size;

    if (element === doc || element === win || element === doc.documentElement || element === doc.body) {
        const html = doc.documentElement;

        size = {
            x: html.clientWidth,
            y: html.clientHeight
        };
    } else {
        size = {
            x: element.offsetWidth,
            y: element.offsetHeight
        };
    }

    return size;
}

/**
 * @param {Element} element
 * @param {Object} [options]
 * @returns {Object}
 */
function getPosition(element, options) {
    const getBoundingClientRect = element.getBoundingClientRect();
    let relativePositions;
    let relativeToElement = false;
    let ignoreBorder = false;
    let addBodyScroll = true;
    let xPosition = (0, _zapBaseJsNumber.parseInt)(getBoundingClientRect.left);
    let yPosition = (0, _zapBaseJsNumber.parseInt)(getBoundingClientRect.top);

    if (typeof options !== 'undefined') {
        if (typeof options.ignoreBorder !== 'undefined') {
            ignoreBorder = options.ignoreBorder;
        }

        if (typeof options.relativeTo !== 'undefined') {
            relativeToElement = options.relativeTo;
        }

        if (typeof options.ignoreBodyScroll !== 'undefined') {
            addBodyScroll = !options.ignoreBodyScroll;
        }
    }

    if (addBodyScroll) {
        const bodyScroll = getScroll(document.body);
        xPosition += bodyScroll.x;
        yPosition += bodyScroll.y;
    }

    if (relativeToElement) {
        relativePositions = getPosition(relativeToElement);
        xPosition -= relativePositions.x;
        yPosition -= relativePositions.y;
    }

    if (ignoreBorder) {
        xPosition += getStyle(element, 'borderLeftWidth', true);
        yPosition += getStyle(element, 'borderTopWidth', true);
    }

    return {
        x: xPosition,
        y: yPosition
    };
}

/**
 * @param {Element} element
 * @returns {{x: Number, y: Number}}
 */
function getScroll(element) {
    const doc = document;
    const win = window;
    const body = document.body;
    const scroll = {
        x: 0,
        y: 0
    };

    if (element === doc || element === win || element === doc.documentElement || element === body) {
        scroll.x = win.pageXOffset || body.scrollLeft;
        scroll.y = win.pageYOffset || body.scrollTop;
    } else {
        scroll.x = element.scrollLeft;
        scroll.y = element.scrollTop;
    }

    return scroll;
}

/**
 * @param {Element} element
 * @param {Object} styles
 * @param {Boolean} [checkForVendorStyles]
 * @returns void
 */
function setStyles(element, styles) {
    let checkForVendorStyles = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    let finalPropertyName;

    for (const property in styles) {
        if (styles.hasOwnProperty(property)) {
            finalPropertyName = checkForVendorStyles ? getSupportedVendorProperty(property) : property;

            if (!checkForVendorStyles || finalPropertyName) {
                element.style[finalPropertyName] = styles[property];
            }
        }
    }
}

// TODO: if only one parameter, return the getComputedStyle object?? or another extra function for getComputedStyle
/**
 * @param {Element} element
 * @param {String} property
 * @param {Boolean} [parseIntVal]
 * @returns {String|Number}
 */
function getStyle(element, property) {
    let parseIntVal = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

    const value = element.style[property] || window.getComputedStyle(element, null)[property];

    return parseIntVal ? (0, _zapBaseJsNumber.parseInt)(value) : value;
}

/**
 * @param {Element} element
 * @param {String} property
 * @param {String|Number|null} value
 * @returns void
 */
function setVendorStyle(element, property, value) {
    const uppercaseProperty = (0, _zapBaseJsString.capitalizeFirstLetter)(property);

    if (value === null) {
        element.style.removeProperty((0, _zapBaseJsString.dasherize)('-webkit' + uppercaseProperty));
        element.style.removeProperty((0, _zapBaseJsString.dasherize)('-moz' + uppercaseProperty));
        element.style.removeProperty((0, _zapBaseJsString.dasherize)('-ms' + uppercaseProperty));
        element.style.removeProperty((0, _zapBaseJsString.dasherize)(property));
    } else {
        element.style['webkit' + uppercaseProperty] = value;
        element.style['moz' + uppercaseProperty] = value;
        element.style['ms' + uppercaseProperty] = value;
        element.style[property] = value;
    }
}