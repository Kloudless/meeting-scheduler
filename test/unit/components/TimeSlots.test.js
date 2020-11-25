/* eslint-disable no-underscore-dangle */
import TimeSlots from 'view/components/TimeSlots';
import { MAX_TIME_SLOTS_PER_SCROLL, EVENTS } from 'constants';
import { TIME_ZONES } from 'view/utils/fixtures';
import recaptchaHelper from 'view/utils/recaptcha-helper';
import { getWrapper, createStore } from '../jest/vue-utils';
import { MOCK_BROWSER_TIMEZONE } from '../jest/constants';

const DEFAULT_ROUTE = '/timeSlots/create';
const MOCK_MEETING_WINDOW_TIMEZONE = 'Europe/London';

describe('afterSchedule config tests', () => {
  beforeAll(() => {
    // disable making API requests when mounting TimeSlots view
    jest.spyOn(TimeSlots, 'beforeMount').mockResolvedValue();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  test.each([
    ['Show result after submit', true],
    ['Destroy the view after submit', false],
  ])('%s', (_, showResult) => {
    const { store } = createStore({
      state: {
        launchOptions: {
          schedule: {
            afterSchedule: {
              showResult,
            },
          },
        },
      },
    });
    const wrapper = getWrapper(TimeSlots, { store }, DEFAULT_ROUTE);
    wrapper.vm.afterSubmit();
    if (showResult) {
      expect(wrapper.vm.$route.path).toBe('/timeSlotsCompletion/create');
    } else {
      expect(store.messenger.send).toBeCalledWith({
        event: EVENTS.CLOSE,
      });
    }
  });
});

describe('Infinite scroll tests', () => {
  const offset = 10; // need to be less than MAX_TIME_SLOTS_PER_SCROLL;
  beforeAll(() => {
    jest.spyOn(TimeSlots, 'beforeMount').mockResolvedValue();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
  test.each([
    [
      'First Scroll, No available slot',
      {
        numOfAvailableSlots: 0,
        initTimeSlotsRenderOffset: 0,
        expectDispatchGetTimeSlots: true,
        numOfSlotsInResponse: 0,
        hasNextPage: false,
        expectTimeSlotsRenderOffset: 0,
        expectScrollState: 'no-result',
      },
    ],
    [
      'First scroll: Num of slots returned < MAX_TIME_SLOTS_PER_SCROLL'
      + ', has remaining pages',
      {
        numOfAvailableSlots: 0,
        initTimeSlotsRenderOffset: 0,
        expectDispatchGetTimeSlots: true,
        numOfSlotsInResponse: MAX_TIME_SLOTS_PER_SCROLL - offset,
        hasNextPage: true,
        expectTimeSlotsRenderOffset: MAX_TIME_SLOTS_PER_SCROLL - offset,
        expectScrollState: 'has-more',
      },
    ],
    [
      'First scroll: Num of slots returned > MAX_TIME_SLOTS_PER_SCROLL'
      + ', has remaining pages',
      {
        numOfAvailableSlots: 0,
        initTimeSlotsRenderOffset: 0,
        expectDispatchGetTimeSlots: true,
        numOfSlotsInResponse: MAX_TIME_SLOTS_PER_SCROLL + offset,
        hasNextPage: true,
        expectTimeSlotsRenderOffset: MAX_TIME_SLOTS_PER_SCROLL,
        expectScrollState: 'has-more',
      },
    ],
    [
      'First scroll: Num of slots returned = MAX_TIME_SLOTS_PER_SCROLL'
      + ', has remaining pages',
      {
        numOfAvailableSlots: 0,
        initTimeSlotsRenderOffset: 0,
        expectDispatchGetTimeSlots: true,
        numOfSlotsInResponse: MAX_TIME_SLOTS_PER_SCROLL,
        hasNextPage: true,
        expectTimeSlotsRenderOffset: MAX_TIME_SLOTS_PER_SCROLL,
        expectScrollState: 'has-more',
      },
    ],
    [
      'First scroll: Num of slots returned < MAX_TIME_SLOTS_PER_SCROLL'
      + ', reached last page',
      {
        numOfAvailableSlots: 0,
        initTimeSlotsRenderOffset: 0,
        expectDispatchGetTimeSlots: true,
        numOfSlotsInResponse: MAX_TIME_SLOTS_PER_SCROLL - offset,
        hasNextPage: false,
        expectTimeSlotsRenderOffset: MAX_TIME_SLOTS_PER_SCROLL - offset,
        expectScrollState: 'completed',
      },
    ],
    [
      'First scroll: Num of slots returned > MAX_TIME_SLOTS_PER_SCROLL'
      + ', reached last page',
      {
        numOfAvailableSlots: 0,
        initTimeSlotsRenderOffset: 0,
        expectDispatchGetTimeSlots: true,
        numOfSlotsInResponse: MAX_TIME_SLOTS_PER_SCROLL + offset,
        hasNextPage: false,
        expectTimeSlotsRenderOffset: MAX_TIME_SLOTS_PER_SCROLL,
        expectScrollState: 'has-more',
      },
    ],
    [
      'First scroll: Num of slots returned = MAX_TIME_SLOTS_PER_SCROLL'
      + ', reached last page',
      {
        numOfAvailableSlots: 0,
        initTimeSlotsRenderOffset: 0,
        expectDispatchGetTimeSlots: true,
        numOfSlotsInResponse: MAX_TIME_SLOTS_PER_SCROLL,
        hasNextPage: false,
        expectTimeSlotsRenderOffset: MAX_TIME_SLOTS_PER_SCROLL,
        expectScrollState: 'completed',
      },
    ],
    [
      'Second scroll: Remaining slots < MAX_TIME_SLOTS_PER_SCROLL'
      + ', has remaining pages'
      + '\n        '
      + 'Second response slots < remaining slots needed for this scroll'
      + ', second response is not the last page',
      {
        numOfAvailableSlots: MAX_TIME_SLOTS_PER_SCROLL * 2 - offset,
        initTimeSlotsRenderOffset: MAX_TIME_SLOTS_PER_SCROLL,
        expectDispatchGetTimeSlots: true,
        numOfSlotsInResponse: offset - 1,
        hasNextPage: true,
        expectTimeSlotsRenderOffset: (
          MAX_TIME_SLOTS_PER_SCROLL * 2 - offset) + (offset - 1),
        expectScrollState: 'has-more',
      },
    ],
    [
      'Second scroll: Remaining slots < MAX_TIME_SLOTS_PER_SCROLL'
      + ', has remaining pages'
      + '\n        '
      + 'Second response slots > remaining slots needed for this scroll'
      + ', second response is not the last page',
      {
        numOfAvailableSlots: MAX_TIME_SLOTS_PER_SCROLL * 2 - offset,
        initTimeSlotsRenderOffset: MAX_TIME_SLOTS_PER_SCROLL,
        expectDispatchGetTimeSlots: true,
        numOfSlotsInResponse: offset + 1,
        hasNextPage: true,
        expectTimeSlotsRenderOffset: MAX_TIME_SLOTS_PER_SCROLL * 2,
        expectScrollState: 'has-more',
      },
    ],
    [
      'Second scroll: Remaining slots < MAX_TIME_SLOTS_PER_SCROLL'
      + ', has remaining pages'
      + '\n        '
      + 'Second response slots = remaining slots needed for this scroll'
      + ', second response is not the last page',
      {
        numOfAvailableSlots: MAX_TIME_SLOTS_PER_SCROLL * 2 - offset,
        initTimeSlotsRenderOffset: MAX_TIME_SLOTS_PER_SCROLL,
        expectDispatchGetTimeSlots: true,
        numOfSlotsInResponse: offset,
        hasNextPage: true,
        expectTimeSlotsRenderOffset: MAX_TIME_SLOTS_PER_SCROLL * 2,
        expectScrollState: 'has-more',
      },
    ],
    [
      'Second scroll: Remaining slots < MAX_TIME_SLOTS_PER_SCROLL'
      + ', has remaining pages'
      + '\n        '
      + 'Second response slots < remaining slots needed for this scroll'
      + ', second response is the last page',
      {
        numOfAvailableSlots: MAX_TIME_SLOTS_PER_SCROLL * 2 - offset,
        initTimeSlotsRenderOffset: MAX_TIME_SLOTS_PER_SCROLL,
        expectDispatchGetTimeSlots: true,
        numOfSlotsInResponse: offset - 1,
        hasNextPage: false,
        expectTimeSlotsRenderOffset: (
          MAX_TIME_SLOTS_PER_SCROLL * 2 - offset) + (offset - 1),
        expectScrollState: 'completed',
      },
    ],
    [
      'Second scroll: Remaining slots < MAX_TIME_SLOTS_PER_SCROLL'
      + ', has remaining pages'
      + '\n        '
      + 'Second response slots > remaining slots needed for this scroll'
      + ', second response is the last page',
      {
        numOfAvailableSlots: MAX_TIME_SLOTS_PER_SCROLL * 2 - offset,
        initTimeSlotsRenderOffset: MAX_TIME_SLOTS_PER_SCROLL,
        expectDispatchGetTimeSlots: true,
        numOfSlotsInResponse: offset + 1,
        hasNextPage: false,
        expectTimeSlotsRenderOffset: MAX_TIME_SLOTS_PER_SCROLL * 2,
        expectScrollState: 'has-more',
      },
    ],
    [
      'Second scroll: Remaining slots < MAX_TIME_SLOTS_PER_SCROLL'
      + ', has remaining pages'
      + '\n        '
      + 'Second response slots = remaining slots needed for this scroll'
      + ', second response is the last page',
      {
        numOfAvailableSlots: MAX_TIME_SLOTS_PER_SCROLL * 2 - offset,
        initTimeSlotsRenderOffset: MAX_TIME_SLOTS_PER_SCROLL,
        expectDispatchGetTimeSlots: true,
        numOfSlotsInResponse: offset,
        hasNextPage: false,
        expectTimeSlotsRenderOffset: MAX_TIME_SLOTS_PER_SCROLL * 2,
        expectScrollState: 'completed',
      },
    ],
    [
      'Second scroll: Remaining slots > MAX_TIME_SLOTS_PER_SCROLL'
      + ', has remaining pages',
      {
        numOfAvailableSlots: MAX_TIME_SLOTS_PER_SCROLL * 2 + offset,
        initTimeSlotsRenderOffset: MAX_TIME_SLOTS_PER_SCROLL,
        expectDispatchGetTimeSlots: false,
        expectTimeSlotsRenderOffset: MAX_TIME_SLOTS_PER_SCROLL * 2,
        expectScrollState: 'has-more',
      },
    ],
    [
      'Second scroll: Remaining slots = MAX_TIME_SLOTS_PER_SCROLL'
      + ', has remaining pages',
      {
        numOfAvailableSlots: MAX_TIME_SLOTS_PER_SCROLL * 2,
        initTimeSlotsRenderOffset: MAX_TIME_SLOTS_PER_SCROLL,
        expectDispatchGetTimeSlots: false,
        expectTimeSlotsRenderOffset: MAX_TIME_SLOTS_PER_SCROLL * 2,
        expectScrollState: 'has-more',
      },
    ],
    [
      'Second scroll: Remaining slots < MAX_TIME_SLOTS_PER_SCROLL'
      + ', reached last page',
      {
        numOfAvailableSlots: MAX_TIME_SLOTS_PER_SCROLL * 2 - offset,
        initTimeSlotsRenderOffset: MAX_TIME_SLOTS_PER_SCROLL,
        initHasMoreTimeSlotsPages: false,
        expectDispatchGetTimeSlots: false,
        expectTimeSlotsRenderOffset: (MAX_TIME_SLOTS_PER_SCROLL * 2 - offset),
        expectScrollState: 'completed',
      },
    ],
    [
      'Second scroll: Remaining slots > MAX_TIME_SLOTS_PER_SCROLL'
      + ', reached last page',
      {
        numOfAvailableSlots: MAX_TIME_SLOTS_PER_SCROLL * 2 + offset,
        initTimeSlotsRenderOffset: MAX_TIME_SLOTS_PER_SCROLL,
        initHasMoreTimeSlotsPages: false,
        expectDispatchGetTimeSlots: false,
        expectTimeSlotsRenderOffset: MAX_TIME_SLOTS_PER_SCROLL * 2,
        expectScrollState: 'has-more',
      },
    ],
    [
      'Second scroll: Remaining slots = MAX_TIME_SLOTS_PER_SCROLL'
      + ', reached last page',
      {
        numOfAvailableSlots: MAX_TIME_SLOTS_PER_SCROLL * 2,
        initTimeSlotsRenderOffset: MAX_TIME_SLOTS_PER_SCROLL,
        initHasMoreTimeSlotsPages: false,
        expectDispatchGetTimeSlots: false,
        expectTimeSlotsRenderOffset: MAX_TIME_SLOTS_PER_SCROLL * 2,
        expectScrollState: 'completed',
      },
    ],
  ])('%s', async (_, params) => {
    const {
      numOfAvailableSlots,
      initTimeSlotsRenderOffset,
      initHasMoreTimeSlotsPages = true,
      expectDispatchGetTimeSlots,
      numOfSlotsInResponse,
      hasNextPage,
      expectTimeSlotsRenderOffset,
      expectScrollState,
    } = params;
    // arrange
    const responseSlots = [];
    for (let i = 0; i < numOfSlotsInResponse; i += 1) {
      responseSlots.push(i);
    }
    const availableSlots = [];
    for (let i = 0; i < numOfAvailableSlots; i += 1) {
      availableSlots.push(i);
    }

    let store;
    const getTimeSlots = jest.fn(() => {
      store.commit({
        type: 'timeSlots/setTimeSlots',
        availableSlots: responseSlots,
      });
      return Promise.resolve(hasNextPage);
    });

    ({ store } = createStore({
      modules: {
        timeSlots: {
          initState() {
            return {
              availableSlots,
            };
          },
          actions: {
            getTimeSlots,
          },
        },
      },
    }));

    const infiniteHandlerState = {
      complete: jest.fn(),
      loaded: jest.fn(),
    };

    // act
    const wrapper = getWrapper(TimeSlots, { store }, DEFAULT_ROUTE);
    wrapper.vm.$mount();
    wrapper.vm.timeSlotsRenderOffset = initTimeSlotsRenderOffset;
    wrapper.vm.hasMoreTimeSlotsPages = initHasMoreTimeSlotsPages;
    await wrapper.vm.infiniteHandler(infiniteHandlerState);

    // assert
    expect(getTimeSlots).toHaveBeenCalledTimes(
      expectDispatchGetTimeSlots ? 1 : 0,
    );
    if (expectDispatchGetTimeSlots) {
      expect(wrapper.vm.hasMoreTimeSlotsPages).toBe(hasNextPage);
    }

    expect(wrapper.vm.timeSlotsRenderOffset).toBe(expectTimeSlotsRenderOffset);

    switch (expectScrollState) {
      case 'no-result':
        expect(infiniteHandlerState.loaded).toHaveBeenCalledTimes(0);
        expect(infiniteHandlerState.complete).toHaveBeenCalledTimes(1);
        break;
      case 'has-more':
        expect(infiniteHandlerState.loaded).toHaveBeenCalledTimes(1);
        expect(infiniteHandlerState.complete).toHaveBeenCalledTimes(0);
        break;
      case 'completed':
        expect(infiniteHandlerState.loaded).toHaveBeenCalledTimes(1);
        expect(infiniteHandlerState.complete).toHaveBeenCalledTimes(1);
        expect(infiniteHandlerState.complete).toHaveBeenCalledAfter(
          infiniteHandlerState.loaded,
        );
        break;
      default:
        throw new Error('expectScrollState is not a valid string');
    }
  });
});

describe('extraDescription field visibility test', () => {
  test.each([
    [
      'Should not show extraDescription if event metadata is not allowed',
      false,
      false,
      false,
    ],
    [
      'Should not show extraDescription if event metadata is not allowed',
      true,
      false,
      false,
    ],
    [
      'Should not show extraDescription if visible is not set',
      false,
      true,
      false,
    ],
    [
      'Should show extraDescription if event metadata is allowed and'
        + 'visible is set',
      true,
      true,
      true,
    ],
  ])('%s', async (_, setVisible, allowEventMetadata, expectFieldVisible) => {
    const { store } = createStore({
      state: {
        launchOptions: {},
      },
      modules: {
        meetingWindow: {
          initState() {
            return {
              id: 'fakeID',
              allowEventMetadata,
              timeZone: MOCK_MEETING_WINDOW_TIMEZONE,
            };
          },
        },
      },
    });

    const launchOptions = {
      schedule: {
        formOptions: {
          extraDescription: { visible: setVisible },
        },
      },
    };

    await store.dispatch('initialize', {
      launchOptions,
    });

    const wrapper = getWrapper(TimeSlots, { store }, DEFAULT_ROUTE);

    // test extraDescription input
    wrapper.vm.step = 1;
    let extraDescriptionInput = wrapper.findAll('[name=extraDescription]');
    expect(extraDescriptionInput.length).toBe(expectFieldVisible ? 1 : 0);

    // test if extraDescription preview is displayed before submit
    store.commit({
      type: 'timeSlots/selectTimeSlot',
      selected: true,
      slot: { },
    });

    wrapper.vm.step = 2;
    const extraDescriptionValues = [''];
    if (expectFieldVisible) {
      extraDescriptionValues.push('extra_description');
    }
    extraDescriptionValues.forEach((extraDescription) => {
      store.commit({
        type: 'timeSlots/update',
        name: 'extraDescription',
        value: extraDescription,
      });

      extraDescriptionInput = wrapper.findAll('[name=extraDescription]');
      expect(extraDescriptionInput.length).toBe(
        expectFieldVisible && extraDescription ? 1 : 0,
      );
    });
  });
});

describe('timeZone launch option and dropdown tests', () => {
  beforeAll(() => {
    /**
     * The following tests expect the mocked browser timezone and
     * the mocked meeting window timezone is different
     */
    expect(MOCK_BROWSER_TIMEZONE).not.toEqual(MOCK_MEETING_WINDOW_TIMEZONE);
  });


  test.each([
    ['No value', undefined, MOCK_BROWSER_TIMEZONE],
    ['organizer', 'organizer', MOCK_MEETING_WINDOW_TIMEZONE],
    ['Valid IANA string', 'America/Los_Angeles', 'America/Los_Angeles'],
    ['Invalid IANA string', 'foo', MOCK_BROWSER_TIMEZONE],
  ])(
    'Test default timeZone on launch: %s', async (
      _, timeZoneOption, expectedTimeZone,
    ) => {
      const { store } = createStore({
        state: {
          launchOptions: {
            schedule: {
              meetingWindowId: 'meetingWindowId',
              timeZone: timeZoneOption,
            },
          },
        },
        modules: {
          meetingWindow: {
            initState() {
              return {
                id: 'id',
                timeZone: MOCK_MEETING_WINDOW_TIMEZONE,
              };
            },
          },
        },
      });

      const wrapper = getWrapper(TimeSlots, { store }, DEFAULT_ROUTE);
      expect(wrapper.vm.timeZone).toBe(expectedTimeZone);
    },
  );

  test.each([
    [
      'Browser and Meeting Window are in different timezones',
      MOCK_MEETING_WINDOW_TIMEZONE,
      [MOCK_BROWSER_TIMEZONE, MOCK_MEETING_WINDOW_TIMEZONE, 'divider']],
    [
      'Browser and Meeting Window are in the same timezone',
      MOCK_BROWSER_TIMEZONE,
      [MOCK_BROWSER_TIMEZONE, 'divider'],
    ],
  ])(
    'Test timeZone dropdown: %s', async (
      _, meetingWindowTimeZone, expectedDropdownItems,
    ) => {
      const { store } = createStore({
        state: {
          launchOptions: {
            schedule: {
              meetingWindowId: 'meetingWindowId',
            },
          },
        },
        modules: {
          meetingWindow: {
            initState() {
              return {
                id: 'id',
                timeZone: meetingWindowTimeZone,
              };
            },
          },
        },
      });

      const wrapper = getWrapper(TimeSlots, { store }, DEFAULT_ROUTE);
      await wrapper.vm.$nextTick();
      expect(wrapper.vm.timeZones.length).toBe(TIME_ZONES.length + 1);
      expectedDropdownItems.forEach((item, index) => {
        if (item === 'divider') {
          expect(wrapper.vm.timeZones[index]).toMatchObject({ divider: true });
        } else {
          expect(wrapper.vm.timeZones[index]).toMatchObject({ value: item });
        }
      });
    },
  );

  test.each([
    ['Asia/Taipei', '08:00 AM'],
    ['Asia/Tokyo', '09:00 AM'],
  ])(
    'formatDate should apply the current timeZone: %s', async (
      timeZone, expectedDate,
    ) => {
      const { store } = createStore({
        state: {
          launchOptions: {
            schedule: {
              meetingWindowId: 'meetingWindowId',
            },
          },
        },
        modules: {
          meetingWindow: {
            initState() {
              return {
                id: 'id',
                timeZone: MOCK_MEETING_WINDOW_TIMEZONE,
              };
            },
          },
        },
      });

      const wrapper = getWrapper(TimeSlots, {
        store,
      });
      store.commit({
        type: 'timeSlots/update',
        name: 'timeZone',
        value: timeZone,
      });

      expect(wrapper.vm.formatDate('fullHour', '2020-10-06T00:00:00Z'))
        .toBe(expectedDate);
    },
  );
});

// TODO: Move this to e2e test, it's easier to verify if infinite scrolling
// is reset on real browsers
test('Changing timezone should restart infinite scrolling', async () => {
  const availableSlots = [];
  const initSlots = MAX_TIME_SLOTS_PER_SCROLL * 3;
  for (let i = 0; i < initSlots; i += 1) {
    availableSlots.push(i);
  }
  const { store } = createStore({
    state: {
      launchOptions: {
        schedule: {
          meetingWindowId: 'meetingWindowId',
        },
      },
    },
    modules: {
      meetingWindow: {
        initState() {
          return {
            id: 'id',
            timeZone: 'Asia/Taipei',
          };
        },
      },
    },
  });
  const wrapper = getWrapper(TimeSlots, { store }, DEFAULT_ROUTE);
  await wrapper.setData({ timeSlotsRenderOffset: initSlots });
  wrapper.vm.selectTimeZone({ value: 'Asia/Tokyo' });
  await wrapper.vm.$nextTick();
  expect(wrapper.vm.timeSlotsRenderOffset).toBe(0);
});
