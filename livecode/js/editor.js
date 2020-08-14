$(function() {
	var times,autoSave = true;
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
		+ CALL FUNCTION
	============================  */
	timeoutShowPreview(0,autoSave,pushNoti = false);
	/* ============================ 
		+ SET VALUE CODEMIRROR BEFORE LOAD
	============================  */
	if(autoSave == true) {
		setTimeout(()=>{
			renderCode = getlocalStorage('renderCode');
			editorHTML.setValue(renderCode.html);
			editorCSS.setValue(renderCode.css);
			editorJS.setValue(renderCode.js);
		},100);
	}
	/* ============================ 
		+ Auto complete HTML, CSS, JS
	============================  */
	editorHTML.on('keypress',function(){ /*	CodeMirror.commands.autocomplete(editorHTML); */ })
	editorCSS.on('keypress',function(){ /* CodeMirror.commands.autocomplete(editorCSS); */ })
	editorJS.on('keypress',function(){  CodeMirror.commands.autocomplete(editorJS); })
	/* ============================  
		+ EVENT CHANGE CODEMIRROR
	============================  */
	editorHTML.on('change',function(){ timeoutShowPreview(1500,autoSave) })
	editorCSS.on('change',function(){ timeoutShowPreview(1500,autoSave) })
	editorJS.on('change',function(){ timeoutShowPreview(1500,autoSave) })
	/* ============================  
		+ FUNCTION CHANGE CODEMIRROR
	============================  */
	function timeoutShowPreview(time,autoSave,pushNoti = true) {
		// Clear time out inner Preview if change
		clearTimeout(times);
		times = setTimeout(()=>{ showPreview(autoSave,pushNoti); },time) 
	}
	function showPreview(autoSave,pushNoti){
		// if autoSave = true
		if(autoSave == true) {
			autoSaveCode(editorHTML.getValue(),editorCSS.getValue(),editorJS.getValue(),pushNoti);
		}
		// Get value html code
		var htmlValue = editorHTML.getValue();
		// Get value css code
		var cssValue = `<style>${editorCSS.getValue()}</style>`;
		// Get value js code
		var jsValue = "<scri"+"pt type='text/javascript'>"+editorJS.getValue()+"</scri"+"pt>";
		var frame = $('#preview-window')[0].contentWindow.document;
		frame.open();
		frame.write(htmlValue,jsValue);
		$('head',frame).append(cssValue);
		frame.close();
	}
	/* ============================  
		+ FUNCTION AUTO SAVE CODEMIRROR
	============================  */
	function autoSaveCode(html,css,js,pushNoti) {
		setlocalStorage('renderCode',{'html': html,'css':css,'js':js});
		if(pushNoti) {
			setPopupAlert(1000);
		}
	}
	/* ============================  
		+ FUNCTION LOCALSTORAGE
	============================  */
	function setlocalStorage(key,value) {
		localStorage.setItem(key,JSON.stringify(value));
	}
	function getlocalStorage(key) {
		var getStorage = JSON.parse(localStorage.getItem(key));
		return getStorage = (getStorage) ? getStorage : [];
	}
	function updateJSONlocalStorage() {
		console.log('updateJSONlocalStorage')
	}
	/* ============================  
		+ FUNCTION SUPPORT
	============================  */
	function setPopupAlert(time) {
		// Clear time out alert
		clearTimeout(times);
		// Set time out alert
		$('#popup-alert').html('Đang lưu...').addClass('alert');
		times = setTimeout(()=>{ $('#popup-alert').html('Đã lưu'); },time);
		times = setTimeout(()=>{ $('#popup-alert').removeClass('alert'); },time + 500);
	}
});