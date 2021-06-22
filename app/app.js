let CryptoJS = require('./libs/aes');


//加密
let EncryptKey = CryptoJS.enc.Utf8.parse('025c5dbadd682c422bc2c00593d7832e');
let EncryptIv = CryptoJS.enc.Utf8.parse('1234567891234567');

//解密
let DecryptKey = CryptoJS.enc.Utf8.parse('025c5dbadd682c422bc2c00593d7832e');
let DecryptIv = CryptoJS.enc.Utf8.parse('1234567891234567');

let hostType = 2; //1 正式，2 测试
let BOCVER = '1.0.0';
let host = '',
  api = '',
  imgUrl = '';

switch (hostType) {
  case 1: //正式
    host = 'https://buy.xqhzj.com/';
    api = host + 'index.php/web/';
    imgUrl = host + 'wapp/';
    break;
  case 2: //测试 https://demo2.yunmofo.cn/tiandi/index.php/        上线https://china.todaytec.com.cn/index.php/
    // host = 'https://demo2.yunmofo.cn/tiandi/index.php/';
    host = 'https://china.todaytec.com.cn/index.php/';
    api = host + 'api/';
    // imgUrl = 'https://demo2.yunmofo.cn/surun_shop/' + 'wapp/';
    imgUrl = '../../img/';
    break;
}



