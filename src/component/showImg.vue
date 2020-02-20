<template>
  <div class="showImge">
    <div class="fileimg">
      <img :src="showImageUrl" v-if="showImageUrl" />
      <pdf :src="showPdfUrl" v-if="showPdfUrl"></pdf>
    </div>
    <el-button @click="showImageFile">展示</el-button>
  </div>
</template>

<script>
import pdf from "vue-pdf";
export default {
  data() {
    return {
      showImageUrl: "",
      showPdfUrl: ""
    };
  },
  created() {
    //    this.showImageFile()
  },
  methods: {
    showImageFile() {
        console.log(1)
      this.$https.get("https://5df36567.ngrok.io/test/showfile").then(res => {
        if (res.status == 200) {
          console.log("服务器", res.data.data[0]);
          this.showImageUrl = res.data.data[0];
          console.log("本地显示", this.showImageUrl);
        }
      });
    }
  },
  // 引入组件
  components: {
    pdf
  }
};
</script>

<style lang = "less" scoped>
.showImge {
  width: 320px;
  height: 500px;

  float: left;
  .fileimg {
    height: 300px;
    border: 1px solid #333;
  }
}
</style>