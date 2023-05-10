import React, { useState, useEffect } from "react";


const predictionKey = " 17e63e74876a483e9addfdab736ab711";
const endpoint = "https://similarcarfinder.cognitiveservices.azure.com/";
const projectId = "fb61c380-ef76-4d3f-a2d0-f382b0a7a5a8";
const publishedName = "Iteration9";
const imageUrl = "https://i.pinimg.com/170x/01/0a/2a/010a2a39d73033ad4434c9cad8a600bb.jpg";

const Prediction = () => {
    const [predictions, setPredictions] = useState([]);

    const predictionUrl = `${endpoint}/customvision/v3.0/Prediction/${projectId}/classify/iterations/${publishedName}/url`;

    async function predict() {
        const response = await fetch(predictionUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Prediction-Key": predictionKey
            },
            body: JSON.stringify({ Url: imageUrl })
        });

        const data = await response.json();
        setPredictions(data.predictions);
    }

    useEffect(() => {
        predict();
    }, []);

    // Define the tag categories and the tags that belong to each category
    const categories = [
        { name: "color", tags: ["black","blue","gray","green","red","white", "yellow"] },
        { name: "make", tags: ["audi","ford","holden","honda","mazda", "mercedes-benz","nissan","peugeot","toyota","volkswagen","other"] },
        { name: "body shape", tags: ["coupe","hatchback","sedan","suv","utility", "van", "wagon"] }
    ];

    // Find the top tag for each category
    const topTags = categories.map(category => {
        const categoryTags = predictions.filter(prediction => category.tags.includes(prediction.tagName));
        const topTag = categoryTags.reduce((prev, current) => (prev.probability > current.probability) ? prev : current);
        return topTag;
    });

    return (
        <div>
            <img src={imageUrl} alt="Input" />
            <ul>
                {topTags.map(tag => (
                    <li key={tag.tagName}>
                        {tag.tagName}: {tag.probability * 100}%
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Prediction;