<template>
  <div class="container">
    <!-- <file></file> -->
    <el-button @click="fileUplaod">文件上传</el-button>
    <el-button @click="thouMoney">千分位金额计算</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    fileUplaod() {
      this.$router.push("/fileUpload");
    },
    thouMoney() {
      this.$router.push("/thouMoney");
    }
  }
};
</script>

<style lang="scss" scoped>
.container::v-deep {
  min-width: 980px;

  .el-button {
    margin: 0 20px 20px 0;
  }
}
</style>