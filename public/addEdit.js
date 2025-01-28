export const showAddEdit = async (jobId) => {
  if (!jobId) {
    company.value = "";
    position.value = "";
    status.value = "pending";
    addingJob.textContent = "add";
    message.textContent = "";

    setDiv(addEditDiv);
  } else {
    enableInput(false);

    try {
      const response = await fetch(`/api/v1/jobs/${jobId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.status === 200) {
        company.value = data.job.company;
        position.value = data.job.position;
        status.value = data.job.status;
        addingJob.textContent = "update";
        message.textContent = "";
        addEditDiv.dataset.id = jobId;

        setDiv(addEditDiv);
      } else {
        message.textContent = "The jobs entry was not found";
        showJobs();
      }
    } catch (err) {
      console.log(err);
      message.textContent = "A communications error has occurred.";
      showJobs();
    }

    enableInput(true);
  }
};

addEditDiv.addEventListener("click", async (e) => {
  if (inputEnabled && e.target === addingJob) {
    enableInput(false);

    let method = "POST";
    let url = "/api/v1/jobs";

    if (addingJob.textContent === "update") {
      method = "PATCH";
      url = `/api/v1/jobs/${addEditDiv.dataset.id}`;
    }

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          company: company.value,
          position: position.value,
          status: status.value,
        }),
      });

      const data = await response.json();
      if (response.status === 200 || response.status === 201) {
        message.textContent =
          response.status === 200
            ? "The job entry was updated."
            : "The job entry was created.";

        company.value = "";
        position.value = "";
        status.value = "pending";
        showJobs();
      } else {
        message.textContent = data.msg;
      }
    } catch (err) {
      console.log(err);
      message.textContent = "A communication error occurred.";
    }
    enableInput(true);
  }
});
