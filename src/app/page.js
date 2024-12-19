"use client";
import React, {useState} from "react";

export default function HomeE() {
  const [videoFile, setVideoFile] = useState(null);
  const [textInput, setTextInput] = useState('');
  const [outputVideoUrl, setOutputVideoUrl] = useState(null);

  // const handleVideoUpload = (event) => {
  //   setVideoFile(event.target.files[0]);
  // };

  const handleTextChange = (event) => {
    setTextInput(event.target.value);
  };

  const handleSubmit = async () => {
    if (!videoFile || !textInput) {
      alert('Please upload a video and enter text.');
      return;
    }

    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('text', textInput);

    // Send to backend for processing
    try {
      const response = await fetch('/api/process-video', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setOutputVideoUrl(data.outputVideoUrl); // Assuming backend returns { outputVideoUrl: "url" }
        alert('Video processed successfully.');
      } else {
        alert('Error processing the video.');
      }
    } catch (error) {
      alert('Failed to communicate with the server.');
    }
  };

  const handleVideoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const tempFolderPath = '/Z:/Coding/Nextjs/hevetica/havetica/temp/';
      const filePath = tempFolderPath + file.name;
      // Assuming you have a backend endpoint to handle file storage
      const formData = new FormData();
      formData.append('file', file);
      formData.append('path', filePath);

      fetch('/api/upload-file', {
        method: 'POST',
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setVideoFile(filePath);
            alert('Video uploaded successfully.');
          } else {
            alert('Error uploading the video.');
          }
        })
        .catch(error => {
          alert('Failed to upload the video.');
        });
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h1>Video to Reel Generator</h1>

      <div>
        <label>
          Upload Video:
          <input type="file" accept="video/*" onChange={handleVideoUpload} />
        </label>
      </div>

      <div style={{ marginTop: '20px' }}>
        <label>
          Enter Text:
          <textarea
            value={textInput}
            onChange={handleTextChange}
            rows="4"
            style={{ width: '100%' }}
            placeholder="Enter your text here..."
            className="texty--"
          ></textarea>
        </label>
      </div>

      <button
        onClick={handleSubmit}
        style={{ marginTop: '20px', padding: '10px 20px', cursor: 'pointer', backgroundColor: 'red' }}
      >
        Submit
      </button>

      {outputVideoUrl && (
        <div style={{ marginTop: '20px' }}>
          <h2>Output Video:</h2>
          <video
            src={outputVideoUrl}
            controls
            style={{ width: '100%', maxHeight: '300px' }}
          ></video>
        </div>
      )}
    </div>
  );
}
