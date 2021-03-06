import sinon from 'sinon';
import noop from 'lodash/noop';
import isFunction from 'lodash/isFunction';

/**
 * Use sinon's fake time controls
 *
 * This helper spins up and down sinon's fake clock.
 * If you provide a callback, it will be invoked with the clock instance created by sinon.
 *
 * You can pass clockCallback as the first argument with no 'now' if you wish
 *
 * See http://sinonjs.org/docs/#clock
 * @param  {Number} now The timestamp to set "now" to.
 * @param  {Function} clockCallback  A function invoked with the clock created by sinon
 * @deprecated Use Jest's timer mocks instead (https://facebook.github.io/jest/docs/timer-mocks.html)
 */
export function useFakeTimers( now = 0, clockCallback = noop ) {
	let clock;

	if ( isFunction( now ) && clockCallback === noop ) {
		clockCallback = now;
		now = 0;
	}

	before( function turnOnSinonFakeTimers() {
		clock = sinon.useFakeTimers( now );
		clockCallback( clock );
	} );

	after( function turnOffSinonFakeTimers() {
		if ( clock ) {
			clock.restore();
			clock = null;
		}
	} );
}

/**
 * Use a full sinon sandbox for this test block
 *
 * See http://sinonjs.org/docs/#sandbox
 *
 * @param  {Object|Function} config The configuration to use, or a callback that is invoked with the sandbox instance
 * @param  {Function} sandboxCallback A callback function that is invoked with the sandbox instance
 * @deprecated Use Jest's mock functions instead (https://facebook.github.io/jest/docs/mock-functions.html)
 */
export function useSandbox( config, sandboxCallback = noop ) {
	let sandbox;

	if ( isFunction( config ) && sandboxCallback === noop ) {
		sandboxCallback = config;
		config = undefined;
	}

	before( function() {
		sandbox = sinon.sandbox.create( config );
		sandboxCallback( sandbox );
	} );

	beforeEach( function() {
		sandbox.reset();
	} );

	after( function() {
		if ( sandbox ) {
			sandbox.restore();
			sandbox = null;
		}
	} );
}
