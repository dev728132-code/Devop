import https from 'https';

https.get('https://ffhackpro.netlify.app/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const jsFiles = data.match(/src="([^"]+\.js)"/g);
    if (jsFiles) {
      jsFiles.forEach(file => {
        const url = 'https://ffhackpro.netlify.app' + file.replace('src="', '').replace('"', '');
        https.get(url, (res2) => {
          let jsData = '';
          res2.on('data', chunk => jsData += chunk);
          res2.on('end', () => {
            // Very simple extraction
             const strings = jsData.match(/"([^"]+)"/g);
             if (strings) {
               console.log(strings.slice(0, 50).join('\n'));
               console.log("... and many more strings");
               
               // Look for some keywords like "features", "price", "rate"
               const features = jsData.match(/.{0,50}feature.{0,50}/gi);
               const prices = jsData.match(/.{0,50}price.{0,50}/gi);
               if (features) console.log("\nFEATURES:\n", features.slice(0, 10).join('\n'));
               if (prices) console.log("\nPRICES:\n", prices.slice(0, 10).join('\n'));
               
               // Find any object-like text that might be products data
               const productData = jsData.match(/\{[^}]*name:[^}]*price:[^}]*\}/gi);
               if (productData) console.log("\nPRODUCTS:\n", productData.slice(0, 10).join('\n'));
               
             }
          });
        });
      });
    } else {
      console.log('No JavaScript files found.');
    }
  });
}).on('error', err => {
  console.log('Error: ', err.message);
});
