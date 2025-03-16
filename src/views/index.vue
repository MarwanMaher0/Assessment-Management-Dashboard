<template>
  <div>
    <div class="panel mt-6">
      <div class="flex pb-2 justify-between items-center">
        <h5 class="font-semibold text-lg dark:text-white-light mb-5 capitalize">
          {{ $t("userList.title") }}
        </h5>
        <div class="flex items-center gap-3">
          <button
            v-if="canAddUser"
            type="button"
            class="btn btn-primary capitalize"
            @click="openAddUserModal"
          >
            {{ $t("userList.addUser") }}
          </button>
        </div>
      </div>
      <div class="datatable">
        <vue3-datatable
          :rows="rows"
          :columns="cols"
          :totalRows="rows?.length"
          :columnFilter="true"
          skin="whitespace-nowrap bh-table-hover"
          firstArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M13 19L7 12L13 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path opacity="0.5" d="M16.9998 19L10.9998 12L16.9998 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
          lastArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M11 19L17 12L11 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path opacity="0.5" d="M6.99976 19L12.9998 12L6.99976 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg> '
          previousArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M15 5L9 12L15 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
          nextArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M9 5L15 12L9 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
        >
          <template #dob="data">
            {{ formatDate(data.value.dob) }}
          </template>
          <template #isActive="data">
            <span v-if="data.value.isActive" class="text-success">{{
              $t("userList.active")
            }}</span>
            <span v-else class="text-danger">{{
              $t("userList.inactive")
            }}</span>
          </template>

          <template #action="data">
            <div class="flex items-center">
              <button
                v-if="canEditOrDeleteUser"
                type="button"
                class="ltr:mr-2 rtl:ml:2"
                @click="openEditUserModal(data.value)"
              >
                <icon-pencil />
              </button>

              <button
                v-if="canEditOrDeleteUser"
                type="button"
                class="ltr:mr-2 rtl:ml:2"
                @click="confirmDeleteUser(data.value.id)"
              >
                <icon-trash-lines />
              </button>

              <router-link
                :to="{ path: '/UserDetail', query: { id: data.value.id } }"
                class="ltr:mr-2 rtl:ml-2"
              >
                <icon-eye />
              </router-link>
            </div>
          </template>
        </vue3-datatable>
      </div>
    </div>
  </div>
  <AddUser
    :modal="addUserModal"
    @close="closeAddUserModal"
    @reload="fetchUsers"
  />
  <EditUser
    :userData="selectedUser || ({} as User)"
    :modal="editUserModal"
    @close="closeEditUserModal"
    @reload="fetchUsers"
  />
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { RouterLink } from "vue-router";
import Vue3Datatable from "@bhplugin/vue3-datatable";
import { useMeta } from "@/composables/use-meta";
import "@bhplugin/vue3-datatable/dist/style.css";
import IconPencil from "@/components/icon/icon-pencil.vue";
import IconTrashLines from "@/components/icon/icon-trash-lines.vue";
import IconEye from "@/components/icon/icon-eye.vue";
import { mockApi } from "@/server/mockApi";
import Swal from "sweetalert2";
import AddUser from "@/components/AddUser.vue";
import EditUser from "@/components/EditUser.vue";
import { useToast } from "vue-toast-notification";
import { useAppStore } from "@/stores/index";
import { authService } from "@/services/authService";
const store = useAppStore();
useMeta({ title: "Users List" });

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  dob: string;
  role: string;
  isActive: boolean;
}

const cols = ref([
  { field: "id", title: "ID", isUnique: true, filter: false },
  { field: "firstName", title: "First Name" },
  { field: "lastName", title: "Last Name" },
  { field: "email", title: "Email" },
  { field: "role", title: "Role" },
  { field: "age", title: "Age", type: "number" },
  { field: "dob", title: "Birthdate", type: "date" },
  { field: "isActive", title: "Active", type: "bool" },
  { field: "action", title: "Action", filter: false },
]);

const rows = ref<User[]>([]);
const addUserModal = ref(false);
const editUserModal = ref(false);
const selectedUser = ref<User | null>(null);
const error = ref("");

const toast = useToast({
  position: "top-right",
});

/**
 * Fetches all users from the API and updates the users list.
 * Shows a loader while loading, and shows a success/error message
 * depending on whether the request was successful or not.
 */
const fetchUsers = async () => {
  store.MainLoader(true);
  error.value = "";
  try {
    const response = await mockApi.getUsers({ page: 1, limit: 100 });
    rows.value = response?.data;
    toast.success("Users fetched successfully");
  } catch (err) {
    error.value = "Failed to fetch users";
    toast.error("Failed to fetch users");
  } finally {
    store.MainLoader(false);
  }
};

/**
 * Shows a confirmation dialog to the user, asking if they really want to delete a user.
 * If the user confirms, calls the removeUser function to delete the user.
 * @param {number} id The ID of the user to delete.
 */
const confirmDeleteUser = (id: number) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      removeUser(id);
    }
  });
};

/**
 * Deletes a user from the API.
 * If the request is successful, shows a success toast and reloads the users list.
 * If the request fails, shows an error toast and updates the error message.
 * @param {number} id The ID of the user to delete.
 */
const removeUser = async (id: number) => {
  try {
    await mockApi.deleteUser(id);
    fetchUsers();
    toast.success("User deleted successfully");
  } catch (err) {
    error.value = "Failed to delete user";
    toast.error("Failed to delete user");
  }
};

/**
 * Opens the edit user modal with the given user.
 * @param {User} user The user to edit.
 */
const openEditUserModal = (user: User) => {
  selectedUser.value = user;
  editUserModal.value = true;
};

/**
 * Opens the add user modal.
 */
const openAddUserModal = () => {
  addUserModal.value = true;
};

/**
 * Closes the add user modal.
 */
const closeAddUserModal = () => {
  addUserModal.value = false;
};

/**
 * Closes the edit user modal.
 */
const closeEditUserModal = () => {
  editUserModal.value = false;
};

onMounted(() => {
  fetchUsers();
});

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

const canAddUser = computed(() => {
  const currentUser = authService.getCurrentUser();
  return currentUser?.role === "admin";
});
const canEditOrDeleteUser = computed(() => {
  const currentUser = authService.getCurrentUser();
  return currentUser?.role === "admin" || currentUser?.role === "manager";
});
</script>
