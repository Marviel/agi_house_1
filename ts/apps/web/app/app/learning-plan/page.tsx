'use client'
import React, {
    useCallback,
    useRef,
    useState,
} from 'react';

import axios from 'axios';

// import { oneShotAIClient } from '@/clientOnly/ai/oneShotAIClient';
// import FullCenter from '@/components/positioning/FullCenter';
import {
    SandpackCodeEditor,
    SandpackLayout,
    SandpackPreview,
    SandpackProvider,
} from '@codesandbox/sandpack-react';
import { trimLines } from '@lukebechtel/lab-ts-utils';
import {
    Button,
    LinearProgress,
    Paper,
    Stack,
    TextField,
    Typography,
} from '@mui/material';

export default function AICodeSandboxPage() {
    const [subject, setSubject] = useState('');
    const [showEditor, setShowEditor] = useState(false);

    // TODO: store past iterations
    // const [iterations, setIterations] = useState([{
    //     subject: null,
    //     fullFileContents: trimLines(`
    //     // TODO
    //     export default function App() {
    //         return (
    //             // Always a full 100% width and height div
    //             <div style={{width: '100%', height: '100%'}}>
    //                 // TODO
    //             </div>
    //         );
    //     }
    //     `)
    // }]);

    const [fullFileContents, setFullFileContents] = useState(trimLines(`
    // TODO
    export default function App() {
        return (
            // Always a full 100% width and height div
            <div style={{width: '100%', height: '100%'}}>
                // TODO
            </div>
        );
    }
    `));
    const [generatingCodeState, setGeneratingCodeState] = useState<'waiting' | 'generating' | 'generated'>('waiting');
    const sandpackRef = useRef<any>(null);

    const generateCode = useCallback(async () => {
        if (generatingCodeState === 'generating') {
            return;
        }

        setGeneratingCodeState('generating');

        try {
            const result = await axios.post('/api/ai/chat', { subject: subject, existingProgram: fullFileContents });
            setFullFileContents(result.data.response.reactFile);
        } catch (error) {
            console.error('Error generating diagram:', error);

        }
        finally {
            setGeneratingCodeState('waiting');
        }
    }, [subject, generatingCodeState, fullFileContents]);

    return (
        <Paper>
            <Stack padding={2} gap={1}>
                <Typography variant="h4" alignSelf={'center'}>
                    🍎 AI Learning Plan
                </Typography>
                <TextField
                    autoComplete="off"
                    aria-autocomplete="none"
                    label={'What Do You Want To Learn About?'}
                    fullWidth={true}
                    value={subject} onChange={(e) => {
                        setSubject(e.target.value);
                    }}
                />

                <Button
                    disabled={generatingCodeState === 'generating' || !subject || subject.trim().length < 2}
                    onClick={() => {
                        generateCode()
                    }}
                >
                    Generate Code!
                </Button>

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

                <div ref={sandpackRef} style={{ width: '800px', height: '77vh' }}>
                    {/* <Sandpack
                        template="react-ts"
                        files={{
                            '/App.tsx': {
                                code: fullFileContents,
                            },
                        }}
                        options={{
                            readOnly: true,
                            showReadOnly: false,
                        }}
                    /> */}
                    <SandpackProvider
                        template="react-ts"
                        files={{
                            '/App.tsx': {
                                code: fullFileContents,
                            },
                        }}
                        options={{

                        }}
                    >
                        <SandpackLayout style={{ height: '77vh', width: '97vw' }}>
                            <SandpackPreview style={{ height: '100%', width: '100%' }} />
                        </SandpackLayout>
                        {
                            showEditor ? (<div>
                                <SandpackCodeEditor />
                                <Button onClick={() => setShowEditor(false)}>Hide Editor</Button>
                            </div>
                            ) :
                                <Button onClick={() => setShowEditor(true)} size='small'>Show Editor</Button>
                        }
                    </SandpackProvider>
                </div>
            </Stack>
        </Paper>
    );
};
