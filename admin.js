function renderPreview() {
  const iframe = document.getElementById("livePreview");
  if (!iframe) return "";

  const headline = document.getElementById("issueHeadline").value || "CT Today e-Magazine";
  const coverImg = document.getElementById("coverImgUrl").value;
  const leadTitle = document.getElementById("leadTitle").value;
  const leadLink = document.getElementById("leadLink").value;
  const leadDesc = document.getElementById("leadDesc").value;

  const titles = Array.from(document.querySelectorAll(".story-title-input")).map(el => el.value);
  const links = Array.from(document.querySelectorAll(".story-link-input")).map(el => el.value);
  const images = Array.from(document.querySelectorAll(".story-img-input")).map(el => el.value);
  const descs = Array.from(document.querySelectorAll(".story-desc-input")).map(el => el.value);

  let storiesRows = "";
  for (let i = 0; i < titles.length; i += 2) {
    const leftImg = images[i] || "https://www.constructiontechnology.in/nl_images/logo.png";
    const rightImg = images[i + 1] || "https://www.constructiontechnology.in/nl_images/logo.png";

    let rightCol = "";
    if (titles[i + 1]) {
      rightCol = 
        '<a href="' + links[i + 1] + '" target="_blank" style="text-decoration:none;color:inherit;">' +
          '<img src="' + rightImg + '" width="100%" style="border-radius:6px;margin-bottom:8px;display:block;">' +
          '<strong style="font-size:13px;color:#111;line-height:1.4;display:block;">' + titles[i + 1] + '</strong>' +
          '<p style="font-size:12px;color:#666;line-height:1.4;margin-top:6px;">' + descs[i + 1] + '</p>' +
        '</a>';
    }

    storiesRows += 
      '<tr>' +
        '<td width="48%" valign="top" style="background:#fafafa;border-radius:8px;border:1px solid #e1e1e1;padding:12px;">' +
          '<a href="' + links[i] + '" target="_blank" style="text-decoration:none;color:inherit;">' +
            '<img src="' + leftImg + '" width="100%" style="border-radius:6px;margin-bottom:8px;display:block;">' +
            '<strong style="font-size:13px;color:#111;line-height:1.4;display:block;">' + titles[i] + '</strong>' +
            '<p style="font-size:12px;color:#666;line-height:1.4;margin-top:6px;">' + descs[i] + '</p>' +
          '</a>' +
        '</td>' +
        '<td width="4%"></td>' +
        '<td width="48%" valign="top" style="background:#fafafa;border-radius:8px;border:1px solid #e1e1e1;padding:12px;">' +
          rightCol +
        '</td>' +
      '</tr>' +
      '<tr><td colspan="3" height="12"></td></tr>';
  }

  const fullHtml = 
    '<!DOCTYPE html>' +
    '<html>' +
    '<head><meta charset="utf-8"><title>' + headline + '</title></head>' +
    '<body style="margin:0;padding:0;background:#f4f5f7;font-family:Arial,Helvetica,sans-serif;">' +
      '<table width="100%" cellpadding="0" cellspacing="0" bgcolor="#f4f5f7">' +
        '<tr><td align="center" style="padding:20px 10px;">' +
          '<table width="600" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="border-radius:10px;overflow:hidden;border:1px solid #e1e1e1;margin:0 auto;">' +
            '<tr>' +
              '<td style="background:#1f1f1f;padding:14px 22px;color:#ffffff;">' +
                '<table width="100%"><tr><td style="font-size:12px;color:#bbbbbb;">' + headline + '</td>' +
                '<td align="right" style="font-size:12px;color:#bbbbbb;">Construction Technology Today</td></tr></table>' +
              '</td>' +
            '</tr>' +
            '<tr><td align="center" style="padding:20px;"><img src="https://www.constructiontechnology.in/nl_images/logo.png" width="220" style="display:block;"></td></tr>' +
            '<tr>' +
              '<td style="padding:0 24px 24px;">' +
                '<table width="100%" cellpadding="0" cellspacing="0"><tr>' +
                  '<td width="48%" valign="top"><img src="' + coverImg + '" width="100%" style="border-radius:8px;border:1px solid #ddd;display:block;"></td>' +
                  '<td width="4%"></td>' +
                  '<td width="48%" valign="top">' +
                    '<div style="background:#f36f21;color:#fff;font-size:11px;font-weight:bold;padding:4px 10px;border-radius:14px;display:inline-block;margin-bottom:8px;">Lead Story</div>' +
                    '<h3 style="font-size:15px;margin:0 0 8px 0;line-height:1.4;"><a href="' + leadLink + '" target="_blank" style="color:#111;text-decoration:none;">' + leadTitle + '</a></h3>' +
                    '<p style="font-size:12px;color:#555;line-height:1.4;margin:0;">' + leadDesc + '</p>' +
                    '<a href="' + leadLink + '" target="_blank" style="color:#f36f21;font-weight:bold;font-size:12px;text-decoration:none;display:inline-block;margin-top:8px;">Read Full Article &rarr;</a>' +
                  '</td>' +
                '</tr></table>' +
              '</td>' +
            '</tr>' +
            '<tr><td style="padding:0 24px 12px;"><div style="font-size:18px;font-weight:bold;border-left:5px solid #f36f21;padding-left:12px;">The Inside Story</div></td></tr>' +
            '<tr><td style="padding:0 24px 24px;"><table width="100%" cellpadding="0" cellspacing="0">' + storiesRows + '</table></td></tr>' +
            '<tr>' +
              '<td align="center" style="background:#f36f21;padding:24px;color:#fff;">' +
                '<div style="font-size:16px;font-weight:bold;margin-bottom:8px;">Stay Ahead in Construction Technology</div>' +
                '<a href="https://www.constructiontechnology.in/subscriptions" target="_blank" style="background:#fff;color:#f36f21;padding:8px 20px;border-radius:20px;font-weight:bold;text-decoration:none;display:inline-block;font-size:12px;">Subscribe Now</a>' +
              '</td>' +
            '</tr>' +
          '</table>' +
        '</td></tr>' +
      '</table>' +
    '</body>' +
    '</html>';

  try {
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(fullHtml);
    doc.close();
  } catch (err) {
    iframe.srcdoc = fullHtml;
  }

  return fullHtml;
}

