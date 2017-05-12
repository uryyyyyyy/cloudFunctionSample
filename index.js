
const http = require('http');
const formidable = require('formidable');
const fs = require('fs');

http.createServer((req, res) => {

  const form = new formidable.IncomingForm();
  form.uploadDir = "./tmp";
  console.log('hello')
  form.parse(req, (err, fields, files) => {
    if (err){
      console.error(err)
      res.write('error');
      res.end();
    } else {
      const file = files['myFile']


      const gcloud = require('google-cloud')({
        projectId: 'uryyyyyyy-ai-executor',
        keyFilename: './google-service.json'
      });

      const gcs = gcloud.storage();
      const bucket = gcs.bucket('uryyyyyyy-ai-executor');

      const options = {
        destination: `tmp/${file.name}`,
        resumable: true,
        validation: 'crc32c',
        public: true
      };
      bucket.upload(file.path, options, (err, file) => {
        if (err) {
          console.error(err)
          res.write('error');
          res.end();
        } else {
          console.log(file)
          res.write(file.toString());
          res.end();
        }
      });
    }
  });
}).listen(8080);

