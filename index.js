const { GoogleSpreadsheet } = require("google-spreadsheet");
const AWS = require("aws-sdk");
const doc = new GoogleSpreadsheet(
  "1HkY4M5RRqBhcj9-vPPH5Bp7dAaPj46g3tHky4Fos_-o"
);
const og = require("open-graph");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS,
  secretAccessKey: process.env.AWS_SECRET,
  region: process.env.AWS_REGION,
});

s3 = new AWS.S3({
  apiVersion: "2006-03-01",
});
const uploadParams = {
  Bucket: process.env.AWS_BUCKET,
  Key: "",
  Body: "",
};

let jsonArr = [];

function printArticle(article, i, arr) {
  const length = arr.length - 1;
  const url = article.URL;
  const month = article.Month;
  const year = article.Year;
  const client = article.Advertiser;
  const type = article.Type;
  const contentType = article.Content;
  const author = article.Author;
  const sector = article.Sector;


  og(url, (err, meta) => {
    if (typeof meta.image !== "undefined") {
      const img = meta.image.url;
      const title = metal.title


      const arr = {
        url,
        month,
        year,
        client,
        title,
        type,
        contentType,
        img,
        author,
        sector,
      };
      jsonArr.push(arr);

      if (length === i) {
        setTimeout(function () {
          try {
            uploadParams.Body = JSON.stringify(jsonArr);
            uploadParams.Key = `paidpost/article-hub/contentHub.json`;
            s3.upload(uploadParams, function (err, data) {
              console.log("Uploading JSON file");
              if (err) {
                console.log("Error", err);
              }
            });
          } catch (err) {
            console.error(err);
          }
        }, 1000);
      }
    } else {
      return null;
    }
  });
}

async function accessSpreadsheet() {
  const creds = JSON.parse(process.env.GOOGLE_CREDENTIALS);
  console.log(creds.client_id);
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
