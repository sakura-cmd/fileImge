<template>
  <div class="fileBox">
    <div class="imgShow" @click.stop="uploadImg">
      <!-- 上传文件初始图片 -->
      <div class="initialImg" v-if="initialImg">
        <img :src="initialImgUrl" alt />
        <p>
          <span>点击选择图片</span>
        </p>
      </div>
      <!-- pgn jpg -->
      <img :src="imageUrl" v-if="imageUrl" />
      <!-- pdf -->
      <pdf :src="isPdfUrl" v-if="isPdfUrl"></pdf>
      <!-- 网络请求失败 -->
      <div class="netWorkFail" v-if="netWorkFail">
        <img :src="netWorkFailUrl" alt />
        <p>网络请求失败，请重新上传</p>
      </div>
    </div>
    <input @change="uploadFile($event)" type="file" ref="fileImage" />
    <!-- 文件图片底部信息框 -->
    <div class="filebtm">
      <!-- 文字 -->
      <el-tooltip :content="this.fileData.fileName" placement="top" effect="light">
        <span class="fileName">{{this.fileData.fileName}}</span>
      </el-tooltip>
      <!-- icon -->
      <span class="fileIcon">
        <i class="el-icon-folder-opened" @click.stop="uploadImg"></i>
        <i class="el-icon-zoom-in" @click.stop="previewImage"  :class="previewIconIndex == 1 ? 'iconColor' : ''"></i>
        <i
          class="el-icon-delete"
          @click.stop="delDialog = true,iconIndex=1"
          :class="iconIndex == 1 ? 'iconColor' : ''"
        ></i>
      </span>
    </div>
    <!-- <el-button @click.stop.stop="updaload">上传到服务器</el-button> -->
    <!-- 未上传的图片预览 -->
    <el-dialog :visible.sync="dialogBigimg" center :title="this.fileData.fileName" @close = 'closeDialog'>
      <img :src="imageUrl" v-if="imageUrl" />
      <pdf :src="previewPdfUrl" v-if="previewPdfUrl"></pdf>
    </el-dialog>
    <!-- 删除弹出框 -->
    <div class="delDialog" v-if="delDialog">
      <p class="delDialogTitle">您是否删除该已上传图片？</p>
      <div class="btn">
        <span style="margin-right:14px; color:#AEAEAE;" @click="delDialog = false,iconIndex=-1">取消</span>
        <span @click.stop="deleteImage" style="color: #fff; background:#0046FE;">确定</span>
      </div>
    </div>
  </div>
</template>

