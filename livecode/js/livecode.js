$(function(){
	var btnCode = $('.btn-code');
	$('.code-area-html').addClass('active');
	btnCode.on('click',function(){
		var _this = $(this).attr('data-type');
		$(this).siblings().removeClass('selected');
		$(this).toggleClass('selected');
		for(i=0;i<=btnCode.length;i++){
			if(!btnCode.not('.selected')[i]) {
				if(btnCode.not('.selected').length == 3) {
					$('.btn-result').addClass('selected').attr('disabled',true);
					$('main').addClass('full-height-view');
				}else{
					$('.btn-result').attr('disabled',false);
					$('main').removeClass('full-height-view');
				}
			}
		}
		switch (_this) {
			case 'html':
				$('.code-area-html').addClass('active');
				$('.code-area-css, .code-area-js').removeClass('active');
				break;
			case 'css':
				$('.code-area-css').addClass('active');
				$('.code-area-html, .code-area-js').removeClass('active');
				break;
			case 'js':
				$('.code-area-js').addClass('active');
				$('.code-area-css, .code-area-html').removeClass('active');
				break;
			default:
				alert('s')
				break;
		}
	})
	$('.btn-result').on('click',function(){
		$(this).toggleClass('selected');
		$('main').toggleClass('full-height-code');
	})
})