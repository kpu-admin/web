<script setup lang="ts">
defineOptions({
  name: 'Recommendation',
})
const apps = ref([{
  icon: 'i-ri:bank-line',
  title: '工商建议',
  tips: '工商建议快捷入口',
  value: 1,
  link: '',
}, {
  icon: 'i-ri:copyright-line',
  title: '商标管理',
  tips: '商标管理快捷入口',
  link: '',
}, {
  icon: 'i-ri:book-3-line',
  title: '专利查询',
  tips: '专利查询快捷入口',
  link: '',
}, {
  icon: 'i-ri:check-double-line',
  title: '著作权查询',
  tips: '著作权查询快捷入口',
  link: '',
}, {
  icon: 'i-ri:codepen-line',
  title: '证照管理',
  tips: '证照管理快捷入口',
  link: '',
}, {
  icon: 'i-ri:discuss-line',
  title: '纳税提醒',
  tips: '纳税提醒快捷入口',
  link: '',
}, {
  icon: 'i-ri:emotion-unhappy-line',
  title: '违规查询',
  tips: '违规查询快捷入口',
  link: '',
}, {
  icon: 'i-ri:apps-2-line',
  title: '全部应用',
  tips: '全部应用快捷入口',
  link: '',
}])
</script>

<template>
  <ACard class="recommendation" :body-style="{ height: '100%' }">
    <template #title>
      <KpuIcon name="i-ri:reserved-line" />
      经营建议
    </template>
    <ARow :gutter="20">
      <ACol v-for="(item, i) in apps" :key="i" :lg="6" :md="8" :sm="8" :xl="6" :xs="24">
        <router-link v-slot="{ href }" custom :to="item.link">
          <a :href="href" class="cursor-pointer no-underline">
            <div class="icon-panel h-17.5 p-2.5">
              <ABadge :count="item.value" class="item">
                <KpuIcon :name="item.icon" />
              </ABadge>
              <div class="icon-panel-title">
                {{ item.title }}
                <div class="icon-panel-tips">
                  {{ item.tips }}
                </div>
              </div>
            </div>
          </a>
        </router-link>
      </ACol>
    </ARow>
  </ACard>
</template>

<style scoped>
.recommendation {
  &.ant-card,
  .ant-card {
    margin-bottom: 1.25rem;
  }

  .icon-panel:hover .item > i {
    color: #fff;
    background: rgb(var(--primary));
  }

  .item {
    > i {
      display: inline-flex;
      width: 50px;
      height: 50px;
      font-size: 30px;
      line-height: 50px;
      color: rgb(var(--primary));
      background: rgb(var(--primary) / 10%);
      border-radius: var(--el-border-radius-base);
      transition: all ease-in-out 0.3s;
    }
  }

  .icon-panel-title {
    display: inline-block;
    margin-left: 10px;
    vertical-align: 6px;
    color: #0f0f0f;

    .icon-panel-tips {
      margin-top: 5px;
      font-size: 0.75rem;
      color: #0f0f0f;
    }
  }
}
</style>
