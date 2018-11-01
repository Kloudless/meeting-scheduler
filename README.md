# Kloudless Meeting Scheduler

The Kloudless Meeting Scheduler is a JavaScript library that allows your
users to create and schedule meetings using 
the [Kloudless Calendar API](https://developers.kloudless.com/docs/v1/calendar).


There are 2 modes available for this widget:

- **Setup View**:
  Allow users to connect their calendar via Kloudless and create an event.
  Users can setup event details and available time slots inside the widget. 
  After the event is created, a public URL with unique event ID is displayed,
  and this URL can be shared to others to schedule the event.

- **Schedule View**:
  Launch the widget with a specific Event ID, and users can schedule
  an event on their calendar. Users will be able to choose from
  available time slots.
  
[Visit our JSFiddle example of the Meeting Scheduler!](https://jsfiddle.net/Hong19/u0j3hmx7/show)

## Table of Contents
* [Supported Browsers](#supported-browsers)
* [Usage](#usage)
  * [Getting started](#getting-started)
  * [Embed the widget](#embed-the-widget)
  * [Launch the widget inside your app](!launch-the-widget-inside-your-app)
* [Examples](#examples)
  * [Launch the Setup View](#launch-the-setup-view)
  * [Launch the Setup View with connected calendar account](#launch-the-setup-view-with-connected-calendar-account)
  * [Launch with Attach Mode](#launch-with-attach-mode)
  * [Customize event URL format](#customize-event-url-format)
  * [Launch the Schedule View](#launch-the-schedule-view)
* [Methods](#methods)
  * [launch](#launchoptions)
  * [destroy](#destroy)
* [Contribute](#contribute)
  * [Development](#development)
  * [Building](#building)
  * [Test the build](#test-the-build)
* [Support](#support)

## Supported Browsers
- Google Chrome 70.0+
- Mozilla Firefox 63.0+

## Usage

### Getting started
A [Kloudless App](https://developers.kloudless.com/new) is required to use
this widget.

### Embed the widget

Add the following iframe to your web page to launch the Setup View without
any additional code:

```html
<iframe src="https://api.kloudless.com/m/b/<app_id>" with="515px" height="695px">
```

Replace `<app_id>` with your Kloudless App ID. You can get the App ID by
visiting
[App Details page](https://developers.kloudless.com/applications/*/details),
select your app and you can copy you App ID in the details.


For the `Schedule View`, the generated event URLs are also hosted by Kloudless,
so you don't need to do anything else.
(See [this example](#customize-event-url-format) for detailed explanation).


### Launch the widget inside your app

You can also include the widget and launch it from inside your app.
Before doing so, **make sure you have added your website domain to
your App's `Trusted DOMain` list in
[UI Tools Page](https://developers.kloudless.com/applications/*/ui-tools/file-explore).**

Then, to include the widget to your app:
```html
<link rel="stylesheet" href="https://static-cdn.kloudless.com/p/platform/sdk/kloudless.scheduler.css">
<script type="text/javascript" src="https://static-cdn.kloudless.com/p/platform/sdk/kloudless.scheduler.js"></script>
```

The script will expose `window.Kloudless.scheduler` object, you can then launch
the widget with this object:

```javascript
const scheduler = new window.Kloudless.scheduler();

// launch the Setup View
scheduler.launch({
  appId: '<your_app_id>'
})

// launch the Schedule View
scheduler.launch({
  eventId: '<your_event_id>'
})
```

Optionally, if you'd like to use the widget in your webpack project, it can
also be imported with ES6 import / export syntax as shown below. The CSS and JS
files to use will be located in `dist/` after executing a build as described in
the [Building](#building) section.

```javascript
import './meeting-scheduler.min.css';
import MeetingScheduler from './meeting-scheduler.min.js';

const scheduler = new MeetingScheduler();

// launch the Setup View
scheduler.launch({
  appId: '<your_app_id>'
})

// launch the Schedule View
scheduler.launch({
  eventId: '<your_event_id>'
})
```

## Examples

### Launch the Setup View
A Kloudless App ID is required to launch the Setup View.
You can get your App ID by visiting
[App Details page](https://developers.kloudless.com/applications/*/details),
select your app and you can copy you App ID in the details.

```javascript
scheduler.launch({
  appId: '<your_app_id>'
})
```

### Launch with Attach Mode
By default, a full-screen modal will be displayed when launching the widget.
You can also choose to attach the widget within any DOM element.

Set the `mode` option to `attach`, and provide the CSS selector to the DOM
element you'd like the widget to be attached with the `element` option:


```html
<div id="kloudless-meeting-scheduler"></div>
```

```javascript
scheduler.launch({
  appId: '<your_app_id>',
  mode: 'attach',
  element: "#kloudless-meeting-scheduler"
});
```


```javascript
scheduler.launch({
  appId: '<your_app_id>'
})
```

### Launch the Setup View with connected calendar account
If you would like to launch the widget with an existing calendar account,
you can import the calendar with a specified Bearer token in the
widget's configuration options. Users will not need to connect an account
and will instead use the imported account.

```javascript
scheduler.launch({
  appId: '<your_app_id>',
  accountToken: '<bearer_token>'
})
```

### Customize event URL format
By default, the created event URL is in the following format:
`https://kloudl.es/m/EVENT_ID`. Kloudless hosts this URL by default
for the developer, so users can schedule events.

However, if you'd like to host your own schedule event page,
or if you are using self-hosted Kloudless API Server, you would need to
setup the widget with your own event URL format by using `eventUrlFormat`.

`eventUrlFormat` option is a string contains `EVENT_ID` as the placeholder
for the actual event id when creating events. For ecxample:

```javascript
scheduler.launch({
  appId: '<your_app_id>',
  eventUrlFormat: 'https://your.website/events/EVENT_ID',
})
```


### Launch the Schedule View
If you are using the default public event URL format, you don't need additional
code to launch the Schedule View, Kloudless will handle schedule view when
users open the event URL
(see [Customize event URL format](#customize-event-url-format)).

If you have set `eventUrlFormat` option, you will need to write your own code
to parse event id from URL and pass it to the widget by using `eventId` option:

```javascript
function getEventId() {
  /* your code here */
}

scheduler.launch({
  eventId: getEventId()
});
```

### And More
Check [launch(options)](#launch(options)) for full list of available options and
usage.



## Methods
### launch(options)
Launch the meeting scheduler widget

#### options
An object containing the following keys:
- `mode`: _Optional (default: 'modal')_: 'modal' or 'attach'  
  If set to 'modal', a modal window is shown and the widget is displayed
    inside the modal.  
  If set to 'attach', the widget is appended to the element specified in
    `element` parameter. Failing to provide a valid `element` option will cause
    the widget failed to be launched.
- `element`: _Required only for `attach` mode_: String or Element  
  The DOM element that the widget will be attached to. All contents under
  the element will be removed before attaching the widget.  
  If a String is provided, it will be used to retrieve the DOM element by using
  [document.querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector).  
  This option is ignored if `mode` is `modal`.
  - Example: [Launch with attach mode](#launch-with-attach-mode)

- If you'd like to launch the Setup View, provide:
  - `appId`: _Required_: String  
    Your Kloudless application App ID.
    - Example: [Launch the Setup View](#launch-the-setup-view)
  - `accountToken`: _Optional (default: null)_: String
  If you have connected a calendar account to your application, the widget can
  launch automatically with the account Bearer token.
    - Example:
    [Launch the Setup View with connected calendar account](#launch-the-setup-view-with-connected-calendar-account)
  - `eventUrlFormat`: _Optional (default: 'https://kloudl.es/m/EVENT_ID')_:
  String  
    A string to represent format of the generated event URL.  
    The `EVENT_ID` in the string will be replaced with actual event id.
    If not specified, the generated URL is `(Current URL)(& or ?)event=EVENT_ID`
    - Example: [Customize event URL format](#customize-event-url-format)
- If you'd like to launch the Schedule View, provide:
  - `eventId`: _Required_: String  
    The event ID generated when you created the event.
    - Example: [Launch the Schedule View](#launch-the-schedule-view)

### destroy()
Destroy the meeting scheduler widget

## Contribute

### Development
Clone this repository
```bash
# install dependencies
yarn install

# by setting KLOUDLESS_APP_ID, the test page will fill up appId automatically
export KLOUDLESS_APP_ID=<your_app_id>
# Set this if you'd like to specify Kloudless API server URL
export BASE_URL=<your_kloudless_api_server_url>

# serve with hot reload at localhost:8080
npm run dev
# or
npm start
```

When launching the dev server, by default the `eventUrlFormat` will be `http://localhost:8080/eventId=EVENT_ID`, you can use this URL to test
the Schedule View locally.

### Building
```bash
# install dependencies
yarn install

# build for production with minification
# the result will be in /dist
npm run build

# If you'd like to specify Kloudless API server URL
BASE_URL=<your_kloudless_api_server_url> npm run build

```

### Test the build
```bash
npm run dist-test

```
Open http://localhost:8080/test/dist to test the build

## Support

Feel free to contact us at support@kloudless.com with any feedback or questions.
