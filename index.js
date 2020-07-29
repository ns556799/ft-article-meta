const { GoogleSpreadsheet } = require("google-spreadsheet");
const { promisify } = require("util");
const fs = require("fs");

const creds = require("./creds.json");
const doc = new GoogleSpreadsheet(
  "1HkY4M5RRqBhcj9-vPPH5Bp7dAaPj46g3tHky4Fos_-o"
);
var og = require("open-graph");

let jsonArr = [];

function printArticle(article, i, arr) {
  const length = arr.length - 1;
  const url = article.URL;
  const month = article.Month;
  const year = article.Year;
  const client = article.Advertiser;
  const type = article.Type;
  const contentType = article.Content;

  og(url, (err, meta) => {
    if (typeof meta.image !== "undefined") {
      const img = meta.image.url;

      const arr = {
        url,
        month,
        year,
        client,
        type,
        contentType,
        img,
      };
      jsonArr.push(arr);

      if (length === i) {
        fs.writeFile("articles.json", JSON.stringify(jsonArr), function (err) {
          if (err) return console.log(err);
          console.log("Hello World > articles.json");
        });
      }
    } else {
      return null;
    }
  });
}

async function accessSpreadsheet() {
  await doc.useServiceAccountAuth({
    client_email: creds.client_email,
    private_key: creds.private_key,
  });

  await doc.loadInfo(); // loads document properties and worksheets
  console.log(doc.title);

  const sheets = doc.sheetsByIndex; // or use doc.sheetsById[id]

  const hub = sheets.filter((sheet) => sheet.title === "FT Content Hub")[0];
  const rows = await hub.getRows({
    offset: 1,
  });

  rows.forEach((r, i, arr) => {
    const length = arr.length;
    const cur = i + 1;
    printArticle(r, i, arr);
  });
}

accessSpreadsheet();
