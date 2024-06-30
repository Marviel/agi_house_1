'use client'
import React, {
    useEffect,
    useRef,
    useState,
} from 'react';

import Cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';
import mermaid from 'mermaid';

Cytoscape.use(dagre);

mermaid.initialize({
    startOnLoad: true,
    theme: "default",
    securityLevel: "loose",
    themeCSS: `
    g.classGroup rect {
      fill: #282a36;
      stroke: #6272a4;
    } 
    g.classGroup text {
      fill: #f8f8f2;
    }
    g.classGroup line {
      stroke: #f8f8f2;
      stroke-width: 0.5;
    }
    .classLabel .box {
      stroke: #21222c;
      stroke-width: 3;
      fill: #21222c;
      opacity: 1;
    }
    .classLabel .label {
      fill: #f1fa8c;
    }
    .relation {
      stroke: #ff79c6;
      stroke-width: 1;
    }
    #compositionStart, #compositionEnd {
      fill: #bd93f9;
      stroke: #bd93f9;
      stroke-width: 1;
    }
    #aggregationEnd, #aggregationStart {
      fill: #21222c;
      stroke: #50fa7b;
      stroke-width: 1;
    }
    #dependencyStart, #dependencyEnd {
      fill: #00bcd4;
      stroke: #00bcd4;
      stroke-width: 1;
    } 
    #extensionStart, #extensionEnd {
      fill: #f8f8f2;
      stroke: #f8f8f2;
      stroke-width: 1;
    }`,
    fontFamily: "Fira Code"
});

//@ts-ignore
export function MermaidToCytoscape({ chart, onNodeClick }) {
    const [uniqId] = useState(() => 'mermaid');
    const [svgContent, setSvgContent] = useState('');
    const cyRef = useRef(null);

    useEffect(() => {
        const renderMermaid = async () => {
            try {
                const element = document.querySelector(`#${uniqId}`);

                if (!element) return;

                const { svg } = await mermaid.render(uniqId, chart);
                setSvgContent(svg); // Update the state with the new SVG content

                // Create a temporary element to parse the SVG
                const tempElement = document.createElement('div');
                tempElement.innerHTML = svg;
                const svgDoc = tempElement.firstChild;


                console.log('svgDoc', svgDoc)

                //@ts-ignore
                const nodes: any[] = [];
                //@ts-ignore
                const edges: any[] = [];
                //@ts-ignore
                const elements = svgDoc.querySelectorAll('.node, .edge');

                console.log('elements', elements)

                //@ts-ignore
                elements.forEach((element) => {
                    if (element.classList.contains('node')) {
                        const id = element.id;
                        const label = element.querySelector('text').textContent;
                        nodes.push({ data: { id, label } });
                    } else if (element.classList.contains('edge')) {
                        const title = element.querySelector('title').textContent;
                        //@ts-ignore
                        const [source, target] = title.split('->').map(str => str.trim());
                        edges.push({ data: { source, target } });
                    }
                });

                console.log('nodes', nodes, 'edges', edges);

                // Initialize Cytoscape
                //@ts-ignore
                cyRef.current = Cytoscape({
                    container: document.getElementById('cy'),
                    //@ts-ignore
                    elements: [...nodes, ...edges],
                    style: [
                        {
                            selector: 'node',
                            style: {
                                'label': 'data(label)',
                                'text-valign': 'center',
                                'text-halign': 'center',
                                'background-color': '#11479e',
                                'color': '#fff',
                                'shape': 'ellipse',
                                'width': '60px',
                                'height': '60px',
                            },
                        },
                        {
                            selector: 'edge',
                            style: {
                                'width': 2,
                                'line-color': '#9dbaea',
                                'target-arrow-color': '#9dbaea',
                                'target-arrow-shape': 'triangle',
                                'curve-style': 'bezier',
                            },
                        },
                    ],
                    layout: {
                        name: 'dagre',
                        //@ts-ignore
                        rankDir: 'TB',
                    },
                });

                // Register onclick events
                //@ts-ignore
                cyRef.current.on('tap', 'node', (event) => {
                    const nodeId = event.target.id();
                    onNodeClick(nodeId);
                });
            } catch (e) {
                console.error("Error rendering mermaid", e);
                setSvgContent('');
            }
        };

        renderMermaid();
    }, [chart, uniqId, onNodeClick]);

    return (
        <>
            <div style={{ display: 'flex', justifyContent: 'center' }} id={uniqId}></div>
            <div id="cy" style={{ width: '100%', height: '600px' }} />
        </>
    );
}