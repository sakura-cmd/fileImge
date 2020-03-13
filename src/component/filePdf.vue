<template>
  <div
    ref="fileBox"
    :class="controlSize ? 'uploadFile': 'uploadFileSmall'"
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
            v-if="netWorkFail"
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
    },
    size: {
      type: String
    }
  },
  data() {
    return {
      // 预览图片
      previewImg: null,
      previewPdf: null,
      // 预览名字
      previewName: null,
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
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAAAyCAYAAADhna1TAAAEbklEQVRoQ+Wba8ilUxTHf//cL/ky5dK4J+aDO2XkkjA1uZRSk8u4TL5QNDJplCKXoknIJeYLSpGIciflkg+IyJ0vQxITikLuf/11znTe857LfvZ533HOede385619l7r9+5n7b3Xeo7oEtunAyuBo4FdgB+BD4DHgPsl/d5tM42f1Q7K9q7AI8DxAwL9AjhL0pvTCKMzpv/A2N4NeAPYsyDgrJjlkl4p0J1YlTaYV4eslO4AvweWSPphYiMf4rhaOeXJigBvkXRlhd1EmARM8sqKCm+/ARZLcoXt2JsEzFfA7pWe7iMpCXnqJGCSTLeujGzptO5QAbMR2LkSTBLwZ5W2Y20WMC8BJ1V4+TOwSNIfFbZjbxIwFwP3VHj6sKRzKuwmwiRgtgHyOOzVwOO/gIMlfdLAZqJU2we8pUBOsoFUIqsl3VGiOKk6nXelE1oXxUUDgslKWTPtUBL/JjD5YDtQrgLOBXJ/aksS7VPADdP8+HQuiBlg2l/Yzt+Tc9plhw3/9+5j+0BgmaTbNsfj2RPM5pi4yRy2twJS6jgIOE5SKgHzKpMC5jrgmhaJL4FDJaWANm8y9mBsH95aLVt2UHhc0pnzRqU7+c7nRDVjt85YbwPJL91ymaS7asYtsRnrFWP7ZmBtn0By+c0l9r2SQJvqjC0Y2zl0vg5sMSCoz4EjJOU4MacylmBsbwe8CxxQEO2Dks4v0GukMmdgbKeQvnEu2iu2c1a5vEEkqyQ90EB/qOqcgGkdCLPsd8ypWdKHQ2fuo2A77Zvc25r49gtwpKRPa+fttmsyed85bV8AtP9jv7US5p1N68G2dwDeB/atCDB2R0nK/CPLyGBs7wQkCeb60CkvABdK+rbUS9upC6U+VCvrJY1iv2neuQBzO7C6TyTpP10kaWh7xvYy4MVaIh12KyQ9Ouo4I4FpXeyye3SeSnv5tB64QtKvvb5srbrkpT1GDQj4CThM0oZRxhoVzMtA6jglkiphEvM73cq27wNWlQxSqPMWcKykPwv1Z6lVg7F9NvBQw4njaC6D6yT9E1vbpwJPNxynRP1WSWtKFHvpVIGxnW05W+PiyonTKz8PyDabR6izKFY55CyzdEhPk/RszYC1YNYBo/atUzb4CDimxvFCmyT/lCi+LtSv35VsL2mdNVI8mgR5DThR0t9NnG28YmxnS83WOklyvaRrmzjcCIztFIfyytmkSRL9yZKyixZJMRjb2wNpsJW8dVU0+WZWymsrh0j6rmTeJmBuBK4uGXSMdZ4HTim5wxWBsb1fa1st7VSOMRvWSsquOlBKwTwT0sMGm5Dv000d2oIZCmaEd/TGmdPQFsxAMLa3bR3Cauoj4wwmvg1swQwDk3tNml3TKpdKurtXcH3B2N4b+BhIYXpapW8LZhCYJ4AzppVIR1w9WzD93nZYDjy3AKC0Q5zVgpkFxnZebc2vTfZfQGAS6owWTC8weXHopgUGJeHOaMHMAGM7b4inAJU2xkKUTS2YbjC1vyuYJoj3SrrkXw1uU0K7wungAAAAAElFTkSuQmCC",
      // 初始化图片
      initialImg: true,
      initialImgUrl:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEQAAAAyCAYAAADlaH1uAAAFhUlEQVRoQ91aW2xUVRRd6w4UUgjKe2YosUR8JMYACoikRmpUEhKNREBFQlKkc0fUmKhRPyBBxQ9MMMYH9raEGjUaiokkSjQqqEHwBdGAEkHEKu3MoBZ8QGiBzjLTUmhpp/ecYSi3na9J7tp7r73O2eece88m2v0kEWsid6KZC0BNATgCUAOA7aDzFsrr15FUe5u+9p9tCWltdCxOpNdLuC5bkiR3oGDAHJbV1vY1IdryaRFEVWOKkG7+WkLUL1ESB1EwcFpfFaVVEC+yVdJ0PzFOq0huRywxtS+WD+VF75DS75qKcWZqOXcznlhnaxd0PFURWS9oji1REu/RTd1uaxd0POVFDkgqsiVK8k+6yVG2dkHHZwRpklRgS5SEEIv3I5enbW2DjKcqwgcFWI80gX8ZT10U5ORy4ZYRZJOAm2yNCW5lPFliaxd0PFUZXqI0XrElSvBRxpPP29oFHU9VFw9EU9NeQWNNyRJIoXDUeC7cedTUprfg2g5mJYA2S+jvR5zASYRCM1lev9kP2xufn3mX8SK3Algn6eJsiZD4DwjdQ7d+Y29M1oTzaUEyYFWNG430saUA75I08syplA0ga9AvtIL3HUiYOO6tmA6CtCWhmrkhHP6qGNAIhNCAIdf/ynnrmy9Uki2fJSqjL6BgwBMsq208nzy6FOR8BszFt7zw/RJWk86rdBNLcvFhahN4QVRdXIymxl0CBmeSIp3ZdBMbTBO0xQVakJZS8SKftD84kjyE/pzIRYkDtsma4IMtSJZDI8EtGFZSej7WtcAKcnapnD26pPMU3cRyk1G3wQRSkNZdJbJJQmk3Z6JmOCxleXKLTcJ+2GAKYvh+RbIOodAELq475Jeo6fO8CaI1ReO5uG6faeBsOFVdMg7NTTvbdhU/fyQ30E3O9sOZPs+LIHr90lE4dnQvgA+Awjjd/f+YEmiPMymVrvzSwQOMpVbnErPT2pQPJ/LCayWUtZwTgFo4zr2MJbbZ+s75UwTZCISm0q3bZRsz74KoMjwFQuZO5/RsI5E55j+DoTesMN0abUulcyLcjWGhyZxXd+xcRDmnkjk1xb/MdttH8guEsICLk791RzLXUulClCrGk7ELJ0hFtExIr+2OAMm/Ica7u8PJtVS6XE9CmMvy1Du5ipLzDNGb44fg6JG9EkabBCfwGoYNf4jzfjzSYSHN7Crppl0SBpn48cO0DEAIE/1mZdbzjV+ArNtjZWSV0nrExp7gzwDmM57cnrE79a6yWcAMGz9+WJLbcPkVN7L0s5N+2LwsqvKiVwLpnSafHDsFJE5AzjK49c+hcswSKf2yLWkTPMln6SaXmmDbY3IqGVVEPhJ0i22wDoHJzwFNzlepdDHSaTB0M936T214WguS6+W4Dal8YUkkAGcC3cRfpj6tBGm5sjjeuFvCONMAFxpH4H3GU7eZ8rATxAsvk/C0qfOg4EjnYbqJF034GAvS2nKlnyQVmjgOEoZgExxnGmP13/vxMhfEC9dImOvnMKjPCe5B4chr/W4bjQRRVdEMNZ+0Wq2DKAyJarqpRd1x8xWk9Y5my3cSrg5ikracGHLmszzxdjY7f0G86INS+iXbwEHFZ/paUFAwiYt+398Vx24FkRcdASnTGTA0qAnmwovAN+CYEro7TnRxoMvuUl7Ek3ROr9O5EO4JGzpYyVjqSWNB5EWvgdLfCnB6gmBPx2jpkXOcmSxPfNw+dtaSsW3m7emE8hGvtfFn0AQu/OWPNn9d3/5XRBYIeiMfQYPug+SHiCVmtXVldxJENVcNxuGGPSZ970FP1pQficfoplZl8J0F8cIrJTxu6qwv4Egeh4PpLE/u6NhBVF10GY43/5BLI29vF4bEPgwdPqmjIBWRjYJm9fbkcuVP8o3/AeU4BoQyyzazAAAAAElFTkSuQmCC",
      // 文件合集
      fileHJ: null,
      //文件添加的合集
      formDataList: [],
      // 控制组件大小
      controlSize: false
    };
  },
  created() {
    this.fileHJ = this.fileArr;
    console.log("small", this.size);
    if (!this.size) {
      this.controlSize = true;
    } else {
      this.controlSize = false;
    }
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
        let Distinguish = ["sfzm", "sfzfm", "yyzh", "weima"];
        for (let s = 0; s < Distinguish.length; s++) {
          if (this.fileTitle[i].id === Distinguish[s]) {
            console.log("发送身份证验证请求");
          }
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
    border-radius: 1px;
    box-sizing: border-box;
    position: relative;
    float: left;
    margin: 10px;
    background: transparent;

    input[type="file"] {
      display: none;
    }

    .fileContainer {
      width: 256px;
      height: 236px;
      padding: 8px;
      box-shadow: 0px 0px 8px 0px rgba(39, 59, 100, 0.19);
      box-sizing: border-box;
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
      border: 1px dashed #fe9818;
      overflow: auto;
      cursor: pointer;

      img {
        width: 100%;
        height: 173px;
      }
      .initialImg {
        background: #fff;
      }
      .netWorkFail {
        background: #e2e4e9;
      }
      .initialImg,
      .netWorkFail {
        width: 100%;
        height: 178px;
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
            color: #fe9818;
          }
        }

        .iconColor {
          color: #fe9818;
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
.uploadFileSmall {
  .fileBox {
    width: 174px;
    height: 181px;
    border-radius: 1px;
    box-sizing: border-box;
    position: relative;
    float: left;
    margin: 10px;
    background: transparent;

    input[type="file"] {
      display: none;
    }

    .fileContainer {
      width: 174px;
      height: 160px;
      padding: 6px;
      box-shadow: 0px 0px 8px 0px rgba(39, 59, 100, 0.19);
      box-sizing: border-box;
    }
    .fileInfo-t {
      display: block;
      height: 16px;
      margin-bottom: 4px;
      color: #515151;
      font-size: 12px;
    }
    .imgShow {
      width: 162px;
      height: 121px;
      background: rgba(252, 254, 255, 1);
      border-radius: 1px;
      border: 1px dashed #fe9818;
      overflow: auto;
      cursor: pointer;

      img {
        width: 100%;
        height: 121px;
      }
      .initialImg {
        background: #fff;
      }
      .netWorkFail {
        background: #e2e4e9;
      }
      .initialImg,
      .netWorkFail {
        width: 100%;
        height: 119px;
        border-radius: 1px;
        float: left;
        font-size: 12px;
        text-align: center;
        padding-top: 43px;
        box-sizing: border-box;
        color: #515151;
        cursor: pointer;

        img {
          width: 24px;
          height: 21px;
        }

        p {
          margin-top: 12px;
          span {
            text-decoration: underline;
          }
        }
      }
    }
    .filebtm {
      width: 100%;
      height: 21px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
      border-radius: 4px;
      margin-top: 5px;

      span {
        display: inline-block;
        line-height: 21px;
      }

      .fileName {
        float: left;
        width: 85px;
        height: 21px;
        font-size: 12px;
        color: #414141;
        line-height: 21px;
        font-weight: 600;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding-left: 4px;
        box-sizing: border-box;
        cursor: pointer;
      }
      .fileIcon {
        width: 72px;
        height: 21px;
        float: right;
        box-sizing: border-box;
        padding-left: 6px;
        position: relative;

        i {
          display: inline-block;
          width: 18px;
          height: 20px;
          font-size: 16px;
          color: #bbbbbb;
          cursor: pointer;
          margin-right: 4px;
          outline: none;

          &:hover {
            color: #fe9818;
          }
        }

        .iconColor {
          color: #fe9818;
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