import React, { useCallback } from 'react';
import MonacoEditor from '@monaco-editor/react';

export interface MdEditorProps {
    value: string;
    onChange: (value: string) => void;
    height?: string | number;
    theme?: string;
    language?: string;
    readOnly?: boolean;
}

export default function MdEditor({
    value,
    onChange,
    height = '90vh',
    theme = 'vs-dark',
    language = 'markdown',
    readOnly = false,
}: MdEditorProps) {
    const handleChange = useCallback(
        (nextValue?: string) => {
            onChange(nextValue ?? '');
        },
        [onChange],
    );

    return (
        <MonacoEditor
            height={height}
            width="100%"
            language={language}
            value={value}
            theme={theme}
            readOnly={readOnly}
            onChange={handleChange}
            options={{
                minimap: { enabled: false },
                wordWrap: 'on',
                scrollBeyondLastLine: false,
            }}
        />
    );
}