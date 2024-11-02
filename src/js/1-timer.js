import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const startButton = document.querySelector("[data-start]");
const dateTimePicker = document.querySelector("#datetime-picker");
const daysSpan = document.querySelector("[data-days]");
const hoursSpan = document.querySelector("[data-hours]");
const minutesSpan = document.querySelector("[data-minutes]");
const secondsSpan = document.querySelector("[data-seconds]");

let timerId;
let userSelectedDate = null;
startButton.disabled = true;

function addLeadingZero(value) {
    return String(value).padStart(2, "0");
}

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        const selectedDate = selectedDates[0];

        if (selectedDate <= new Date()) {
            iziToast.error({ message: "Please choose a date in the future" });
            startButton.disabled = true;
        } else {
            userSelectedDate = selectedDate;
            startButton.disabled = false;
        }
    },
};

flatpickr(dateTimePicker, options);

function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}

function updateTimerInterface(timeObject) {
    daysSpan.textContent = addLeadingZero(timeObject.days);
    hoursSpan.textContent = addLeadingZero(timeObject.hours);
    minutesSpan.textContent = addLeadingZero(timeObject.minutes);
    secondsSpan.textContent = addLeadingZero(timeObject.seconds);
}

function startTimer() {
    const targetDate = userSelectedDate.getTime();

    timerId = setInterval(() => {
        const now = Date.now();
        const remainingTime = targetDate - now;

        if (remainingTime <= 0) {
            clearInterval(timerId);
            updateTimerInterface({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            dateTimePicker.disabled = false;
            return;
        }

        const timeObject = convertMs(remainingTime);
        updateTimerInterface(timeObject);
    }, 1000);

    startButton.disabled = true;
    dateTimePicker.disabled = true;
}

startButton.addEventListener("click", startTimer);
