
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
    setStyles as zapElementSetStyles,
    getStyle as zapElementGetStyle,
    getSize as zapElementGetSize,
    getPosition as zapElementGetPosition,
    getScroll as zapElementGetScroll,
    setVendorStyle,
    getSupportedVendorProperty,
} from 'zap-base-dom-element';

describe('zap-base-dom-element', () => {
    describe('getSize', () => {
        const DOMElement = document.createElement('div');
        DOMElement.style.position = 'absolute';
        DOMElement.style.width = '100px';
        DOMElement.style.height = '100px';
        document.body.appendChild(DOMElement);

        it('element should have a size of 100x100 px', () => {
            const size = zapElementGetSize(DOMElement);

            expect(size).toEqual({
                x: 100,
                y: 100,
            });
            zapElementDestroy(DOMElement);
        });
    });

    describe('getPosition', () => {
        const DOMElement = zapElementCreate('div', {
            styles: {
                position: 'absolute',
                top: '100px',
                left: '100px',
                width: '100px',
                height: '100px',
            },
        });
        document.body.appendChild(DOMElement);

        it('element should be at position x:100 y:100', () => {
            const position = zapElementGetPosition(DOMElement);

            expect(position).toEqual({
                x: 100,
                y: 100,
            });
            zapElementDestroy(DOMElement);
        });
    });

    describe('setStyles', () => {
        const DOMElement = document.createElement('div');
        zapElementSetStyles(DOMElement, {
            position: 'absolute',
            top: '10px',
            left: '10px',
            transform: 'translateX(100px)',
        });
        document.body.appendChild(DOMElement);

        it('should return set styles', () => {
            expect(DOMElement.style.position).toBe('absolute');
            expect(DOMElement.style.top).toBe('10px');
            expect(DOMElement.style.left).toBe('10px');
            expect(DOMElement.style.transform).toBe('translateX(100px)');
            zapElementDestroy(DOMElement);
        });
    });

    describe('getStyle', () => {
        const DOMElement = document.createElement('div');
        DOMElement.style.position = 'absolute';
        DOMElement.style.width = '100px';
        DOMElement.style.height = '100px';
        document.body.appendChild(DOMElement);

        it('should return position style', () => {
            const stylePosition = zapElementGetStyle(DOMElement, 'position');

            expect(stylePosition).toEqual('absolute');
            zapElementDestroy(DOMElement);
        });
    });

    describe('setVendorStyle', () => {
        const DOMElement = document.createElement('div');

        it('test with transform', () => {
            setVendorStyle(DOMElement, 'transform', 'translateX(100px)');

            expect(zapElementGetStyle(DOMElement, 'transform')).toEqual('translateX(100px)');
        });
    });

    describe('getSupportedVendorProperty', () => {
        it('test with transform', () => {
            const property = getSupportedVendorProperty('transform');

            expect(property).not.toBe(false);
        });
    });
});
