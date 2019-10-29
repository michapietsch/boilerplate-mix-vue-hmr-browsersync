<template>
  <div>
    <div class="my-4 bg-blue-100 px-3 py-2 flex justify-between items-center shadow-md text-sm">
      <div>New events: 0</div>
      <button type="button" class="text-gray-600 underline">View list</button>
      <button type="button" class="text-white bg-blue-500 py-1 px-2 rounded shadow-md">Save</button>
    </div>

    <div>
      <div class="flex justify-between text-sm mb-2">
        <button type="button" class="text-gray-600 underline">Sep</button>
        <h3 class="text-center font-bold">October 2019</h3>
        <button type="button" class="text-gray-600 underline">Dec</button>
      </div>

      <div class="flex flex-wrap items-stretch -mr-1 -ml-1">
        <!-- Placeholder -->
        <div v-for="day in 1" :key="day+'-before'" style="width: 14.28%"></div>

        <!-- The actual days on the month -->
        <div v-for="day in 31" :key="day" class="p-1" style="width: 14.28%">
          <div
            class="bg-gray-300 text-center h-full"
            :class="day == 15 ? 'bg-blue-500 text-white' : ''"
          >
            {{ day }}
            <!-- Example dots for existing events -->
            <div v-if="day == 10" class="flex justify-center">
              <span :class="[style.dot, 'bg-gray-500']"></span>
              <span :class="[style.dot, 'bg-blue-500']"></span>
            </div>

            <!-- Example dot for event of other type -->
            <div v-if="day == 15" class="flex justify-center">
              <span :class="[style.dot, 'bg-gray-500']"></span>
            </div>

            <!-- Fake dot to achieve equal height -->
            <div v-if="day != 10 && day != 15" class="flex">
              <span :class="style.dot"></span>
            </div>
          </div>
        </div>

        <!-- Placeholder -->
        <div v-for="day in 3" :key="day+'-after'" style="width: 14.28%"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/babel">
export default {
  data() {
    return {
      style: {
        dot: "block w-2 h-2 mx-1 mb-1 rounded-full"
      }
    };
  }
};
</script>