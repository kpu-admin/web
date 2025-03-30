<script setup lang="ts">
defineOptions({
  name: 'Pending',
})
const v = ref('rgba(240,2,20,0.098)')
const _ = ref('#fff')
const background = ref('rgb(var(--primary) / 10%)')
const b = ref('#fff')
const f = {
  background: `linear-gradient(to right,${v.value}, ${_.value}) no-repeat`,
  border: 0,
  height: '135.19px',
}
const y = {
  background: `linear-gradient(to right,${background.value}, ${b.value}) no-repeat`,
  border: 0,
  height: '135.19px',
}
</script>

<template>
  <ACard class="pending">
    <template #title>
      <KpuIcon name="ri:ball-pen-line" />
      待处理
      <ABadge type="danger" class="pending-count" :count="6" />
    </template>
    <ARow :gutter="20">
      <ACol :lg="12" :md="12" :sm="24" :xl="12" :xs="24">
        <ACard :style="f" :body-style="{ height: '100%' }">
          <div class="parting-line parting-line-danger" />
          <span class="pending-title pending-title-danger">
            订单预警
            <span>产品爆单，请及时处理</span>
          </span>
          <ATag color="default" size="small">
            完成中
          </ATag>
          <span class="pending-tips">预警原因：用户投诉发货不及时</span>
        </ACard>
      </ACol>
      <ACol :lg="12" :md="12" :sm="24" :xl="12" :xs="24">
        <ACard :style="y" :body-style="{ height: '100%' }">
          <div class="parting-line parting-line-primary" />
          <span class="pending-title pending-title-primary">
            售后工单
            <span>用户张*给予五星好评</span>
          </span>
          <ATag size="small" color="error">
            未完成
          </ATag>
          <span class="pending-tips">订单号：12345689654321</span>
        </ACard>
      </ACol>
    </ARow>
  </ACard>
</template>

<style scoped>
.pending {
  &.ant-card,
  .ant-card {
    margin-bottom: 1.25rem;
  }

  :deep(.ant-card__header) {
    justify-content: flex-start;

    &::after {
      position: unset;
      content: unset;
    }
  }

  :deep(.ant-card-body) {
    position: relative;
    padding-bottom: 0;
  }

  /*
  .pending-count {
    --el-badge-size: 16px;

    margin-left: 3px;
  } */

  /*  :deep(sup) {
    position: relative;
    top: -1px;
    line-height: 0;
    vertical-align: baseline;
  } */

  :deep(.el-tag) {
    margin-right: 5px;
  }

  .parting {
    &-line {
      float: left;
      width: 10px;
      height: calc(100% - 50px);
      margin-top: 15px;
      margin-right: 20px;
      border-radius: 10px;

      &-danger {
        background: rgb(var(--primary));
      }

      &-primary {
        background: rgb(var(--primary));
      }
    }
  }

  &-title {
    display: block;
    margin-top: 12px;
    font-size: var(--el-font-size-medium);
    font-weight: 700;
    line-height: 38px;

    span {
      font-size: var(--el-font-size-extra-small);
      font-weight: 400;
    }

    &-danger {
      color: rgb(var(--primary));
    }

    &-primary {
      color: rgb(var(--primary));
    }
  }

  &-tips {
    font-size: var(--el-font-size-extra-small);
    color: var(--el-color-grey);
  }
}
</style>
