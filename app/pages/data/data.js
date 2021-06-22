// pages/data/data.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    pageNo:1,
    limit:8,
    isMore:true,
    list:[],
    title:'',
    urlList:[
      app.imgUrl+'img14.png',
      app.imgUrl+'img15.png',
      app.imgUrl+'img16.png',
      app.imgUrl+'img17.png',
      app.imgUrl+'img18.png',
      app.imgUrl+'img30.png',
    ]
  },
  onLoad: function (options) {},
  onShow: function () {
    var _this=this;
    if(wx.getStorageSync('Token')){
      _this.get_List();
    }else{
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  bindinput: function (e) {
    this.setData({
      [e.currentTarget.dataset.cur]: e.detail.value
    })
  },
  search: function (e){
    this.setData({
      pageNo:1,
    })
    this.get_List();
  },
  get_List:function(){
    var _this = this;
    app.ajax({
      url: app.api + 'product/news',
      type: 'get',
      data: {
        kw:_this.data.title,
        pageNo:_this.data.pageNo,
        limit:_this.data.limit
      },
      success(res) {
        let lists = res.result;
        for(var index in lists){
          lists[index].img=_this.pic_Url(lists[index].type);
        }
        if (_this.data.pageNo == 1) {
          _this.setData({
            list: lists
          })
        }else {
          _this.setData({
            list: _this.data.list.concat(lists)
          })
        }
        const total = res.count;
        if (_this.data.pageNo * _this.data.limit < parseInt(total)) { // 仍未加载完
          _this.setData({
            isMore: true,
            pageNo: _this.data.pageNo + 1
          });
        } else { // 加载完了
          _this.setData({
            isMore: false
          });
        }
      },
      complete(){
      }
    });
  },
  down_File:function(even){
    var _this=this,url=even.currentTarget.dataset.url;
    wx.downloadFile({
      url: url,
      success: function (res) {
        var filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          success: function (res) {
            console.log('打开文档成功')
          }
        })
      }
    })
  },
  pic_Url:function(type){
    if(type==='xls'){
      return this.data.urlList[0]
    }else if(type==='pdf'){
      return this.data.urlList[1]
    }else if(type==='ppt'){
      return this.data.urlList[2]
    }else if(type==='doc'){
      return this.data.urlList[3]
    }else if(type==='zip'){
      return this.data.urlList[4]
    }else{
      return this.data.urlList[5]
    }
  },
  onReachBottom: function () {
    this.get_List();
  },
  onShareAppMessage: function () {}
})