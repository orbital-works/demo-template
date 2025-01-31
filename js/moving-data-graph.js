// Define the custom element
class MovingDataGraph extends HTMLElement {
    constructor() {
      super();
  
      // Attach a shadow DOM for encapsulation
      this.attachShadow({ mode: 'open' });
  
      // Create a canvas element for the graph
      this.canvas = document.createElement('canvas');
      this.canvas.width = this.getAttribute('width') || 300;
      this.canvas.height = this.getAttribute('height') || 150;
      this.shadowRoot.appendChild(this.canvas);
  
      // Get the 2D rendering context
      this.ctx = this.canvas.getContext('2d');
  
      // Data and animation variables
      this.data = [];
      this.maxDataPoints = this.getAttribute('data-points') || 50;
      this.animationId = null;
      this.dataValueRange = this.getAttribute('data-value-range') || 100; // Adjust as needed
      this.dataUpdateInterval = this.getAttribute('data-update-interval') || 50; // Milliseconds
    }
  
    connectedCallback() {
      // Start the animation loop when the component is connected
      this.startAnimation();
    }
  
    disconnectedCallback() {
      // Stop the animation when the component is disconnected
      this.stopAnimation();
    }
  
    startAnimation() {
      if (!this.animationId) {
          this.animationId = setInterval(() => this.updateGraph(), this.dataUpdateInterval);
      }
    }
  
  
    stopAnimation() {
      if (this.animationId) {
        clearInterval(this.animationId);
        this.animationId = null;
      }
    }
  
    addDataPoint(value) {
      this.data.push(value);
      if (this.data.length > this.maxDataPoints) {
        this.data.shift(); // Remove the oldest data point
      }
    }
  
    updateGraph() {
      // Simulate new data (replace with your actual data source)
      const newData = Math.random() * this.dataValueRange; // Example random data
      this.addDataPoint(newData);
  
      // Clear the canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  
      // Draw the axes
      this.ctx.strokeStyle = '#ccc'; // Light gray
      this.ctx.beginPath();
      this.ctx.moveTo(0, this.canvas.height);
      this.ctx.lineTo(this.canvas.width, this.canvas.height); // x-axis
      this.ctx.moveTo(0, 0);
      this.ctx.lineTo(0, this.canvas.height); // y-axis
      this.ctx.stroke();
  
  
      // Draw the graph line
      this.ctx.strokeStyle = 'blue'; // Or your preferred color
      this.ctx.beginPath();
  
      const xStep = this.canvas.width / (this.data.length - 1);
      for (let i = 0; i < this.data.length; i++) {
        const x = i * xStep;
        const y = this.canvas.height - (this.data[i] / this.dataValueRange) * this.canvas.height;
        if (i === 0) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }
      }
      this.ctx.stroke();
    }
  }
  
  // Define the custom element name
  customElements.define('moving-data-graph', MovingDataGraph);
  