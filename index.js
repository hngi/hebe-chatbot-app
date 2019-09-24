const { App } = require('@slack/bolt');
const dotenv = require('dotenv');
const store = require('./store');

dotenv.config();

const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  token: process.env.SLACK_BOT_TOKEN
});


app.message(':wave:', ({ message, say }) => {  
  // We(HEBE) are going to use a Postgres database here
  // And remove the store.js file.
  let user = store.getUser(message.user);
  
  if(!user) {
    user = {
      user: message.user,
      channel: message.channel
    };
    store.addUser(user);
    
    say({
      blocks: [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `Hey there <@${message.user}>!`
        },
          "type": "actions",
          "elements": [
            {
              "type": "conversations_select",
              "placeholder": {
                "type": "plain_text",
                "text": "Select a conversation",
                "emoji": true
              }
            },
            {
              "type": "channels_select",
              "placeholder": {
                "type": "plain_text",
                "text": "Select a channel",
                "emoji": true
              }
            },
            {
              "type": "users_select",
              "placeholder": {
                "type": "plain_text",
                "text": "Select a user",
                "emoji": true
              }
            }
          ]
        }
      ]
    });
  } else {
    say({
      blocks: [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": `Hi again <@${message.user}>!`
        },
        "type": "actions",
		"elements": [
			{
				"type": "conversations_select",
				"placeholder": {
					"type": "plain_text",
					"text": "Select a conversation",
					"emoji": true
				}
			},
			{
				"type": "channels_select",
				"placeholder": {
					"type": "plain_text",
					"text": "Select a channel",
					"emoji": true
				}
			},
			{
				"type": "users_select",
				"placeholder": {
					"type": "plain_text",
					"text": "Select a user",
					"emoji": true
				}
			}
    ]
  }
]
    });
  }
    console.log(message.user);
  });

app.action('conversations_select', ({ body, ack, say }) => {
    // Acknowledge the action
    ack();
    say(`<@${body.user.id}> clicked the button`);
});

app.error((error) => {
	// Check the details of the error to handle cases where you should retry sending a message or stop the app
	console.error(error);
});


// Start your app
const port = process.env.PORT || 3000;
(async () => {
  await app.start(port);
  console.log(`Bolt app is running on ${ port }`);
})();