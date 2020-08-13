$(function(){
	$('.code-area-html').addClass('active');
	$('.btn-code').on('click',function(){
		var _this = $(this).attr('data-type');
		$(this).siblings().removeClass('selected');
		$(this).toggleClass('selected');
		for(i=0;i<=$('.btn-code').length;i++){
			if(!$('.btn-code').not('.selected')[i]) {
				if($('.btn-code').not('.selected').length == 2) {
					console.log('btn on')
					$('.btn-result').attr('disabled',false);
					$('main').removeClass('full-height-view');
					//$('main').removeClass('full-height-code').removeClass('full-height-view');
				}else{
					console.log('btn off')
					$('.btn-result').addClass('selected').attr('disabled',true);
					$('main').removeClass('full-height-code').addClass('full-height-view');
					//$('main').addClass('full-height-view').addClass('full-height-code');
				}
				console.log($('.btn-code').not('.selected').length)
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
		if($(this).not('.selected').length == 1) {
			$('main').addClass('full-height-code');
					console.log('result off')
		}else{
					console.log('result on')
			//$('main').removeClass('full-height-code');
		}
	})
})