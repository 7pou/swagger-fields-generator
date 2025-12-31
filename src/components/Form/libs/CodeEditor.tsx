import React from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';

interface CodeEditorProps {
  value: string;
  disabled?: boolean;
  onChange?: (value: string) => void;
}
const CodeEditor = ({ value, onChange, disabled }: CodeEditorProps) => {
  // 设置初始代码
  return (

    <div>
      <Editor
        value={value}
        disabled={disabled}
        onValueChange={onChange}
        highlight={(code) => highlight(code, languages.js)}
        padding={10}
        style={{
          width: '100%',
          minHeight: '300px',
          borderRadius: '4px',
          backgroundColor: '#fff',
          border: '1px solid #ccc',
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 14,
          lineHeight: '1.5',
        }}
      />
    </div>
  );
};

export default CodeEditor;
