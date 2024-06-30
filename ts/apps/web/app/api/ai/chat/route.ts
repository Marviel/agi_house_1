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
        existingProgram
    } = body;

    if (!subject) {
        throw new Error('Content is required');
    }

    const anthropic = createAnthropic();
    const model = anthropic('claude-3-5-sonnet-20240620')

    const { object } = await generateObject({
        model: model,
        schema: z.object({
            reactFile: z.string().describe('The full contents of the react .tsx file.'),
        }),
        //@ts-ignore
        messages: [
            {
                role: 'system',
                content: `
                    The user will provide you with a subject they want to learn about.
                    Your task is to generate a diagram using a React component that explains the subject in a way that is easy to understand.

                    ${existingProgram && existingProgram.trim().length > 0 ? 'The user has provided an existing program that you can use as a starting point. You should improve on this program.' : ''}
                `
            },
            {
                role: 'user',
                content: `Subject: "${subject}"`
            },
            (existingProgram && existingProgram.trim().length > 0 ? {
                role: 'user',
                content: `Existing Program:
                \`\`\`ts
                ${existingProgram}
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