# Queue Selection by Agent

This Flex plugin adds a queue selection option to agents directly, without the need of supervisor action.

![Screenshot](screenshots/example.png?raw=true)

## How to use

1. Clone this repository

2. Copy `public/appConfig.example.js` to `public/appConfig.js`

3.  run `npm install`

4. cd back to the root folder and run `npm start` to run locally or `npm run-script build` and deploy the generated ./build/plugin-dialpad.js to [twilio assests](https://www.twilio.com/console/assets/public) to include plugin with hosted Flex. Also, you want to use Twilio Serverless, just run `npm run deploy` to send your plugin directly to your Flex.
