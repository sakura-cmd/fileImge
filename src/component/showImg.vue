<template>
  <div class="showImge">
    <div class="fileimg">
      <img :src="showImageUrl" v-if="showImageUrl" />
      <!-- <pdf :src="showPdfUrl" v-if="showPdfUrl"></pdf> -->
      <iframe
        :src="showPdfUrl"
        v-if="showPdfUrl"
        frameborder="0"
        class="isPdf"
        type="application/x-google-chrome-pdf"
      ></iframe>
    </div>
    <!-- <el-button @click="showImageFile">展示</el-button> -->
    <!-- <el-button @click="readerFile">读取</el-button> -->
  </div>
</template>

<script>
// import pdf from "vue-pdf";
export default {
  data() {
    return {
      // showImageUrl:"",
      // showImageUrl: "http://118.24.25.176/3.png",
      showImageUrl: "http://118.24.25.176/2.jpeg",
      // showImageUrl: "http://118.24.25.176/1.pdf",
      // showPdfUrl: "http://118.24.25.176/3.png",
      // showPdfUrl: "http://118.24.25.176/2.jpeg"
      // showPdfUrl: "http://118.24.25.176/1.pdf",
      showPdfUrl: ""
    };
  },
  created() {
    const fileUrlString = this.showImageUrl.substring(
      this.showImageUrl.length - 3
    );
    if (fileUrlString === "pdf") {
      this.showPdfUrl = this.showImageUrl;
      return this.showImageUrl = ''
    }
  },
  methods: {
    // showImageFile() {
    //     console.log(1)
    //   this.$https.get("http://46bfd11e.ngrok.io/test/showfile").then(res => {
    //     if (res.status == 200) {
    //       console.log("服务器", res.data.data[0]);
    //       this.showImageUrl = res.data.data[0];
    //     }
    //   });
    // }
  }
  // 引入组件
  // components: {
  //   pdf
  // }
};
</script>

<style lang = "less" scoped>
.showImge {
  width: 100%;
  height: 500px;

  float: left;

  .fileimg {
    height: 300px;
    border: 1px solid #333;

    img {
      width: 100%;
      height: 300px;
    }
    .isPdf {
      width: 100%;
      height: 300px;
    }
  }
}
</style>