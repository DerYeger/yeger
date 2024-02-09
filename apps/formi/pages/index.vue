<script setup lang="ts">
const { appLink, featuresLink } = useLinks()
</script>

<template>
  <div
    v-once
    class="space-between mx-auto flex max-w-none flex-col-reverse content-start gap-16 md:max-w-6xl md:flex-row"
  >
    <div class="md:w-50% flex flex-col gap-10">
      <h2
        class="text-lg font-bold uppercase text-stone-800 sm:text-2xl lg:text-3xl"
      >
        FOL Model Checking
      </h2>
      <h1 class="text-4xl font-black text-stone-800 sm:text-5xl lg:text-6xl">
        Try.<br>
        Learn.<br>
        Understand.
      </h1>
      <HeroProse>
        Formi is a web-application for model checking first-order-logic
        formulas. Interactive graphs visualize models that are defined using an
        intuitive YAML-based editor.
      </HeroProse>
      <HeroProse>
        Real-time validation of formula and model inputs results in a
        near-instantaneous feedback cycle. Formulas and evaluation results are
        displayed as trees, presenting insight into the formula AST and model
        checking results.
      </HeroProse>
      <div class="flex flex-col items-start gap-4 lg:flex-row">
        <LinkButton :link="appLink">
          Try Now
        </LinkButton>
        <LinkButton
          :link="featuresLink"
          description="Learn more about the features of Formi."
          class="border-1 border-stone-900 bg-transparent text-stone-900 hover:border-stone-700 hover:text-stone-100"
        >
          Read More
        </LinkButton>
      </div>
    </div>
    <div class="mx-auto mt--16 max-w-full flex-1 md:mt-0">
      <HeroImage />
    </div>
  </div>
</template>
