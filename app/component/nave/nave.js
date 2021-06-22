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
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    // imgUrl:'../../static/img/',
    info:'',
  },
  ready: function() {
    let isIphoneX = app.globalData.isIphoneX;
    this.setData({
      isIphoneX: isIphoneX
    })
  },
  methods: {
    navNumber:function(){
      var _this = this;
      app.ajax({
        url: app.api + 'information/not_read',
        type: 'GET',
        data: {},
        success(res) {
          _this.setData({
            info:res
          })
        },
        complete(){}
      })
    },
  },
});