<script setup lang="ts">
import { ref, reactive, computed } from "vue";
import { useAuthStore } from "../../stores/auth";
import { useRouter } from "vue-router";
import MyStudiesItem from "./components/MyStudiesItem.vue";
import StudyDetailsSidebar from "./components/StudyDetailsSideBar.vue";
import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import authAPI from "@/api/auth";
import studiesAPI from "@/api/studies";
import AppButton from "@/components/ui/AppButton.vue";
import RecentStudies from "./components/RecentStudies.vue";
import { ElDialog, ElForm, ElFormItem, ElInput, ElTag } from "element-plus";
import { Plus } from "@element-plus/icons-vue";

const router = useRouter();
const authStore = useAuthStore();
const queryClient = useQueryClient();

if (!authStore.currentUser) {
  router.push("/login");
}

const { data: studies, refetch } = useQuery({
  queryKey: ["studies"],
  queryFn: studiesAPI.getStudies,
  refetchOnMount: "always",
  staleTime: 0,
});

const { mutate, isLoading } = useMutation({
  mutationFn: () => studiesAPI.createStudy(),
  onSuccess: (createdStudyId) => {
    router.push({ name: "study", params: { id: createdStudyId } });
  },
});

const selectedStudyId = ref<string | null>(null);
const showSidebar = ref<boolean>(false);
const createStudyPopup = ref(false);
const welcomeWizardStep = computed(
  () => authStore.currentUser?.welcomeWizardStep ?? 0
);

const tagsIcon = {
  Cognitive: "/brain.svg",
  Hearing: "/hearing.svg",
  Training: "/training.svg",
  Vision: "/vision.svg",
};

const openSidebar = (studyId: string) => {
  selectedStudyId.value = studyId;
  showSidebar.value = true;
};

const handleStudyDeleted = async () => {
  await refetch();
  await queryClient.invalidateQueries({ queryKey: ["studies", "recent"] });
};

const firstStudyForm = reactive({
  title: "",
  description: "",
  tags: [] as string[],
  serverCode: "",
});

const createFirstStudy = async () => {
  createStudyPopup.value = false;
  const createdStudyId = await studiesAPI.createStudy();
  const study = await studiesAPI.getStudy(createdStudyId);
  await studiesAPI.saveStudy(createdStudyId, {
    ...study,
    name: firstStudyForm.title,
    description: firstStudyForm.description,
    variants: study.variants.map((variant, index) =>
      index === 0
        ? {
            ...variant,
            serverCode: firstStudyForm.serverCode,
            tags: firstStudyForm.tags,
          }
        : variant
    ),
  });
  router.push({ name: "study", params: { id: createdStudyId } });
};

