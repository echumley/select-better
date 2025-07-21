import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('select-better.selectExtendedWord', () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    const doc = editor.document;
    const position = editor.selection.active;
    const fullText = doc.getText();
    const offset = doc.offsetAt(position);
    const line = doc.lineAt(position.line);
    const lineText = line.text;
    const lineOffset = doc.offsetAt(new vscode.Position(position.line, 0));
    const localOffset = offset - lineOffset;

    // Try to match known full-document patterns
    const matchAndSelect = (regex: RegExp, cleanParens = false): boolean => {
      let match: RegExpExecArray | null;
      while ((match = regex.exec(fullText))) {
        let start = match.index;
        let end = start + match[0].length;

        if (cleanParens && match[0].endsWith(')') && !match[0].includes('(')) {
          end -= 1;
        }

        if (offset >= start && offset <= end) {
          const startPos = doc.positionAt(start);
          const endPos = doc.positionAt(end);
          editor.selection = new vscode.Selection(startPos, endPos);
          editor.revealRange(new vscode.Range(startPos, endPos));
          console.log(`Selected match for ${regex}:`, match[0].slice(0, end - start));
          return true;
        }
      }
      return false;
    };

    // Known full-document patterns (URLs, localhost, emails, IPs)
    const patterns = [
      { regex: /https?:\/\/[^\s)"'<>]+/g, clean: true },
      { regex: /mailto:[^\s)"'<>]*[A-Za-z0-9]+/g, clean: true },
      { regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,6}\b/g, clean: false },
      { regex: /http:\/\/localhost:\d+/g, clean: false },
      { regex: /http:\/\/(?:\d{1,3}\.){3}\d{1,3}(?::\d+)?/g, clean: false }
    ];

    for (const { regex, clean } of patterns) {
      if (matchAndSelect(regex, clean)) return;
    }

    // Fallback: Select extended word (on line only)
    const allowed = /[a-zA-Z0-9_-]/;
    let start = position.character;
    let end = position.character;

    while (start > 0 && allowed.test(lineText[start - 1])) start--;
    while (end < lineText.length && allowed.test(lineText[end])) end++;

    if (start !== end) {
      const startPos = new vscode.Position(position.line, start);
      const endPos = new vscode.Position(position.line, end);
      editor.selection = new vscode.Selection(startPos, endPos);
      editor.revealRange(new vscode.Range(startPos, endPos));
      console.log("Fallback: selected extended word.");
    } else {
      vscode.window.showInformationMessage('No recognizable text under cursor.');
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}