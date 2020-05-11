<template>
  <div class="html2canvas">
    <div
      ref="downPdf"
      id="downPdf"
    >
      <span>这是一个图片这是一个图片这是一个图片这是一个图片这是一个图片这是一个图片这是一个图片这是一个图片这是一个图片这是一个图片这是一个图片这是一个图片这是一个图片这是一个图片这是一个图片这是一个图片这是一个图片这是一个图片这是一个图片这是一个图片这是一个图片这是一个图片这是一个图片这是一个图片这是一个图片这是一个图片这是一个图片这是一个图片这是一个图片这是一个图片这是一个图片这是一个图片这是一个图片这是一个图片这是一个图片这是一个图片这是一个图片这是一个图片这是一个图片这是一个图片这是一个图片这是一个图片这是一个图片这是一个图片这是一个图片这是一个图片</span>
      <span>这是一个图片</span>
      <span>这是一个图片</span>
      <span>这是一个图片</span>
      <span>这是一个图片</span>
      <span>这是一个图片</span>
      <span>这是一个图片</span>
      <span>这是一个图片</span>
      <span>这是一个图片</span>
      <span>这是一个图片</span>
      <span>这是一个图片</span>
      <span>这是一个图片</span>
      <span>这是一个图片</span>
      <span>这是一个图片</span>
      <p></p>
      <p></p>
      <p></p>
      <span>这是一个图片</span>
      <p></p>
      <img
        src="./logo.png"
        alt=""
      >
      <span>这是一个图片</span>
      <span>这是一个图片</span>
      <span>这是一个图片</span>
      <span>这是一个图片</span>
      <span>这是一个图片</span>
      <span>这是一个图片</span>
      <span>这是一个图片</span>
      <span>这是一个图片</span>
      <span>这是一个图片</span>
      <span>这是一个图片</span>
      <span><el-input v-model="info" style="width:200px"></el-input></span>
      <img
        src="./logo.png"
        alt=""
      >
      <span>这是一个图片</span>
      <span>这是一个图片</span>
      <span>这是一个图片</span>
      <span>这是一个图片</span>
      <span>这是一个图片</span>
      <span>这是一个图片</span>
      <span>这是一个图片</span>
      <span>这是一个图片</span>
      <span>这是一个图片</span>
      <span>这是一个图片</span>
      <img
        src="./logo.png"
        alt=""
      >
    </div>
    <button @click="upload">制作pdf</button>
  </div>
</template>

<script>
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
// import $ from "jquery";
export default {
  data() {
    return {
      titleNmae: "PDF模板",
      info:''
    };
  },
  methods: {
    // 封装
    handlerPdf(element, title) {
      html2canvas(element).then(canvas => {
        //a4纸的尺寸[595.28,841.89]
        let contentWidth = canvas.width; // 委托书的宽度
        let contentHeight = canvas.height; // 委托书的高度
        console.log("委托书页面的宽和高", contentWidth, contentHeight);
        //一页pdf显示html页面生成的canvas高度;
        let pageHeight = (contentWidth / 592.28) * 841.89;
        console.log("页面生成的高度", pageHeight);
        let leftHeight = contentHeight;
        //页面偏移
        let position = 0;
        let imgWidth = 595.28;
        let imgHeight = (592.28 / contentWidth) * contentHeight;
        let pageData = canvas.toDataURL("image/jpeg", 1.0);
        let pdf = new jsPDF("", "pt", "a4");
        //当内容未超过pdf一页显示的范围，无需分页
        if (leftHeight < pageHeight) {
          // 把内容添加到里面,宽和高都是A4大小
          pdf.addImage(pageData, "JPEG", 0, 0, imgWidth, imgHeight);
        } else {
          while (leftHeight > 0) {
            pdf.addImage(pageData, "JPEG", 0, position, imgWidth, imgHeight);
            leftHeight -= pageHeight;
            position -= 841.89;
            //避免添加空白页
            if (leftHeight > 0) {
              pdf.addPage();
            }
          }
        }
        pdf.save(title + ".pdf");
      });
    },
    // 下载pdf
    upload() {
      this.handlerPdf(this.$refs.downPdf, this.titleNmae);
    }
  }
};
</script>

<style lang='scss' scoped>
.html2canvas {
  margin: 0 auto;
  width: 700px;
  height: 700px;
  overflow: auto;
  #downPdf {
    width: 210mm; // A4纸大小
    // height: 297mm; // A4纸大小
    // height: 100%;
    background: #ffff;
    padding: 20px;
    box-sizing: border-box;
    span {
      font-size: 20px;
      display: block;
      margin-bottom: 20px;
    }
    p {
      width: 100px;
      height: 100px;
      background: url("./logo.png") center no-repeat;
      opacity: 0.3;
    }
  }
}
</style>