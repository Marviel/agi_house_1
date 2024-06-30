'use client'
import React, {
    useCallback,
    useMemo,
    useState,
} from 'react';

import axios from 'axios';

import { notEmpty } from '@lukebechtel/lab-ts-utils';
import { Delete } from '@mui/icons-material';
import {
    Button,
    IconButton,
    LinearProgress,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material';

import CytoscapeGraph from '../../components/CytoscapeGraph';

//@ts-ignore
window.callback = (e) => {
    console.log(e);
}


export default function AICodeSandboxPage() {
    const [showEditor, setShowEditor] = useState(false);

    const [diveStack, setDiveStack] = useState<string[]>(['']);

    const [hasGeneratedOnce, setHasGeneratedOnce] = useState(false);

    // An example mermaid file
    const [generatingCodeState, setGeneratingCodeState] = useState<'waiting' | 'generating' | 'generated'>('waiting');

    const [cytoscapeElements, setCytoscapeElements] = useState([
        // { data: { id: 'A' }, position: { x: 100, y: 100 } },
        // { data: { id: 'B' }, position: { x: 200, y: 100 } },
        // { data: { id: 'C' }, position: { x: 100, y: 200 } },
        // { data: { source: 'A', target: 'B' } },
        // { data: { source: 'A', target: 'C' } },
    ]);

    const subject = useMemo(() => {
        return diveStack[diveStack.length - 1];
    }, [diveStack]);

    const updateSubject = useCallback((newSubject: string) => {
        setDiveStack((stack) => {
            return [...stack.slice(0, stack.length - 1), newSubject];
        });
    }, []);

    const generateCode = useCallback(async (curStack: string[]) => {
        if (generatingCodeState === 'generating') {
            return;
        }
        setHasGeneratedOnce(true);

        setGeneratingCodeState('generating');

        try {
            const result = await axios.post('/api/ai/diagram-dive', { subject: `${[curStack].join(' > ')}`, existingDiagram: JSON.stringify(cytoscapeElements) });
            setCytoscapeElements(result.data.response.elements);
        } catch (error) {
            console.error('Error generating diagram:', error);
        }
        finally {
            setGeneratingCodeState('waiting');
        }
    }, [subject, generatingCodeState, cytoscapeElements]);

    const deleteNode = useCallback((id: string) => {
        setCytoscapeElements((elements: any) => {
            return elements.map((element: any) => {
                if (element.data.id === id || element.data.source === id || element.data.target === id) {
                    return null
                }
                else {
                    return element;
                }
            }).filter(notEmpty);
        });
    }, []);

    return (
        <Paper>
            <Stack padding={2} gap={1}>
                <Typography variant="h4" alignSelf={'center'}>
                    🌳 Diagram Dive
                </Typography>
                {
                    !hasGeneratedOnce ? (
                        <Stack>
                            <TextField
                                autoComplete="off"
                                aria-autocomplete="none"
                                label={'What Do You Want To Learn About?'}
                                fullWidth={true}
                                value={subject} onChange={(e) => {
                                    updateSubject(e.target.value);
                                }}
                            />
                            <Button
                                disabled={generatingCodeState === 'generating' || !subject || subject.trim().length < 2}
                                onClick={() => {
                                    generateCode(diveStack)
                                }}
                            >
                                Diagram It!
                            </Button>
                        </Stack>
                    )
                        :
                        (
                            <div>
                                <Stack gap={1}>
                                    {
                                        diveStack.map((stackItem, index) => {
                                            return (
                                                <Stack key={index} gap={1} direction={'row'} alignItems={'center'}>
                                                    <Typography variant="body1">
                                                        {stackItem}
                                                    </Typography>
                                                    <IconButton
                                                        size='small'
                                                        color='gray'
                                                        onClick={() => {
                                                            setDiveStack((stack) => {
                                                                return stack.slice(0, index + 1);
                                                            });
                                                        }}>
                                                        <Delete />
                                                    </IconButton>
                                                </Stack>
                                            );
                                        })
                                    }
                                </Stack>



                                {
                                    generatingCodeState === 'generating' && (
                                        <Stack>
                                            <Typography variant="caption">
                                                Generating...
                                            </Typography>
                                            <LinearProgress />
                                        </Stack>
                                    )
                                }

                                <div>
                                    <CytoscapeGraph elements={cytoscapeElements} nodeClickCallback={(id: string) => {
                                        //@ts-ignore
                                        // deleteNode(id);

                                        const newDiveStack = [...diveStack, id];

                                        setDiveStack((stack) => {
                                            return newDiveStack;
                                        });

                                        setTimeout(() => {
                                            generateCode(newDiveStack);
                                        }, 500);
                                    }} />

                                    {/* {JSON.stringify(cytoscapeElements)} */}
                                    {/* <MermaidReact chart={mermaidFile} />
                                <MermaidToCytoscape chart={mermaidFile} onNodeClick={(node: any) => console.log(node)} /> */}
                                </div>
                            </div>
                        )
                }


            </Stack>
        </Paper>
    );
};
