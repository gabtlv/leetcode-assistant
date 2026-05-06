import { NextRequest, NextResponse } from "next/server"
import OpenAI from "openai"

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(req: NextRequest) {
    const { problem, prompt} = await req.json()

    const systemPrompt = `You are a LeetCode assistant that helps developers understand problems and develop problem-solving intuition.
    Your goal is to guide users without giving away the full solution.
    - For "Explain this problem": break down what the problem is asking in plain English and explain with analogies
    - For "Give me a hint": give a small nudge in the right direction, no code
    - For "Walk me through the approach": explain the step by step logic, no code
    - For "Show the pattern": identity the algorithm pattern (e.g. sliding window, dynamic programming) and list 2-3 similar problems
    Never write the full solution code unless explicitly asked.`

    const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { role: "system", content: systemPrompt},
            { role: "user", content: `${prompt}: ${problem}` }
        ],
    })

    const message = response.choices[0].message.content
    return NextResponse.json({ message })
}