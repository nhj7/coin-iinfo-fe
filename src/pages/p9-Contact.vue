<script setup lang="ts">
// 이 페이지에는 별도의 스크립트 로직이 필요하지 않습니다.
</script>

<template>
  <div class="card w-full max-w-lg bg-base-200 shadow-xl">
    <div class="card-body">
      <h2 class="card-title text-3xl">Contact Us</h2>
      <p>궁금한 점이 있으시면 언제든지 문의해주세요!</p>
      <div class="form-control mt-4">
        <label class="label">
          <span class="label-text">이메일</span>
        </label>
        <input type="email" placeholder="email@example.com" class="input input-bordered" />
      </div>
      <div class="form-control">
        <label class="label">
          <span class="label-text">메시지</span>
        </label>
        <textarea class="textarea textarea-bordered h-24" placeholder="내용을 입력하세요..."></textarea>
      </div>
      <div class="card-actions justify-end mt-4">
        <button class="btn btn-primary">보내기</button>
      </div>
    </div>
  </div>
</template>