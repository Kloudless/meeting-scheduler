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

describe('EventMessenger send with "wait" property tests', () => {
  const receiverId = 2;
  const windowObj = {
    postMessage(message) {
      /** redirect messages between messenger and receiverMessenger by changing
       * message id here.
       * Simulating postMessage between two windows in real browsers
       */
      message.id = message.id === id ? receiverId : id;
      processMessage(message);
    },
  };
  let receiverMessenger;

  beforeEach(() => {
    receiverMessenger = new EventMessenger({
      id: receiverId,
      role: ROLES.VIEW,
      onMessage: jest.fn(),
    });

    messenger.connect(windowObj);
    receiverMessenger.connect(windowObj);
  });

  test(
    'messenger.send should return the value returned by '
    + 'receiverMessenger.onMessage',
    async () => {
      const message = {
        event: 'event',
        wait: true,
        test: 'test',
      };
      const exceptedResponse = { foo: 'bar' };
      receiverMessenger.onMessage.mockReturnValue(exceptedResponse);
      const response = await messenger.send(message);
      expect(receiverMessenger.onMessage).toHaveBeenCalledTimes(1);
      expect(response).toBe(exceptedResponse);
    },
  );
});
