"use client"

import type * as React from "react"
import { useMemo, useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

function GripIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" {...props}>
      <circle cx="6" cy="5" r="1.2" />
      <circle cx="12" cy="5" r="1.2" />
      <circle cx="6" cy="10" r="1.2" />
      <circle cx="12" cy="10" r="1.2" />
      <circle cx="6" cy="15" r="1.2" />
      <circle cx="12" cy="15" r="1.2" />
    </svg>
  )
}

function PencilIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M4 20h4l10.5-10.5a2.121 2.121 0 0 0-3-3L5 17v3z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M13.5 6.5l3 3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}
function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function TrashIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path d="M4 7h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 7l1 12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-12" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

type Section = {
  id: string
  question: string
  answer: string
}

function SectionItem({
  section,
  onDelete,
  onUpdate,
}: {
  section: Section
  onDelete: () => void
  onUpdate: (q: string, a: string) => void
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [draftQ, setDraftQ] = useState(section.question)
  const [draftA, setDraftA] = useState(section.answer)

  const save = () => {
    const q = draftQ.trim()
    const a = draftA.trim()
    if (!q || !a) return
    onUpdate(q, a)
    setIsEditing(false)
  }
  const cancel = () => {
    setDraftQ(section.question)
    setDraftA(section.answer)
    setIsEditing(false)
  }

  return (
    <div className="space-y-3 bg-gray-100 p-3 rounded-lg">
      <div className="relative">
        <label htmlFor={`q-${section.id}`} className="sr-only">
          Question
        </label>

        {/* Left drag/grip icon */}
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
          <GripIcon className="h-4 w-4" />
        </span>

        {/* Question input: read-only when not editing */}
        <input
          id={`q-${section.id}`}
          type="text"
          readOnly={!isEditing}
          value={isEditing ? draftQ : section.question}
          onChange={(e) => isEditing && setDraftQ(e.target.value)}
          className="block w-full rounded-lg border border-input bg-background px-10 pr-24 py-3 text-sm text-foreground placeholder:text-muted-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />

        {/* Right action buttons */}
        <div className="absolute inset-y-0 right-2 my-auto flex items-center gap-1">
          {!isEditing ? (
            <>
              <button
                type="button"
                aria-label="Edit"
                onClick={() => setIsEditing(true)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Delete"
                onClick={onDelete}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                aria-label="Save"
                onClick={save}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <CheckIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Cancel"
                onClick={cancel}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <XIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Delete"
                onClick={onDelete}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Answer content area (Textarea when editing) */}
      {!isEditing ? (
        <section
          aria-label="Answer"
          className="rounded-lg border border-input bg-card p-4 text-sm leading-relaxed text-foreground"
        >
          <p className="text-pretty">{section.answer}</p>
        </section>
      ) : (
        <div className="space-y-2">
          <Label htmlFor={`a-${section.id}`} className="sr-only">
            Answer
          </Label>
          <textarea
            id={`a-${section.id}`}
            value={draftA}
            rows={2}
            onChange={(e: any) => setDraftA(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
          />
          <div className="flex items-center justify-end gap-2">
            <Button type="button" variant="default" onClick={save} className="px-4">
              Save
            </Button>
            <Button type="button" variant="ghost" onClick={cancel} className="px-4">
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export function PolicyQABlock({ faqData = [], onChanges }: { faqData?: any[]; onChanges: (data: any[]) => void }) {
  const [sections, setSections] = useState<any[]>([])
  const [q, setQ] = useState("")
  const [a, setA] = useState("")

  // Update sections when faqData changes
  useEffect(() => {
    const newSections = faqData.map((item, index) => ({
      id: `api-${index}`,
      question: item.question,
      answer: item.answer
    }))
    setSections(newSections)
  }, [faqData])

  const nextIndex = sections.length + 1

  function handleAdd() {
    const trimmedQ = q.trim()
    const trimmedA = a.trim()
    if (!trimmedQ || !trimmedA) return

    const newSection: Section = {
      id: `s-${Date.now()}`,
      question: trimmedQ,
      answer: trimmedA,
    }
    onChanges([...sections, newSection])
    setSections((prev) => [newSection, ...prev]) // prepend to top list

    setQ("")
    setA("")
  }

  function handleUpdate(id: string, question: string, answer: string) {
    const updatedSections = sections.map((s) => (s.id === id ? { ...s, question, answer } : s))
    console.log(updatedSections);

    setSections(updatedSections)
    onChanges(updatedSections)
  }

  function handleDelete(id: string) {
    const updatedSections = sections.filter((s) => s.id !== id)
    setSections(updatedSections)
    onChanges(updatedSections)
  }

  return (
    <div className="w-full space-y-6">
      {/* Top list area showing all FAQ entries */}
      <div className="space-y-3">
        {sections.map((s) => (
          <SectionItem
            key={s.id}
            section={s}
            onDelete={() => handleDelete(s.id)}
            onUpdate={(newQ, newA) => handleUpdate(s.id, newQ, newA)}
          />
        ))}
      </div>

      {/* Add new FAQ item */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleAdd()
        }}
        className="space-y-4"
        aria-label="Add new FAQ"
      >
        <div className="space-y-2">
          <Label htmlFor="new-question">{`Question ${nextIndex}`}</Label>
          <Input
            id="new-question"
            placeholder={`Question ${nextIndex}`}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="rounded-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="new-answer">{`Ans ${nextIndex}`}</Label>
          <textarea
            id="new-answer"
            placeholder={`Ans ${nextIndex}`}
            value={a}
            rows={6}
            onChange={(e: any) => setA(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" className="px-8 uppercase">
            ADD
          </Button>
        </div>
      </form>
    </div>
  )
}

export default PolicyQABlock
