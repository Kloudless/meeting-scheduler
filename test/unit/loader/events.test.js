import MeetingScheduler from 'loader';
import { EVENTS, INTERNAL_EVENTS } from 'constants';

let scheduler;
const event = EVENTS.OPEN;


describe('loader on and off method tests', () => {
  beforeEach(() => {
    scheduler = new MeetingScheduler();
  });
  test('Callback should be called with eventData', () => {
    const callback = jest.fn();
    scheduler.on(event, callback);
    const eventData = {
      scheduler: 'should_not_be_used',
      test: 'test',
    };
    scheduler.onMessage({
      event,
      ...eventData,
    });
    expect(callback).toBeCalledWith({
      scheduler,
      test: 'test',
    });
  });

  test('callback should be unregistered even registered multiple times', () => {
    const callback = jest.fn();
    scheduler.on(event, callback);
    scheduler.on(event, callback);
    scheduler.off(event, callback);
    scheduler.onMessage({
      event,
    });
    expect(callback).toHaveBeenCalledTimes(0);
  });
});

describe('loader on and off with multiple callbacks', () => {
  const callbacks = [jest.fn(), jest.fn(), jest.fn()];
  scheduler = new MeetingScheduler();

  test('Register multiple callbacks for one event', () => {
    callbacks.forEach((callback) => {
      scheduler.on(event, callback);
    });
    scheduler.onMessage({ event });

    callbacks.forEach((callback) => {
      expect(callback).toHaveBeenCalledTimes(1);
    });
  });

  test('Unregister one callback, should still call the rest 2', () => {
    // only unregister callbacks[0]
    scheduler.off(event, callbacks[0]);
    scheduler.onMessage({ event });

    expect(callbacks[0]).toHaveBeenCalledTimes(1);
    expect(callbacks[1]).toHaveBeenCalledTimes(2);
    expect(callbacks[2]).toHaveBeenCalledTimes(2);
  });

  test('Invalid unregister call should be ignored', () => {
    // didn't unregister anything because the second param is not valid
    scheduler.off(event, 'invalid_param');
    scheduler.onMessage({ event });

    expect(callbacks[0]).toHaveBeenCalledTimes(1);
    expect(callbacks[1]).toHaveBeenCalledTimes(3);
    expect(callbacks[2]).toHaveBeenCalledTimes(3);
  });

  test('Unregister all callbacks, they should not be called anymore', () => {
    scheduler.off(event);
    scheduler.onMessage({ event });

    expect(callbacks[0]).toHaveBeenCalledTimes(1);
    expect(callbacks[1]).toHaveBeenCalledTimes(3);
    expect(callbacks[2]).toHaveBeenCalledTimes(3);
  });
});


describe('Actions for certain events', () => {
  scheduler = new MeetingScheduler();
  test('Should launch the view when receiving view loaded event', () => {
    scheduler.messenger.send = jest.fn();
    scheduler.onMessage({ event: INTERNAL_EVENTS.VIEW_LOAD });
    expect(scheduler.messenger.send).toBeCalledWith(
      expect.objectContaining({
        event: INTERNAL_EVENTS.VIEW_LAUNCH,
      }),
    );
  });

  test('Should destroy the view when receiving close event', () => {
    scheduler.destroy = jest.fn();
    scheduler.onMessage({ event: EVENTS.CLOSE });
    expect(scheduler.destroy).toBeCalled();
  });
});
