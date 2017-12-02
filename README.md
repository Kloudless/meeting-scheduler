# Calendar UI tool

## How to use

### Include in HTML (not ready for use, need full dependencies bundle version)
```html
<script type="text/javascript" src="CalendarUI.js"></script>
```

```javascript
var myCalendar = new window.CalendarUI(KLOUDLESS_APP_ID ,KLOUDLESS_API_KEY)
myCalendar.launch('#calendar-ui')
```

### Import with node modules
```javascript

const myCalendar = new CalendarUI(KLOUDLESS_APP_ID ,KLOUDLESS_API_KEY)
myCalendar.launch('#calendar-ui')
```

## Methods
### launch('documentId')
Launch the calendar and append it to the DOM

## Contribute

### Develop
Clone this repo
```bash
# install dependencies
yarn install

# expoxt KLOUDLESS_APP_ID & KLOUDLESS_API_KEY
export KLOUDLESS_APP_ID=<your_app_id>
export KLOUDLESS_API_KEY=<your_api_key>

# serve with hot reload at localhost:8080
npm run dev
# or
npm start
```

### Test
```bash
# run unit tests
npm run unit

# run all tests
npm test
```

### Build
```bash
# install dependencies
yarn install

# build for production with minification
# the result will be in /dist
npm run build
```

### Test exported library
Should build CalendarUI.js first
```bash
cd export_lib_test

# install dependencies
npm install

# copy the built CalendarUI.js
npm run copy-dist

# expoxt KLOUDLESS_APP_ID & KLOUDLESS_API_KEY
export KLOUDLESS_APP_ID=<your_app_id>
export KLOUDLESS_API_KEY=<your_api_key>

# serve with hot reload at localhost:8080
npm start
```
