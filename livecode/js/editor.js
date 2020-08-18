$(function() {
	var renderCodeGET = (storageGET('renderCode') != null) ? storageGET('renderCode') : [];
	var settingPageGET = (storageGET('settingPage') != null) ? storageGET('settingPage') : [];
	var autoSaveGET = (settingPageGET != '') ? JSON.parse(settingPageGET.autoSave) : false;
	var useLibraryJSGET = (settingPageGET != '') ? JSON.parse(settingPageGET.useLibraryJS) : false;
	var languageGET = (settingPageGET != '') ? settingPageGET.language : 'en_us';
	var popupAlert__ID = $('#popup-alert'),dataImport__ID = $('#data-import'),openDataImport__ID = $('#open-file-import'),dataExport__ID = $('#data-export');
	var times,alertTime,autoSave = autoSaveGET, pushNoti = true;
	(renderCodeGET == '') ? storageSET('renderCode',{'html':'','css':'','js':''}) : [] ;
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
	emmetCodeMirror(editorHTML);
	emmetCodeMirror(editorCSS);
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
	/* ============================ SET VALUE CODEMIRROR BEFORE LOAD ============================  */
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
	/* ============================  Auto complete HTML, CSS, JS ============================  */
	editorHTML.on('keypress',function(){ /*	CodeMirror.commands.autocomplete(editorHTML); */ })
	editorCSS.on('keypress',function(){ CodeMirror.commands.autocomplete(editorCSS); })
	editorJS.on('keypress',function(){  CodeMirror.commands.autocomplete(editorJS); })
	/* ============================   EVENT CHANGE CODEMIRROR ============================  */
	editorHTML.on('change',function(){ timeoutShowPreview(1000,autoSave,pushNoti); })
	editorCSS.on('change',function(){ timeoutShowPreview(1000,autoSave,pushNoti); })
	editorJS.on('change',function(){ timeoutShowPreview(1000,autoSave,pushNoti); })
	/* ============================ FUNCTION CHANGE CODEMIRROR ============================  */
	function timeoutShowPreview(time,autoSave,pushNoti) {
		clearTimeout(times);
		times = setTimeout(()=>{ showPreview(autoSave,pushNoti); },time);
	}
	function showPreview(autoSave,pushNoti){
		if(autoSave == true && pushNoti == true) {
			autoSaveCode();
			alertProcessing(1000);
		}
		var htmlValue = editorHTML.getValue();
		var cssValue = `<style type="text/css">${editorCSS.getValue()}</style>`;
		var jsValue = `<script type=\"text/javascript\">${editorJS.getValue()}</script>`;
		var frame = $('#preview-window').contents()[0];
		frame.open();
		frame.write(cssValue,htmlValue,jsValue);
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
			$(this).attr('data-save',false);
			settingPage(autoSave = false);
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
		let obj = Object.values(storageGET('renderCode'));
		if(_this == 'export') {
			if(obj[0].trim() != '' || obj[1].trim() != '' || obj[2].trim() != '') {
				$(this).val('exporting');
				dataJSON = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(storageGET('renderCode')));
		    	dataExport__ID.append(`<a href="data:${dataJSON}" download="${_id}.json">(tải xuống)</a>`);
			}else{
				$(this).prop('checked',false);
				alertPopup(
					dictionary[storageGET('settingPage').language].autosaveEnable,
					dictionary[storageGET('settingPage').language].tryagain,3000);
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
				$('#data-import').append(`<input type="file" id="file-import" value="import">`);
			}
		}else{
			$(this).val('import');
			dataImport__ID.html('');
		}
	})
	$(document).on('change','#file-import',function(e){
		_this = e.target.files[0].name.split('.')[1].toLowerCase();
		return (_this == 'json') ? readFile(e) : alertPopup(
				dictionary[storageGET('settingPage').language].jsonincorrect,
				dictionary[storageGET('settingPage').language].tryagain,3000);
	})
	/* ============================ FUNCTION READ FILE && CONTENT ============================  */
	function readFile(evt) {
	    var files = evt.target.files;
	    if (files == null || files.length == 0) return;
	    var file = files[0];
	    var reader = new FileReader();
	    reader.onload = (function (theFile) {
		    return function (e) { readFileContent(e.target.result); };
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
			settingPage(autoSave = true);
			$('#auto-save').attr('data-save',true).prop('checked',true);
		}else{
			alertPopup(
				dictionary[storageGET('settingPage').language].jsonnotallow,
				dictionary[storageGET('settingPage').language].tryagain,3000);
		}
	}
	/* ============================ FUNCTION SETTING PAGE ============================  */
	function settingPage(autoSave = autoSaveGET,useLibraryJS = useLibraryJSGET,language = languageGET) {
		var obj = {
			'autoSave': autoSave,
			'useLibraryJS': useLibraryJSGET,
			'language': languageGET
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
		alertTime = setTimeout(()=>{ $('.menu-right .alert-processing').html(dictionary[storageGET('settingPage').language].processing); },time);
		alertTime = setTimeout(()=>{ $('.menu-right .alert-processing').html(dictionary[storageGET('settingPage').language].processed); },time + 1000);
		alertTime = setTimeout(()=>{ $('.menu-right .alert-processing').html(dictionary[storageGET('settingPage').language].status); },time + 2000);
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