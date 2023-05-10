import React, { useState, useEffect } from "react";


const ShowSimilar = (props) => {
    const { topTags } = props;
    console.log(topTags);
    const [taggedImages, setTaggedImages] = useState([]);

    const trainingKey = "b21b176bdac64ef4bcd52f1a0514c618";
    const endpoint = "https://similarcarfinder.cognitiveservices.azure.com/";
    const projectId = "fb61c380-ef76-4d3f-a2d0-f382b0a7a5a8";

    const trainingApiUrl = `${endpoint}/customvision/v3.3/training/projects/${projectId}/images/tagged`;

    async function getTaggedImages(tagIds) {
        const response = await fetch(`${trainingApiUrl}?tagIds=${tagIds}`, {
                method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Training-Key": trainingKey
          }
        });
        const data = await response.json();
        return data;
      }
    
      useEffect(() => {
        async function fetchTaggedImages() {
           
            const colorTagObject = topTags.find(tag => tag.category === "color");
            const bodyShapeTagObject = topTags.find(tag => tag.category === "body-shape");
            const makeTagObject = topTags.find(tag => tag.category === "make");
          
            if (!colorTagObject || !bodyShapeTagObject) {
              // Handle the case where colorTagObject or bodyShapeTagObject are undefined
              console.log("No color or body-shape tag found");
              return;
            }
          
            const colorTagId = colorTagObject.tag.tagId;
            const bodyShapeTagId = bodyShapeTagObject.tag.tagId;
            //const makeTag = makeTagObject.tag.tagId;
          
            let images = await getTaggedImages([colorTagId,bodyShapeTagId]);
            console.log("images: " + images.length);
            //images = images.filter(image => image.tags.includes(bodyShapeTagObject.tag.tagName));
            images = images.filter(image => image.tags.find(tag => tag.tagName === makeTagObject.tag.tagName));
            console.log("makeTagObject.tag.tagName: " + makeTagObject.tag.tagName + " / images after filter: " + images.length);
            
            
            setTaggedImages(images);
          }




        fetchTaggedImages();
      }, [topTags]);
    
      return (
        <div>
          <ul>
            {taggedImages.map(image => (
              <li key={image.id}>
                <img src={image.thumbnailUri} alt={image.resizedImageUri} style={{ width: '700px', height: 'auto' }} />
              </li>
            ))}
          </ul>
        </div>
      );
    };
    
    export default ShowSimilar;