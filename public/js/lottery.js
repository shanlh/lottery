(function(){
	var globalBlack = [];
	/**
	 * 检查数组是否存在某值
	 * @param  {*} 		item 	需检查元素
	 * @return {bool}	该数组是否存在传入值
	 */
	Array.prototype.contains = function(item){
		for(var i=0;i<this.length;i++) if(this[i]==item) return true
		return false;
	};
	xb = {
		/**
		 * 生成员工头像
		 * @param  {json}   	data     	员工列表
		 * @param  {Function} 	callback 	生成完毕后的回调
		 * @return {void}
		 */
		generateBlocks:function(data,callback){
	        var html = '',
	        	dataLength = data.length;
			for(var i=0;i<dataLength;i++){
				if(data[i].employee_id){
					var sClass = 'block' ;
					if(data[i].win==1){
						sClass+=' out';
						globalBlack.push(i);
					}
					html += '<div class="'+sClass+'"><img id="emp'+data[i].employee_id+'" src="public/photos/'+data[i].employee_id+'.png" data-id="'+data[i].employee_id+'"></div>';
				}
			}
			$('.blocks').append(html);
			callback();
		},
		/**
		 * 随机弹性出现头像
		 * @param  {el}		t 	需弹性出现的元素
		 * @return {void}
		 */
		bounceIn:function(t){
			setTimeout(function(){
				t.addClass('animated bounceIn delay').css('opacity',1);
				setTimeout(function(){
					t.removeClass('animated bounceIn delay')
				},1250);
			},Math.random()*1000);
		},
		/**
		 * 跑马灯
		 */
		lights:function(cfg){
			this.interval = '' ;
			this.wrap = cfg.wrap ;
			this.speed = cfg.speed?cfg.speed:50 ;
			var curLight = 0 ;
			/**
			 * 生成跑马灯
			 * @return {void}
			 */
			this.generate = function(){
				var lights = '' ;
				for(var i=0;i<44;i++){
					if(i>=33){
						lights += '<div class="light" style="left:3px;top:'+ (245-(22*(i%11))) +'px;"></div>' ;
					}else if(i>=22&&i<33){
						lights += '<div class="light" style="right:'+ (3+(22*(i%11))) +'px;top:245px;"></div>' ;
					}else if(i>=11&&i<22){
						lights += '<div class="light" style="right:3px;top:'+ (3+( 22*(i%11) )) +'px;"></div>' ;
					}else if(i>=0&&i<12){
						lights += '<div class="light" style="left:'+ (3+(22*i)) +'px;top:3px;"></div>' ;
					}
				}
				$(this.wrap).html(lights);
				if(cfg.auto!=false){
					this.setSpeed();
				}
			}
			/**
			 * 设置速度
			 * @return {void}
			 */
			this.setSpeed = function(s){
				this.stop();
				var wrap = this.wrap ;
				s?this.speed=s:this.speed=50 ;
				this.interval = setInterval(function(){
					$(wrap+' .active').removeClass('active');
					$(wrap+' .light:eq('+(curLight%44)+')').addClass('active');
					curLight++;
				},this.speed);
			}
			/**
			 * 停止跑马灯，清除定时器
			 * @return {void}
			 */
			this.stop = function(){
				$(this.wrap+' .active').removeClass('active');
				this.interval?clearInterval(this.interval):'';
			}
			/**
			 * 生成跑马灯
			 * @return {void}
			 */
			this.generate();
		},
		/**
		 * 自动翻转交换员工头像位置
		 * @return {void}
		 */
		autoChange:function(){
			this.interval = ''
			this.run = function(){
				this.stop();
				this.interval = setInterval(function(){
					/**
					 * 需要同时变化的个数（随机），理论上为2~9个
					 * @type {[type]}
					 */
					var lastLength = $('.block:not(.out)').length;
					if(lastLength>1){
						var changeCount = parseInt(Math.random()*8)+2,
							allCount = $('.block').length,
							temp,
							black = [],
							created = 0;
						/**
						 * 如果剩余不足8个人未中奖则最大交换人数变更
						 */
						for(;lastLength<changeCount;){
							changeCount = parseInt(Math.random()*lastLength)+2;
						}
						/**
						 * 复制全局中奖位置数组
						 */
						for(var i=0;i<globalBlack.length;i++){
							black.push(globalBlack[i]);
						}
						/**
						 * 生成即将交换的员工位置数组
						 */
						for(var i=0;created<changeCount;i++){
							var rand = parseInt(Math.random()*allCount);
							if(black.contains(rand)){ continue }
							black.push(rand);
							created++;
							$('.block:eq('+ rand +')').addClass('changing');
						}
						/**
						 * 开始交换
						 */
						temp = $('.changing:eq(0) img').clone();
						$('.changing').each(function(index,el){
							var t = $(el) ;
							if(index==(changeCount-1)){
								t.append(temp);
							}else{
								t.append($('.changing:eq('+ (index+1) +') img').clone());
							}
						});
						/**
						 * 去除被替换过的block的多余图片及废弃类名
						 */
						setTimeout(function(){
							$('.changing').each(function(index,el){
								var t = $(el) ;
								t.html(t.find('img:eq(1)')).removeClass('changing');
							});
						},1000);
					}
				},3000);
			}
			this.stop = function(){
				clearInterval(this.interval);
			}
			this.run();
		},
		bindBtn:function(){
			var obj = this ;
			obj.status = 'free' ;
			/**
			 * 按钮、键盘事件绑定
			 */
			$('.btn').click(function(){
				obj.change();
			});
			document.onkeydown = function(event){
				if(event.keyCode == 32) obj.change();
			}
			/**
			 * 按空格时
			 */
			this.change = function(){
				if(obj.status == 'free'){
					/**
					 * 空闲状态，点击即随机点亮未中奖员工，等待点击暂停
					 */
					autoChange.stop();
					light.setSpeed(25) ;
					$('.rollStatus')[0].className = 'rollStatus sRolling' ;
					$('.block').addClass('mask');
					// clearInterval(obj.waitRandInterval);
					obj.waitRandInterval = setInterval(function(){
						var rand = xb.uniqueRand();
						$('.block').addClass('mask');
						$('.block:eq('+ rand +')').removeClass('mask');
					},80);
					obj.status = 'waiting' ;
				}else if(obj.status == 'waiting'){
					/**
					 * 等待暂停状态，点击则减速，且去请求接口获取中奖人
					 */
					obj.status = 'ending';
					light.setSpeed() ;
					$('.rollStatus')[0].className = 'rollStatus sEnding' ;
					/**
					 * 一秒后开始减速
					 */
					setTimeout(function(){
						/**
						 * 请求中奖结果并减速
						 */
						$.ajax({
						    url: lootteryUrl,
						    success: function(data) {
						    	if(data.error==0){
							    	obj.winner = data ;
									clearInterval(obj.waitRandInterval);
									obj.changeSlowDown(80);
						    	}else{
						    		alert(data.msg);
						    	}
						    }
						});
					},1000);
				}else if(obj.status == 'end'){
					autoChange.run();
					this.confetti.StopConfetti();
					$('.rollStatus')[0].className = 'rollStatus sStart' ;
					$('.btn-bgImg').removeClass('heiheihei knewoneShake');
					$('.resultMask').hide().removeClass('normal egg');
					$('.resultContent').removeClass('ac');
					/**
					 * 为了防呆应该延迟
					 */
					obj.status = 'free' ;
				}else if(obj.status == 'egg'){
					/**
					 * 开始随机数
					 */
					var u = 234;
					if(obj.isBegin) return false;
					$('.resultContent').addClass('ac');
					obj.isBegin = true;
					$(".num").css('backgroundPositionY',0);
					var result = obj.winner.hongbao;
					var num_arr = (result+'').split('');
					$(".num").each(function(index){
						var _num = $(this);
						setTimeout(function(){
							_num.animate({
								backgroundPositionY: (u*60) - (u*num_arr[index])
							},{
								duration: 6000+(4-index)*3000,
								easing: "easeInOutCirc",
								complete: function(){
									if(index==0){
										/**
										 * 为了防呆应该延迟
										 */
										obj.isBegin = false;
										obj.status = 'end' ;
									}
								}
							});
						}, (4-index) * 300);
					});

				}
			};
			/**
			 * 随机抽选减速
			 * @param  {int} 	time 	延迟出现下一个的时间
			 * @param  {int} 	n    	闪动了几次，供判断文案显示
			 * @param  {bool} 	end  	是否该停止
			 * @return {void}
			 */
			this.changeSlowDown = function(time,n,end){
				n?'':n=0;
				var randTime = time+parseInt(Math.random()*10*n);
				if(n<9||randTime<800){
					if(n==0){
						$('#willwill').text("要停啦!");
					}else if(n==10){
						$('#willwill').text("停啦!");
					}else if(n==15){
						$('#willwill').text("真的停啦!");
					}else if(n==18){
						$('#willwill').text("真的!");
					}
					randomShow(randTime);
				}else{
					randomShow(1200,true);
				}
				function randomShow(randTime,isEnd){
					setTimeout(function(){
						$('.block').addClass('mask');
						if(!isEnd){
							/**
							 * 还在减速，还未揭晓，还是随机点亮
							 */
							var rand = xb.uniqueRand();
							$('.block:eq('+rand+')').removeClass('mask');
							obj.changeSlowDown(randTime,++n);
						}else{
							/**
							 * 揭晓中奖员工
							 */
							var winBlock = $('#emp'+obj.winner.employee_id).parent() ;
							var blockIndex = winBlock.index();
							winBlock.removeClass('mask');
							/**
							 * 判断是否彩蛋
							 */
							if(obj.winner.egg=='yes'){	// 彩蛋
								obj.result('egg');
							}else{						// 普通
								obj.result('chaoxingfen');
							}
							globalBlack.push(blockIndex);
						}
					},randTime);
				}
			}
			this.result = function(type){
				$('.rollStatus')[0].className = 'rollStatus' ;
				$('.btn .btn-bgImg').addClass('heiheihei knewoneShake');
				setTimeout(function(){
					if(type=='egg'){					// 彩蛋
						$('.resultMask').addClass('egg').show();
						// obj.egg();
						obj.resultShow('egg');
					}else if(type=='chaoxingfen'){		// 普通
						$('.resultMask').addClass('normal').show();
						// obj.fire()
						obj.resultShow('end');
					}
				},2000);
			}
			this.resultShow = function(status){
				var id = obj.winner.employee_id;
				$('#emp'+id).parent().addClass('out');
				$('.block').removeClass('mask');
				if(!this.confetti){
					this.confetti = new confetti();
				}
				if(status=='egg'){
					this.confetti.StartConfetti('egg');
				}else{
					this.confetti.StartConfetti();
				}
				$('#winner').attr('src','public/large_photos/'+id+'.jpg');
				obj.status = status;
			}
		},
		uniqueRand:function(){
			var rand,allCount=$('.block').length ;
			for(;;){
				rand = parseInt(Math.random()*allCount) ;
				if(!globalBlack.contains(rand)){
					break;
				}
			}
			return rand ;
		}
	}
})()
