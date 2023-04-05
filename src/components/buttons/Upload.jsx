import React, { useState } from 'react';

const Upload = (props) => {
  const [error, setError] = useState(null);
  const handleFileUpload = (event) => {
    const files = event.target.files || event.dataTransfer.files;
    if (files && files.length) {
      const formData = new FormData();
      formData.append('fileToUpload', files[0]);

      fetch('https://nostr.build/upload.php', {
        method: 'POST',
        body: formData,
      })
        .then(async (response) => {
          const text = await response.text();
          const url = text.match(
            /https:\/\/nostr\.build\/(?:i|av)\/nostr\.build_[a-z0-9]{64}\.[a-z0-9]+/i,
          );
          if (url && props.onUrl) {
            props.onUrl(url[0]);
          }
        })
        .catch((error) => {
          console.error('upload error', error);
          setError('upload failed: ' + JSON.stringify(error));
        });
    }
  };


  const attachFileClicked = (event) => {
    event.stopPropagation();
    event.preventDefault();

  }

  return (
    <div
      style={{
        position: "relative",
        width: "24px",
        height: "24px",
        cursor: "pointer",
      }}
    >
    
      <svg
        style={{
          position: "absolute",
          left: 0,
          right: 0,
        }}
        width="24" height="24" viewBox="0 0 24 24">
        <path
          fill="currentColor"
          d="M21.586 10.461l-10.05 10.075c-1.95 1.949-5.122 1.949-7.071 0s-1.95-5.122 0-7.072l10.628-10.585c1.17-1.17 3.073-1.17 4.243 0 1.169 1.17 1.17 3.072 0 4.242l-8.507 8.464c-.39.39-1.024.39-1.414 0s-.39-1.024 0-1.414l7.093-7.05-1.415-1.414-7.093 7.049c-1.172 1.172-1.171 3.073 0 4.244s3.071 1.171 4.242 0l8.507-8.464c.977-.977 1.464-2.256 1.464-3.536 0-2.769-2.246-4.999-5-4.999-1.28 0-2.559.488-3.536 1.465l-10.627 10.583c-1.366 1.368-2.05 3.159-2.05 4.951 0 3.863 3.13 7 7 7 1.792 0 3.583-.684 4.95-2.05l10.05-10.075-1.414-1.414z"
        />
      </svg>
      <input name=".attachment-input" type="file"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          fontSize:0,
          cursor: "pointer",
          opacity: 0,
          width: "24px",
          height: "24px"
        }}
        accept= "image/*, video/*, audio/*"
        multiple
        onChange={handleFileUpload} />
      {error ? <p>{error}</p> : null}
    </div>
  );
};

export default Upload;
