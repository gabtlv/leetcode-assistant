"use client"

import { useState, useRef, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import { ArrowUp } from "lucide-react"
import { Analytics } from "@vercel/analytics/next"


interface Message {
  role: "user" | "assistant"
  content: string
}

const chips = ["Explain this problem", "Give me a hint", "Walk me through the approach", "Show the pattern"]

export default function Home() {
  const [problem, setProblem] = useState("")
  const [customMessage, setCustomMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hey! I'm your LeetCode Assistant. Enter a problem name or link below and pick what you need help with." }
  ])
  const [loading, setLoading] = useState(false)
  const [problemSet, setProblemSet] = useState(false)

  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  const sendMessage = async (prompt: string) => {
    if (!problem.trim()) return

    const userMessage: Message = { role: "user", content: `${prompt}: ${problem}` }
    setMessages((prev) => [...prev, userMessage])
    setLoading(true)

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ problem, prompt }),
    })

    const data = await response.json()
    const assistantMessage: Message = { role: "assistant", content: data.message }
    setMessages((prev) => [...prev, assistantMessage])
    setLoading(false)
  }

  const handleProblemSubmit = () => {
    if (!customMessage.trim()) return

    let problemName = customMessage
    try {
      const url = new URL(customMessage)
      const parts = url.pathname.split("/").filter(Boolean)
      const problemSlug = parts[parts.indexOf("problems") + 1]
      if (problemSlug) {
        problemName = problemSlug.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase())
      }
    } catch {
      
    }

    setProblem(problemName)
    setProblemSet(true)
    setMessages((prev) => [
      ...prev,
      { role: "user", content: customMessage},
    ])
    setCustomMessage("")
    setLoading(true)

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Got it! Working on ${problemName}! What do you need help with? Use the buttons or ask me anything.` }
      ])
      setLoading(false)
    }, 800)
  }

  const sendCustomMessage = async () => {
    if (!customMessage.trim()) return

    const userMessage: Message = { role: "user", content: customMessage }
    setMessages((prev) => [...prev, userMessage])
    setCustomMessage("")
    setLoading(true)

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ problem, prompt: customMessage }),
    })

    const data = await response.json()
    const assistantMessage: Message = { role: "assistant", content: data.message }
    setMessages((prev) => [...prev, assistantMessage])
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4">
      <div className="w-full max-w-2xl h-[90vh] flex flex-col bg-[#111] border border-[#222] rounded-2xl overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#222] flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-sm">🧠</div>
          <div>
            <p className="text-white text-m font-semibold">LeetCode Assistant</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              <div className="w-7 h-7 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-xs flex-shrink-0">
                {msg.role === "user" ? "👤" : "🧠"}
              </div>
              <div className={`text-sm rounded-2xl px-4 py-3 max-w-[80%] leading-relaxed ${
                msg.role === "user"
                  ? "bg-white text-black rounded-tr-sm"
                  : "bg-[#1a1a1a] text-neutral-200 rounded-tl-sm"
              }`}>
                {msg.role === "assistant" ? (
                  <ReactMarkdown>
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-[#1a1a1a] border border-[#333] flex items-center justify-center text-xs flex-shrink-0">🧠</div>
              <div className="bg-[#1a1a1a] rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce [animation-delay:0ms]" />
                <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce [animation-delay:150ms]" />
                <div className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Chips */}
        {problemSet && (
          <div className="px-6 py-3 flex flex-wrap gap-2 border-none">
            {chips.map((chip) => (
              <button
                key={chip}
                onClick={() => sendMessage(chip)}
                className="bg-[#1a1a1a] border border-[#2a2a2a] text-neutral-300 text-xs px-4 py-2 rounded-full hover:bg-white hover:text-black hover:border-white transition-all duration-200 cursor-pointer"
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "white"
                  e.currentTarget.style.color = "black"
                  e.currentTarget.style.borderColor = "white"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#1a1a1a"
                  e.currentTarget.style.color = ""
                  e.currentTarget.style.borderColor = "#2a2a2a"
                }}              
              >
                {chip}
              </button>
            ))}
          </div>
        )}
        {/* Input */}
        <div className="px-6 py-4 border-t border-[#222] flex gap-3 items-center">
          <input
            className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-neutral-200 placeholder:text-neutral-600 focus:outline-none focus:border-[#444]"
            placeholder={problemSet ? "Send a message" : "Send a Leetcode problem or a link!"}
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                problemSet ? sendCustomMessage() : handleProblemSubmit()
              }
            }}
          />
        <button
          onClick={() => problemSet ? sendCustomMessage() : handleProblemSubmit()}
          className="bg-white text-black text-sm font-medium px-4 py-3 rounded-xl cursor-pointer transition-opacity hover:opacity-80"
        >
          <ArrowUp size={16} />
        </button>
        </div>

      </div>
    </main>
  )
}