<route lang="yaml">
name: home
meta:
  title: 主页
  icon: ant-design:home-twotone
</route>

<script setup lang="ts">
import _ from 'lodash'
import ActiveUsersBar from './components/active-users-bar.vue'
import PageHeader from './components/page-header.vue'
import Pending from './components/pending.vue'
import Recommendation from './components/recommendation.vue'
import TopCard from './components/top-card.vue'

defineOptions({
  name: 'Home',
})
const countConfig = ref({
  startValue: 0,
  endValue: _.random(1000, 20000),
  decimals: 2,
  prefix: '￥',
  suffix: '',
  separator: ',',
  duration: 8000,
})
</script>

<template>
  <div class="m-4">
    <ARow :gutter="20">
      <ACol :lg="24" :md="24" :sm="24" :xl="24" :xs="24">
        <PageHeader mb-5 />
      </ACol>
      <ACol :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
        <TopCard
          background="blue"
          :count-config="countConfig"
          icon="ri:money-cny-circle-line"
          percentage="10%"
          title="总销量"
        />
      </ACol>
      <ACol :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
        <TopCard background="white" percentage="30%" title="活跃用户">
          <template #tag>
            <ATag type="danger">
              日
            </ATag>
          </template>
          <template #chart>
            <ActiveUsersBar />
          </template>
        </TopCard>
      </ACol>
      <ACol :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
        <TopCard background="white" percentage="44%" title="总成交" icon="ri:money-cny-box-line" />
      </ACol>
      <ACol :lg="6" :md="12" :sm="24" :xl="6" :xs="24">
        <TopCard background="white" percentage="10%" title="订单" icon="ri:passport-line" />
      </ACol>
      <ACol :lg="12" :md="24" :sm="24" :xl="12" :xs="24">
        <Pending />
      </ACol>
      <ACol :lg="24" :md="24" :sm="24" :xl="24" :xs="24">
        <Recommendation />
      </ACol>
    </ARow>
    <!--    测试 rem-to-px-converter -->
    <!--    <div class="columns has-text-centered flex text-center"> -->
    <!--      <div class="column"> -->
    <!--        <p class="heading text-primary"> -->
    <!--          EM -->
    <!--        </p> <p id="emPreview" class="title" style="font-size: 1em;"> -->
    <!--          Hello -->
    <!--        </p> -->
    <!--      </div> <div class="column"> -->
    <!--        <p class="heading text-lightblue"> -->
    <!--          REM -->
    <!--        </p> <p id="remPreview" class="title" style="font-size: 1rem;"> -->
    <!--          Hello -->
    <!--        </p> -->
    <!--      </div> <div class="column"> -->
    <!--        <p class="heading text-green"> -->
    <!--          Pixel -->
    <!--        </p> <p id="pixelPreview" class="title" style="font-size: 16px;"> -->
    <!--          Hello -->
    <!--        </p> -->
    <!--      </div> <div class="column"> -->
    <!--        <p class="heading text-yellow"> -->
    <!--          Percent -->
    <!--        </p> <p id="percentPreview" class="title" style="font-size: 100%;"> -->
    <!--          Hello -->
    <!--        </p> -->
    <!--      </div> <div class="column"> -->
    <!--        <p class="heading text-blue"> -->
    <!--          Point -->
    <!--        </p> <p id="pointPreview" class="title" style="font-size: 12pt;"> -->
    <!--          Hello -->
    <!--        </p> -->
    <!--      </div> -->
    <!--    </div> -->
  </div>
</template>

<style scoped>
.columns {
  display: flex;
}

.has-text-centered {
  text-align: center !important;
}

.column {
  display: block;
  flex: 1 1 0;
  padding: 0.75rem;
}

.heading {
  display: block;
  margin-bottom: 5px;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.title {
  font-size: 2rem;
  font-weight: 600;
  line-height: 1.125;
  color: #363636;
}

.subtitle,
.title {
  word-break: break-word;
}
</style>
