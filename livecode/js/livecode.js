$(function(){
	$('.code-area-html').addClass('active');
	$('.btn').on('click',function(){
		var _this = $(this).attr('data-type');
		switch (_this) {
			case 'html':
				$('.btn').siblings().removeClass('active');
				$(this).addClass('active');
				$('.code-area-html').addClass('active');
				$('.code-area-css, .code-area-js').removeClass('active');
				break;
			case 'css':
				$('.btn').siblings().removeClass('active');
				$(this).addClass('active');
				$('.code-area-css').addClass('active');
				$('.code-area-html, .code-area-js').removeClass('active');
				break;
			case 'js':
				$('.btn').siblings().removeClass('active');
				$(this).addClass('active');
				$('.code-area-js').addClass('active');
				$('.code-area-css, .code-area-html').removeClass('active');
				break;
			default:
				// statements_def
				break;
		}
	})
})