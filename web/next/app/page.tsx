"use client"

import { useState } from "react"

export default function SeedPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const handleSeed = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/seed", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({ error: "Failed to seed data" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Seed Database</h1>
      <button
        onClick={handleSeed}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {loading ? "Seeding..." : "Seed Users"}
      </button>

      {result && (
        <div className="mt-4 p-4 border rounded">
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
