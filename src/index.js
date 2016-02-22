
import {
    store as zapDataStore,
    retrieve as zapDataRetrieve,
    clear as zapDataClear,
} from 'zap-base-dom-data';

import {
    parseInt as zapBaseParseInt,
} from 'zap-base-js-number';

import {
    capitalizeFirstLetter as zapStringCapitalizeFirstLetter,
    dasherize as zapStringDasherize,
} from 'zap-base-js-string';

/**
 * @type {Element}
 */
const document = window.document;

/**
 * @type {CSSStyleDeclaration}
 */
const dummyStyle = document.createElement('div').style;

/**
 * @type {Number}
 */
let uniqueID = 0;

/**
 * @type {Object}
 */
const specialEvents = {
    transitionend: {
        'supportCheck': 'transition',
        '': 'transitionend',
        'webkit': 'webkitTransitionEnd',
        'Moz': 'transitionend',
        'ms': 'MSTransitionEnd',
        'O': 'otransitionend',
    },
    animationstart: {
        'supportCheck': 'animation',
        '': 'animationstart',
        'webkit': 'webkitAnimationStart',
        'Moz': 'animationstart',
        'ms': 'MSAnimationStart',
        'O': 'oanimationstart',
    },
    animationend: {
        'supportCheck': 'animation',
        '': 'animationend',
        'webkit': 'webkitAnimationEnd',
        'Moz': 'animationend',
        'ms': 'MSAnimationEnd',
        'O': 'oanimationend',
    },
    animationiteration: {
        'supportCheck': 'animation',
        '': 'animationiteration',
        'webkit': 'webkitIteration',
        'Moz': 'animationiteration',
        'ms': 'MSAnimationIteration',
        'O': 'oanimationiteration',
    },
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
export function create(tagName, options) {
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
export function replace(element, target) {
    target.parentNode.replaceChild(element, target);
}

/**
 * @param {Element} element
 * @returns void
 */
export function clear(element) {
    let firstChild;

    while (firstChild = element.firstChild) { // eslint-disable-line no-cond-assign
        element.removeChild(firstChild);
    }
}

/**
 * @param {Element} element
 * @returns void
 */
export function remove(element) {
    const parent = element.parentNode;

    if (parent) {
        parent.removeChild(element);
    }
}

/**
 * @param {Element} element
 * @returns void
 */
export function destroy(element) {
    removeEvent(element);
    zapDataClear(element, 'zapEvents');

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
export function prepend(element, target) {
    target.insertBefore(element, target.firstChild);
}

/**
 * @param {Element} element
 * @param {Element} target
 * @returns void
 */
export function append(element, target) {
    target.appendChild(element);
}

/**
 * @param {Element} element
 * @param {Element} target
 * @returns void
 */
export function before(element, target) {
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
export function after(element, target) {
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
 * @param {Object} [options]
 * @returns void
 */
export function addEvent(element, eventName, eventFunction, options = {
    call: false,
}) {
    _uniqueID(element);

    let events = zapDataRetrieve(element, 'zapEvents');

    if (!events) {
        events = {};
        zapDataStore(element, 'zapEvents', events);
    }

    if (typeof specialEvents[eventName] !== 'undefined') {
        const vendor = getSupportedVendorProperty(specialEvents[eventName].supportCheck, true);

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

    if (options.call) {
        eventFunction();
    }
}

/**
 * @param {Element} element
 * @param {Object} events
 * @returns void
 */
export function addEvents(element, events) {
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
export function removeEvent(element, eventName, eventFunction) {
    let events = zapDataRetrieve(element, 'zapEvents');

    if (!events) {
        events = {};
        zapDataStore(element, 'zapEvents', events);
    }

    if (eventName) {
        if (typeof specialEvents[eventName] !== 'undefined') {
            const vendor = getSupportedVendorProperty(specialEvents[eventName].supportCheck, true);

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
export function fireEvent(element, eventName, args) {
    let events = zapDataRetrieve(element, 'zapEvents');

    if (!events) {
        events = {};
        zapDataStore(element, 'zapEvents', events);
    }

    if (typeof specialEvents[eventName] !== 'undefined') {
        const vendor = getSupportedVendorProperty(specialEvents[eventName].supportCheck, true);

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

/**
 * example: zapBaseElement.getSupportedVendorProperty('transform'); -> webkitTransform
 * @param {String} property
 * @param {Boolean} [getVendor] just get the vendor prefix (like webkit)
 * @returns {Boolean|String}
 */
export function getSupportedVendorProperty(property, getVendor = false) {
    const vendors = ['', 'webkit', 'Moz', 'ms', 'O'];
    const vendorsLength = vendors.length;

    for (let i = 0; i < vendorsLength; ++i) {
        const finalPropertyName = (i ? (vendors[i] + zapStringCapitalizeFirstLetter(property)) : property);

        if (finalPropertyName in dummyStyle) {
            return getVendor ? vendors[i] : finalPropertyName;
        }
    }

    return false;
}

/**
 * @param {Element} element
 * @returns {{x: Number, y: Number}}
 */
export function getSize(element) {
    const doc = document;
    const win = window;
    let size;

    if ((element === doc) || (element === win) || (element === doc.documentElement) || (element === doc.body)) {
        const html = doc.documentElement;

        size = {
            x: html.clientWidth,
            y: html.clientHeight,
        };
    } else {
        size = {
            x: element.offsetWidth,
            y: element.offsetHeight,
        };
    }

    return size;
}

/**
 * @param {Element} element
 * @param {Object} [options]
 * @returns {{x, y}}
 */
export function getPosition(element, options) {
    const getBoundingClientRect = element.getBoundingClientRect();
    let relativePositions;
    let relativeToElement = false;
    let ignoreBorder = false;
    let addBodyScroll = true;
    let xPosition = zapBaseParseInt(getBoundingClientRect.left);
    let yPosition = zapBaseParseInt(getBoundingClientRect.top);

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
        y: yPosition,
    };
}

/**
 * @param {Element} element
 * @returns {{x: Number, y: Number}}
 */
export function getScroll(element) {
    const doc = document;
    const win = window;
    const body = document.body;
    const scroll = {
        x: 0,
        y: 0,
    };

    if ((element === doc) || (element === win) || (element === doc.documentElement) || (element === body)) {
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
export function setStyles(element, styles, checkForVendorStyles = false) {
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
export function getStyle(element, property, parseIntVal = false) {
    const value = element.style[property] || window.getComputedStyle(element, null)[property];

    return (parseIntVal ? zapBaseParseInt(value) : value);
}

/**
 * @param {Element} element
 * @param {String} property
 * @param {String|Number|null} value
 * @returns void
 */
export function setVendorStyle(element, property, value) {
    const uppercaseProperty = zapStringCapitalizeFirstLetter(property);

    if (value === null) {
        element.style.removeProperty(zapStringDasherize('-webkit' + uppercaseProperty));
        element.style.removeProperty(zapStringDasherize('-moz' + uppercaseProperty));
        element.style.removeProperty(zapStringDasherize('-ms' + uppercaseProperty));
        element.style.removeProperty(zapStringDasherize(property));
    } else {
        element.style['webkit' + uppercaseProperty] = value;
        element.style['moz' + uppercaseProperty] = value;
        element.style['ms' + uppercaseProperty] = value;
        element.style[property] = value;
    }
}

/**
 * @var {Boolean}
 */
export const cssTransitionSupported = (function transitionSupported() {
    return getSupportedVendorProperty('transition') !== false;
})();

/**
 * @var {Boolean}
 */
export const cssTransformSupported = (function transformSupported() {
    return getSupportedVendorProperty('transform') !== false;
})();
