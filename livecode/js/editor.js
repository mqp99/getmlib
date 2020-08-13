$(function() {
	var editorHTML = CodeMirror.fromTextArea($('#htmlCode')[0], {
		lineNumbers: true,
	    tabSize:5,
	    theme: 'ayu-mirage',
		name: "htmlmixed",
		lineWrapping: true,
	});
	var editorCSS = CodeMirror.fromTextArea($('#cssCode')[0], {
		lineNumbers: true,
	    tabSize:5,
	    theme: 'ayu-mirage css',
		mode: "text/css",
		lineWrapping: true,
	});
	var editorJS = CodeMirror.fromTextArea($('#jsCode')[0], {
		lineNumbers: true,
	    tabSize:5,
	    theme: 'ayu-mirage js',
		mode: "text/javascript",
		lineWrapping: true,
	});
	editorHTML.on('change',function(){ showPreview(); })
	editorCSS.on('change',function(){ showPreview(); })
	editorJS.on('change',function(){ showPreview(); })
	function showPreview(){
		var htmlValue = editorHTML.getValue();
		var cssValue = `<style>${editorCSS.getValue()}</style>`;
		var jsValue = '<scri'+'pt>'+editorJS.getValue()+'</scri'+'pt>';
		var frame = $('#preview-window')[0].contentWindow.document;
		frame.open();
		frame.write(htmlValue,cssValue,jsValue);
		frame.close();
	}
});