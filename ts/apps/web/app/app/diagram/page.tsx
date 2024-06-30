'use client'
import React, {
  FormEvent,
  useState,
} from 'react';

import axios from 'axios';

const GenerateDiagram: React.FC = () => {
    const [content, setContent] = useState<string>('');
    const [response, setResponse] = useState<string>('');

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const result = await axios.post('/api/generate_diagram', { content });
            setResponse(result.data.response);
        } catch (error) {
            console.error('Error generating diagram:', error);
        }
    };

    return (
        <div>
            <h1>Generate Diagram</h1>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter content"
                    rows={10}
                    cols={50}
                ></textarea>
                <br />
                <button type="submit">Generate</button>
            </form>
            {response && (
                <div>
                    <h2>Response</h2>
                    <pre>{response}</pre>
                </div>
            )}
        </div>
    );
};

export default GenerateDiagram;