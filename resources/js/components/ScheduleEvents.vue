<template>
  <div>
    <div class="flex justify-between text-sm mt-6 mb-4">
      <h3 class="order-2 text-center font-bold">{{ currentMonthPresentation }}</h3>

      <button
        type="button"
        class="order-1 text-gray-700 underline"
        @click="goToPreviousMonth"
        aria-label="Go to previous month"
      >{{ previousMonthPresentation }}</button>

      <button
        type="button"
        class="order-3 text-gray-700 underline"
        @click="goToNextMonth"
        aria-label="Go to next month"
      >{{ nextMonthPresentation }}</button>
    </div>

    <form class="calendar__days flex flex-wrap items-stretch -mr-1 -ml-1">
      <div
        v-for="weekday in ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']"
        :key="weekday"
        class="text-center mb-2 text-gray-700 text-sm"
        aria-hidden="true"
      >{{ weekday }}</div>

      <!-- Offset -->
      <div v-for="day in offsetWeekdays" :key="day+'-offset'" aria-hidden="true"></div>

      <!-- The actual days on the month -->
      <div v-for="(day, index) in days" :key="index" class="calendar__day p-1 h-12">
        <div class="h-full relative">
          <input
            type="checkbox"
            :id="day"
            @click="toggle(day)"
            :aria-label="screenReaderDatePresentation(day)"
          />
          <label
            :for="day"
            class="block absolute top-0 right-0 bottom-0 left-0 bg-gray-300 text-center h-full cursor-pointer"
            :class="isSelected(day) ? 'bg-blue-500 text-white' : ''"
          >
            <span aria-hidden="true">{{ index + 1 }}</span>
            <!-- Dots for existing events -->
            <div v-if="hasExistingEvents(day)" class="flex justify-center">
              <span class="block w-2 h-2 rounded-full bg-blue-500"></span>
            </div>
          </label>
        </div>
      </div>
    </form>

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
  eachDayOfInterval,
  isWithinInterval,
  startOfDay,
  endOfMonth,
  isSameDay,
  subMonths,
  addMonths,
  endOfDay,
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

    days: function() {
      return eachDayOfInterval({ start: this.firstDay, end: this.lastDay });
    },

    offsetWeekdays: function() {
      return getDay(this.firstDay);
    },

    currentMonthInterval() {
      return { start: startOfDay(this.firstDay), end: endOfDay(this.lastDay) };
    },

    newDatesCurrentMonthOnly: function() {
      return this.newDates.filter(date =>
        isWithinInterval(date, this.currentMonthInterval)
      );
    },

    existingEventsCurrentMonthOnly: function() {
      return this.existingEvents.filter(date =>
        isWithinInterval(date, this.currentMonthInterval)
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
    },

    screenReaderDatePresentation(date) {
      return format(date, "EEEE, do MMMM yyyy");
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
[type="checkbox"] {
  outline: none;
}
.calendar__day:focus-within label {
  outline: auto;
}
</style>
