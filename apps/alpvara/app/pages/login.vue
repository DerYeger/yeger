<script setup lang="ts">
const { data } = useFetch('/api/login-url')
</script>

<template>
  <div v-if="data" class="m-auto flex flex-col items-center gap-8 p-4">
    <IntroText />
    <div>
      <a :href="data" target="_self" class="connect-with-parqet connect-with-parqet--md">
        <img
          src="https://developer.parqet.com/img/parqet-icon-trans.svg"
          alt=""
          aria-hidden="true"
          class="connect-with-parqet__icon"
        />
        Connect with Parqet
      </a>
    </div>
  </div>
</template>

<style scoped>
.connect-with-parqet {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  background-color: #009991;
  color: white;
  text-decoration: none;
  cursor: pointer;
  font-weight: 600;
  white-space: nowrap;
  border-radius: 0.375rem;
  border: none;
}

.connect-with-parqet:hover {
  background-color: #5bcec2;
}

.connect-with-parqet:focus-visible {
  outline: 2px solid #009991;
  outline-offset: 2px;
}

.connect-with-parqet--xs {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
}

.connect-with-parqet--sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.connect-with-parqet--md {
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
}

.connect-with-parqet--lg {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.connect-with-parqet--xl {
  padding: 0.625rem 1.25rem;
  font-size: 0.875rem;
}

.connect-with-parqet__icon {
  width: 1.6em;
  height: 1.6em;
  margin-block: -0.25em;
  flex-shrink: 0;
}
</style>
