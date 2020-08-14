$(function() {
	var times;
	var editorHTML = CodeMirror.fromTextArea($('#htmlCode')[0], {
		lineNumbers: true,
	    tabSize:5,
		mode: "text/html",
   		keyMap: "sublime",
	    theme: 'ayu-mirage',
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
		mode: "css",
   		keyMap: "sublime",
	    theme: 'ayu-mirage css',
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
   		keyMap: "sublime",
	    theme: 'ayu-mirage js',
		mode: "text/javascript",
   		lint: true,
   		//readOnly: 'nocursor',
    	autoCloseBrackets: true,
		lineWrapping: true
	});
	/* ============================ 
		+ SET VALUE CODEMIRROR BEFORE LOAD
	============================  */
	var valueDOMHTML = "<!-- HTML here --> \n";
	var valueDOMCSS = "/* CSS here */ \n";
	var valueDOMJS = "/* JS here */ \n";
	editorHTML.setValue(valueDOMHTML);
	editorCSS.setValue(valueDOMCSS);
	editorJS.setValue(valueDOMJS);
	/* ============================ 
		+ Auto complete HTML, CSS, JS
	============================  */
	editorHTML.on('keypress',function(){ /*	CodeMirror.commands.autocomplete(editorHTML); */ })
	editorCSS.on('keypress',function(){ /* CodeMirror.commands.autocomplete(editorCSS); */ })
	editorJS.on('keypress',function(){  CodeMirror.commands.autocomplete(editorJS); })
	/* ============================  
		+ EVENT CHANGE CODEMIRROR
	============================  */
	editorHTML.on('change',function(){ timeoutShowPreview(2000) })
	editorCSS.on('change',function(){ timeoutShowPreview(2000) })
	editorJS.on('change',function(){ timeoutShowPreview(2000) })
	/* ============================  
		+ FUNCTION CHANGE CODEMIRROR
	============================  */
	function timeoutShowPreview(time) {
		// Clear time out inner Preview if change
		clearTimeout(times);
		// Set time out inner Preview
		times = setTimeout(()=>{ showPreview(); },time) 
	}
	function showPreview(){
		var htmlValue = editorHTML.getValue();
		var cssValue = `<style>${editorCSS.getValue()}</style>`;
		var jsValue = "<scri"+"pt type='text/javascript'>"+editorJS.getValue()+"</scri"+"pt>";
		var frame = $('#preview-window')[0].contentWindow.document;
		frame.open();
		frame.write(htmlValue,jsValue);
		$('head',frame).append(cssValue);
		frame.close();
	}
});