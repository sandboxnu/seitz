<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

import adminAPI from "@/api/admin";
import AppButton from "@/components/ui/AppButton.vue";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { ElButton, ElCard, ElNotification } from "element-plus";
import { Role } from "@seitz/shared";
import RolesDropdown from "./components/RolesDropdown.vue";

const router = useRouter();
const authStore = useAuthStore();
const queryClient = useQueryClient();

const usersToAdd = ref<string[]>([]); // IDs of the users to be added as new admins
const rolesToAdd = ref<Record<string, Role>>({}); // The roles of the new admins to be added
const rolesToUpdate = ref<Record<string, Role>>({}); // The roles of the existing admins to be updated
const showErrorAlert = ref(false);
const dropdownResetKey = ref(0);

const searchQuery = ref("");
const { data: adminUsers, isLoading: isAdminsLoading } = useQuery(
  ["admins"],
  adminAPI.getAdminUsers
);
const { data: allUsers, isLoading: isUsersLoading } = useQuery(
  ["users"],
  adminAPI.getAllUsers
);
const addAdmin = useMutation(
  async (usersToUpdate: Record<string, Role>) => {
    await Promise.all(
      Object.entries(usersToUpdate).map(([userId, role]) =>
        adminAPI.assignAdminRole(userId, role)
      )
    );
  },
  {
    onSuccess: () => {
      queryClient.invalidateQueries(["admins"]);
      queryClient.invalidateQueries(["users"]);
      ElNotification({
        title: "Success",
        message: "Selected roles updated",
        type: "success",
      });
    },
    onError: (error: { response: { data: { message: string } } }) => {
      console.error(error);
      dropdownResetKey.value++;
      if (
        error.response.data.message === "Cannot demote the only super admin"
      ) {
        showErrorAlert.value = true;
      } else {
        ElNotification({
          title: "Error",
          message: "Failed to update admin roles",
          type: "error",
        });
      }
    },
  }
);
const removeAdmin = useMutation(
  (userId: string) => adminAPI.removeUserAsAdmin(userId),
  {
    onSuccess: () => {
      queryClient.invalidateQueries(["admins"]);
      queryClient.invalidateQueries(["users"]);
      ElNotification({
        title: "Success",
        message: "Admin user removed",
        type: "success",
      });
    },
    onError: (error) => {
      console.error(error);
      ElNotification({
        title: "Error",
        message: "Failed to remove admin user",
        type: "error",
      });
    },
  }
);

watch(showErrorAlert, (show) => {
  if (show) {
    setTimeout(() => {
      showErrorAlert.value = false;
    }, 3000);
  }
});

const addAdminDialogVisible = ref(false);
const removeAdminDialogVisible = ref(false);
const userToRemove = ref<{ email: string; userId: string } | null>(null);

const handleAddAdmin = (userId: string) => {
  if (usersToAdd.value.includes(userId)) {
    usersToAdd.value = usersToAdd.value.filter((id) => id !== userId);
    rolesToAdd.value = Object.keys(rolesToAdd.value).reduce(
      (acc: Record<string, Role>, key: string) => {
        if (key !== userId) {
          acc[key] = rolesToAdd.value[key];
        }
        return acc;
      },
      {}
    );
    return;
  }
  usersToAdd.value.push(userId);
  addAdminDialogVisible.value = true;
};

const handleRemoveAdmin = (email: string, userId: string) => {
  userToRemove.value = { email, userId };
  removeAdminDialogVisible.value = true;
};

const confirmAddAdmin = () => {
  if (usersToAdd.value) {
    addAdmin.mutate(rolesToAdd.value);
    usersToAdd.value = [];
    rolesToAdd.value = {};
    addAdminDialogVisible.value = false;
  }
};

const confirmRemoveAdmin = () => {
  if (userToRemove.value) {
    removeAdmin.mutate(userToRemove.value.userId);
    userToRemove.value = null;
    removeAdminDialogVisible.value = false;
  }
};

const cancelAddAdmin = () => {
  usersToAdd.value = [];
  rolesToAdd.value = {};
  addAdminDialogVisible.value = false;
};

const isUserAdmin = (userId: string) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return adminUsers.value.some((admin: any) => admin._id === userId);
};

const filteredUsers = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return allUsers.value?.filter((user: any) =>
    user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const filteredBasicUsers = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return allUsers.value?.filter((user: any) => user.role === Role.BasicUser);
});

const activeTab = ref("superAdmin");

const filteredAdminUsers = computed(() => {
  if (!adminUsers.value) return [];

  switch (activeTab.value) {
    case "basicUser":
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return allUsers.value.filter((user: any) => user.role === Role.BasicUser);
    case "basicAdmin":
      return adminUsers.value.filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (user: any) =>
          user.role === Role.StudyManager || user.role === Role.UserManager
      );
    case "superAdmin":
    default:
      return adminUsers.value.filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (user: any) => user.role === Role.SuperAdmin
      );
  }
});

