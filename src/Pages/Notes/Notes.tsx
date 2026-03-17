import React, { useState } from 'react'
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
    const [activeFile, setActiveFile] = useState<string | null>(null);

    return (
        <div className="flex h-screen overflow-hidden">
            <Navbar />

            {/* File explorer sidebar */}
            <div className="hidden md:block ml-14 w-60 h-screen shrink-0 border-r border-white/10">
                <FileExplorer onFileSelect={setActiveFile} />
            </div>
            <div className="flex-1 overflow-y-auto bg-white p-8">
                {activeFile ? (
                    <div className="max-w-3xl mx-auto prose prose-sm relative">
                        <div className="absolute top-0 right-0 text-xs text-gray-400 font-mono">
                            {activeFile}
                        </div>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        Select a file to view its content.
                    </div>
                )}
            </div>
        </div>
    )
}

export default Notes;