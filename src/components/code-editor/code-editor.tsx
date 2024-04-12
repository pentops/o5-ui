import React, { useEffect, useState } from 'react';
import Editor from 'react-simple-code-editor';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { highlight, languages } from 'prismjs/components/prism-core';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';
import 'prismjs/themes/prism-tomorrow.css';
import { useCopyToClipboard } from '@/lib/copy.ts';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip.tsx';
import { CopyIcon } from '@radix-ui/react-icons';

type SupportedLanguage = 'json' | 'yaml';

function getDefaultValue(language: SupportedLanguage) {
  switch (language) {
    case 'json':
      return '{}';
    case 'yaml':
      return '';
  }
}

export type CodeEditorProps = React.HTMLAttributes<HTMLDivElement> & {
  // Props for the component
  value: string;
  tabSize?: number;
  insertSpaces?: boolean;
  ignoreTabKey?: boolean;
  style?: React.CSSProperties;
  language?: 'json' | 'yaml';

  // Props for the textarea
  textareaId?: string;
  textareaClassName?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  form?: string;
  maxLength?: number;
  minLength?: number;
  name?: string;
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  onClick?: React.MouseEventHandler<HTMLTextAreaElement>;
  onFocus?: React.FocusEventHandler<HTMLTextAreaElement>;
  onBlur?: React.FocusEventHandler<HTMLTextAreaElement>;
  onKeyUp?: React.KeyboardEventHandler<HTMLTextAreaElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>;

  // Props for the highlighted code's pre element
  preClassName?: string;
};

export const CodeEditor = React.forwardRef((props: CodeEditorProps, ref: React.Ref<HTMLDivElement>) => {
  const [isShowingCopiedNotice, setIsShowingCopiedNotice] = useState(false);
  const [copied, copy] = useCopyToClipboard();

  useEffect(() => {
    let timeout: number;

    if (copied) {
      setIsShowingCopiedNotice(true);
      timeout = window.setTimeout(() => setIsShowingCopiedNotice(false), 1000);
    }

    return () => {
      window.clearTimeout(timeout);
    };
  }, [copied]);

  return (
    <div
      className="relative scrollbars max-h-96 overflow-auto rounded-md border border-input bg-transparent shadow-sm focus-visible:outline-none focus-within:ring-1 focus-within:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      ref={ref}
    >
      <TooltipProvider>
        <Tooltip open={isShowingCopiedNotice}>
          <TooltipTrigger asChild>
            <button aria-label="Copy" className="absolute top-2 right-2 z-20" onClick={() => copy(props.value || '')} type="button">
              <CopyIcon />
            </button>
          </TooltipTrigger>
          <TooltipContent>Copied!</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Editor
        {...props}
        className="font-mono text-xs bg-transparent whitespace-pre break-words"
        value={props.value || getDefaultValue(props.language || 'json')}
        onValueChange={(value) => {
          try {
            props.onChange?.({ target: { name: props.name, value } } as React.ChangeEvent<HTMLInputElement>);
          } catch {}
        }}
        highlight={(code) => highlight(code, languages[props.language || 'json'])}
        padding={10}
      />
    </div>
  );
});
