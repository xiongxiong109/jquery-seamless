// jquery seamless slider v1.0
// created By Bear 2015/4/15
;
(function($) {

	$.fn.extend({
		'bearSlider': function(options) {
			var that = $(this);
			var defaults = {
				perItem: 2,
				delay: 500,
				autoplay: false,
				intervals: 1000,
				lBtn: "#btnL", //左滚动按钮
				rBtn: "#btnR", //右滚动按钮
				ev: 'click',
				direction: 'left',
				// seamless: true, //是否无缝滚动
				easing: 'swing'
			}
			var options = $.extend(defaults, options);
			//运动开关
			var isMove = false;
			//重新定义父级宽度
			fixSliderWidth();

			//是否自动滚动
			if (options.autoplay) {

				clearInterval(that.autoTimer);

				that.autoTimer = setInterval(function() {
					slide(options.perItem, options.direction);
				}, options.intervals);

				that.hover(function() {
					clearInterval(that.autoTimer);
				}, function() {
					that.autoTimer = setInterval(function() {
						slide(options.perItem, options.direction);
					}, options.intervals);
				});

			}
			//滚动按钮点击
			$(options.lBtn).bind(options.ev, function() {
				slide(options.perItem, 'left');
			});
			$(options.rBtn).bind(options.ev, function() {
				slide(options.perItem, 'right');
			});

			//宽度修复函数

			function fixSliderWidth() {
				that.width(that.children().outerWidth(true) * that.children().length);
			}

			//滚动函数

			function slide(num, direct) {

				if (num >= that.children().length) {

					num = Math.floor(that.children().length / 2);
					console.warn("the slide number is bigger than the total length,we have changed it to " + num);

				}
				fixSliderWidth();

				//无缝滚动
				if (!isMove) {
					isMove = true;

					if (direct == 'left') {
						for (var i = 0; i < num; i++) {
							that.append(that.children().eq(i).clone());
						}
						that.stop().animate({
							'left': -that.children().outerWidth(true) * (num)
						}, options.delay, options.easing, function() {
							for (var i = 0; i < num; i++) {
								//这里要注意，每次remove之后，后面的元素就补上来了，所以每次都应该是remove第0个元素
								that.children().eq(0).remove();
								that.css("left", "0px");
							}
							isMove = false;
						});
					} else {
						var len = that.children().length;
						for (var i = len - 1; i >= len - num; i--) {
							//同理每次插入的都应该是剪切的最后一个元素
							// that.children().eq(len-1).clone().insertBefore(that.children().eq(0));
							that.prepend(that.children().eq(len - 1).clone());
						}
						//先回到原点
						that.css("left", -that.children().outerWidth(true) * (num));
						//再运动
						that.stop().animate({
							"left": 0
						}, options.delay, options.easing, function() {
							//删除后续节点
							for (var i = 0; i < num; i++) {
								that.children().eq(len).remove();
							}
							isMove = false;
						});
					}
				}
			}
		}
	});


})(jQuery);