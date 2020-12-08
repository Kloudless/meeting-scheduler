# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]



## [1.10.2]
### Fix

- Fix the issue that `document.execCommand('selectAll')` doesn't work on Firefox.

## [1.10.1]
### Fix

- Fix button's status when deleting a Meeting Window.

## [1.10.0]
### Added

- Support editing the scheduled event.
- Introduce `rescheduleUrl` option.

## [1.9.0]

### Added

- Support changing displayed time zone in the Schedule view

## [1.8.0]

### Added

- support configuring visibility of each form field
- New launch option `defaultEventMetadata` to customize scheduled events

## [1.7.0]

### Added

- New launch option `customStyleVars` to customize widget colors and text font

## [1.6.3]

### Fixed

- improve responsiveness

## [1.6.2]

### Fixed

- availability times were not editable in edit Meeting Window mode

## [1.6.1]

### Changed

- Improved performance for the Schedule view

### Fixed

- Selected slot was removed after scrolling for more slots in the Schedule View


## [1.6.0]

### Added

- New Note textarea in the Schedule View
- New property `extraDescription` for launch option `schedule.formOptions`
  This is used to control the new Note textarea

## [1.5.0]

### Added

- New launch option `formOptions` for the Schedule View
- New launch option `authOptions` for the Setup View

### Changed

- Improved `preSchedule` event to be able to customize title and description
  for scheduled events

## [1.4.2]

### Fixed
- Modal was blocked by elements with z-index > 0

## [1.4.1]

### Changed
- Improved widget loading time

### Fixed
- Stop launching the Edit Mode if the Bearer Token passed in is invalid

## [1.4.0]

### Added
- Allow setting multiple availability windows

### Changed
- Use vue-infinite-loading for time slot pagination

## [1.3.0]

### Added
- Advanced availability settings in the Setup View
- The new launch option `formOptions`

## [1.2.2]

### Fixed
- Event name corrections

## [1.2.1]

### Fixed
- Missing fields when editing Meeting Window

## [1.2.0]

### Added
- New launch options to control the result page
- Support for events
- Ability to edit and delete existing Meeting Window objects

## [1.1.0]

### Added
- New build options
- `setOptions` to configure global options in runtime

### Changed
- Render the widget inside iframe to preserve layout

### Fixed
- Available times were off due to daylight saving timezone

## [1.0.0]

### Added
- Initial release
