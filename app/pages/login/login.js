// pages/login/login.js
const app = getApp()
var timeClock='';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    phone:'',
    code:'',
    code_text:'获取验证码',
    timer_num:60,
  },
  onLoad: function (options) {},
  bindinput: function (e) {
    this.setData({
      [e.currentTarget.dataset.cur]: e.detail.value
    })
  },
  //获取验证码
  get_Code:function(){
    var _this=this;
    if(!_this.data.phone){
      wx.showToast({
        title: '请输入新手机号码',
        icon: 'none',
        duration: 3000
      });
      return
    }
    if(!_this.checkPhone(_this.data.phone)){
      wx.showToast({
        title: '手机号码格式错误',
        icon: 'none',
        duration: 3000
      });
      return
    }
    app.ajax({
      url: app.api + 'login/send_sms',
      type: 'post',
      data: {
        phone:_this.data.phone
      },
      success(res) {
        _this.sms_Code_Text();
      },
      complete(){
      }
    });
  },
  //更换
  submit:function(){
    var _this = this;
    if(!_this.data.phone){
      wx.showToast({
        title: '请输入新手机号码',
        icon: 'none',
        duration: 3000
      });
      return
    }
    if(!_this.data.code){
      wx.showToast({
        title: '请输入验证码',
        icon: 'none',
        duration: 3000
      });
      return
    }
    app.ajax({
      url: app.api + 'login/index',
      type: 'post',
      data: {
        phone:_this.data.phone,
        smsCode:_this.data.code
      },
      success(res) {
        wx.setStorageSync('Token', res.token);
        wx.showToast({
          title: '登陆成功',
          icon: 'none',
        }, 2000);
        clearTimeout(timeClock);
        var time=setTimeout(function(){
          clearTimeout(time);
          wx.reLaunch({
            url: '/pages/index/index'
          })
        }, 2000)
      },
      complete(){
      }
    });
  },
  //倒计时
  sms_Code_Text:function(){
    var _this=this;
    console.log(1)
    if(_this.data.code_text=='获取验证码'){
      _this.setData({
        timer_num:60
      })
      timeClock=setInterval(function(){
          var number=_this.data.timer_num-1;
          console.log(number)
          _this.setData({
            timer_num:number,
            code_text:"从新发送("+number+")"
          })
          if (number == 0) {
              clearInterval(timeClock);
              _this.setData({
                code_text:"获取验证码"
              })
          }
      },1000)
    }
  },
  //验证手机
  checkPhone:function(value){
    console.log(value)
    var isMob = /^1\d{10}$/; //手机格式验证
		if(isMob.test(value)){
			return true;
		}else{
			return false;
    }
  },
  onShow: function () {},

  onPullDownRefresh: function () {},

  onReachBottom: function () {},

  onShareAppMessage: function () {}
})