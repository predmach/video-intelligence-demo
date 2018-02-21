var mongoose = require('mongoose');
 
var metaLayerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    processing: String,
    summary: String,
    annotation: { 
        type: String, 
        enum: [
            'HELIOS',
            'GCE_VIDEO_INTEL'
        ],
        default: 'HELIOS'
    },
    video: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Video'
    },
    sampling: [
        {
            summary: String,
            detail: String,
            numberOfExecutions: Number,
            created: { 
                type: Date,
                default: Date.now
            }
        }
    ],
    created: { 
        type: Date,
        default: Date.now
    }
});
 
var MetaLayer = mongoose.model('MetaLayer', metaLayerSchema);
 
module.exports = MetaLayer;