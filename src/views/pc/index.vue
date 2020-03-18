<template>
  <el-form
    enctype="multipart/form-data"
    method="post"
  >
    <!-- 上传 -->
    <file-pdf
      :fileTitle="UploadFileName"
      :fileArr="formDataList"
      ref="filePdf"
      size='smalls'
    ></file-pdf>
    <!-- 展示 -->
    <show-img :fileDataList="fileImages"></show-img>
    <el-button @click="upload">上传</el-button>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      // 文件对象
      fileImages: [
        {
          url: "http://118.24.25.176/1.pdf",
          fileName: "一叶知秋1",
          type: "pdf"
        },
        {
          url: "http://118.24.25.176/3.png",
          fileName: "一叶知秋3",
          type: "png"
        },
        {
          url: "http://118.24.25.176/1.pdf",
          fileName: "一叶知秋1",
          type: "pdf"
        },
        {
          url: "http://118.24.25.176/2.jpeg",
          fileName: "一叶知秋3",
          type: "jpg"
        }
      ],
      //文件名列表
      UploadFileName: [
        { id: "sfzm", fileName: "身份证正面" },
        { id: "sfzfm", fileName: "身份证反面" },
        { id: "yyzh", fileName: "营业执照" }
        // { id: "yyzh1", fileName: "营业执照1" },
        // { id: "yyzh2", fileName: "营业执照2" },
      ],
      //子组件的所有对象
      formDataList: []
    };
  },
  methods: {
    fileUpload(val) {
      this.formDataList = val;
    },
    upload() {
      // 获取改页面中上传的文件
      let res = this.$refs.filePdf.getFiles(this.UploadFileName);
      console.log(res);
    }
  },
  created() {
    for (let i = 0; i < 3; i++) {
      this.formDataList.push({
        //img图片base64
        data: "",
        //pdf
        pdfData: "",
        //初始化图片
        initialImg: true,
        // 网速加载失败
        netWorkFail: false,
        // 文件列表
        fileData: "",
        // 文件key
        typefileId: ""
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.showFile,
.uploadFile {
  height: 300px;
}
</style>