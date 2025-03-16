<template>
  <div class="panel mt-6">
    <h2 class="text-lg font-semibold mb-4">{{ $t("userDetail.title") }}</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <!-- Display Card -->
      <div class="panel">
        <div class="flex items-center justify-between mb-5">
          <h5 class="font-semibold text-lg dark:text-white-light">
            {{ $t("userDetail.profile") }}
          </h5>
          <button
            @click="enableEdit"
            class="btn btn-primary p-2 rounded-full"
            :disabled="!canEdit"
          >
            <icon-pencil-paper />
          </button>
        </div>
        <div class="mb-5">
          <div class="flex flex-col justify-center items-center">
            <img
              src="/assets/images/user-profile.jpeg"
              alt=""
              class="w-24 h-24 rounded-full object-cover mb-5"
            />
            <p class="font-semibold text-primary text-xl">
              {{ user.firstName }}
            </p>
          </div>
          <ul
            class="mt-5 flex flex-col max-w-[160px] m-auto space-y-4 font-semibold text-white-dark"
          >
            <li class="flex items-center gap-2">
              <icon-coffee class="shrink-0" />
              {{ user.role }}
            </li>
            <li class="flex items-center gap-2">
              <icon-calendar class="shrink-0" />
              {{ formatDate(user.dob) }}
            </li>

            <li>
              <a href="mailto:{{ user.email }}" class="flex items-center gap-2">
                <icon-mail class="w-5 h-5 shrink-0" />
                <span class="text-primary truncate">{{ user.email }}</span>
              </a>
            </li>
            <li class="flex items-center gap-2">
              <icon-check-circle class="shrink-0" />
              <span :class="user.isActive ? 'text-success' : 'text-danger'">
                {{
                  user.isActive
                    ? $t("userDetail.active")
                    : $t("userDetail.inactive")
                }}
              </span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Edit Card -->
      <div class="card p-4 col-span-2 panel">
        <form @submit.prevent="submitForm">
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">{{
              $t("userDetail.firstName")
            }}</label>
            <input
              v-model="user.firstName"
              type="text"
              class="form-input w-full"
              :disabled="!isEditing"
              required
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">{{
              $t("userDetail.lastName")
            }}</label>
            <input
              v-model="user.lastName"
              type="text"
              class="form-input w-full"
              :disabled="!isEditing"
              required
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">{{
              $t("userDetail.email")
            }}</label>
            <input
              v-model="user.email"
              type="email"
              class="form-input w-full"
              :disabled="!isEditing"
              required
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">{{
              $t("userDetail.birthdate")
            }}</label>
            <input
              v-model="user.dob"
              type="date"
              class="form-input w-full"
              :disabled="!isEditing"
              required
            />
          </div>
          <div class="mb-4">
            <label class="block text-sm font-medium mb-1">{{
              $t("userDetail.status")
            }}</label>
            <select
              v-model="user.isActive"
              class="form-input w-full"
              :disabled="!isEditing"
              required
            >
              <option :value="true">{{ $t("userDetail.active") }}</option>
              <option :value="false">{{ $t("userDetail.inactive") }}</option>
            </select>
          </div>
          <div class="flex justify-end gap-2">
            <button
              type="button"
              class="btn btn-secondary"
              @click="confirmDelete"
              :disabled="!isEditing"
            >
              {{ $t("userDetail.delete") }}
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="!isEditing"
            >
              {{ $t("userDetail.save") }}
            </button>
          </div>
        </form>
        <div v-if="loading" class="mt-4 text-center">
          {{ $t("userDetail.loading") }}
        </div>
        <div v-if="error" class="mt-4 text-center text-red-500">
          {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { mockApi } from "@/server/mockApi";
import { useToast } from "vue-toast-notification";
import { useMeta } from "@/composables/use-meta";
import { authService } from "@/services/authService";

import IconPencilPaper from "@/components/icon/icon-pencil-paper.vue";
import IconCoffee from "@/components/icon/icon-coffee.vue";
import IconCalendar from "@/components/icon/icon-calendar.vue";
import IconMail from "@/components/icon/icon-mail.vue";
import IconCheckCircle from "@/components/icon/icon-circle-check.vue";

const route = useRoute();
const router = useRouter();
useMeta({ title: `Users Detail ${route.query.id}` });
import Swal from "sweetalert2";

const toast = useToast();
interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  role: string;
  isActive: boolean;
}

const user = ref<User>({
  id: 0,
  firstName: "",
  lastName: "",
  email: "",
  dob: "",
  role: "",
  isActive: true,
});
const loading = ref(false);
const error = ref("");
const isEditing = ref(false);

const currentUser = computed(() => authService.getCurrentUser());

const canEdit = computed(() => {
  return (
    currentUser.value?.id === user.value.id ||
    currentUser.value?.role === "admin" ||
    currentUser.value?.role === "manager"
  );
});

/**
 * Fetches the user with the given ID from the API and updates
 * the user variable with the fetched user.
 * Shows a loader while loading, and shows a success/error message
 * depending on whether the request was successful or not.
 * @param userId - ID of the user to fetch
 */
const fetchUser = async (userId: number) => {
  loading.value = true;
  error.value = "";
  try {
    const fetchedUser = await mockApi.getUser(userId);
    user.value = fetchedUser;
  } catch (err) {
    error.value = "Failed to fetch user";
  } finally {
    loading.value = false;
  }
};

/**
 * Submits the edit user form.
 *
 * Calls `mockApi.updateUser` with the form values, shows a success toast if it succeeds,
 * and redirects to the homepage.
 *
 * If the call fails, shows an error toast.
 */
const submitForm = async () => {
  if (!user.value) return;
  loading.value = true;
  error.value = "";
  try {
    await mockApi.updateUser(user.value.id, user.value);
    toast.success("User updated successfully", {
      position: "top-right",
    });
    router.push("/");
  } catch (err) {
    toast.error("Failed to update user", {
      position: "top-right",
    });
  } finally {
    loading.value = false;
  }
};

/**
 * Shows a confirmation dialog to the user, asking if they really want to delete a user.
 * If the user confirms, calls the removeUser function to delete the user.
 */
const confirmDelete = () => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then(async (result) => {
    if (result.isConfirmed && user.value) {
      try {
        await mockApi.deleteUser(user.value.id);
        toast.success("User deleted successfully", {
          position: "top-right",
        });
      } catch (err) {
        toast.error("Failed to delete user", {
          position: "top-right",
        });
      }
    }
  });
};

/**
 * Enables the edit mode for the user detail page.
 */
const enableEdit = () => {
  isEditing.value = true;
};

/**
 * Format a date string in the format "dd/mm/yyyy".
 * If the date string is empty or null, returns an empty string.
 * @param {string} date The date string to format.
 * @returns {string} The formatted date string.
 */
const formatDate = (date: string) => {
  if (date) {
    const dt = new Date(date);
    const month =
      dt.getMonth() + 1 < 10 ? "0" + (dt.getMonth() + 1) : dt.getMonth() + 1;
    const day = dt.getDate() < 10 ? "0" + dt.getDate() : dt.getDate();
    return day + "/" + month + "/" + dt.getFullYear();
  }
  return "";
};

onMounted(() => {
  const userId = Number(route.query.id);
  if (userId) fetchUser(userId);
});

watch(
  () => route.query.id,
  (newId) => {
    const userId = Number(newId);
    if (userId) fetchUser(userId);
  }
);
</script>

<style scoped>
.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
