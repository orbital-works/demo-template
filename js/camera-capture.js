// Define the web component
class CameraCapture extends HTMLElement {
    constructor() {
        super();

        // Create the shadow DOM
        this.attachShadow({ mode: 'open' });

        // Create elements
        this.video = document.createElement('video');
        this.canvas = document.createElement('canvas');
        this.captureButton = document.createElement('button');
        this.captureButton.textContent = 'Capture Photo';
        this.imageDisplay = document.createElement('img'); // For displaying captured image
        this.imageDisplay.style.maxWidth = '100%'; // Ensure image fits within container

        // Styling (basic - you'll likely want to improve this)
        const style = document.createElement('style');
        style.textContent = `
        :host {
          display: block; /* Makes the component a block element */
          width: 320px;   /* Example width - adjust as needed */
          position: relative; /* For positioning the button */
        }
        video {
          width: 100%;
        }
        canvas {
          display: none; /* Initially hidden */
        }
        .capture-controls { /* Container for button and image display */
          display: flex;
          flex-direction: column; /* Stack button and image vertically */
          align-items: center;  /* Center horizontally */
          margin-top: 10px;
        }
  
        .capture-controls > * { /* Style direct children (button, image) */
          margin-bottom: 10px; /* Add some spacing */
        }
  
      `;


        // Append elements to the shadow DOM
        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(this.video);
        this.shadowRoot.appendChild(this.canvas);
        const captureControls = document.createElement('div');
        captureControls.classList.add('capture-controls');
        captureControls.appendChild(this.captureButton);
        captureControls.appendChild(this.imageDisplay);
        this.shadowRoot.appendChild(captureControls);

        this.stream = null; // Store the video stream
        this.capturedImage = null; // Store the captured image data URL

        // Event listener for the capture button
        this.captureButton.addEventListener('click', this.capturePhoto.bind(this));
    }



    connectedCallback() {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                this.stream = stream;
                this.video.srcObject = stream;
                this.video.play();
            })
            .catch(error => {
                console.error('Error accessing camera:', error);
                // Handle error, e.g., display a message to the user
                const errorMessage = document.createElement('p');
                errorMessage.textContent = "Camera access denied or unavailable.";
                this.shadowRoot.insertBefore(errorMessage, this.video); // Insert message before the video
                this.video.style.display = 'none'; // Hide the video element
            });
    }

    disconnectedCallback() {
        if (this.stream) {
            const tracks = this.stream.getTracks();
            tracks.forEach(track => track.stop());
        }
    }

    capturePhoto() {
        const width = this.video.videoWidth;
        const height = this.video.videoHeight;

        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.getContext('2d').drawImage(this.video, 0, 0, width, height);

        this.capturedImage = this.canvas.toDataURL('image/png'); // Get data URL

        // Display the captured image
        this.imageDisplay.src = this.capturedImage;
        this.imageDisplay.style.display = 'block';  // Make the image visible
        this.video.style.display = 'none'; // Hide the video


        // Dispatch a custom event with the captured image data
        const captureEvent = new CustomEvent('image-captured', {
            detail: { imageData: this.capturedImage }
        });
        this.dispatchEvent(captureEvent);

    }
}

// Define the custom element
customElements.define('camera-capture', CameraCapture);