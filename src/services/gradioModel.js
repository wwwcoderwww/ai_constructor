import { Client } from "@gradio/client";
import config from '@/config/config';

const modelConfig = config.models.find(m => m.type === 'gradio');

export async function generateCode(prompt) {
    const client = await Client.connect(modelConfig.gradioSpace);
    const result = await client.predict("/generate_code", {
        input_value: prompt,
        system_prompt_input_value: "null",
    });

    let code = result.data[0].value;
    code = code.slice(7);
    code = code.slice(0, -3);
    return code;
}
