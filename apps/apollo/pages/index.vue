<script setup lang="ts">
const { appLink, detailsLink } = useLinks()
</script>

<template>
  <div
    v-once
    class="flex flex-col-reverse content-start md:flex-row space-between gap-16 max-w-none md:max-w-6xl mx-auto"
  >
    <div class="flex flex-col gap-10 md:w-50%">
      <h2
        class="text-lg sm:text-2xl lg:text-3xl font-bold uppercase text-stone-800"
      >
        FOL Model Checking
      </h2>
      <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-800">
        Try.<br />
        Learn.<br />
        Understand.
      </h1>
      <HeroProse>
        Apollo is a web-application for model checking first-order-logic
        formulas. An interactive graph visualizes models that are defined using
        an intuitive YAML-based editor.
      </HeroProse>
      <HeroProse>
        Real-time validation of formula and model inputs make the feedback cycle
        near-instantaneous. Formulas and evaluation results are displayed as
        trees, presenting insight into the formula AST and model-checking
        results.
      </HeroProse>
      <div class="flex flex-col lg:flex-row gap-4 items-start">
        <LinkButton :link="appLink"> Try Now </LinkButton>
        <LinkButton
          :link="detailsLink"
          description="Learn more about the features of Apollo."
          class="bg-transparent text-stone-900 border-stone-900 border-1 hover:border-stone-700 hover:text-stone-100"
        >
          Read More
        </LinkButton>
      </div>
    </div>
    <div class="max-w-full flex-1 mt--16 md:mt-0 mx-auto">
      <HeroImage />
    </div>
  </div>
</template>
