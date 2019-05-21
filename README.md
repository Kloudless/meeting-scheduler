# Kloudless Meeting Scheduler

The Kloudless Meeting Scheduler is a JavaScript library that allows your users
to create and schedule meetings with each other. There are two main parts to the
Meeting Scheduler:
* First, the organizer sets up the meeting details: name, location, duration,
and recurrence. The organizer will then connect their calendar to monitor any
meeting conflicts in real-time. The organizer will lastly receive a link to
invite attendees when finished with the setup.
* Second, a user will choose available time slots and confirm the meeting.

The Meeting Scheduler is currently compatible with the following calendar
providers using the
[Kloudless Calendar API](https://kloudless.com/products/calendar/):
* Google Calendar
* Outlook Calendar, and Exchange Online
* Exchange Server 2016+
* CalDAV

**Integrate the Kloudless Meeting Scheduler widget into your app today** by
[creating a Kloudless app](#https://developers.kloudless.com/applications/*/details),
using our [zero-configuration embed script](#embed-the-widget), or
[importing and customizing it into your app](embed-the-widget-with-configuration)!

### [Click here to visit our Meeting Scheduler demo!](https://jsbin.com/juvizaz)

<p align="center">
  <img src="img/setup_view.gif" height="500" alt="Create Events"/>
  <img src="img/schedule_view.gif" height="500" alt="Schedule events"/><br/>
</p>

## Table of Contents
- [Supported Browsers](#supported-browsers)
- [Views](#views)
  - [The **Setup View**:](#the-setup-view)
  - [The **Schedule View**:](#the-schedule-view)
- [Getting Started](#getting-started)
  - [Create a Kloudless App](#create-a-kloudless-app)
  - [Embed the widget](#embed-the-widget)
  - [Configuration of the Embedded Widget](#configuration-of-the-embedded-widget)
    - [Setup Trusted Domains for your Kloudless App](#setup-trusted-domains-for-your-kloudless-app)
    - [Import the Stylesheet and Script](#import-the-stylesheet-and-script)
- [Configuration Examples](#configuration-examples)
  - [Launch the Setup View](#launch-the-setup-view)
  - [Launch with Attach Mode](#launch-with-attach-mode)
  - [Launch the Setup View with a Connected Calendar Account](#launch-the-setup-view-with-a-connected-calendar-account)
  - [Customize the event URL format](#customize-the-event-url-format)
  - [Launch the Schedule View](#launch-the-schedule-view)
  - [And More...](#and-more)
- [Methods](#methods)
  - [launch\(options\)](#launchoptions)
    - [options](#options)
  - [destroy\(\)](#destroy)
  - [Kloudless.scheduler.setOptions\(options\)](#kloudlessschedulersetoptionsoptions)
  - [Kloudless.scheduler.getOptions\(\)](#kloudlessschedulergetoptions)
  - [Kloudless.scheduler.version](#kloudlessschedulerversion)
- [Contribute](#contribute)
  - [Development](#development)
  - [Building](#building)
    - [Host the scheduler page](#host-the-scheduler-page)
    - [Build options](#build-options)
  - [Test the build](#test-the-build)
- [Support](#support)
- [Changelog](#changelog)

## Supported Browsers
- Google Chrome 70.0+
- Mozilla Firefox 63.0+
- Microsoft Edge

## Views
There are 2 modes available for the Kloudless Meeting Scheduler widget.

### The **Setup View**:
  Allows the user to connect their calendar via Kloudless and describe an event.
  Users can add event details and available time slots in the widget.
  The widget then displays a public URL with a unique event ID to share with
  others to schedule the event.

  <p align="center">
    <img src="img/setup_view.gif" height="500" />
  </p>

### The **Schedule View**:
  Launches the widget with a specific Event ID. Users can choose from the
  event's available time slots to schedule an event on their calendar.
  A meeting invitation will be sent from the event organizer to the user.

  <p align="center">
    <img src="img/schedule_view.gif" height="500" />
  </p>

## Getting Started

### Create a Kloudless App

A [Kloudless App](https://developers.kloudless.com/applications/*) is required
to use the Kloudless Meeting Scheduler widget.

### Embed the widget

Add the following iframe to your web page to launch the Setup View without
any additional code:

```html
<iframe src="https://kloudl.es/m/b/<app_id>" with="515px" height="695px">
```

Replace `<app_id>` with your Kloudless App ID. You can obtain the App ID by
visiting the
[App Details page](https://developers.kloudless.com/applications/*/details) of
the Kloudless developer portal.

The events created by the widget use URLs hosted by Kloudless,
so you don't need to do anything else.
(See [this example](#customize-the-event-url-format) for detailed explanation).

### Configuration of the Embedded Widget

To launch the widget with additional options, follow the steps below to integrate
the widget into your app:

#### Import the Stylesheet and Script

To launch the widget with additional options, you will need to include the widget's
stylesheet and script:
```html
<link rel="stylesheet" href="https://static-cdn.kloudless.com/p/platform/sdk/kloudless.scheduler.css">
<script type="text/javascript" src="https://static-cdn.kloudless.com/p/platform/sdk/kloudless.scheduler.js"></script>
```

The script will expose a `window.Kloudless.scheduler` object that can be used
to launch the widget:

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

If you'd like to use the widget in your webpack project instead, it can also
be imported with the ES6 import/export syntax, as shown below. The
CSS and JS files can be found in `dist/` after building the code as
described in the [Building](#building) section.

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

Check the [configuration examples below](#configuration-examples) to see how the
options can be configured in `scheduler.launch()` for different scenarios.

## Configuration Examples

### Launch the Setup View
A Kloudless App ID is required to launch the Setup View. You can obtain an
App ID by visiting the
[App Details page](https://developers.kloudless.com/applications/*/details)
of the Kloudless developer portal.

```javascript
scheduler.launch({
  appId: '<your_app_id>'
})
```

### Launch with Attach Mode
By default, the widget will launch as a full-screen modal display. You can
choose to attach the widget to any DOM element instead as well.

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

### Launch the Setup View with a Connected Calendar Account
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
if you'd like to customize the view in any way, you would need to
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
Kloudless launches the Schedule View for users visiting hosted event pages
automatically. See how to
[customize the event URL format](#customize-the-event-url-format) for more
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

### And More...
For more examples, check [launch(options)](#launch(options)) for a full list
of available options and their usage.

## Methods

### launch(options)
Launch the meeting scheduler widget.

#### options
An object containing the following keys:
- `mode`: _Optional (default: 'modal')_: 'modal' or 'attach'
  If set to 'modal', a modal window is shown and the widget is displayed
    inside the modal.
  If set to 'attach', the widget will be attached to the element specified in
  the `element` parameter. Failing to provide a valid `element` option will
  cause the widget to fail to be launched.
- `element`: _Required only for `attach` mode_: String or Element
  The DOM element that the widget will be attached to. All contents under
  the element will be removed before attaching the widget.
  If a String is provided, it will be used to retrieve the DOM element by using
  [document.querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector).
  This option is ignored if `mode` is `modal`.
  - Example: [Launch with attach mode](#launch-with-attach-mode)
- `events`: _Optional_: Object
an object to specify event callbacks, check [Events](#events) section for
available events. Object format: {[event_name]: callback_function}
  - *The callback function* would receive an object as the first argument, with
  the following properties:
     - scheduler: MeetingScheduler instance that received the event
     - event data for the event will be attached as additional keys to this
     object, please reference to [Event List](#event-list) for details.

In addition to the common options above, each of the different modes available
have their own options as described below.

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
  The event ID generated when the event is set up.
  - Example: [Launch the Schedule View](#launch-the-schedule-view)

### destroy()
Remove the configured meeting scheduler widget from the page and free up memory.


### Kloudless.scheduler.setOptions(options)

Set global options. The widget is configured to work with default values, so
these options should only be set when needed. Available options:
- `baseUrl`: _String_, Kloudless API server URL, you only need this when
hosting your own Kloudless API server.
- `schedulerPath`: _String_, URL that hosts the scheduler page, you only need
this when hosting the embedded scheduler page. See
[Host the scheduler page](#host-the-scheduler-page) for more information.

### Kloudless.scheduler.getOptions()

Get the global options object.

### Kloudless.scheduler.version

Return version number string.

## Contribute

### Development
Clone this repository
```bash
# install dependencies
npm install

# By setting KLOUDLESS_APP_ID, the test page will populate `appId` automatically
export KLOUDLESS_APP_ID=<your_app_id>
# Set this if you'd like to specify a non-default Kloudless API server URL
export BASE_URL=<your_kloudless_api_server_url>

# serve with hot reload at localhost:8080
npm run dev
# or
npm start
```

Then, run the Vue debug server to debug with the widget:
```
npm run vue-devtools
```
If you encounter issues when inspecting components, try to click the refresh
button on the top right.

When launching the dev server, the `eventUrlFormat` will be
`http://localhost:8080/eventId=EVENT_ID` by default.
You can use this URL to test the Schedule View locally.

### Building
```bash
# install dependencies
npm install

# build for production with minification.
# the result will be in /dist.
npm run build
```


#### Host the scheduler page

The build contains a `scheduler` folder which renders the actual HTML and
functionalities of the widget; by default, this is hosted by Kloudless. If
you would like to host it yourself, you can set `SCHEDULER_PATH` under build
options to specify the scheduler hosting URL, or use
`Kloudless.scheduler.setOptions` in runtime.

You will need to add your website domain to your Kloudless app's list of
`Trusted Domains` on the
[App Detail Page](https://developers.kloudless.com/applications/*/details/).

This allows the hosted scheduler to receive access tokens to the Kloudless API.

#### Build options

You can use environment variables to configure the build, for example:
```
# Set this if you'd like to specify a non-default Kloudless API server URL
BASE_URL=<your_kloudless_api_server_url> npm run build

```

Variable Name | Purpose | Default
----|---|---
BASE_URL | URL to Klodless API Server | https://api.kloudless.com
SCHEDULER_PATH | URL for the scheduler page | https://static-cdn.kloudless.com/p/platform/scheduler/index.html
SCHEDULE_URL | Default event URL format | https://kloudl.es/m/s/EVENT_ID


### Test the build
```bash
npm run dist-test

```
Open http://localhost:8080/test/dist to test the build

## Support

Feel free to contact us at support@kloudless.com with any feedback or questions.


## Changelog

- 1.1
  - Update README
  - Fixed: Available times were off due to daylight saving timezone
  - Render the widget inside iframe to preserve layout
  - Add new build options
  - Add setOptions to configure global options in runtime
- 1.0.0
  - Initial release
