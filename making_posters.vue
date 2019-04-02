<template>
  <Paper>
    <template slot='top-button'>
      <div style="overflow:hidden;">
        <div class="query-btn right">
          <m-button @click="details('formValidate')" class="primary-btn" type="primary">{{ $t('groupMaterial.preview') }}</m-button>
          <m-button @click="createPoster('formValidate')" class="primary-btn" type="primary">{{ $t('groupMaterial.generatePosters') }}</m-button>
          <m-button @click="cancel" class="default-btn" type="default">{{ $t('groupMaterial.cancel') }}</m-button>
        </div>
      </div>
    </template>
    <!-- 左边的图片 -->
    <div class="maxImgBox" @click="removeBorder">
      <div class="left imgs" ref="imageWrapper">
        <img :src="src" alt="" class="maxImg">
        <!-- 左下角的小程序码 先判断点击的是否是新建的  为了确定初始坐标  然后再判断是默认的还是本地上传的 然后用对应的坐标 所以分条件显示-->
        <div v-show='smallProgramAndUpload!=3 && getCode.url && smallProgramAndUpload === 1'  class="programCode" @mousedown="moveImg($event)"
          :style=" newlyBuildAndModify===1 ? {'position':'absolute', 'left': 20 + 'px', 'top': 580 + 'px',backgroundSize:'cover',backgroundPosition:'center',
          backgroundImage: smallProgramAndUpload === 1 ? 'url('+ getCode.url + ')' : 'url('+ uploadProgram.url + ')'} :
          {'position':'absolute', 'left': getCode.x + 'px', 'top': getCode.y + 'px',backgroundSize:'cover',backgroundPosition:'center',
          backgroundImage: smallProgramAndUpload === 1 ? 'url('+ getCode.url + ')' : 'url('+ uploadProgram.url + ')'}">
        </div>
        <div v-show='smallProgramAndUpload!=3 && getCode.url && smallProgramAndUpload === 2'  class="programCode" @mousedown="moveImg($event)"
          :style=" newlyBuildAndModify===1 ? {'position':'absolute', 'left': 20 + 'px', 'top': 580 + 'px',backgroundSize:'cover',backgroundPosition:'center',
          backgroundImage: smallProgramAndUpload === 1 ? 'url('+ getCode.url + ')' : 'url('+ uploadProgram.url + ')'} :
          {'position':'absolute', 'left': uploadProgram.x + 'px', 'top': uploadProgram.y + 'px',backgroundSize:'cover',backgroundPosition:'center',
          backgroundImage: smallProgramAndUpload === 1 ? 'url('+ getCode.url + ')' : 'url('+ uploadProgram.url + ')'}">
        </div>
        <div class="text">
          <ul>
            <li v-for="(item,index) in posterText" :key='index' @mousedown="move($event,item,index)"
            :style="{'position':'absolute', 'left': item.x + 'px', 'top': item.y + 'px',
            color: item.color,fontSize: item.size + 'px'}" :class="{ border: idx===index && item.text.length != 0 }"
            >{{item.text}}
              <span v-for='element in 8' :key='element' v-show="item.text.length!=0 && idx===index"></span>
              <div v-if="item.text.length!=0 && idx===index">
                <img src="@/assets/images/posterDel.svg" alt="" @click="removePster(item)">
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 弹窗 -->
    <Modal width="360" v-model="Popup" :title="$t('groupMaterial.preview')" class="Popup">
      <div class="QRcode">
        <div id="qrcode"></div>
        <p class="scanning">{{ $t('groupMaterial.scanning') }}</p>
        <p class="copyCode">{{ $t('groupMaterial.copyCode') }}</p>
      </div>
      <div slot="footer">
        <m-button @click="copyLink" class="primary-btn" type="primary">{{ $t('groupMaterial.copyLink') }}</m-button>
        <m-button @click="PopupCancel" class="default-btn" type="default">{{ $t('groupMaterial.cancel') }}</m-button>
      </div>
    </Modal>

    <!-- 右边的 -->
    <m-form class="left operation" :rules="ruleValidate" ref="formValidate" :model="formValidate">
      <!-- 输入框部分 -->
      <div class="input">
        <m-form-item :label="$t('groupMaterial.posterName')" prop="name" :label-width="85">
          <m-input v-model="formValidate.name" :placeholder="$t('myPoster.pleaseMyPosterName')" :maxlength='20'
          class="searchInput" @keyup.native='posterNamekeyup'></m-input>
        </m-form-item>
        <div class="length">
          <span class="lengthImg">{{posterNameLength}}</span><span class="totel">/20</span>
        </div>
      </div>

      <!-- 标签部分 -->
      <div class="label">
        <m-form-item :label="$t('groupMaterial.posterBacground')" :label-width="85">
          <m-radio-group v-model="radio">
            <m-radio :label="$t('groupMaterial.uploadLocally')" @click.native="uploadLocally" class="radio"></m-radio>
            <!-- <m-radio :label="$t('groupMaterial.groupMaterialLibrary')" @click.native="groupMaterialLibrary" class="radio group"></m-radio> -->
          </m-radio-group>
        </m-form-item>
      </div>


      <!-- 选择集团素材库出现的 -->
      <div v-if='groupUploda===2'>
        <div class="choiceTemplater">
          <m-form-item :label="$t('groupMaterial.choiceTemplater')" :label-width="85">
            <m-checkbox v-for='(item,index) in labelList' :key='index' @change.native="ChoiceLabel(item)">
              {{ item.name }}
            </m-checkbox>
          </m-form-item>
        </div>
        <div class="imgList">
          <div class="swiper-container">
            <ul class="swiper-wrapper">
              <li class="swiper-slide" v-for="(item,index) in imgList" :key='index'>
                <img :src="item.image" alt="">
                <p>{{ item.name }}</p>
              </li>
            </ul>
          </div>
          <div class="swiper-button-next">
            <i class="iconfont">&#xe61b;</i>
          </div>
          <div class="swiper-button-prev">
            <i class="iconfont">&#xe61b;</i>
          </div>
        </div>
      </div>


      <!-- 选择本地上传出现的 -->
      <div v-show='groupUploda===1'>
        <div class="uploadImg">
          <div>
            <div class="img-group left" v-if='uploadLocal.url'>
              <div class="maxImgBox">
                <template v-if="uploadLocal.status === 'finished'" >
                  <img :src="uploadLocal.url">
                  <img src="@/assets/images/del.png" alt="" class="delImg" @click="delLocalImg">
                </template>
                <template v-else>
                  <m-progress v-if="uploadLocal.showProgress" :percent="uploadLocal.percentage" hide-info></m-progress>
                </template>
              </div>
            </div>
            <m-upload class="left uploads" v-if='!uploadLocal.url'
              ref="upload"
              :show-upload-list="false"
              :on-success="localSuccess"
              :format="['jpg','jpeg','png']"
              :max-size="1024"
              :on-format-error="localFormatError"
              :on-exceeded-size="localMaxSize"
              :on-error='localError'
              type="drag"
              action="/base/cms/file/upload"
              >
              <div class="upload-img">
                <span class="plus">+</span>
                <span class="Choice">{{ $t('myPoster.clickUpload') }}</span>
              </div>
            </m-upload>
          </div>
          <div class="left pictureFormat">
            {{ $t('groupMaterial.pictureFormat') }}
          </div>
        </div>
      </div>

      <!-- 小程序码标签那一块 -->
      <div class="label">
        <div class="left posterLabel">
          <i class="iconfont">&#xe62a;</i>
          <span>{{ $t('groupMaterial.smallProgramCode') }}</span>
          <span class="sign">*</span>
          <div class="bubbleBox">
            <div class="left bubble">
              <div class="right shopCode">{{ $t('groupMaterial.defaultStore') }}</div>
              <div class="triangle_border_up"></div>
            </div>
          </div>
        </div>
        <div class="left">
          <m-radio-group v-model="smallProgramCode">
            <m-radio :label="$t('groupMaterial.default')" @click.native="defaultSmallProgram" class="radio"></m-radio>
            <m-radio :label="$t('groupMaterial.uploadLocally')" @click.native="smallProgramUpload" class="radio"></m-radio>
            <m-radio :label="$t('groupMaterial.noDisplay')" @click.native="hide" class="radio"></m-radio>
          </m-radio-group>
        </div>
      </div>

      <!-- 上传小程序码图片 选择默认小程序旁边的本地上传 -->
      <div class="uploadImg" v-show='smallProgramAndUpload===2' style="marginTop:10px;">
        <div>
          <div class="img-group left" v-if='uploadProgram.url'>
            <div class="maxImgBox">
              <template v-if="uploadProgram.status === 'finished'" >
                <img :src="uploadProgram.url">
                <img src="@/assets/images/del.png" alt="" class="delImg" @click="delProgramImg">
              </template>
              <template v-else>
                <m-progress v-if="uploadProgram.showProgress" :percent="uploadProgram.percentage" hide-info></m-progress>
              </template>
            </div>
          </div>
          <m-upload class="left" v-if='!uploadProgram.url'
            ref="upload"
            :show-upload-list="false"
            :on-success="programSuccess"
            :format="['jpg','jpeg','png']"
            :max-size="1024"
            :on-format-error="programFormatError"
            :on-exceeded-size="programMaxSize"
            :on-error='programError'
            multiple
            type="drag"
            action="/base/cms/file/upload"
            style="display: inline-block;width:86px;">
            <div class="upload-img">
              <span class="plus">+</span>
              <span class="Choice">{{ $t('myPoster.clickUpload') }}</span>
            </div>
          </m-upload>
        </div>
        <div class="left pictureFormat">
          {{ $t('groupMaterial.pictureFormat') }}
        </div>
      </div>


      <!-- 下边的字体颜色和海报文字 -->
      <div class="colorAndBackground">
        <div class="posterColor">
          <div class="left textColor">
            {{ $t('groupMaterial.posterColor') }}
          </div>
          <div class="left scratch" :style="{background:color}"><input type="color" v-model="color" @change="colorChoice"></div>
          <div class="left fontSize">
            <span>{{ $t('groupMaterial.fontSize') }}</span>
            <input type="number" v-model="fontSize" @change="numberChoice">
          </div>
        </div>
        <div class="posterText">
          <m-form-item :label-width="85" :label="$t('groupMaterial.posterText')" v-for='(item,index) in posterText' :key='index'>
            <m-input type="text" v-model="item.text" class="searchInput" :maxlength='20'
            :placeholder="$t('groupMaterial.sweepCodeTwo')" @keyup.native='posterContenkeyup(item)'></m-input>
            <div class="length">
              <span class="totel">/20</span><span class="lengthImg">{{ item.length }}</span>
            </div>
            <span class="add" @click="add(index)" v-show=" index === 0 && posterText.length === 1 ||
            posterText.length > 1 && index!=0 " v-if=" index!=4 ">+</span>
            <span class="reduce" @click="reduce(index)" v-if=" index!=0 || posterText.length==2 "
            >-</span>
          </m-form-item>
        </div>
      </div>
    </m-form>
  </Paper>
