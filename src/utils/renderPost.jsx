import React from "react";

export function renderPost(content) {
  if (!content) return null;

  const escapeHTML = (str) =>
    str.replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const codeRegex = /\[code\]([\s\S]*?)\[\/code\]/g;
  let parts = [];
  let lastIndex = 0;
  let match;

  while ((match = codeRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: "text", text: content.slice(lastIndex, match.index) });
    }
    parts.push({ type: "code", text: match[1] });
    lastIndex = codeRegex.lastIndex;
  }
  if (lastIndex < content.length) {
    parts.push({ type: "text", text: content.slice(lastIndex) });
  }

  return parts.map((part, i) => {
    if (part.type === "code") {
      return (
        <pre
          key={i}
          className="whitespace-pre overflow-x-auto bg-neutral-900 text-green-300 p-3 rounded my-3 text-sm"
        >
          {part.text}
        </pre>
      );
    }

    let text = escapeHTML(part.text);

    text = text
      .replace(/\[b\](.*?)\[\/b\]/gi, "<strong>$1</strong>")
      .replace(/\[i\](.*?)\[\/i\]/gi, "<em>$1</em>")
      .replace(/\[u\](.*?)\[\/u\]/gi, "<u>$1</u>")
      .replace(/\[center\]([\s\S]*?)\[\/center\]/gi, '<div class="text-center">$1</div>')
      .replace(/\[quote\](.*?)\[\/quote\]/gi, '<blockquote class="border-l-4 border-neutral-600 pl-3 italic text-neutral-400 my-2">$1</blockquote>')
      .replace(/\[size=(\d+)\](.*?)\[\/size\]/gi, (_, size, content) => {
        const sizes = {
          1: "text-xs",
          2: "text-sm",
          3: "text-base",
          4: "text-lg",
          5: "text-xl",
          6: "text-2xl",
          7: "text-3xl",
        };
        return `<span class="${sizes[size] || "text-base"}">${content}</span>`;
      })
      .replace(/\[hr\]/gi, '<hr class="border-neutral-700 my-2" />');

    text = text.replace(
      /\[list\]([\s\S]*?)\[\/list\]/gi,
      (match, items) => {
        const li = items
          .split("[*]")
          .filter((x) => x.trim() !== "")
          .map((x) => `<li class="list-disc ml-6">${x.trim()}</li>`)
          .join("");
        return `<ul class="my-2">${li}</ul>`;
      }
    );

    return (
      <div
        key={i}
        className="whitespace-pre-wrap break-words"
        dangerouslySetInnerHTML={{ __html: text }}
      />
    );
  });
}
