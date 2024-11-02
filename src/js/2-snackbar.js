import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

// Отримання елементів форми
const form = document.querySelector(".form");
const delayInput = form.querySelector('input[name="delay"]');
const stateRadios = form.querySelectorAll('input[name="state"]');

// Обробник події "submit" на формі
form.addEventListener("submit", (event) => {
    event.preventDefault();

    const delay = parseInt(delayInput.value, 10);
    const selectedState = Array.from(stateRadios).find(radio => radio.checked).value;

    // Створення промісу з використанням вказаних значень
    createPromise(delay, selectedState)
        .then((delay) => {
            iziToast.success({
              
                message: ` Fulfilled promise in ${delay}ms`,
                position: "topRight",
                timeout: 5000
            });
        })
        .catch((delay) => {
            iziToast.error({
           
                message: `Rejected promise in ${delay}ms`,
                position: "topRight",
                timeout: 5000
            });
        });
});

// Функція для створення промісу
function createPromise(delay, state) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (state === "fulfilled") {
                resolve(delay);
            } else {
                reject(delay);
            }
        }, delay);
    });
}