</template>

<script>
import QRCode from 'qrcodejs2';

import html2canvas from 'html2canvas';

import Swiper from 'swiper';

import 'swiper/dist/css/swiper.css';

import Paper from '@/components/paper/Paper';

import makingPosters from '@/api/marketing_center/making_posters';

export default {
  components: {
    Paper,
  },
  data() {
    return {
      posterId: '', // 海报ID
      newlyBuildAndModify: 1, // 判断上个页面点进来的是新建还是修改 1是新建  2是修改
      formValidate: { name: '' }, // 输入的海报名称
      html2canvasURL: '', // html2canvas形成的图片路径
      imgUrl: '', // html2canvas形成以后的图片路径  再调接口转换以后的
      posterNameLength: '', // 海报名称输入框数量
      posterText: [
        {
          x: 50, y: 50, text: '', length: '', color: '#000000', size: '',
        },
      ],
      ruleValidate: {
        name: [
          { required: true, message: this.$i18n.t('myPoster.pleacePosterName'), trigger: 'blur' },
        ],
      },
      // 左边海报背景
      src: '', // 左边的大图路径
      color: '', // 左边的海报字体颜色
      fontSize: 14, // 左边的海报字体大小
      idx: '', // 判断点击的时候是哪一个元素
      posterTextItem: {}, // 点击或者拖拽的那个元素
      // 右边的
      imgList: [], // 图片列表
      current: 1, // 当前页
      pages: '', // 总页数(暂时没用)
      size: 3, // 每页数量
      total: '', // 总条数
      Popup: false, // 点击预览出现的弹窗
      radio: '本地上传', // 默认选中本地上传
      uploadLocal: {}, // 本地上传的图片
      groupUploda: 1, // 判断选择文件上传还是集团素材库 1是本地上传  2是集团素材库
      labelList: [], // 节日主题 注销活动 集团大庆 存放标签
      smallProgramCode: '系统默认小程序码', // 选择上传文件的时候 下面的小程序码绑定的值
      getCode: {}, // 一开始请求到的小程序码  如果默认就展示这一个  否则就展示上传的  或者默认不显示
      uploadProgram: {}, // 小程序上传的图片
      smallProgramAndUpload: 1, // 小程序码来源：1店铺小程序码，2电脑上传，3隐藏
    };
  },
  watch: {
    // 判断是否选择了集团素材库然后来调用轮播图
    judge(val) {
      if (!val) {
        this.$nextTick(() => {
          this.initSwiper();
        });
      }
    },
  },
  methods: {
    // 给大图绑定事件 为了移除当前点击的那个元素添加的类名
    removeBorder(e) {
      console.log(e)
      if(e.target.tagName === LI) {
        console.log(111) 
      }
      console.log(e)
      // if(e.target.className!= 'text') {
      //   console.log(111)
      // }
      // this.idx = '';
    },
    // html2canvas插件形成url
    callHtml2canvas() {
      html2canvas(this.$refs.imageWrapper, {
        async: true,
        useCORS: true,
      }).then((canvas) => {
        const dataURL = canvas.toDataURL('image/png');
        this.html2canvasURL = dataURL;
        this.base();
      });
    },
    // 调用接口转换插件形成的url
    base() {
      const uploadBase64 = {
        base64: this.html2canvasURL,
      };
      makingPosters.uploadBase64(uploadBase64).then(res => {
        this.imgUrl = res.data;
        this.qrcode();
      });
    },
    // 选择了集团素材库调用的轮播图
    initSwiper() {
      const that = this;
      this.swiper = new Swiper('.swiper-container', {
        slidesPerView: 3, //  默认几张 如果不够三张就会帮你补齐
        spaceBetween: 15,
        slidesPerGroup: 3, // 每次切换几张  默认一张
        loop: true,
        on: { click(e) { that.SeeImg(e.target); } },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
      });
    },
    // 点击右上角的取消
    cancel() {
      this.$router.push({
        path: 'cms-my-poster',
        query: { newlyBuildAndModify: 2 },
      });
    },
    // 封装的生成海报发起的请求 先动态校验 然后再判断是新增还是修改进来的
    generate(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          const params = {
            bgImg: this.src, // 背景图
            bgSrc: this.groupUploda, // 海报背景来源，1电脑上传，2素材库
            contents: this.posterText, // 文字，json数组
            name: this.formValidate.name, // 海报名称
            posterUrl: this.imgUrl, // 插件形成的整张图片 然后通过接口转换以后的url
            qrcodeSrc: this.smallProgramAndUpload, // 小程序码来源：1店铺小程序码，2电脑上传，3隐藏
          };
          // 判断选择的是默认的  就用请求回来的小程序码 要么就用上传的小程序码 要么就不显示
          if (this.smallProgramAndUpload === 1) {
            params.qrcode = this.getCode.url;
            params.qrcodeX = this.getCode.x; // 拖动的小程序码的X坐标
            params.qrcodeY = this.getCode.y; // 拖动的小程序码的Y坐标
          } else if (this.smallProgramAndUpload === 2) {
            params.qrcode = this.uploadProgram.url;
            params.qrcodeX = this.uploadProgram.x; // 拖动的小程序码的X坐标
            params.qrcodeY = this.uploadProgram.y; // 拖动的小程序码的Y坐标
          } else {
            params.qrcode = '';
            params.qrcodeX = ''; // 拖动的小程序码的X坐标
            params.qrcodeY = ''; // 拖动的小程序码的Y坐标
          }
          // 判断如果是点击修改进来的  就加一个字段  发起修改的请求 否则就发起新增的请求
          if (this.newlyBuildAndModify === 2) {
            params.id = this.posterId;
            makingPosters.updatePoster(params).then(res => {
              if (res.code === 0) {
                this.$router.push({
                  path: 'cms-my-poster',
                });
              } else {
                this.$Message.error(res.msg);
              }
            });
          } else {
            makingPosters.createPoster(params).then(res => {
              if (res.code === 0) {
                this.$router.push({
                  path: 'cms-my-poster',
                });
              } else {
                this.$Message.error(res.msg);
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    // 生成二维码插件
    qrcode() {
      const qrcode = new QRCode('qrcode', { text: this.imgUrl, width: 140, height: 140 });
      if (qrcode) {
        this.Popup = true; // 打开弹窗
      }
    },
    // 点击预览 先校验海报名称是否有填写
    details(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.callHtml2canvas();
        } else {
          return false;
        }
      });
    },
    // 点击生成海报  先执行html2canvas插件  再执行base64接口
    // 再进行动态校验判断有没有填写海报名称然后发起请求发送海报数据
    createPoster(name) {
      html2canvas(this.$refs.imageWrapper, {
        async: true,
        useCORS: true,
      }).then((canvas) => {
        const dataURL = canvas.toDataURL('image/png');
        this.html2canvasURL = dataURL;
        const uploadBase64 = {
          base64: this.html2canvasURL,
        };
        makingPosters.uploadBase64(uploadBase64).then(res => {
          this.imgUrl = res.data;
          this.generate(name);
        });
      });
    },
    // 点击弹窗里面的复制链接
    copyLink() {
      this.$Message.success('复制成功');
      this.Popup = false;
    },
    // 点击预览弹窗的取消
    PopupCancel() {
      this.Popup = false;
    },


    // 在输入海报名称输入框触发
    posterNamekeyup() {
      this.posterNameLength = this.formValidate.name.length;
    },
    // 改变左边大图的路径
    SeeImg(e) {
      this.src = e.src;
    },
    // 选择标签时候发起请求
    ChoiceLabel(item) {
      const params = {
        name: '', // 名称
        pageIndex: this.current, // 第几页
        pageSize: this.size, // 每页数量
        tags: item.id, // 标签
      };
      makingPosters.imgList(params).then(res => {
        if (res.code === 0) {
          this.current = res.data.current; // 当前页
          this.pages = res.data.pages; // 总页数
          this.size = res.data.size; // 每页数量
          this.total = res.data.total; // 总记录数
          this.imgList = res.data.records; // 照片的数组
          this.src = this.imgList[0].image; // 默认显示第一张
        } else {
          this.$Message.error({
            content: res.msg,
          });
        }
      });
    },


    // 拖拽海报上的图片
    moveImg(e) {
      const odiv = e.target;
      const disX = e.clientX - odiv.offsetLeft;
      const disY = e.clientY - odiv.offsetTop;
      document.onmousemove = (event) => {
        event.preventDefault();
        let left = event.clientX - disX;
        let top = event.clientY - disY;
        // 拖动的位置 不管是拖动默认的还是上传的 都写入坐标
        this.getCode.x = left;
        this.getCode.y = top;
        this.uploadProgram.x = left;
        this.uploadProgram.y = top;
        if (left <= 20) {
          left = 20;
          this.getCode.x = left;
        }
        if (left >= 245 - odiv.offsetWidth) {
          left = 245 - odiv.offsetWidth;
          this.getCode.x = left;
        }
        if (top <= 20) {
          top = 20;
          this.getCode.y = top;
        }
        if (top >= 650 - odiv.offsetHeight) {
          top = 650 - odiv.offsetHeight;
          this.getCode.y = top;
        }
        odiv.style.left = left + 'px';
        odiv.style.top = top + 'px';
      };
      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    },
    // 拖拽海报上的文字
    move(e, item, index) {
      this.posterTextItem = item;
      const odiv = e.target;
      const disX = e.clientX - odiv.offsetLeft;
      const disY = e.clientY - odiv.offsetTop;
      document.onmousemove = (event) => {
        event.preventDefault();
        this.idx = index;
        let left = event.clientX - disX;
        let top = event.clientY - disY;
        item.x = left;
        item.y = top;
        if (left <= 20) {
          left = 20;
          item.x = left;
        }
        if (left >= 245 - odiv.offsetWidth) {
          left = 245 - odiv.offsetWidth;
          item.x = left;
        }
        if (top <= 20) {
          top = 20;
          item.y = top;
        }
        if (top >= 650 - odiv.offsetHeight) {
          top = 650 - odiv.offsetHeight;
          item.y = top;
        }
        odiv.style.left = left + 'px';
        odiv.style.top = top + 'px';
      };
      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    },
    // 选择海报上的字体大小
    numberChoice() {
      this.posterTextItem.size = this.fontSize;
    },
    // 选择海报上的字体颜色
    colorChoice() {
      this.posterTextItem.color = this.color;
    },
    // 在输入海报内容输入框触发
    posterContenkeyup(item) {
      item.length = item.text.length;
    },
    // 增加海报内容
    add() {
      if (this.posterText.length === 5) {
        this.$Message.info({
          content: '最多只能添加五条信息',
        });
      } else {
        const obj = {};
        obj.x = 50;
        obj.y = 50;
        obj.text = '';
        obj.length = '';
        obj.color = '#000000';
        obj.size = 14;
        this.posterText.push(obj);
      }
    },
    // 移除海报内容
    reduce(index) {
      this.posterText.splice(index, 1);
    },
    // 删除海报内容
    removePster(item) {
      item.text = '';
    },

    // 选择本地上传radio标签
    uploadLocally() {
      this.groupUploda = 1;
    },
    // 选择集团素材库radio标签
    groupMaterialLibrary() {
      this.groupUploda = 2;
      this.initSwiper();
    },


    // 选择默认小程序radio标签
    defaultSmallProgram() {
      this.smallProgramAndUpload = 1;
    },
    // 选择本地上传radio标签
    smallProgramUpload() {
      this.smallProgramAndUpload = 2;
    },
    // 选择隐藏不显示radio标签
    hide() {
      this.smallProgramAndUpload = 3;
    },


    // 本地上传成功的钩子
    localSuccess(response, file, fileList) {
      this.uploadLocal = fileList[0];
      this.uploadLocal.url = fileList[0].response.data;
      this.src = fileList[0].response.data;
    },
    // 本地上传格式验证失败的钩子
    localFormatError(file) {
      this.$Message.error(file.name + ' is incorrect, please select jpg or png.');
    },
    // 本地上传大小限制钩子
    localMaxSize(file) {
      this.$Message.error(file.name + '文件大小超过限制');
    },
    // 本地上传失败的钩子
    localError(error, file, fileList) {
      this.$Message.error(error);
      this.$Message.error(file);
      this.$Message.error(fileList);
    },
    // 删除本地上传的图片
    delLocalImg() {
      this.uploadLocal = {};
      // this.$forceUpdate();
    },


    // 小程序码上传成功的钩子
    programSuccess(response, file, fileList) {
      const X = this.uploadProgram.X;
      const Y = this.uploadProgram.Y;
      this.uploadProgram = fileList[0];
      this.uploadProgram.X = X;
      this.uploadProgram.Y = Y;
      this.uploadProgram.url = fileList[0].response.data;
    },
    // 小程序码格式验证失败的钩子
    programFormatError(file) {
      this.$Message.error(file.name + ' is incorrect, please select jpg or png.');
    },
    // 小程序码大小限制钩子
    programMaxSize(file) {
      this.$Message.error(file.name + '文件大小超过限制');
    },
    // 小程序码上传失败的钩子
    programError(error, file, fileList) {
      this.$Message.error(error);
      this.$Message.error(file);
      this.$Message.error(fileList);
    },
    // 删除上传的小程序图片
    delProgramImg() {
      this.uploadProgram = {};
    },


    // 一开始获取到海报参数 get请求已经把海报id传过去了
    getPoster() {
      makingPosters.getPoster(this.posterId).then(res => {
        if (res.code === 0) {
          this.src = res.data.bgImg;// 大图的路径
          this.groupUploda = res.data.bgSrc; // 选择的是上传文件还是集团素材库
          this.posterText = res.data.contents; // 海报内容
          this.formValidate.name = res.data.name; // 海报名称
          this.smallProgramAndUpload = res.data.qrcodeSrc; // 1店铺小程序码，2电脑上传，3隐藏
          if (res.data.qrcodeSrc === 2) { // 如果选择的是上传文件 否则就用一开始请求到默认的
            this.smallProgramCode = '本地上传';
            this.uploadProgram.url = res.data.qrcode;
            this.uploadProgram.x = res.data.qrcodeX;
            this.uploadProgram.y = res.data.qrcodeY;
            console.log(this.uploadProgram)
          } else if (res.data.qrcodeSrc === 1) { // 写入坐标
            this.getCode.x = res.data.qrcodeX;
            this.getCode.y = res.data.qrcodeY;
          }
        } else {
          this.$Message.error({
            content: res.msg,
          });
        }
      });
    },
    // 获取店铺小程序码  选择默认的时候展示的
    getSmallProgram() {
      makingPosters.getSmallProgram().then(res => {
        if (res.data) {
          this.getCode.url = res.data;
          this.$forceUpdate();
        }
      });
    },
    // 获取标签
    getLabelList() {
      makingPosters.labelList().then(res => {
        if (res.code === 0) {
          this.labelList = res.data;
        } else {
          this.$Message.error({
            content: res.msg,
          });
        }
      });
    },
    // 获取素材列表
    getImgList() {
      const params = {
        name: '', // 名称
        pageIndex: this.current, // 第几页
        pageSize: this.size, // 每页数量
        tags: '', //  标签
      };
      makingPosters.imgList(params).then(res => {
        if (res.code === 0) {
          this.current = res.data.current; // 当前页
          this.pages = res.data.pages; // 总页数
          this.size = res.data.size; // 每页数量
          this.total = res.data.total; // 总记录数
          this.imgList = res.data.records; // 照片的数组
          if (!this.src) {
            this.src = this.imgList[0].image; // 默认显示第一张
          }
        } else {
          this.$Message.error({
            content: res.msg,
          });
        }
      });
    },
  },
  created() {
    if (this.$route.query.newlyBuildAndModify) {
      this.newlyBuildAndModify = this.$route.query.newlyBuildAndModify;
    }
    // this.getSmallProgram();
    // this.getLabelList();
    // this.getImgList();
    // 判断是点击修改才请求海报参数
    if (this.newlyBuildAndModify === 2) {
      this.posterId = this.$route.query.id;
      this.getPoster();
    }
    // 判断是点击新建进来的就设置小程序码的默认坐标
    if (this.newlyBuildAndModify === 1) {
      this.getCode.x = 20;
      this.getCode.y = 580;
    }
  },
};
</script>
<style scoped lang="less">
  .left {
    float: left;
  }
  .right {
    float: right;
  }

  // 左边部分
  .maxImgBox {
    float: left;
    width: 446px;
    height: 807px;
    background: url('../../../../assets/images/phone.png') no-repeat;
    background-size:446px 807px;
    .imgs {
      width: 265px;
      height: 670px;
      position: relative;
      margin-left: 130px;
      margin-top: 48px;
      img {
        width: 265px;
        height: 670px;
        border-radius: 20px;
      }
      .programCode {
        width: 77px;
        height: 77px;
      }
      .text {
        li {
          position: absolute;
          padding: 6px;
          div {
            position: absolute;
            top: -60%;
            left: -20px;
            img {
              width: 26px;
              height: 26px;
            }
          }
          span {
            display: inline-block;
            width: 6px;
            height: 6px;
            border-radius: 50%;
            border: 1px solid #3AA5FF;
            background: #FFFFFF;
          }
        }
        li span:nth-child(1) {
          top: -3px;
          right: -3px;
          position: absolute;
        }
        li span:nth-child(2) {
          top: -3px;
          left: -3px;
          position: absolute;
        }
        li span:nth-child(3) {
          bottom: -3px;
          right: -3px;
          position: absolute;
        }
        li span:nth-child(4) {
          bottom: -3px;
          left: -3px;
          position: absolute;
        }
        li span:nth-child(5) {
          top: -3px;
          right: 50%;
          position: absolute;
          transform: translateX(3PX);
        }
        li span:nth-child(6) {
          bottom: -3px;
          right: 50%;
          position: absolute;
          transform: translateX(3PX);
        }
        li span:nth-child(7) {
          top: 50%;
          right: -3px;
          position: absolute;
          transform: translateY(-3PX);
        }
        li span:nth-child(8) {
          top: 50%;
          left: -3px;
          position: absolute;
          transform: translateY(-3PX);
        }
      }
    }
  }
  
  // 弹窗
  .Popup {
    .QRcode {
      text-align: center;
      margin-top: 11px;
      #qrcode {
        text-align: center;
        padding-left: 94px;
      }
      p {
        margin-top: 10px;
      }
      .scanning {
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #333333;
        letter-spacing: 0;
      }
      .copyCode {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #666666;
        letter-spacing: 0;
      }
    }
  }

  // 右边部分
  .operation {
    margin-left: 57px;
    margin-top: 20px;
    .input {
      position: relative;
      overflow: hidden;
      width: 402px;
      .searchInput {
        width: 317px;
        height: 30px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #333333;
        letter-spacing: 0;
      }
      .length {
        position: absolute;
        right: 0;
        bottom: 0;
        .totel {
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #ccc;
          letter-spacing: 0;
          line-height: 17px;
        }
        .lengthImg {
          color: #333333;
          font-size: 12px;
        }
      }
    }
    // 选择本地上传还是集团素材库标签部分
    .label {
      height: 32px;
      overflow: hidden;
      .radio {
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #333333;
        letter-spacing: 0;
      }
      .group {
        margin-left: 10px;
      }
    }
    // 轮播图部分
    .imgList {
      width: 535px;
      position: relative;
      margin: 25px 0;
      overflow: hidden;
      padding: 0 45px;
      li {
        width: 120px;
        height: 190px;
        text-align: center;
        float: left;
        img {
          width: 120px;
          height: 160px;
        }
      }
      .swiper-button-prev,.swiper-button-next {
        height: 32px;
        width: 32px;
        background:rgba(51,51,51,0.50);
        border-radius: 50%;
        font-size: 18px;
        color: #ffffff;
        line-height: 32px;
        text-align: center;
        outline: none;
      }
      .swiper-button-prev {
        position: absolute;
        left: 10px;
      }
      .swiper-button-next {
        position: absolute;
        right: 10px;
        transform: rotate(180deg);
      }
    }
    // 下面的海报颜色和海报文字
    .colorAndBackground {
      .posterColor {
        .textColor {
          width: 85px;
          text-align: center;
        }
        height: 35px;
        margin-top: 24px;
        .scratch {
          background: #000000;
          width: 80px;
          height: 32px;
          border: 1px solid #dddddd;
          input {
            width: 80px;
            height: 32px;
            outline: none;
            opacity: 0;
          }
        }
        .fontSize {
          margin-left: 40px;
          span {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #666666;
            letter-spacing: 0;
            text-align: right;
            line-height: 14px;
          }
          input {
            border: 1px solid #E5E5E5;
            border-radius: 2px;
            width: 80px;
            height: 32px;
            margin-left: 13px;
            padding-left: 10px;
          }
        }
      }
      .posterText {
        margin-top: 24px;
        .searchInput {
          width: 317px;
        }
        .length {
          position: absolute;
          left: 285px;
          bottom: -25px;
          width: 33px;
          .lengthImg {
            color: #333333;
            font-size: 12px;
            float: right;
            padding-top: 1px;
          }
          .totel {
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #ccc;
            letter-spacing: 0;
            float: right;
          }
        }
        .reduce,.add {
          display: inline-block;
          width: 18px;
          height: 18px;
          text-align: center;
          line-height: 18px;
          border-radius: 50%;
          cursor: pointer;
        }
        .reduce {
          background: #FF6464;
          color: #ffffff;
          margin-left: 5px;
        }
        .add {
          background: #3AA5FF;
          color: #ffffff;
          margin:0 5px;
        }
      }
    }
  }
  // 选择小程序码标签那一行
  .posterLabel {
    position: relative;
    //系统默认小程序的提示气泡
    .bubbleBox {
      display: none;
      position: absolute;
      top: 30px;
      left: -40px;
      .bubble {
        width: 126px;
        margin-top: 5px;
        padding-right: 10px;
        position: relative;
        .shopCode {
          opacity: 0.8;
          background: #333333;
          box-shadow: 0 2px 4px 0 rgba(0,0,0,0.18);
          border-radius: 3px ;
          width: 94px;
          height: 40px;
          font-family: PingFangSC-Regular;
          font-size: 12px;
          color: #FFFFFF;
          letter-spacing: 0;
          text-align: left;
          padding: 0 10px;
        }
        .triangle_border_up {
          width:0;height:0;
          border-width:0 5px 5px;
          border-style:solid;
          float: left;
          border-color:transparent transparent #333333;
          position: absolute;
          top: -5px;
          left: 45px;
        }
      }
    }
    span {
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #666666;
      letter-spacing: 0;
      text-align: right;
      line-height: 14px;
    }
    .sign {
      color: #FF6464;
      margin-right: 5px;
    }
    i {
      color: #3AA5FF;
    }
  }
  .posterLabel:hover .bubbleBox {
    display: block;
  }
  // 选择集团素材库的时候样式
  .choiceTemplater {
    margin-top: 10px;
  }

  // 选择上传时候出现的样式
  .uploadImg {
    margin: 10px 0;
    overflow: hidden;
    margin-left: 85px;
    width: 100%;
    //选择图片输入框
    .upload-img {
      position: relative;
      width: 86px;
      height:86px;
      .plus {
        position: absolute;
        width: 36px;
        height: 36px;
        text-align: center;
        line-height: 36px;
        top: 10px;
        left: 18px;
        font-family: PingFangSC-Regular;
        font-size: 60px;
        color: #979797;
        letter-spacing: 0
      }
      .Choice {
        position: absolute;
        width: 100%;
        top: 55px;
        left: 0;
        font-family: PingFangSC-Regular;
        font-size: 12px;
        color: #666666;
        letter-spacing: 0
      }
    }
    //选择的图片列表
    .img-group{
      width: 86px;
      height: 86px;
      text-align: center;
      line-height: 86px;
      border: 1px solid transparent;
      border-radius: 4px;
      position: relative;
      background: #fff;
      box-shadow: 0 1px 1px rgba(0,0,0,.2);
      margin-right: 4px;
      .maxImgBox {
        width: 86px;
        height: 86px;
        padding-top: 3px;
        .delImg {
          position: absolute;
          top: -3px;
          right: -10px;
          width: 15px;
          height: 15px;
        }
      }
      img{
        width: 86px;
        height: 86px;
      }
    }
    //上传图片格式要求
    .pictureFormat {
      width: 300px;
      font-family: PingFangSC-Regular;
      font-size: 13px;
      color: #666666;
      letter-spacing: 0;
      margin-left: 10px;
      margin-top: 50px;
    }
  }
  .uploads {
    display: inline-block;
    width: 86px;
  }
  // 选中的海报文字加的样式
  .border {
    border: 1px solid #3AA5FF;
    cursor: move;
  }
</style>
