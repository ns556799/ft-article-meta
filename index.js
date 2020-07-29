const {GoogleSpreadsheet} = require('google-spreadsheet')
const {promisify} = require('util')

const creds = require('./creds.json')
const doc = new GoogleSpreadsheet('1HkY4M5RRqBhcj9-vPPH5Bp7dAaPj46g3tHky4Fos_-o')
var og = require('open-graph');


function printArticle(article) {
  const url = article.URL
  const date = `${article.Month} ${article.Year}`
  const client = article.Advertiser
  const type = article.Type
  const contentType = article.Content



  console.log(url, date, client, contentType)

  og(url, (err, meta) => {
  })
}

async function accessSpreadsheet() {
  await doc.useServiceAccountAuth({
    client_email: creds.client_email,
    private_key: creds.private_key,
  });

  await doc.loadInfo(); // loads document properties and worksheets
  console.log(doc.title);

  const sheets = doc.sheetsByIndex; // or use doc.sheetsById[id]

  const hub = sheets.filter(
    (sheet) => sheet.title === 'FT Content Hub'
  )[0];
  const rows =  await (hub.getRows)({
    offset: 1
  })
  rows.forEach((r, i) => {
    if (i === 0) {
      printArticle(r)
    }
  })

}

accessSpreadsheet();