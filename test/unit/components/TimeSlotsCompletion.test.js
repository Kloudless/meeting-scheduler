import TimeSlotsCompletion from 'view/components/TimeSlotsCompletion';
import Button from 'view/components/common/Button';
import Textarea from 'view/components/common/Textarea';
import { getWrapper, createStore } from '../jest/vue-utils';

describe('Action buttons test', () => {
  test.each([
    ['No actions', [], 0],
    ['Has one action', ['close'], 1],
    ['Ignore invalid actions', ['close', 'test'], 1],
  ])('%s', (_, actions, expectedNumOfButtons) => {
    const { store } = createStore({
      state: {
        launchOptions: {
          schedule: {
            afterSchedule: {
              actions,
            },
          },
        },
      },
      modules: {
        meetingWindow: {
          initState() {
            return {
              title: 'title',
              location: 'location',
            };
          },
        },
        timeSlots: {
          initState() {
            return {
              selectedSlot: {
                start: '2019-05-05T00:30:00+00:00',
                end: '2019-05-05T01:00:00+00:00',
              },
            };
          },
        },
      },
    });
    const wrapper = getWrapper(TimeSlotsCompletion, {
      store,
    });
    const buttons = wrapper.findAll(Button);
    expect(buttons.length).toBe(expectedNumOfButtons);
  });
});

describe('Display Note test', () => {
  test.each([
    [
      'meetingWindow.allow_event_metadata is not enabled',
      false,
      true,
      false,
    ],
    [
      'User didn\'t input extra_description',
      true,
      false,
      false,
    ],
    [
      'User inputted extra_description',
      true,
      true,
      true,
    ],
  ])('%s', (_, allowEventMetadata, hasExtraDescription, expectShowNote) => {
    const { store } = createStore({
      state: {
        launchOptions: {
          schedule: {
            afterSchedule: {
              actions: [],
            },
          },
        },
      },
      modules: {
        meetingWindow: {
          initState() {
            return {
              title: 'title',
              location: 'location',
              allowEventMetadata,
            };
          },
        },
        timeSlots: {
          initState() {
            return {
              selectedSlot: {
                start: '2019-05-05T00:30:00+00:00',
                end: '2019-05-05T01:00:00+00:00',
              },
              extraDescription: hasExtraDescription ? 'extra_description' : '',
            };
          },
        },
      },
    });
    const wrapper = getWrapper(TimeSlotsCompletion, {
      store,
    });
    const noteTextarea = wrapper.findAll(Textarea);
    expect(noteTextarea.length).toBe(expectShowNote ? 1 : 0);
  });
});
