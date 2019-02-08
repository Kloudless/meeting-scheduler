# Kloudless Meeting Scheduler

The Kloudless Meeting Scheduler is a JavaScript library that allows your
users to create and schedule meetings using 
the [Kloudless Calendar API](https://developers.kloudless.com/docs/latest/calendar).

It currently integrates with:
* Google Calendar
* Outlook Calendar, and Exchange Online
* Exchange Server 2016+
* CalDAV

There are 2 modes available for this widget:

- The **Setup View**:
  Allows a user to connect their calendar via Kloudless and describe an event.
  Users can add event details and available time slots within the widget. 
  The widget then displays a public URL with a unique event ID to share with
  others to schedule the event.

- The **Schedule View**:
  Launches the widget with a specific Event ID. Users can choose from the
  event's available time slots to schedule an event on their calendar.
  A meeting invitation will be sent from the event organizer to the user.
  
[Visit our JSBin example of the Meeting Scheduler!](https://jsbin.com/juvizaz)

## Table of Contents
* [Supported Browsers](#supported-browsers)
* [Usage](#usage)
  * [Getting started](#getting-started)
  * [Embed the widget](#embed-the-widget)
  * [Launch the widget inside your app](!launch-the-widget-inside-your-app)
* [Examples](#examples)
  * [Launch the Setup View](#launch-the-setup-view)
  * [Launch the Setup View with a connected calendar account](#launch-the-setup-view-with-a-connected-calendar-account)
  * [Launch with Attach Mode](#launch-with-attach-mode)
  * [Customize the event URL format](#customize-the-event-url-format)
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
- Microsoft Edge

## Usage

### Getting started
A [Kloudless App](https://developers.kloudless.com/applications/*) is required to use
this widget.

### Embed the widget

Add the following iframe to your web page to launch the Setup View without
any additional code:

```html
<iframe src="https://api.kloudless.com/m/b/<app_id>" with="515px" height="695px">
```

Replace `<app_id>` with your Kloudless App ID. You can obtain the App ID by
visiting the
[App Details page](https://developers.kloudless.com/applications/*/details) of
the Kloudless developer portal.


For the `Schedule View`, the generated event URLs are also hosted by Kloudless,
so you don't need to do anything else.
(See [this example](#customize-the-event-url-format) for detailed explanation).


### Launch the widget inside your app

You can also include and launch the widget from within your web application.
Before doing so, **make sure you have added your website domain to
your App's list of `Trusted Domains` on the
[UI Tools Page](https://developers.kloudless.com/applications/*/ui-tools/file-explorer).**
This allows your web page to receive access tokens to the Kloudless API.

To include the widget on your page, add the following HTML tags:
```html
<link rel="stylesheet" href="https://static-cdn.kloudless.com/p/platform/sdk/kloudless.scheduler.css">
<script type="text/javascript" src="https://static-cdn.kloudless.com/p/platform/sdk/kloudless.scheduler.js"></script>
```

The script will expose a `window.Kloudless.scheduler` object that can be used to launch
the widget:

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

If you'd like to use the widget in your webpack project instead, it can
also be imported with ES6 import/export syntax as shown below. The CSS and JS
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
You can obtain an App ID by visiting the
[App Details page](https://developers.kloudless.com/applications/*/details)
of the Kloudless developer portal.

```javascript
scheduler.launch({
  appId: '<your_app_id>'
})
```

### Launch with Attach Mode
By default, a full-screen modal will be displayed when launching the widget.
You can also choose to attach the widget within any DOM element.

Set the `mode` option to `attach` and the `element` option to a CSS selector
for the DOM element you'd like the widget to be included within:


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

### Launch the Setup View with a connected calendar account
If you would like to launch the widget with an existing calendar account,
you can import the calendar with a specific Bearer token using the
widget's configuration options. The user will not need to connect an account
and the widget will instead use the imported account.

```javascript
scheduler.launch({
  appId: '<your_app_id>',
  accountToken: '<bearer_token>'
})
```

### Customize the event URL format
By default, the event URLs created by the Setup View are in the following format:
`https://kloudl.es/m/EVENT_ID`. Kloudless hosts this URL by default so your users
can launch the Schedule View to schedule events.

However, if you'd like to host your own page that launches the Schedule View, or
you'd like to customize the view in any way, you would need to
configure a custom event URL format by using the `eventUrlFormat` option.

The `eventUrlFormat` option is a template string that contains the text `EVENT_ID`
as a placeholder for the actual event ID. An example is shown below.

```javascript
scheduler.launch({
  appId: '<your_app_id>',
  eventUrlFormat: 'https://your.website/events/EVENT_ID',
})
```

The Meeting Scheduler will replace `EVENT_ID` to generate the appropriate URL for
each configured event.

Since the Schedule View is now accessible to users at a different URL, that page 
must take steps to launch the Schedule View as described below.

### Launch the Schedule View
Kloudless launches the Schedule View for users visiting hosted event pages automatically.
See how to [customize the event URL format](#customize-the-event-url-format) for more
information.

If you have set the `eventUrlFormat` option, you will need to write your own code
to parse the event ID from the URL and pass it to the widget in the `eventId` option:

```javascript
function getEventId() {
  /* your code here */
}

scheduler.launch({
  eventId: getEventId()
});
```

### And More
Check [launch(options)](#launch(options)) for a full list of available options and
their usage.



## Methods
### launch(options)
Launch the meeting scheduler widget

#### options
An object containing the following keys:
- `mode`: _Optional (default: 'modal')_: 'modal' or 'attach'  
  If set to 'modal', a modal window is shown and the widget is displayed
    inside the modal.  
  If set to 'attach', the widget is appended to the element specified in the
    `element` parameter. Failing to provide a valid `element` option will cause
    the widget to fail to be launched.
- `element`: _Required only for `attach` mode_: String or Element  
  The DOM element that the widget will be attached to. All contents under
  the element will be removed before attaching the widget.  
  If a String is provided, it will be used to retrieve the DOM element by using
  [document.querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector).  
  This option is ignored if `mode` is `modal`.
  - Example: [Launch with attach mode](#launch-with-attach-mode)

In addition to the common options above, the different modes available each have
their own options as described above

Setup View options:
- `appId`: _Required_: String  
  Your Kloudless application App ID.
  - An example is shown above: [Launch the Setup View](#launch-the-setup-view)
- `accountToken`: _Optional (default: null)_: String
  If you would like to launch the widget with an existing calendar account,
  you can import the calendar with a specific Bearer token using the
  `accountToken` option. The user will not need to connect an account
  and the widget will instead use this imported account.
  - Example: [Launch the Setup View with a connected calendar account](#launch-the-setup-view-with-a-connected-calendar-account)
- `eventUrlFormat`: _Optional (default: 'https://kloudl.es/m/EVENT_ID')_: String  
  A template string for the URL provided to users to schedule the event.  
  The `EVENT_ID` in the string will be replaced with the actual event ID.
  If not specified, the generated URL is `(Current URL)(& or ?)event=EVENT_ID`
  - Example: [Customize the event URL format](#customize-the-event-url-format)

Schedule View options:
- `eventId`: _Required_: String  
  The event ID generated when you the event was set up.
  - Example: [Launch the Schedule View](#launch-the-schedule-view)

### destroy()
Remove the configured meeting scheduler widget from the page and free up
memory used by the JavaScript.

## Contribute

### Development
Clone this repository
```bash
# install dependencies
yarn install

# By setting KLOUDLESS_APP_ID, the test page will populate `appId` automatically
export KLOUDLESS_APP_ID=<your_app_id>
# Set this if you'd like to specify a non-default Kloudless API server URL
export BASE_URL=<your_kloudless_api_server_url>

# serve with hot reload at localhost:8080
npm run dev
# or
npm start
```

When launching the dev server, the `eventUrlFormat` will be
`http://localhost:8080/eventId=EVENT_ID` by default. You can use this URL to test
the Schedule View locally.

### Building
```bash
# install dependencies
yarn install

# build for production with minification.
# the result will be in /dist.
npm run build

# Set this if you'd like to specify a non-default Kloudless API server URL
BASE_URL=<your_kloudless_api_server_url> npm run build

```

### Test the build
```bash
npm run dist-test

```
Open http://localhost:8080/test/dist to test the build

## Support

Feel free to contact us at support@kloudless.com with any feedback or questions.
