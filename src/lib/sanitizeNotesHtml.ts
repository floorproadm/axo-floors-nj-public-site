const ALLOWED_NOTE_TAGS = new Set([
  'A', 'B', 'BR', 'DIV', 'EM', 'H3', 'H4', 'I', 'LI', 'OL', 'P', 'SPAN', 'STRONG', 'U', 'UL',
]);

const ESCAPED_ALLOWED_TAG_RE = /&lt;\/?(?:a|b|br|div|em|h3|h4|i|li|ol|p|span|strong|u|ul)(?:\s|&gt;|>)/i;
const URL_RE = /(?:https?:\/\/|www\.)[^\s<]+/gi;

function decodeEscapedNotesHtml(html: string): string {
  if (!ESCAPED_ALLOWED_TAG_RE.test(html)) return html;
  if (typeof document === 'undefined') {
    return html
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&');
  }
  const textarea = document.createElement('textarea');
  textarea.innerHTML = html;
  return textarea.value;
}

function normalizeHref(rawHref: string | null): string | null {
  const href = (rawHref || '').trim();
  if (!href) return null;
  const normalized = href.startsWith('www.') ? `https://${href}` : href;
  try {
    const url = new URL(normalized, typeof window !== 'undefined' ? window.location.origin : 'https://example.com');
    if (['http:', 'https:', 'mailto:', 'tel:'].includes(url.protocol)) return normalized;
  } catch {
    return null;
  }
  return null;
}

function linkifyTextNodes(root: HTMLElement, doc: Document) {
  const walker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent || parent.closest('a')) return NodeFilter.FILTER_REJECT;
      URL_RE.lastIndex = 0;
      return URL_RE.test(node.textContent || '') ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    },
  });
  const nodes: Text[] = [];
  while (walker.nextNode()) nodes.push(walker.currentNode as Text);
  nodes.forEach((textNode) => {
    const text = textNode.textContent || '';
    URL_RE.lastIndex = 0;
    const fragment = doc.createDocumentFragment();
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = URL_RE.exec(text))) {
      const start = match.index;
      let label = match[0];
      const trailing = label.match(/[),.!?;:]+$/)?.[0] || '';
      if (trailing) label = label.slice(0, -trailing.length);
      if (start > lastIndex) fragment.appendChild(doc.createTextNode(text.slice(lastIndex, start)));
      const safeHref = normalizeHref(label);
      if (safeHref) {
        const anchor = doc.createElement('a');
        anchor.href = safeHref;
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer nofollow';
        anchor.textContent = label;
        fragment.appendChild(anchor);
      } else {
        fragment.appendChild(doc.createTextNode(label));
      }
      if (trailing) fragment.appendChild(doc.createTextNode(trailing));
      lastIndex = start + match[0].length;
    }
    if (lastIndex < text.length) fragment.appendChild(doc.createTextNode(text.slice(lastIndex)));
    textNode.replaceWith(fragment);
  });
}

export function sanitizeNotesHtml(html: string): string {
  if (!html) return '';
  const decodedHtml = decodeEscapedNotesHtml(html);

  if (typeof DOMParser === 'undefined' || typeof document === 'undefined') {
    return decodedHtml
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/ on[a-z]+="[^"]*"/gi, '')
      .replace(/ on[a-z]+='[^']*'/gi, '')
      .replace(/javascript:/gi, '');
  }

  const parser = new DOMParser();
  const parsed = parser.parseFromString(`<div>${decodedHtml}</div>`, 'text/html');
  const output = document.createElement('div');

  const cleanNode = (node: Node): Node | DocumentFragment | null => {
    if (node.nodeType === Node.TEXT_NODE) return document.createTextNode(node.textContent || '');
    if (node.nodeType !== Node.ELEMENT_NODE) return null;
    const element = node as HTMLElement;
    if (element.tagName === 'SCRIPT' || element.tagName === 'STYLE') return null;

    if (!ALLOWED_NOTE_TAGS.has(element.tagName)) {
      const fragment = document.createDocumentFragment();
      element.childNodes.forEach((child) => {
        const cleaned = cleanNode(child);
        if (cleaned) fragment.appendChild(cleaned);
      });
      return fragment;
    }

    if (element.tagName === 'A') {
      const safeHref = normalizeHref(element.getAttribute('href'));
      if (!safeHref) {
        const fragment = document.createDocumentFragment();
        element.childNodes.forEach((child) => {
          const cleaned = cleanNode(child);
          if (cleaned) fragment.appendChild(cleaned);
        });
        return fragment;
      }
      const anchor = document.createElement('a');
      anchor.href = safeHref;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer nofollow';
      element.childNodes.forEach((child) => {
        const cleaned = cleanNode(child);
        if (cleaned) anchor.appendChild(cleaned);
      });
      return anchor;
    }

    const cleanElement = document.createElement(element.tagName.toLowerCase());
    element.childNodes.forEach((child) => {
      const cleaned = cleanNode(child);
      if (cleaned) cleanElement.appendChild(cleaned);
    });
    return cleanElement;
  };

  parsed.body.firstElementChild?.childNodes.forEach((node) => {
    const cleaned = cleanNode(node);
    if (cleaned) output.appendChild(cleaned);
  });

  linkifyTextNodes(output, document);
  return output.innerHTML;
}

export function notesHasHtml(v?: string | null): boolean {
  return !!v && /<[a-z][\s\S]*>/i.test(v);
}
