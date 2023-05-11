const checkBox = document.querySelectorAll(".checkbox");
const inputs = document.querySelectorAll(".goal__item input");
const errorField = document.querySelector(".error__msg");
const progressFill = document.querySelector(".progress__fill");
const backgroundToggle = document.querySelector(".background__change");

const backgroundIntial = false;
const goalsState = new Array(inputs.length).fill("");
const checkBoxState = new Array(inputs.length).fill(false);

let dataOfDetail = {
  backgroundIntial,
  goalsState,
  checkBoxState,
};

// localStorage Set Item
const setItemInLocal = () => {
  localStorage.setItem("data", JSON.stringify(dataOfDetail));
};

backgroundToggle.addEventListener("click", () => {
  dataOfDetail.backgroundIntial = backgroundToggle.children[0].checked;
  setItemInLocal();
});

// check and unchecked Handler
checkBox.forEach((check, index) =>
  check.addEventListener("click", (e) => {
    const isComplete = checkComplete();
    const isCheckd = [
      ...e.target.closest(".checkbox").children[0].classList,
    ].includes("checked");
    if (!isComplete) {
      errorHandle();
      return;
    }
    isCheckd ? unchecked(index) : checked(index);
    // e.target.closest(".checkbox").children[0].classList.toggle("checked");
    progressFillHandle();
  })
);

const unchecked = (index) => {
  dataOfDetail.checkBoxState[index] = false;
  checkBox[index].children[0].classList.remove("checked");
  progressFillHandle();
  setItemInLocal();
};

const checked = (index) => {
  dataOfDetail.checkBoxState[index] = true;
  checkBox[index].children[0].classList.add("checked");
  progressFillHandle();
  setItemInLocal();
};

//input Handling
inputs.forEach((input, index) => {
  // input event Handling
  input.addEventListener("input", (e) => {
    unchecked(index);
    dataOfDetail.goalsState[index] = e.target.value;
  });

  // input blur event Handling
  input.addEventListener("blur", () => {
    setItemInLocal();
    if (dataOfDetail.goalsState[index].trim().length === 0) {
      inputs.forEach((_, index) => unchecked(index));
    }
  });
});

// checking all goals are fields completed or not?
const checkComplete = () => {
  return [...inputs].every((input) => input.value.trim());
};

// Error Handling
let prevSet;
const errorHandle = () => {
  const errMsg = `Please set all the ${inputs.length} goals!`;
  errorField.textContent = errMsg;
  clearTimeout(prevSet);
  prevSet = setTimeout(() => (errorField.textContent = "\u00A0"), 2000);
};

// Progress Bar Handler
const progressFillHandle = () => {
  const checked = document.querySelectorAll(".checked").length;
  const allInput = document.querySelectorAll(".goal__item input").length;
  const percent = Math.round((checked * 100) / allInput);
  progressFill.style.width = `${percent}%`;
};

// fill Input Data
const inputFill = () => {
  inputs.forEach((ele, index) => (ele.value = dataOfDetail.goalsState[index]));
};

// checked Intial
const checkedIntial = () => {
  dataOfDetail.checkBoxState.forEach((ele, index) => {
    ele && checked(index);
  });
};

const intialData = () => {
  const getData = localStorage.getItem("data");
  if (!getData) return;
  const data = JSON.parse(getData);
  dataOfDetail = data;

  // fill Inputs
  inputFill();
  checkedIntial();
  backgroundToggle.children[0].checked = dataOfDetail.backgroundIntial;
};
intialData();
