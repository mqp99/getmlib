$(function(){
	var _TAGS_main = $('main'),
		_CLASS_areaCodeHTML = $('.area-code-html'),
		_CLASS_areaCodeCSS = $('.area-code-css'),
		_CLASS_areaCodeJS = $('.area-code-js');
	///////////////////////////////////////
	$('.area-code-html').addClass('active');
	$('.btn-code').on('click',function(){
		var _this = $.attr(this,'data-type');
		$(this).siblings().removeClass('selected');
		$(this).toggleClass('selected');
		for(i=0;i<=$('.btn-code').length;i++){
			if(!$('.btn-code').not('.selected')[i]) {
				if($('.btn-code').not('.selected').length == 2) {
					$('.btn-result').attr('disabled',false);
					_TAGS_main.removeClass('full-height-view');
				}else{
					$('.btn-result').addClass('selected').attr('disabled',true);
					_TAGS_main.removeClass('full-height-code').addClass('full-height-view');
				}
			}
		}
		switch (_this) {
			case 'html':
				$('.area-code-html').addClass('active');
				$('.area-code-css,.area-code-js').removeClass('active');
				break;
			case 'css':
				$('.area-code-css').addClass('active');
				$('.area-code-html,.area-code-js').removeClass('active');
				break;
			case 'js':
				$('.area-code-js').addClass('active');
				$('.area-code-html,.area-code-css').removeClass('active');
				break;
			default:
				alert('Somethings went wrong!')
				break;
		}
	})
	$('.btn-result').on('click',function(){
		$(this).toggleClass('selected');
		if($(this).not('.selected').length == 1) {
			_TAGS_main.addClass('full-height-code');
		}else{
			_TAGS_main.removeClass('full-height-code');
		}
	})
	$('.scale-frame').on('change',function(){
		$('#area-preview').attr('data-zoom',$(this).val());
	})
	$('.open-setting').on('click',function(){
		$('#popup-setting').addClass('show-setting');
	})
	$('.open-setting-shortcut').on('click',function(){
		$('#popup-setting-shortcut').addClass('show-setting');
	})
	$('.close-setting, .popup-overplay').on('click',function(){
		$('#popup-setting,#popup-setting-shortcut').removeClass('show-setting');
	})
	$('.menu-item').on('click',function(){
		var _this = $(this).attr('data-type');
		$('.menu-item').siblings().removeClass('selected');
		$(`.menu-item.${_this}`).toggleClass('selected');
		switch (_this) {
			case 'html':
				$('.main-content.html').addClass('selected');
				$('.main-content.css, .main-content.js, .main-content.custom, .main-content.language').removeClass('selected');
				break;
			case 'css':
				$('.main-content.css').addClass('selected');
				$('.main-content.html, .main-content.js, .main-content.custom, .main-content.language').removeClass('selected');
				break;
			case 'js':
				$('.main-content.js').addClass('selected');
				$('.main-content.css, .main-content.html, .main-content.custom, .main-content.language').removeClass('selected');
				break;
			case 'custom':
				$('.main-content.custom').addClass('selected');
				$('.main-content.css, .main-content.html, .main-content.js, .main-content.language').removeClass('selected');
				break;
			case 'language':
				$('.main-content.language').addClass('selected');
				$('.main-content.css, .main-content.html, .main-content.js, .main-content.custom').removeClass('selected');
				break;
		}
	})
})