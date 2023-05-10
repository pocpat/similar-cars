import React, { useState, useEffect } from "react";


const predictionKey = " 17e63e74876a483e9addfdab736ab711";
const endpoint = "https://similarcarfinder.cognitiveservices.azure.com/";
const projectId = "fb61c380-ef76-4d3f-a2d0-f382b0a7a5a8";
const publishedName = "Iteration9";
const imageUrl = "https://imgcdn.oto.com/large/gallery/color/14/1631/honda-civic-hatchback-color-569628.jpg";

const Prediction = (props) => {
    const { onTopTagsChange } = props;
    const [predictions, setPredictions] = useState([]);
    const [topTags, setTopTags] = useState([]);
  
    const predictionUrl = `${endpoint}/customvision/v3.0/Prediction/${projectId}/classify/iterations/${publishedName}/url`;
  
    async function predict() {
      console.log("call predict");
      const response = await fetch(predictionUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Prediction-Key": predictionKey
        },
        body: JSON.stringify({ Url: imageUrl })
      });
  
      const data = await response.json();
      console.log("data.predictions: " + data.predictions);
      setPredictions(data.predictions);
    }
  
    useEffect(() => {
      predict();  // here is some error
    }, []);
  
    
  
    // Calculate the top tags
    useEffect(() => {
        console.log("filter categories");
        // Define the tag categories and the tags that belong to each category
    const categories = [
        { name: "color", tags: ["black", "blue", "gray", "green", "red", "white", "yellow"] },
        { name: "make", tags: ["audi", "ford", "holden", "honda", "mazda", "mercedes-benz", "nissan", "peugeot", "toyota", "volkswagen", "other"] },
        { name: "body-shape", tags: ["coupe", "hatchback", "sedan", "suv", "utility", "van", "wagon"] }
      ];

      const newTopTags = categories.map(category => {
        const categoryTags = predictions.filter(prediction => category.tags.includes(prediction.tagName));
        if (categoryTags.length === 0) {
          console.log("No " + category.name + " category tag found");
          console.log("predictions: " + predictions);
          return {category: "none", tag: {  tagName: `No ${category.name} tag found`, probability: 0 } };
        }
        const topTag = categoryTags.reduce((prev, current) => (prev.probability > current.probability) ? prev : current);
        return {category: category.name, tag: topTag};
      });
      setTopTags(newTopTags);
    }, [ predictions]);
  
    // Pass the top tags back to the parent component
    useEffect(() => {
      if (JSON.stringify(topTags) !== JSON.stringify(props.topTags)) {
        onTopTagsChange(topTags);
      }
    }, [onTopTagsChange, topTags, props.topTags]);
  
    return (
      <div>
        <img src={imageUrl} alt="Car" style={{ width: '700px', height: 'auto' }} />
        <ul>
          {topTags.map(tagAndCat => (
            <li key={tagAndCat.tag.tagName}>
             {tagAndCat.category} - {tagAndCat.tag.tagName}: {tagAndCat.tag.probability * 100}%
            </li>
          ))}
        </ul>
      </div>
    );
  }
  export default Prediction;