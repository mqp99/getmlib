$(function(){
	$('.area-code-html').addClass('active');
	$('.btn-code').on('click',function(){
		var _this = $(this).attr('data-type');
		$(this).siblings().removeClass('selected');
		$(this).toggleClass('selected');
		for(i=0;i<=$('.btn-code').length;i++){
			if(!$('.btn-code').not('.selected')[i]) {
				if($('.btn-code').not('.selected').length == 2) {
					//console.log('btn on')
					$('.btn-result').attr('disabled',false);
					$('main').removeClass('full-height-view');
				}else{
					//console.log('btn off')
					$('.btn-result').addClass('selected').attr('disabled',true);
					$('main').removeClass('full-height-code').addClass('full-height-view');
				}
				// console.log($('.btn-code').not('.selected').length)
			}
		}
		switch (_this) {
			case 'html':
				$('.area-code-html').addClass('active');
				$('.area-code-css, .area-code-js').removeClass('active');
				break;
			case 'css':
				$('.area-code-css').addClass('active');
				$('.area-code-html, .area-code-js').removeClass('active');
				break;
			case 'js':
				$('.area-code-js').addClass('active');
				$('.area-code-css, .area-code-html').removeClass('active');
				break;
			default:
				alert('s')
				break;
		}
	})
	$('.btn-result').on('click',function(){
		$(this).toggleClass('selected');
		if($(this).not('.selected').length == 1) {
			//console.log('result off')
			$('main').addClass('full-height-code');
		}else{
			//console.log('result on')
			$('main').removeClass('full-height-code');
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