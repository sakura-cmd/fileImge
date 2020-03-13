<template>
  <div class="showFile">
    <div
      v-for="(item,index) in fileDataList"
      :key="index"
      class="showFileContainer"
    >
      <span class="showFile_title">{{item.fileName}}</span>
      <div class="showImgBox">
        <div
          class="fileImg"
          @click.stop="previewImage(index)"
        >
          <img
            :src="item.url"
            v-if="item.type == 'pdf' ? '':item.url"
          />
          <iframe
            :src="item.url"
            v-if="item.url"
            frameborder="0"
            class="isPdf"
            id="isPdf"
            width="240px"
            height="180px"
          ></iframe>
          <div
            class="netWorkFail"
            v-if="netWorkFail"
          >
            <img
              :src="netWorkFailUrl"
              alt
            />
            <p>网络请求失败，请重新刷新</p>
          </div>
        </div>
        <!-- 文件图片底部信息框 -->
        <div class="filebtm">
          <!-- 文字 -->
          <el-tooltip
            :content="item.fileName"
            placement="top"
            effect="light"
          >
            <span class="fileName">{{item.fileName}}</span>
          </el-tooltip>
          <!-- icon -->
          <span class="fileIcon">
            <i
              class="el-icon-zoom-in"
              @click.stop="previewImage(index)"
              :class="previewIconIndex == 1 ? 'iconColor' : ''"
            ></i>
          </span>
        </div>
        <!-- 服务器图片预览 -->
        <el-dialog
          :visible.sync="dialogBigimg"
          center
          :title="showFileName"
          @close="closeDialog"
        >
          <div class="imgBox">
            <img
              :src="showImgUrl"
              v-if="showImgUrl"
            />
            </div>
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
    </div>
  </div>
</template>

<script>
// import pdf from "vue-pdf";
export default {
  props: {
    fileDataList: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      // png,jpg文件展示
      showImgUrl: "",
      // pdf文件展示
      showPdfUrl: "",
      // 文件在线预览
      dialogBigimg: false,
      // 文件名称
      showFileName: "",
      // icon高亮
      previewIconIndex: -1,
      // 网络失败
      netWorkFail: false,
      netWorkFailUrl:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAZCAYAAAC7OJeSAAACDklEQVRIS8WWO4xNURSGvx+FUSiQ0GooNCTXMySCTqug8ChMYyS6CRJB5dUQTGGmGdEhOhJCSCQIglKnIRKRCILE45cl+8pxnHPvuePOtsqz11n/d9be6z9bALaXAUeAlcB74CKwX9KHWM8VSiB3gOkl0QfAaknfcsLcBNbVCG6VdCEnzCdgoEZwRNJQTpjXwNwawaOS9uWEOQ3srhA0sFTS45wwM4HrwPKCaIDslXQ8F0joKI32NGBzYbQv/UtHbC+U9LzXD/kF08+wPR94CmyRdLWX2n2FsR31bgFrgTfAEkkvmwL1G2YPcLIgHma6XtL3JkCNYGwPSPrcqaDtBcATYEYp77CkQ32BsT0PiPE+KGmsqqjtKcDdNADllOjKBkm3uwF17YztcWBbKnQFGJT0tljY9jBwrIPYK2CxpDhHtdERxvaq9MXFvCi8Q9KNZAuLgEcVP9qy6DVgo6TwsMqohbE9FXgYE1Hx5g/gFHAAiPa3um1BWh+WdGIiMPGDPNNFJLZrdkOQSPsKrJEU15O/orIztucA4aCzehBqmvoi+c+78gt1MKPAzqbVJ5B3WdKmrjDp5ncPiHGdzBiSNFIU+KMzyS/ux9VhMilS7S/ACknP2lplmEHgXAaQtkScy5akj/HgN4ztOKyxGIc3Z5yXtL0McxbYlZOioBUmOt6+XIWxhcGF0f2PiG1q/QSc8Kk+ZeMpewAAAABJRU5ErkJggg==",
      // 站位
      zhanwei: ""
    };
  },
  methods: {
    previewImage(val) {
      this.showFileName = this.fileDataList[val].fileName;
      this.dialogBigimg = true;
      this.previewIconIndex = 1;
      if (this.fileDataList[val].type !== "pdf") {
        this.showPdfUrl = false;
        this.showImgUrl = this.fileDataList[val].url;
      } else {
        (this.showImgUrl = false),
          (this.showPdfUrl = this.fileDataList[val].url);
      }
    },
    closeDialog() {
      this.previewIconIndex = -1;
    }
  },
  // 引入组件
  components: {
    // pdf
  }
};
</script>

<style lang = "scss" scoped>
.showFile {
  .showFileContainer {
    width: 256px;
    height: 261px;
    float: left;
    margin: 10px;

    .showFile_title {
      display: block;
      height: 16px;
      margin-bottom: 8px;
      color: #515151;
      font-size: 12px;
    }
    .showImgBox {
      width: 256px;
      height: 236px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 0px 8px 0px rgba(39, 59, 100, 0.19);
      border-radius: 1px;
      padding: 8px;
      box-sizing: border-box;
      position: relative;

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
          /* margin-top: -180px;
        float: left; */
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
          line-height: 24px;

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
          height: 426px;

          span:nth-child(1) {
            margin-left: 25%;
          }
          .imgBox{
            width: 100%;
            overflow: auto;
          }
          img {
            /* width: 600px; */
            /* height: 426px; */
          }
        }
      }
    }
  }
}
</style>