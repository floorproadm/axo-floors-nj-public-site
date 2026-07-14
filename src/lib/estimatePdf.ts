import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const LETTER_RATIO = 11 / 8.5;

export function computePageBreaks(element: HTMLElement, pageCssHeight: number): number[] {
  const elRect = element.getBoundingClientRect();
  const toRect = (n: HTMLElement) => {
    const r = n.getBoundingClientRect();
    return { top: r.top - elRect.top, bottom: r.bottom - elRect.top };
  };

  const topLevelSections = Array.from(element.querySelectorAll<HTMLElement>('[data-pdf-section]'))
    .filter((section) => {
      const parentSection = section.parentElement?.closest('[data-pdf-section]');
      return !parentSection || parentSection === element;
    })
    .map(toRect)
    .sort((a, b) => a.top - b.top);

  const totalHeight = element.getBoundingClientRect().height;
  const safety = 4;

  if (topLevelSections.length) {
    const breaks: number[] = [0];
    let pageY = 0;
    let previousBottom = 0;

    for (const section of topLevelSections) {
      const sectionHeight = section.bottom - section.top;
      const gap = Math.max(0, section.top - previousBottom);
      const wouldEndAt = pageY + gap + sectionHeight;

      if (
        pageY > safety &&
        sectionHeight <= pageCssHeight - safety &&
        wouldEndAt > pageCssHeight - safety
      ) {
        breaks.push(section.top);
        pageY = sectionHeight;
      } else {
        pageY = wouldEndAt;
      }

      previousBottom = section.bottom;
    }

    breaks.push(totalHeight);
    return breaks;
  }

  const groupedRows = new Set<HTMLElement>();
  element.querySelectorAll<HTMLElement>('[data-pdf-group] [data-pdf-row]').forEach((row) => {
    groupedRows.add(row);
  });
  const rows = Array.from(element.querySelectorAll<HTMLElement>('[data-pdf-row]'))
    .filter((row) => !groupedRows.has(row))
    .map(toRect)
    .sort((a, b) => a.top - b.top);
  const groups = Array.from(element.querySelectorAll<HTMLElement>('[data-pdf-group]'))
    .map(toRect)
    .sort((a, b) => a.top - b.top);
  const sections = Array.from(element.querySelectorAll<HTMLElement>('[data-pdf-section]'))
    .map(toRect)
    .sort((a, b) => a.top - b.top);

  const breaks: number[] = [0];
  let cursor = 0;

  while (cursor + pageCssHeight < totalHeight - safety) {
    const limit = cursor + pageCssHeight;

    let protectedBreak = -1;
    for (const section of sections) {
      if (section.top <= cursor + 20) continue;
      if (section.top >= limit) break;
      if (section.bottom > limit && section.bottom - section.top <= pageCssHeight - safety) {
        protectedBreak = section.top;
        break;
      }
    }

    let next: number;
    if (protectedBreak > cursor + 20) {
      next = protectedBreak;
    } else {
      for (const g of groups) {
        if (g.top <= cursor + 20) continue;
        if (g.top >= limit) break;
        if (g.bottom > limit && g.bottom - g.top <= pageCssHeight - safety) {
          protectedBreak = g.top;
          break;
        }
      }

      if (protectedBreak > cursor + 20) {
        next = protectedBreak;
      } else {
        let candidate = -1;
        for (const r of rows) {
          if (r.top >= cursor && r.bottom <= limit) candidate = r.bottom;
          else if (r.top >= limit) break;
        }
        next = candidate > cursor + 20 ? candidate : limit;
      }
    }
    if (next <= cursor) next = cursor + pageCssHeight;
    breaks.push(next);
    cursor = next;
  }
  breaks.push(totalHeight);
  return breaks;
}

function getTopLevelPdfSections(element: HTMLElement) {
  const rootRect = element.getBoundingClientRect();

  return Array.from(element.querySelectorAll<HTMLElement>('[data-pdf-section]'))
    .filter((section) => {
      const parentSection = section.parentElement?.closest('[data-pdf-section]');
      return !parentSection || parentSection === element;
    })
    .map((node) => {
      const rect = node.getBoundingClientRect();
      return {
        node,
        top: rect.top - rootRect.top,
        bottom: rect.bottom - rootRect.top,
        left: rect.left - rootRect.left,
        width: rect.width,
        height: rect.height,
      };
    })
    .sort((a, b) => a.top - b.top);
}

export async function exportElementToPdf(element: HTMLElement, filename: string) {
  await new Promise((r) => requestAnimationFrame(() => r(null)));

  const scale = 2;
  const pdf = new jsPDF({ unit: 'pt', format: 'letter', orientation: 'portrait' });
  const pageWpt = pdf.internal.pageSize.getWidth();
  const pageHpt = pdf.internal.pageSize.getHeight();
  const cssWidth = element.offsetWidth;
  const cssToPt = pageWpt / cssWidth;
  const pageCssHeight = pageHpt / cssToPt;
  const sections = getTopLevelPdfSections(element);

  if (sections.length) {
    let pageYCss = 0;
    let previousBottom = 0;
    const safety = 4;

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const gap = Math.max(0, section.top - previousBottom);
      const sectionHeight = section.height;
      const proposedY = pageYCss + gap;
      const proposedBottom = proposedY + sectionHeight;

      if (
        i > 0 &&
        pageYCss > safety &&
        sectionHeight <= pageCssHeight - safety &&
        proposedBottom > pageCssHeight - safety
      ) {
        pdf.addPage();
        pageYCss = 0;
      } else {
        pageYCss = proposedY;
      }

      const canvas = await html2canvas(section.node, {
        scale,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        windowWidth: element.scrollWidth,
      });

      const dataUrl = canvas.toDataURL('image/png');
      const xPt = section.left * cssToPt;
      const yPt = pageYCss * cssToPt;
      const wPt = section.width * cssToPt;
      const hPt = (canvas.height * wPt) / canvas.width;

      pdf.addImage(dataUrl, 'PNG', xPt, yPt, wPt, hPt);
      pageYCss += hPt / cssToPt;
      previousBottom = section.bottom;
    }

    pdf.save(filename);
    return;
  }

  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    backgroundColor: '#ffffff',
    logging: false,
    windowWidth: element.scrollWidth,
  });

  const fallbackPageCssHeight = (pageHpt * cssWidth) / pageWpt;
  const breaks = computePageBreaks(element, fallbackPageCssHeight);

  for (let i = 0; i < breaks.length - 1; i++) {
    const sliceTopCss = breaks[i];
    const sliceBottomCss = breaks[i + 1];
    const sliceHeightCss = sliceBottomCss - sliceTopCss;
    if (sliceHeightCss <= 0) continue;

    const sliceCanvas = document.createElement('canvas');
    sliceCanvas.width = canvas.width;
    sliceCanvas.height = Math.round(sliceHeightCss * scale);
    const ctx = sliceCanvas.getContext('2d');
    if (!ctx) continue;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, sliceCanvas.width, sliceCanvas.height);
    ctx.drawImage(
      canvas,
      0,
      Math.round(sliceTopCss * scale),
      canvas.width,
      sliceCanvas.height,
      0,
      0,
      sliceCanvas.width,
      sliceCanvas.height,
    );

    const dataUrl = sliceCanvas.toDataURL('image/jpeg', 0.95);
    const imgHpt = (sliceCanvas.height * pageWpt) / sliceCanvas.width;
    if (i > 0) pdf.addPage();
    pdf.addImage(dataUrl, 'JPEG', 0, 0, pageWpt, imgHpt);
  }

  pdf.save(filename);
}
