<template>
  <el-form
    enctype="multipart/form-data"
    method="post"
  >
    <!-- 上传 -->
    <file-pdf></file-pdf>
    <!-- 展示 -->
    <show-img :fileDataList="fileImages"></show-img>
  </el-form>
</template>

<script>
export default {
  data() {
    return {
      // 文件
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
      ]
      // fileImages: {
      //   url: "http://118.24.25.176/1.pdf",
      //   fileName: "一叶知秋1"
      // }
    };
  },
  methods: {
    // 文件回显
  },
  created() {}
};
</script>

<style>
</style>