<script setup lang="ts">
// Vue의 반응형 API와 라이프사이클 훅을 임포트합니다.
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute } from 'vue-router';
import { Icon } from "@iconify/vue";
import { useExchangeStore } from './stores/exchange';
import { useUpbitWebSocket } from './composables/useUpbitWebSocket';

// <script setup> 내부에 직접 작성된 코드는
// 컴포넌트가 생성될 때(Options API의 created hook처럼) 실행됩니다.
console.log('App.vue component has been created!');

// daisyUI에서 제공하는 모든 테마 목록입니다.
// (daisyUI v5 기준 35개 테마)
const themes: string[]  = ["light","dark","cupcake","bumblebee","emerald","corporate","synthwave","retro","cyberpunk","valentine","halloween","garden","forest","aqua","lofi","pastel","fantasy","wireframe","black","luxury","dracula","cmyk","autumn","business","acid","lemonade","night","coffee","winter","dim","nord","sunset","caramellatte","abyss","silk"];
// 테마 아이콘
const themeIcons: string[] = [
  "weather-sunny", "weather-night", "cupcake", "bee", "diamond-stone",
  "office-building", "sine-wave", "gamepad-variant", "robot-industrial", "heart",
  "pumpkin", "flower", "pine-tree", "water", "headphones",
  "palette", "castle", "vector-square", "circle", "crown",
  "bat", "printer-3d", "leaf-maple", "briefcase", "beaker",
  "glass-cocktail", "weather-night", "coffee", "snowflake", "brightness-6",
  "compass-outline", "weather-sunset", "coffee-to-go", "diving", "hanger"
];

// 로컬 스토리지에 저장될 테마 키
const THEME_KEY = 'daisyui-theme';

// 현재 테마를 저장하는 반응형 변수. 로컬 스토리지에서 가져오거나 기본값 'light'로 설정합니다.
const currentTheme = ref(localStorage.getItem(THEME_KEY) || 'light');

// Exchange store
const exchangeStore = useExchangeStore();

// 업비트 웹소켓
const upbitWs = useUpbitWebSocket();

// HTML 문서의 <html> 태그에 data-theme 속성을 적용하고 로컬 스토리지에 저장하는 함수
const applyTheme = (theme: string) => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
};

// 컴포넌트가 마운트될 때 (초기 로드 시) 현재 테마를 적용합니다.
onMounted(async () => {
  applyTheme(currentTheme.value);
  // 환율 정보 가져오기
  await exchangeStore.fetchExchangeRate();
  // 업비트 웹소켓 연결
  upbitWs.connect();
});

// currentTheme 값이 변경될 때마다 테마를 적용합니다.
watch(currentTheme, (newTheme) => {
  applyTheme(newTheme);
});

// LNB Drawer 체크박스에 대한 템플릿 참조를 생성합니다.
const drawerToggle = ref<HTMLInputElement | null>(null);

// 모바일에서 메뉴 클릭 시 drawer를 닫는 함수입니다.
const closeDrawer = () => {
  if (drawerToggle.value) {
    drawerToggle.value.checked = false;
  }
};



// 현재 라우트 정보
const route = useRoute();

// Breadcrumbs 생성
const breadcrumbs = computed(() => {
  const pathArray = route.path.split('/').filter(p => p);
  const crumbs = [{ name: 'Home', path: '/' }];

  let currentPath = '';
  pathArray.forEach(segment => {
    currentPath += `/${segment}`;
    crumbs.push({
      name: segment.charAt(0).toUpperCase() + segment.slice(1),
      path: currentPath
    });
  });

  return crumbs;
});
</script>
 
<template>
  <div class="flex flex-col h-screen">
    <!-- Navbar -->
    <div class="navbar bg-base-300 sticky top-0 z-50">
      <div class="flex-none lg:hidden">
        <label for="my-drawer-2" aria-label="open sidebar" class="btn btn-square btn-ghost">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block h-6 w-6 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </label>
      </div>
      <div class="flex-1">
        <a class="btn btn-ghost text-xl">coinfo</a>
      </div>
      <!-- 테마 변경 콤보박스 -->
      <div class="flex-none">
        <!-- daisyUI Dropdown으로 교체 -->
        <div class="dropdown dropdown-end">
          <div ref="themeDropdownButton" tabindex="0" role="button" class="btn btn-ghost normal-case">
            <Icon :icon="`mdi:${themeIcons[themes.indexOf(currentTheme)]}`" class="inline-block h-5 w-5" />
            <span class="hidden md:inline">{{ currentTheme }}</span>
            <svg width="12px" height="12px" class="ml-1 hidden h-3 w-3 fill-current opacity-60 sm:inline-block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2048 2048"><path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path></svg>
          </div>
          <ul tabindex="0" class="dropdown-content z-[1] menu menu-sm mt-3 max-h-96 w-56 overflow-y-auto rounded-box bg-base-200 p-2 shadow">
            <li v-for="(theme, index) in themes" :key="theme">
              <a @click="currentTheme = theme" :class="{ 'active': currentTheme === theme }">
                <Icon :icon="`mdi:${themeIcons[index]}`" class="inline-block h-4 w-4" /> {{ theme }}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Page Content -->
    <div class="drawer lg:drawer-open flex-grow ">
      <input id="my-drawer-2" type="checkbox" class="drawer-toggle" ref="drawerToggle" />
      <div class="drawer-content flex flex-col">
        <!-- Breadcrumbs -->
        <div class="breadcrumbs text-sm pt-2 px-4 py-2 bg-base-100 border-b border-base-300 flex justify-between items-center">
          <ul>
            <li v-for="(crumb, index) in breadcrumbs" :key="crumb.path">
              <router-link v-if="index < breadcrumbs.length - 1" :to="crumb.path">
                {{ crumb.name }}
              </router-link>
              <span v-else>{{ crumb.name }}</span>
            </li>
          </ul>
          <span v-if="exchangeStore.usdKrw" class="text-xs opacity-70">
            환율: {{ exchangeStore.usdKrw.toLocaleString() }}
          </span>
        </div>
        <!-- Main content here -->
        <main class="flex-grow ">
          <router-view />
        </main>
      </div>
      <div class="drawer-side lg:sticky lg:top-0">
        <label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay"></label>
        <ul class="menu p-4 w-50 h-full bg-base-200 text-base-content " @click="closeDrawer">
          <!-- Sidebar content here -->
          <li class="menu-title">LNB Menu</li>
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/contact">Contact</router-link></li>
        </ul>
      </div>

      <div class="dock dock-xs lg:hidden">
        <button class="dock-active">
          <Icon icon="mdi:home" class="inline-block h-5 w-5" />
        </button>

        <button >
          <Icon icon="mdi:chat" class="inline-block h-5 w-5" />
        </button>

        <button>
          <Icon icon="mdi:cog" class="inline-block h-5 w-5" />
        </button>
      </div>

    </div>
  </div>
</template>
