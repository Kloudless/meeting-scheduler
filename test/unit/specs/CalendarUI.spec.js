import CalendarUI from 'CalendarUI';

window.Kloudless = {
  authenticator: () => {},
};

describe('CalendarUI.js', () => {
  it('should launch calendar ui tool', () => {
    // arrange
    const myCalendar = new CalendarUI('appId', 'apiKey');
    myCalendar.launch();

    // act


    // assert

  });
});
