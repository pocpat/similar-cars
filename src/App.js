import { useState, useEffect } from 'react';
import './App.css';
import Prediction from './Prediction';
import ShowSimilar from './ShowSimilar';


function App() {
  const [topTags, setTopTags] = useState([]);

  const handleTopTagsChange = (newTopTags) => {
    setTopTags(newTopTags);   // here problem 1
  }

  return (
    <div className="App">
      <h1>Input Car</h1>
      <Prediction onTopTagsChange={handleTopTagsChange} topTags={topTags} />
      <h1>Similar Cars</h1>
      <ShowSimilar topTags={topTags} />
    </div>
  );
}
export default App;