function addStoryField() {
  const container = document.getElementById("storiesContainer");
  const div = document.createElement("div");
  div.className = "story-entry";
  div.innerHTML = 
    '<label>Story Title <span class="req">*</span></label>' +
    '<input type="text" class="story-title-input" placeholder="Story title" required />' +
    '<label>Story Link <span class="req">*</span></label>' +
    '<input type="text" class="story-link-input" placeholder="https://..." required />' +
    '<label>Image URL</label>' +
    '<input type="text" class="story-img-input" placeholder="https://..." />' +
    '<label>Summary</label>' +
    '<textarea class="story-desc-input" placeholder="Brief summary..."></textarea>';
  container.appendChild(div);
  renderPreview();
}

// Strip all newlines and whitespace before decoding GitHub base64 strings
function safeDecodeBase64(str) {
  const cleanStr = str.replace(/\s/g, '');
  return decodeURIComponent(Array.prototype.map.call(atob(cleanStr), function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
}

function safeEncodeBase64(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
    return String.fromCharCode(parseInt(p1, 16));
  }));
}

// Automatically populate delete dropdown from local or remote registry
async function populateDeleteDropdown(items) {
  const deleteSelect = document.getElementById("deleteSelect");
  if (!items || !items.length) return;
  deleteSelect.innerHTML = '<option value="">-- Choose an edition to remove --</option>' +
    items.map(item => `<option value="${item.folder}">${item.year} - ${item.monthName} (${item.title})</option>`).join("");
}

async function loadLocalDeleteList() {
  try {
    const res = await fetch("data/newsletters.json?t=" + Date.now());
    if (res.ok) {
      const items = await res.json();
      populateDeleteDropdown(items);
    }
  } catch (err) {
    console.warn("Could not load local delete list:", err);
  }
}

