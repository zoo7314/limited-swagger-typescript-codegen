<script setup lang="ts">
import { Api } from './api';

async function send() {
  // const res = await Api.EntryGuideControllerService.getBizEntryGuideList({
  //   companyCode: '1019',
  // })
  // console.log(res.data[0].deptName)

  // const res = await Api.BannerControllerService.postBizBannerList({
  //   type: 'banner_app_index',
  //   pageNum: 1,
  //   pageSize: 2,
  // })
  // console.log(res.data.content?.[0])

  // const res = await Api.AppRoleControllerService.getBizAppRoleList({
  //   id: 1,
  //   menuIds: 2,
  //   roleCode: '',
  //   roleName: '',
  //   pageNum: 2,
  //   pageSize: 20,
  // })
  // console.log(res.data.content?.[0].roleName)


}

async function onFileChange(e: Event) {
  // const el = e.target as HTMLInputElement
  // const res = await Api.EntryGuideManageControllerService.postBizEntryGuideManageUpload({
  //   companyCode: '1019',
  //   file: el.files?.[0] ?? new Blob(),
  //   // @ts-ignore
  //   dirId: '878315635362930688',
  // })
  // console.log(res)
}

</script>

<template>
<main>
  <p>home view</p>
  <div>
    <button @click="send">Click.</button>
  </div>
  <div>
    <input type="file" name="" id="" @change="onFileChange" />
  </div>
</main>
</template>
