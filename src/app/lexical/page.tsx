"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HeadingNodeWithId } from "./nodes/HeadingNodeWithId";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import {
  $getRoot,
  EditorState,
  $getSelection,
  $isRangeSelection,
  $createTextNode,
} from "lexical";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { $createHeadingNode } from "@lexical/rich-text";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();

  const createHeading = (level: 1 | 2 | 3) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const headingNode = new HeadingNodeWithId(`h${level}`);
        headingNode.append($createTextNode(`제목 ${level}`));
        selection.insertNodes([headingNode]);
      }
    });
  };

  return (
    <div className={styles.toolbar}>
      <button onClick={() => createHeading(1)}>H1</button>
      <button onClick={() => createHeading(2)}>H2</button>
      <button onClick={() => createHeading(3)}>H3</button>
    </div>
  );
}

type Heading = {
  id: string;
  text: string;
  level: number;
};

function SubmitButton() {
  const [editor] = useLexicalComposerContext();

  const handleSubmit = () => {
    editor.getEditorState().read(() => {
      const headingNodes: { id: string; content: any }[] = [];
      $getRoot()
        .getChildren()
        .forEach((node) => {
          if (node.getType() === "heading-with-id") {
            headingNodes.push({
              id: node.getKey(),
              content: {
                type: node.getType(),
                text: node.getTextContent(),
                tag: (node as HeadingNodeWithId).getTag(),
              },
            });
          }
        });

      const json = editor.getEditorState().toJSON();
      console.log("Lexical Editor Content:", {
        ...json,
        headings: headingNodes,
      });
    });
  };

  return (
    <button onClick={handleSubmit} className={styles.submitButton}>
      제출하기
    </button>
  );
}

function ScrollToPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const scrollToHeading = (headingId: string) => {
      editor.getEditorState().read(() => {
        const node = editor.getElementByKey(headingId);
        if (node) {
          node.scrollIntoView({ behavior: "smooth" });
        }
      });
    };

    // 이벤트 리스너 등록
    window.addEventListener("scrollToHeading", ((e: CustomEvent) => {
      scrollToHeading(e.detail.headingId);
    }) as EventListener);

    return () => {
      window.removeEventListener("scrollToHeading", ((e: CustomEvent) => {
        scrollToHeading(e.detail.headingId);
      }) as EventListener);
    };
  }, [editor]);

  return null;
}

function SelectionPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const selectedText = selection.getTextContent();
          const anchor = selection.anchor;
          const focus = selection.focus;

          if (selectedText) {
            console.log("Lexical Selected Text:", {
              text: selectedText,
              anchor: {
                key: anchor.key,
                offset: anchor.offset,
              },
              focus: {
                key: focus.key,
                offset: focus.offset,
              },
            });
          }
        }
      });
    });
  }, [editor]);

  return null;
}

export default function LexicalPage() {
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        const heading = document.querySelector(`[id="${hash}"]`);
        if (heading) {
          heading.scrollIntoView({ behavior: "smooth" });
        }
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    // 초기 로드 시 해시가 있으면 처리
    if (window.location.hash) {
      handleHashChange();
    }

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const initialConfig = {
    namespace: "MyEditor",
    onError: (error: Error) => {
      console.error(error);
    },
    nodes: [HeadingNodeWithId],
    theme: {
      paragraph: "editor-paragraph",
      heading: {
        h1: "editor-heading-h1",
        h2: "editor-heading-h2",
        h3: "editor-heading-h3",
      },
    },
  };

  const onChange = (editorState: EditorState) => {
    editorState.read(() => {
      const headingNodes: Heading[] = [];
      $getRoot()
        .getChildren()
        .forEach((node) => {
          if (node.getType() === "heading-with-id") {
            const headingNode = node as HeadingNodeWithId;
            headingNodes.push({
              id: headingNode.getPermanentId(),
              text: node.getTextContent(),
              level: parseInt(headingNode.getTag().slice(1)),
            });
          }
        });
      setHeadings(headingNodes);
    });
  };

  const handleHeadingClick = (headingId: string) => {
    window.location.hash = headingId;

    const event = new CustomEvent("scrollToHeading", {
      detail: { headingId },
    });
    window.dispatchEvent(event);
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        const event = new CustomEvent("scrollToHeading", {
          detail: { headingId: hash },
        });
        window.dispatchEvent(event);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    if (window.location.hash) {
      handleHashChange();
    }

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

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
        <h1>Lexical 에디터</h1>
        <div className={styles.editor}>
          <LexicalComposer initialConfig={initialConfig}>
            <div className={styles.editorInner}>
              <ToolbarPlugin />
              <RichTextPlugin
                contentEditable={
                  <ContentEditable className={styles.contentEditable} />
                }
                placeholder={
                  <div className={styles.placeholder}>
                    여기에 내용을 입력하세요...
                  </div>
                }
                ErrorBoundary={LexicalErrorBoundary}
              />
              <HistoryPlugin />
              <ScrollToPlugin />
              <SelectionPlugin />
            </div>
            <OnChangePlugin onChange={onChange} />
            <SubmitButton />
          </LexicalComposer>
        </div>
      </main>
    </div>
  );
}
