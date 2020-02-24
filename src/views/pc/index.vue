<template>
  <el-form enctype="multipart/form-data" method="post">
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
      fileImages: {
        // url: '',
        // url: "http://118.24.25.176/2.jpeg",
        // url: "http://118.24.25.176/3.png",
        url: "http://118.24.25.176/1.pdf",
        fileName: "一叶知秋"
      }
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