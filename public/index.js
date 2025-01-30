import { showJobs, handleJobs } from "./jobs.js";
import { showLoginRegister, handleLoginRegister } from "./loginRegister.js";
import { handleLogin } from "./login.js";
import { handleAddEdit } from "./addEdit.js";
import { handleRegister } from "./register.js";

let activeDiv = null;
export let message = null;

export const setDiv = (newDiv) => {
  if (newDiv === activeDiv) {
    return;
  }

  if (activeDiv) {
    activeDiv.style.display = "none";
  }

  newDiv.style.display = "block";
  activeDiv = newDiv;
};

export let inputEnabled = true;
export const enableInput = (state) => {
  inputEnabled = state;
};

export let token = null;
export const setToken = (value) => {
  token = value;
  if (value) {
    localStorage.setItem("token", value);
  } else {
    localStorage.removeItem("token");
  }
};

document.addEventListener("DOMContentLoaded", () => {
  token = localStorage.getItem("token");
  console.log("Token:", token);
  message = document.getElementById("message");
  handleLoginRegister();
  handleLogin();
  handleJobs();
  handleRegister();
  handleAddEdit();
  if (token) {
    showJobs();
  } else {
    showLoginRegister();
  }
});
