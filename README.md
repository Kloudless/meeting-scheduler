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
- [Terminology](#terminology)
  - [Views](#views)
    - [The **Setup View**:](#the-setup-view)
    - [The **Schedule View**:](#the-schedule-view)
  - [Meeting Window](#meeting-window)
- [Getting Started](#getting-started)
  - [Create a Kloudless App](#create-a-kloudless-app)
  - [Embed the Widget](#embed-the-widget)
  - [Embedded Widget Configuration](#embedded-widget-configuration)
    - [Setup Trusted Domains for Your Kloudless App](#setup-trusted-domains-for-your-kloudless-app)
    - [Import the Stylesheet and Script](#import-the-stylesheet-and-script)
- [Configuration Examples](#configuration-examples)
  - [Launch the Setup View](#launch-the-setup-view)
  - [Launch with Attach Mode](#launch-with-attach-mode)
  - [Launch the Setup View with a Connected Calendar Account](#launch-the-setup-view-with-a-connected-calendar-account)
  - [Customize the Schedule URL](#customize-the-schedule-url)
  - [Launch the Schedule View](#launch-the-schedule-view)
  - [Configure the Scheduler Beforehand](#configure-the-scheduler-beforehand)
  - [Customize the Re-Schedule URL](#customize-the-re-schedule-url)
- [Advanced Usage](#advanced-usage)
  - [Handling Events](#handling-events)
  - [Save the Connected Account's Access Token](#save-the-connected-accounts-access-token)
  - [Edit Meeting Window](#edit-meeting-window)
  - [Edit Scheduled Event](#edit-scheduled-event)
  - [Display Your Own Result Screen](#display-your-own-result-screen)
  - [Auto-fill Form Fields](#auto-fill-form-fields)
  - [Customize UI Styling](#customize-ui-styling)
  - [Fix the Account and Calendar Used When Creating Meeting Window](#fix-the-account-and-calendar-used-when-creating-meeting-window)
  - [Customizing Scheduled Events](#customizing-scheduled-events)
    - [Customizing During Meeting Window Setup](#customizing-during-meeting-window-setup)
    - [Customizing During Scheduling](#customizing-during-scheduling)
  - [And More...](#and-more)
- [Methods](#methods)
  - [config(options)](#configoptions)
    - [options](#options)
  - [launch(options?)](#launchoptions)
  - [destroy()](#destroy)
  - [Kloudless.scheduler.setOptions(options)](#kloudlessschedulersetoptionsoptions)
    - [options](#options-1)
  - [Kloudless.scheduler.getOptions()](#kloudlessschedulergetoptions)
  - [Kloudless.scheduler.getQueryParams()](#kloudlessschedulergetqueryparams)
  - [Kloudless.scheduler.version](#kloudlessschedulerversion)
- [Events](#events)
  - [Event List](#event-list)
    - [open](#open)
    - [close](#close)
    - [destroyed](#destroyed)
    - [connectAccount](#connectaccount)
    - [removeAccount](#removeaccount)
    - [preSubmitMeetingWindow](#presubmitmeetingwindow)
    - [submitMeetingWindow](#submitmeetingwindow)
    - [deleteMeetingWindow](#deletemeetingwindow)
    - [preSchedule](#preschedule)
    - [schedule](#schedule)
    - [restart](#restart)
    - [error](#error)
- [Meeting Window API](#meeting-window-api)
  - [Object Definition](#object-definition)
    - [Meeting Window Object](#meeting-window-object)
    - [Availability](#availability)
  - [Authentication](#authentication)
  - [Endpoints](#endpoints)
  - [Monitoring Scheduled Events](#monitoring-scheduled-events)
    - [WebHooks](#webhooks)
    - [Activity Stream Endpoint](#activity-stream-endpoint)
- [Migration Guide](#migration-guide)
  - [From v1.0, v1.1 to v1.2 and above](#from-v10-v11-to-v12-and-above)
- [Contribute](#contribute)
  - [Development](#development)
  - [Building](#building)
    - [Host the Scheduler Page](#host-the-scheduler-page)
    - [Build Options](#build-options)
  - [Test the Build](#test-the-build)
- [Support](#support)
- [Changelog](CHANGELOG.md)

## Supported Browsers
- Google Chrome 70.0+
- Mozilla Firefox 63.0+
- Microsoft Edge
- Safari 11.1.2+

## Terminology

### Views
There are 2 modes available for the Kloudless Meeting Scheduler widget.

#### The **Setup View**:
  Allows the user to connect their calendar via Kloudless and describe an event.
  Users can add event details and available time slots in the widget.
  The widget then displays a public URL with a unique ID to share with
  others to schedule the event.

  <p align="center">
    <img src="img/setup_view.gif" height="500" />
  </p>

#### The **Schedule View**:
  Launches the widget with a specific Event ID. Users can choose from the
  event's available time slots to schedule an event on their calendar.
  A meeting invitation will be sent from the event organizer to the user.

  <p align="center">
    <img src="img/schedule_view.gif" height="500" />
  </p>

### Meeting Window

A Meeting Window contains detailed information for a event, such
as the event title, location, host's calendar and host's availability.
This object is created when user clicks "Create Event" from the Setup View.

The information in this object is then used to schedule events in the
Schedule View.

## Getting Started

### Create a Kloudless App

A [Kloudless App](https://developers.kloudless.com/applications/*) is required
to use the Kloudless Meeting Scheduler widget.

### Embed the Widget

Add the following iframe to your web page to launch the Setup View without
any additional code:

```html
<iframe src="https://kloudl.es/m/b/<app_id>" width="515px" height="695px">
```

Replace `<app_id>` with your Kloudless App ID. You can obtain the App ID by
visiting the
[App Details page](https://developers.kloudless.com/applications/*/details) of
the Kloudless developer portal.

The events created by the widget use URLs hosted by Kloudless,
so you don't need to do anything else.
(See [this example](#customize-the-event-url-format) for detailed explanation).

### Embedded Widget Configuration

To launch the widget with additional options, follow the steps below to integrate
the widget into your app:

#### Setup Trusted Domains for Your Kloudless App

You need to add your website's domain to your Kloudless app's list of
`Trusted Domains` on the [App Detail Page](https://developers.kloudless.com/applications/*/details/).
This allows your web page to receive access tokens to the Kloudless API.


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
  appId: '<your_app_id>',
  setup: {}
})

// launch the Schedule View
scheduler.launch({
  appId: '<your_app_id>',
  schedule: {
    // meetingWindowId is returned from Setup View
    meetingWindowId: '<meeting_window_id>'
  }
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
  appId: '<your_app_id>',
  setup: {}
})

// launch the Schedule View
scheduler.launch({
  appId: '<your_app_id>',
  schedule: {
    // meetingWindowId is returned from Setup View
    meetingWindowId: '<meeting_window_id>'
  }
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

To launch the Setup view, set the `setup` property as an empty object to apply
default settings:

```javascript
scheduler.launch({
  appId: '<your_app_id>',
  setup: {},
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
  element: '#kloudless-meeting-scheduler',
  setup: {},
});
```

### Launch the Setup View with a Connected Calendar Account
If you would like to launch the widget with an existing calendar account,
you can import the calendar with a specific Bearer token using the
widget's configuration options. The user will not need to connect an account
and the widget will instead use the imported account.

```javascript
scheduler.launch({
  appId: '<your_app_id>',
  setup: {
    accountToken: '<account_bearer_token>'
  }
})
```

### Customize the Schedule URL
By default, after creating a [Meeting Window](#meeting-window) in the Setup View,
a URL link with the format `https://kloudl.es/m/MEETING_WINDOW_ID` is generated.
Kloudless hosts this URL by default so your users can use this URL to launch
the Schedule View and schedule events.

However, if you'd like to host your own page that launches the Schedule View, 
or if you'd like to customize the view in any way, you would need to
configure the schedule URL by using the `scheduleUrl` option.

The `scheduleUrl` option is a template string that contains the text
`MEETING_WINDOW_ID` as a placeholder for the actual Meeting Window ID.
An example is shown below.

```javascript
scheduler.launch({
  appId: '<your_app_id>',
  setup: {
    scheduleUrl: 'https://your.website/?meetingWindowId=MEETING_WINDOW_ID'
  }
})
```

The Meeting Scheduler will replace `MEETING_WINDOW_ID` with an actual ID
to generate the appropriate URL for each Meeting Window.

Since the Schedule View is now accessible to users at a different URL, that page
must take steps to launch the Schedule View as described below.

### Launch the Schedule View
Kloudless launches the Schedule View for users visiting hosted event pages
automatically. See how to
[customize the schedule URL](#customize-the-schedule-url) for more
information.

If you have the `scheduleUrl` option set and put meeting window id as a
query param, you can use `getQueryParams` helper method to retrieve it:

```javascript
// assume meeting window id is specified in meetingWindowId query param
const { meetingWindowId } = window.Kloudless.scheduler.getQueryParams();
scheduler.launch({
  appId: '<your_app_id>',
  schedule: {
    meetingWindowId: meetingWindowId
  }
});
```

### Configure the Scheduler Beforehand
The above examples use `launch(options)` to configure and launch the scheduler.
If you would like to configure and verify the options, but not launch the view
immediately, you can use `config(options)` instead:

```javascript
scheduler.config({
  appId: '<your_app_id>',
  setup: {
    // you setup options here
  }
});
/* do other things */
scheduler.launch();
```

### Customize the Re-Schedule URL
By default, after scheduling an event in the Schedule View, a URL link with the
format `https://kloudl.es/m/s/SCHEDULED_EVENT_ID` is generated.
Kloudless hosts this URL by default so your users can use this URL to launch
the Schedule View and re-schedule events.

However, if you'd like to host your own page that launches the Schedule View, 
or if you'd like to customize the view in any way, you would need to
configure the re-schedule URL by using the `rescheduleUrl` option.

The `rescheduleUrl` option is a template string that contains the text
`SCHEDULED_EVENT_ID` as a placeholder for the scheduled event.
An example is shown below.

```javascript
scheduler.launch({
  appId: '<your_app_id>',
  schedule: {
    rescheduleUrl: 'https://your.website/?scheduledEventId=SCHEDULED_EVENT_ID'
  }
})
```

The Meeting Scheduler will replace `SCHEDULED_EVENT_ID` with an actual ID to
generate the appropriate URL for each scheduled event.

Since the Schedule View is now accessible to users at a different URL, please
refer to [Edit Scheduled Event](#edit-scheduled-event) for details on
launching the Schedule View in edit mode.

## Advanced Usage

### Handling Events

Your app can listen to the Meeting Scheduler's events to receive data created
from the widget or perform certain actions at a desired time.

```js
scheduler.on('open', (eventData) => {
  console.log('Scheduler', eventData.scheduler, 'is launched!');
});
```

Refer to the [Event List](#event-list) for available events and data provided 
for each event.

### Save the Connected Account's Access Token

Make sure you have 
[setup trusted domains for your app](#setup-trusted-domains-for-your-kloudless-app),
otherwise your app won't receive access tokens.

To receive the connected account's access token from your app, add an event
listener for the connectAccount event:

```js
scheduler.on('connectAccount', (eventData) => {
  console.log('Account', eventData.account, 'is connected.');
  console.log('Account Token:', eventData.accountToken);
  // save the token into your App, or make additional requests with this token
});
```

This can be useful for making additional requests to the Kloudless API 
with your app (connected to the calendar account).


### Edit Meeting Window

To edit a Meeting Window, you need to provide both the `accountToken` and
`meetingWindowId`, which are all returned from the `submitMeetingWindow` event
when a user creates a Meeting Window from the Setup View.

```js
scheduler.on('submitMeetingWindow', (eventData) => {
  // put your own code to record account token and meeting window id
  console.log('Account Token:', eventData.accountToken);
  console.log('Meeting Window ID:', eventData.meetingWindow.id);
});
scheduler.launch({
  appId: '<your_app_id>',
  setup: {},
});
```

To launch Edit Mode, pass these two values back to scheduler:
```js
scheduler.launch({
  appId: '<your_app_id>',
  setup: {
    accountToken: '<saved_account_token>',
    meetingWindowId: '<saved_meeting_window_id>'
  },
});
```

### Edit Scheduled Event

To edit a scheduled event, provide the `scheduledEventId` attribute, which is
returned in the callback to the `schedule` event when a user schedules a
meeting from the Schedule View.

```js
scheduler.on('schedule', (eventData) => {
  console.log('Scheduled Event ID:', eventData.scheduled_event_id);
});
scheduler.launch({
  appId: '<your_app_id>',
  schedule: {
    meetingWindowId: '<your_meeting_window_id>'
  },
});
```

To launch the Edit Mode, pass `scheduledEventId` back to the Scheduler:
```js
scheduler.launch({
  appId: '<your_app_id>',
  schedule: {
    scheduledEventId: '<saved_scheduled_event_id>'
  },
});
```


### Display Your Own Result Screen

If you'd like to provide your own result screen instead of the default one,
use the `afterSubmit.showResult` option to destroy the view, instead of showing
the result after the submit event. You will need to add an event listener to the
`submitMeetingWindow` event so that your app is notified when user finishes
creating / editing a Meeting Window:

```js
scheduler.launch({
  appId: '<your_app_id>',
  setup: {
    afterSubmit: {
      showResult: false
    }
  }
});

scheduler.on('submitMeetingWindow', (eventData) => {
  console.log('Meeting Window details:', eventData.meetingWindow);
  console.log('Schedule URL:', eventData.scheduleUrl);
  // create your own result screen here
})

```

Similarly, it is also possible to provide your own screen for the Schedule View
instead of using the default one:

```js
scheduler.launch({
  appId: '<your_app_id>',
  schedule: {
    afterSchedule: {
      showResult: false
    }
  }
});

scheduler.on('schedule', (eventData) => {
  console.log('calendar event details:', eventData.scheduledEvent);
  // create your own result screen here
})

```


Refer to the [submitMeetingWindow](#submitmeetingwindow) and
[schedule](#schedule) event for more details.


### Auto-fill Form Fields

The form in both views can be filled in automatically with values set in 
the launch options. We've included an example below that sets default field
values:

- For Setup View:
  ```js
  scheduler.launch({
    appId: '<your_app_id>',
    setup: {
      formOptions: {
        title: { default: "title" },
        description: { default: "description" },
        location: { default: "location" },
        duration: { default: 60 },
        organizer: { default: "shirley" },
        weekday: { default: ["MON", "TUE", "FRI"] },
        startHour: { default: "12:00:00" },
        endHour: { default: "14:00:00" },
        timeSlotInterval: { default: 60 },
        availabilityRange: { default: 60 },
        timeBufferBefore: { default: 30 },
        timeBufferAfter: { default: 10 }
      }
    }
  });
  ```

- For Schedule View:
  ```js
  scheduler.launch({
    appId: '<your_app_id>',
    schedule: {
      meetingWindowId: '<your_meeting_window_id>',
      formOptions: {
        name: { default: "Johnny Appleseed" },
        email: { default: "youremail@example.com" }
      }
    }
  });
  ```

Refer to [options](#options) for details.

### Customize UI Styling

You can customize how the Meeting Scheduler looks by utilizing the 
`customStyleVars` configuration option. This attribute should contain an object
of the format `{[variableName]: value}`, where `[variableName]` refers to a
LESS variable listed in the
[variables.less file in the source code](src/view/less/variables.less). The
`variables.less` file also includes notes on the purpose of each variable.

Here is an example where the Meeting Scheduler uses a dark theme
with the primary text font changed to
[Calistoga](https://fonts.google.com/specimen/Calistoga):

<p align="center">
  <img src="img/custom_style_example.png" height="500" />
</p>

Here is the corresponding JS configuration with the custom LESS variables used
to alter the color scheme and font:

```js
{
  scheduler.launch({
    appId:
    customStyleVars: {
      primary: "#FFEE58",
      background: "#37474F",
      secondary: "#FFCA28",
      surface: "#26C6DA",
      error: "#EF5350",
      onPrimary: "white",
      onSecondary: "#BDBDBD",
      onPrimaryVariant: "black",
      onSecondaryVariant: "#78909C",
      disabled: "#dcdcdc",
      fontFaceName: "'Calistoga'",
      fontFacePath: "'https://fonts.gstatic.com/s/calistoga/v1/6NUU8F2OJg6MeR7l4e0fs8wB49dJfg.woff2'",
      fontFaceFormat: "'woff2'",
      fontFamily: "'Calistoga', 'sans-serif'"
    },
    setup: {}
  });
}
```

Notes:
* It is unnecessary to include the `@` symbol usually prefixed to LESS
  variable names when specifying the variable names as attributes in the 
  `customStyleVars` object.
* String properties such as the font family and font face URL require an
  **additional** set of quotes surrounding the text value.

### Fix the Account and Calendar Used When Creating Meeting Window

If you would like to fix the connected calendar and not allow users to edit it,
you need to set the Bearer token of the calendar account and calendar ID.
Be sure the calendar is accessible by the calendar account, otherwise, a
validate error will show up.
Calendar IDs can be obtained by [list calendar](https://developers.kloudless.com/docs/latest/calendar#calendars-list-calendars)
endpoint.
Also, set `setup.formOptions.bookingCalendarId.visible` to `false` to
prevent users from changing connected calendar.

  ```js
  scheduler.launch({
    appId: '<your_app_id>',
    setup: {
      accountToken: '<account_token>',
      formOptions: {
        bookingCalendarId: {
          default: "<calendar_id>",
          visible: false
        },
      }
    }
  });
  ```
### Customizing Scheduled Events

By default, each event scheduled will be created based on its Meeting Window
object. However, it's possible to configure additional metadata to include or
override in scheduled events, using the approaches below.

#### Customizing During Meeting Window Setup

When launching the Setup View, apps can configure launch options that include
default calendar event metadata to apply to all scheduled events:

```js
  scheduler.launch({
    appId: '<your_app_id>',
    setup: {
      formOptions: {
        defaultEventMetadata: { transparent: true },
      }
    }
  });
```

After the Meeting Window is created, all calendar events created from the
Meeting Window above will have the `transparent` property set to `true`.

Note that not all event properties are customizable. Please refer to the
API[MeetingWindow.default_event_metadata](#meeting-window-object) docs for
available properties.

#### Customizing During Scheduling

It's also possible to customize the event metadata on a per-event basis during
the scheduling process instead.

Since this potentially exposes the calendar 
event to customization via client-side JS by a skilled user, Kloudless requires 
the `allowEventMetadata` flag to be set to `true` during the setup process for
the Scheduler's configuration to take effect, as shown below:

```js
  scheduler.launch({
    appId: '<your_app_id>',
    setup: {
      formOptions: {
        allowEventMetadata: true,
      }
    }
  });
```

In the Schedule view, customize calendar event metadata before creation
by listening for the [preSchedule](#preSchedule) JS event:

```js
scheduler.on('preSchedule', (eventData) => {
  const { meetingWindow, schedule } = eventData;
  schedule.event_metadata = {
    extra_description: schedule.targets[0].name
  }
  return schedule;
});
```

By setting `event_metadata.extra_description`, each scheduled event will have
the attendee's name in the event description. Please refer to the
[preSchedule event docs](#preSchedule) for more details and available
attributes.

### And More...
For more examples, please check the [launch(options)](#launch(options)) for a full
list of available options and their usage.

## Methods

### config(options)
Configure the Meeting Scheduler.

#### options
An object containing the following keys:
- `appId`: _Required_: String  
  Your Kloudless application App ID.
- `mode`: _Optional (default: 'modal')_: 'modal' or 'attach'  
  If set to 'modal', a modal window is shown and the widget is displayed
    inside the modal.
  If set to 'attach', the widget will be attached to the element specified in
  the `element` parameter. The widget requires a valid `element` option to launch
  correctly.
- `element`: _Required only for `attach` mode_: String or Element  
  The DOM element that the widget will be attached to. All contents under
  the element will be removed before attaching the widget.
  If a String is provided, it will be used to retrieve the DOM element by using
  [document.querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector).
  This option is ignored if `mode` is `modal`.
  - Example: [Launch with attach mode](#launch-with-attach-mode)
- `customStyleVars`: _Optional (default: undefined)_: object  
  An object to specify LESS variables for custom UI styling. The object format
  is `{[variableName]: value}`. See [here](#customize-ui-styling) for more
  details.
- `setup`: _Required for the Setup View_: Object  
  Options to launch Setup View, available options:
  - `accountToken`: _Optional (default: null)_: String  
    If you would like to launch the widget with an existing calendar account,
    you can import the calendar with a specific Bearer token using the
    `accountToken` option. The user will not need to connect an account
    and the widget will instead use this imported account.  
    __Required__ for Edit existing Meeting Window
    - Example: [Launch the Setup View with a connected calendar account](#launch-the-setup-view-with-a-connected-calendar-account)
  - `scheduleUrl`: _Optional (default: 'https://kloudl.es/m/MEETING_WINDOW_ID')_: String  
    A template string for the URL provided to users to schedule the event.
    The `MEETING_WINDOW_ID` in the string will be replaced with the
    actual meeting window ID.
    - Example: [Customize the event URL format](#customize-the-event-url-format)
  - `meetingWindowId`: _Optional (default: null)_: String  
    If specified, the scheduler will launch in Edit mode to edit the provided
    Meeting Window. Users can also delete this Meeting Window from the view.  
    Note that `accountToken` is required for edit mode.
  - `afterSubmit`: _Optional (default: see below)_: String  
    - An object to specify the behavior after a Meeting Window is created/updated/deleted:
      - `showResult`: _Optional (default: true)_: Boolean  
        If true, a result page will be displayed. Otherwise, the scheduler is
        destroyed, and you will need to use the [submitMeetingWindow](#submitmeetingwindow)
        or [deleteMeetingWindow](#deletemeetingwindow) event to catch the result.
      - `actions`: _Optional (default: ['close'])_: Array  
        A list of available actions for users to choose from. Supported actions 
        include:
        - `'close'`: Close and destroy the scheduler.
        - `'restart'`: Go back and create another Meeting Window. Note that
          this is not supported in the Edit Mode.
  - `formOptions`: _Optional (default: see below)_: Object  
    - An object to configure the form fields of the Setup View.
      - `title`: _Optional (default: {visible: true, default: ''})_: Object
        Configure the default value and visibility of event title.
        - `default`: _Optional (default: '')_: String
        - `visible`: _Optional (default: true)_: Boolean
          `title.default` cannot be empty if this is `false`.
      - `description`: _Optional (default: {visible: true, default: ''})_: Object
        Configure the default value and visibility of event description.
        - `default`: _Optional (default: '')_: String
        - `visible`: _Optional (default: true)_: Boolean
      - `location`: _Optional (default: {visible: true, default: ''})_: Object
        Configure the default value and visibility of event location.
        - `default`: _Optional (default: '')_: String
        - `visible`: _Optional (default: true)_: Boolean
      - `duration`: _Optional (default: {visible: true, default: 15})_: Object
        Configure the default value and visibility of event duration.
        - `default`: _Optional (default: 15)_: Number
        - `visible`: _Optional (default: true)_: Boolean
      - `organizer`: _Optional (default: {visible: true, default: ''})_: Object
        Configure the default value and visibility of event organizer.
        - `default`: _Optional (default: '')_: String
        - `visible`: _Optional (default: true)_: Boolean
          `organizer.default` cannot be empty if this is `false`.
      - `weekday.default`: _Optional (default: [])_: Array  
        The default available weekdays.
        Possible values: `SUN`, `MON`, `TUE`, `WED`, `THU`, `FRI`, and `SAT`.
      - `startHour.default`: _Optional (default: '08:00:00')_: String  
        An ISO 8601 timestamp without offset indicating the default availibility
        start time.
        Possible values: `00:00:00` – `23:00:00`.
      - `endHour.default`: _Optional (default: '17:00:00')_: String  
        An ISO 8601 timestamp without offset indicating the default availability
        end time.
        Possible values: `01:00:00`&ndash;`00:00:00`.
      - `timeSlotInterval`: _Optional (default: {visible: true, default: 30})_: Object
        The number of minutes between each time slot.
        - `default`: _Optional (default: 30)_: Number
        Possible values: 15, 30, 45, or 60.
        - `visible`: _Optional (default: true)_: Boolean
      - `availabilityRange`: _Optional (default: {visible: true, default: 30})_: Object
        The number of days from the current date to show time slots for.
        - `default`: _Optional (default: 30)_: Number
          Possible values: 1&ndash;99.
        - `visible`: _Optional (default: true)_: Boolean
      - `timeBufferBefore`: _Optional (default: {visible: true, default: 0})_: Object
        The number of minutes to leave free before each scheduled event.
        - `default`: _Optional (default: 0)_: Number
          Possible values: 0&ndash;99.
        - `visible`: _Optional (default: true)_: Boolean
      - `timeBufferAfter`: _Optional (default: {visible: true, default: 0})_: Object
        The number of minutes to leave free after each scheduled event.
        - `default`: _Optional (default: 0)_: Number
          Possible values: 0&ndash;99.
        - `visible`: _Optional (default: true)_: Boolean
      - `bookingCalendarId`: _Optional (default: {visible: true, default: ''})_: Object
        Configure the default value and visibility of selected calendar ID.
        - `default`: _Optional (default: <The 1st calendar's ID return from [Calendar List API](https://developers.kloudless.com/docs/latest/calendar#calendars-list-calendars)>)_: String
          This requires `setup.accountToken` to be set. Also, please make sure
          the calendar is accessible by that account.
          Can use `primary` as an alias for the id of the primary calendar.
        - `visible`: _Optional (default: true)_: Boolean
          `bookingCalendarId.default` must be set if this is `false`.
      - `allowEventMetadata`: _Optional (default: false)_: Boolean  
        Set this to `true` to allow changing the created calendar event details
        via a [preSchedule](#preschedule) event handler.
      - `defaultEventMetadata`: _Optional (default: null)_: JSON Object  
        Additional event metadata to set for any calendar event created with
        this Meeting Window. See the
        [MeetingWindow.default_event_metadata](#meeting-window-object)
        docs for properties available to include in this object.
    - Example:
      ```javascript
      {
        title: { default: "" },
        description: { default: "" },
        location: { default: "" },
        duration: { default: 15 },  // 15, 30, 60
        organizer: { default: "" },
        weekday: { default: [] },   // SUN, MON, TUE, WED, THU, FRI, SAT
        startHour: { default: "08:00:00" }, // 00:00:00 – 23:00:00
        endHour: { default: "17:00:00" },   // 01:00:00 – 00:00:00
        timeSlotInterval: { default: 30 },  // 15, 30, 45, 60
        availabilityRange: { default: 30 }, // 1 – 90
        timeBufferBefore: { default: 0 },   // 0 – 99
        timeBufferAfter: { default: 0 },     // 0 – 99
        bookingCalendarId: { default: "primary" }
      }
      ```
  - `authOptions`: _Optional (default: see below)_: Object
    - An object to configure the query parameters used during the
      [Kloudless OAuth 2.0](https://developers.kloudless.com/docs/v1/authentication#oauth-2.0-first-leg)
      flow to connect a calendar account.

      The Meeting Scheduler leverages the
      [Authenticator](https://github.com/Kloudless/authenticator) library for
      OAuth so will pass the `authOptions` object to the [Authenticator's
      options](https://github.com/Kloudless/authenticator#options).

      Here is the default `authOptions` object:

      ```javascript
      {
        scope: 'calendar:normal'
      }
      ```

      If you want to explicitly define the available services for account
      connection, you can change the `scope` option. Here is an example to
      explicitly define Google Calendar and Outlook Calendar as available
      services:

      ```javascript
      {
        scope: 'google_calendar outlook_calendar'
      }
      ```

      The following options cannot be overridden for consistency or security
      reasons:
      - `client_id`
      - `response_type`
      - `redirect_uri`
      - `state`

      Please check the
      [Authenticator options](https://github.com/Kloudless/authenticator#options)
      for more details on the format and attributes accepted.

- `schedule`: _Required for the Schedule View_: Object  
  Options to launch the Schedule View. Available options:
  - `rescheduleUrl`: _Optional (default: 'https://kloudl.es/m/s/SCHEDULED_EVENT_ID')_: String  
    A template string for the URL provided to users to edit the scheduled event.
    The `SCHEDULED_EVENT_ID` in the string will be replaced with the actual
    scheduled event ID.
    - Example: [Customize the Re-Schedule URL](#customize-the-re-schedule-url)
  - `meetingWindowId`: _Required_: String
    The Meeting Window ID .
    - Example: [Launch the Schedule View](#launch-the-schedule-view)
  - `timeZone`: _Optional_: String  
    Set the default time zone when the view is launched. The possible values
    are:
    - `'local'`: Use the browser's time zone. This is the default value.
    - `'organizer'`: Use the time zone from the Meeting Window.
    - Any IANA time zone string (e.g. `America/Los_Angeles`)
  - `afterSchedule`: _Optional_: Object
    - An object to specify the behavior after an event is scheduler, available
      options:
      - `showResult`: _Optional (default: true)_: Boolean  
        If true, a result page will be displayed. Otherwise, the scheduler is
        destroyed, you will need to use the [schedule](#schedule)
        event to catch the result.
      - `actions`: _Optional (default: ['close'])_: Array  
        A list of available actions for users to choose from. Supported actions
        include:
        - `'close'`: Close and destroy the scheduler.
  - `formOptions`: _Optional (default: see below)_: Object  
    - An object to configure the form fields of the Setup View.
      - `name`: _Optional (default: {default: '', visible: true})_: Object
        Configure the default value and visibility of the attendee's name.
        - `default`: _Optional (default: '')_: String
        - `visible`: _Optional (default: true)_: Boolean
          `name.default` cannot be empty if this is `false`.
      - `email`: _Optional (default: {default: '', visible: true})_: Object
        Configure the default value and visibility of the attendee's email.
        - `default`: _Optional (default: '')_: String
        - `visible`: _Optional (default: true)_: Boolean
          `email.default` cannot be empty if this is `false`.
      - `extraDescription`: _Optional (default: '')_: Object  
        - `default`: _Optional (default: '')_: String
          The default notes to append to the created event's description.
        - `visible`: _Optional (default: `false`)_: Boolean
          Visibility of this field.
        If the Meeting Window object has `allow_event_metadata` set
        to `true` when created via the Setup process, it allows the
        Schedule view to alter the title and description of the created calendar
        event. This allows a user to add in additional notes to the calendar
        event description via this field. Any original description configured
        for the calendar event in the Setup view will not be overwritten and
        will still be included in addition within the calendar event
        description.
    - Example:
      ```javascript
      {
        name: { default: "Johnny Appleseed" },
        email: { default: "youremail@example.com" }
      }
      ```

__Note__: You must specify either `setup` or `schedule` to launch the Meeting
Scheduler.

### launch(options?)

Launch the meeting scheduler widget. If `options` is provided, it will call
[config(options)](#configoptions) to configure the scheduler before launching.

### destroy()
Remove the configured meeting scheduler widget from the page and free up memory.


### Kloudless.scheduler.setOptions(options)

Set global options. The widget is configured to work with default values, so
these options should only be set when needed.

#### options
An object containing the following keys:
- `baseUrl`: _String_, Kloudless API server URL, you only need this when
hosting your own Kloudless API server.
- `schedulerPath`: _String_, URL that hosts the scheduler page, you only need
this when hosting the embedded scheduler page. See
[Host the scheduler page](#host-the-scheduler-page) for more information.

### Kloudless.scheduler.getOptions()

Get the global options object.

### Kloudless.scheduler.getQueryParams()

Retrieve an object representing query parameters as key-value map from
current URL.

### Kloudless.scheduler.version

Return version number string.

## Events

Events are emitted asynchronously when conditions are met. To register an event,
use `scheduler.on(eventName, callback)`. Use `scheduler.off(eventName, callback)`
or `scheduler.off(eventName)` to unregister all callbacks from a certain event.

The callback function will receive an object as the first argument with
the following properties:
  - `scheduler`: MeetingScheduler instance that received the event.
  - All event data for the event will be attached as additional keys to this
    object, please reference to [Event List](#event-list) for details.

### Event List

#### open

The scheduler has launched.

#### close

The scheduler has closed.

#### destroyed

The scheduler window and placeholders have been destroyed.

#### connectAccount

A calendar account has been connected.

Event Data:
  - `account`: __Object__; Connected account
  - `accountToken`([\*1](#event-note)): _String_; Bearer Token of this account

#### removeAccount

A calendar account has been removed.

#### preSubmitMeetingWindow

A Meeting Window is about to be created or updated.

#### submitMeetingWindow

A Meeting Window has been created or updated.

Event Data:
  - `meetingWindow`: Meeting Window object
  - `accountToken`([\*1](#event-note)): _String_; Bearer Token of this account

#### deleteMeetingWindow

A Meeting Window has been deleted.

#### preSchedule

Triggered before a time slot is booked in the Schedule view.

Event Data:
  - `meetingWindow`: _Object_; The Meeting Window object this time slot selection
  was created for.
  - `schedule`: _Object_; Details for the selected time slot, including the
  selected time and attendee information.

Return Value:  
  - Modify and return the `schedule` object provided to override details
    for the calendar event about to be scheduled.
    This requires your application to ensure the `meetingWindow` object
    has the property `allow_event_metadata` set to `true` during the Setup
    process.
    You can then modify `schedule` to add in the property `event_metadata`
    as shown below. `schedule.event_metadata` accepts the following
    attributes:
    - `name`: Overrides the calendar event's name
    - `extra_description`: Appends extra text to the calendar event's
      description.  
      *Note*: Users can add their own extra notes via the launch option
      `schedule.formOptions.extraDescription.visible`.
      The input text will then be populated in this
      `schedule.event_metadata.extra_description` property by default
      when included in the event data provided for this event.
      To still add additional text beyond the user's input, append it to
      the existing value of this property.

    ```js
    scheduler.on('preSchedule', (eventData) => {
      const { meetingWindow, schedule } = eventData;
      schedule.event_metadata = {
        name: meetingWindow.title + ' - Custom',
        extra_description: 'Custom additional description.'
      }
      return schedule;
    })
    ```
  - Don't return anything, or return `undefined`, if you don't want to change
    the `schedule` object.

#### schedule

Triggered when a time slot is booked via the Schedule view.

Event Data:
  - `scheduledEvent`: _Object_, scheduled calendar event details, including
  calendar event ID.

#### restart

A view has been restarted.

This event is currently only emitted in the Setup View when a user has clicked
'Create another event' button to set up a new Meeting Window after setting one
up.

#### error

An error response, or no response returned for an API request.

Event Data:
  - `message`: _String_; Error message if available.

<a name="event-note"></a>(\*1) This data is only sent when the scheduler is 
launched from a [Trusted Domain](#setup-trusted-domains-for-your-kloudless-app).

## Meeting Window API

### Object Definition

#### Meeting Window Object

The [Meeting Window](#meeting-window-object) object contains information used
for scheduling events with the Kloudless Calendar.

| Property | Type | Description | Writable | Required |
| --- | --- | --- | --- | --- |
| id | string | The meeting window's unique identifier. | No | No |
| booking_calendar_id | string | The Kloudless calendar ID to store the scheduled event. | Yes | Yes |
| duration | integer | The event duration in minutes.  | Yes | Yes |
| title | string | The event title. | Yes | Yes |
| organizer | string | The name of the event organizer. | Yes | Yes |
| location | string | The event location. | Yes | No |
| description | string | The event description. | Yes | No |
| availability | string | A list of Availability objects. See [Availability](#availability) for details. | Yes | Yes | 
| time_zone | string | The event IANA time_zone. e.g. `America/Los_Angeles` | Yes | Yes | 
| availability_range | integer | Indicates the number of days from the current point in time to show time slots. Defaults to `30`. | Yes | No | 
| time_slot_interval | integer | Indicates the number of minutes of time between each time slots. Defaults to `30`. | Yes | No | 
| time_buffer_before | integer | Indicates the number of minutes of buffer time before each scheduled event. Defaults to `0`. | Yes | No | 
| time_buffer_after | integer | Indicates the number of minutes of buffer time after each scheduled event. Defaults to `0`. | Yes | No | 
| allow_event_metadata | boolean | Indicates if the created calendar event can be customized when scheduling events. See the [preSchedule](#preschedule) event for details. Defaults to `false`. | Yes | No |
| default_event_metadata | object | Additional calendar event metadata to set when scheduling events. Defaults to `{}`. See the [Event creation API endpoint](https://developers.kloudless.com/docs/v1/calendar#events-create-an-event) for available attributes. The following attributes are reserved and can't be set: `id`, `name`, `description`, `location`, `start`, `end`, `start_time_zone`, `end_time_zone`, `all_day`, and `recurrence`. | Yes | No |


#### Availability 

The Availability object contains the rules to generate the available time slots.
It is located within the [Meeting Window](#meeting-window-object) object.

| Property | Type | Description | Writable | Required |
| --- | --- | --- | --- | --- |
| available_times | array | A list of availability rules. | Yes | Yes |
| available_times[].start | string | The ISO 8601 time format in `hh:mm:ss` that indicates the time window's start time. | Yes | Yes |
| available_times[].end | string | The ISO 8601 time format in `hh:mm:ss` that indicates the time window's end time. | Yes | Yes |
| available_times[].recurring | object | The recurrence constraint for the availability range. | Yes | Yes |
| available_times[].recurring.weekday | string | The weekdays to include availability for. Accepts 3 characters abbreviations with a comma as delimiter. For example, `"MON, TUE"` means to show availability for Mondays and Tuesdays. | Yes | Yes |
| available_times[].recurring.month | string | Currently not supported. | No | No |
| available_times[].recurring.day | string | Currently not supported. | No | No |
| end_repeat | string | An ISO 8601 date, or `'NEVER'`. The `available_times` rules will be applied until this date. Defaults to `'NEVER'`, which means time slots are generated for as many days as possible (subject to `availability_range`). | Yes | No |

### Authentication

To use the Meeting Window API, the Bearer authentication with a Kloudless 
bearer token is needed.
See [Obtaining an Access Token](https://developers.kloudless.com/docs/v1/authentication#oauth-2.0-obtaining-an-access-token)
for more details.

### Endpoints

Refer to [Meeting Window](#meeting-window-object) for Meeting Window properties.

#### GET `https://api.kloudless.com/v1/meetings/windows/`

List the user's Meeting Windows. The user is identified by the bearer token.

- Query parameters
  - `page` Page identifier
  - `page_size` Number of objects in each page.

- Response `200`
  - `response body` Array of Meeting Windows. See [Meeting Window](#meeting-window-object)
    for Meeting Window's properties.

```json
{
  "count": 1,
  "total": 88,
  "page": 1,
  "objects": [
    {
      "id": "azOd1NlAnDNKzscCYE4g",
      "booking_calendar_id": "faG9uZ2NoZW4uZGV2QGdtYWlsLmNvbQ==",
      "duration": 15,
      "title": "Wine Tasting Tour",
      "organizer": "Peter",
      "location": "Napa",
      "description": "Wonderful wine tasting.",
      "availability": {
        "end_repeat": "NEVER",
        "available_times": [
          {
            "start": "09:00:00",
            "end": "17:00:00",
            "recurring": {
              "weekday": "MON, TUE, WED, THU, FRI, SAT, SUN",
              "month": "*",
              "day": "*"
            }
          }
        ]
      },
      "time_buffer_before": 0,
      "time_buffer_after": 0,
      "time_slot_interval": 30,
      "availability_range": 60,
      "time_zone": "America/Los_Angeles",
      "api": "meeting_scheduler",
      "allow_event_metadata": false,
      "default_event_metadata": {}
    }
  ],
  "type": "object_list",
  "api": "meeting_scheduler"
}
```


#### GET `https://api.kloudless.com/v1/meetings/windows/{id}/`

Retrieve the meeting window via meeting window ID.

- Response `200`
  - `response body` See [meeting window](#meeting-window-object) for meeting
    window's properties.

```json
{
  "id": "azOd1NlAnDNKzscCYE4g",
  "booking_calendar_id": "faG9uZ2NoZW4uZGV2QGdtYWlsLmNvbQ==",
  "duration": 15,
  "title": "Wine Tasting Tour",
  "organizer": "Peter",
  "location": "Napa",
  "description": "Wonderful wine tasting.",
  "availability": {
    "end_repeat": "NEVER",
    "available_times": [
      {
        "start": "09:00:00",
        "end": "17:00:00",
        "recurring": {
          "weekday": "MON, TUE, WED, THU, FRI, SAT, SUN",
          "month": "*",
          "day": "*"
        }
      }
    ]
  },
  "time_buffer_before": 0,
  "time_buffer_after": 0,
  "time_slot_interval": 30,
  "availability_range": 60,
  "time_zone": "America/Los_Angeles",
  "api": "meeting_scheduler",
  "allow_event_metadata": false,
  "default_event_metadata": {}
}
```

#### POST `https://api.kloudless.com/v1/meetings/windows/`

Create a Meeting Window. 

- Request body
  - See [Meeting Window](#meeting-window-object) for writable and required 
    properties.

```json
{
  "booking_calendar_id": "faG9uZ2NoZW4uZGV2QGdtYWlsLmNvbQ==",
  "duration": 15,
  "title": "Wine Tasting Tour",
  "organizer": "Peter",
  "location": "Napa",
  "description": "Wonderful wine tasting.",
  "availability": {
    "end_repeat": "NEVER",
    "available_times": [
      {
        "start": "09:00:00",
        "end": "17:00:00",
        "recurring": {
          "weekday": "MON, TUE, WED, THU, FRI, SAT, SUN",
        }
      }
    ]
  },
  "time_zone": "America/Los_Angeles",
  "availability_range": 60,
  "time_slot_interval": 30,
  "time_buffer_before": 0,
  "time_buffer_after": 0
}
```


- Response `201`
  - `response body` See [Meeting Window](#meeting-window-object) for Meeting
     Window properties.

```json
{
  "id": "azOd1NlAnDNKzscCYE4g",
  "booking_calendar_id": "faG9uZ2NoZW4uZGV2QGdtYWlsLmNvbQ==",
  "duration": 15,
  "title": "Wine Tasting Tour",
  "organizer": "Peter",
  "location": "Napa",
  "description": "Wonderful wine tasting.",
  "availability": {
    "end_repeat": "NEVER",
    "available_times": [
      {
        "start": "09:00:00",
        "end": "17:00:00",
        "recurring": {
          "weekday": "MON, TUE, WED, THU, FRI, SAT, SUN",
          "month": "*",
          "day": "*"
        }
      }
    ]
  },
  "time_buffer_before": 0,
  "time_buffer_after": 0,
  "time_slot_interval": 30,
  "availability_range": 60,
  "time_zone": "America/Los_Angeles",
  "api": "meeting_scheduler",
  "allow_event_metadata": false,
  "default_event_metadata": {}
}
```


#### PATCH `https://api.kloudless.com/v1/meetings/windows/{id}/`

Update the meeting window.

- Request body
  - See [meeting window](#meeting-window-object) for the writable properties.

```json
{
  "description": "Agenda: Wine tasting",
}
```

- Response `200`
  - `response body` See [meeting window](#meeting-window-object) for Meeting
     Window properties.
     
```json
{
  "id": "rMAABzrAGXA3CMd9sMcg",
  "booking_calendar_id": "faG9uZ2NoZW4uZGV2QGdtYWlsLmNvbQ==",
  "duration": 15,
  "title": "Wine Tasting Tour",
  "organizer": "Peter",
  "location": "Napa",
  "description": "Agenda: Wine tasting",
  "availability": {
    "end_repeat": "NEVER",
    "available_times": [
      {
        "start": "09:00:00",
        "end": "17:00:00",
        "recurring": {
          "weekday": "MON, TUE, WED, THU, FRI, SAT, SUN",
          "month": "*",
          "day": "*"
        }
      }
    ]
  },
  "time_buffer_before": 0,
  "time_buffer_after": 0,
  "time_slot_interval": 30,
  "availability_range": 60,
  "time_zone": "America/Los_Angeles",
  "api": "meeting_scheduler",
  "allow_event_metadata": false,
  "default_event_metadata": {}
}
```

#### DELETE `https://api.kloudless.com/v1/meetings/windows/{id}/`

Delete the Meeting Window.

- Response `204`



### Monitoring Scheduled Events

To monitor events scheduled by the Meeting Scheduler, you can choose to
either receive WebHooks from Kloudless, or poll the account via the Activity
Stream endpoint.

We recommend receiving [WebHooks](#webhooks) if possible since your application
will receive a notification immediately after a time slot is booked by a user
with the ID of the calendar event created.

If your application can't receive webhooks, the
[Activity Stream](#activity-stream-endpoint) endpoint returns all activity in
the connected calendar account, which your application can filter to be aware
of just the calendar events created by the Meeting Scheduler.

#### WebHooks
The Kloudless API supports
[WebHooks](https://developers.kloudless.com/docs/latest/events#webhooks) to
send notifications whenever activity occurs in a connected calendar account.

This includes both activity as a result of time slots booked / updated via
the Meeting Scheduler as well as general usage of the calendar account.

Check the [Kloudless API Docs](https://developers.kloudless.com/docs/latest/events#webhooks)
for information on how to configure webhooks for your application.

The webhook's body URL-encodes data that your application can parse. Be aware
that not all attributes will be present on each notification. Here is an
example:

```
account=123456&event_category=calendar&event_type=add&event_subtype=meeting_scheduler_slot_booked&calendar_id=calendar_id&calendar_event_id=calendar_event_id&meeting_window_id=abcxyz12345
```

Most notifications only include the account ID or limited information in
the payload, but notifications from the Meeting Scheduler have the following
attributes that your application should check for:


Action | event_category | event_type | event_subtype
-------| ---------------|------------|--------------
A slot is booked | calendar | add | meeting_scheduler_slot_booked
A scheduled event is updated or rescheduled | calendar | update | meeting_scheduler_slot_updated
A scheduled event is deleted | calendar | delete | meeting_scheduler_slot_deleted


If your application sees a notification with the data above, check the
remaining included data for which calendar event was associated:

- `meeting_window_id`: ID of the Meeting Window used to schedule the
                       calendar event.
- `account`: ID of the connected calendar account.
- `calendar_id`: ID of the calendar that the event is scheduled in.
- `calendar_event_id` ID of the scheduled calendar event.

You can then either
[retrieve the associated Meeting Window object](#get-httpsapikloudlesscomv1meetingswindowsid),
or more commonly,
[retrieve the scheduled calendar event](https://developers.kloudless.com/docs/v1/calendar#events-retrieve-an-event)
via the Kloudless API.

For example, retrieving the metadata of a calendar event that was scheduled
involves a GET request to the following URL based on the attributes above:

```
https://api.kloudless.com/v1/accounts/{account}/cal/calendars/{calendar_id}/events/{calendar_event_id}
```

#### Activity Stream Endpoint

**This is currently only supported for Google Calendar or Outlook Calendar
accounts connected to a Meeting Window.**

The Kloudless Calendar API offers an
[Activity Stream](https://developers.kloudless.com/docs/latest/calendar#activity-stream)
that tracks new, updated, or deleted events on connected calendar accounts.
Since this includes calendar events created by the Meeting Scheduler, your
application can monitor an organizer's calendar  to determine when an end-user
books a time slot on it.

When [listing new activity](https://developers.kloudless.com/docs/v1/events#events-list-events),
you can tell if an activity object corresponds to a calendar event created by
the Meeting scheduler if the following cases are all true:
- The `type` is `add`
- The `metadata.api` is `calendar`
- The `metadata.type` is `event`
- `metadata.custom_properties` is a list that contains an object where the
  `key` is `"meeting_window_id"`.

If so, the `value` attribute in the `metadata.custom_properties` object 
described above is the ID of the Meeting Window for which the calendar event was
booked.

Below is an example activity object representing a calendar event created
by the Meeting Scheduler. The Meeting Window ID in this example is
`abcxyz12345`. Notice that the `metadata` property contains the entire calendar
event, and the associated Meeting Window's ID is listed within
`custom_properties`.

```json
    {
      "id": "activity_id",
      "account": 9999,
      "action": "+",
      "ip": null,
      "modified": "2019-08-28T03:55:02Z",
      "type": "add",
      "user_id": null,
      "metadata": {
        "api": "calendar",
        "type": "event",
        "id": "calendar_event_id",
        "account_id": "9999",
        "calendar_id": "calendar_id",
        "recurrence_type": "solo",
        "creator": {
          "id": null,
          "name": null,
          "email": "creator@gmail.com"
        },
        "organizer": {
          "id": null,
          "name": "organizer",
          "email": "organizer@group.calendar.google.com"
        },
        "attendees": [
          {
            "id": null,
            "name": "attendee",
            "email": "attendee@kloudless.com",
            "status": "pending",
            "required": true,
            "resource": false
          }
        ],
        "created": "2019-08-28T03:55:02Z",
        "modified": "2019-08-28T03:55:02Z",
        "all_day": false,
        "start": "2019-09-15T22:30:00-07:00",
        "start_time_zone": "America/Los_Angeles",
        "end": "2019-09-15T23:30:00-07:00",
        "end_time_zone": "America/Los_Angeles",
        "name": "event_name",
        "description": "event_description",
        "location": "event_location",
        "status": "confirmed",
        "visibility": null,
        "attachments": [],
        "custom_properties": [
          {
            "key": "meeting_window_id",
            "value": "abcxyz12345"
          }
        ],
        "use_default_reminder": true,
        "reminders": [],
        "reminder": null
      }
    }
```


## Migration Guide

### From v1.0, v1.1 to v1.2 and above

1. Launch options have been redesigned to provide flexibility with configuration.
Please refer to the following table to migrate your
existing configuration.

Purpose | v1.1 and below | v1.2 and above
--------| -------------- | ----------
Pass the connected account's token for the Setup View | accountToken | setup.accountToken
URL template for users to schedule the event (*1) | eventUrlFormat | setup.scheduleUrl
Launch the Schedule View | eventId | schedule.meetingWindowId

  - \*1: `EVENT_ID` in the URL template has to be changed to
        `MEETING_WINDOW_ID` in order to generate the schedule link properly.

2. `appId` is now required for both the Setup and Schedule View.

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
If you encounter issues while inspecting components, try clicking the refresh
button on the top right.

When launching the dev server, the `setup.scheduleUrl` will be
`http://localhost:8080/meetingWindowId=MEETING_WINDOW_ID` by default.
You can use this URL to test the Schedule View locally.

### Building
```bash
# install dependencies
npm install

# build for production with minification.
# the result will be in /dist.
npm run build
```


#### Host the Scheduler Page

The build contains a `scheduler` folder which renders the actual HTML and
functionalities of the widget; by default, this is hosted by Kloudless. If
you would like to host it yourself, you can set `SCHEDULER_PATH` under build
options to specify the scheduler hosting URL, or use
`Kloudless.scheduler.setOptions` in runtime.

You will need to add your website domain to your Kloudless app's list of
`Trusted Domains` on the
[App Detail Page](https://developers.kloudless.com/applications/*/details/).

This allows the hosted scheduler to receive access tokens to the Kloudless API.

#### Build Options

You can use environment variables to configure the build, for example:
```
# Set this if you'd like to specify a non-default Kloudless API server URL
BASE_URL=<your_kloudless_api_server_url> npm run build

```

Variable Name | Purpose | Default
----|---|---
BASE_URL | URL to Kloudless API Server | https://api.kloudless.com
SCHEDULER_PATH | URL for the scheduler page | https://static-cdn.kloudless.com/p/platform/scheduler/index.html
SCHEDULE_URL | Default schedule URL | https://kloudl.es/m/MEETING_WINDOW_ID
RESCHEDULE_URL | Default re-schedule URL | https://kloudl.es/m/s/SCHEDULED_EVENT_ID


### Test the Build
```bash
npm run dist-test

```
Open http://localhost:8080/test/dist to test the build

## Support

Feel free to contact us at support@kloudless.com with any feedback or questions.
