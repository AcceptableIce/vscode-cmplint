"use strict";

const path = require("path");

const langClient = require("vscode-languageclient");
const LanguageClient = langClient.LanguageClient;
const SettingMonitor = langClient.SettingMonitor;
const vscode = require("vscode");

exports.activate = context => {
	console.log("Launching!");
	const serverModule = path.join(__dirname, "server.js");

	const client = new LanguageClient("cmplint", {
		run: {
			module: serverModule
		},
		debug: {
			module: serverModule,
			options: {
				execArgv: ["--nolazy", "--debug=6004"]
			}
		}
	}, {
		documentSelector: ["cmp", "js"],
		synchronize: {
			configurationSection: "stylelint",
			fileEvents: vscode.workspace.createFileSystemWatcher("**/{.cmplintrc,cmplint.config.js}")
		}
	});

	context.subscriptions.push(new SettingMonitor(client, "cmplint.enable").start());
};
