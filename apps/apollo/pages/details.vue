<script setup lang="ts">
import { FOL } from '@yeger/fol'

const { formula } = useDemoData()

const parsedFormula = FOL.parse(formula).get()

const { createDemoModel, modelInput } = useDemoData()
const model = createDemoModel()
const trace = FOL.trace('lazy', true, model, parsedFormula).get()
</script>

<template>
  <div v-once class="flex flex-col items-center gap-16 md:gap-32">
    <DetailsSection title="Models" :number="1">
      <DetailsParagraph>
        <p>
          The intuitive YAML-based editor enables users to quickly define models
          through textual input. At the same time, the portable format can be
          used to store and share models.
        </p>
        <p>
          On-the-fly validation warns about issues, such as non-total functions,
          but does not prevent model checking.
        </p>
      </DetailsParagraph>
      <DemoCard>
        <ModelInput :model-value="modelInput" :disabled="true" />
      </DemoCard>
      <DetailsParagraph>
        An interactive graph visualizes model domains, constants, functions, and
        relations. Touch input and mouse input are supported. Zooming and
        panning ensure that even the largest models can be inspected.
      </DetailsParagraph>
      <DemoCard>
        <ModelGraph :model="model" class="!h-48 !md:h-96 bg-white" />
      </DemoCard>
    </DetailsSection>
    <DetailsSection title="Formulas" :number="2">
      <DetailsParagraph>
        Formulas are parsed in real-time, with helpful error messages for syntax
        errors.
      </DetailsParagraph>
      <DemoCard class="p-4 flex flex-col justify-center items-center gap-6">
        <span>{{ formula }}</span>
        <span class="text-stone-600">is parsed as</span>
        <code>{{ parsedFormula.toFormattedString() }}</code>
      </DemoCard>
      <DetailsParagraph>
        The ASTs of formulas are visualized and display operator precedence. Any
        non-terminal node can be expanded and collapsed to reveal or hide
        sub-formulas respectively.
      </DetailsParagraph>
      <DemoCard class="mx-auto w-fit border-none shadow-none !bg-stone-400">
        <FOLTree
          :fragment="parsedFormula"
          :max-depth="parsedFormula.depth()"
          :level="0"
        />
      </DemoCard>
    </DetailsSection>
    <DetailsSection title="Model Checking" :number="3">
      <DetailsParagraph>
        <p>
          Every evaluation step of the recursive model checking algorithm is
          represented as a node in the evaluation tree. This ensures that
          results are always tangible.
        </p>
        <p>
          A checkmark indicates that the (sub-)formula must be modelled by the
          model, a cross represents the opposite. The colors green and red show
          whether the actual result matches the expected result or not.
        </p>
      </DetailsParagraph>
      <DemoCard class="mx-auto w-fit border-none shadow-none !bg-stone-400">
        <ModelCheckerTraceTree
          :trace="trace"
          :is-root-mismatched="trace.actual !== trace.expected"
          :level="0"
          :max-depth="trace.depth()"
        />
      </DemoCard>
    </DetailsSection>
  </div>
</template>
