import React, { FC, useEffect, useRef } from 'react';
import { Crepe } from '@milkdown/crepe';
import { listenerCtx } from '@milkdown/plugin-listener';

// Import Crepe styles
import "@milkdown/crepe/theme/common/style.css";
// Import a specific theme (frame is recommended for a clean Editor look)
import "@milkdown/crepe/theme/frame.css";

interface MilkdownEditorProps {
    value: string;
    onChange: (markdown: string) => void;
}

const MilkdownEditorContent: FC<MilkdownEditorProps> = ({ value, onChange }) => {
    const rootRef = useRef<HTMLDivElement>(null);
    const crepeRef = useRef<Crepe | null>(null);

    useEffect(() => {
        if (!rootRef.current) return;

        const crepe = new Crepe({
            root: rootRef.current,
            defaultValue: value,
        });

        // Configure the listener to send updates to Notes.tsx
        crepe.editor.config((ctx) => {
            ctx.get(listenerCtx).markdownUpdated((_, markdown) => {
                onChange(markdown);
            });
        });

        // Build the editor
        crepe.create();
        crepeRef.current = crepe;

        return () => {
            crepe.destroy();
        };
        // Intentionally only run once on mount
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Sync external file changes into the editor
    useEffect(() => {
        if (!crepeRef.current) return;
        
        // This prevents the editor from resetting its cursor when typing
        crepeRef.current.editor.action((ctx) => {
            // Getting the markdown string inside milkdown context
            return ""; 
        });
        
        // Actually, Crepe exposes 'setMarkdown' directly in some versions, but not others.
        // We use @milkdown/utils replaceAll to safely swap the document.
        if (value && value !== "" && rootRef.current?.innerText.trim() === "") {
             import('@milkdown/utils').then(({ replaceAll }) => {
                 crepeRef.current?.editor.action(replaceAll(value));
             }).catch(console.error);
        }
    }, [value]);

    return (
        <div className="milkdown-container h-full w-full overflow-y-auto bg-transparent prose dark:prose-invert max-w-none">
            <div className="max-w-[800px] mx-auto px-8 py-16 pb-32">
                <div ref={rootRef} className="crepe-root h-full w-full" />
            </div>
        </div>
    );
};

export default function MdEditorWrapper(props: MilkdownEditorProps) {
    return <MilkdownEditorContent {...props} />;
}
