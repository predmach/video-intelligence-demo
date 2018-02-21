const sha256 = require('sha256')
const mongoose = require('mongoose');
const Video = require('./models/video');
const MetaLayer = require('./models/metalayer');

// sudo docker run -d -p 27017:27017 -v ~/data:/data/db mongo

function find() {
    MetaLayer.find({
        processing: /F/i
    }).sort('-created')
    .limit(5)
    .exec(function(err, procs) {
        if (err) throw err;
        console.log(`procs:${procs}`);
    });


    let fileArray = [];
    
    const cursor = Video.find()
    .sort('-created').cursor()
    cursor.on('data', video => 
    { 
      console.log(`video: ${video}`); 

      MetaLayer.findOne({
        video: video._id,
        annotation: 'GCE_VIDEO_INTEL'
      }).sort('-created')
      .exec(function(err, annotations) {
        if (err) throw err;
        console.log(`annotations:${annotations}`);

        //FIX: have to query the annotations

        fileArray.push({
          _id: video._id,
          name: video.name,
          link: video.link,
          url_safe_id: video.url_safe_id, 
          annotations: 'test', // annotations[0],
          thumbnail: video.thumbnail,
          preview: video.preview
        });
        //TODO: signal UI incrementally
      });
    });
    cursor.on('close', function() {
      // Called when done
      console.log(fileArray);
    });

}

function populate() {
    let video_url = 'https://www.youtube.com/watch?v=zHp_2CPnMlA'
    let hash = sha256(video_url)
    // let path = `/${hash}`
    let path = ``
    let repo = '../sample-annotations'
    let name = `google-home-superbowl`

    fs = require('fs');
    var annotations = fs.readFileSync(`${repo}${path}/${name}mp4.json`, "utf8");

    var testVideo = new Video({
        _id: new mongoose.Types.ObjectId(),
        url: video_url,
        hash: hash,
        link: `${repo}${path}/${name}.mp4`,
        name: 'google-home-superbowl',
        link: `${repo}${path}/${name}.mp4`,
        annotations: annotations,
        url_safe_id: `${repo}${path}/${name}.mp4`, 
        thumbnail: `${repo}${path}/${name}.png`,
        preview: `${repo}${path}/${name}-preview.png`
    });
 
    testVideo.save(function(err) {
        if (err) throw err;
         
        console.log('Video successfully saved.');         
        var proc1 = new MetaLayer({
            _id: new mongoose.Types.ObjectId(),
            processing: 'Faster R-CNN',
            summary: 'From Facebook, with ResNet-101',
            processing: String,
            video: testVideo._id,
            sampling: [{
                summary: '1280x720 25fps',
                detail: 'distributed across 7 nodes',
                numberOfExecutions: 500
            }]
        });
         
        proc1.save(function(err) {
            if (err) throw err;         
            console.log('Processing 1 successfully saved.');
        });
         
        var proc2 = new MetaLayer({
            _id: new mongoose.Types.ObjectId(),
            processing: 'Masked FCN',
            summary: 'From Facebook, with VGG',
            processing: String,
            video: testVideo._id,
            sampling: [{
                summary: '640x200 5fps',
                detail: 'summary sampling',
                numberOfExecutions: 100
            }]
        });
         
        proc2.save(function(err) {
            if (err) throw err;         
            console.log('Processing 2 successfully saved.');
        });
    });
}

if (require.main === module) {
    // If the Node process ends, close the Mongoose connection
    var gracefulExit = function() { 
        mongoose.connection.close(function () {
            console.log('Mongoose default connection with DB is disconnected through app termination');
            process.exit(0);
        });
    }
    process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);

    mongoose.connect('mongodb://localhost/helios', function (err) {
        // mongo mongoose_basics --eval "db.dropDatabase()"
        if (err) throw err;
        

        populate();
        find();

        console.log('Successfully connected');
        
    });

    // If the connection throws an error
    mongoose.connection.on('error', function(err) {
        console.error('Failed to connect to DB on startup ', err);
    });
    
    // When the connection is disconnected
    mongoose.connection.on('disconnected', function () {
        console.log('Mongoose default connection to DB : disconnected');
    });

}  
