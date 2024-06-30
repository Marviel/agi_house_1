import {
  NextRequest,
  NextResponse,
} from 'next/server';

import { ChatAnthropic } from '@langchain/anthropic';
import { HumanMessage } from '@langchain/core/messages';

export const POST = async (req: NextRequest, res: NextResponse) => {

    const body = await req.json();

    const { content } = body;

    if (!content) {
        throw new Error('Content is required');
    }

    console.log('process.env.ANTHROPIC_API_KEY:', process.env.ANTHROPIC_API_KEY)

    const model = new ChatAnthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
        model: 'claude-3-opus-20240229',
        temperature: 0,
    });

    console.log('content:', content)

    try {
        const message = new HumanMessage({ content });
        const response = await model.invoke([message]);
        return NextResponse.json({ response: response.content });
    } catch (error) {
        return NextResponse.json({ error: 'Error generating diagram' }, { status: 500 });
    }
};