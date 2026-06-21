<template>
  <!-- Grid skeleton: 6 placeholder cards -->
  <div v-if="mode === 'grid'" class="skeleton-grid" aria-busy="true" aria-label="Loading branches…">
    <div v-for="n in count" :key="n" class="sk-card">
      <!-- Top row: badge + fav -->
      <div class="sk-row">
        <span class="sk-block shimmer" style="width:72px;height:22px;border-radius:20px"></span>
        <span class="sk-block shimmer" style="width:24px;height:24px;border-radius:50%"></span>
      </div>

      <!-- Title block -->
      <div class="sk-col" style="gap:6px">
        <span class="sk-block shimmer" style="width:75%;height:16px"></span>
        <span class="sk-block shimmer" style="width:55%;height:13px"></span>
      </div>

      <!-- Detail rows -->
      <div class="sk-detail-box">
        <div v-for="d in 3" :key="d" class="sk-row" style="gap:8px">
          <span class="sk-block shimmer" style="width:18px;height:14px;flex-shrink:0;border-radius:4px"></span>
          <span class="sk-block shimmer" :style="`width:${60 + d * 8}%;height:13px`"></span>
        </div>
      </div>

      <!-- Action buttons (admin shimmer hint) -->
      <div class="sk-row" style="gap:8px">
        <span class="sk-block shimmer" style="flex:1;height:32px;border-radius:8px"></span>
        <span class="sk-block shimmer" style="flex:1;height:32px;border-radius:8px"></span>
      </div>
    </div>
  </div>

  <!-- Table skeleton: rows -->
  <div v-else class="sk-table-wrap" aria-busy="true" aria-label="Loading branches…">
    <!-- fake header -->
    <div class="sk-table-head">
      <span v-for="w in ['25%','12%','14%','18%','6%','15%']" :key="w"
        class="sk-block shimmer" :style="`width:${w};height:13px`"></span>
    </div>
    <div v-for="n in count" :key="n" class="sk-table-row">
      <div class="sk-col" style="gap:5px;width:25%">
        <span class="sk-block shimmer" style="width:90%;height:14px"></span>
        <span class="sk-block shimmer" style="width:55%;height:11px;border-radius:10px"></span>
      </div>
      <span class="sk-block shimmer" style="width:12%;height:13px"></span>
      <span class="sk-block shimmer" style="width:14%;height:13px"></span>
      <span class="sk-block shimmer" style="width:18%;height:13px"></span>
      <span class="sk-block shimmer" style="width:6%;height:18px;border-radius:50%"></span>
      <div class="sk-row" style="width:15%;gap:6px">
        <span class="sk-block shimmer" style="flex:1;height:26px;border-radius:6px"></span>
        <span class="sk-block shimmer" style="flex:1;height:26px;border-radius:6px"></span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  mode:  { type: String, default: 'grid' },
  count: { type: Number, default: 6 }
})
</script>

<style scoped>
/* ── Grid layout ── */
.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 18px;
}

/* ── Card shape ── */
.sk-card {
  background: var(--surface);
  border: 1.5px solid var(--border);
  border-radius: 18px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  animation: fadeIn .4s ease;
}

@keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; } }

.sk-row   { display: flex; align-items: center; justify-content: space-between; }
.sk-col   { display: flex; flex-direction: column; }
.sk-block { display: inline-block; border-radius: 8px; }

.sk-detail-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: var(--bg);
  border-radius: 10px;
  padding: 12px;
}
.sk-detail-box .sk-row { justify-content: flex-start; }

/* ── Table layout ── */
.sk-table-wrap {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 14px;
  overflow: hidden;
}

.sk-table-head {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 18px;
  background: var(--bg);
  border-bottom: 1px solid var(--border);
}

.sk-table-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-bottom: 1px solid var(--border);
  animation: fadeIn .4s ease;
}
.sk-table-row:last-child { border-bottom: none; }

/* ── Responsive ── */
@media (max-width: 640px) {
  .skeleton-grid { grid-template-columns: 1fr; }
  .sk-table-wrap { display: none; }
}
</style>
