import React, { useState } from 'react';
import axios from 'axios';

const RequestPage = () => {
    const [tags, setTags] = useState([]);

    const predictionKey = '17e63e74876a483e9addfdab736ab711';
    const predictionEndpointUrl = 'https://eastus.api.cognitive.microsoft.com/customvision/v3.0/Prediction/fb61c380-ef76-4d3f-a2d0-f382b0a7a5a8/classify/iterations/Iteration9/url';
    
    const imageUrl = 'https://cdni.autocarindia.com/utils/imageresizer.ashx?n=https://cms.haymarketindia.net/model/uploads/modelimages/Hyundai-Grand-i10-Nios-200120231541.jpg';
    axios.post(predictionEndpointUrl, { url: imageUrl }, {
        headers: {
            'Content-Type': 'application/json',
            'Prediction-Key': predictionKey
        }
    }).then(response => {
        const predictions = response.data.predictions;
        const tags = predictions
            .filter(prediction => prediction.probability > 0.2)
            .map(prediction => ({
                name: prediction.tagName,
                probability: prediction.probability
        }));
        setTags(tags);
    }).catch(error => {
        console.error(error);
    });

    return (
        <div>
            <img src={imageUrl} alt="Input" />
            <ul>
                {tags.map(tag => <li key={tag.name}>{tag.name}: {tag.probability}</li>)}
            </ul>
        </div>
    );
}

export default RequestPage;