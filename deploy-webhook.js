const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const { exec } = require('child_process');

const app = express();
const PORT = 3000;
const SECRET = 'smartcivic_webhook_secret'; //  Same secret to set in GitHub webhook

// Middleware to parse JSON and capture raw body for signature verification
app.use(bodyParser.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

//  Verify GitHub signature
function verifySignature(req) {
  const signature = `sha256=${crypto.createHmac('sha256', SECRET).update(req.rawBody).digest('hex')}`;
  const githubSignature = req.headers['x-hub-signature-256'];
  return signature === githubSignature;
}

//  Webhook endpoint
app.post('/webhook', (req, res) => {
  if (!verifySignature(req)) {
    console.log(' Invalid webhook signature');
    return res.status(403).send('Invalid signature');
  }

  const payload = req.body;

  if (payload.ref === 'refs/heads/main') {
    console.log(' Push to main branch detected. Deploying SmartCivic backend...');

    // Execute deployment commands
    exec(`
      cd ~/MAJOR/complaints-backend &&
      git pull origin main &&
      npm install &&
      pm2 restart smartcivic-backend || pm2 start src/server.js --name smartcivic-backend
    `, (err, stdout, stderr) => {
      if (err) {
        console.error(' Deployment error:', stderr);
        return res.status(500).send('Deployment failed');
      }
      console.log(' Deployment output:\n', stdout);
      res.status(200).send('SmartCivic backend deployed successfully');
    });

  } else {
    console.log(` Push to ${payload.ref} — ignored.`);
    res.status(200).send('Push ignored (not main branch)');
  }
});

//  Start webhook server
app.listen(PORT, () => {
  console.log(`🚀 Webhook listener running on http://localhost:${PORT}/webhook`);
});
