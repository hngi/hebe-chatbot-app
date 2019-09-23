const { App } = require('@slack/bolt');
const dotenv = require('dotenv');
const store = require('./store');

dotenv.config();
const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN
});


app.event('app_home_opened', ({ event, say }) => {  
  // We(HEBE) are going to use a Postgres database here
  // And remove the store.js file.
  let user = store.getUser(event.user);
  
  if(!user) {
    user = {
      user: event.user,
      channel: event.channel
    };
    store.addUser(user);
    
    say(`Hello world, and welcome <@${event.user}>!`);
  } else {
    say('Hi again!');
  }
});


// Start your app
const port = process.env.PORT || 3000;
(async () => {
  await app.start(port);
  console.log(`Bolt app is running on ${ port }`);
})();
