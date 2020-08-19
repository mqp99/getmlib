$(function() {
	var renderCodeGET = (storageGET('renderCode') != null) ? storageGET('renderCode') 	: [];
	(renderCodeGET == '') ? storageSET('renderCode',{'html':'','css':'','js':''}) 	: [] ;
	var settingPageGET = (storageGET('settingPage') != null) ? storageGET('settingPage') : [];
	var autoSaveGET 	= (settingPageGET != '') ? JSON.parse(settingPageGET.autoSave) : false;
	var languageGET 	= (settingPageGET != '') ? settingPageGET.language : 'en_us';
	var useLibraryJSGET = (settingPageGET != '') ? JSON.parse(settingPageGET.useLibraryJS) : false;
	var __ID__popupAlert 	 = $('#popup-alert'),
		__ID__dataImport 	 = $('#data-import'),
		__ID__dataExport 	 = $('#data-export');
		__ID__autoSave 	 	 = $('#auto-save');
		__ID__openDataImport = $('#open-file-import');
	var times,alertTime,autoSave = autoSaveGET, pushNoti = true;
/* ============================ DICTIONARY TRANSLATOR ============================  */
	var dictionary = {
		'vi_vn': {
			processing: '<label>Đang lưu &nbsp;</label><i class="fal fa-spin fa-spinner-third"></i>',
			processed: '<label>Đã lưu &nbsp;</label><i class="fal fa-check"></i>',
			status: '<label data-translate="_status">Trạng thái</label>',
			autosaveEnable: 'Phải bật auto save và có nội dung!',
			tryagain: 'Vui lòng thử lại!',
			jsonincorrect: 'Vui lòng sử dụng đúng tệp JSON!',
			jsonnotallow: 'JSON này không phải của chúng tôi!',
		},
		'en_us': {
			processing: '<label>Code saving &nbsp;</label><i class="fal fa-spin fa-spinner-third"></i>',
			processed: '<label>Code saved &nbsp;</label><i class="fal fa-check"></i>',
			status: '<label data-translate="_status">Status</label>',
			autosaveEnable: 'Turn on auto save and have code!',
			tryagain: 'Please try again!',
			jsonincorrect: 'Please use correct file JSON!',
			jsonnotallow: 'This JSON is not allow!',
		}
	}
/* ============================ CODEMIRROR ============================  */
	var editorHTML = CodeMirror.fromTextArea($('#htmlCode')[0], {
		lineNumbers: true,
	    tabSize:5,
	    indentUnit: 3,
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
			'Ctrl-J': 'toMatchingTag',
			"Shift-F": autoFormatSelectionHTML
		}
	});
	var editorCSS = CodeMirror.fromTextArea($('#cssCode')[0], {
		lineNumbers: true,
	    tabSize:5,
	    indentUnit: 4,
		mode: "css",
   		keyMap: "sublime",
   		profile: 'css',
	    theme: 'material-darker css',
		lineWrapping: true,
    	autoCloseBrackets: true,
		extraKeys: {
			'Ctrl-Space': 'autocomplete',
			"Shift-F": autoFormatSelectionCSS
		}
	});
	var editorJS = CodeMirror.fromTextArea($('#jsCode')[0], {
		lineNumbers: true,
	    tabSize:5,
	    indentUnit: 3,
   		keyMap: "sublime",
	    theme: 'material-darker js',
		mode: "text/javascript",
   		lint: true,
   		//readOnly: 'nocursor',
    	autoCloseBrackets: true,
		lineWrapping: true
	});
/* ============================ EMMET ENABLED ============================  */
	emmetCodeMirror(editorHTML);
	emmetCodeMirror(editorCSS);
/* ============================ AUTO COMPLETE ON KEY [Ctrl + Space] ============================  */
	function getSelectedRangeHTML() {
	   return { from: editorHTML.getCursor(true), to: editorHTML.getCursor(false) };
	}
	function autoFormatSelectionHTML() {
   		var range = getSelectedRangeHTML();
    	editorHTML.autoFormatRange(range.from, range.to);
	}
	function getSelectedRangeCSS() {
        return { from: editorCSS.getCursor(true), to: editorCSS.getCursor(false) };
	}
	function autoFormatSelectionCSS() {
   		var range = getSelectedRangeCSS();
    	editorCSS.autoFormatRange(range.from, range.to);
	}
/* ============================ SET VALUE STORAGE FIRST ============================  */
	settingPage();
/* ============================ SET TIME OUT SHOW RESULT PREVIEW FIRST ============================  */
	timeoutShowPreview(0,autoSave,!pushNoti);
/* ============================ CHECK AUTO SAVE TURN ON ============================  */
	if(autoSave == true) {
		__ID__autoSave.attr('data-save',true);
		__ID__autoSave.attr('checked',true);
		if(renderCodeGET != '') {
			editorHTML.setValue(renderCodeGET.html);
			editorCSS.setValue(renderCodeGET.css);
			editorJS.setValue(renderCodeGET.js);
		}
	}
/* ============================ AUTO COMPLETE HTML, CSS, JS ============================  */
	editorHTML.on('keypress',function(){ /*	CodeMirror.commands.autocomplete(editorHTML); */ })
	editorCSS.on('keypress',function(){ CodeMirror.commands.autocomplete(editorCSS); })
	editorJS.on('keypress',function(){  CodeMirror.commands.autocomplete(editorJS); })
/* ============================ EVENT CHANGE CODEMIRROR ============================  */
	editorHTML.on('change',function(){ timeoutShowPreview(1000,autoSave,pushNoti); })
	editorCSS.on('change',function(){ timeoutShowPreview(1000,autoSave,pushNoti); })
	editorJS.on('change',function(){ timeoutShowPreview(1000,autoSave,pushNoti); })
/* ============================ FUNCTION TIME OUT SHOW RESULT PREVIEW ============================  */
	function timeoutShowPreview(time,autoSave,pushNoti) {
		clearTimeout(times);
		times = setTimeout(()=>{ showPreview(autoSave,pushNoti); },time);
	}
/* ============================ FUNCTION SHOW RESULT PREVIEW ============================  */
	function showPreview(autoSave,pushNoti){
		var htmlValue = editorHTML.getValue();
		var cssValue = `<style type="text/css">${editorCSS.getValue()}</style>`;
		var jsValue = `<script type=\"text/javascript\">${editorJS.getValue()}</script>`;
		var frame = $('#preview-window').contents()[0];
		frame.open();
		frame.write(cssValue,htmlValue,jsValue);
		frame.close();
		if(autoSave == true && pushNoti == true) {
			autoSaveCode();
			alertProcessing(1000);
		}
	}
/* ============================ FUNCTION DOCUMENT ============================  */
	$(document).on('click','#format-html',function(){
		$(this).html('Formated');
		setTimeout(()=>{$(this).html('Format');},1000);
	    var totalLines = editorHTML.lineCount();
	    var totalChars = editorHTML.getValue().length;
	    editorHTML.autoFormatRange({line:0, ch:0}, {line:totalLines, ch:totalChars});
	})
	$(document).on('click','#format-css',function(){
		$(this).html('Formated');
		setTimeout(()=>{$(this).html('Format');},1000);
	    var totalLines = editorCSS.lineCount();
	    var totalChars = editorCSS.getValue().length;
	    editorCSS.autoFormatRange({line:0, ch:0}, {line:totalLines, ch:totalChars});
	})
	$(document).on('change','#auto-save',function(){
		if($.attr(this,'data-save') == 'false') {
			$.attr(this,'data-save',true)
			autoSaveCode();
			alertProcessing(1000);
			settingPage(autoSave = true)
			// SAVE TRUE
		}else{
			$.attr(this,'data-save',false);
			settingPage(autoSave = false);
		}
	})
	$(document).on('change','#use-library',function(){
		if($.attr(this,'data-lib') == 'jquery') {
			$.attr(this,'data-lib','use-jquery'); // Using Jquery...
		}else{
			$.attr(this,'data-lib','jquery'); // Not Using Jquery...
		}
	})
	$(document).on('change','#file-export',function(){
		let _this 		= $(this); //___SET this___
		let _vthis 		= _this.val(); //___SET VALUE this___
		let _idRandom 	= `${createRandom(10)}-${createRandom(5)}-${createRandom(20)}`; //___RANDOM ID download___
		let _objRender	= Object.values(storageGET('renderCode')); //___GET STORAGE('rendercode')___
		//___CHECK VALUE EXPORT HAVE null ?___
		if(_vthis == 'export') {
			if(	_objRender[0].trim() != '' ||
				_objRender[1].trim() != '' || 	
				_objRender[2].trim() != '') {
				//___SET value == exporting___
				_this.val('exporting');
				//___CREATED DATA JSON___
				dataJSON = `text/json;charset=utf-8, ${encodeURIComponent(JSON.stringify(storageGET('renderCode')))}`;
				//___CREATED <a> AND SET VALUE___
		    	__ID__dataExport.append(` <a 	href="data:${dataJSON}" download="${_idRandom}.json"> (tải xuống) </a>` );
			}else{
				//___IF VALUE EXPORT == NULL BLOCK [CHECKED]___
				$.prop(this,'checked',false);
				//___PUSH NOTIFI___
				alertNoti(
					dictionary[storageGET('settingPage').language].autosaveEnable,
					dictionary[storageGET('settingPage').language].tryagain, 3000
				);
			}
		}else{
			//___EXPORT DONE SET value == export___
			_this.val('export');
			//___EXPORT DONE SET html == null___
			__ID__dataExport.html('');
		}
	})
	$(document).on('change','#open-file-import',function(){
		let _this 	= $(this); //___SET this___
		let _vthis 	= _this.val(); //___SET VALUE this___
		//___CHECK value == import___
		if(_vthis == 'import') {
			//___GET STORAGE('rendercode') IF NOT NULL___
			if(storageGET('renderCode') != '') {
				//___SET VALUE this == importing___
				_this.val('importing');
				//___CREATED <input /> in #data-import___
				__ID__dataImport.append(`<input type="file" id="file-import" value="import">`);
			}
		}else{
			//___SET value this == import___
			_this.val('import');
			//___SET html #data-import == null___
			__ID__dataImport.html('');
		}
	})
	$(document).on('change','#file-import',function(e){
		//___GET extendtion FILE IMPORT (.json)___
		_this = e.target.files[0].name.split('.')[1].toLowerCase();
		//___IF extendtion != json___
		if(_this != 'json') {
			//___PUSH NOTIFI___
			alertNoti(
				dictionary[storageGET('settingPage').language].jsonincorrect,
				dictionary[storageGET('settingPage').language].tryagain,3000
			);
		}else{
			//___READ FILE form function readFile()___
			return readFile(e);
		}
	})
/* ============================ FUNCTION READ FILE && CONTENT ============================  */
	function readFile(evt) {
	    var files = evt.target.files;
	    if (files == null || files.length == 0) return;
	    var file = files[0];
	    var reader = new FileReader();
	    reader.onload = (function (theFile) {
	    	//___RETURN CONTENT to readFileContent()___
		    return function (e) { readFileContent(e.target.result); };
	    })(file);
	    reader.readAsText(file);
	}
	function readFileContent(text) {
		//___GET RESULT FORM readFile()___
		var response = JSON.parse(text);
		//___GET KEY FORM RESPONSE___
		var objKeys  = Object.keys(response);
		//___IF KEY == html,css,js___
		if(objKeys[0] == 'html' && objKeys[1] == 'css' && objKeys[2] == 'js') {
			//___SET STORAGE html,css,js___
			storageSET('renderCode',response);
			//___SET VALUE EDITOR html,css,js___
			editorHTML.setValue(response.html);
			editorCSS.setValue(response.css);
			editorJS.setValue(response.js);
			//___SET VALUE BUTTON OPEN AND TURN OFF BUTTON___
			__ID__openDataImport.val('import').prop('checked',false);
			//___SET VALUE INPUT == NULL___
			__ID__dataImport.html('');
			//___SET VALUE STORAGE AUTOSAVE == TRUE___
			settingPage(autoSave = true);
			//___SET VALUE AUTOSAVE == TRUE AND TURN ON BUTTON___
			__ID__autoSave.attr('data-save',true).prop('checked',true);
		}else{
			//___PUSH NOTIFI___
			alertNoti(
				dictionary[storageGET('settingPage').language].jsonnotallow,
				dictionary[storageGET('settingPage').language].tryagain,3000);
		}
	}
/* ============================ FUNCTION SETTING PAGE ============================  */
	function settingPage(autoSave = autoSaveGET,useLibraryJS = useLibraryJSGET,language = languageGET) {
		//___CREATED obj SETTING___
		var objSetting = {
			'autoSave': autoSave,
			'useLibraryJS': useLibraryJSGET,
			'language': languageGET
		}
		//___SET STORAGE SETTING___
		storageSET('settingPage',objSetting);
	}
/* ============================ FUNCTION AUTO SAVE CODEMIRROR ============================  */
	function autoSaveCode(html,css,js,pushNoti) {
		//___GET VALUE html,css,js ON change___
		var html = editorHTML.getValue();
		var css = editorCSS.getValue();
		var js = editorJS.getValue();
		//___CREATED obj save___
		var objSave = {
			'html': html,
			'css': css,
			'js': js,
		}
		//___SET STORAGE RENDERCODE___
		storageSET('renderCode',objSave);
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
		alertTime = setTimeout(()=>{ $('.menu-right .alert-processing').html(dictionary[storageGET('settingPage').language].processing); },time);
		alertTime = setTimeout(()=>{ $('.menu-right .alert-processing').html(dictionary[storageGET('settingPage').language].processed); },time + 1000);
		alertTime = setTimeout(()=>{ $('.menu-right .alert-processing').html(dictionary[storageGET('settingPage').language].status); },time + 2000);
	}
	function alertNoti(textWait,textSuccess,time) {
		// Clear time out alert
		clearTimeout(times);
		// Set time out alert
		__ID__popupAlert.html(textWait).addClass('alert');
		times = setTimeout(()=>{ __ID__popupAlert.html(textSuccess); },time);
		times = setTimeout(()=>{ __ID__popupAlert.removeClass('alert'); },time + 1000);
	}
	function createRandom(length) {
	   	var result           = '';
	   	var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	   	var charactersLength = characters.length;
	   	for ( var i = 0; i < length; i++ ) {
	    	result += characters.charAt(Math.floor(Math.random() * charactersLength));
	   }
	   return result;
	}
});