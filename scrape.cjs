const https = require('https');
https.get('https://ffhackpro.netlify.app/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(data));
});
