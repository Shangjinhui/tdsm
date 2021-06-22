// pages/center/center.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: app.imgUrl,
    info:'',
    avatar:'',
    avatarid:'',
  },
  onLoad: function (options) {},

  onShow: function(){
    var _this=this;
    if(wx.getStorageSync('Token')){
      _this.get_Info();
    }else{
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  //个人信息
  get_Info:function(){
    var _this = this;
    app.ajax({
      url: app.api + 'member/index',
      type: 'get',
      data: {},
      success(res) {
        _this.setData({
          info:res.result,
          avatar:res.result.photoUrl
        })
      },
      complete(){
      }
    });
  },
  drop_Out:function(){
    var _this=this;
    wx.setStorageSync('Token');
    wx.reLaunch({
      url: '/pages/login/login'
    })
  },
  //上传头像
  changeAvatar: function() {
    var _this = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      success: function(res) {
        const tempFilePaths = res.tempFilePaths;
        console.log(tempFilePaths)
        let avatar = _this.data.avatar;
        _this.setData({
          avatar: tempFilePaths[0],
        })
        wx.uploadFile({
          url: app.api + 'fileupload/files',
          filePath: tempFilePaths[0],
          header: {
            "content-type": 'application/x-www-form-urlencoded'
          },
          name: 'uploadFile',
          formData: null,
          success: (resp) => {
            let data = JSON.parse(resp.data)
            _this.setData({
              avatarid: data.data.id,
            })
            _this.eidt_Avatar();
          },
          fail: (res) => {
            fail++;
            wx.showToast({
              title: JSON.parse(res.data).msg,
              icon: 'none'
            });
          },
          complete: (res) => {
            let data = JSON.parse(res.data)
            // _this.setData({
            //   zhenglistid: data.data.id
            // })
            
          }
        });
      }
    })
  },
  //更新头像
  eidt_Avatar:function(){
    var _this = this;
    console.log(_this.data.avatarid)
    app.ajax({
      url: app.api + 'member/eidt_info',
      type: 'POST',
      data: JSON.stringify({
        photo:_this.data.avatarid
      }),
      success(res) {
        console.log(2323)
        wx.showToast({
          title: '修改成功',
          icon: 'none',
        }, 2000);
      },
      complete(){
      }
    });
  },
  onPullDownRefresh: function () {},

  onReachBottom: function () {},

  onShareAppMessage: function () {}
})