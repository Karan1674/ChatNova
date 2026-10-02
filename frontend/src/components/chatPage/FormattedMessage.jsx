import React, { useState } from 'react';
import { Copy, Check, Code2 } from 'lucide-react';

function CodeBlock({ language, code, onCopyToast }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    if (onCopyToast) onCopyToast();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-container">
      <div className="code-header">
        <div className="code-lang">
          <Code2 size={13} />
          <span>{language || 'code'}</span>
        </div>
        <button 
          className="code-copy-btn" 
          onClick={handleCopy}
          title="Copy code"
        >
          {copied ? (
            <>
              <Check size={13} style={{ color: 'var(--accent-emerald, #10B981)' }} />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy size={13} />
              <span>Copy code</span>
            </>
          )}
        </button>
      </div>
      <pre className="code-pre">
        <code>{code}</code>
      </pre>
    </div>
  );
}

// Parses inline markdown tokens: bold, italic, inline code, and links
function renderInlineText(text) {
  if (!text) return null;

  // Regex to match: **bold**, `code`, *italic*, [label](url)
  const tokenRegex = /(\*\*.*?\*\*|`[^`\n]+?`|\*[^*\n]+?\*|\[.*?\]\(https?:\/\/[^\s)]+\))/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, index) => {
    if (!part) return null;

    // Bold: **text**
    if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }

    // Inline code: `text`
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return <code key={index} className="inline-code">{part.slice(1, -1)}</code>;
    }

    // Italic: *text*
    if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
      return <em key={index}>{part.slice(1, -1)}</em>;
    }

    // Link: [text](url)
    const linkMatch = part.match(/^\[(.*?)\]\((https?:\/\/[^\s)]+)\)$/);
    if (linkMatch) {
      return (
        <a 
          key={index} 
          href={linkMatch[2]} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="msg-link"
        >
          {linkMatch[1]}
        </a>
      );
    }

    return part;
  });
}

// Parses and formats markdown sections (headers, lists, blockquotes, paragraphs, code blocks)
export default function FormattedMessage({ text, onCopyToast }) {
  if (!text) return null;

  // Split content by triple-backtick code blocks
  const codeBlockRegex = /```([a-zA-Z0-9_\-+]*)\n?([\s\S]*?)```/g;
  const elements = [];
  let lastIndex = 0;
  let match;

  const processTextBlock = (blockText, blockKeyPrefix) => {
    if (!blockText.trim()) return [];

    const lines = blockText.split('\n');
    const nodes = [];
    let currentList = null; // { type: 'ul' | 'ol', items: [] }
    let currentParagraph = [];

    const flushParagraph = (pKey) => {
      if (currentParagraph.length > 0) {
        const joined = currentParagraph.join(' ');
        if (joined.trim()) {
          nodes.push(
            <p key={`${blockKeyPrefix}-p-${pKey}`} className="msg-paragraph">
              {renderInlineText(joined)}
            </p>
          );
        }
        currentParagraph = [];
      }
    };

    const flushList = (lKey) => {
      if (currentList) {
        const ListTag = currentList.type === 'ol' ? 'ol' : 'ul';
        const listClass = currentList.type === 'ol' ? 'msg-list msg-ol' : 'msg-list msg-ul';
        nodes.push(
          <ListTag key={`${blockKeyPrefix}-list-${lKey}`} className={listClass}>
            {currentList.items.map((item, iIdx) => (
              <li key={`${blockKeyPrefix}-li-${lKey}-${iIdx}`}>{renderInlineText(item)}</li>
            ))}
          </ListTag>
        );
        currentList = null;
      }
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmed = line.trim();

      if (!trimmed) {
        flushParagraph(i);
        flushList(i);
        continue;
      }

      // Horizontal Rule
      if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
        flushParagraph(i);
        flushList(i);
        nodes.push(<hr key={`${blockKeyPrefix}-hr-${i}`} className="msg-hr" />);
        continue;
      }

      // Headings
      const h1Match = line.match(/^#\s+(.+)$/);
      const h2Match = line.match(/^##\s+(.+)$/);
      const h3Match = line.match(/^###\s+(.+)$/);

      if (h1Match || h2Match || h3Match) {
        flushParagraph(i);
        flushList(i);
        if (h1Match) {
          nodes.push(<h2 key={`${blockKeyPrefix}-h1-${i}`} className="msg-heading h2">{renderInlineText(h1Match[1])}</h2>);
        } else if (h2Match) {
          nodes.push(<h3 key={`${blockKeyPrefix}-h2-${i}`} className="msg-heading h3">{renderInlineText(h2Match[1])}</h3>);
        } else {
          nodes.push(<h4 key={`${blockKeyPrefix}-h3-${i}`} className="msg-heading h4">{renderInlineText(h3Match[1])}</h4>);
        }
        continue;
      }

      // Blockquotes
      const quoteMatch = line.match(/^>\s?(.*)$/);
      if (quoteMatch) {
        flushParagraph(i);
        flushList(i);
        nodes.push(
          <blockquote key={`${blockKeyPrefix}-quote-${i}`} className="msg-blockquote">
            {renderInlineText(quoteMatch[1])}
          </blockquote>
        );
        continue;
      }

      // Unordered list item
      const ulMatch = line.match(/^[-*+]\s+(.+)$/);
      if (ulMatch) {
        flushParagraph(i);
        if (!currentList || currentList.type !== 'ul') {
          flushList(i);
          currentList = { type: 'ul', items: [] };
        }
        currentList.items.push(ulMatch[1]);
        continue;
      }

      // Ordered list item
      const olMatch = line.match(/^(\d+)\.\s+(.+)$/);
      if (olMatch) {
        flushParagraph(i);
        if (!currentList || currentList.type !== 'ol') {
          flushList(i);
          currentList = { type: 'ol', items: [] };
        }
        currentList.items.push(olMatch[2]);
        continue;
      }

      // Regular line inside paragraph
      flushList(i);
      currentParagraph.push(line);
    }

    flushParagraph('end');
    flushList('end');

    return nodes;
  };

  while ((match = codeBlockRegex.exec(text)) !== null) {
    const textBefore = text.slice(lastIndex, match.index);
    if (textBefore) {
      elements.push(...processTextBlock(textBefore, `tb-${lastIndex}`));
    }

    const language = (match[1] || '').trim();
    const code = match[2].replace(/\n$/, ''); // Remove trailing newline
    elements.push(
      <CodeBlock 
        key={`code-${match.index}`} 
        language={language} 
        code={code} 
        onCopyToast={onCopyToast} 
      />
    );

    lastIndex = match.index + match[0].length;
  }

  const remainingText = text.slice(lastIndex);
  if (remainingText) {
    elements.push(...processTextBlock(remainingText, `tb-${lastIndex}`));
  }

  return <div className="msg-formatted-body">{elements}</div>;
}
