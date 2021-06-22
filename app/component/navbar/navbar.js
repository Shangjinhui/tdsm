// components/navbar/index.js
const App = getApp();
Component({
  options: {
    addGlobalClass: true,
  },
  /**
   * 组件的属性列表
   */
  properties: {
    navData:{
      type: Object,
      value: {},
      observer: function (newVal, oldVal) { },
      tab:''
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    imgUrl: App.imgUrl,
    navDivHeight: App.globalData.navDivHeight,
    navHeight:App.globalData.navHeight,
    navTop: App.globalData.navTop,
    navLeft: App.globalData.navLeft,
    state:false,
  },
  methods:{
    navState(){
      var _this=this;
      _this.setData({
        state:!_this.data.state
      })
    },
   
    NavBack(){
      var _this=this;
      let pages = getCurrentPages();
      _this.setData({
        state:false,
      })
      if (pages.length === 1) {
        wx.reLaunch({
          url: '/pages/index/index',
        })
        return
      }
      wx.navigateBack({
        delta: 1
      })
    },
    NavBackHome(){
      wx.reLaunch({
        url: '/pages/index/index',
      })
    },
    
  },
  
  /**
   * 组件的方法列表
   */
})