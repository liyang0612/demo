(function(window) {
    function Calendar(ID, obj) {
        var date = new Date();
        this.caWrap = document.getElementById(ID);; //日历容器
        this.startX = '';
        this.endX = '';
        this.currentYear = date.getFullYear(); //当前年份
        this.currentMonth = date.getMonth(); //当前月份
        this.currentDay = date.getDay(); //当前周数

        this.changeYear = this.currentYear; //  随用户操作变化的年份
        this.changeMonth = date.getMonth() + 1;
        this.caItemWrap = document.createElement('div'); //在这里创建是为了避免在重复渲染的时候，重复创建此div
        this.caSelectionDom = '';

        //用户自定义参数对象
        this.customObj = obj || {};
        this.init(this.customObj);
    }
    /*
     *初始化
     */
    Calendar.prototype.init = function(obj) {
        //渲染基础列表
        this.render(this.currentMonth - 1, 'page-prev');
        this.render(this.currentMonth, 'page-active');
        this.render(this.currentMonth + 1, 'page-next');
        this.caItemWrap.className = "ca-selection";
        this.caWrap.append(this.caItemWrap);

        //渲染周数
        this.renderWeek();
        //渲染头部（年月）;
        if (!obj.isHideHead)
            this.renderHeader();
        //绑定事件
        this.touchSlide();
    }

    /*
     *日历列表渲染
     */
    Calendar.prototype.render = function(month, ulClass, prev) {
        var ulDom = document.createElement('ul'),
            prevMAllDates = '', //上月总天数
            prevNum = '', //上月最后的几天
            nextMAllDates = '',
            nextNum = '',
            currentMAllDates = new Date(this.changeYear, month + 1, 0).getDate(), //当月总天数
            earlyMonthDay = new Date(this.changeYear, month, 1).getDay(); //当月1号是周几。
        ulDom.className = 'ca-date clear ';
        if (!month) {
            prevMAllDates = new Date(this.changeYear, 12, 0).getDate();
        } else if (month > 12) {
            nextMAllDates = new Date(new Date(this.changeYear, 1, 0).getDate());
        } else {
            prevMAllDates = new Date(this.changeYear, month, 0).getDate();
            nextMAllDates = new Date(new Date(this.changeYear, month, 0).getDate());
        }
        prevNum = prevMAllDates - earlyMonthDay;
        nextNum = 42 - currentMAllDates - earlyMonthDay;
        //渲染上月的几天
        for (var j = 0; j < earlyMonthDay; j++) {
            var prevDate = document.createElement('li');
            prevDate.className = 'prev-date';
            prevDate.innerText = ++prevNum;
            ulDom.append(prevDate);
        }
        //渲染本月的所有date
        for (var i = 0; i < currentMAllDates; i++) {
            var crrentDate = document.createElement('li');
            crrentDate.innerText = i + 1;
            ulDom.append(crrentDate);
        }
        //渲染下月的几天
        for (var k = 0; k < nextNum; k++) {
            var nextDate = document.createElement('li');
            nextDate.className = 'next-date';
            nextDate.innerText = k + 1;
            ulDom.append(nextDate);
        }
        var caItemBox = document.createElement('div');
        caItemBox.className = 'ca-item-box ' + ulClass;
        caItemBox.append(ulDom);
        if (prev) {
            this.caItemWrap.prepend(caItemBox);
        } else {
            this.caItemWrap.append(caItemBox);
        }
    }
    /*
     *日历头部渲染
     */
    Calendar.prototype.renderHeader = function() {
        var yearMonth = document.createElement('div');
        var month = (this.changeMonth > 9) ? this.changeMonth : '0' + this.changeMonth;
        yearMonth.className = 'ca-year-head';
        yearMonth.innerHTML = '';
        yearMonth.innerHTML = '<span>' + this.changeYear + '</span> - <span>' + month + '</span>'
        this.caWrap.prepend(yearMonth);
    }
    /*
     *周数列表渲染
     */
    Calendar.prototype.renderWeek = function() {
        var weeks = ['日', '一', '二', '三', '四', '五', '六'];
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
     *月份切换事件处理程序
     */

    Calendar.prototype.slideMonth = function(type) {
        var childs = [];
        this.caSelectionDom = document.querySelector('.ca-selection');
        this.caSelectionDom.childNodes.forEach(function(val) {
            if (val.nodeType == 1) {
                childs.push(val);
            }
        });
        switch (type) {
            case 'next':
                childs[0].remove();
                childs[1].className = 'ca-item-box page-prev';
                childs[2].className = 'ca-item-box page-active';
                if (this.changeMonth > 11) {
                    this.changeMonth = 1;
                    this.changeYear += 1;
                } else {
                    this.changeMonth++;
                }
                this.render(this.changeMonth, 'page-next');
                break;
            default:
                childs[0].className = 'ca-item-box page-active';
                childs[1].className = 'ca-item-box page-next';
                childs[2].remove();
                if (this.changeMonth < 2) {
                    this.changeMonth = 12;
                    this.changeYear -= 1;
                } else {
                    this.changeMonth--;
                }
                this.render(this.changeMonth - 2, 'page-prev', 'prev');
                this.isPrev = false;
        }
        //头部日期变化
        var headDom = document.querySelector('.ca-year-head');
        //计算月份的变化
        var month = (this.changeMonth > 9) ? this.changeMonth : '0' + this.changeMonth;
        headDom.children[1].innerText = month;
        //计算年份的变化
        headDom.children[0].innerText = this.changeYear;
    }

    /*
     *月份切换事件
     */
    Calendar.prototype.touchSlide = function() {
        touchStart = touchStart.bind(this);
        touchMove = touchMove.bind(this);
        touchEnd = touchEnd.bind(this);
        this.caWrap.addEventListener('touchstart', touchStart);
        this.caWrap.addEventListener('touchmove', touchMove);
        this.caWrap.addEventListener('touchend', touchEnd);
    }

    /*
     *年份切换事件处理程序
     */

    Calendar.prototype.slideYear = function() {
        touchEnd = touchEnd.bind(this);
        var oldCaSelection = document.querySelector('.ca-selection');
        var headDom = document.querySelector('.ca-year-head');
        oldCaSelection.innerHTML = "";
        oldCaSelection.remove();
        this.render(this.currentMonth - 1, 'page-prev');
        this.render(this.currentMonth, 'page-active');
        this.render(this.currentMonth + 1, 'page-next');
        this.caItemWrap.className = "ca-selection";
        this.caWrap.append(this.caItemWrap);
        headDom.children[0].innerText = this.changeYear;
    }


    function touchStart(e) {
        this.startX = e.touches[0].pageX;
    }

    function touchMove(e) {
        this.endX = e.touches[0].pageX;
    }

    function touchEnd(e) {
        if (this.endX > this.startX) {
            this.slideMonth('prev');
        } else {
            this.slideMonth('next');
        }
    }

    window.Calendar = Calendar;
})(window)