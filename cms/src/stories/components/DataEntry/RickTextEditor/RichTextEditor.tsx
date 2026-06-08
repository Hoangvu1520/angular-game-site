import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

type RichTextEditorProps = {
  defaultValue?: string;
  value?: string;
  onChange?: (value: any) => void;
  [RichTextEditorProps: string]: any;
};

const RichText = ({
  defaultValue = "",
  value,
  onChange,
}: RichTextEditorProps) => {
  const editorRef = useRef<any>(null);

  return (
    <CKEditor
      editor={ClassicEditor as any}
      data={value ?? defaultValue}
      onReady={(editor) => {
        editorRef.current = editor;
      }}
      onChange={(event, editor) => {
        const val = editor.getData();
        onChange?.(val);
      }}
    />
  );
};

export default RichText;
export type { RichTextEditorProps };
