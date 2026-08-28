---
head:
  - - meta
    - http-equiv: refresh
      content: 0;url=../
---

<script setup>
import { onMounted } from 'vue'
import { useRouter, withBase } from 'vitepress'

const router = useRouter()
onMounted(() => {
  router.go(withBase('/'))
})
</script>
