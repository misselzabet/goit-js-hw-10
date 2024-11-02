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

// Функція для форматування чисел з нулем на початку
function addLeadingZero(value) {
    return String(value).padStart(2, "0");
}

// Ініціалізація flatpickr з потрібними налаштуваннями
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

// Функція для конвертації мілісекунд в дні, години, хвилини і секунди
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

// Функція для оновлення інтерфейсу таймера
function updateTimerInterface(timeObject) {
    daysSpan.textContent = addLeadingZero(timeObject.days);
    hoursSpan.textContent = addLeadingZero(timeObject.hours);
    minutesSpan.textContent = addLeadingZero(timeObject.minutes);
    secondsSpan.textContent = addLeadingZero(timeObject.seconds);
}

// Функція для запуску таймера
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

    // Деактивація кнопки і поля вибору дати після запуску таймера
    startButton.disabled = true;
    dateTimePicker.disabled = true;
}

// Обробник події на кнопці Start
startButton.addEventListener("click", startTimer);
