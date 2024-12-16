const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');

// Initialize Firebase Admin SDK
const serviceAccount = require('./notification.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
const port = 3000;

// Middleware to parse JSON body
app.use(express.json());
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

/**
 * POST /send
 * Sends a notification to the specified token.
 * Request body: {
 *   "token": "<DEVICE_TOKEN>",
 *   "title": "<NOTIFICATION_TITLE>",
 *   "body": "<NOTIFICATION_BODY>",
 *   "data": { "key1": "value1", "key2": "value2" } // Optional
 * }
 */
app.post('/send', async (req, res) => {
  const { token } = req.body;

  console.log(req.body)

  if (!token) {
    return res.status(400).json({ message: 'Token is required.' });
  }

  const message = {
    notification: {
      title: "Hello",
      body : "New Notification",
    },
    data: {},
    token,
  };

  try {
    const response = await admin.messaging().send(message);
    res.status(200).json({ message: 'Notification sent successfully', response });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ message: 'Error sending notification', error });
  }
});

app.listen(port, () => {
  console.log(`Notification service running on http://localhost:${port}`);
});
