export const showJobs = async () => {
  try {
    enableInput(false);

    const response = await fetch("/api/v1/jobs", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    let children = [jobsTableHeader];

    if (response.status === 200) {
      if (data.count === 0) {
        jobsTable.replaceChildren(...children);
      } else {
        for (let i = 0; i < data.jobs.length; i++) {
          let rowEntry = document.createElement("tr");

          let editButton = `<td><button type="button" class="editButton" data-id=${data.jobs[i]._id}>edit</button></td>`;
          let deleteButton = `<td><button type="button" class="deleteButton" data-id=${data.jobs[i]._id}>delete</button></td>`;
          let rowHTML = `
              <td>${data.jobs[i].company}</td>
              <td>${data.jobs[i].position}</td>
              <td>${data.jobs[i].status}</td>
              <div>${editButton}${deleteButton}</div>`;

          rowEntry.innerHTML = rowHTML;
          children.push(rowEntry);
        }
        jobsTable.replaceChildren(...children);
      }
    } else {
      message.textContent = data.msg;
    }
  } catch (err) {
    console.log(err);
    message.textContent = "A communication error occurred.";
  }
  enableInput(true);
  setDiv(jobsDiv);
};

jobsDiv.addEventListener("click", (e) => {
  if (inputEnabled && e.target.nodeName === "BUTTON") {
    if (e.target.classList.contains("editButton")) {
      message.textContent = "";
      showAddEdit(e.target.dataset.id);
    } else if (e.target.classList.contains("deleteButton")) {
      const jobId = e.target.dataset.id;
      deleteJob(jobId);
    } else if (e.target === logoff) {
      setToken(null);
      message.textContent = "You have been logged off.";
      jobsTable.replaceChildren([jobsTableHeader]);
      showLoginRegister();
    }
  }
});

const deleteJob = async (jobId) => {
  enableInput(false);

  try {
    const response = await fetch(`/api/v1/jobs/${jobId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    if (response.status === 200) {
      message.textContent = data.msg;
      showJobs();
    } else {
      message.textContent = data.msg;
    }
  } catch (err) {
    console.log(err);
    message.textContent = "A communication error occurred.";
  }

  enableInput(true);
};
