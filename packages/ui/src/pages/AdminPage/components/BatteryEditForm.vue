<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useBatteryEditingStore } from "../../../stores/admin";
import AppButton from "../../../components/ui/AppButton.vue";
import BatteryEditFormSection from "./BatteryEditFormSection.vue";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import taskAPI from "@/api/tasks";
import { ElNotification } from "element-plus";
import adminAPI from "@/api/admin";
import authAPI from "@/api/auth";
import DeleteButton from "../../../components/ui/DeleteButton.vue";
import SecondaryButton from "../../../components/ui/SecondaryButton.vue";

const store = useBatteryEditingStore();
const { isLoading, isError, batteryData } = storeToRefs(store);
const queryClient = useQueryClient();

const favoriteMutation = useMutation({
  mutationFn: ({ userId, batteryId }: { userId: string; batteryId: string }) =>
    adminAPI.toggleFavoriteBattery(userId, batteryId),
  onSuccess: () => {
    queryClient.invalidateQueries(["user"]);
  },
});

const { data: currentUser } = useQuery({
  queryKey: ["user"],
  queryFn: authAPI.getCurrentUser,
});

const deleteMutation = useMutation({
  mutationFn: ({ batteryId, userId }: { batteryId: string; userId: string }) =>
    taskAPI.deleteBattery(batteryId, userId),
  onSuccess: () => {
    queryClient.invalidateQueries(["tasks"]);
    ElNotification({
      title: "Success",
      message: "Battery deleted successfully",
      type: "success",
    });
    store.deselect();
  },
});

const publishMutation = useMutation({
  mutationFn: taskAPI.publishBattery,
  onSuccess: () => {
    queryClient.invalidateQueries(["tasks"]);
    store.select(batteryData.value?._id?.toString() || "");
    ElNotification({
      title: "Success",
      message: `Battery successfully ${
        batteryData.value?.published ? "un" : ""
      }published`,
      type: "success",
    });
  },
});

const nameInput = ref<HTMLInputElement>();
const editingName = ref(false);
</script>

<template>
  <template v-if="!isLoading && isError">Error</template>
  <div v-if="batteryData" class="h-full flex flex-col gap-8">
    <div class="flex-none flex">
      <div class="flex-none flex items-center gap-2">
        <input
          ref="nameInput"
          v-model="batteryData.name"
          class="text-xl font-bold rounded"
          type="text"
          @focus="editingName = true"
          @blur="editingName = false"
        />
        <ElImage
          :src="
            currentUser?.favoriteBatteries?.some(
              (t) => t.toString() === batteryData?._id?.toString()
            )
              ? '/icons/favorite-star.svg'
              : '/icons/star.svg'
          "
          class="h-5 w-5 cursor-pointer"
          @click="
            currentUser?._id &&
              batteryData._id &&
              favoriteMutation.mutate({
                userId: currentUser._id,
                batteryId: batteryData._id.toString(),
              })
          "
        />
      </div>
      <div class="grow"></div>
      <AppButton @click="publishMutation.mutate(batteryData._id)">
        {{ batteryData.published ? "Unpublish" : "Publish" }}
      </AppButton>
    </div>
    <div class="flex-1 flex overflow-auto">
      <div class="xl:basis-72 basis-56 flex flex-col gap-9">
        <ElImage
          :src="batteryData.imageUrl"
          fit="cover"
          class="self-center flex-none h-full w-full max-h-[200px] max-w-[200px] rounded-[10px] overflow-hidden"
        />
        <div class="flex flex-col gap-9 p-1">
          <div>
            <label for="description" class="font-bold text-neutral-600"
              >Description</label
            >
            <textarea
              id="description"
              v-model="batteryData.description"
              class="mt-3 border border-neutral-300 rounded-2xl resize-none py-2.5 px-4 w-full"
              rows="10"
            ></textarea>
          </div>
        </div>
      </div>
      <div class="flex-1 flex flex-col">
        <template v-if="batteryData.stages.length == 0">
          <div class="flex-1 flex w-full items-center justify-center">
            <ElEmpty description="No options to customize" />
          </div>
        </template>
        <template v-else>
          <ElForm
            class="flex-1 flex flex-col gap-2 overflow-y-auto h-full p-6 pt-0"
          >
            <template v-for="stage in batteryData.stages" :key="stage._id">
              <BatteryEditFormSection :group="stage.options" />
            </template>
          </ElForm>
        </template>
      </div>
    </div>
    <div class="flex-none flex gap-5 border-black font-black">
      <DeleteButton
        @click="
          deleteMutation.mutate({
            batteryId: batteryData._id,
            userId: currentUser?._id.toString() || '',
          })
        "
      >
        Delete
      </DeleteButton>
      <div class="grow"></div>
      <SecondaryButton> Preview Template </SecondaryButton>
      <AppButton @click="store.save"> Save Template </AppButton>
    </div>
  </div>
</template>
<style scoped>
.el-form-item {
  margin-bottom: 0;
}
</style>