<script>
import pdf from "vue-pdf";
export default {
  data() {
    return {
      // jpg/png图片地址
      imageUrl: "",
      // pdf图片地址
      isPdfUrl: "",
      // 预览pdf图片地址
      previewPdfUrl: "",
      // 文件大小
      // size: 0
      //上传文件对象
      fileData: {
        fileName: ""
      },
      //存储的文件对象
      formData: {},
      // 预览显示隐藏
      dialogBigimg: false,
      // 删除显示隐藏
      delDialog: false,
      // icon动态高亮
      iconIndex: -1,
      previewIconIndex: -1,
      // 网络失败
      netWorkFail: false,
      netWorkFailUrl:
        "data:image/png;base64iVBORw0KGgoAAAANSUhEUgAAACMAAAAZCAYAAAC7OJeSAAACDklEQVRIS8WWO4xNURSGvx+FUSiQ0GooNCTXMySCTqug8ChMYyS6CRJB5dUQTGGmGdEhOhJCSCQIglKnIRKRCILE45cl+8pxnHPvuePOtsqz11n/d9be6z9bALaXAUeAlcB74CKwX9KHWM8VSiB3gOkl0QfAaknfcsLcBNbVCG6VdCEnzCdgoEZwRNJQTpjXwNwawaOS9uWEOQ3srhA0sFTS45wwM4HrwPKCaIDslXQ8F0joKI32NGBzYbQv/UtHbC+U9LzXD/kF08+wPR94CmyRdLWX2n2FsR31bgFrgTfAEkkvmwL1G2YPcLIgHma6XtL3JkCNYGwPSPrcqaDtBcATYEYp77CkQ32BsT0PiPE+KGmsqqjtKcDdNADllOjKBkm3uwF17YztcWBbKnQFGJT0tljY9jBwrIPYK2CxpDhHtdERxvaq9MXFvCi8Q9KNZAuLgEcVP9qy6DVgo6TwsMqohbE9FXgYE1Hx5g/gFHAAiPa3um1BWh+WdGIiMPGDPNNFJLZrdkOQSPsKrJEU15O/orIztucA4aCzehBqmvoi+c+78gt1MKPAzqbVJ5B3WdKmrjDp5ncPiHGdzBiSNFIU+KMzyS/ux9VhMilS7S/ACknP2lplmEHgXAaQtkScy5akj/HgN4ztOKyxGIc3Z5yXtL0McxbYlZOioBUmOt6+XIWxhcGF0f2PiG1q/QSc8Kk+ZeMpewAAAABJRU5ErkJggg==",
      // 初始化图片
      initialImg: true,
      initialImgUrl:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAZCAYAAAC7OJeSAAACWUlEQVRIS72WTUhUYRiFn3MnIlsUmFDbNrVok6CVUSDpzPSzLahFP4vcZNBOKghr1d+mqFxUG6OdRdAi9YoygmBiUi1n1yYJJAiTCtM5MTNW6ozzp8y7u9z3nPPc94XvuyJdce/Bvgk0gaYxPdRwldf6nnlfpdICyDCwYWmmxpjlAAnNVYkFEUsNAofyBgY6TZ+eVxHGP8A1+QPdRRhprybMF/DW/IG6Ragr1YOJ+gHyxZxAY6RGQk1UD+aINzFPCN77LzQNEugy/bpTLZB0jjJhzV7HBk6SSjVBMA28WNVEDnsnfUqW+yFZmLWsmLcDHzCnGNCbcqzXGMYiyhByMzDFnOoZ0udSgdYWJu5L2PcWhQ+zWS30aL4UoNJgmlzDqH4WNGzxDiJ+D2xcdpLfINT1tYE56m3MeQKpk349zWva6YBRj2TvtpyaJ1ArfUoUAyo+mZi7wWeyRnrFPG0M6usS46g7kG8XCJskot30aqoQUGGYmPdjj6CFIyDrNAk6R6iBzFPcuzDvwMsu2uWx6iXkGMgrAa0Mc8IRphnHrs8VKwXcB64BCXBDsRUsTLaDUHfLh4m6HflhkZD0uraUBgKY30gHCTWWT5N/Ms2uYz1JcG3JQaU3fmJW9ST0LWeReT3ifoJ9vnT/cjv1klDHi8Nkf0FHgaDciPL61U6orsWaZWtyQNRvEY3lGVfU/QtpH/36+Fe9FCbuNuzHFVlXJkoyqwYSmknL/8PEXUvKSURdZb6VqvSMUGeXwsT8CHyhUsvV6TKHaHd2Mq2uJ/A4EFmdacXqGQI1/AEZ+b+IurEAEwAAAABJRU5ErkJggg==",
      // 占空
      zhankong: ""
    };
  },
  methods: {
    // 展示区域调用函数
    uploadImg() {
      this.$refs.fileImage.dispatchEvent(new MouseEvent("click"));
    },
    uploadFile(el) {
      if (!el.target.files[0].size) return; // 如果文件大小为0，则返回
      // console.log(el);
      // 删除高亮
      this.delDialog = false;
      this.iconIndex = -1;
      // 初始文件图片隐藏
      this.initialImg = false
      // 赋值给空对象
      this.fileData = el.target.files[0];
      this.fileData.fileName = el.target.files[0].name;
      const that = this;
      const reader = new FileReader(); // 创建读取文件对象
      reader.readAsDataURL(el.target.files[0]); // 发起异步请求，读取文件
      reader.onloadstart = function() {
        // 判断是否是pdf文件
        if (el.target.files[0].type == "application/pdf") {
          that.imageUrl = "";
          reader.onload = function() {
            that.isPdfUrl = this.result;
          };
        } else {
          that.isPdfUrl = "";
          that.previewPdfUrl = "";
          reader.onload = function() {
            that.imageUrl = this.result;
          };
        }
      };
      // 把文件存起来
      this.formData = new FormData(); // 创建一个formdata对象
      this.formData.append("testFile", el.target.files[0]);
      // console.log(this.formData);
    },
    // 文件上传
    async updaload() {
      // console.log(this.formData);
      const res = await this.$https.post(
        "https://5df36567.ngrok.io/test/testUpload",
        this.formData
      );
      // 发送请求，保存图片
      if (res.status === 200) {
        console.log("成功", res.data);
      } else {
        console.log("失败", res);
      }
    },
    // 预览
    previewImage() {
      this.previewPdfUrl = this.isPdfUrl;
      this.dialogBigimg = true;
      this.delDialog = false;
      this.iconIndex = -1;
      this.previewIconIndex = 1
      // console.log(this.previewPdfUrl);
    },
    // 删除
    deleteImage() {
      this.imageUrl = "";
      this.isPdfUrl = "";
      this.previewPdfUrl = "";
      this.fileData.fileName = "";
      this.delDialog = false;
      this.iconIndex = -1;
      // 初始文件图片显示
      this.initialImg = true
    },
    // 关闭dialog回调
    closeDialog(){
      this.previewIconIndex = -1
    }
  },
  // 引入组件
  components: {
    pdf
  }
};
</script>

