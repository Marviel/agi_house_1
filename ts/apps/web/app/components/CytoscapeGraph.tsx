import React, {
    useEffect,
    useRef,
} from 'react';

import cytoscape from 'cytoscape';
import dagre from 'cytoscape-dagre';

cytoscape.use(dagre);

const CytoscapeGraph = ({ elements, nodeClickCallback }: { elements: any, nodeClickCallback?: (nodeId: string) => void }) => {
    const cyRef = useRef(null);
    const cyInstance = useRef(null);

    useEffect(() => {
        //@ts-ignore
        cyInstance.current = cytoscape({
            container: cyRef.current, // container to render in
            elements: elements,
            style: [ // the stylesheet for the graph
                {
                    selector: 'node',
                    style: {
                        'background-color': '#666',
                        'color': '#fff',
                        'label': 'data(id)',
                        'text-valign': 'center',
                        'text-halign': 'center',
                        'shape': 'rectangle', // or 'ellipse', 'round-rectangle', etc.
                        'width': 'label',
                        'height': 'label',
                        //@ts-ignore
                        'padding': '10px', // padding around the label text
                        'font-size': '12px' // adjust based on the size of your text
                    }
                },
                {
                    selector: 'edge',
                    style: {
                        'width': 3,
                        'line-color': '#ccc',
                        'target-arrow-color': '#ccc',
                        'target-arrow-shape': 'triangle'
                    }
                }
            ],
            layout: {
                name: 'dagre',
                //@ts-ignore
                rankDir: 'TB'
            }
        });

        //@ts-ignore
        cyInstance.current.layout({ name: 'dagre', rankDir: 'TB' }).run(); // Run the Dagre layout initially


        //@ts-ignore
        cyInstance.current.on('tap', 'node', (event) => {
            const node = event.target;
            if (nodeClickCallback) {
                nodeClickCallback(node.id());
            }
        });

        // Cleanup on unmount
        return () => {
            if (cyInstance.current) {
                //@ts-ignore
                cyInstance.current.destroy();
            }
        };
    }, [elements, nodeClickCallback]);

    return (
        <div ref={cyRef} style={{ width: '600px', height: '600px' }} />
    );
};

export default CytoscapeGraph;