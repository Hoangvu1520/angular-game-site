import dynamic from "next/dynamic";
const RichTextEditor = dynamic(() => import("./RichTextEditor"), {
  ssr: false,
});
export type { RichTextEditorProps } from "./RichTextEditor";
export { RichTextEditor };
