
// $(function(){
// 	'use strict';
// 	set_lang = function(dictionary) {
// 		$('[data-translate]').val(function() {
// 			var key = $(this).data('translate');
// 			if(dictionary.hasOwnProperty(key)){
// 				return dictionary[key];
// 			}
// 		})
// 	}
// 	$('#language-change').on('change', function() {
// 		var language = $(this).val();
// 		if(dictionary.hasOwnProperty(language)) {
// 			set_lang(dictionary[language]);
// 		}
// 		console.log('sss')
// 	})
// 	set_lang(dictionary.language)
// 	$('#language-change').on('change', function() {
// 		var language = $(this).val();
// 		setLanguage(dictionary)
// 		//console.log(language)
// 	})
// 	function setLanguage(dictionary) {
// 		$.each(dictionary, function(index,value) {
// 			if(index == 'vi_vn') {
// 				$('[data-translate').val(value);
// 				for(i=0;i<=value.length;i++){
// 					console.log(Object.keys(value))
// 				}
// 			}
// 		})
// 	}
// })
$(function () {

    // Lets be professional, shall we?
    "use strict";

    // Some variables for later
    var dictionary, set_lang;
	dictionary = {
		'en_us': {
			'_result': 'Result',
			'_scale': 'Scale',
			'_shortcuts': 'Shortcuts',
			'_status': 'Status',
			'_export': 'Export',
			'_livesetting': 'Live Setting',
			'_custom': 'Custom',
			'_language': 'Language',
			'_cssformat': 'CSS Format',
			'_autosave': 'Tự động lưu',
			'_exportjson': 'Export JSON',
			'_importjson': 'Import JSON',
			'_editorcommands': 'Editor Commands',
			'_autocompleteEC': 'Autocomplete',
			'_formatcodeEC': 'Format Code [Ctrl + A] before [Shift + F]',
			'_indentcodeleftEC': 'Indent Code Left',
			'_indentcoderightEC': 'Indent Code Right',
			'_linecommentEC': 'Line Comment',
			'_selecttagnextEC': 'Select Tag Next',
			'_selecttagprevEC': 'Select Tag Prev',
			'_emmetEC': 'Emmet commands',
			'_expandEC': 'Expand abbreviation',
			'_removetaginoutEC': 'Remove Tag inside->outside',
			'_removealltagEC': 'Remove All Tag',
			'_balanceEC': 'Balance Tag Inward',
		},
		'vi_vn': {
			'_result': 'Kết quả',
			'_scale': 'Thu phóng',
			'_shortcuts': 'Phím tắt',
			'_status': 'Trạng thái',
			'_export': 'Xuất JSON',
			'_livesetting': 'Cài đặt Live',
			'_custom': 'Tùy chỉnh',
			'_language': 'Ngôn ngữ',
			'_cssformat': 'Định dạng CSS',
			'_autosave': 'Tự động lưu',
			'_exportjson': 'Xuất File JSON',
			'_importjson': 'Nhập File JSON',
			'_editorcommands': ' Mã lệnh Editor',
			'_autocompleteEC': 'Gợi ý mã',
			'_formatcodeEC': ' Định dạng code [Ctrl + A] trước [Shift + F]',
			'_indentcodeleftEC': 'Thụt code lề trái',
			'_indentcoderightEC': 'Thụt code lề phải',
			'_linecommentEC': 'Comment code',
			'_selecttagnextEC': 'Tiến tới 1 thẻ',
			'_selecttagprevEC': 'Lùi lại 1 thẻ',
			'_emmetEC': 'Mã lệnh Emmet',
			'_expandEC': 'div -> <div></div>',
			'_removetaginoutEC': 'Xóa thẻ từ trong ra ngoài vùng chọn',
			'_removealltagEC': 'Xóa mọi thẻ vùng chọn',
			'_balanceEC': 'Chọn vùng bên trong thẻ',
		},
	}

    // Function for swapping dictionaries
    set_lang = function (dictionary) {
        $("[data-translate]").text(function () {
            var key = $(this).data("translate");
            if (dictionary.hasOwnProperty(key)) {
                return dictionary[key];
            }
        });
    };

    // Swap languages when menu changes
    $("#language-change").on("change", function () {
        var language = $(this).val().toLowerCase();
        if (dictionary.hasOwnProperty(language)) {
            set_lang(dictionary[language]);
        }
    });

    // Set initial language to English
    set_lang(dictionary.en_us);

});