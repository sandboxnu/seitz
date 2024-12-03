<script setup lang="ts">
import studiesAPI from "@/api/studies";
import { useMutation } from "@tanstack/vue-query";

const emit = defineEmits(["deleted"]);
const props = defineProps<{ name: string; description: string; id: string }>();
useMutation({
  mutationFn: () => studiesAPI.deleteStudy(props.id),
  onSuccess: () => {
    emit("deleted");
  },
});
</script>

<template>
  <div
    class="h-[179px] px-6 py-[21px] bg-neutral-10 rounded-[15px] border border-neutral-300 flex-col justify-between items-start gap-2.5"
  >
    <div className="self-stretch justify-start items-end ">
      <div
        className="w-[357px] flex-col justify-start items-start gap-3 inline-flex"
      >
        <div
          className=" text-neutral-600 h-7 text-2xl font-bold font-['Lato'] leading-7"
        >
          {{ name }}
        </div>
        <div
          className="self-stretch h-9 text-neutral-600 text-sm font-medium font-['Lato'] leading-[18px] line-clamp-2"
        >
          {{ description }}
        </div>
      </div>
      <div className=" py-3 justify-start items-end gap-[87px] inline-flex">
        <div
          className="w-[188px] flex-col justify-start items-start gap-1 flex"
        >
          <div className=" justify-center items-center inline-flex">
            <div>
              <span
                class="text-neutral-600 text-sm font-bold font-['Lato'] leading-tight"
                >Variants: </span
              ><span
                class="text-neutral-600 text-sm font-medium font-['Lato'] leading-[18px]"
                >50</span
              >
            </div>
          </div>
          <div
            className="self-stretch justify-start items-center gap-[5px] inline-flex"
          >
            <div
              className="w-[86px] h-[17px] text-neutral-400 text-sm font-medium font-['Lato'] leading-[18px]"
            >
              Last Modified
            </div>
            <div className="w-1 h-1 bg-[#b9adaa] rounded-full" />
            <div
              className="w-[88px] h-[17px] text-neutral-400 text-sm font-medium font-['Lato'] leading-[18px]"
            >
              Oct 24, 2024
            </div>
          </div>
        </div>
        <div
          className="px-3 py-1.5 bg-primary-50 rounded-lg border border-primary-100 justify-start items-center gap-2 flex"
        >
          <div className="text-neutral-600 text-base font-normal font-['Lato']">
            Editing
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="w-[357px] h-[140px] relative">
      <div
        class="h-[76px] left-0 top-0 absolute flex-col justify-start items-start gap-3 inline-flex"
      >
        <div class="self-stretch justify-between items-center inline-flex">
          <div
            class="text-neutral-600 text-2xl font-bold font-['Lato'] leading-7"
          >
            {{ name }}
          </div>
        </div>
        <div
          class="self-stretch text-neutral-600 text-sm font-medium font-['Lato'] leading-[18px]"
        >
          {{ description }}
        </div>
      </div>
      <div
        class="px-3 py-1.5 left-[275px] top-[101px] absolute bg-[#ffede9] rounded-lg border border-primary-100 justify-start items-center gap-2"
      >
        <div class="text-neutral-600 text-base font-normal font-['Lato']">
          Editing
        </div>
      </div>
      <div
        class="left-0 top-[115px] absolute justify-start items-center gap-[5px] inline-flex"
      >
        <div
          class="flex text-neutral-400 text-sm font-medium font-['Lato'] leading-[18px]"
        >
          Last Modified
        </div>
        <div class="w-1 h-1 bg-neutral-400 rounded-full"></div>
        <div
          class="w-[88px] h-[17px] text-neutral-400 text-sm font-medium font-['Lato'] leading-[18px]"
        >
          Oct 24, 2024
        </div>
      </div>
      <div class="w-[81px] h-[17px] left-0 top-[91px] absolute">
        <span
          class="text-neutral-600 text-sm font-bold font-['Lato'] leading-tight"
          >Variants: </span
        ><span
          class="text-neutral-600 text-sm font-medium font-['Lato'] leading-[18px]"
          >50</span
        >
      </div>
    </div> -->
  </div>
</template>
