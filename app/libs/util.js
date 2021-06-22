// 常用配置公共js 文件
var app = getApp();
const test = data => {
  return 123
}
//小于10的格式化函数
const timeFormat=function(param) {
  return param < 10 ? '0' + param : param;
}

const padLeftZero = function (str) {
  return ("00" + str).substr(str.length);
}
const phoneHide = function (phone) {
  return phone.substr(0, 3) + '****' + phone.substr(7, 4)
}
const trim = function (str) {
  if (!str) {
    return ''
  }
  return str.replace(/(^\s*)|(\s*$)/g, '')
}

const getStrLength = function (val) {
  let len = 0;
  for (let i = 0; i < val.length; i++) {
    let a = val.charAt(i);
    if (a.match(/[^\x00-\xff]/ig) != null) {
      len += 2;
    }
    else {
      len += 1;
    }
  }
  return len;
}

//时间处理
const  fdate = function (date, fmt) {
  // date=new Date(dates);
  date = new Date(date.replace(/-/g, '/'));
  //fmt=fmts||'yyyy-MM-dd HH:mm';
  var o = {
    "M+": date.getMonth() + 1,
    //月份
    "d+": date.getDate(),
    //日
    "h+": date.getHours() % 12 == 0 ? 12 : date.getHours() % 12,
    //小时
    "H+": date.getHours(),
    //小时
    "m+": date.getMinutes(),
    //分
    "s+": date.getSeconds(),
    //秒
    "q+": Math.floor((date.getMonth() + 3) / 3),
    //季度
    S: date.getMilliseconds()
  };
  var week = {
    "0": "日",
    "1": "一",
    "2": "二",
    "3": "三",
    "4": "四",
    "5": "五",
    "6": "六"
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length > 1 ? RegExp.$1.length > 2 ? "星期" : "周" : "") + week[date.getDay() + ""]);
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }
  }
  return fmt;
};

//时间戳处理
const fdate1 = function (date, fmt) {
  date=new Date(date);
  //fmt=fmts||'yyyy-MM-dd HH:mm';
  var o = {
    "M+": date.getMonth() + 1,
    //月份
    "d+": date.getDate(),
    //日
    "h+": date.getHours() % 12 == 0 ? 12 : date.getHours() % 12,
    //小时
    "H+": date.getHours(),
    //小时
    "m+": date.getMinutes(),
    //分
    "s+": date.getSeconds(),
    //秒
    "q+": Math.floor((date.getMonth() + 3) / 3),
    //季度
    S: date.getMilliseconds()
  };
  var week = {
    "0": "日",
    "1": "一",
    "2": "二",
    "3": "三",
    "4": "四",
    "5": "五",
    "6": "六"
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length > 1 ? RegExp.$1.length > 2 ? "星期" : "周" : "") + week[date.getDay() + ""]);
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }
  }
  return fmt;
};

const newdate=function(date){
  return date.substring(0, 10);
}

const checkPhone = function (date) {
  var isMob = /^1\d{10}$/;

  if (isMob.test(date)) {
    return true;
  }else{
    wx.showToast({
      title: '请输入正确的手机号码',
      icon: 'none',
    });
    return false;
  }

}

const checkEmail = function (date) {
  var isMail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
  if (isMail.test(date)) {
    return true;
  } else {
    wx.showToast({
      title: '请输入正确的电子邮箱',
      icon: 'none',
    });
    return false;
  }
}

const checkIdCard = function (value) {
  var isCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  if (isCard.test(value)) {
    return true;
  }
  else {
    wx.showToast({
      title: '请输入有效身份证号码',
      icon: 'none',
    });
    return false;
  }
}

//倒计时
const formatSeconds=function(value,state) {
  var secondTime = parseInt(value);// 秒
  var minuteTime = 0;// 分
  var hourTime = 0;// 小时
  var dayTime = 0;// 天

  if (secondTime > 60) {//如果秒数大于60，将秒数转换成整数
    //获取分钟，除以60取整数，得到整数分钟
    minuteTime = parseInt(secondTime / 60);
    //获取秒数，秒数取佘，得到整数秒数
    secondTime = parseInt(secondTime % 60);
    //如果分钟大于60，将分钟转换成小时
    if (minuteTime > 60) {
      //获取小时，获取分钟除以60，得到整数小时
      hourTime = parseInt(minuteTime / 60);
      //获取小时后取佘的分，获取分钟除以60取佘的分
      minuteTime = parseInt(minuteTime % 60);
      if (hourTime>24){
        dayTime = parseInt(hourTime / 24);
        hourTime = parseInt(hourTime % 24);
      }
    }
  }
  if(state==1){
    var result = "" + timeFormat(parseInt(secondTime)) ;
    if (minuteTime >= 0) {
      result = "" + timeFormat(parseInt(minuteTime)) + ":" + result;
    }
    // if (hourTime > 0) {
    //   result = "" + timeFormat(parseInt(hourTime)) + ":" + result;
    // }
  }else{
    var result
    if (dayTime > 0){
      if (hourTime > 0) {
        result = "" + timeFormat(parseInt(hourTime)) + "小时";
      }
      if (dayTime > 0) {
        result = "" + timeFormat(parseInt(dayTime)) + "天" + result;
      }
    } else if (hourTime > 0){
      result = "" + timeFormat(parseInt(secondTime)) + "秒";
      if (minuteTime > 0) {
        result = "" + timeFormat(parseInt(minuteTime)) + "分" + result;
      }
      if (hourTime > 0) {
        result = "" + timeFormat(parseInt(hourTime)) + "小时" + result;
      }
      if (dayTime > 0) {
        result = "" + timeFormat(parseInt(dayTime)) + "天" + result;
      }
    }
    else{
      result = "" + timeFormat(parseInt(secondTime)) + "秒";
      if (minuteTime > 0) {
        result = "" + timeFormat(parseInt(minuteTime)) + "分" + result;
      }
    }
  }

  
  return result;
}


module.exports = {
  test: test,
  fdate: fdate, 
  padLeftZero: padLeftZero,
  trim: trim,
  phoneHide: phoneHide,
  getStrLength: getStrLength,
  newdate: newdate,
  formatSeconds: formatSeconds,
  timeFormat: timeFormat,
  checkPhone: checkPhone,
  checkEmail: checkEmail,
  checkIdCard: checkIdCard,
  fdate1: fdate1
}