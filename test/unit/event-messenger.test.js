/* global MESSAGE_PREFIX */
import { ROLES } from 'constants';
import { processMessage, EventMessenger } from 'event-messenger';

const id = 1;
let messenger;
let receiver;

const viewPath = 'http://localhost:8081/view/index.html';

beforeEach(() => {
  EventMessenger.setTargetOrigin(ROLES.VIEW, viewPath);

  messenger = new EventMessenger({
    id,
    role: ROLES.LOADER,
    onMessage: jest.fn(),
  });

  // emulate window.postMessage
  receiver = {
    postMessage: jest.fn(),
  };
});


afterEach(() => {
  messenger.disconnect();
});

describe('Send message tests', () => {
  test('Should throw error if receiver is not connected', () => {
    expect(() => {
      messenger.send({ test: 'test' });
    }).toThrowError();
  });

  test('Should call receiver\'s postMessage with proper arguments', () => {
    messenger.connect(receiver);
    const message = {
      event: 'event',
      data: 'data',
    };
    messenger.send(message);
    const { calls } = receiver.postMessage.mock;
    expect(calls[calls.length - 1][0]).toMatchObject({
      id,
      event: `${MESSAGE_PREFIX}event`,
      role: ROLES.VIEW,
      data: 'data',
    });
  });
});

describe('Receive message tests', () => {
  beforeEach(() => {
    messenger.connect(receiver);
  });

  test.each([
    ['undefined', undefined],
    ['null', null],
    ['number', 1234],
    ['boolean', true],
  ])('Should ignore message if it is %s', (_, message) => {
    processMessage(message);
    expect(messenger.onMessage).toHaveBeenCalledTimes(0);
  });

  test.each([
    ['Should call messenger\'s onMessage when receiving message', true],
    ['Should ignore the message if it does not have event prefix', false],
  ])('%s', (_, hasPrefix) => {
    const message = {
      id,
      event: hasPrefix ? `${MESSAGE_PREFIX}event` : 'event',
      role: ROLES.LOADER,
      data: 'data',
    };
    processMessage(message);
    if (hasPrefix) {
      expect(messenger.onMessage).toHaveBeenCalledWith({
        event: 'event',
        data: 'data',
      });
    } else {
      expect(messenger.onMessage).toHaveBeenCalledTimes(0);
    }
  });

  test.each([
    ['Should throw error if message does not have id', { data: 'data' }],
    [
      'Should throw error if message does not have role',
      { id },
    ],
  ])('%s', (_, message) => {
    expect(() => {
      processMessage({ event: `${MESSAGE_PREFIX}event`, ...message });
    }).toThrowError();
  });
});

describe('EventMessenger.setTargetOrigin tests', () => {
  beforeEach(() => {
    messenger.connect(receiver);
  });

  test('Should send message with receiver\'s domain', () => {
    const message = {
      test: 'test',
    };
    messenger.send(message);
    const { calls } = receiver.postMessage.mock;
    expect(calls[calls.length - 1][1]).toBe('http://localhost:8081');
  });

  test.each([
    [
      'Should not set target domain if view path is relative',
      '../view/index.html',
    ],
    [
      'Should not set target domain if view path is invalid',
      'invalid-url',
    ],
  ])('%s', (_, targetPath) => {
    EventMessenger.setTargetOrigin(ROLES.VIEW, targetPath);
    const message = {
      test: 'test',
    };
    messenger.send(message);
    const { calls } = receiver.postMessage.mock;
    expect(calls[calls.length - 1][1]).not.toBeDefined();
  });
});