// Explicit token-based fetch for the delete dropdown
async function fetchExistingIssuesViaToken() {
  const tokenInput = document.getElementById("ghToken");
  const token = tokenInput.value.trim();
  const user = document.getElementById("ghUsername").value.trim();
  const repo = document.getElementById("ghRepo").value.trim();
  const deleteLog = document.getElementById("deleteLog");

  if (!token) {
    alert("Please paste your GitHub Personal Access Token in Section 1 to authenticate.");
    tokenInput.focus();
    return;
  }

  deleteLog.style.color = "#f36f21";
  deleteLog.innerText = "Connecting to GitHub repository...";

  try {
    const jsonPath = "data/newsletters.json";
    const res = await fetch(`https://api.github.com/repos/${user}/${repo}/contents/${jsonPath}?ref=main`, {
      headers: {
        "Authorization": "Bearer " + token,
        "Accept": "application/vnd.github.v3+json"
      }
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || res.statusText);
    }

    const jsonGetData = await res.json();
    const items = JSON.parse(safeDecodeBase64(jsonGetData.content));
    populateDeleteDropdown(items);

    deleteLog.style.color = "#16a34a";
    deleteLog.innerText = `Loaded ${items.length} issues directly from GitHub.`;
  } catch (err) {
    deleteLog.style.color = "#dc2626";
    deleteLog.innerText = "Error loading list: " + err.message;
    alert("Failed to load issues: " + err.message);
  }
}

async function publishIssueToGithub() {
  const tokenInput = document.getElementById("ghToken");
  const token = tokenInput.value.trim();
  const user = document.getElementById("ghUsername").value.trim();
  const repo = document.getElementById("ghRepo").value.trim();
  const year = document.getElementById("issueYear").value.trim();
  const folderInput = document.getElementById("issueFolder").value.trim();
  const monthName = document.getElementById("issueMonthName").value.trim();
  const headline = document.getElementById("issueHeadline").value.trim();
  const leadTitle = document.getElementById("leadTitle").value.trim();
  const leadLink = document.getElementById("leadLink").value.trim();
  const leadDesc = document.getElementById("leadDesc").value.trim();

  const log = document.getElementById("publishLog");
  const btn = document.getElementById("publishBtn");

  // Strict Validation
  if (!token) {
    alert("Please paste your GitHub Personal Access Token in Section 1.");
    tokenInput.focus();
    return;
  }
  if (!user || !repo || !year || !folderInput || !monthName || !headline || !leadTitle || !leadLink || !leadDesc) {
    alert("Required fields cannot be empty. Please fill in all fields marked with an asterisk (*).");
    return;
  }

  const storyTitles = Array.from(document.querySelectorAll(".story-title-input"));
  const storyLinks = Array.from(document.querySelectorAll(".story-link-input"));
  for (let i = 0; i < storyTitles.length; i++) {
    if (!storyTitles[i].value.trim() || !storyLinks[i].value.trim()) {
      alert("All news stories must have at least a Title and Link.");
      return;
    }
  }

  // Clear token immediately from screen
  tokenInput.value = "";
  localStorage.removeItem("ct_gh_token");

  btn.disabled = true;
  btn.innerText = "Publishing to GitHub...";
  log.style.color = "#f36f21";
  log.innerText = "1/2 Creating issue file on GitHub...";

  try {
    const folderPath = "issues/" + year + "/" + folderInput;
    const filePath = folderPath + "/index.html";
    const content = renderPreview();

    // 1. Commit new issue HTML
    const fileRes = await fetch(`https://api.github.com/repos/${user}/${repo}/contents/${filePath}`, {
      method: "PUT",
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: "Publish issue: " + headline,
        content: safeEncodeBase64(content)
      })
    });

    if (!fileRes.ok) {
      const errJson = await fileRes.json();
      throw new Error(`Failed creating ${filePath}: ${errJson.message || fileRes.statusText}`);
    }

    log.innerText = "2/2 Safely reading and appending to data/newsletters.json...";

    // 2. Fetch current newsletters.json from GitHub
    const jsonPath = "data/newsletters.json";
    const jsonGet = await fetch(`https://api.github.com/repos/${user}/${repo}/contents/${jsonPath}?ref=main`, {
      headers: { "Authorization": "Bearer " + token }
    });

    if (!jsonGet.ok) throw new Error("Could not find data/newsletters.json on GitHub.");

    const jsonGetData = await jsonGet.json();
    const sha = jsonGetData.sha;
    
    // Safely decode without wiping old issues
    let existingData = JSON.parse(safeDecodeBase64(jsonGetData.content));

    if (!Array.isArray(existingData)) {
      throw new Error("Invalid registry format on GitHub. Expected an array.");
    }

    // Filter out duplicates if re-publishing the same folder
    existingData = existingData.filter(item => item.folder !== folderPath);

    // Prepend the new issue to preserve all older issues
    const newEntry = {
      year: parseInt(year, 10),
      month: folderInput,
      monthName: monthName,
      title: headline,
      folder: folderPath
    };
    existingData.unshift(newEntry);

    // 3. Commit updated registry back to GitHub
    const jsonPut = await fetch(`https://api.github.com/repos/${user}/${repo}/contents/${jsonPath}`, {
      method: "PUT",
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: "Register issue: " + headline,
        content: safeEncodeBase64(JSON.stringify(existingData, null, 2)),
        sha: sha
      })
    });

    if (!jsonPut.ok) {
      const errJson = await jsonPut.json();
      throw new Error(`Failed updating newsletters.json: ${errJson.message || jsonPut.statusText}`);
    }

    log.style.color = "#16a34a";
    log.innerText = "Success! Issue published. All historical editions preserved.";
    alert("Published successfully! All editions preserved.");
    populateDeleteDropdown(existingData);
  } catch (err) {
    log.style.color = "#dc2626";
    log.innerText = "Error: " + err.message;
    alert("Publish failed: " + err.message);
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> Save & Publish Issue to GitHub';
  }
}

