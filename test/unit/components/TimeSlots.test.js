import TimeSlots from 'view/components/TimeSlots';
import { MAX_TIME_SLOTS_PER_SCROLL, EVENTS } from 'constants';
import { getWrapper, createStore } from '../jest/vue-utils';

const { beforeMount } = TimeSlots;

describe('afterSchedule config tests', () => {
  beforeAll(() => {
    // disable making API requests when mounting TimeSlots view
    TimeSlots.beforeMount = jest.fn();
  });

  afterAll(() => {
    TimeSlots.beforeMount = beforeMount;
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
    const wrapper = getWrapper(TimeSlots, {
      store,
    });
    wrapper.vm.afterSubmit();
    if (showResult) {
      expect(wrapper.vm.$route.path).toBe('/timeSlotsCompletion/');
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
    TimeSlots.beforeMount = jest.fn();
  });

  afterAll(() => {
    TimeSlots.beforeMount = beforeMount;
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
    const wrapper = getWrapper(TimeSlots, {
      store,
    });
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

describe('Recaptcha tests', () => {
  beforeAll(() => {
    // mock window.grecaptcha object
    window.grecaptcha = {
      render: jest.fn(),
      execute: jest.fn(),
    };
  });

  describe('Script tag tests', () => {
    afterAll(() => {
      // assume recaptcha key script tag finished loading
      window.recaptchaLoaded();
    });

    test.each([
      ['Should not add script tag if site key is not provided', false, 0],
      ['Should add script tag if siteKey is provided', true, 1],
      ['Should not add another script tag for the second time', true, 1],
    ])('%s', async (_, hasSiteKey, numOfScriptTags) => {
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
                recaptchaSiteKey: hasSiteKey ? 'siteKey' : null,
              };
            },
            actions: {
              getMeetingWindow: () => Promise.resolve({}),
            },
          },
        },
      });

      const wrapper = getWrapper(TimeSlots, {
        store,
      });

      await wrapper.vm.$nextTick();

      const scriptTags = document.querySelectorAll(
        'script[src^="https://www.google.com/recaptcha/api.js"]',
      );

      expect(scriptTags.length).toBe(numOfScriptTags);
    });
  });

  // This block depends on afterAll() above because recaptcha script is only
  // loaded once and it has been done in previous tests
  describe('Execute recaptcha on submit test', () => {
    test.each([
      [
        'Should call vm.submit() on submit if siteKey is not provided',
        false,
      ],
      [
        'Should call grecaptcha.execute() on submit if siteKey is provided',
        true,
      ],
    ])('%s', async (_, hasSiteKey) => {
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
                recaptchaSiteKey: hasSiteKey ? 'siteKey' : null,
              };
            },
            actions: {
              getMeetingWindow: () => Promise.resolve({}),
            },
          },
        },
      });

      const wrapper = getWrapper(TimeSlots, {
        store,
      });

      wrapper.vm.submit = jest.fn();

      // wait for loadRecaptchaScript promise
      await wrapper.vm.$nextTick();
      wrapper.vm.executeRecaptcha();
      // wait for executeRecaptcha to finish
      await wrapper.vm.$nextTick();
      await wrapper.vm.$nextTick();

      if (hasSiteKey) {
        expect(window.grecaptcha.execute).toHaveBeenCalled();
        expect(wrapper.vm.submit).not.toHaveBeenCalled();
      } else {
        expect(window.grecaptcha.execute).not.toHaveBeenCalled();
        expect(wrapper.vm.submit).toHaveBeenCalled();
      }
    });
  });
});

describe('extraDescription field visibility test', () => {
  beforeAll(() => {
    // disable making API requests when mounting TimeSlots view
    TimeSlots.beforeMount = jest.fn();
  });

  afterAll(() => {
    TimeSlots.beforeMount = beforeMount;
  });
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
              allowEventMetadata,
            };
          },
        },
      },
    });

    const launchOptions = {
      schedule: {
        meetingWindowId: 'meetingWindowId',
        formOptions: {
          extraDescription: { visible: setVisible },
        },
      },
    };

    await store.dispatch('initialize', {
      launchOptions,
    });

    const wrapper = getWrapper(TimeSlots, {
      store,
    });

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
