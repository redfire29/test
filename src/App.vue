<script setup>
import api from '@/plugins/api.js';
import to from 'await-to-js';
import set from 'lodash/set';
import get from 'lodash/get';
import concat from 'lodash/concat';
import { onMounted, ref } from 'vue';

const pageLimit = 6;
let page = 1;
const reposList = ref([]);
const loading = ref(false);
const loaderror = false;
const getRepos = async () => {
  const [err, data] = await to(api.getRepos(page, pageLimit));
  console.log(data, 'data');
  if (err) {
    loading.value = false;
    loaderror = true;
    console.log(err.message);
  } else {
    if (get(data, 'length') > 0) {
      loaderror = true;
      set(reposList, 'value', concat(reposList.value, data));
    }
    loading.value = false;
  }
}

const isInViewport = (el) => {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

const scrollFunction = () => {
  console.log(isInViewport(document.querySelector('#loadingbtn')), 'scrollFunction');
  if (isInViewport(document.querySelector('#loadingbtn'))) {
    if (!loaderror) {
      loading.value = true;
      page = page + 1;
      getRepos();
    }
  }
}

window.addEventListener('scroll', scrollFunction);

onMounted(() => {
  console.log('onMounted');
  getRepos();
  scrollFunction();
})
</script>

<template lang="pug">
div(class="p-2")
  h1(class="text-5xl text-white") 標題
  div(class="mt-2")
    div(v-for="(list, index) in reposList", class="p-2 shadow mb-2 rounded", :class="{'bg-lime-900': index % 2 === 0, 'bg-lime-800': index % 2 !== 0}")
      p(class="text-xl text-white") {{ get(list, 'name') }}
      p(class="text-white") {{ get(list, 'description') }}
      a(:href="get(list, 'html_url')", target="_blank") {{ get(list, 'html_url') }}
    div(id="loadingbtn")
      div(v-if="loading")
        svg(xmlns="http://www.w3.org/2000/svg", fill="none", viewBox="0 0 24 24", stroke-width="1.5", stroke="currentColor", class="w-6 h-6 m-auto animate-spin")
          path(stroke-linecap="round", stroke-linejoin="round", d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99")
</template>

<style scoped>
</style>
