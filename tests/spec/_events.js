
import {
    create as zapElementCreate,
    remove as zapElementRemove,
    destroy as zapElementDestroy,
    addEvent as zapElementAddEvent,
    addEvents as zapElementAddEvents,
    removeEvent as zapElementRemoveEvent,
    fireEvent as zapElementFireEvent,
    getSupportedVendorProperty,
} from 'zap-base-dom-element';

describe('zap-base-dom-element', () => {
    describe('events', () => {
        const DOMElement = document.createElement('div');
        const callbackFunc = function (event) {};

        describe('addEvent', () => {
            it('addEvent(DOMElement, "click", callbackFunc) should not fail', () => {
                expect(zapElementAddEvent(DOMElement, 'click', callbackFunc)).toBeUndefined();
            });

            it('addEvent(DOMElement, "click", callbackFunc, {call: true}) should call the callback right away', () => {
                const innerFunctionSpy = jasmine.createSpy('innerFunctionSpy');

                zapElementAddEvent(DOMElement, 'click', function () {
                    innerFunctionSpy();
                }, {
                    call: true,
                });

                expect(innerFunctionSpy).toHaveBeenCalled();
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

        describe('addEvent with specialEvent like transitionend should work', () => {
            it('addEvent(DOMElement, "transitionend", callbackFunc', (done) => {
                const functionSpy = jasmine.createSpy('transitionendEvent');
                const DOMElement = document.createElement('div');
                const property = getSupportedVendorProperty('transition');

                DOMElement.style[property] = 'left .01s';
                DOMElement.style.position = 'absolute';
                DOMElement.style.left = '0';
                DOMElement.style.width = '100px';
                DOMElement.style.height = '100px';
                DOMElement.style.background = 'red';

                zapElementAddEvent(DOMElement, 'transitionend', functionSpy);
                document.body.appendChild(DOMElement);

                setTimeout(() => {
                    DOMElement.style.left = '100px';
                }, 40);

                setTimeout(() => {
                    expect(functionSpy).toHaveBeenCalled();
                    zapElementDestroy(DOMElement);
                    done();
                }, 200);
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
