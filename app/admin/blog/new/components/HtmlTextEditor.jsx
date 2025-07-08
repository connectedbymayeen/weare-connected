'use client'
import 'prism-code-editor-lightweight/layout.css';
import 'prism-code-editor-lightweight/themes/github-dark.css';
import RichTextEditor, { BaseKit } from 'reactjs-tiptap-editor';
import { Bold } from 'reactjs-tiptap-editor/Bold';
import { FontFamily } from 'reactjs-tiptap-editor/FontFamily';
import { FontSize } from 'reactjs-tiptap-editor/FontSize';
import { Heading } from 'reactjs-tiptap-editor/Heading';
import { Indent } from 'reactjs-tiptap-editor/Indent';
import { Italic } from 'reactjs-tiptap-editor/Italic';
import { OrderedList } from 'reactjs-tiptap-editor/OrderedList';
// import { BaseKit } from 'reactjs-tiptap-editor/extension-bundle'; // for version 0.1.16 and lower

// Import CSS
import 'reactjs-tiptap-editor/style.css';

const extensions = [

  Bold,
  Heading,
  FontSize,
  FontFamily,
  Indent,
  Italic,
  OrderedList,
  BaseKit
];

export default function HtmlTextEditor({content,setContent}) {
  console.log("content",content);
  

  const onChangeContent = (value) => {
    setContent(value);
  };
  return (
    <RichTextEditor
      output='html'
      content={content}
      onChangeContent={onChangeContent}
      extensions={extensions}
    />
  )
}
