import React from 'react'
import './Notes.css'
import remarkGfm from 'remark-gfm'
import ReactMarkdown from 'react-markdown'
import Navbar from '../../components/Navbar'
import FileExplorer from '../../components/Editor/FileExplorer'

const markdown = `A paragraph with *emphasis* and **strong importance**.

> A block quote with ~strikethrough~ and a URL: https://reactjs.org.

* Lists
* [ ] todo
* [x] done

A table:

| a | b |
| - | - |
`


function Notes() {
    return (
        <div className="flex h-screen overflow-hidden">
            <Navbar />

            {/* File explorer sidebar */}
            <div className="hidden md:block ml-14 w-60 h-screen shrink-0 border-r border-white/10">
                <FileExplorer />
            </div>

            {/* Main content area */}
            <div className="flex-1 overflow-y-auto bg-white p-8">
                <div className="max-w-3xl mx-auto prose prose-sm">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
                </div>
            </div>
        </div>
    )
}

export default Notes;