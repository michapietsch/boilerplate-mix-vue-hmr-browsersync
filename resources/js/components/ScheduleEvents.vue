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

    <div class="calendar__days flex flex-wrap items-stretch -mr-1 -ml-1">
      <div
        v-for="weekday in ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']"
        :key="weekday"
        class="text-center mb-2 text-gray-600 text-sm"
      >{{ weekday }}</div>

      <!-- Offset -->
      <div v-for="day in offsetWeekdays" :key="day+'-offset'"></div>

      <!-- The actual days on the month -->
      <div v-for="(day, index) in days" :key="index" class="p-1 h-12">
        <div
          class="bg-gray-300 text-center h-full cursor-pointer"
          :class="isSelected(day) ? 'bg-blue-500 text-white' : ''"
          @click="toggle(day)"
        >
          {{ index + 1 }}
          <!-- Example dots for existing events -->
          <div v-if="hasExistingEvents(day)" class="flex justify-center">
            <span class="block w-2 h-2 rounded-full bg-blue-500"></span>
          </div>
        </div>
      </div>
    </div>

    <div class="my-6 text-sm">
      <button
        type="button"
        class="block text-white mx-auto py-1 px-2 rounded shadow-md"
        :class="count <= 0 ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-500'"
        :disabled="count <= 0"
      >Save {{ count }} new events</button>
      <!-- <button type="button" v-if="count" class="ml-4 text-gray-600 underline">View list</button> -->
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
      firstDay: null,
      existingEvents: [],
      newDates: []
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

    existingEventsCurrentMonthOnly: function() {
      return this.existingEvents.filter(date =>
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
    },

    hasExistingEvents(date) {
      return this.existingEventsCurrentMonthOnly.filter(existingDate =>
        isSameDay(existingDate, date)
      ).length >= 1
        ? true
        : false;
    }
  },

  created() {
    /**
     * Some demo setup:
     */
    this.firstDay = new Date("2019-10-01");
    this.existingEvents.push(new Date("2019-10-08"));
    this.existingEvents.push(new Date("2019-10-11"));
    this.existingEvents.push(new Date("2019-10-21"));
  }
};
</script>

<style scoped>
.calendar__days > * {
  width: 14.28%; /* Seven equal columns */
}
</style>