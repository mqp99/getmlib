$(function() {
	var editorHTML = CodeMirror.fromTextArea($('#htmlCode')[0], {
		lineNumbers: true,
	    tabSize:5,
	    theme: 'ayu-mirage',
		mode: "text/html",
   		keyMap: "sublime",
   		lint: true,
		lineWrapping: true,
        autoCloseTags: true,
    	autoCloseBrackets: true,
	    matchTags: {bothTags: true},
		extraKeys: {
			'Ctrl-Space': 'autocomplete',
			'Ctrl-J': 'toMatchingTag'
		}
	});
	var editorCSS = CodeMirror.fromTextArea($('#cssCode')[0], {
		lineNumbers: true,
	    tabSize:5,
	    theme: 'ayu-mirage css',
		mode: "css",
   		keyMap: "sublime",
   		lint: true,
		lineWrapping: true,
    	autoCloseBrackets: true,
		extraKeys: {
			'Ctrl-Space': 'autocomplete'
		}
	});
	var editorJS = CodeMirror.fromTextArea($('#jsCode')[0], {
		lineNumbers: true,
	    tabSize:5,
	    theme: 'ayu-mirage js',
		mode: "text/javascript",
   		keyMap: "sublime",
   		readOnly: 'nocursor',
    	autoCloseBrackets: true,
		lineWrapping: true
	});
	editorHTML.on('keypress',function(){
		CodeMirror.commands.autocomplete(editorHTML);
	})
	editorCSS.on('keypress',function(){
		CodeMirror.commands.autocomplete(editorCSS);
	})
	editorHTML.on('change',function(){ showPreview();})
	editorCSS.on('change',function(){ showPreview(); })
	editorJS.setValue('/* Chưa thể sử dụng được ! */')
	//editorJS.on('change',function(){ showPreview(); })
	function showPreview(){
		var htmlValue = editorHTML.getValue();
		var cssValue = `<style>${editorCSS.getValue()}</style>`;
		//var jsValue = "<scri"+"pt>"+editorJS.getValue('s')+"</scri"+"pt>";
		var frame = $('#preview-window')[0].contentWindow.document;
		frame.open();
		frame.close();
		$('head',frame).append(cssValue);
		$('body',frame).append(htmlValue);
		//$('body',frame).append(jsValue);
	}
});