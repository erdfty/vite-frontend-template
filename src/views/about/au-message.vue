<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleTabClick" style="margin-left: 8px;">
      <el-tab-pane name="unVisite">
        <template #label>未读消息(3)</template>
      </el-tab-pane>
      <el-tab-pane name="visited">
        <template #label>已读消息(2)</template>
      </el-tab-pane>
      <el-tab-pane name="recycle">
        <template #label>回收站(1)</template>
      </el-tab-pane>
    </el-tabs>
    <ul>
      <li class="au-flex au-flex-column-center" :class="{ 'au-mt-8' : isMobile, 'special': activeName === 'unVisite' }" v-for="(item) in list" :key="item.id">
        <p :class="isMobile ? 'au-text-line-two' : 'au-text-line-one'" @click="toNoticeDetail(item.id)">
          <span v-if="item.label">{{ item.label }}</span>
          {{ item.title }}
        </p>
        <small class="time">{{ item.time }}</small>
        <small class="operate" v-if="isMobile">
          <i v-if="activeName === 'unVisite'" class="el-icon-folder-checked icon-success" @click="clickOperate('visited', item)"></i>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-end" v-if="activeName === 'visited'">
            <i class="el-icon-delete" @click="clickOperate('delete', item)"></i>
          </el-tooltip>
          <i v-if="activeName === 'recycle'" class="el-icon-refresh-right icon-grey"  @click="clickOperate('reduction', item)"></i>
          <i v-if="activeName === 'recycle'" class="el-icon-folder-delete"  @click="clickOperate('destroy', item)"></i>
        </small>
        <small class="operate" v-else>
          <el-button v-if="activeName === 'unVisite'" size="small" @click="clickOperate('visited', item)">标为已读</el-button>
          <el-tooltip class="item" effect="dark" content="删除" placement="top-end" v-if="activeName === 'visited'">
            <el-button type="danger" size="small" @click="clickOperate('delete', item)">删 除</el-button>
          </el-tooltip>
          <el-button v-if="activeName === 'recycle'" size="small"  @click="clickOperate('reduction', item)">还 原</el-button>
          <el-button v-if="activeName === 'recycle'" type="danger" size="small" @click="clickOperate('destroy', item)">销 毁</el-button>
        </small>
      </li>
    </ul>
    <section class="au-text-end au-mt-32">
      <el-pagination
        :page-size="limit"
        :current-page="page"
        :pager-count="5"
        :layout="layout"
        :total="total"
        @size-change="pageSizeChange"
        @current-change="currentPageChange"
      />
    </section>
  </div>
</template>
<script>
import { defineComponent, ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import pagination from '../../components/au-pagination'
import { getMessageList } from '../../api/about'
export default defineComponent({
  name: 'AuMessage',
  props: {
    isMobile: {
      type: Boolean,
      default: false
    }
  },
  setup(prop, ctx) {
    const activeName = ref('unVisite')
    const list = ref([])
    const layout = computed(() => prop.isMobile ? 'prev, pager, next' : 'prev, pager, jumper, next')
    const handleTabClick = ({ props }) => {
      switch (props.name) {
        case 'unVisite':
          activeName.value = 'unVisite'
          break
        case 'visited':
          activeName.value = 'visited'
          break
        case 'recycle':
          activeName.value = 'recycle'
          break
      }
      fetchData({})
    }
    const toNoticeDetail = (i) => {
      ElMessage('敬请期待' + i)
    }
    const fetchData = ({ limit = 10, page = 1 }) => {
      getMessageList({ limit, page }).then(({ error_code, data, total }) => {
        if (error_code === 200) {
          list.value = [].concat(data)
          _pagination.changeTotal(total)
        }
      })
    }
    const clickOperate = (type, item) => {
      switch (type) {
        case 'delete': // 删除
          ElMessage.error('删除' + item.id)
        break
        case 'visited': // 标为已读
          ElMessage('标为已读' + item.id)
        break
        case 'destroy': // 销毁
           ElMessage.warning('销毁' + item.id)
        break
        case 'reduction': // 还原
           ElMessage.success('还原' + item.id)
        break
      }
    }
    const _pagination = pagination(ctx, fetchData, true)
    return {
      list,
      layout,
      activeName,
      toNoticeDetail,
      handleTabClick,
      isMobile: prop.isMobile,
      ..._pagination,
      clickOperate
    }
  },
})
</script>
<style lang="scss" scoped>
ul {
  li {
    position: relative;
    justify-content: space-between;
    overflow: hidden;
    white-space: nowrap;
    height: 60px;
    font-size: 15px;
    border-bottom: 1px solid #efefef;
    p {
      flex: 1;
      border-bottom: 1px dashed transparent;
      padding-bottom: 4px;
      font-family: fantasy;
      color: #777;
      cursor: pointer;
      transition: all .5s;
    }
    .time {
      position: inherit;
      width: 200px;
      color: #888;
      font-size: 12px;
      text-align: center;
    }
    .operate {
      max-width: 160px;
      min-width: 100px;
      text-align: center;
      color: #f00;
      cursor: pointer;
    }
    &:hover {
      p {
        color: rgba(167, 167, 167, 0.5);
        border-bottom: 1px dashed rgba(167, 167, 167, 0.5);
      }
    }
  }
  .special {
    p {
      color: #ed546b;
    }
    &:hover {
      .operate {
        color: #ed546b;
      }
    }
    &:hover {
      p {
        color: rgba(253, 100, 123, .5);
        border-bottom: 1px dashed rgb(237, 84, 107, .5);
      }
    }
  }
}
.icon-success {
  color: #67C23A;
}
.icon-grey {
  color: #a9a9a9;
}
@media screen and(max-width: 769px) {
  ul {
    li {
      height: 80px;
      .operate {
        max-width: 160px;
        min-width: 60px;
        & > i {
          font-size: 16px;
          margin-left: 16px;
        }
        & > i:nth-of-type(1) {
          margin-left: 0px;
        }
      }
      .time {
        width: 120px;
        top: 0px;
        right: 0;
        position: absolute;
      }
    }
  }
}

</style>
