const app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    ind: { // 属性名
      type: 'number',
      value: 0,
    },
    storyInfo: { // 店铺信息
      type: 'Object',
      value: '',
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrl: app.imgUrl+'store/',
    ysf: ''
  },
  ready: function() {
    let isIphoneX = app.globalData.isIphoneX;
    this.setData({
      isIphoneX: isIphoneX
    })
    if (wx.getStorageSync('Token')) {
      if (wx.getStorageSync('userInfo')) {
        var info = JSON.parse(app.Decrypt(wx.getStorageSync('userInfo')))
        this.setData({
          info: info,
          ysf: {
            config: JSON.stringify({
              "data": JSON.stringify([{
                "key": "mobile_phone",
                "value": info.tel
              }, ])
            })
          }
        })
      }else{
        this.getInfo();
      }
    }



  },

  methods: {
    //用户信息
    getInfo: function() {
      var _this = this;
      app.ajax({
        url: app.api + 'member/info',
        type: 'GET',
        success(res) {
          var info = res;
          _this.setData({
            info: info,
            ysf: {
              config: JSON.stringify({
                "data": JSON.stringify([{
                  "key": "mobile_phone",
                  "value": info.tel
                }, ])
              })
            }
          })
          wx.setStorageSync('userInfo', app.Encrypt(JSON.stringify(info)));
        },
        complete() {

        }
      });
    },
  }




});