<template>
  <div class="showImgBox">
    <div class="fileImg" @click.stop="previewImage">
      <img :src="showImageUrl" v-if="showImageUrl" />
      <!-- <pdf :src="showPdfUrl" v-if="showPdfUrl"></pdf> -->
      <iframe
        :src="showPdfUrl"
        v-if="showPdfUrl"
        frameborder="0"
        class="isPdf"
        type="application/pdf"
      ></iframe>
      <!-- 网速过慢,请重新刷新 -->
      <!-- 网络请求失败 -->
      <div class="netWorkFail" v-if="netWorkFail">
        <img :src="netWorkFailUrl" alt />
        <p>网络请求失败，请重新刷新</p>
      </div>
    </div>
    <!-- 文件图片底部信息框 -->
    <div class="filebtm">
      <!-- 文字 -->
      <el-tooltip :content="this.fileData.fileName" placement="top" effect="light">
        <span class="fileName">{{this.fileData.fileName}}</span>
      </el-tooltip>
      <!-- icon -->
      <span class="fileIcon">
        <i class="el-icon-zoom-in" @click.stop="previewImage" :class="previewIconIndex == 1 ? 'iconColor' : ''"></i>
      </span>
    </div>
    <!-- 服务器图片预览 -->
    <el-dialog :visible.sync="dialogBigimg" center :title="this.fileData.fileName" @close = 'closeDialog'>
      <img :src="showImageUrl" v-if="showImageUrl" />
      <!-- <pdf :src="showPdfUrl" v-if="showPdfUrl"></pdf> -->
      <iframe
        :src="showPdfUrl"
        v-if="showPdfUrl"
        frameborder="0"
        class="isPdf"
        type="application/pdf"
        width="100%"
        height="100%"
      ></iframe>
    </el-dialog>
  </div>
</template>

<script>
// import pdf from "vue-pdf";
export default {
  data() {
    return {
      // png,jpg文件展示
      // showImageUrl:"",
      // showImageUrl: "http://118.24.25.176/3.png",
      showImageUrl: "http://118.24.25.176/2.jpeg",
      // showImageUrl: "http://118.24.25.176/1.pdf",
      // pdf文件展示
      showPdfUrl: "",
      // 文件在线预览
      dialogBigimg: false,
      // icon高亮
      previewIconIndex: -1,
      // 文件对象
      fileData: {
        fileName: '文件名称'
      },
       // 网络失败
      netWorkFail: false,
      netWorkFailUrl:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAZCAYAAAC7OJeSAAACDklEQVRIS8WWO4xNURSGvx+FUSiQ0GooNCTXMySCTqug8ChMYyS6CRJB5dUQTGGmGdEhOhJCSCQIglKnIRKRCILE45cl+8pxnHPvuePOtsqz11n/d9be6z9bALaXAUeAlcB74CKwX9KHWM8VSiB3gOkl0QfAaknfcsLcBNbVCG6VdCEnzCdgoEZwRNJQTpjXwNwawaOS9uWEOQ3srhA0sFTS45wwM4HrwPKCaIDslXQ8F0joKI32NGBzYbQv/UtHbC+U9LzXD/kF08+wPR94CmyRdLWX2n2FsR31bgFrgTfAEkkvmwL1G2YPcLIgHma6XtL3JkCNYGwPSPrcqaDtBcATYEYp77CkQ32BsT0PiPE+KGmsqqjtKcDdNADllOjKBkm3uwF17YztcWBbKnQFGJT0tljY9jBwrIPYK2CxpDhHtdERxvaq9MXFvCi8Q9KNZAuLgEcVP9qy6DVgo6TwsMqohbE9FXgYE1Hx5g/gFHAAiPa3um1BWh+WdGIiMPGDPNNFJLZrdkOQSPsKrJEU15O/orIztucA4aCzehBqmvoi+c+78gt1MKPAzqbVJ5B3WdKmrjDp5ncPiHGdzBiSNFIU+KMzyS/ux9VhMilS7S/ACknP2lplmEHgXAaQtkScy5akj/HgN4ztOKyxGIc3Z5yXtL0McxbYlZOioBUmOt6+XIWxhcGF0f2PiG1q/QSc8Kk+ZeMpewAAAABJRU5ErkJggg==",
        // 站位
        zhanwei: ''
    };
  },
  created() {
    const fileUrlString = this.showImageUrl.substring(
      this.showImageUrl.length - 3
    );
    if (fileUrlString === "pdf") {
      this.showPdfUrl = this.showImageUrl;
      return (this.showImageUrl = "");
    }
  },
  methods: {
    previewImage() {
      this.dialogBigimg = true;
      this.previewIconIndex = 1
    },
    closeDialog(){
      this.previewIconIndex = -1
    }
    // showImageFile() {
    //     console.log(1)
    //   this.$https.get("http://46bfd11e.ngrok.io/test/showfile").then(res => {
    //     if (res.status == 200) {
    //       console.log("服务器", res.data.data[0]);
    //       this.showImageUrl = res.data.data[0];
    //     }
    //   });
    // }
  }
  // 引入组件
  // components: {
  //   pdf
  // }
};
</script>

<style lang = "scss" scoped>
.showImgBox {
  width: 256px;
  height: 236px;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 8px 0px rgba(39, 59, 100, 0.19);
  border-radius: 1px;
  padding: 8px;
  box-sizing: border-box;
  position: relative;
  float: left;

  .fileImg {
    width: 240px;
    height: 180px;
    background: rgba(252, 254, 255, 1);
    border-radius: 1px;
    /* border: 1px dashed rgba(0, 70, 254, 1); */
    overflow: hidden;
    cursor: pointer;

    img {
      width: 100%;
      height: 180px;
      float: left;
    }
    .isPdf {
      width: 100%;
      height: 300px;
    }
    
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
        float: none;
      }

      p {
        margin-top: 25px;
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
      padding-left: 40px;
      text-align: center;

      i {
        display: inline-block;
        width: 21px;
        height: 24px;
        font-size: 20px;
        color: #bbbbbb;
        cursor: pointer;

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
      height: 100%;

      span:nth-child(1) {
        margin-left: 25%;
      }
      img {
        width: 600px;
        height: 426px;
      }
    }
  }
}
</style>