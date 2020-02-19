<template>
  <div class="imageFile">
    <div class="imageShow" @click="uploadImg" @mouseleave.once="isleave" @mouseenter.once="isEnter">
      <img :src="imageUrl" v-if="imageUrl" />
      <pdf :src="isPdfUrl" v-if="isPdfUrl"></pdf>
    </div>
    <!-- 遮罩(待用) -->
    <div class="isMask" v-if="isMask">2</div>
    <input @change="uploadFile($event)" type="file" ref="fileImage" />
    <!-- accept="application/pdf, image/jpeg, image/png"  -->
    <el-input disabled v-model="fileData.info" class="input-with-select">
      <el-button slot="append" icon="el-icon-folder-opened" @click="uploadImg"></el-button>
    </el-input>
    <br />
    <el-button @click.stop="updaload">上传到服务器</el-button>
    <!-- 预览 -->
    <el-button icon="el-icon-zoom-in" @click="previewImage"></el-button>
    <!-- 删除 -->
    <el-button icon="el-icon-close" @click="deleteImage"></el-button>
    <el-dialog :visible.sync="dialogBigimg" width="100%">
      <img :src="imageUrl" v-if="imageUrl" />
      <pdf :src="previewPdfUrl" v-if="previewPdfUrl"></pdf>
    </el-dialog>
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
      previewPdfUrl :'',
      //上传文件对象
      fileData: {
        info: ""
      },
      //存储的文件对象
      formData: {},
      //遮罩
      isMask: false,
      // 预览显示隐藏
      dialogBigimg: false
    };
  },
  methods: {
    // 展示区域调用函数
    uploadImg() {
      this.$refs.fileImage.dispatchEvent(new MouseEvent("click"));
    },
    uploadFile(el) {
      // if (!el.target.files[0].size) return; // 如果文件大小为0，则返回
      console.log(el.target.files[0]);
      // 赋值给空对象
      this.fileData = el.target.files[0];
      this.fileData.info = el.target.files[0].name;
      const that = this;
      const reader = new FileReader(); // 创建读取文件对象
      reader.readAsDataURL(el.target.files[0]); // 发起异步请求，读取文件
      reader.onloadstart = function() {
        // 判断是否是pdf文件
        if (el.target.files[0].type == "application/pdf") {
          that.imageUrl = "";
          reader.onload = function() {
            that.isPdfUrl = this.result;
            that.previewPdfUrl = this.result;
          };
        } else {
          that.isPdfUrl = "";
          reader.onload = function() {
            that.imageUrl = this.result;
          };
        }
      };
      // 把文件存起来
      this.formData = new FormData(); // 创建一个formdata对象
      this.formData.append("testFile", el.target.files[0]);
      console.log(this.formData);
    },
    // 文件上传
    updaload() {
      console.log(this.formData);
      this.$https
        .post("http://5df36567.ngrok.io/test/testUpload", this.formData)
        .then(res => {
          // 发送请求，保存图片
          if (res.status === 200) {
            // reader.readAsDataURL(el.target.files[0]); // 发起异步请求，读取文件
            // reader.onload = function() {
            //   // 文件读取完成后
            //   // 读取完成后，将结果赋值给img的src
            //   this.imageUrl = this.result;
            // };
            console.log("成功", res.data);
          } else {
            console.log("失败", res);
          }
        });
    },
    // 遮罩显示(待用)
    isleave() {
      this.isMask = false;
    },
    isEnter() {
      this.isMask = false;
    },
    // 预览
    previewImage() {
      this.dialogBigimg = true
      console.log(this.previewPdfUrl)
    },
    // 删除
    deleteImage() {
      this.imageUrl = "";
      this.isPdfUrl = "";
      this.previewPdfUrl = ""
      this.fileData.info = "";
    }
  },
  // 引入组件
  components: {
    pdf
  }
};
</script>

<style lang = 'less' scoped>
.imageFile {
  width: 100%;
  height: 500px;
  margin-left: 200px;
  margin-top: 100px;
  position: relative;

  input[type="file"] {
    display: none;
  }

  /deep/ .el-input-group {
    width: 300px;
  }
  .imageShow {
    width: 300px;
    height: 300px;
    border: 1px dashed #333;
    overflow: auto;
    cursor: pointer;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .isMask {
    width: 299px;
    height: 299px;
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(199, 135, 135, 0.3);
    cursor: pointer;
  }
}
</style>