var autoChange ;
var lootteryUrl = 'lottery.json';
$.ajax({
    url: 'memberlist.json',
    success: function(data) {
    	xb.generateBlocks(data,function(){
    		/**
    		 * 弹性出现头像
    		 */
    		$('.content .block').each(function(index,el){
				xb.bounceIn($(el))
			});
			/**
			 * 自动翻转
			 */
			autoChange = new xb.autoChange();
            /**
             * 抽奖按钮事件
             */
            xb.bindBtn();
    	});
    }
});
/**
 * 跑马灯生成
 */
var light = new xb.lights({wrap:'.lightsWrap'});
