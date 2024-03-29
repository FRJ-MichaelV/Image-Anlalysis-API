const { ImageAnalysisClient } = require('@azure-rest/ai-vision-image-analysis');
const createClient = require('@azure-rest/ai-vision-image-analysis').default;
const { AzureKeyCredential } = require('@azure/core-auth');

// Load the .env file if it exists
require("dotenv").config();

const endpoint = process.env.VISION_ENDPOINT;
const key = process.env.VISION_KEY;

const { setLogLevel } = require("@azure/logger");
setLogLevel("info");

const credential = new AzureKeyCredential(key);
const client = createClient(endpoint, credential);

const features = [
  'Caption',
  'DenseCaptions',
  'People',
  'Objects'//,'Read'
];

//Image URL
const imageUrl = 'https://learn.microsoft.com/azure/ai-services/computer-vision/media/quickstarts/presentation.png';

//Image buffer
//const imagePath = '../IMG_0309.jpg';
//const imageData = fs.readFileAsync(imagePath);

async function analyzeImageFromUrl() {
  const result = await client.path('/imageanalysis:analyze').post({
    body: {
        url: imageUrl
    },
    queryParameters: {
        features: features,
        'language': 'en',
        'gender-neutral-captions': 'true'
    },
    contentType: 'application/json'
  });

  const iaResult = result.body;

    console.log(`Model Version: ${iaResult.modelVersion}`);
    console.log(`Image Metadata: ${JSON.stringify(iaResult.metadata)}`);
    if (iaResult.captionResult) {
    console.log(`Caption: ${iaResult.captionResult.text} (confidence: ${iaResult.captionResult.confidence})`);
    }
    if (iaResult.denseCaptionsResult) {
    iaResult.denseCaptionsResult.values.forEach(denseCaption => console.log(`Dense Caption: ${JSON.stringify(denseCaption)}`));
    }
    if (iaResult.objectsResult) {
    iaResult.objectsResult.values.forEach(object => console.log(`Object: ${JSON.stringify(object)}`));
    }
    if (iaResult.peopleResult) {
    iaResult.peopleResult.values.forEach(person => console.log(`Person: ${JSON.stringify(person)}`));
    }
}

analyzeImageFromUrl();