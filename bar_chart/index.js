const barChart = (dom, data) => {
  let datas = data;
  //用于给每条数据添加一个“过渡专属变量”
  let objLine = {};
  for (let i = 0; i < datas.length; i++) {
    objLine["line" + i] = 0;
    objLine["y" + i] = 360;
  }
  /*
   *图表出场过渡
   */

  let timer = setInterval(function() {
    let x = 30;
    for (let i = 0; i < datas.length; i++) {
      //根据第一条数据计算每条数据需要增加的量
      let scale = datas[i] / datas[0];
      //“过渡专属变量”小于该条数据时，画一次图
      if (datas[i] > objLine["line" + i]) {
        objLine["line" + i] += scale;
        objLine["y" + i] -= scale;
        bar(dom, x, objLine["y" + i], objLine["line" + i]);
        x += 46;
      } else {
        //结束过渡定时器，渲染画布信息
        ctx.fillStyle = "#fff";
        datas.forEach((data, index) => {
          ctx.fillText(data, (index + 1) * 46 - 28, 340 - data);
        })
        clearInterval(timer);
        return;
      }
    }
  }, 5);

  let months = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'];
  let ctx = dom.getContext('2d');
  ctx.fillStyle = '#24262c';
  ctx.fillRect(0, 360, 570, 60);
  ctx.font = "16px pingfang";
  ctx.fillStyle = "#fff";

  months.forEach((month, index) => {
    ctx.fillText(month, (index + 1) * 46 - 20, 395);
  });
}

//------------------------辅助函数-----------------------//
/*
 * 柱状图
 */
function bar(dom, x, y, height) {
  let ctx = dom.getContext('2d');
  let lingrad = ctx.createLinearGradient(x, y, x, height + y);
  lingrad.addColorStop(0, '#fe5e4b');
  lingrad.addColorStop(1, '#f9d423');
  ctx.fillStyle = lingrad;
  ctx.fillRect(x, y, 8, height);
}