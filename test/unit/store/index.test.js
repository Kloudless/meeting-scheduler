import { createStore } from '../jest/vue-utils';

describe('Vuex store main module test', () => {
  test('test generate schedule Url', () => {
    const { states, store } = createStore({
      state: {
        launchOptions: {
          setup: {
            scheduleUrl: 'http://localhost:8080/MEETING_WINDOW_ID/',
          },
        },
      },
    });
    const testWindowId = 'testWindowId';
    store.commit({
      type: 'meetingWindow/setMeetingWindow',
      meetingWindow: {
        id: testWindowId,
      },
    });
    store.commit({
      type: 'setScheduleUrl',
    });
    expect(states.meetingWindow.id).toBe(testWindowId);
    expect(states.root.scheduleUrl)
      .toBe(`http://localhost:8080/${testWindowId}/`);
  });
});
