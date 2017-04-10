"use strict";

const langServer = require("vscode-languageserver");
const Files = langServer.Files;
const cmplintServerWrapper = require("vscode-cmplint-server");
const path = require("path");

let config;
let configOverrides;

const connection = langServer.createConnection(process.stdin, process.stdout);
const documents = new langServer.TextDocuments();

const supportedCustomSyntaxes = new Set(["cmp", "js"]);

function validate(document) {
	const options = {
		code: document.getText(),
		formatter: "raw",
		filter: "<source>"
	};

	const filePath = Files.uriToFilePath(document.uri);

	if(!filePath) return;

	options.sourceDirectory = path.join(filePath, "..");

	if(config) {
		options.config = config;
	}

	if(configOverrides) {
		options.configOverrides = configOverrides;
	}


	if(supportedCustomSyntaxes.has(document.languageId)) {
		options.syntax = document.languageId;
	}

	return cmplintServerWrapper(options).then(diagnostics => {
		connection.sendDiagnostics({
			uri: document.uri,
			diagnostics
		});
	}).catch(err => {
		connection.console.log(err.message);
		if(err.reasons) {
			err.reasons.forEach(reason => connection.window.showErrorMessage("cmplint: " + reason));

			return;
		}
		connection.window.showErrorMessage(err.stack.replace(/\n/g, " "));
	});
}

function validateAll() {
	return Promise.all(documents.all().map(document => validate(document)));
}

connection.onInitialize(() => {
	validateAll();

	return {
		capabilities: {
			textDocumentSync: documents.syncKind
		}
	};
});
connection.onDidChangeConfiguration(params => {
	const { settings } = params;

	config = settings.cmplint.config;
	configOverrides = settings.cmplint.configOverrides;

	validateAll();
});
connection.onDidChangeWatchedFiles(() => validateAll());

documents.onDidChangeContent(event => 	validate(event.document));

documents.onDidClose(event => connection.sendDiagnostics({
	uri: event.document.uri,
	diagnostics: []
}));

documents.listen(connection);

connection.listen();
