//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    imgUrl: app.imgUrl,
    id:1,
    state:false,
    company:['请选择公司名称'],
    company_list:[],
    companyInd:0,
    array: ['请选择项目'],
    array_List:[],
    arrid:0,
    speed_Array:['请选择打印速度'],
    speed_List:[],
    speed:0,
    child_Speed_Array:['请选择打印速度'],
    child_Speed_List:[],
    child_Speed:0,
    paper:0,
    paper_Array:['请选择纸张类型'],
    paper_List:[],
    circle:2, //温度范围
    arrays:[
      {
        name:'温度范围',
        title:'无-无',
        img:app.imgUrl +'img8.png',
      },
      {
        name:'窗口',
        title:'0',
        img:app.imgUrl +'img7.png',
      },
      {
        name:'密度值',
        title:'2.13',
        img:app.imgUrl +'img9.png',
      },
      {
        name:'可打印最小字号',
        title:'4号',
        img:app.imgUrl +'img6.png',
      },
      {
        name:'边界是否清晰',
        title:'边界清晰，无缺边缺角',
        img:app.imgUrl +'img10.png',
      },
      {
        name:'介质适应性',
        title:'',
        img:app.imgUrl +'img11.png',
      }
    ],
    info:'',
    res:'',
  },
  onLoad: function () {},
  onShow: function () {
    var _this=this;
    wx.setStorageSync('yesList', '');
    wx.setStorageSync('yesId','');
    wx.setStorageSync('yesItem','');
    wx.setStorageSync('yesIndex','');
    if(wx.getStorageSync('Token')){
      _this.get_Info();
    }else{
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
    _this.setData({
      companyInd:0,
      arrid:0,
      speed:0,
      child_Speed:0,
      paper:0,
    })
  },
  get_Info:function(){
    var _this = this;
    app.ajax({
      url: app.api + 'product/index',
      type: 'GET',
      data: {},
      success(res) {
        console.log(res)
        let company = ['请选择公司名称'],company_list = res.pro_data;
        company_list.forEach(item=>{
          company.push(item.title)
        })
        
        // var array=['请选择项目'],array_List=res.pro_data[0].er;
        // for(var i in array_List){
        //   array.push(array_List[i].title)
        // }
        var speed_Array=['请选择打印速度'],speed_List=res.d_data;
        for(var j in speed_List){
          speed_Array.push(speed_List[j].title)
        }
        var paper_Array=['请选择纸张类型'],paper_List=res.z_data;
        for(var s in paper_List){
          paper_Array.push(paper_List[s].title)
        }
        _this.setData({
          company,
          company_list,
          // array:array,
          // array_List:array_List,
          speed_Array:speed_Array,
          speed_List:speed_List,
          paper_Array:paper_Array,
          paper_List:paper_List,
        })
      },
      complete(){
      }
    });
  },
  //详情-收起-展开
  dataSwitch:function(event){
    var _this=this,sub=event.currentTarget.dataset.id;
    if(sub==2){
      if(_this.data.arrid!=0 && _this.data.speed!=0 && _this.data.child_Speed!=0 && _this.data.paper!=0){
        _this.search(1);
        _this.setData({
          state:true
        })
      }else{
        if(_this.data.arrid==0){
          wx.showToast({
            title: '请选择项目类型',
            icon: 'none',
          }, 2000);
          return
        }
        _this.search(2);
        _this.setData({
          state:true
        })
      }
    }else{
      _this.setData({
        state:false
      })
    }
  },
  //选择公司
  chooseCompany(e){
    console.log(e.detail.value)
    this.setData({
      companyInd:e.detail.value
    })
    this.changeProject(e.detail.value);
  },
  changeProject(ind){
    var company_list = this.data.company_list,array=['请选择项目'],array_List=company_list[ind-1].er;
    for(var i in array_List){
      array.push(array_List[i].title)
    }
    this.setData({
      arrid:0,
      array,
      array_List,
    })
  },
  //选择项目
  item_BindPickerChange:function(e){
    this.setData({
      arrid:e.detail.value
    })
  },
  //打印速度
  speed_BindPickerChange:function(e){
    var _this=this,index=e.detail.value,speed_List=['请选择打印速度'];
    if(!index==0){
      var list=_this.data.speed_List[index-1].er;
      this.setData({
        child_Speed_Array:speed_List,
        child_Speed_List:[],
        child_Speed:list.length==1?1:0
      })
      if(list.length){
        for(var i in list){
          speed_List.push(list[i].title)
        }
        this.setData({
          speed:index,
          child_Speed_Array:speed_List,
          child_Speed_List:list
        })
      }
    }else{ //选择空-清空子集数据
      this.setData({
        child_Speed_Array:speed_List,
        child_Speed_List:[],
        child_Speed:0
      })
    }
    
    console.log(index)
  },
  //打印速度
  child_Speed_BindPickerChange:function(e){
    var _this=this,index=e.detail.value;
    this.setData({
      child_Speed:e.detail.value
    })
  },
  //纸张类型
  paper_BindPickerChange:function(e){
    this.setData({
      paper:e.detail.value
    })
  },
  //搜索
  search:function(e){
    var _this=this,data={};
    if(e==2){  //仅按项目id搜索
      data={
        id:_this.data.array_List[_this.data.arrid-1].id,
        d_type1:'',
        d_type2:'',
        d_ctype:''
      }
    }else{ //全搜
      if(_this.data.companyInd==0){
        wx.showToast({
          title: '请选择公司名称',
          icon: 'none',
        }, 2000);
        return
      }
      if(_this.data.arrid==0){
        wx.showToast({
          title: '请选择项目类型',
          icon: 'none',
        }, 2000);
        return
      }
      if(_this.data.speed==0 || _this.data.child_Speed==0){
        wx.showToast({
          title: '请选择打印速度',
          icon: 'none',
        }, 2000);
        return
      }
      if(_this.data.paper==0){
        wx.showToast({
          title: '请选择纸张类型',
          icon: 'none',
        }, 2000);
        return
      }
      data={
        companyId:_this.data.company_list[_this.data.companyInd-1].id,//公司id
        id:_this.data.array_List[_this.data.arrid-1].id, //项目id
        d_type1:_this.data.speed_List[_this.data.speed-1].id,//	打印速度1	String	true
        d_type2:_this.data.child_Speed_List[_this.data.child_Speed-1].id,//	打印速度2	String	true
        d_ctype:_this.data.paper_List[_this.data.paper-1].id,//	纸张类型	String	true
      }
    }
    app.ajax({
      url: app.api + 'product/info',
      type: 'GET',
      data:data,
      success(res) {
        var data=res.sy_data;
        if(data){
          for(var index in data){
            data[index].src=_this.data.arrays[index].img;
          }
        }
        _this.setData({
          info:res,
          res:data
        })
      },
      complete(){
      }
    });

  },
  comparison:function(){
    var _this=this;
    if(_this.data.companyInd==0){
      wx.showToast({
        title: '请选择公司名称',
        icon: 'none',
      }, 2000);
      return
    }
    if(_this.data.arrid==0){
      wx.showToast({
        title: '请选择项目类型',
        icon: 'none',
      }, 2000);
      return
    }
    if(_this.data.speed==0 || _this.data.child_Speed==0){
      wx.showToast({
        title: '请选择打印速度',
        icon: 'none',
      }, 2000);
      return
    }
    if(_this.data.paper==0){
      wx.showToast({
        title: '请选择纸张类型',
        icon: 'none',
      }, 2000);
      return
    }
    var data=[];
    var array={
      'companyId':_this.data.company_list[_this.data.companyInd-1].id,//公司id
      'id':_this.data.array_List[_this.data.arrid-1].id, //项目id
      'type1':_this.data.speed_List[_this.data.speed-1].id, //一级分类
      'type2':_this.data.child_Speed_List[_this.data.child_Speed-1].id, //二级分类
      'ctype':_this.data.paper_List[_this.data.paper-1].id, //纸张类型
    }
    data.push(array);
    wx.setStorageSync('yesList', data);
    wx.setStorageSync('yesId', 1);
    wx.navigateTo({
      url: '/pages/compare/compare',
    })
  },
})
