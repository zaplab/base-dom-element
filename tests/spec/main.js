
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
    getStyle as zapElementGetStyle,
    getSize as zapElementGetSize,
    getScroll as zapElementGetScroll,
    setVendorStyle,
    getSupportedVendorProperty,
    cssTransitionSupported,
    cssTransformSupported,
} from 'zap-base-dom-element';

describe('zap-base-dom-element', () => {
    describe('zap-base-dom-element should have the following methods:', () => {
        it('create', () => {
            expect(zapElementCreate).toEqual(jasmine.any(Function));
        });

        it('replace', () => {
            expect(zapElementReplace).toEqual(jasmine.any(Function));
        });

        it('remove', () => {
            expect(zapElementRemove).toEqual(jasmine.any(Function));
        });

        it('destroy', () => {
            expect(zapElementDestroy).toEqual(jasmine.any(Function));
        });

        it('prepend', () => {
            expect(zapElementPrepend).toEqual(jasmine.any(Function));
        });

        it('append', () => {
            expect(zapElementAppend).toEqual(jasmine.any(Function));
        });

        it('before', () => {
            expect(zapElementBefore).toEqual(jasmine.any(Function));
        });

        it('after', () => {
            expect(zapElementAfter).toEqual(jasmine.any(Function));
        });

        it('addEvent', () => {
            expect(zapElementAddEvent).toEqual(jasmine.any(Function));
        });

        it('removeEvent', () => {
            expect(zapElementRemoveEvent).toEqual(jasmine.any(Function));
        });

        it('fireEvent', () => {
            expect(zapElementFireEvent).toEqual(jasmine.any(Function));
        });

        it('getStyle', () => {
            expect(zapElementGetStyle).toEqual(jasmine.any(Function));
        });

        it('getScroll', () => {
            expect(zapElementGetScroll).toEqual(jasmine.any(Function));
        });

        it('setVendorStyle', () => {
            expect(setVendorStyle).toEqual(jasmine.any(Function));
        });

        it('cssTransitionSupported', () => {
            expect(cssTransitionSupported).toEqual(jasmine.any(Boolean));
        });

        it('cssTransformSupported', () => {
            expect(cssTransformSupported).toEqual(jasmine.any(Boolean));
        });
    });
});
