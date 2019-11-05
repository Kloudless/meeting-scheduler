import { createStore } from '../jest/vue-utils';

describe('test account/setAccount action: edit mode', () => {
  test.each([
    ['api/getAccount success', true],
    ['api/getAccount fail', false],
  ])('%s', async (_, success) => {
    // fake data
    const fakeAccountObj = { id: 12345, account: 'fakeAccount@kloudless.com' };
    // mock action
    const mockApiGetAccount = jest.fn().mockReturnValue(
      success ? Promise.resolve(fakeAccountObj) : Promise.reject(),
    );
    // store
    const { store } = createStore({
      state: {
        launchOptions: {
          setup: {
            meetingWindowId: 'windowId',
          },
        },
      },
      modules: {
        api: {
          actions: {
            getAccount: mockApiGetAccount,
          },
        },
      },
    });

    // test & assert
    const payload = { token: 'fakeToken' };
    if (!success) {
      await expect(store.dispatch('account/setAccount', payload))
        .rejects.toThrow();
      expect(store.state.account).toEqual({
        id: null,
        account: null,
        token: null,
        calendars: [],
        calendarId: null,
      });
    } else {
      await store.dispatch('account/setAccount', payload);
      expect(store.state.account).toEqual({
        id: fakeAccountObj.id,
        account: fakeAccountObj.account,
        token: payload.token,
        calendars: [],
        calendarId: null,
      });
    }
  });
});

describe('test account/setAccount action: create mode', () => {
  test.each([
    [
      'api/getAccount success, api/listCalendars success, ' +
      'api/getCalendar success',
      { getAccount: true, listCalendars: true, getCalendar: true }],
    ['api/getAccount fail',
      { getAccount: false }],
    ['api/getAccount success, api/listCalendars fail, api/getCalendar success',
      { getAccount: true, listCalendars: false, getCalendar: true }],
    ['api/getAccount success, api/listCalendars success, api/getCalendar fail',
      { getAccount: true, listCalendars: true, getCalendar: false }],
    ['api/getAccount success, api/listCalendars fail, api/getCalendar fail',
      { getAccount: true, listCalendars: false, getCalendar: false }],
  ])('%s', async (_, params) => {
    const { getAccount, listCalendars, getCalendar } = params;

    // fake action result
    const fakeAccountObj = { id: 12345, account: 'fakeAccount@kloudless.com' };
    const fakeCalendars = {
      objects: [
        { id: 'fakeCalId', name: 'fakeCalName' },
        { id: 'fakeCalId2', name: 'fakeCalName2' },
      ],
    };
    const fakeCalendar = { id: 'fakeCalId2' };

    // mock action function
    const mockApiGetAccount = jest.fn().mockReturnValue(
      getAccount ? Promise.resolve(fakeAccountObj) : Promise.reject(),
    );
    const mockApiListCalendars = jest.fn().mockReturnValue(
      listCalendars ? Promise.resolve(fakeCalendars) : Promise.reject(),
    );
    const mockApiGetCalendar = jest.fn().mockReturnValue(
      getCalendar ? Promise.resolve(fakeCalendar) : Promise.reject(),
    );

    // store
    const { store } = createStore({
      state: {
        launchOptions: {
          setup: {},
        },
      },
      modules: {
        api: {
          actions: {
            getAccount: mockApiGetAccount,
            getCalendar: mockApiGetCalendar,
            listCalendars: mockApiListCalendars,
          },
        },
      },
    });
    store.commit('account/setCalendarId', { calendarId: 'primary' });

    // test
    const payload = { token: 'fakeToken' };
    await store.dispatch('account/setAccount', payload);

    // assert
    let expectedCalendarId = null;
    if (listCalendars && !getCalendar) {
      expectedCalendarId = fakeCalendars.objects[0].id;
    } else if (listCalendars && getCalendar) {
      expectedCalendarId = fakeCalendar.id;
    }
    expect(store.state.account).toEqual({
      id: getAccount ? fakeAccountObj.id : null,
      account: getAccount ? fakeAccountObj.account : null,
      token: getAccount ? payload.token : null,
      calendars: listCalendars ? fakeCalendars.objects : [],
      calendarId: expectedCalendarId,
    });
  });
});

describe(
  'test account/setAccount action: should throw an error in the ' +
  'following cases', () => {
    test.each([
      ['api/getAccount fail', { getAccount: false }],
      ['api/listCalendars fail', { listCalendars: false }],
      ['api/getCalendar fail', { getCalendar: false }],
      ['calendarId not in calendars', { calendarId: 'invalidCalId' }],
    ])('bookingCalendarId invisible, %s', async (_, params) => {
      const {
        getAccount = true, listCalendars = true, getCalendar = true,
        calendarId = 'primary',
      } = params;

      // fake action result
      const fakeAccountObj = {
        id: 12345, account: 'fakeAccount@kloudless.com',
      };
      const fakeCalendars = {
        objects: [
          { id: 'fakeCalId', name: 'fakeCalName' },
          { id: 'fakeCalId2', name: 'fakeCalName2' },
        ],
      };
      const fakeCalendar = { id: 'fakeCalId2' };

      // mock action function
      const mockApiGetAccount = jest.fn().mockReturnValue(
        getAccount ? Promise.resolve(fakeAccountObj) : Promise.reject(),
      );
      const mockApiListCalendars = jest.fn().mockReturnValue(
        listCalendars ? Promise.resolve(fakeCalendars) : Promise.reject(),
      );
      const mockApiGetCalendar = jest.fn().mockReturnValue(
        getCalendar ? Promise.resolve(fakeCalendar) : Promise.reject(),
      );

      // store
      const { store } = createStore({
        state: {
          launchOptions: { setup: {} },
        },
        modules: {
          api: {
            actions: {
              getAccount: mockApiGetAccount,
              getCalendar: mockApiGetCalendar,
              listCalendars: mockApiListCalendars,
            },
          },
        },
      });
      store.commit('account/setCalendarId', { calendarId });
      store.commit(
        'meetingWindow/setVisible',
        { name: 'bookingCalendarId', value: false },
      );

      // test & assert
      const payload = { token: 'fakeToken' };
      await expect(store.dispatch('account/setAccount', payload))
        .rejects.toThrow();
      expect(store.state.account).toEqual({
        id: null,
        account: null,
        token: null,
        calendars: [],
        calendarId: null,
      });
    });
  },
);
