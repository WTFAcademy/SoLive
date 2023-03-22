function debounce(func: Function, delay: number) {
  let timer: any = null; // 定时器

  return function () {
    // @ts-ignore
    const context = this; // 记录 this 值,防止在回调函数中丢失
    const args = arguments; // 函数参数

    //如果定时器存在，则清除定时器(如果没有,也没必要进行处理)
    timer ? clearTimeout(timer) : null;

    timer = setTimeout(() => {
      // 防止 this 值变为 window
      func.apply(context, args);
    }, delay);
  };
}

export default debounce;
