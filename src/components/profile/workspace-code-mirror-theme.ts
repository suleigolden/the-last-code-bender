import { EditorView } from '@codemirror/view';

/** Slate / VS Code–style shell; pairs with theme="dark" (oneDark) for syntax tokens */
export const workspaceCodeMirrorChrome = EditorView.theme(
  {
    '&': { height: '100%' },
    '.cm-editor': {
      backgroundColor: '#1e293b',
    },
    '.cm-scroller': {
      fontFamily:
        'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      fontSize: '15px',
      lineHeight: '1.65',
    },
    '.cm-content': {
      caretColor: '#f8fafc',
      paddingTop: '10px',
      paddingBottom: '20px',
    },
    '.cm-gutters': {
      backgroundColor: '#1e293b',
      borderRight: '1px solid #334155',
    },
    '.cm-lineNumbers .cm-gutterElement': {
      padding: '0 12px 0 8px',
      minWidth: '3ch',
      fontSize: '13px',
      color: '#64748b',
    },
    '.cm-activeLineGutter': {
      backgroundColor: 'rgba(56, 189, 248, 0.08)',
    },
    '.cm-activeLine': {
      backgroundColor: 'rgba(51, 65, 85, 0.35)',
    },
    '.cm-foldGutter .cm-gutterElement': {
      color: '#64748b',
    },
    '.cm-focused .cm-cursor': {
      borderLeftColor: '#f8fafc',
    },
    '.cm-selectionBackground': {
      backgroundColor: 'rgba(56, 189, 248, 0.2) !important',
    },
  },
  { dark: true },
);
