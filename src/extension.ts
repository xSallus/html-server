// The module 'vscode' contains the VS Code extensibility API

import * as vscode from 'vscode';
import { watcher, serverUp, setup, destroyTempFolder } from './watcher';
import { liveReloadServer } from "./server";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "html-server" is now active!');

	// The command has been defined in the package.json file
	//  Now provide the implementation of the command with registerCommand
	//  The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand(
		'html-server.helloWorld',
		() => {
	  	// Display a message box to the user
		  vscode.window.showInformationMessage('Hello World from html-server!');
		}
	);

	let start = vscode.commands.registerCommand(
		'html-server.start',
		() => {
			const folders = vscode.workspace?.workspaceFolders;
			const workspace = folders ? folders[0]?.uri.path : 'empty';
			setup(workspace);
			watcher && watcher.on('ready', serverUp);
			watcher && watcher.on('change', () => {
				setup(workspace);
				liveReloadServer.refresh("/");
			});
			vscode.window.showInformationMessage(`Started server on folder ${workspace} :D`);
		}
	);

	let stop = vscode.commands.registerCommand(
		'html-server.stop',
		() => {
			destroyTempFolder();
			vscode.window.showInformationMessage('Server successfully stoped!');
		}
	);

	context.subscriptions.push(disposable);
	context.subscriptions.push(start);
	context.subscriptions.push(stop);
}

// this method is called when your extension is deactivated
export function deactivate() {}
