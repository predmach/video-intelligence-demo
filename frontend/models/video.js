var mongoose = require('mongoose');
 
var videoSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    url: {
        type: String,
        required: true
    },
    hash: String,
    created: { 
        type: Date,
        default: Date.now
    },
    // UI
    name: String,
    link: String, //mediaLink
    url_safe_id: String, // name that is GS safe
    annotations: String, //body.annotation_results[0],
    thumbnail: String, // PNG
    preview: String // PNG
});
 
var Video = mongoose.model('Video', videoSchema);
 
module.exports = Video;