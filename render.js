const puppeteer = require('puppeteer');
fs = require('fs');

// Command line arguments
const source = process.argv[2];
const selector = process.argv[3];
const destination = process.argv[4];


async function ssr(source, selector, destination) {
   
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    try {
        await page.goto('file://' + source, {waitUntil: 'networkidle0'});
        await page.waitForSelector(selector);
    } catch (err) {
        console.error(err);
        throw new Error('page.goto/waitForSelector timed out.')       
    }

    const html = await page.$eval(selector, element => element.innerHTML);
   
    fs.writeFile(destination, html, function (err) {
    if (err) return console.log(err);
        console.log('The static file was created.');
    });
    console.log(html);
    await browser.close();
}

ssr(source, selector, destination);
