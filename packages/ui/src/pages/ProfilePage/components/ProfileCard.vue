<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { ElNotification } from "element-plus";
import { useAuthStore } from "@/stores/auth";
import type { IUser as SharedUser } from "@seitz/shared";
import authAPI from "@/api/auth";
import type { DTO } from "@seitz/shared";
import type { IUser as StoreUser } from "@/stores/auth";
import { isAxiosError } from "axios";
const activeTab = ref("account");
const authStore = useAuthStore();

// Current user as shared type (may include name)
const user = computed<Partial<SharedUser> | null>(
  () => authStore.currentUser as unknown as Partial<SharedUser> | null
);

// Local editable fields populated once from user
const fullName = ref("");
const firstName = ref("");
const lastName = ref("");
const email = ref("");
const initialized = ref(false);
const saving = ref(false);
const password = ref("");

watch(
  user,
  (u) => {
    if (!initialized.value && u) {
      const full = (u.name ?? "").trim();
      const parts = full.length ? full.split(/\s+/) : [];
      fullName.value = full;
      firstName.value = parts[0] ?? "";
      lastName.value = parts.slice(1).join(" ");
      email.value = u.email ?? "";
      initialized.value = true;
    }
  },
  { immediate: true }
);

const roleLabel = computed(() => user.value?.role ?? "");
async function onSave() {
  const trimmedFirst = firstName.value.trim();
  const trimmedLast = lastName.value.trim();
  const name = [trimmedFirst, trimmedLast].filter(Boolean).join(" ");
  const currentName = (user.value?.name ?? "").trim();
  const trimmedEmail = email.value.trim();

  const payload: { name?: string; email?: string; password?: string } = {};
  if (name && name !== currentName) payload.name = name;
  if (trimmedEmail && trimmedEmail !== user.value?.email)
    payload.email = trimmedEmail;
  if (password.value.trim().length > 0) {
    payload.password = password.value.trim();
  }

  if (Object.keys(payload).length === 0) {
    ElNotification({
      title: "No changes",
      message: "There are no changes to save.",
      type: "info",
      duration: 2000,
    });
    return;
  }

  try {
    saving.value = true;
    type GetUser = DTO<Omit<SharedUser, "password" | "verifyPassword">>;
    const updated = (await authAPI.updateCurrentUser(payload)) as GetUser;
    // Update store with latest data
    const storeUser: StoreUser = {
      _id: updated._id,
      email: updated.email,
      role: updated.role,
      studies: updated.studies ?? [],
    };
    authStore.currentUser = storeUser;
    // Update display name immediately
    const newFull = [firstName.value, lastName.value].filter(Boolean).join(" ");
    if (newFull) fullName.value = newFull;
    // Clear password field after successful save
    password.value = "";
    ElNotification({
      title: "Success",
      message: "Your profile has been updated.",
      type: "success",
      duration: 2500,
    });
  } catch (err: unknown) {
    interface ApiError {
      message?: string;
    }
    const message = isAxiosError<ApiError>(err)
      ? err.response?.data?.message ||
        err.message ||
        "Failed to update profile."
      : "Failed to update profile.";
    ElNotification({
      title: "Error",
      message,
      type: "error",
      duration: 3500,
    });
  } finally {
    saving.value = false;
  }
}
</script>

<template>
  <div class="bg-white rounded-2xl shadow p-8 w-full max-w-3xl">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <div class="w-20 h-20 rounded-full bg-gray-100"></div>
        <div>
          <h2 class="text-2xl font-semibold text-gray-900">
            {{ fullName }}
          </h2>
          <p class="text-gray-500">{{ roleLabel }}</p>
        </div>
      </div>
      <button
        class="border border-neutral-200 px-4 py-2 rounded-lg text-sm bg-neutral-50 hover:bg-gray-50 transition disabled:opacity-60 disabled:cursor-not-allowed"
        :disabled="saving"
        @click="onSave"
      >
        Save Changes
      </button>
    </div>

    <!-- Switch Tab -->
    <div class="flex gap-6 border-b border-gray-200 mt-8">
      <button
        class="pb-2 font-medium"
        :class="
          activeTab === 'account'
            ? 'border-b-2 border-primary-300 text-gray-900'
            : 'text-gray-500 hover:text-gray-700'
        "
        @click="activeTab = 'account'"
      >
        Account
      </button>
      <button
        class="pb-2 font-medium"
        :class="
          activeTab === 'studies'
            ? 'border-b-2 border-primary-300 text-gray-900'
            : 'text-gray-500 hover:text-gray-700'
        "
        @click="activeTab = 'studies'"
      >
        My Studies
      </button>
    </div>

    <!-- Account Info Form -->
    <div
      v-if="activeTab === 'account'"
      class="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6"
    >
      <div class="flex flex-col">
        <label class="text-sm text-gray-500 mb-1">First Name</label>
        <input
          v-model="firstName"
          type="text"
          placeholder="Jane"
          class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-400 focus:outline-none"
        />
      </div>

      <div class="flex flex-col">
        <label class="text-sm text-gray-500 mb-1">Last Name</label>
        <input
          v-model="lastName"
          type="text"
          placeholder="Doe"
          class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-400 focus:outline-none"
        />
      </div>

      <div class="flex flex-col sm:col-span-2">
        <label class="text-sm text-gray-500 mb-1">Email</label>
        <input
          v-model="email"
          type="email"
          placeholder="janedoe@bgc.com"
          class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-400 focus:outline-none"
        />
      </div>

      <div class="flex flex-col sm:col-span-2">
        <label class="text-sm text-gray-500 mb-1">New Password</label>
        <input
          v-model="password"
          type="password"
          placeholder="Enter a new password (optional)"
          class="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-gray-400 focus:outline-none"
        />
      </div>
    </div>
  </div>
</template>
