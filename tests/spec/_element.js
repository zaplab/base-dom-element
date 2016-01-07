
import {
    create as zapElementCreate,
    replace as zapElementReplace,
    remove as zapElementRemove,
    destroy as zapElementDestroy,
    prepend as zapElementPrepend,
    append as zapElementAppend,
    before as zapElementBefore,
    after as zapElementAfter,
    addEvent as zapElementAddEvent,
    addEvents as zapElementAddEvents,
    removeEvent as zapElementRemoveEvent,
    fireEvent as zapElementFireEvent,
} from 'zap-base-dom-element';

describe('zap-base-dom-element', () => {
    describe('element create', () => {
        const innerFunctionSpy = jasmine.createSpy('createInnerFunctionSpy');
        const callbackFunc = (event) => {
            innerFunctionSpy(event.target);
        };
        const DOMElement = zapElementCreate('button', {
            text: 'create',
            id: 'create',
            classes: [
                'class1',
                'class2',
            ],
            attributes: {
                type: 'cancel',
                name: 'create',
            },
            styles: {
                position: 'absolute',
                top: '10px',
                left: '10px',
            },
            events: {
                click: callbackFunc,
            },
        });

        it('should have text', () => {
            expect(DOMElement.textContent).toBe('create');
        });

        it('should have id', () => {
            expect(DOMElement.id).toBe('create');
        });

        it('should have classes', () => {
            expect(DOMElement.className).toBe('class1 class2');
        });

        it('should have attributes', () => {
            expect(DOMElement.getAttribute('type')).toBe('cancel');
            expect(DOMElement.getAttribute('name')).toBe('create');
        });

        it('should have styles', () => {
            expect(DOMElement.style.position).toBe('absolute');
            expect(DOMElement.style.top).toBe('10px');
            expect(DOMElement.style.left).toBe('10px');
        });

        it('should have events', () => {
            DOMElement.click();
            expect(innerFunctionSpy).toHaveBeenCalledWith(DOMElement);
        });
    });

    describe('element remove', () => {
        const innerFunctionSpy = jasmine.createSpy('removeFunctionSpy');
        const callbackFunc = (event) => {
            innerFunctionSpy(event.target);
        };
        const DOMElement = zapElementCreate('button', {
            id: 'removeElement',
            events: {
                click: callbackFunc,
            },
        });
        document.body.appendChild(DOMElement);

        it('element should be found', () => {
            DOMElement.click();
            expect(document.getElementById('removeElement')).toBe(DOMElement);
            expect(innerFunctionSpy).toHaveBeenCalledWith(DOMElement);
            innerFunctionSpy.calls.reset();
        });

        it('element removed from DOM', () => {
            zapElementRemove(DOMElement);
            expect(document.getElementById('removeElement')).toBeNull();
        });

        it('element events should still exist', () => {
            DOMElement.click();
            expect(innerFunctionSpy).toHaveBeenCalled();
        });
    });

    describe('element destroy', () => {
        const innerFunctionSpy = jasmine.createSpy('destroyFunctionSpy');
        const callbackFunc = (event) => {
            innerFunctionSpy(event.target);
        };
        const DOMElement = zapElementCreate('button', {
            id: 'destroyElement',
            events: {
                click: callbackFunc,
            },
        });
        document.body.appendChild(DOMElement);

        it('element should be found', () => {
            DOMElement.click();
            expect(document.getElementById('destroyElement')).toBe(DOMElement);
            expect(innerFunctionSpy).toHaveBeenCalledWith(DOMElement);
            innerFunctionSpy.calls.reset();
        });

        it('element removed from DOM', () => {
            zapElementDestroy(DOMElement);
            expect(document.getElementById('destroyElement')).toBeNull();
        });

        it('element events should be removed', () => {
            DOMElement.click();
            expect(innerFunctionSpy).not.toHaveBeenCalled();
        });
    });

    describe('element reposition', () => {
        const DOMElement = zapElementCreate('div', {
            id: 'outerElement',
        });
        const ulElement = zapElementCreate('ul', {
            id: 'ulElement',
        });
        const childElement1 = zapElementCreate('li', {
            id: 'childElement1',
        });
        const childElement2 = zapElementCreate('li', {
            id: 'childElement2',
        });
        const childElement3 = zapElementCreate('li', {
            id: 'childElement3',
        });
        const replacementElement = zapElementCreate('span', {
            id: 'replacementElement',
        });
        DOMElement.appendChild(ulElement);
        ulElement.appendChild(childElement1);
        ulElement.appendChild(childElement2);
        ulElement.appendChild(childElement3);
        document.body.appendChild(DOMElement);

        it('list should be in the initial order', () => {
            expect(DOMElement.innerHTML).toBe('<ul id="ulElement"><li id="childElement1"></li><li id="childElement2"></li><li id="childElement3"></li></ul>');
        });

        describe('zapElementBefore', () => {
            it('childElement3 should be 1st', () => {
                zapElementBefore(childElement3, childElement1);
                expect(DOMElement.innerHTML).toBe('<ul id="ulElement"><li id="childElement3"></li><li id="childElement1"></li><li id="childElement2"></li></ul>');
            });
        });

        describe('zapElementAfter', () => {
            it('childElement3 should be 2nd', () => {
                zapElementAfter(childElement3, childElement1);
                expect(DOMElement.innerHTML).toBe('<ul id="ulElement"><li id="childElement1"></li><li id="childElement3"></li><li id="childElement2"></li></ul>');
            });
        });

        describe('zapElementAppend', () => {
            it('childElement3 should be inside of childElement1', () => {
                zapElementAppend(childElement3, childElement1);
                expect(DOMElement.innerHTML).toBe('<ul id="ulElement"><li id="childElement1"><li id="childElement3"></li></li><li id="childElement2"></li></ul>');
            });
        });

        describe('zapElementPrepend', () => {
            it('childElement2 should be inside of childElement1 before childElement3', () => {
                zapElementPrepend(childElement2, childElement1);
                expect(DOMElement.innerHTML).toBe('<ul id="ulElement"><li id="childElement1"><li id="childElement2"></li><li id="childElement3"></li></li></ul>');
            });
        });

        describe('zapElementReplace', () => {
            it('list should be replaced with another element', () => {
                zapElementReplace(replacementElement, ulElement);
                expect(DOMElement.innerHTML).toBe('<span id="replacementElement"></span>');
                zapElementDestroy(DOMElement);
            });
        });
    });
});
