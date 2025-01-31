class MovingKnowledgeGraph extends HTMLElement {
    constructor() {
      super();
  
      this.attachShadow({ mode: 'open' }); // Create a shadow DOM
  
      // Styling for the component (scoped to the shadow DOM)
      const style = document.createElement('style');
      style.textContent = `
        :host {
          display: block; /* Make the component a block element */
          width: 600px; /* Set a default width */
          height: 400px; /* Set a default height */
          position: relative; /* For positioning nodes */
          overflow: hidden; /* Hide nodes that go outside the container */
          background-color: #f0f0f0; /* Light gray background */
        }
        .node {
          position: absolute;
          width: 20px;
          height: 20px;
          border-radius: 50%; /* Make nodes circular */
          background-color: #3498db; /* Blue nodes */
          cursor: pointer; /* Indicate interactivity */
          transition: background-color 0.3s; /* Smooth transition for hover effect */
          display: flex;
          align-items: center;
          justify-content: center;
          color: white; /* White text color */
          font-size: 12px; /* Smaller font size for labels */
        }
        .node:hover {
          background-color: #2980b9; /* Darker blue on hover */
        }
        .edge {
          position: absolute;
          height: 2px; /* Thin edges */
          background-color: #7f8c8d; /* Gray edges */
          z-index: -1; /* Place edges behind nodes */
        }
        .label { /* Style for the node labels */
          position: absolute;
          top: -20px; /* Position above the node */
          left: 50%;
          transform: translateX(-50%); /* Center the label */
          background-color: rgba(0, 0, 0, 0.7); /* Semi-transparent black background */
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          white-space: nowrap; /* Prevent labels from wrapping */
        }
      `;
      this.shadowRoot.appendChild(style);
  
      this.graphContainer = document.createElement('div');
      this.shadowRoot.appendChild(this.graphContainer);
  
      this.nodes = [];
      this.edges = [];
      this.data = []; // Store the graph data
  
      this.animationId = null; // ID for the animation frame
      this.dx = 0.5; // Horizontal movement speed
      this.dy = 0.2; // Vertical movement speed
    }
  
    connectedCallback() {
      // Get the graph data from the attribute or use default data
      const dataAttribute = this.getAttribute('data');
      this.data = dataAttribute ? JSON.parse(dataAttribute) : this.getDefaultData();
  
      this.createGraph();
      this.startAnimation();
    }
  
    disconnectedCallback() {
      this.stopAnimation();
    }
  
    getDefaultData() {
      // Example default graph data (replace with your own)
      return [
        { id: 1, label: 'Node 1', x: 50, y: 50 },
        { id: 2, label: 'Node 2', x: 200, y: 100 },
        { id: 3, label: 'Node 3', x: 100, y: 250 },
        { id: 4, label: 'Node 4', x: 350, y: 150 },
        { id: 5, label: 'Node 5', x: 250, y: 300 },
        { from: 1, to: 2 },
        { from: 1, to: 3 },
        { from: 2, to: 4 },
        { from: 3, to: 5 },
        { from: 4, to: 5 },
      ];
    }
  
    createGraph() {
      this.data.forEach(item => {
        if (item.label) { // It's a node
          const node = document.createElement('div');
          node.classList.add('node');
          node.style.left = `${item.x}px`;
          node.style.top = `${item.y}px`;
          node.textContent = item.id; // Or any other identifier
          this.graphContainer.appendChild(node);
          this.nodes.push(node);
  
          // Add the label
          const label = document.createElement('div');
          label.classList.add('label');
          label.textContent = item.label;
          node.appendChild(label);
  
        } else if (item.from && item.to) { // It's an edge
          const edge = document.createElement('div');
          edge.classList.add('edge');
          this.graphContainer.appendChild(edge);
          this.edges.push(edge);
        }
      });
  
      this.updateEdges(); // Initial edge positions
    }
  
    updateEdges() {
      this.edges.forEach(edge => {
        const fromNode = this.nodes[this.data.findIndex(item => item.id === this.data.find(e => e.from === this.data.indexOf(edge) +1).from) ];
        const toNode = this.nodes[this.data.findIndex(item => item.id === this.data.find(e => e.to === this.data.indexOf(edge) +1).to) ];
  
        const fromRect = fromNode.getBoundingClientRect();
        const toRect = toNode.getBoundingClientRect();
  
        const x1 = fromRect.left + fromRect.width / 2 - this.graphContainer.offsetLeft;
        const y1 = fromRect.top + fromRect.height / 2 - this.graphContainer.offsetTop;
        const x2 = toRect.left + toRect.width / 2 - this.graphContainer.offsetLeft;
        const y2 = toRect.top + toRect.height / 2 - this.graphContainer.offsetTop;
  
        const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
  
        edge.style.width = `${length}px`;
        edge.style.left = `${x1}px`;
        edge.style.top = `${y1}px`;
        edge.style.transform = `rotate(${angle}deg)`;
      });
    }
  
  
    startAnimation() {
      if (this.animationId) return; // prevent multiple animations
  
      const animate = () => {
        this.nodes.forEach(node => {
          let x = parseFloat(node.style.left);
          let y = parseFloat(node.style.top);
  
          x += this.dx;
          y += this.dy;
  
          const containerWidth = this.offsetWidth;
          const containerHeight = this.offsetHeight;
          const nodeWidth = node.offsetWidth;
          const nodeHeight = node.offsetHeight;
  
          if (x + nodeWidth > containerWidth || x < 0) {
            this.dx *= -1;
          }
          if (y + nodeHeight > containerHeight || y < 0) {
            this.dy *= -1;
          }
  
          node.style.left = `${x}px`;
          node.style.top = `${y}px`;
        });
        this.updateEdges();
        this.animationId = requestAnimationFrame(animate);
      };
  
      this.animationId = requestAnimationFrame(animate);
    }
  
    stopAnimation() {
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
    }
  }
  
  customElements.define('moving-knowledge-graph', MovingKnowledgeGraph);