const switchTab = (tab: string) => {
  activeTab.value = tab;
};

const selectedUsers = computed(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return allUsers.value?.filter((user: any) =>
    usersToAdd.value.includes(user._id)
  );
});

const updateRoles = (userId: string, role: Role) => {
  rolesToUpdate.value = {
    ...rolesToUpdate.value,
    [userId]: role,
  };
};

const newAdminRoleChanged = (userId: string, role: Role) => {
  rolesToAdd.value = {
    ...rolesToAdd.value,
    [userId]: role,
  };
};

const saveChanges = () => {
  if (Object.keys(rolesToUpdate.value).length) {
    addAdmin.mutate(rolesToUpdate.value);
    rolesToUpdate.value = {};
  } else {
    ElNotification({
      title: "No changes",
      message: "No changes to save",
      type: "info",
    });
  }
};

if (!authStore.hasAdminPower(Role.UserManager)) {
  router.push("/");
}
</script>

<template>
  <div class="mt-8 mx-4">
    <el-dialog
      v-model="removeAdminDialogVisible"
      title="Remove Administrator:"
      width="500"
      class="rounded-xl"
    >
      <p v-if="userToRemove" class="mb-6">
        Are you sure you want to remove {{ userToRemove.email }} as an
        administrator?
      </p>
      <div class="flex">
        <el-button
          class="rounded-lg px-5 py-1 justify-center"
          @click="removeAdminDialogVisible = false"
          >Cancel</el-button
        >
        <AppButton class="ml-auto" type="primary" @click="confirmRemoveAdmin">
          Remove
        </AppButton>
      </div>
    </el-dialog>

    <el-dialog
      v-model="addAdminDialogVisible"
      title="Add Administrator:"
      width="500"
      class="rounded-xl"
    >
      <div>
        <ElInput
          v-model="searchQuery"
          placeholder="Search by email"
          class="w-full rounded-full"
        />
      </div>

      <div class="m-4 mb-8 h-32 overflow-auto">
        <table
          v-if="!isUsersLoading && filteredUsers.length > 0"
          class="w-full table-auto border-collapse"
        >
          <tbody>
            <tr v-for="user in filteredBasicUsers" :key="user._id">
              <td class="py-2 px-4 border-b flex items-center justify-evenly">
                <div class="mr-auto font-bold">{{ user.name }}</div>
                <div>{{ user.email }}</div>
                <div class="ml-auto">
                  <ElButton
                    :text="true"
                    type="primary"
                    :class="{
                      'ml-2 hover:bg-red-100 text-red-600 underline':
                        !usersToAdd.includes(user._id),
                      'ml-2 hover:bg-green-200 bg-green-100 text-green-600 underline':
                        usersToAdd.includes(user._id),
                    }"
                    :disabled="isUserAdmin(user._id)"
                    size="small"
                    style="width: 60px"
                    @click="handleAddAdmin(user._id)"
                    >{{
                      usersToAdd.includes(user._id) ||
                      adminUsers.find((admin: any) => admin._id === user._id)
                        ? "Added"
                        : "Add"
                    }}
                  </ElButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else-if="!isUsersLoading && filteredUsers.length === 0">
          No users found.
        </p>
        <p v-else>Loading...</p>
      </div>

      <hr class="border-black w-11/12 mx-auto" />
      <div
        class="ml-5 text-black text-base font-bold text-left py-2 whitespace-nowrap"
      >
        Selected Administrators
      </div>

      <div class="m-4 mb-8 h-32 overflow-auto">
        <table
          v-if="!isUsersLoading && filteredUsers.length > 0"
          class="w-full table-auto border-collapse"
        >
          <tbody>
            <tr v-for="user in selectedUsers" :key="user._id">
              <td class="py-2 px-4 border-b flex items-center justify-evenly">
                <div class="mr-auto font-bold">{{ user.name }}</div>
                <div class="ml-auto">
                  <RolesDropdown
                    :user="user"
                    @role-changed="newAdminRoleChanged"
                  />
                </div>
                <div class="ml-auto">
                  <ElButton
                    :text="true"
                    type="danger"
                    class="hover:bg-red-100 text-red-600 underline"
                    size="small"
                    @click="handleAddAdmin(user._id)"
                    >Remove</ElButton
                  >
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else-if="!isUsersLoading && filteredUsers.length === 0">
          No users found.
        </p>
        <p v-else>Loading...</p>
      </div>
      <div class="flex">
        <el-button
          class="rounded-lg px-5 py-1 justify-center"
          @click="cancelAddAdmin"
          >Cancel</el-button
        >
        <AppButton
          class="ml-auto bg-black text-white"
          type="primary"
          :disabled="usersToAdd.length === 0"
          @click="confirmAddAdmin"
        >
          Add Selected
        </AppButton>
      </div>
    </el-dialog>

    <ElCard class="rounded-xl shadow-md m-10">
      <div class="m-4">
        <div class="flex justify-between items-center">
          <h2 class="font-bold text-xl mb-4 ml-3">Users</h2>
          <!-- Handle button click -->
          <AppButton
            class="mb-4 !bg-[#fafafa] !text-[#000000] border !border-[#e6e6e6] rounded-md hover:text-gray-500 hover:bg-[#f3f3f3] ml-auto px-4"
            @click="saveChanges"
          >
            Save Changes
          </AppButton>
          <AppButton
            class="mb-4 bg-[#1F1915] border-[#1F1915] rounded-md"
            @click="addAdminDialogVisible = true"
            >Add Administrator</AppButton
          >
        </div>

        <table class="w-full table-auto border-collapse">
          <!-- Navigation Bar Row -->
          <thead>
            <tr>
              <td colspan="4" class="p-0 border-b-2">
                <div class="flex border-b gap-x-4">
                  <button
                    :class="[
                      'px-2 py-2 text-sm font-medium border-b-2 transition-colors',
                      activeTab === 'superAdmin'
                        ? 'text-black'
                        : 'border-transparent',
                    ]"
                    :style="
                      activeTab === 'superAdmin'
                        ? { borderBottomColor: '#BA3B2A' }
                        : {}
                    "
                    @click="switchTab('superAdmin')"
                  >
                    Super Admin
                  </button>
                  <button
                    :class="[
                      'px-2 py-2 text-sm font-medium border-b-2 transition-colors',
                      activeTab === 'basicAdmin'
                        ? 'text-black'
                        : 'border-transparent',
                    ]"
                    :style="
                      activeTab === 'basicAdmin'
                        ? { borderBottomColor: '#BA3B2A' }
                        : {}
                    "
                    @click="switchTab('basicAdmin')"
                  >
                    Basic Admin
                  </button>
                  <button
                    :class="[
                      'px-2 py-2 text-sm font-medium border-b-2 transition-colors',
                      activeTab === 'basicUser'
                        ? 'text-black'
                        : 'border-transparent',
                    ]"
                    :style="
                      activeTab === 'basicUser'
                        ? { borderBottomColor: '#BA3B2A' }
                        : {}
                    "
                    @click="switchTab('basicUser')"
                  >
                    Basic User
                  </button>
                </div>
              </td>
            </tr>
          </thead>
        </table>
        <div
          v-if="showErrorAlert && activeTab === 'superAdmin'"
          class="flex items-center p-2 mb-2 text-[#BA3B2A] rounded-lg bg-red-50"
        >
          <img src="/icons/warning.svg" class="w-3 h-3 mr-2 ml-2" />
          <span class="text-sm"
            >Must have one super admin at all times. Add one before removing
            one.</span
          >
        </div>
        <!-- User Data Info Table -->
        <table
          v-if="!isAdminsLoading && adminUsers.length > 0"
          class="w-full table-auto border-collapse mt-4"
        >
          <thead>
            <tr>
              <th class="text-black text-left py-2 px-8 border-b-2">Name</th>
              <th class="text-black text-left py-2 px-12 border-b-2">Email</th>
              <th class="text-black text-left py-2 px-4 border-b-2">
                Admin Type
              </th>
              <th class="text-black text-right py-2 px-4 border-b-2"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredAdminUsers" :key="user._id">
              <td class="py-2 px-6 border-b text-left">{{ user.name }}</td>
              <td class="py-2 px-12 border-b">
                {{ user.email }}
              </td>
              <td class="py-2 px-4 border-b text-left">
                <RolesDropdown
                  :key="dropdownResetKey"
                  :user="user"
                  @role-changed="updateRoles"
                />
              </td>
              <td class="py-2 px-4 border-b text-right">
                <ElButton
                  :text="true"
                  type="danger"
                  :class="{
                    'hover:bg-red-100 text-red-600 underline':
                      user._id !== authStore.currentUser?._id,
                    'text-gray-400 cursor-not-allowed':
                      user._id === authStore.currentUser?._id,
                  }"
                  :disabled="user._id === authStore.currentUser?._id"
                  @click="handleRemoveAdmin(user.email, user._id)"
                  >Remove</ElButton
                >
              </td>
            </tr>
          </tbody>
        </table>
        <p v-else-if="!isAdminsLoading && adminUsers.length === 0">
          No admins available
        </p>
        <p v-else>Loading...</p>
      </div>
    </ElCard>
  </div>
</template>
