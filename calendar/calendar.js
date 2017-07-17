function Calendar(dom) {
	var date = new Date();
	this.caWrap = dom;
	this.currentYear = date.getFullYear(); //当前年份
	this.currentMonth = date.getMonth(); //当前月份
	this.currentDay = date.getDay();    //当前周数
	this.nextMonthNum = date.getMonth() + 1;
	this.prevMonthNum = date.getMonth() - 1;
	this.caItemWrap = document.createElement('div');
	this.caSelectionDom = '';
}
/*
 *初始化
 */
 Calendar.prototype.init = function() {
 	this.render(this.currentMonth - 1, 'page-prev');
 	this.render(this.currentMonth, 'page-active');
 	this.render(this.currentMonth + 1, 'page-next');
 	this.caItemWrap.className = "ca-selection";
 	this.caWrap.append(this.caItemWrap);

	//渲染周数
	this.renderWeek();
	//绑定事件
	this.touchSlide.apply(this.caWrap);
}

/*
 *日历列表渲染
 */
 Calendar.prototype.render = function(month, ulClass, prev) {
 	var ulDom = document.createElement('ul'),
      prevMAllDates = '',//上月总天数
      prevNum = '',      //上月最后的几天
      nextMAllDates = '',
      nextNum = '',
	    currentMAllDates = new Date(this.currentYear, month + 1, 0).getDate(),//当月总天数
      earlyMonthDay = new Date(this.currentYear, month,1).getDay(); //当月1号是周几。
      ulDom.className = 'ca-date clear ';
      if(!month){
      	prevMAllDates = new Date(this.currentYear, 12, 0).getDate();
      }else if(month > 12){
      	nextMAllDates = new Date(new Date(this.currentYear, 1, 0).getDate());

      }else{
      	prevMAllDates = new Date(this.currentYear, month-1, 0).getDate();
      	nextMAllDates = new Date(new Date(this.currentYear, month+1, 0).getDate());
      }
      prevNum = prevMAllDates - earlyMonthDay;
      nextNum = 42 - currentMAllDates - earlyMonthDay;
	//渲染上月的几天
	for(var j = 0; j < earlyMonthDay; j++){
		var prevDate = document.createElement('li');
		prevDate.className = 'prev-date';
		prevDate.innerText = prevNum++;
		ulDom.append(prevDate);
	}
	//渲染本月的所有date
	for(var i = 0; i < currentMAllDates; i++){
		var crrentDate = document.createElement('li');
		crrentDate.innerText = i + 1;
		ulDom.append(crrentDate);
	}
	//渲染下月的几天
	for(var k = 0; k < nextNum; k++){
		var nextDate = document.createElement('li');
		nextDate.className = 'next-date';
		nextDate.innerText = k + 1;
		ulDom.append(nextDate);
	}
	var caItemBox = document.createElement('div');
	caItemBox.className = 'ca-item-box ' + ulClass;
	caItemBox.append(ulDom);
	if(prev){
		this.caItemWrap.prepend(caItemBox);
	}else{
		this.caItemWrap.append(caItemBox);
	}
}

 /*
  *next切换事件处理
  */

  Calendar.prototype.slideNext = function() {
  	var childs = [];
  	this.caSelectionDom.childNodes.forEach(function(val) {
  		if(val.innerText){
  			childs.push(val);
  		}
  	});
  	childs[0].remove();
  	childs[1].className = 'ca-item-box page-prev';
  	childs[2].className = 'ca-item-box page-active';
  	if(this.nextMonthNum > 12){
  		this.nextMonthNum = 1;
  	}else{
  		this.nextMonthNum++;
  	}
  	this.render(this.nextMonthNum, 'page-next');
  }

 /*
  *prev切换事件处理
  */

  Calendar.prototype.slidePrev = function() {
  	var childs = [];
  	this.caSelectionDom = document.querySelector('.ca-selection');
  	this.caSelectionDom.childNodes.forEach(function(val) {
  		if(val.innerText){
  			childs.push(val);
  		}
  	});
  	childs[0].className = 'ca-item-box page-active';
  	childs[1].className = 'ca-item-box page-next';
  	childs[2].remove();
  	if(this.prevMonthNum < 0){
  		this.prevMonthNum = 12;
  	}else{
  		this.prevMonthNum--;
  	}
  	console.log(this.prevMonthNum)
  	this.render(this.prevMonthNum, 'page-prev', 'prev');
  }

  /*
  *周数列表渲染
  */
  Calendar.prototype.renderWeek = function() {
  	var weeks = ['日', '一', '二', '三' , '四', '五', '六'];
  	var weekBox = document.createElement('div');
  	var ulWeek = document.createElement('ul');
  	weeks.forEach(function(val) {
  		var weekDate = document.createElement('li');
  		weekDate.innerText = val;
  		ulWeek.append(weekDate);
  	});
  	weekBox.className = 'ca-header';
  	weekBox.append(ulWeek);
  	this.caWrap.prepend(weekBox);
  }

  /*
  *slide事件
  */
  Calendar.prototype.touchSlide = function() {
  	this.addEventListener('touchmove', touchMove);
  }
  function touchMove(e) {
  	console.log(e.touches[0].pageX);
  }