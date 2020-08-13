$(function(){
	$('.code-area-html').addClass('active');
	$('.btn-code').on('click',function(){
		var _this = $(this).attr('data-type');
		switch (_this) {
			case 'html':
				$('.btn-code').siblings().removeClass('active');
				$(this).addClass('active');
				$('.code-area-html').addClass('active');
				$('.code-area-css, .code-area-js').removeClass('active');
				break;
			case 'css':
				$('.btn-code').siblings().removeClass('active');
				$(this).addClass('active');
				$('.code-area-css').addClass('active');
				$('.code-area-html, .code-area-js').removeClass('active');
				break;
			case 'js':
				$('.btn-code').siblings().removeClass('active');
				$(this).addClass('active');
				$('.code-area-js').addClass('active');
				$('.code-area-css, .code-area-html').removeClass('active');
				break;
			default:
				break;
		}
	})
	$('.btn-result').on('click',function(){
		$(this).toggleClass('active');
		$('.code-area, .preview-area').toggleClass('active');
	})
})