<template>
  <div class="html2canvas">
    <div
      ref="downPdf"
      id="downPdf"
    >
      <h3>竞价委托书</h3>
      <p>今全权委托上海真祥大数据科技有限公司（以下简称“真祥数科”），对二手车辆（以下简称“标的物”，详见参考附件《送拍标的车辆信息表》）在阿里拍卖平台上进行竞价，竞价标的物为我方全权所有或有依法可处置权。相关资料（车辆清单、详细配置、车况、起拍价、相关描述、质量和瑕疵、看货要求、提货条件及附加费用等）均已向真祥数科如实提供，真实有效。我方保证标的物不存在侵权、虚假描述、成交不卖等行为。</p>
      <p>竞价成交买受人支付尾款项后，由买受人凭拍卖《提货通知单》办理提货手续，双方签字盖章的《提货单》拍照回传至真祥数科确认，以便于阿里拍卖进行结算，我方收款账户信息如下：</p>

    </div>
    <button
      @click="upload"
      class="submit"
    >PDF</button>
  </div>
</template>

<script>
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
// import $ from "jquery";
export default {
  data() {
    return {
      titleName: "PDF模板",
      info: ""
    };
  },
  methods: {
    // 封装PDF方法
    handlerPdf(element, title) {
      html2canvas(element, {
        allowTaint: true, // 是否允许跨域
        // taintTest: false, // 是否渲染前测试图片
        scale: "2" // 放大图片2倍,值越大越清晰,对应文件体积越大
      }).then(canvas => {
        // A4纸的尺寸大小[595.28,841.89]
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
        // PDF的A4宽高和页面生成的委托书比例一致
        let imgHeight = (592.28 / contentWidth) * contentHeight;
        let pageData = canvas.toDataURL("image/jpeg", 1.0);
        let pdf = new jsPDF("", "pt", "a4", true);
        //当内容未超过pdf一页显示的范围，无需分页
        if (leftHeight < pageHeight) {
          // 把内容添加到里面,宽和高都是A4大小
          pdf.addImage(pageData, "jpeg", 0, 0, imgWidth, imgHeight);
        } else {
          while (leftHeight > 0) {
            pdf.addImage(pageData, "jpeg", 0, position, imgWidth, imgHeight);
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
      this.handlerPdf(this.$refs.downPdf, this.titleName);
    }
  }
};
</script>

<style lang='scss' scoped>
.html2canvas {
  margin: 0 auto;
  width: 100%;
  height: 700px;
  background: #f4f5f8;
  position: relative;

  #downPdf {
    // width: 842px; // A4纸大小
    width: 210mm; // A4纸大小
    // height: 297mm; // A4纸大小
    // height: 100%;
    margin: 0 auto;
    background: #ffff;
    padding: 20px;
    box-sizing: border-box;
    h3 {
      text-align: center;
      margin: 0 0 10px;
    }
    p {
      margin: 0;
      text-indent: 2em;
      line-height: 40px;
    }
  }

  .submit {
    position: absolute;
    padding: 8px 16px;
    bottom: 20px;
    right: 20px;
    background: rgba(20, 127, 255, 1);
    border-radius: 8px;
    border: none;
    outline: none;
    color: #ffff;
    cursor: pointer;
  }
}
</style>