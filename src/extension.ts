'use strict';

// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "rapid" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.helloWorld', () => {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World 2!');
	});

	context.subscriptions.push(disposable);

	vscode.languages.registerDocumentFormattingEditProvider('rapid', {
		provideDocumentFormattingEdits(document: vscode.TextDocument): vscode.TextEdit[] {
			// const regexIncIndent = /\((forall)/;
			const regexIncIndent = /^\s*\t*\((assert|assert-not|forall.*|exists.*|and|or|=>|not)$/;
			const regexDecIndent = /^\s*\t*\)/;
			const regexIsSMTLine = /^\s*\t*(\(|\))/;

			// for each line, update indentLevel and format line accordingly
			var edits = []
			var indentLevel = 0;
			for (let index = 0; index < document.lineCount; index++) {
				const line = document.lineAt(index);

				if (!line.isEmptyOrWhitespace && regexIsSMTLine.test(line.text)) {
					// decrement-check for this line
					if (regexDecIndent.test(line.text)) {
						indentLevel = Math.max(indentLevel - 1, 0);
					}

					// format line
					var formattedText = '\t'.repeat(indentLevel) + line.text.substring(line.firstNonWhitespaceCharacterIndex, line.text.length);
					edits.push(vscode.TextEdit.replace(line.range, formattedText));

					// increment-check for next line
					if (regexIncIndent.test(line.text)) {
						indentLevel = indentLevel + 1;
					}
				}
			}
			return edits;
		}
	});
}

// this method is called when your extension is deactivated
export function deactivate() { }
