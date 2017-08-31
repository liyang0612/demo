### 移动端日历组件

- 可以左右拖动然后切换月份
- 原生JS组件

#### 用法

html

```html
<div id="calendar">
	
</div>
```

javaScript

```javascript
var calendar = new Calendar('calendar', {
  	isHideHead: false, //是否隐藏头部（默认为false）
  });

/*
*默认没有年份切换，如需年份切换。如下操作:
*/

Element.addEventListenter('事件名称', function() {
	calendar.change += 1; //切换到下一年
  calendar.slideYear();
})

//亦可以去Calendar的原型上进行扩展
```

 [查看demo效果](https://liyang0612.github.io/demo/calendar/calendar.html "查看demo")

