<template>
  <el-form
    enctype="multipart/form-data"
    method="post"
  >
    <!-- 上传 -->
    <file-pdf
      :fileTitle="fileName"
      @fileUpload="fileUpload"
      :fileArr="formDataList"
      ref="filePdf"
    ></file-pdf>
    <!-- 展示 -->
    <!-- <show-img :fileDataList="fileImages"></show-img> -->
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
          url: "http://118.24.25.176/2.jpeg",
          fileName: "一叶知秋2",
          type: "jpeg"
        },
        {
          url: "http://118.24.25.176/3.png",
          fileName: "一叶知秋3",
          type: "png"
        },
        {
          url: "http://118.24.25.176/1.pdf",
          fileName: "一叶知秋4",
          type: "pdf"
        }
      ],
      //文件名数组
      // fileName: [{ name: "sfz" }, { name: "sfzfm" }, { name: "sfzzm" }],
      fileName: ["身份证正面", "身份证反面", "营业执照"],
      //子组件的所有对象
      formDataList: []
    };
  },
  methods: {
    fileUpload(data) {
      console.log("父组件的值", data);
      //  this.formDataList = this.formDataList.push(data);
    },
    upload() {
      // console.log(123);
      // this.$refs.filePdf.updaload();
      // console.log('合集',this.formDataList);
    }
  },
  created() {
    for (let i = 0; i < 1; i++) {
      this.formDataList.push({
        name:'',
        //img
        data:"",
        //pdf
        pdfData:"",
        //初始化图片
        initialImg: true,
        // 网速加载失败
        netWorkFail: false,
        // 文件列表
        fileData:''
      });
    }
    console.log(this.formDataList);
  }
};
</script>

<style>
</style>