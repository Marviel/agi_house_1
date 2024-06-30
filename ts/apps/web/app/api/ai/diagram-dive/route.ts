import { generateObject } from 'ai';
import {
    NextRequest,
    NextResponse,
} from 'next/server';
import { z } from 'zod';

import { createAnthropic } from '@ai-sdk/anthropic';
import { notEmpty } from '@lukebechtel/lab-ts-utils';

export const POST = async (req: NextRequest, res: NextResponse) => {

    const body = await req.json();

    const {
        subject,
        existing
    } = body;

    if (!subject) {
        throw new Error('Content is required');
    }

    const anthropic = createAnthropic({});
    const model = anthropic('claude-3-5-sonnet-20240620')

    const { object } = await generateObject({
        maxTokens: 3000,
        model: model,
        schema: z.object({
            elements: z.array(z.any()).describe('The elements of the cytoscape graph.'),
        }),
        //@ts-ignore
        messages: [
            {
                role: 'system',
                content: `
                    The user will provide you with a subject they want to learn about.

                    This will be in the form "Subject > Sub-Subject > Sub-Sub-Subject" etc.
                    
                    Your task is to generate a friendly, vibrant cytoscape diagram that explains the subject in a way that is easy to understand.

                    ${existing && existing.trim().length > 0 ? 'The user has provided an existing diagram that you can use as a starting point. You should ONLY add nodes on this diagram!' : ''}

                    <OUTPUT_NOTES>
                        - Make the nodes nicely styled.
                        - Make the nodes nicely colored!
                        - Respect the existing diagram, only enhancing it.
                        - Use friendly emojis to make it look better
                        - Use full text labels, don't abbreviate unless the abbreviation is well known.
                    </OUTPUT_NOTES>
                    
                `
            },
            {
                role: 'user',
                content: `Subject: "${subject}"`
            },
            (existing && existing.trim().length > 0 ? {
                role: 'user',
                content: `Existing:
                \`\`\`json
                ${existing}
                \`\`\``
            } : null)
        ].filter(notEmpty)
    });

    try {
        // const response = await model.invoke([message]);
        // return NextResponse.json({ response: response.content });
        return NextResponse.json({ response: object });
    } catch (error) {
        return NextResponse.json({ error: 'Error generating diagram' }, { status: 500 });
    }
};