$(function() {
	var settingPageGET = (getlocalStorage('settingPage') != null) ? getlocalStorage('settingPage') : [];
	var renderCodeGET = (getlocalStorage('renderCode') != null) ? getlocalStorage('renderCode') : [];
	autoSaveGET = (settingPageGET != '') ? JSON.parse(settingPageGET.autoSave) : false;
	autoFormatGET = (settingPageGET != '') ? JSON.parse(settingPageGET.autoFormat) : false;
	var times,autoSave = autoSaveGET, pushNoti = true;
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
	settingPage();
	console.log(autoSaveGET);
	timeoutShowPreview(0,autoSave,!pushNoti);
	if(autoSave == true) {
		$('#auto-save').attr('data-save',true).attr('checked',true);
		if(renderCodeGET != '') {
			editorHTML.setValue(renderCodeGET.html);
			editorCSS.setValue(renderCodeGET.css);
			editorJS.setValue(renderCodeGET.js);
		}
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
	editorHTML.on('change',function(){ timeoutShowPreview(1500,autoSave,pushNoti) })
	editorCSS.on('change',function(){ timeoutShowPreview(1500,autoSave,pushNoti) })
	editorJS.on('change',function(){ timeoutShowPreview(1500,autoSave,pushNoti) })
	/* ============================  
		+ FUNCTION CHANGE CODEMIRROR
	============================  */
	function timeoutShowPreview(time,autoSave,pushNoti) {
		// Clear time out inner Preview if change
		clearTimeout(times);
		times = setTimeout(()=>{ showPreview(autoSave,pushNoti); },time);
	}
	function showPreview(autoSave,pushNoti){
		// if autoSave = true
		var html = editorHTML.getValue();
		var css = editorCSS.getValue();
		var js = editorJS.getValue();
		if(autoSave == true && pushNoti == true) {
			autoSaveCode(html,css,js);
			setPopupAlert(1000);
		}
		// Get value css code
		var cssValue = `<style>${css}</style>`;
		var jsValue = "<scri"+"pt type='text/javascript'>"+js+"</scri"+"pt>";
		var frame = $('#preview-window')[0].contentWindow.document;
		frame.open();
		frame.write(html,jsValue);
		$('head',frame).append(cssValue);
		frame.close();
	}
	/* ============================  
		+ FUNCTION AUTO SAVE CODEMIRROR
	============================  */
	$('#auto-save').on('change',function(){
		_this = $(this).attr('data-save');
		if(_this == 'false') {
			$(this).attr('data-save',true)
			settingPage(autoSave = true)
			console.log('true')
		}else{
			$(this).attr('data-save',false)
			settingPage(autoSave = false)
			console.log('false')
		}
	})
	function autoSaveCode(html,css,js,pushNoti) {
		var obj = {
			'html': html,
			'css': css,
			'js': js,
		}
		setlocalStorage('renderCode',obj);
	}
	function settingPage(autoSave = autoSaveGET) {
		var obj = {
			'autoSave': autoSave,
			'autoFormat': false,
		}
		setlocalStorage('settingPage',obj);
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