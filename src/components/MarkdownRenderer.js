import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MarkdownRenderer({ markdown }) {
    return (
        <ReactMarkdown
            children={markdown || ''}
            remarkPlugins={[remarkGfm]}
            components={{
                a: props => <a {...props} style={{ color: 'var(--accent)' }} />,
                code: props => <code {...props} style={{ background: '#232b3a', borderRadius: 4, padding: '0.1em 0.3em' }} />,
                pre: props => <pre {...props} style={{ background: '#232b3a', borderRadius: 6, padding: '0.5em 1em', overflowX: 'auto' }} />,
                blockquote: props => <blockquote {...props} style={{ borderLeft: '3px solid var(--accent)', margin: 0, paddingLeft: '1em', color: '#b3cfff', fontStyle: 'italic' }} />
            }}
        />
    );
}
