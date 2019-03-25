<template>
<div :id="id" class="clock" :class="shape" :style="{width: size + 'px', height: size + 'px'}">
</div>
</template>

<script>
import createAnalogClock from 'emitting-analog-clock';

const optionKeys = {
  size: {
    type: Number,
    default: 200,
  },
  color: String,
  backgroundColor: String,
  backgroundImage: String,
  shadowing: {
    type: Boolean,
    default: true
  },
  showDigital: false,
  smooth: Boolean,
  date: Object,
  dateFunc: Function
};

export default {
  name: 'EmitingAnalogClock',
  props: {...optionKeys,
    shape: {
      default: 'circle'
    },
    id: {
      default: 'clock'
    }
  },
  created () {
  },
  data () {
    return {
    }
  },
  mounted () {
    var option = {
      id: this.id
    };
    for (var key in optionKeys) {
      if(this[key] !== undefined){
        option[key] = this[key];
      }
    }
    createAnalogClock(option);
  }
}
</script>
<style lang="scss">
.clock {
  left: 0;
  right: 0;
  margin: auto;
}

.clock div {
  box-shadow: 0 5px 14px black;
}
.square div{
  border-radius: 5px;
  overflow: hidden;
}

.circle div {
  border-radius: 50%;
  overflow: hidden;
}

</style>
