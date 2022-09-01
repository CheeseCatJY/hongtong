<template>
  <div class="pl-35/1550 pr-25/1550 box-border relative main_bg w-full h-full"  style="padding-top:.3646rem;padding-bottom:.3646rem;">
    <div v-if="showTitle" class="w-full h-49px flex justify-between items-center border-b-2 border-btn_1 relative" >
      <div class="w-full h-full flex items-center">
        <img src="@/static/images/hongtong/bt-l@2x.png" class="h-31px w-26px" alt />
        <span class="text-white text-32px flex items-center justify-center ml-12px">{{title}}</span>
        <span class="text-28px text-white opacity-80 absolute right-10 top-auto">{{subTitle}}</span>
      </div>
      <img src="@/static/images/hongtong/bt-r@2x.png" class=" absolute right-0 bottom-1" style="width:.2292rem" alt />
    </div>
    <slot name="box_main"/>
    <img v-if="showBorder" src="@/static/images/hongtong/boxTop.png" alt="" class="absolute w-full top-0 left-0 z-0">
    <img v-if="showBorder" src="@/static/images/hongtong/boxBottom.png" alt="" class="absolute w-full bottom-0 left-0 z-0" >
  </div>
</template>

<script>
export default {
  props:{
    showBorder: {
      default:true,
      type:Boolean
    },
    showTitle: {
      default:true,
      type:Boolean
    },
    title: {
    },
    subTitle: {
      type:String,
    }
  },
  data() {
    return {
    }
  },

}
</script>

<style scoped>
.main_bg{
  background-color: rgba(21, 32, 48, 0.2);
}
</style>
