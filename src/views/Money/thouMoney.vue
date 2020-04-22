<template>
  <div class="thou-money">
    <p>金额校验</p>
    <div class="show-money">
      <div>
        <span>保证金</span>
        <span>{{ a }}</span>
      </div>
      <div>
        <span>车辆质押总价</span>
        <span>{{ this.checkFormatMoney(b) }}</span>
      </div>
      <div>
        <span>放款额度</span>
        <span>{{ this.checkFormatMoney(c) }}</span>
      </div>
      <div>
        <span>质放差值</span>
        <span>{{ d }}</span>
      </div>
    </div>
    <div class="input-money">
      <p>输入金额</p>
      <el-input
        v-model="moneyNum"
        placeholder="请输入内容"
        @input="changeMoney"
      ></el-input>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      moneyNum: "",
      a: 0,
      b: 1000,
      c: 2000,
      d: 0
    };
  },
  computed: {
      
  },
  methods: {
    // 清除千分位的逗号
    clearMoney(str) {
      return str.toString().replace(/,/g, "");
    },
    // 输入框显示金额千分位
    checkFormatMoney(value) {
      let val = this.clearMoney(value);
      let res = val.toString().replace(/\d+/, Qnum => {
        return Qnum.replace(/(\d)(?=(\d{3})+$)/g, $1 => {
          return $1 + ",";
        });
      });
      return res;
    },
    changeMoney() {
      this.moneyNum = this.checkFormatMoney(this.moneyNum);
    }
  }
};
</script>

<style lang='scss' scoped>
.thou-money {
  .show-money {
    display: flex;
    width: 1400px;
    height: 120px;
    justify-content: space-between;
    div {
      width: 300px;
      background: #b2bac2;
      border-radius: 20px;
      padding: 20px;

      span {
        display: block;
        margin-bottom: 20px;
        &:nth-child(2) {
          color: red;
        }
      }
    }
  }
  .input-money {
    width: 200px;
  }
}
</style>