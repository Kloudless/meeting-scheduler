/* eslint-disable no-console */
import buildCustomStyle from 'view/custom-style';

const SCRIPT_SELECTOR = 'script[src="./less.js"]';
const LESS_SOURCE_SELECTOR = 'link[id="custom-style-vars"]';

describe('Custom style builder tests', () => {
  beforeEach(() => {
    document.head.innerHTML = '';
    document.body.innerHTML = '';
    // Simulate loading less script initialize window.less.
    const originBodyAppend = document.body.append.bind(document.body);
    document.body.append = jest.fn((el) => {
      originBodyAppend(el);
      window.less = {
        registerStylesheetsImmediately: jest.fn(),
        modifyVars: jest.fn().mockResolvedValue(),
      };
      el.onload();
    });
    console.error = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    delete window.less;
    document.head.innerHTML = '';
    document.body.innerHTML = '';
  });

  test('Should resolve when less.js cannot be not loaded', async () => {
    document.body.append.mockImplementationOnce(el => el.onerror());
    await buildCustomStyle({ primary: 'red' });
    expect(console.error).toBeCalled();
  });

  test.each([
    [
      'Should resolve when window.less.registerStylesheetsImmediately failed',
      false, true,
    ],
    [
      'Should resolve when window.less.modifyVars failed',
      true, false,
    ],
  ])('%s', async (_, registerStylesheetsResult, modifyVarsResult) => {
    const mockRegisterStylesheetsImmediately = jest.fn();
    const mockModifyVars = jest.fn().mockResolvedValue();
    if (!registerStylesheetsResult) {
      mockRegisterStylesheetsImmediately.mockImplementation(
        () => { throw new Error('fake error'); },
      );
    }
    if (!modifyVarsResult) {
      mockModifyVars.mockRejectedValue();
    }
    const originBodyAppend = document.body.append.bind(document.body);
    document.body.append.mockImplementationOnce((el) => {
      originBodyAppend(el);
      window.less = {
        registerStylesheetsImmediately: mockRegisterStylesheetsImmediately,
        modifyVars: mockModifyVars,
      };
      el.onload();
    });
    await buildCustomStyle({ primary: 'red' });
    expect(console.error).toBeCalled();
  });

  test('Should resolve after style is compiled', async () => {
    const customStyleVars = { primary: 'red' };
    await buildCustomStyle(customStyleVars);
    const scripts = document.querySelectorAll(SCRIPT_SELECTOR);
    const links = document.querySelectorAll(LESS_SOURCE_SELECTOR);
    expect(scripts.length).toBe(1);
    expect(links.length).toBe(1);
    expect(window.less.registerStylesheetsImmediately).toBeCalledTimes(1);
    expect(window.less.modifyVars).toBeCalled();
    expect(window.less.modifyVars.mock.calls[0][0])
      .toMatchObject(customStyleVars);
    expect(console.error).not.toBeCalled();
  });

  test('Do not load <script> and <link> if already exist', async () => {
    await buildCustomStyle({ primary: 'red' });
    const scripts = document.querySelectorAll(SCRIPT_SELECTOR);
    const links = document.querySelectorAll(LESS_SOURCE_SELECTOR);
    expect(scripts.length).toBe(1);
    expect(links.length).toBe(1);

    await buildCustomStyle({ primary: 'blue' });
    const scripts2 = document.querySelectorAll(SCRIPT_SELECTOR);
    const links2 = document.querySelectorAll(LESS_SOURCE_SELECTOR);
    expect(scripts).toEqual(scripts2);
    expect(links).toEqual(links2);
  });
});
