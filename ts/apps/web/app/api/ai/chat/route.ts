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
        existingProgram,
        notes
    } = body;

    if (!subject) {
        throw new Error('Content is required');
    }

    const anthropic = createAnthropic();
    const model = anthropic('claude-3-5-sonnet-20240620')

    const { object } = await generateObject({
        model: model,
        schema: z.object({
            _chainOfThought: z.string().describe('Think through the problem and write down your thoughts as separate entries before writing the code.'),
            reactFile: z.string().describe('The full contents of the react .tsx file.'),
        }),
        //@ts-ignore
        messages: [
            {
                role: 'system',
                content: `
                    <TASK_OVERVIEW>
                    The user will provide you with a subject they want to learn about.

                    Your task is to generate an interactive diagram using a React component that explains the subject in a way that is easy to understand.

                    Your output must be in a SINGLE FILE that can be run in a CodeSandbox.

                    ${existingProgram && existingProgram.trim().length > 0 ? 'The user has provided an existing program that you can use as a starting point. You should improve on this program.' : ''}

                    ${notes && notes.trim().length > 0 ? 'The user has provided additional notes that you should consider when generating the diagram.' : ''}
                    </TASK_OVERVIEW>


                    <AVAILABLE_PACKAGES>
                        - @mui/material
                        - @mui/icons-material
                        - @emotion/react
                        - @emotion/styled
                        - three
                    </AVAILABLE_PACKAGES>

                    <FINAL_NOTES>
                        - Make the UI interactive.
                        - Make the UI user-friendly, and visually appealing.
                        - Your output must be a SINGLE FILE that can be run in a CodeSandbox.
                    </FINAL_NOTES>
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
            } : null),
            (notes && notes.trim().length > 0 ? {
                role: 'user',
                content: `Additional Notes:
                \`\`\`ts
                ${notes}
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