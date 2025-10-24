import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-line-numbered-textarea',
  styleUrls: ['./line-numbered-textarea.component.scss'],
  templateUrl: './line-numbered-textarea.component.html',
})
export class LineNumberedTextareaComponent implements AfterViewInit {
  @ViewChild('textarea') textareaRef!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('lineNumbers') lineNumbersRef!: ElementRef<HTMLDivElement>;

  private resizeObserver!: ResizeObserver;

  ngAfterViewInit() {
    const textarea = this.textareaRef.nativeElement;
    const lineNumbersEle = this.lineNumbersRef.nativeElement;

    const updateLineNumbers = () => {
      // Copy font styles from textarea to line numbers
      const styles = window.getComputedStyle(textarea);
      [
        'fontFamily',
        'fontSize',
        'fontWeight',
        'letterSpacing',
        'lineHeight'
      ].forEach((property) => {
        (lineNumbersEle.style as any)[property] = styles[property as any];
      });

      // Function to calculate number of visual lines for a text line
      const parseValue = (v: string) => (v.endsWith('px') ? parseInt(v.slice(0, -2), 10) : 0);
      const font = `${styles.fontSize} ${styles.fontFamily}`;
      const paddingLeft = parseValue(styles.paddingLeft);
      const paddingRight = parseValue(styles.paddingRight);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      ctx.font = font;

      const calculateNumLines = (str: string): number => {
        const textareaWidth = textarea.getBoundingClientRect().width - paddingLeft - paddingRight;
        const words = str.split(' ');
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
        if (currentLine.trim() !== '') lineCount++;
        return lineCount;
      };

      const calculateLineNumbers = (): (number | string)[] => {
        const lines = textarea.value.split('\n');
        const numLinesArray = lines.map(calculateNumLines);
        const lineNumbers: (number | string)[] = [];
        let lineNumber = 1;

        numLinesArray.forEach((lineCount) => {
          lineNumbers.push(lineNumber);
          for (let i = 1; i < lineCount; i++) {
            lineNumbers.push('');
          }
          lineNumber++;
        });
        return lineNumbers;
      };

      const displayLineNumbers = () => {
        const lineNumbers = calculateLineNumbers();
        lineNumbersEle.innerHTML = lineNumbers
          .map((ln) => `<div>${ln || '&nbsp;'}</div>`)
          .join('');
      };

      // Attach input event listener once
      if (!textarea.hasAttribute('data-line-numbers-listener')) {
        textarea.addEventListener('input', () => {
          displayLineNumbers();
        });
        textarea.setAttribute('data-line-numbers-listener', 'true');
      }

      // Initial render
      displayLineNumbers();
    };

    // Keep lineNumbers scroll in sync with textarea
    if (!this._scrollListenerAdded) {
      this.textareaRef.nativeElement.addEventListener('scroll', () => {
        this.lineNumbersRef.nativeElement.scrollTop = this.textareaRef.nativeElement.scrollTop;
      });
      this._scrollListenerAdded = true;
    }

    // Call updateLineNumbers initially
    updateLineNumbers();

    // Set up ResizeObserver once
    if (!this.resizeObserver) {
      this.resizeObserver = new ResizeObserver(() => {
        // Adjust height of line numbers container
        this.lineNumbersRef.nativeElement.style.height = `${this.textareaRef.nativeElement.offsetHeight}px`;
        // Update line numbers on resize
        updateLineNumbers();
      });
      this.resizeObserver.observe(this.textareaRef.nativeElement);
    }

    // Optional: handle window resize
    window.addEventListener('resize', () => {
      updateLineNumbers();
    });
  }

  private _scrollListenerAdded = false;
}