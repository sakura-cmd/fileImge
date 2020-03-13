<template>
  <div
    ref="fileBox"
    class="uploadFile"
  >
    <div
      v-for="(item,index) in fileHJ"
      :key="index"
      class="fileBox"
    >
      <span class="fileInfo-t">{{fileTitle[index].fileName}}</span>
      <div class="fileContainer">
        <div
          class="imgShow"
          @click.stop="uploadImg(index)"
        >
          <!-- 上传文件初始图片 -->
          <div
            class="initialImg"
            v-if="item.initialImg"
          >
            <img :src="initialImgUrl" />
            <p>
              <span>点击选择图片</span>
            </p>
          </div>
          <img
            v-if="item.data"
            :src="item.data"
          >
          <pdf
            v-if="item.pdfData"
            :src="item.pdfData"
          ></pdf>
          <!-- 网络请求失败 -->
          <div
            class="netWorkFail"
            v-if="item.netWorkFail"
          >
            <img
              :src="netWorkFailUrl"
              alt
            />
            <p>网络请求失败，请重新上传</p>
          </div>
          <input
            type="file"
            id="upLoad"
            ref="fileImage"
            @change.stop="uploadFile($event,index)"
          >
        </div>
        <!-- 文件图片底部信息框 -->
        <div class="filebtm">
          <!-- 文字 -->
          <el-tooltip
            :content="item.fileData.name"
            placement="top"
            effect="light"
          >
            <span class="fileName">{{item.fileData.name}}</span>
          </el-tooltip>
          <!-- icon -->
          <span class="fileIcon">
            <i
              class="el-icon-folder-opened"
              @click.stop="uploadImg(index)"
            ></i>
            <i
              class="el-icon-zoom-in"
              @click.stop="previewImage(index)"
              :class="previewIconIndex == index ? 'iconColor' : ''"
            ></i>
            <el-popconfirm
              confirmButtonText='确定'
              cancelButtonText='取消'
              icon="el-icon-info"
              iconColor="red"
              title="您是否删除该已上传图片？"
              @onCancel="iconIndex = -1"
              @onConfirm='deleteImage(index)'
            >
              <i
                class="el-icon-delete"
                @click.stop="deleteIcon(index)"
                :class="iconIndex == index ? 'iconColor' : ''"
                slot="reference"
              ></i>
            </el-popconfirm>
          </span>
        </div>
        <el-dialog
          :visible.sync="dialogBigimg"
          center
          :title="previewName"
          @close='closeDialog'
        >
          <img
            :src="previewImg"
            v-if="previewImg"
          />
          <pdf
            :src="previewPdf"
            v-if="previewPdf"
          ></pdf>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
// 引入vue-pdf
import pdf from "vue-pdf";
export default {
  props: {
    fileTitle: {
      type: Array,
      default() {
        return [];
      }
    },
    fileArr: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      // 预览图片
      previewImg: null,
      previewPdf: null,
      // 预览名字
      previewName: null,
      // 文件大小
      size: 0,
      //存储的文件对象
      formData: null,
      // 预览显示隐藏
      dialogBigimg: false,
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
      // 文件合集
      fileHJ: null,
      //文件添加的合集
      formDataList: []
    };
  },
  created() {
    this.fileHJ = this.fileArr;
  },
  methods: {
    // 展示区域调用函数
    uploadImg(i) {
      this.$refs.fileImage[i].dispatchEvent(new MouseEvent("click"));
    },
    uploadFile(el, i) {
      let fileCE = this.fileHJ,
        reader = new FileReader();
      // 赋值给空对象
      fileCE[i].fileData = el.target.files[0];
      // console.log(fileCE[i].fileData);
      reader.readAsDataURL(el.target.files[0]);
      reader.onloadstart = () => {
        // 初始文件图片隐藏
        fileCE[i].initialImg = false;
        if (el.target.files[0].type == "application/pdf") {
          reader.onload = function() {
            fileCE[i].pdfData = this.result;
            fileCE[i].data = "";
          };
        } else {
          reader.onload = function() {
            fileCE[i].data = this.result;
            this.previewImg = this.result;
            fileCE[i].pdfData = "";
          };
        }
        // 根据id进行识别认证
        if (this.fileTitle[i].id === "sfzm") {
          console.log("发送身份证验证请求");
        }
      };
      // // 把文件存起来
      // this.formData = new FormData();
      // let formDataList = [];
      // formDataList.push(el.target.files[0]);
      // // this.formData.append("testFile",formDataList);
      // console.log("子组件", formDataList);

      // 把所有子组件的文件赋值给父组件
      this.updaload(el.target.files[0]);
    },
    // 文件上传
    updaload(val) {
      this.formDataList.push(val);
      this.$emit("uploadFile", this.formDataList);
      // console.log(this.formData);
      // const res = await this.$https.post(
      //   "https://5df36567.ngrok.io/test/testUpload",
      //   this.formData
      // );
      // // 发送请求，保存图片
      // if (res.status === 200) {
      //   console.log("成功", res.data);
      // } else {
      //   console.log("失败", res);
      // }
    },
    // 预览事件
    previewImage(i) {
      this.previewIconIndex = i;
      this.dialogBigimg = true;
      this.iconIndex = -1;
      this.delDialog = false;
      this.previewPdf = this.fileHJ[i].pdfData;
      this.previewImg = this.fileHJ[i].data;
      this.previewName = this.fileHJ[i].fileData.name;
    },
    deleteIcon(i) {
      this.iconIndex = i;
      this.delDialog = true;
    },
    // 删除事件
    deleteImage(i) {
      this.iconIndex = -1;
      this.delDialog = false;
      // 初始文件图片显示
      this.fileHJ[i].initialImg = true;
      this.fileHJ[i].data = "";
      this.fileHJ[i].pdfData = "";
      this.fileHJ[i].fileData = {};
    },
    delCancel() {
      this.iconIndex = -1;
    },
    // 关闭dialog回调
    closeDialog() {
      this.previewIconIndex = -1;
    }
  },
  mounted() {},
  // 引入组件
  components: {
    pdf
  }
};
</script>

<style lang = 'scss' scoped>
.uploadFile {
  .fileBox {
    width: 256px;
    height: 261px;
    background: rgba(255, 255, 255, 1);
    border-radius: 1px;
    box-sizing: border-box;
    position: relative;
    float: left;
    margin: 10px;

    input[type="file"] {
      display: none;
    }

    .fileContainer {
      width: 256px;
      height: 236px;
      padding: 8px;
      box-shadow: 0px 0px 8px 0px rgba(39, 59, 100, 0.19);
    }
    .fileInfo-t {
      display: block;
      height: 16px;
      margin-bottom: 8px;
      color: #515151;
      font-size: 12px;
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
        height: 173px;
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
        cursor: pointer;

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
      width: 100%;
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
        position: relative;

        i {
          display: inline-block;
          width: 21px;
          height: 24px;
          font-size: 20px;
          color: #bbbbbb;
          cursor: pointer;
          margin-right: 4px;
          outline: none;

          &:hover {
            color: #3361ca;
          }
        }

        .iconColor {
          color: #3361ca;
        }
        .el-popover::v-deep {
          width: 206px;
          height: 95px;
        }
      }
    }
    /* 文件预览 */
    /deep/.el-dialog {
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
        height: 426px;
        overflow: auto;

        span:nth-child(1) {
          /* margin-left: 25%; */
          width: 580px;
        }
        img {
          width: 600px;
          /* height: 426px; */
        }
      }
    }
  }
}
</style>