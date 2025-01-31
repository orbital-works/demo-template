class KnowledgeGraph extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        #graph {
          width: 100%;
          height: 100%;
        }
      </style>
      <canvas id="graph"></canvas>
    `;
  }

  connectedCallback() {
    this.renderGraph();
  }

  renderGraph() {
    const canvas = this.shadowRoot.getElementById('graph');
    const ctx = canvas.getContext('2d');
    canvas.width = this.clientWidth;
    canvas.height = this.clientHeight;

    const nodes = [
      { x: 50, y: 50 },
      { x: 150, y: 50 },
      { x: 100, y: 150 }
    ];

    const edges = [
      { from: 0, to: 1 },
      { from: 1, to: 2 },
      { from: 2, to: 0 }
    ];

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    edges.forEach(edge => {
      const fromNode = nodes[edge.from];
      const toNode = nodes[edge.to];
      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);
      ctx.stroke();
    });

    nodes.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 10, 0, Math.PI * 2);
      ctx.fill();
    });
  }
}

customElements.define('knowledge-graph', KnowledgeGraph);