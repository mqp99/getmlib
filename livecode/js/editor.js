$(function() {
	var settingPageGET = (storageGET('settingPage') != null) ? storageGET('settingPage') : [];
	var renderCodeGET = (storageGET('renderCode') != null) ? storageGET('renderCode') : [];
	var autoSaveGET = (settingPageGET != '') ? JSON.parse(settingPageGET.autoSave) : false;
	var autoFormatGET = (settingPageGET != '') ? JSON.parse(settingPageGET.autoFormat) : false;
	var useLibraryJSGET = (settingPageGET != '') ? JSON.parse(settingPageGET.useLibraryJS) : false;
	var popupAlert__ID = $('#popup-alert'),dataImport__ID = $('#data-import'),openDataImport__ID = $('#open-file-import'),dataExport__ID = $('#data-export');
	var times,alertTime,autoSave = autoSaveGET, pushNoti = true;
	var editorHTML = CodeMirror.fromTextArea($('#htmlCode')[0], {
		lineNumbers: true,
	    tabSize:5,
		mode: "text/xml",
   		keyMap: "sublime",
   		profile: 'xhtml',
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
   		profile: 'css',
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
	emmetCodeMirror(editorHTML);
	emmetCodeMirror(editorCSS);
	/* ============================ SET VALUE CODEMIRROR BEFORE LOAD ============================  */
	settingPage();
	alertProcessing(0);
	timeoutShowPreview(0,autoSave,!pushNoti);
	if(autoSave == true) {
		$('#auto-save').attr('data-save',true).attr('checked',true);
		if(renderCodeGET != '') {
			editorHTML.setValue(renderCodeGET.html);
			editorCSS.setValue(renderCodeGET.css);
			editorJS.setValue(renderCodeGET.js);
		}
	}
	/* ============================  Auto complete HTML, CSS, JS ============================  */
	editorHTML.on('keypress',function(){ /*	CodeMirror.commands.autocomplete(editorHTML); */ })
	editorCSS.on('keypress',function(){ CodeMirror.commands.autocomplete(editorCSS); })
	editorJS.on('keypress',function(){  CodeMirror.commands.autocomplete(editorJS); })
	/* ============================   EVENT CHANGE CODEMIRROR ============================  */
	editorHTML.on('change',function(){ timeoutShowPreview(1500,autoSave,pushNoti);alertProcessing(1000); })
	editorCSS.on('change',function(){ timeoutShowPreview(1500,autoSave,pushNoti);alertProcessing(1000); })
	editorJS.on('change',function(){ timeoutShowPreview(1500,autoSave,pushNoti);alertProcessing(1000); })
	/* ============================ FUNCTION CHANGE CODEMIRROR ============================  */
	function timeoutShowPreview(time,autoSave,pushNoti) {
		// Clear time out inner Preview if change
		
		clearTimeout(times);
		times = setTimeout(()=>{ showPreview(autoSave,pushNoti); },time);
	}
	function showPreview(autoSave,pushNoti){
		// if autoSave = true
		if(autoSave == true && pushNoti == true) {
			autoSaveCode();
		}
		// Get value css code
		var htmlValue = editorHTML.getValue();
		var cssValue = `<style>${editorCSS.getValue()}</style>`;
		var jsValue = `<script type=\"text/javascript\">${editorJS.getValue()}</script>`;
		var frame = $('#preview-window')[0].contentWindow.document;
		frame.open();
		frame.write(cssValue,htmlValue,jsValue);
		//$('head',frame).append(`<script src=\"https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js\"></script>`);
		//setTimeout(()=>{$('body',frame).append()},500);
		frame.close();;
	}
	$(document).on('change','#auto-save',function(){
		_this = $(this).attr('data-save');
		if(_this == 'false') {
			$(this).attr('data-save',true)
			autoSaveCode();
			alertProcessing(1000);
			settingPage(autoSave = true)
			//console.log('true')
		}else{
			$(this).attr('data-save',false)
			settingPage(autoSave = false)
			// alertPopup('Đang tắt...','Đã tắt',1000);
			//console.log('false')
		}
	})
	/* ============================ MORE ============================  */
	$(document).on('change','#use-library',function(){
		_this = $(this).attr('data-lib');
		if(_this == 'jquery') {
			console.log('use')
			$(this).attr('data-lib','use-jquery')
		}else{
			console.log('not use')
			$(this).attr('data-lib','jquery')
		}
	})
	$(document).on('change','#file-export',function(){
		_this = $(this).val();
		_id = `${createRandom(10)}-${createRandom(5)}-${createRandom(20)}`;
		if(_this == 'export') {
			if(storageGET('renderCode') != '') {
				$(this).val('exporting');
				dataJSON = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(storageGET('renderCode')));
		    	dataExport__ID.append(`<a href="data:${dataJSON}" download="${_id}.json">(tải xuống)</a>`);
			}else{
				$(this).prop('checked',false)
				alertPopup('Chưa có dữ liệu để xuất, chế độ xuất chỉ sử dụng được khi lần đầu bật auto save!','Sorry...!',5000);
			}
		}else{
			$(this).val('export');
			dataExport__ID.html('');
		}
	})
	$(document).on('change','#open-file-import',function(){
		_this = $(this).val();
		_value = $(this).prop('files');
		if(_this == 'import') {
			if(storageGET('renderCode') != '') {
				$(this).val('importing');
				dataImport__ID.append(`<input type="file" id="file-import" value="import">`);
			}else{
				$(this).prop('checked',false);
				alertPopup('Chế độ Import chỉ sử dụng được khi lần đầu bật auto save!','Sorry...!',5000);
			}
		}else{
			$(this).val('import');
			dataImport__ID.html('');
		}
	})
	$(document).on('change','#file-import',function(e){
		_this = e.target.files[0].name.split('.')[1].toLowerCase();
		return (_this == 'json') ? readFile(e) : alertPopup('Vui lòng chọn đúng file JSON của chúng tôi!','Sorry...!',5000);
	})
	/* ============================ FUNCTION READ FILE && CONTENT ============================  */
	function readFile(evt) {
	    var files = evt.target.files;
	    if (files == null || files.length == 0) return;
	    var file = files[0];
	    var reader = new FileReader();
	    reader.onload = (function (theFile) {
		    return function (e) {
		        readFileContent(e.target.result);
		    };
	    })(file);
	    reader.readAsText(file);
	}
	function readFileContent(text) {
		var response = JSON.parse(text);
		var obj = Object.keys(response);
		if(obj[0] == 'html' && obj[1] == 'css' && obj[2] == 'js') {
			storageSET('renderCode',response);
			editorHTML.setValue(response.html);
			editorCSS.setValue(response.css);
			editorJS.setValue(response.js);
			openDataImport__ID.val('import').prop('checked',false);
			dataImport__ID.html('');
		}else{
			alertPopup('Không phải file chúng tôi!','Sorry...!',2000);
		}
	}
	/* ============================ FUNCTION SETTING PAGE ============================  */
	function settingPage(autoSave = autoSaveGET,useLibraryJS = useLibraryJSGET) {
		var obj = {
			'autoSave': autoSave,
			'autoFormat': false,
			'useLibraryJS': useLibraryJSGET
		}
		storageSET('settingPage',obj);
	}
	/* ============================ FUNCTION AUTO SAVE CODEMIRROR ============================  */
	function autoSaveCode(html,css,js,pushNoti) {
		var html = editorHTML.getValue();
		var css = editorCSS.getValue();
		var js = editorJS.getValue();
		var obj = {
			'html': html,
			'css': css,
			'js': js,
		}
		storageSET('renderCode',obj);
	}
	/* ============================ FUNCTION LOCALSTORAGE ============================  */
	function storageSET(key,value) {
		localStorage.setItem(key,JSON.stringify(value));
	}
	function storageGET(key) {
		var getStorage = JSON.parse(localStorage.getItem(key));
		return getStorage = (getStorage) ? getStorage : [];
	}
	function storageUPDATE() {
		console.log('storageUPDATE')
	}
	/* ============================ FUNCTION SUPPORT ============================  */
	function alertProcessing(time) {
		clearTimeout(alertTime);
		alertTime = setTimeout(()=>{
			$('.menu-right .alert-processing').html('<label>Processing preview...</label>');
		},time);
		alertTime = setTimeout(()=>{
			$('.menu-right .alert-processing').html('<label>Processed preview</label>');
		},time + 1000);
		alertTime = setTimeout(()=>{
			$('.menu-right .alert-processing').html('<label>Status</label>');
		},time + 2000);
	}
	alertPopup = (textWait,textSuccess,time) => {
		// Clear time out alert
		clearTimeout(times);
		// Set time out alert
		popupAlert__ID.html(textWait).addClass('alert');
		times = setTimeout(()=>{ popupAlert__ID.html(textSuccess); },time);
		times = setTimeout(()=>{ popupAlert__ID.removeClass('alert'); },time + 1000);
	}
	createRandom = (length) => {
	   	var result           = '';
	   	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	   	var charactersLength = characters.length;
	   	for ( var i = 0; i < length; i++ ) {
	    	result += characters.charAt(Math.floor(Math.random() * charactersLength));
	   }
	   return result;
	}
});