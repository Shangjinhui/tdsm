// pages/compare/compare.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    scrollLeft:0,
    scrollLefts:0,
    state:false, //测试环境状态
    sub:1, //页面滚动下标

    id:'',
    array:[],
    list:[],
    length:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //介质抗性对比或适应性对比
    let yesId = wx.getStorageSync('yesId'),yesList = wx.getStorageSync('yesList');
    console.log(yesId,yesList)
    let title = ['介质适应性对比','介质抗性对比']
    wx.setNavigationBarTitle({
      title: title[yesId-1]||'',
    })
    
  },
  //测试环境状态
  navList:function(e){
    this.setData({
      state:!this.data.state
    })
  },
  navTop:function(e){
    var _this=this,_top=e.currentTarget.dataset.top;
    _this.setData({
      sub:e.currentTarget.dataset.id,
      state:!this.data.state
    })
    wx.pageScrollTo({
      scrollTop: _top,
      duration: 300
    }); 
  },
  scroll_End:function(e){
    this.setData({
      scrollLefts:e.detail.scrollLeft
    })
  },
  scroll_Ends:function(e){
    this.setData({
      scrollLeft:e.detail.scrollLeft
    })
  },
  //添加对比
  add_Compare:function(){
    wx.navigateTo({
      url:'/pages/add_contrast/add_contrast'
    })
  },
  onShow: function () {
    var _this=this;
    _this.setData({
      id:wx.getStorageSync('yesId'),
      array:wx.getStorageSync('yesList'),
    })
    if(wx.getStorageSync('yesId')){
      _this.get_List();
    }
  },
  get_List:function(){
    var _this = this,data=JSON.stringify(_this.data.array);
    app.ajax({
      url: app.api + 'product/infos',
      type: 'POST',
      data: JSON.stringify({
        type:_this.data.id,
        pro:data
      }),
      success(res) {
        _this.setData({
          list:res,
          length:res.length>0?res.length:1,
        })
        console.log(res[0].temperature)
      },
      complete(){
        
      }
    });
  },
  edit_Item:function(e){
    var _this=this;
    var index=e.currentTarget.dataset.index;
    var list=wx.getStorageSync('yesList');
    if(list){
      wx.setStorageSync('yesItem',list[index]);
      wx.setStorageSync('yesIndex',index+1);
      console.log(wx.getStorageSync('yesIndex'))
      wx.navigateTo({
        url: '/pages/add_contrast/add_contrast',
      })
    }
  },
  delete_Item:function(e){
    var _this=this,index=e.currentTarget.dataset.index;
    var array=_this.data.array,arrays=[],list=_this.data.list,lists=[];
    console.log(index)
    for(var i in list){
      console.log('22222')
      if(i!=index){
        console.log('11111')
        arrays.push(array[i]);
        lists.push(list[i]);
      }
    }
    console.log(arrays)
    _this.setData({
      array:arrays,
      list:lists
    })
    wx.setStorageSync('yesList',arrays);
  },
  link_Page:function(){
    var _this=this;
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {}
})