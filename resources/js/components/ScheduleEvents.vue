<template>
  <div>
    <div class="flex justify-between text-sm mt-6 mb-4">
      <button
        type="button"
        class="text-gray-600 underline"
        @click="goToPreviousMonth"
      >{{ previousMonthPresentation }}</button>
      <h3 class="text-center font-bold">{{ currentMonthPresentation }}</h3>
      <button
        type="button"
        class="text-gray-600 underline"
        @click="goToNextMonth"
      >{{ nextMonthPresentation }}</button>
    </div>

    <div class="flex flex-wrap items-stretch -mr-1 -ml-1">
      <div
        v-for="weekday in ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']"
        :key="weekday"
        style="width: 14.28%"
        class="text-center mb-2 text-gray-600 text-sm"
      >{{ weekday }}</div>

      <!-- Offset -->
      <div v-for="day in offsetWeekdays" :key="day+'-offset'" style="width: 14.28%"></div>

      <!-- The actual days on the month -->
      <div v-for="(day, index) in days" :key="index" class="p-1" style="width: 14.28%">
        <div
          class="bg-gray-300 text-center h-full cursor-pointer"
          :class="isSelected(day) ? 'bg-blue-500 text-white' : ''"
          @click="toggle(day)"
        >
          {{ index + 1 }}
          <!-- Example dots for existing events -->
          <div v-if="index == 10" class="flex justify-center">
            <span :class="[style.dot, 'bg-gray-500']"></span>
            <span :class="[style.dot, 'bg-blue-500']"></span>
          </div>

          <!-- Example dot for event of other type -->
          <div v-if="index == 15" class="flex justify-center">
            <span :class="[style.dot, 'bg-gray-500']"></span>
          </div>

          <!-- Fake dot to achieve equal height -->
          <div v-if="index != 10 && index != 15" class="flex">
            <span :class="style.dot"></span>
          </div>
        </div>
      </div>
    </div>

    <div class="my-6 text-sm">
      <button
        type="button"
        class="text-white py-1 px-2 rounded shadow-md mr-4"
        :class="count <= 0 ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500'"
        :disabled="count <= 0"
      >Save {{ count }} new events</button>
      <!-- <button type="button" v-if="count" class="text-gray-600 underline">View list</button> -->
    </div>
  </div>
</template>

<script type="text/babel">
import {
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isWithinInterval,
  subMonths,
  addMonths,
  format,
  getDay
} from "date-fns";

export default {
  data() {
    return {
      firstDay: new Date("2019-10-01"),
      newDates: [],
      style: {
        dot: "block w-2 h-2 mx-1 mb-1 rounded-full"
      }
    };
  },

  computed: {
    lastDay: function() {
      return endOfMonth(this.firstDay);
    },

    offsetWeekdays: function() {
      return getDay(this.firstDay);
    },

    days: function() {
      return eachDayOfInterval({ start: this.firstDay, end: this.lastDay });
    },

    newDatesCurrentMonthOnly: function() {
      return this.newDates.filter(date =>
        isWithinInterval(date, { start: this.firstDay, end: this.lastDay })
      );
    },

    count: function() {
      return this.newDates.length;
    },

    currentMonthPresentation: function() {
      return format(this.firstDay, "MMMM yyyy");
    },

    previousMonthPresentation: function() {
      return format(subMonths(this.firstDay, 1), "MMM");
    },

    nextMonthPresentation: function() {
      return format(addMonths(this.firstDay, 1), "MMM");
    }
  },

  methods: {
    toggle(date) {
      if (this.isSelected(date)) {
        this.newDates = this.newDates.filter(
          newDate => !isSameDay(newDate, date)
        );
      } else {
        this.newDates.push(date);
      }
    },

    goToPreviousMonth() {
      this.firstDay = subMonths(this.firstDay, 1);
    },

    goToNextMonth() {
      this.firstDay = addMonths(this.firstDay, 1);
    },

    isSelected(date) {
      return this.newDatesCurrentMonthOnly.filter(newDate =>
        isSameDay(newDate, date)
      ).length >= 1
        ? true
        : false;
    }
  },

  mounted() {
    /**
     * Some demo setup:
     */
    this.toggle(new Date("2019-10-15"));

    /**
     * TODO: Dots for existing events
     */
  }
};
</script>