
import {
    create as zapElementCreate,
    remove as zapElementRemove,
    destroy as zapElementDestroy,
    addEvent as zapElementAddEvent,
    addEvents as zapElementAddEvents,
    removeEvent as zapElementRemoveEvent,
    fireEvent as zapElementFireEvent,
} from 'zap-base-dom-element';

describe('zap-base-dom-element', () => {
    describe('events', () => {
        const DOMElement = document.createElement('div');
        const callbackFunc = function (event) {};

        describe('addEvent', () => {
            it('addEvent(DOMElement, "click", callbackFunc) should not fail', () => {
                expect(zapElementAddEvent(DOMElement, 'click', callbackFunc)).toBeUndefined();
            });
        });

        describe('removeEvent', () => {
            it('removeEvent(DOMElement, "click", callbackFunc) should not fail', () => {
                expect(zapElementRemoveEvent(DOMElement, 'click', callbackFunc)).toBeUndefined();
            });

            it('removeEvent(DOMElement, "click") should not fail', () => {
                expect(zapElementRemoveEvent(DOMElement, 'click')).toBeUndefined();
            });
        });

        describe('fireEvent', () => {
            it('fireEvent(DOMElement, "click") should not fail', () => {
                expect(zapElementFireEvent(DOMElement, 'click')).toBeUndefined();
            });
        });
    });

    describe('addEvent -> fireEvent -> removeEvent', () => {
        const innerFunctionSpy = jasmine.createSpy('innerFunctionSpy');
        const DOMElement = document.createElement('div');
        const callbackFunc = (args) => {
            innerFunctionSpy(args);
        };

        zapElementAddEvent(DOMElement, 'click', callbackFunc);

        it('fire', function () {
            zapElementFireEvent(DOMElement, 'click', ['xx', 'yy']);

            expect(innerFunctionSpy).toHaveBeenCalledWith(['xx', 'yy']);
        });

        it('fire again', function () {
            innerFunctionSpy.calls.reset();
            zapElementRemoveEvent(DOMElement, 'click', callbackFunc);
            zapElementFireEvent(DOMElement, 'click');

            expect(innerFunctionSpy).not.toHaveBeenCalled();
        });
    });
});