const updateWizardSteps = (step: number) => {
  authAPI.updateCurrentUser({ welcomeWizardStep: step });
  if (authStore.currentUser) authStore.currentUser.welcomeWizardStep = step;
};
</script>
<template>
  <div
    v-loading="isLoading"
    class="mt-14 mx-auto w-full min-w-[600px] px-4 sm:px-6 lg:px-10"
  >
    <div class="flex items-center">
      <h1 class="text-3xl font-bold mb-4 -mt-4">My Studies</h1>
      <div class="flex-1"></div>
      <el-popover
        title="Create a new Study"
        placement="left-start"
        width="308px"
        popper-style="border-radius: 10px; z-index: 1500"
        :hide-after="0"
        :visible="welcomeWizardStep == 0"
        trigger="manual"
      >
        <template #default>
          Press the “New” button to create a new study
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-top: 8px;
            "
          >
            <el-button
              class="close-tip"
              style="
                width: 59px;
                height: 36px;
                border-radius: 10px;
                border-width: 1px;
                border-color: #c3bcb5;
                background-color: #fffdfd;
                font-size: 14px;
                font-weight: 700;
              "
              @click="updateWizardSteps(welcomeWizardStep + 1)"
              >Close</el-button
            >
            <div style="font-weight: 500; font-size: 14px">1/3</div>
            <el-button
              type="text"
              style="font-size: 14px; font-weight: 500; color: #8a7f75"
              @click="updateWizardSteps(3)"
              >Skip all tips</el-button
            >
          </div>
        </template>
        <template #reference>
          <AppButton
            class="mb-4 -mt-4"
            @click="
              if (welcomeWizardStep == 1) createStudyPopup = true;
              else mutate();
            "
            >+ New</AppButton
          >
        </template>
      </el-popover>
      <div
        v-if="welcomeWizardStep == 0"
        style="position: fixed; inset: 0; background: rgba(0, 0, 0, 0.5)"
      ></div>
    </div>
    <ElDialog
      v-model="createStudyPopup"
      width="545px"
      style="border-radius: 30px; background-color: #fffdfd"
    >
      <ElForm
        :model="firstStudyForm"
        label-position="top"
        style="margin-right: 30px; margin-left: 30px"
      >
        <ElFormItem label="Title">
          <template #label>
            <span
              class="font-bold text-base text-black"
              style="font-size: 16px"
            >
              Title
            </span>
          </template>
          <ElInput
            v-model="firstStudyForm.title"
            style="height: 44px; border-radius: 10px"
          />
        </ElFormItem>
        <h1
          class="inline-block border-b-2 border-red-500 pb-1 mb-4 font-bold text-black"
          style="font-size: 14px"
        >
          Details
        </h1>
        <ElFormItem label="Description">
          <template #label>
            <span class="font-bold text-base text-black"> Description </span>
          </template>
          <ElInput
            v-model="firstStudyForm.description"
            type="textarea"
            style="height: 88px"
            :rows="4"
            resize="none"
          />
        </ElFormItem>
        <ElFormItem label="Condition Server Code">
          <template #label>
            <span class="font-bold text-base text-black">
              Condition Server Code
            </span>
          </template>
          <ElInput
            v-model="firstStudyForm.serverCode"
            style="width: 165px; border-radius: 10px; background-color: #fffdfd"
          />
        </ElFormItem>
        <ElFormItem label="Tags">
          <template #label>
            <span class="font-bold text-base text-black"> Tags </span>
          </template>
          <ElTag
            v-for="tag in firstStudyForm.tags"
            :key="tag"
            closable
            style="
              margin-right: 4px;
              border-color: #ffb9aa;
              background-color: #ffede9;
              color: #ba3b2a;
            "
            @close="
              firstStudyForm.tags = firstStudyForm.tags.filter((t) => t !== tag)
            "
          >
            <img
              :src="tagsIcon[tag as keyof typeof tagsIcon]"
              class="inline-block mr-2"
              style="width: 12px; height: 12px"
            />{{ tag }}
          </ElTag>
          <el-dropdown trigger="click">
            <el-button
              style="
                width: 20px;
                height: 20px;
                padding: 0;
                border-radius: 6px;
                background-color: #fcf9f7;
              "
            >
              <template #icon>
                <Plus />
              </template>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="tag in Object.keys(tagsIcon)"
                  :key="tag"
                >
                  <el-checkbox
                    :model-value="firstStudyForm.tags.includes(tag)"
                    class="tag-checkbox"
                    @change="
                      (checked: boolean) => {
                        if (checked) {
                          firstStudyForm.tags.push(tag);
                        } else {
                          firstStudyForm.tags = firstStudyForm.tags.filter(
                            (t) => t !== tag
                          );
                        }
                      }
                    "
                  >
                    {{ tag }}
                  </el-checkbox>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </ElFormItem>
      </ElForm>
      <template #footer>
        <el-button
          style="
            width: 105px;
            height: 36px;
            border-radius: 10px;
            border-color: #c3bcb5;
            font-weight: 700;
          "
          class="block mx-auto w-fit"
          @click="createFirstStudy"
          >Create Study</el-button
        >
      </template>
    </ElDialog>

    <h1 class="mt-4">Recents</h1>
    <RecentStudies />

    <ElCard
      v-if="studies && studies.length > 0"
      class="rounded-xl shadow-sm"
      :body-style="{ padding: 0 }"
    >
      <table class="w-full table-auto border-collapse">
        <thead>
          <tr>
            <th
              class="text-black text-left py-4 pl-6 pr-6 border-b-2 bg-neutral-50"
            >
              Name
            </th>
            <th
              class="text-black text-left py-4 pl-4 pr-6 border-b-2 bg-neutral-50"
            >
              Description
            </th>
            <th
              class="text-black text-left py-4 px-4 border-b-2 bg-neutral-50"
            ></th>
          </tr>
        </thead>
        <tbody>
          <MyStudiesItem
            v-for="study in studies"
            :id="study._id.toString()"
            :key="study._id.toString()"
            :name="study.name"
            :description="study.description"
            @deleted="handleStudyDeleted"
            @open="openSidebar"
          />
        </tbody>
      </table>
    </ElCard>
  </div>

  <StudyDetailsSidebar
    :study-id="selectedStudyId"
    :show="showSidebar"
    @close="showSidebar = false"
  />
</template>

<style scoped>
:deep(.el-input__wrapper),
:deep(.el-textarea__inner) {
  border-radius: 10px !important;
  background-color: #fffdfd !important;
}
:deep(.el-tag__close) {
  color: #ba3b2a !important;
  background-color: transparent !important;
}
:deep(.el-dialog__footer .el-button:hover) {
  color: inherit !important;
  background-color: #f5f5f5 !important;
}
:deep(.tag-checkbox.is-checked .el-checkbox__label) {
  color: inherit !important;
}
</style>
