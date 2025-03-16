<template>
  <TransitionRoot appear :show="modal" as="template">
    <Dialog as="div" @close="closeModal" class="relative z-[51]">
      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <DialogOverlay class="fixed inset-0 bg-[black]/60" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-start justify-center px-4 py-8">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <DialogPanel
              class="panel border-0 px-4 py-1 rounded-lg overflow-hidden w-full max-w-sm text-black dark:text-white-dark"
            >
              <button
                type="button"
                class="absolute top-7 ltr:right-9 rtl:left-9 text-white-dark hover:text-dark outline-none"
                @click="closeModal"
              >
                <icon-x class="w-5 h-5" />
              </button>
              <div
                class="text-lg font-semibold ltr:pl-5 rtl:pr-5 py-5 ltr:pr-[50px] rtl:pl-[50px]"
              >
                {{ $t("editUser.title") }}
              </div>
              <div class="p-5">
                <form @submit.prevent="submitForm">
                  <div class="relative mb-4">
                    <span
                      class="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 dark:text-white-dark"
                    >
                      <icon-user class="w-5 h-5" />
                    </span>
                    <input
                      v-model="user.firstName"
                      type="text"
                      placeholder="First Name"
                      class="form-input ltr:pl-10 rtl:pr-10"
                      required
                    />
                  </div>
                  <div class="relative mb-4">
                    <span
                      class="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 dark:text-white-dark"
                    >
                      <icon-user class="w-5 h-5" />
                    </span>
                    <input
                      v-model="user.lastName"
                      type="text"
                      placeholder="Last Name"
                      class="form-input ltr:pl-10 rtl:pr-10"
                      required
                    />
                  </div>
                  <div class="relative mb-4">
                    <span
                      class="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 dark:text-white-dark"
                    >
                      <icon-at />
                    </span>
                    <input
                      v-model="user.email"
                      type="email"
                      placeholder="Email@example.com"
                      class="form-input ltr:pl-10 rtl:pr-10"
                      required
                    />
                  </div>
                  <div class="relative mb-4">
                    <span
                      class="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 dark:text-white-dark"
                    >
                      <icon-calendar />
                    </span>
                    <input
                      v-model="user.dob"
                      type="date"
                      class="form-input ltr:pl-10 rtl:pr-10"
                      required
                    />
                  </div>
                  <div class="relative mb-4">
                    <span
                      class="absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 dark:text-white-dark"
                    >
                      <icon-circle-check />
                    </span>
                    <select
                      v-model="user.isActive"
                      class="form-input ltr:pl-10 rtl:pr-10"
                      required
                    >
                      <option :value="true">{{ $t("editUser.active") }}</option>
                      <option :value="false">
                        {{ $t("editUser.inactive") }}
                      </option>
                    </select>
                  </div>
                  <button type="submit" class="btn btn-primary w-full">
                    {{ $t("editUser.submit") }}
                  </button>
                </form>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogOverlay,
} from "@headlessui/vue";
import { ref, watch, defineProps, defineEmits } from "vue";
import { mockApi } from "@/server/mockApi";
import IconX from "@/components/icon/icon-x.vue";
import IconUser from "@/components/icon/icon-user.vue";
import IconAt from "@/components/icon/icon-at.vue";
import IconCalendar from "@/components/icon/icon-calendar.vue";
import IconCircleCheck from "@/components/icon/icon-circle-check.vue";
import { useToast } from "vue-toast-notification";

const toast = useToast();
interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  isActive: boolean;
}

const props = defineProps<{ modal: boolean; userData: User }>();
const emit = defineEmits(["close", "reload"]);

const modal = ref(props.modal);
watch(
  () => props.modal,
  (newVal) => {
    modal.value = newVal;
  }
);

const user = ref<User>({ ...props.userData });
watch(
  () => props.userData,
  (newVal) => {
    user.value = { ...newVal };
  }
);

/**
 * Submits the edit user form.
 *
 * Calls `mockApi.updateUser` with the form values, shows a success toast if it succeeds,
 * emits a "reload" event to tell the parent component to reload its data,
 * and closes the modal.
 *
 * If the call fails, shows an error toast.
 */
const submitForm = async () => {
  try {
    await mockApi.updateUser(user.value.id, user.value);
    toast.success("User updated successfully", {
      position: "top-right",
    });
    emit("reload");
    closeModal();
  } catch (error) {
    toast.error("Failed to update user", {
      position: "top-right",
    });
  }
};

/**
 * Closes the edit user modal.
 *
 * Emits a "close" event to the parent component.
 */
const closeModal = () => {
  emit("close");
};
</script>