<style lang = 'scss' scoped>
.fileBox {
  width: 256px;
  height: 236px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 8px 0px rgba(39, 59, 100, 0.19);
  border-radius: 1px;
  padding: 8px;
  box-sizing: border-box;
  position: relative;
  float: left;

  input[type="file"] {
    display: none;
  }

  .imgShow {
    width: 240px;
    height: 180px;
    background: rgba(252, 254, 255, 1);
    border-radius: 1px;
    border: 1px dashed rgba(0, 70, 254, 1);
    overflow: auto;
    cursor: pointer;

    img {
      width: 100%;
      height: 174px;
    }

    .initialImg,
    .netWorkFail {
      width: 100%;
      height: 178px;
      background: #e2e4e9;
      border-radius: 1px;
      float: left;
      font-size: 12px;
      text-align: center;
      padding-top: 63px;
      box-sizing: border-box;
      color: #515151;

      img {
        width: 35px;
        height: 25px;
      }

      p {
        margin-top: 25px;
        span {
          text-decoration: underline;
        }
      }
    }
  }
  .filebtm {
    width: 240px;
    height: 32px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
    border-radius: 4px;
    margin-top: 8px;

    span {
      display: inline-block;
      line-height: 32px;
    }

    .fileName {
      float: left;
      width: 150px;
      height: 32px;
      font-size: 12px;
      color: #414141;
      line-height: 32px;
      font-weight: 600;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      padding-left: 8px;
      box-sizing: border-box;
      cursor: pointer;
    }
    .fileIcon {
      width: 90px;
      height: 32px;
      float: right;
      padding: 2px;
      box-sizing: border-box;
      padding-left: 13px;
      i {
        display: inline-block;
        width: 21px;
        height: 24px;
        font-size: 20px;
        color: #bbbbbb;
        cursor: pointer;
        margin-right: 4px;

        &:hover {
          color: #3361ca;
        }
      }

      .iconColor {
        color: #3361ca;
      }
    }
  }
  /* 文件预览 */
  /deep/ .el-dialog {
    width: 600px;
    height: 450px;

    .el-dialog__header {
      width: 600px;
      height: 24px;
      background: rgba(35, 62, 72, 1);
      padding: 0;

      .el-dialog__title {
        font-size: 12px;
        padding: 0;
        color: #ffffff;
      }

      .el-dialog__headerbtn {
        top: 5px;
        right: 12px;
        border: 1px solid #fff;
        border-radius: 50%;
        width: 16px;
        height: 16px;

        .el-dialog__close {
          color: #fff;
          font-size: 10px;
          position: absolute;
          top: 2px;
          right: 1px;
        }
      }
    }
    .el-dialog__body {
      padding: 0 !important;

      span:nth-child(1) {
        margin-left: 25%;
      }
      img {
        width: 600px;
        height: 426px;
      }
    }
  }
  /* 删除弹出框 */
  .delDialog {
    width: 206px;
    height: 95px;
    padding: 28px 31px 0 31px;
    position: absolute;
    box-sizing: border-box;
    font-size: 12px;
    color: #515151;
    right: 0px;
    bottom: -110px;
    z-index: 999;
    background: rgba(0, 0, 0, .8);
    box-shadow: 0px 0px 8px 0px rgba(39, 59, 100, 0.19);

    .btn {
      width: 144px;
      height: 20px;
      margin: 8px auto;
      border-radius: 2px;
      cursor: pointer;
      span {
        display: inline-block;
        width: 60px;
        height: 20px;
        border-radius: 2px;
        text-align: center;
        line-height: 20px;
      }
    }
  }
}
</style>