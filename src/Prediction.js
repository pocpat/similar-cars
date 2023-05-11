import React, { useState, useEffect } from "react";
import { categories } from './categories.js';
import "./App.css";


const predictionKey = process.env.REACT_APP_PREDICTION_KEY;
const endpoint = process.env.REACT_APP_ENDPOINT;
const projectId = process.env.REACT_APP_PROJECT_ID;
const publishedName = process.env.REACT_APP_PUBLISHED_NAME;

const Prediction = (props) => {
  // make input tor reusable image URL on the front page
  const [imageUrl, setImageUrl] = useState("");
  let userInput = (e) => setImageUrl(e.target.value);

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
        "Prediction-Key": predictionKey,
      },
      body: JSON.stringify({ Url: imageUrl }),
    });
console.log("response: " + response);
    const data = await response.json();
    console.log("data.predictions: " + data.predictions);
    setPredictions(data.predictions);
  }

  useEffect(() => {
    predict(); // here is some error
  }, []);

  // Calculate the top tags
  useEffect(() => {
    if (predictions) {
      console.log("filter categories");

      // Define the tag categories and the tags that belong to each category
      const newTopTags = categories.map((category) => {
        const categoryTags = predictions.filter((prediction) =>
          category.tags.includes(prediction.tagName)
        );
        if (categoryTags.length === 0) {
          console.log("No " + category.name + " category tag found");
          console.log("predictions: " + predictions);
          return {
            category: "none",
            tag: { tagName: `No ${category.name} tag found`, probability: 0 },
          };
        }
        const topTag = categoryTags.reduce((prev, current) =>
          prev.probability > current.probability ? prev : current
        );
        return { category: category.name, tag: topTag };
      });
      setTopTags(newTopTags);
    }
  }, [predictions]);

  // Pass the top tags back to the parent component
  useEffect(() => {
    if (JSON.stringify(topTags) !== JSON.stringify(props.topTags)) {
      onTopTagsChange(topTags);
    }
  }, [onTopTagsChange, topTags, props.topTags]);
  const handleClearInput = () => {
    setImageUrl("");
  };
  return (
    <div className="inputCar">
      <input
        type="text"
        placeholder="Input your car URL"
        value={imageUrl}
        onChange={userInput}
        style={{ width: "700px", height: "auto" }}
      />
      <button className="clearBTN" onClick={handleClearInput}>
        Clear Input
      </button>
      <img
        src={imageUrl}
        alt="Car"
        style={{ width: "700px", height: "auto" }}
      />
      <button className="predictBTN" onClick={predict}>
        Get Predictions
      </button>

      <ul>
        {topTags.map((tagAndCat) => (
          <li key={tagAndCat.tag.tagName}>
            {tagAndCat.category} - {tagAndCat.tag.tagName}:{" "}
            {Math.floor(tagAndCat.tag.probability * 100)}%
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Prediction;
