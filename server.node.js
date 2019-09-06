const
    Jimp = require('jimp'),
    Redis = require('ioredis'),
    async       = require('async'),
    stream      = "tweets",
    element     = "icon",
    dataCount   = 6,                                                // processing 6 images at this time
    fs          = require('fs');

const model_path = 'models/tensorflow/imagenet/resnet50.pb'
const script_path = 'models/tensorflow/imagenet/data_processing_script.txt'
 
const json_labels = fs.readFileSync('data/imagenet_classes.json')
const labels = JSON.parse(json_labels)

const image_width = 224;
const image_height = 224;


let redis = new Redis({ parser: 'javascript' });

let xrangeArgs = [].concat(                                                                                         
    stream,
    ['-', '+', 'COUNT'],
    dataCount                                                                                         
);

redis.call('XRANGE',                                                // Read from the streams                                                     
    xrangeArgs,                                                     // the rest of the arguments.
    function(err,data) {                                            // error first callback
        if (err) { done(err); } else {                              // handle the error
            if (data) {       
                data.forEach(function(aStream) {
                    let streamElements = aStream[1];
                    processImage(streamElements[1]);                // process image
                });
            } else {
                done(null);                                         // no data? ok - just return back with no error.
            }
        }
    }
);

function processImage(img) {  
    load_model();                               
    run(img);
}

async function load_model() {
    const model = fs.readFileSync(model_path, {'flag': 'r'})
    const script = fs.readFileSync(script_path, {'flag': 'r'})
    
    redis.call('AI.MODELSET', 'imagenet_model', 'TF', 'CPU',       // using tensorflow model
               'INPUTS', 'images', 'OUTPUTS', 'output', model)
    redis.call('AI.SCRIPTSET', 'imagenet_script', 'CPU', script)
}
  
async function run(filename) {
    let redis = new Redis({ parser: 'javascript' });

    let image = await Jimp.read(filename);
    let input_image = image.cover(image_width, image_height);
    let buffer = Buffer.from(input_image.bitmap.data);

    redis.call('AI.TENSORSET', 'image1',
                'UINT8', image_height, image_width, 4,
                'BLOB', buffer)

    redis.call('AI.SCRIPTRUN', 'imagenet_script', 'pre_process_4ch',
                'INPUTS', 'image1', 'OUTPUTS', 'temp1')

    redis.call('AI.MODELRUN', 'imagenet_model',
                'INPUTS', 'temp1', 'OUTPUTS', 'temp2')

    redis.call('AI.SCRIPTRUN', 'imagenet_script', 'post_process',
                'INPUTS', 'temp2', 'OUTPUTS', 'out')

    let out = await redis.call('AI.TENSORGET', 'out', 'VALUES')

    let idx = out[2][0]
    console.log('Image url: ' + filename + ', ' + 'Image index: ' + idx + ', ' + 'Label: ' + labels[idx.toString()]);
}