async function deleteIssueFromGithub() {
  const tokenInput = document.getElementById("ghToken");
  const token = tokenInput.value.trim();
  const user = document.getElementById("ghUsername").value.trim();
  const repo = document.getElementById("ghRepo").value.trim();
  const deleteFolder = document.getElementById("deleteSelect").value;
  const log = document.getElementById("deleteLog");
  const btn = document.getElementById("deleteBtn");

  if (!token) {
    alert("Please paste your GitHub Personal Access Token in Section 1 to authorize deletion.");
    tokenInput.focus();
    return;
  }
  if (!deleteFolder) {
    alert("Please select an issue to delete from the dropdown.");
    return;
  }

  const confirmDelete = confirm(`Are you sure you want to remove "${deleteFolder}" from the active archive registry?`);
  if (!confirmDelete) return;

  // Clear token immediately
  tokenInput.value = "";
  localStorage.removeItem("ct_gh_token");

  btn.disabled = true;
  btn.innerText = "Removing issue...";
  log.style.color = "#f36f21";
  log.innerText = "Connecting to GitHub...";

  try {
    const jsonPath = "data/newsletters.json";
    const jsonGet = await fetch(`https://api.github.com/repos/${user}/${repo}/contents/${jsonPath}?ref=main`, {
      headers: { "Authorization": "Bearer " + token }
    });

    if (!jsonGet.ok) throw new Error("Could not retrieve newsletters.json from repository");

    const jsonGetData = await jsonGet.json();
    const existingData = JSON.parse(safeDecodeBase64(jsonGetData.content));

    const updatedData = existingData.filter(item => item.folder !== deleteFolder);

    const jsonPut = await fetch(`https://api.github.com/repos/${user}/${repo}/contents/${jsonPath}`, {
      method: "PUT",
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: "Remove edition: " + deleteFolder,
        content: safeEncodeBase64(JSON.stringify(updatedData, null, 2)),
        sha: jsonGetData.sha
      })
    });

    if (!jsonPut.ok) throw new Error("Failed to commit updated newsletters.json");

    log.style.color = "#16a34a";
    log.innerText = "Issue successfully removed from active archive!";
    alert("Issue removed from active archive!");
    populateDeleteDropdown(updatedData);
  } catch (err) {
    log.style.color = "#dc2626";
    log.innerText = "Error: " + err.message;
    alert("Deletion failed: " + err.message);
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-trash-can"></i> Remove Selected Issue from Archive';
  }
}

window.addEventListener("DOMContentLoaded", function() {
  document.getElementById("formPanel").addEventListener("input", renderPreview);
  document.getElementById("addStoryBtn").addEventListener("click", addStoryField);
  document.getElementById("refreshPreviewBtn").addEventListener("click", renderPreview);
  document.getElementById("publishBtn").addEventListener("click", publishIssueToGithub);
  document.getElementById("fetchDeleteBtn").addEventListener("click", fetchExistingIssuesViaToken);
  document.getElementById("deleteBtn").addEventListener("click", deleteIssueFromGithub);

  renderPreview();
  loadLocalDeleteList();
});