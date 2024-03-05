const express = require('express');
const bodyParser = require('body-parser');
const africastalking = require('africastalking');
const fs = require('fs');

// Load prompts from JSON file
const prompts = JSON.parse(fs.readFileSync('prompts.json'));

// Set up Africa's Talking credentials
const apiKey = 'ccddadff9129182dee97a99b815354940ce3b4b2a95256918d40965b43df3de1';
const username = 'sandbox';
const africasTalking = africastalking({
  apiKey,
  username
});

// Initialize express app
const app = express();
app.use(bodyParser.json());

// Define a route to handle incoming SMS messages
app.post('/incoming-sms', (req, res) => {
  const sms = req.body;
  const sender = sms.from;
  const message = sms.text;

  // Process incoming message
  const response = processIncomingMessage(message);

  // Send response SMS
  africasTalking.SMS.send({
    to: sender,
    message: response
  }).then(() => {
    console.log('Response sent successfully');
    res.status(200).end();
  }).catch(error => {
    console.error('Error sending response:', error);
    res.status(500).end();
  });
});

// Define function to process incoming messages
function processIncomingMessage(message) {
  // Check if the message includes certain keywords and respond accordingly
  if (message.toLowerCase().includes('help')) {
    return prompts.help;
  } else if (message.toLowerCase().includes('bye') || message.toLowerCase().includes('goodbye')) {
    return prompts.farewell;
  }
  // Default response
  return prompts.greeting;
}

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

