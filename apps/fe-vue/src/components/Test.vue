<script setup lang="ts" vapor>
import { useQuery } from "@pinia/colada";
import { $fetch } from "ofetch";

const { data } = useQuery({
  key: () => ["test"],
  query: () => $fetch("/api/route"),
});
</script>

<template>
  <pre>{{ data }}</pre>
</template>
