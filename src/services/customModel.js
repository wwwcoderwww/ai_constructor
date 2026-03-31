import config from '@/config/config';

const modelConfig = config.models.find(m => m.type === 'custom');

// Strips ```html...``` or ```...``` wrapper if present
function stripMarkdownFences(code) {
    const match = code.match(/^```[\w]*\n?([\s\S]*?)\n?```$/s);
    return match ? match[1] : code;
}

// Calls onChunk(currentContent) each time a new portion arrives.
// Returns the final accumulated content.
export async function generateCode(prompt, onChunk, ai_landing_id) {
    const response = await fetch(modelConfig.path, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, ai_landing_id }),
    });

    if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
    }

    // let code = respons.content;
    // return code 

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let lastContent = '';

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        console.log('buffer', buffer)
        const lines = buffer.split('\n');
        console.log('lines', lines)
        buffer = lines.pop(); // keep the last incomplete line in buffer
        console.log('buffer2', buffer)
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;
            console.log('buffer3', line)
            console.log('trimmed', trimmed)

            // Support both plain NDJSON and SSE (data: ...) format
            let jsonStr = trimmed;
            if (trimmed.startsWith('data: ')) {
                jsonStr = trimmed.slice(6);
                console.log('jsonStr', jsonStr)
                if (jsonStr === '[DONE]') continue;
            }

            try {
                const data = JSON.parse(jsonStr);
                if (data.done && data.full_content) {
                    lastContent = data.full_content;
                    onChunk(stripMarkdownFences(lastContent));
                } else if (data.delta) {
                    lastContent += data.delta;
                    onChunk(stripMarkdownFences(lastContent));
                }
            } catch (e) {
                // Skip unparseable lines
            }
        }
    }

    return stripMarkdownFences(lastContent);
}
