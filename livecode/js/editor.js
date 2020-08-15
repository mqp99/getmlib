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
	    theme: 'material-darker',
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
	    theme: 'material-darker css',
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
	    theme: 'material-darker js',
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
	editorCSS.on('keypress',function(){ CodeMirror.commands.autocomplete(editorCSS); })
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
		if(autoSave == true && pushNoti == true) {
			autoSaveCode();
			setPopupAlert('Đang lưu...','Đã lưu',1000);
		}
		// Get value css code
		var htmlValue = editorHTML.getValue();
		var cssValue = `<style>${editorCSS.getValue()}</style>`;
		var jsValue = "<scri"+"pt type='text/javascript'>"+editorJS.getValue()+"</scri"+"pt>";
		var frame = $('#preview-window')[0].contentWindow.document;
		frame.open();
		frame.write(cssValue,htmlValue,jsValue);
		frame.close();
	}
	/* ============================  
		+ FUNCTION AUTO SAVE CODEMIRROR
	============================  */
	$('#auto-save').on('change',function(){
		_this = $(this).attr('data-save');
		if(_this == 'false') {
			$(this).attr('data-save',true)
			autoSaveCode();
			setPopupAlert('Đang lưu...','Đã lưu',1000);
			settingPage(autoSave = true)
			//console.log('true')
		}else{
			$(this).attr('data-save',false)
			settingPage(autoSave = false)
			setPopupAlert('Đang tắt...','Đã tắt',1000);
			//console.log('false')
		}
	})
	$('#file-export').on('change',function(){
		_dataExport = $('#data-export');
		_this = $(this).val();
		_id = `${makeid(10)}-${makeid(5)}-${makeid(20)}`;
		if(_this == 'export') {
			if(getlocalStorage('renderCode') != '') {
				$(this).val('exporting');
				dataJSON = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(getlocalStorage('renderCode')));
		    	_dataExport.append(`<a href="data:${dataJSON}" download="${_id}.json">(tải xuống)</a>`);
			}else{
				$(this).prop('checked',false)
				alert('Chưa có dữ liệu để xuất, chế độ xuất chỉ sử dụng được khi lần đầu bật auto save!')
			}
		}else{
			$(this).val('export');
			_dataExport.html('');
		}
	})
	$('#open-file-import').on('change',function(){
		_this = $(this).val();
		_value = $(this).prop('files');
		_dataExport = $('#data-import');
		if(_this == 'import') {
			if(getlocalStorage('renderCode') != '') {
				$(this).val('importing');
				_dataExport.append(`<input type="file" id="file-import" value="import">`);
			}else{
				$(this).prop('checked',false)
				alert('Chế độ Import chỉ sử dụng được khi lần đầu bật auto save!')
			}
		}else{
			$(this).val('import');
			_dataExport.html('');
		}
	})
	$(document).on('change','#file-import',function(e){
		_this = e.target.files[0].name.split('.')[1].toLowerCase();
		if(_this == 'json') {
			readFile(e);
		}else{
			alert('Vui lòng chọn đúng file JSON của chúng tôi!');
		}
		
	})
	function processText(text) {
		response = JSON.parse(text);
		obj = Object.keys(response);
		if(obj[0] == 'html' && obj[1] == 'css' && obj[2] == 'js') {
			setlocalStorage('renderCode',response);
			editorHTML.setValue(response.html);
			editorCSS.setValue(response.css);
			editorJS.setValue(response.js);
			$('#open-file-import').val('import').prop('checked',false);
			$('#data-import').html('');
		}else{
			alert('Xin lỗi, có vẻ file JSON bạn chọn không phải định dạng của chúng tôi!')
		}
	}
	function readFile(evt) {
	    var files = evt.target.files;
	    if (files == null || files.length == 0) return;
	    var file = files[0];
	    var reader = new FileReader();
	    reader.onload = (function (theFile) {
		    return function (e) {
		        processText(e.target.result);
		    };
	    })(file);
	    reader.readAsText(file);
	}
	function settingPage(autoSave = autoSaveGET) {
		var obj = {
			'autoSave': autoSave,
			'autoFormat': false,
		}
		setlocalStorage('settingPage',obj);
	}
	function autoSaveCode(html,css,js,pushNoti) {
		var html = editorHTML.getValue();
		var css = editorCSS.getValue();
		var js = editorJS.getValue();
		var obj = {
			'html': html,
			'css': css,
			'js': js,
		}
		setlocalStorage('renderCode',obj);
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
	function setPopupAlert(textWait,textSuccess,time) {
		// Clear time out alert
		clearTimeout(times);
		// Set time out alert
		$('#popup-alert').html(textWait).addClass('alert');
		times = setTimeout(()=>{ $('#popup-alert').html(textSuccess); },time);
		times = setTimeout(()=>{ $('#popup-alert').removeClass('alert'); },time + 500);
	}
	function makeid(length) {
	   	var result           = '';
	   	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	   	var charactersLength = characters.length;
	   	for ( var i = 0; i < length; i++ ) {
	    	result += characters.charAt(Math.floor(Math.random() * charactersLength));
	   }
	   return result;
	}
});