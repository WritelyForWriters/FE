"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { JSONContent } from "@tiptap/core";
import { UniqueID } from "./extensions/UniqueID";

type Heading = {
  id: string;
  text: string;
  level: number;
};

export default function TiptapPage() {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [selectedText, setSelectedText] = useState<string>("");

  const editor = useEditor({
    extensions: [StarterKit, UniqueID],
    content: "<h1>시작하기</h1><p>여기에 내용을 입력하세요...</p>",
    editorProps: {
      attributes: {
        class: styles.contentEditable,
      },
    },
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;
      const text = editor.state.doc.textBetween(from, to);

      if (text) {
        console.log("Tiptap Selected Text:", {
          text,
          range: {
            from,
            to,
            nodeType: editor.state.doc.nodeAt(from)?.type.name,
          },
        });
      }
    },
    onUpdate: ({ editor }) => {
      const docs = editor.getJSON();
      const headingNodes: Heading[] = [];

      const processNode = (node: JSONContent, index: number) => {
        if (node.type === "heading") {
          headingNodes.push({
            id: node.attrs?.id || `heading-${Math.random().toString(36).substr(2, 9)}`,
            text: (node.content?.[0] as JSONContent)?.text || "",
            level: (node.attrs as { level: number })?.level || 1,
          });
        }
      };

      docs.content?.forEach(processNode);
      setHeadings(headingNodes);
    },
  });

  const handleSubmit = () => {
    if (editor) {
      const json = editor.getJSON();
      const headingNodes = json.content
        ?.filter((node) => node.type === "heading")
        .map((node) => ({
          id: node.attrs?.id || `heading-${Math.random().toString(36).substr(2, 9)}`,
          content: node,
        }));

      console.log("Tiptap Editor Content:", {
        ...json,
        headings: headingNodes,
      });
    }
  };

  const handleHeadingClick = (headingId: string) => {
    // URL 해시 업데이트
    window.location.hash = headingId;
    console.log(headingId);
    const heading = document.querySelector(`#${headingId}`);  
    console.log(heading);
    if (heading) {
      heading.scrollIntoView({ behavior: "smooth" });
    }
  };

//   // URL 해시 변경 감지
//   useEffect(() => {
//     const handleHashChange = () => {
//       const hash = window.location.hash.slice(1);
//       if (hash) {
//         const heading = document.querySelector(`[id="${hash}"]`);
//         if (heading) {
//           heading.scrollIntoView({ behavior: "smooth" });
//         }
//       }
//     };

//     window.addEventListener("hashchange", handleHashChange);
//     // 초기 로드 시 해시가 있으면 처리
//     if (window.location.hash) {
//       handleHashChange();
//     }

//     return () => {
//       window.removeEventListener("hashchange", handleHashChange);
//     };
//   }, []);

  return (
    <div className={styles.pageContainer}>
      <aside className={styles.sidebar}>
        <nav>
          <h2>목차</h2>
          <ul>
            {headings.map((heading) => (
              <li
                key={heading.id}
                className={styles[`heading${heading.level}`]}
                onClick={() => handleHeadingClick(heading.id)}
              >
                {heading.text}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className={styles.editorContainer}>
        <h1>Tiptap 에디터</h1>
        <div className={styles.editor}>
          <EditorContent editor={editor} />
        </div>
        <button onClick={handleSubmit} className={styles.submitButton}>
          제출하기
        </button>
      </main>
    </div>
  );
}