App({
  imgUrl: imgUrl,
  host: host,
  api: api,
  loginFun: '',
  SDKVersion: '1.6.3',
  canIUse: wx.canIUse('getSystemInfoSync'),
  SystemInfo: wx.getSystemInfoSync(),
  userInfo: '',
  globalData: {
    userInfo: null,
    navHeight: '',
    navTop: '',
    navHeight: ''
  },
  header: {},
  //加密
  Encrypt: (word) => {
    //aes
    let srcs = CryptoJS.enc.Utf8.parse(word);
    // let encrypted = CryptoJS.AES.encrypt(srcs, EncryptKey, {iv: EncryptIv, mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7});
    let encrypted = CryptoJS.AES.encrypt(srcs, EncryptKey, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    let str = encrypted.ciphertext.toString();

    //base64
    let strObj = CryptoJS.enc.Utf8.parse(str);

    return CryptoJS.enc.Base64.stringify(strObj);
  },
  //解密
  Decrypt: (word) => {
    let _this = this;

    try {
      //base64
      let strObj = CryptoJS.enc.Base64.parse(word);
      let str = strObj.toString(CryptoJS.enc.Utf8);

      //aes
      let encryptedHexStr = CryptoJS.enc.Hex.parse(str);
      let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
      // let decrypt = CryptoJS.AES.decrypt(srcs, DecryptKey, {iv: DecryptIv, mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7});
      let decrypt = CryptoJS.AES.decrypt(srcs, DecryptKey, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
      let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);

      return decryptedStr.toString();
    } catch (e) {

    }
  },

  //后台加密
  EncryptBg: (word) => {
    let _this = this;
    try {
      var encryptedData = CryptoJS.AES.encrypt(word, DecryptKey, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
      console.log(encryptedData)
      encryptedData = encryptedData.ciphertext.toString();
      var encryptedHexStr = CryptoJS.enc.Hex.parse(encryptedData);
      var encryptedBase64Str = CryptoJS.enc.Base64.stringify(encryptedHexStr);
      return encryptedBase64Str
    } catch (e) {

    }
  },
  //后台解密
  DecryptBg: (word) => {
    let _this = this;
    try {
      let decrypt = CryptoJS.AES.decrypt(word, DecryptKey, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
      });
      let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
      return decryptedStr.toString();
    } catch (e) {

    }
  },
  onLaunch(res) {
    let _this = this;
    wx.setStorageSync('reloadNumber', 0);
    // wx.setStorageSync('Token', 'Zz5UowzubE/NGyzPdjB1vQw+iNCkTOq6+MiMERfLZbuDyACFbf6uf5XkBmgn/Bxj');

    if (hostType == 2) {
      console.log('%c注意：当前api为测试环境', 'background: #222; color: #bada55');
    }

    let systemInfo = wx.getSystemInfoSync();
    console.log(systemInfo)
    let rect = wx.getMenuButtonBoundingClientRect ? wx.getMenuButtonBoundingClientRect() : null; //胶囊按钮位置信息
    // console.log(rect)
    wx.getMenuButtonBoundingClientRect();
    let navHeight = (function () { //导航栏高度
      let gap = rect.top - systemInfo.statusBarHeight; //动态计算每台手机状态栏到胶囊按钮间距
      return rect.height + rect.top + gap * 2;
    })();
    try {
      rect = Taro.getMenuButtonBoundingClientRect ? Taro.getMenuButtonBoundingClientRect() : null;
      if (rect === null) {
        throw 'getMenuButtonBoundingClientRect error';
      }
      //取值为0的情况
      if (!rect.width) {
        throw 'getMenuButtonBoundingClientRect error';
      }
    } catch (error) {
      let gap = ''; //胶囊按钮上下间距 使导航内容居中
      let width = 96; //胶囊的宽度，android大部分96，ios为88
      if (systemInfo.platform === 'android') {
        gap = 8;
        width = 96;
      } else if (systemInfo.platform === 'devtools') {
        // if (ios) {
        gap = 5.5; //开发工具中ios手机
        // } else {
        //   gap = 7.5; //开发工具中android和其他手机
        // }
      } else {
        gap = 4;
        width = 88;
      }
      if (!systemInfo.statusBarHeight) {
        //开启wifi的情况下修复statusBarHeight值获取不到
        systemInfo.statusBarHeight = systemInfo.screenHeight - systemInfo.windowHeight - 20;
      }
      rect = {
        //获取不到胶囊信息就自定义重置一个
        bottom: systemInfo.statusBarHeight + gap + 32,
        height: 32,
        left: systemInfo.windowWidth - width - 10,
        right: systemInfo.windowWidth - 10,
        top: systemInfo.statusBarHeight + gap,
        width: width
      };
      // console.log('error', error);
      // console.log('rect', rect);
    }
    this.globalData.navDivHeight = rect.height;
    this.globalData.navHeight = navHeight;
    this.globalData.navTop = rect.top;
    this.globalData.navLeft = systemInfo.windowWidth - rect.left - rect.width;

  },

  //loading动画
  load: {
    show: (title = '加载中', mask = true) => {
      wx.showLoading({
        title: title,
        mask: mask
      });
    },
    hide: () => {
      wx.hideLoading();
    }
  },
  globalData: {
    isIphoneX: false,
    userInfo: null
  },
  onShow: function () {
    let that = this;
    wx.getSystemInfo({
      success: res => {
        console.log('手机信息res' + res.model)
        let modelmes = res.model;
        if (modelmes.search('iPhone X') != -1) {
          that.globalData.isIphoneX = true
        }
        if (modelmes.search('unknown<iPhone11,6>') != -1) {
          that.globalData.isIphoneX = true
        }

      }
    })

  },

  //检测登录
  checkLogin(fun) {
    let _this = this;
    //检测版本号
    if (_this.SystemInfo.SDKVersion >= _this.SDKVersion && _this.canIUse) {
      _this.loginFun = fun;
      wx.checkSession({
        success: () => {
          //我方服务器是否登录成功
          if (wx.getStorageSync('Token')) {
            // _this.header['Authorization'] = wx.getStorageSync('Token');
            _this.getUserInfo();
          } else {
            _this.load.show('登录中');
            _this.login();
          }
        },
        fail: () => {
          _this.load.show('登录中');
          _this.login();
        }
      })
    } else {
      _this.load.hide();
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，请升级后再使用。',
        showCancel: false,
        success: () => {
          _this.load.show('请升级微信版本', true);
        }
      });

    }
  },
  //登录
  login() {
    let _this = this;

    wx.login({
      success: (res) => {
        console.log(res.code)
        // return false
        _this.getUserInfo(res.code);
      },
      fail: (res) => {
        console.log('获取用户登录态失败！' + res.errMsg)
      }
    });
  },

  //获取用户信息
  getUserInfo(code) {
    let _this = this;
    //登录
    if (code) {
      // _this.header['Authorization'] = '';
      _this.ajax({
        url: api + 'member/wx_small_login',
        type: 'post',
        data: {
          code: code,
        },
        success(res) {
          wx.setStorageSync('Token', res.token);
          // if(){
          //   wx.setStorageSync('userInfo', JSON.stringify(res));
          // }
          // _this.header['Authorization'] = res.token;
          if (typeof _this.loginFun === 'function') _this.loginFun();
        },
        complete: (res) => {
          _this.load.hide();
        }
      });

    } else {
      if (typeof _this.loginFun === 'function') _this.loginFun();
    }
  },
  wxgetSet: function () {
    wx.getSetting({
      success: res => {
        if (!res.authSetting['scope.userInfo']) {
          wx.redirectTo({
            url: '/pages/index/index'
          });
        } else {
          this._getUserInfo();
        }
      }
    });
  },
  ajax(obj) {
    let _this = this;
    let {
      url = '',
      type = 'POST',
      data = '',

      success = () => {
      },
      fail = () => {
      },
      complete = () => {
      }
    } = obj;
    if (!_this.header['Accept']) _this.header['Accept'] = 'application/json; charset=utf-8';
    if (!_this.header['Content-Type']) _this.header['Content-Type'] = 'application/json';
    // if (!header['Content-Type']) header['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8';
    // if (!header['AppVersion']) header['AppVersion'] = BOCVER;
    if (!_this.header['Platform']) _this.header['Platform'] = '3';
    _this.header['Authorization'] = wx.getStorageSync('Token');

    wx.showLoading();
    wx.request({
      url: url,
      method: type,
      data: data,
      header: _this.header,
      success: (res) => {
        _this.load.hide();
        let resData = res.data;
        if (resData) {
          switch (resData.returnCode) {
            case '200': //正常
              // console.log(_this.DecryptBg(resData.data))
              // success(JSON.parse(_this.DecryptBg(resData.data)));
              success(resData.data);
              break;
            case '0013': //微信未授权
              wx.removeStorageSync('Token'); 
              wx.navigateTo({
                url: '/pages/authorize/authorize'
              });
              break;
            case '0012': //未绑定手机号
              wx.setStorageSync('unionId', resData.data.unionId);
              wx.removeStorageSync('Token');
              wx.navigateTo({
                url: '/pages/bindPone/bindPone'
              });
              break;
            case '0014': //用户登陆状态失效
              let reloadNumber = wx.getStorageSync('reloadNumber');
              wx.navigateTo({
                url: '/pages/login/login'
              });
              // if (!reloadNumber) reloadNumber = 0;
              // console.log(reloadNumber)
              // wx.removeStorageSync('Token');
              // if (reloadNumber <= 5) {
              //   reloadNumber++;
              //   wx.setStorageSync('reloadNumber', reloadNumber);
              //    _this.checkLogin(_this.loginFun);
              // } else {
              //   setTimeout(() => {
              //     _this.load.show('登录失败', { hide: false, mask: true });
              //   }, 100);
              // }
              break;
            default:
              wx.showToast({
                title: resData.msg,
                icon: 'none',
                duration: 3000
              });

              if (resData.msg =='商品已下架'){
                setTimeout(function(){
                  wx.navigateBack({
                    delta: 1
                  })
                },1000)
              }
              break;
          }
        }
      },
      fail: (res) => {
        _this.load.hide();
        wx.showToast({
          title: '网络错误',
          icon: 'none',
          duration: 3000
        });
        fail(res);
      },
      complete: (res) => {
        wx.hideLoading();
        complete(res);
      }
    })
  },
});
