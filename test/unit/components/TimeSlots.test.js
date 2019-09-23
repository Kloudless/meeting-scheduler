import TimeSlots from 'view/components/TimeSlots';
import { EVENTS } from 'constants';
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

describe('if time slot start to load tests', () => {
  beforeAll(() => {
    // disable making API requests when mounting TimeSlots view
    TimeSlots.beforeMount = jest.fn();
  });

  afterAll(() => {
    TimeSlots.beforeMount = beforeMount;
  });
  test.each([
    ['already has time slots, hasMore = true', true, true, 1, 0, null],
    ['already has time slots, hasMore = false', true, false, 1, 1,
      ['loaded', 'complete']],
    ['no time slots, hasMore = true', false, true, 1, 0, null],
    ['no time slots, hasMore = false', false, false, 0, 1, null],
  ])('%s', async (_, hasAvailableSlots, hasMore, loadedCalledTimes,
    completeCalledTimes, calledOrder) => {
    // arrange
    const { store } = createStore({
      modules: {
        timeSlots: {
          initState() {
            return {
              availableSlots: hasAvailableSlots ? [1] : [],
              // [1] is to make length as 1, the element isn't important.
            };
          },
          actions: {
            getTimeSlots: () => (Promise.resolve(hasMore)),
          },
        },
      },
    });

    const infiniteHandlerState = {
      complete: jest.fn(),
      loaded: jest.fn(),
    };

    // act
    const wrapper = getWrapper(TimeSlots, {
      store,
    });
    wrapper.vm.$mount();
    await wrapper.vm.infiniteHandler(infiniteHandlerState);

    // assert
    expect(infiniteHandlerState.loaded)
      .toHaveBeenCalledTimes(loadedCalledTimes);
    expect(infiniteHandlerState.complete)
      .toHaveBeenCalledTimes(completeCalledTimes);

    if (calledOrder) {
      expect(infiniteHandlerState[calledOrder[0]])
        .toHaveBeenCalledBefore(infiniteHandlerState[calledOrder[1]]);
      expect(infiniteHandlerState[calledOrder[1]])
        .toHaveBeenCalledAfter(infiniteHandlerState[calledOrder[0]]);
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
