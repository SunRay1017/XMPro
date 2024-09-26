$(function () {
	app.init()
});
var app = {
  init: function () {
		this.slideToggle()
		this.resizeIframe()
	},
  resizeIframe: function () {
		// 获取浏览器高度
		// $(window).height()
		// 设置iframe高度
		$("#rightMain001").height($(window).height()-80)
	},
  slideToggle: function () {
		$('.aside h4').click(function () {
			//		$(this).toggleClass('active');
	
			$(this).siblings('ul').slideToggle();
		});
	},
};
window.onresize=function () {
	app.resizeIframe()
}