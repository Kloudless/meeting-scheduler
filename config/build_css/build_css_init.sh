# operations required before building CSS

cd config/build_css

# remove the previous build
rm -r MeetingScheduler.css;

# copy font files from dependencies
rm -r ./fonts/MaterialIcons-Regular.*
cp ../../node_modules/material-design-icons-iconfont/dist/fonts/MaterialIcons-Regular.woff* ./fonts
