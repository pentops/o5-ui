import React from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-json';
import 'prismjs/themes/prism-tomorrow.css';

export type JSONEditorProps = React.HTMLAttributes<HTMLDivElement> & {
  // Props for the component
  value: string;
  tabSize?: number;
  insertSpaces?: boolean;
  ignoreTabKey?: boolean;
  style?: React.CSSProperties;

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

export const JSONEditor = React.forwardRef((props: JSONEditorProps, ref: React.Ref<HTMLDivElement>) => {
  return (
    <div
      className="scrollbars max-h-96 overflow-auto rounded-md border border-input bg-transparent shadow-sm focus-visible:outline-none focus-within:ring-1 focus-within:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
      ref={ref}
    >
      <Editor
        {...props}
        className="font-mono text-xs bg-transparent"
        value={props.value || '{}'}
        onValueChange={(value) => {
          try {
            props.onChange?.({ target: { name: props.name, value } } as React.ChangeEvent<HTMLInputElement>);
          } catch {}
        }}
        highlight={(code) => highlight(code, languages.json)}
        padding={10}
      />
    </div>
  );
});
