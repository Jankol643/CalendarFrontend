import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-line-numbered-textarea',
  styleUrls: ['./line-numbered-textarea.component.scss'],
  templateUrl: './line-numbered-textarea.component.html',
})
export class LineNumberedTextareaComponent implements AfterViewInit {
  @ViewChild('textarea') textareaRef!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('lineNumbers') lineNumbersRef!: ElementRef<HTMLDivElement>;

  private resizeObserver!: ResizeObserver;
  private _scrollListenerAdded = false;

  ngAfterViewInit() {
    /**
     * Sets the font styles of the line numbers element to match the textarea.
     * @param lineNumbersEl - The HTMLElement that displays line numbers.
     * @param textareaEl - The textarea element.
     */
    function syncFontStyles(lineNumbersEl: HTMLElement, textareaEl: HTMLTextAreaElement): void {
      const styles = window.getComputedStyle(textareaEl);
      const fontProperties = [
        'fontFamily',
        'fontSize',
        'fontWeight',
        'letterSpacing',
        'lineHeight',
      ];

      fontProperties.forEach((property) => {
        (lineNumbersEl.style as any)[property] = styles[property as any];
      });
    }

    /**
     * Parses a CSS pixel value string (e.g., '16px') into a number.
     * @param value - The CSS pixel value string.
     * @returns The numeric value.
     */
    function parsePxValue(value: string): number {
      return value.endsWith('px') ? parseInt(value.slice(0, -2), 10) : 0;
    }

    /**
     * Calculates how many visual lines a given text will occupy within the textarea's width.
     * @param text - The text string to measure.
     * @param ctx - The CanvasRenderingContext2D used for measurement.
     * @param textareaWidth - The inner width of the textarea (excluding padding).
     * @returns The number of lines needed to display the text.
     */
    function calculateNumberOfLines(
      text: string,
      ctx: CanvasRenderingContext2D,
      textareaWidth: number
    ): number {
      const words = text.split(' ');
      let lineCount = 0;
      let currentLine = '';

      for (const word of words) {
        const wordWidth = ctx.measureText(word + ' ').width;
        const lineWidth = ctx.measureText(currentLine).width;

        if (lineWidth + wordWidth > textareaWidth) {
          lineCount++;
          currentLine = word + ' ';
        } else {
          currentLine += word + ' ';
        }
      }

      if (currentLine.trim() !== '') {
        lineCount++;
      }

      return lineCount;
    }

    /**
     * Generates an array representing line numbers aligned with the textarea lines.
     * Handles wrapped lines by calculating the visual line count for each paragraph.
     * @param lines - Array of strings, each representing a line in the textarea.
     * @param ctx - Canvas context for text measurement.
     * @param textareaWidth - The inner width of the textarea.
     * @returns An array of line numbers and empty strings for wrapped lines.
     */
    function generateLineNumberArray(
      lines: string[],
      ctx: CanvasRenderingContext2D,
      textareaWidth: number
    ): (number | string)[] {
      const lineNumberArray: (number | string)[] = [];
      let lineNumber = 1;

      for (const line of lines) {
        const lineCount = calculateNumberOfLines(line, ctx, textareaWidth);
        lineNumberArray.push(lineNumber);
        // Add empty strings for wrapped lines
        for (let i = 1; i < lineCount; i++) {
          lineNumberArray.push('');
        }
        lineNumber++;
      }

      return lineNumberArray;
    }

    /**
     * Updates the line numbers display based on the current content of the textarea.
     * @param textareaEl - The textarea element.
     * @param lineNumbersEl - The element displaying the line numbers.
     */
    function updateLineNumbers(
      textareaEl: HTMLTextAreaElement,
      lineNumbersEl: HTMLElement
    ): void {
      // Synchronize font styles
      syncFontStyles(lineNumbersEl, textareaEl);

      const styles = window.getComputedStyle(textareaEl);
      const fontSize = styles.fontSize;
      const fontFamily = styles.fontFamily;
      const fontWeight = styles.fontWeight;
      const letterSpacing = styles.letterSpacing;
      const lineHeight = styles.lineHeight;

      // Set up a canvas context for measuring text width
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      ctx.font = `${fontWeight} ${fontSize} ${fontFamily}`;

      const paddingLeft = parsePxValue(styles.paddingLeft);
      const paddingRight = parsePxValue(styles.paddingRight);

      const textareaRect = textareaEl.getBoundingClientRect();
      const textareaInnerWidth = textareaRect.width - paddingLeft - paddingRight;

      // Generate line number array considering wrapped lines
      const lines = textareaEl.value.split('\n');
      const lineNumberArray = generateLineNumberArray(lines, ctx, textareaInnerWidth);

      // Render line numbers
      lineNumbersEl.innerHTML = lineNumberArray
        .map((ln) => `<div>${ln || '&nbsp;'}</div>`)
        .join('');
    }

    /**
     * Attaches a scroll event listener to synchronize the scroll position of line numbers with the textarea.
     * @param textareaEl - The textarea element.
     * @param lineNumbersEl - The element displaying line numbers.
     */
    function syncScroll(
      textareaEl: HTMLElement,
      lineNumbersEl: HTMLElement
    ): void {
      textareaEl.addEventListener('scroll', () => {
        lineNumbersEl.scrollTop = textareaEl.scrollTop;
      });
    }

    /**
     * Sets up ResizeObserver to adjust line numbers container height and update line numbers on resize.
     * @param textareaEl - The textarea element.
     * @param lineNumbersEl - The element displaying line numbers.
     * @param updateFn - The function to call to update line numbers.
     */
    function setupResizeObserver(
      textareaEl: HTMLElement,
      lineNumbersEl: HTMLElement,
      updateFn: () => void
    ): ResizeObserver {
      const resizeObserver = new ResizeObserver(() => {
        lineNumbersEl.style.height = `${textareaEl.offsetHeight}px`;
        updateFn();
      });
      resizeObserver.observe(textareaEl);
      return resizeObserver;
    }

    /**
     * Initializes the line numbering functionality for a textarea and its associated line numbers container.
     * @param textareaEl - The textarea element.
     * @param lineNumbersEl - The element displaying line numbers.
     * @param options - Optional settings for resize observer.
     */
    function initializeLineNumbering(
      textareaEl: HTMLTextAreaElement,
      lineNumbersEl: HTMLElement,
      options?: { observeResize?: boolean }
    ): { resizeObserver?: ResizeObserver } {
      // Synchronize font styles initially
      syncFontStyles(lineNumbersEl, textareaEl);

      // Attach input event to update line numbers on content change
      const inputHandler = () => {
        updateLineNumbers(textareaEl, lineNumbersEl);
      };
      textareaEl.addEventListener('input', inputHandler);

      // Synchronize scroll position
      syncScroll(textareaEl, lineNumbersEl);

      let resizeObserver: ResizeObserver | undefined;

      if (options?.observeResize) {
        resizeObserver = setupResizeObserver(textareaEl, lineNumbersEl, () => {
          updateLineNumbers(textareaEl, lineNumbersEl);
        });
      }

      // Initial update
      updateLineNumbers(textareaEl, lineNumbersEl);

      return { resizeObserver };
    }
  }
}