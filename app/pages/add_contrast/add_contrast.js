//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    imgUrl: app.imgUrl,
    id:'',
    item:'',
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
   
    info:'',
    res:'',
    yesId:'',//1介质适应性2介质抗性
  },
  onLoad: function (option) {
    //介质抗性对比或适应性对比
    let yesId = wx.getStorageSync('yesId');
   this.setData({
    yesId,
    item:wx.getStorageSync('yesItem')?wx.getStorageSync('yesItem'):'',
    id:wx.getStorageSync('yesIndex')?wx.getStorageSync('yesIndex'):'',
    speed_Array:yesId==1?['请选择打印速度']:['请选择介质抗性'],
    child_Speed_Array:yesId==1?['请选择打印速度']:['请选择介质抗性']
   })
   console.log(this.data.item)
   console.log(this.data.id)
  },
  onShow:function(){
    var _this=this;
    if(wx.getStorageSync('Token')){
      _this.get_Info();
    }else{
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }
  },
  get_Info:function(){
    var _this = this;
    app.ajax({
      url: app.api + 'product/index',
      type: 'GET',
      data: {},
      success(res) {
        var companyInd='0',arrid='0',speed='0',child_Speed='0',paper='0';
        //console.log(_this.data.item,'------')
        let company = ['请选择公司名称'],company_list = res.pro_data;
        let array=['请选择项目'],array_List=[];
        company_list.forEach((item,index)=>{
          company.push(item.title)
          if(_this.data.item && _this.data.item.companyId==item.id){
            companyInd=parseInt(index)+1;
            array_List=res.pro_data[index].er;
            array_List.forEach((item2,index2)=>{
              array.push(item2.title);
              if(_this.data.item && _this.data.item.id==item2.id){
                arrid=parseInt(index2)+1;
              }
            })
          }
        })
        // var array=['请选择项目'],array_List=res.pro_data;
        // for(var i in array_List){
        //   array.push(array_List[i].title);
        //   if(_this.data.item && _this.data.item.id==array_List[i].id){
        //     arrid=parseInt(i)+1;
        //   }
        // }
        var yesId = _this.data.yesId;
        console.log(yesId,'++++++')
        var speed_Array=yesId==1?['请选择打印速度']:['请选择介质抗性'],speed_List=yesId==1?res.d_data:res.j_data;
        for(var j in speed_List){
          speed_Array.push(speed_List[j].title);
          if(_this.data.item && _this.data.item.type1==speed_List[j].id){
            speed=parseInt(j)+1;
            var list=speed_List[j].er;
            _this.speed_Live(list)
          }
        }
        var paper_Array=['请选择纸张类型'],paper_List=res.z_data;
        for(var s in paper_List){
          paper_Array.push(paper_List[s].title);
          if(_this.data.item && _this.data.item.ctype==paper_List[s].id){
            paper=parseInt(s)+1;
          }
        }
        _this.setData({
          company,
          company_list,
          array:array,
          array_List:array_List,
          speed_Array:speed_Array,
          speed_List:speed_List,
          paper_Array:paper_Array,
          paper_List:paper_List,
          companyInd,
          arrid:arrid,
          speed:speed,
          paper:paper
        })
      },
      complete(){
      }
    });
  },
  //二级速度
  speed_Live:function(list){
    var _this=this,yesId = this.data.yesId,speed_List=yesId==1?['请选择打印速度']:['请选择介质抗性'],index='0';
    for(var j in list){
      speed_List.push(list[j].title);
      if(_this.data.item.type2==list[j].id){
        index=parseInt(j)+1;
      }
    }
    _this.setData({
      child_Speed_Array:speed_List,
      child_Speed_List:list,
      child_Speed:index,
    })
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
    var _this=this,yesId = this.data.yesId,index=e.detail.value,speed_List=yesId==1?['请选择打印速度']:['请选择介质抗性'];
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
  submit:function(){
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
    var data=wx.getStorageSync('yesList');
    var array={
      'companyId':_this.data.company_list[_this.data.companyInd-1].id,
      'id':_this.data.array_List[_this.data.arrid-1].id, //项目id
      'type1':_this.data.speed_List[_this.data.speed-1].id, //一级分类
      'type2':_this.data.child_Speed_List[_this.data.child_Speed-1].id, //二级分类
      'ctype':_this.data.paper_List[_this.data.paper-1].id, //纸张类型
    }
    console.log(_this.data.id)
    if(_this.data.id-1===0 || _this.data.id-1>=1){ //编辑状态
      console.log(1)
      data[_this.data.id-1]=array;
    }else{ //添加状态
      console.log(2)
      data.push(array);
    }
    wx.setStorageSync('yesList', data);
    wx.setStorageSync('yesItem','');
    wx.setStorageSync('yesIndex','');
    wx.navigateTo({
      url: '/pages/compare/compare',
    })
  }
})
