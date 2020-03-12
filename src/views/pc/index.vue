<template>
  <el-form
    enctype="multipart/form-data"
    method="post"
  >
    <!-- 上传 -->
    <file-pdf
      :fileTitle="fileName"
      :fileArr="formDataList"
      @uploadFile="fileUpload"
      ref="filePdf"
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
          url: "http://118.24.25.176/3.png",
          fileName: "一叶知秋3",
          type: "png"
        }
      ],
      //文件名列表
      fileName: [
        { id: "sfzm", name: "身份证正面" },
        { id: "sfzfm", name: "身份证反面" },
        { id: "yyzh", name: "营业执照" }
      ],
      //子组件的所有对象
      formDataList: [],
      abc: ""
    };
  },
  methods: {
    fileUpload(val) {
      this.formDataList = val;
    },
    upload() {
      console.log("接收子组件的所有的文件集合", this.formDataList);
    }
  },
  created() {
    for (let i = 0; i < 3; i++) {
      this.formDataList.push({
        //文件名
        name: "",
        //img图片base64
        data: "",
        //pdf
        pdfData: "",
        //初始化图片
        initialImg: true,
        // 网速加载失败
        netWorkFail: false,
        // 文件列表
        fileData: ""
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.showFile,.uploadFile{
  height: 300px;
}
</style>