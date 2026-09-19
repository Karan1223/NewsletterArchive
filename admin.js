function renderPreview() {
  const iframe = document.getElementById("livePreview");
  if (!iframe) return "";

  const headline = document.getElementById("issueHeadline").value || "CT Today e-Magazine";
  const coverImg = document.getElementById("coverImgUrl").value;
  const leadTitle = document.getElementById("leadTitle").value;
  const leadLink = document.getElementById("leadLink").value;
  const leadDesc = document.getElementById("leadDesc").value;
  const leadBannerImg = document.getElementById("leadBannerImg").value;
  const rightBadge = document.getElementById("rightBadgeText")?.value || "Special Report";
  const rightLink = document.getElementById("rightBannerLink")?.value || "https://www.constructiontechnology.in/contact";

  const titles = Array.from(document.querySelectorAll(".story-title-input")).map(el => el.value);
  const links = Array.from(document.querySelectorAll(".story-link-input")).map(el => el.value);
  const images = Array.from(document.querySelectorAll(".story-img-input")).map(el => el.value);
  const descs = Array.from(document.querySelectorAll(".story-desc-input")).map(el => el.value);

  const adLinks = Array.from(document.querySelectorAll(".ad-link-input")).map(el => el.value);
  const adImages = Array.from(document.querySelectorAll(".ad-img-input")).map(el => el.value);

  const nextTitle = document.getElementById("nextIssueTitle")?.value || "CT Today Magazine – October 2026 Special Issue";
  const nextIntro = document.getElementById("nextIssueIntro")?.value || "Powering the next phase of construction, mining & aggregates with technologies built for productivity and performance.";
  const nextCover = document.getElementById("nextIssueCoverStory")?.value || "Crushing, Screening & Washing Equipment";
  const nextFeat = document.getElementById("nextIssueSpecialFeature")?.value || "Excavators";
  const nextProf = document.getElementById("nextIssueIndustryProfile")?.value || "Mobile Crushers";
  const nextHigh = document.getElementById("nextIssueProductHighlights")?.value || "Cone Crushers";
  const nextCov = document.getElementById("nextIssueSpecialCoverage")?.value || "Post bauma CONEXPO INDIA 2026";
  const nextPromo = document.getElementById("nextIssuePromoText")?.value || "Showcase your brand • Highlight your innovations • Connect with the industry";

  function buildStoryRow(i) {
    if (i >= titles.length) return "";
    const leftImg = images[i] || "https://www.constructiontechnology.in/nl_images/logo.png";
    let rightCol = "";

    if (i + 1 < titles.length && titles[i + 1]) {
      const rightImg = images[i + 1] || "https://www.constructiontechnology.in/nl_images/logo.png";
      rightCol = 
        '<a href="' + links[i + 1] + '" target="_blank" style="text-decoration:none;">' +
          '<img src="' + rightImg + '" width="100%" alt="Story Image" style="width:100%;height:220px;object-fit:cover;border-radius:6px;display:block;margin-bottom:10px;" />' +
          '<div style="font-size:13px;line-height:18px;font-weight:bold;color:#111111;">' + titles[i + 1] + '</div>' +
          '<div style="font-size:12px;line-height:18px;color:#555555;margin-top:8px;">' + descs[i + 1] + '<br /><br /><span style="color:#f36f21;font-weight:bold;">Discover the Full Story</span></div>' +
        '</a>';
    }

    return '<tr>' +
      '<td width="48%" valign="top" style="background:#fafafa;border:1px solid #e1e1e1;border-radius:8px;padding:12px;">' +
        '<a href="' + links[i] + '" target="_blank" style="text-decoration:none;">' +
          '<img src="' + leftImg + '" width="100%" alt="Story Image" style="width:100%;height:220px;object-fit:cover;border-radius:6px;display:block;margin-bottom:10px;" />' +
          '<div style="font-size:13px;line-height:18px;font-weight:bold;color:#111111;">' + titles[i] + '</div>' +
          '<div style="font-size:12px;line-height:18px;color:#555555;margin-top:8px;">' + descs[i] + '<br /><br /><span style="color:#f36f21;font-weight:bold;">Learn More about this.</span></div>' +
        '</a>' +
      '</td>' +
      '<td width="4%"></td>' +
      '<td width="48%" valign="top" style="background:#fafafa;border:1px solid #e1e1e1;border-radius:8px;padding:12px;">' +
        rightCol +
      '</td>' +
    '</tr>' +
    '<tr><td colspan="3" height="12"></td></tr>';
  }

  function buildAdRow(j) {
    if (j >= adImages.length) return "";
    const aImg = adImages[j] || "https://www.constructiontechnology.in/nl_images/logo.png";
    const aLnk = adLinks[j] || "https://www.constructiontechnology.in";
    return '<tr><td align="center" style="padding:14px 26px 14px;">' +
      '<a href="' + aLnk + '" target="_blank">' +
        '<img src="' + aImg + '" width="100%" alt="Ad Banner" style="width:100%;display:block;border:1px solid #e1e1e1;border-radius:8px;" />' +
      '</a>' +
    '</td></tr>';
  }

  let assembledLayout = "";
  let storyIndex = 0;
  let adIndex = 0;
  let sectionHeadingAdded = false;

  while (storyIndex < titles.length || adIndex < adImages.length) {
    let storyBatchHtml = "";
    if (storyIndex < titles.length) {
      if (!sectionHeadingAdded) {
        assembledLayout += '<tr><td style="padding:0 26px 14px;"><div style="font-size:20px;font-weight:bold;border-left:5px solid #f36f21;padding-left:14px;line-height:24px;">The Inside Story</div></td></tr>';
        sectionHeadingAdded = true;
      }
      storyBatchHtml += '<tr><td style="padding:0 26px 12px;"><table width="100%" cellpadding="0" cellspacing="0" border="0">';
      storyBatchHtml += buildStoryRow(storyIndex);
      storyIndex += 2;
      storyBatchHtml += '</table></td></tr>';
      assembledLayout += storyBatchHtml;
    }

    if (adIndex < adImages.length) {
      assembledLayout += buildAdRow(adIndex);
      adIndex++;
    }
  }

  const fullHtml = 
    '<!DOCTYPE html>' +
    '<html>' +
    '<head><meta charset="utf-8"><title>' + headline + '</title></head>' +
    '<body style="margin:0;padding:0;background:#f4f5f7;font-family:Arial,Helvetica,sans-serif;color:#222;">' +
      '<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f4f5f7">' +
        '<tr><td align="center" style="padding:30px 10px;">' +
          '<table width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="width:600px;max-width:600px;border-radius:10px;overflow:hidden;margin:0 auto;">' +
            
            '<tr>' +
              '<td style="background:#1f1f1f;padding:14px 22px;color:#ffffff;">' +
                '<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>' +
                  '<td style="font-size:12px;color:#bbbbbb;font-family:Arial,Helvetica,sans-serif;">' + headline + '</td>' +
                  '<td align="right" style="font-size:12px;color:#bbbbbb;font-family:Arial,Helvetica,sans-serif;">Construction Technology Today</td>' +
                '</tr></table>' +
              '</td>' +
            '</tr>' +

            '<tr><td align="center" style="padding:26px;">' +
              '<a href="https://www.constructiontechnology.in/" target="_blank">' +
                '<img src="https://www.constructiontechnology.in/nl_images/logo.png" width="220" alt="Logo" style="display:block;margin:auto;" />' +
              '</a>' +
            '</td></tr>' +

            '<tr><td style="padding:0 26px 26px;">' +
              '<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr>' +
                '<td width="48%" valign="top">' +
                  '<a href="' + leadLink + '" target="_blank" style="text-decoration:none;">' +
                    '<div style="display:inline-block;background:#f36f21;color:#ffffff;font-size:11px;font-weight:bold;line-height:1;padding:6px 12px;border-radius:20px;margin-bottom:10px;">' + headline + '</div>' +
                    '<img src="' + coverImg + '" width="100%" alt="Cover Issue" style="width:100%;border-radius:8px;border:1px solid #dddddd;display:block;" />' +
                  '</a>' +
                '</td>' +
                '<td width="4%"></td>' +
                '<td width="48%" valign="top">' +
                  '<div style="display:inline-block;background:#111111;color:#ffffff;font-size:11px;font-weight:bold;line-height:1;padding:6px 12px;border-radius:20px;margin-bottom:10px;">' + rightBadge + '</div>' +
                  '<a href="' + rightLink + '" target="_blank">' +
                    '<img src="' + leadBannerImg + '" width="100%" alt="Right Panel Hero" style="width:100%;height:350px;object-fit:contain;border-radius:8px;display:block;" />' +
                  '</a>' +
                '</td>' +
              '</tr></table>' +
            '</td></tr>' +

            '<tr><td style="padding:0 26px 20px;" class="lead-story-block">' +
              '<div style="background:#fff7ed;border-left:4px solid #f36f21;padding:14px 18px;border-radius:0 8px 8px 0;border-top:1px solid #fed7aa;border-right:1px solid #fed7aa;border-bottom:1px solid #fed7aa;">' +
                '<div style="font-size:11px;font-weight:bold;color:#f36f21;text-transform:uppercase;margin-bottom:4px;">Lead Cover Story</div>' +
                '<h2 style="font-size:16px;font-weight:bold;margin:0 0 6px 0;line-height:1.4;"><a href="' + leadLink + '" target="_blank" style="color:#111111;text-decoration:none;">' + leadTitle + '</a></h2>' +
                '<p style="font-size:12px;color:#444444;line-height:1.5;margin:0;">' + leadDesc + '</p>' +
              '</div>' +
            '</td></tr>' +

            assembledLayout +

            '<tr><td style="padding:17px 26px 26px;border-top:2px solid #666666;" class="next-issue-block">' +
              '<table cellpadding="0" cellspacing="0" border="0"><tr>' +
                '<td style="background-color:#f7941d;color:#ffffff;font-size:9px;line-height:1;font-weight:bold;padding:5px 8px;white-space:nowrap;">NEXT ISSUE FOCUS</td>' +
              '</tr></table>' +
              '<p style="margin:10px 0 8px;padding:0;font-size:12px;line-height:1.35;font-weight:bold;color:#333333;">' + nextTitle + '</p>' +
              '<p style="margin:0;padding:0;font-size:11px;line-height:1.45;color:#333333;">' +
                nextIntro +
                '<br /><br />' +
                '<strong>• Cover Story:</strong> ' + nextCover + '<br />' +
                '<strong>• Special Feature:</strong> ' + nextFeat + '<br />' +
                '<strong>• Industry Profile:</strong> ' + nextProf + '<br />' +
                '<strong>• Product Highlights:</strong> ' + nextHigh + '<br />' +
                '<strong>• Special Coverage:</strong> ' + nextCov +
                '<br /><br />' +
                '<span style="color:#9f1fac;font-weight:bold;">' + nextPromo + '</span>' +
              '</p>' +
            '</td></tr>' +

            '<tr><td align="center" style="background:#f36f21;padding:32px;">' +
              '<div style="color:#ffffff;font-size:20px;font-weight:bold;margin-bottom:12px;font-family:Arial,Helvetica,sans-serif;">Stay Ahead of Construction Technology</div>' +
              '<a href="https://www.constructiontechnology.in/subscriptions" target="_blank" style="background:#ffffff;color:#f36f21;padding:14px 34px;border-radius:30px;font-weight:bold;text-decoration:none;display:inline-block;font-family:Arial,Helvetica,sans-serif;">Subscribe Now</a>' +
            '</td></tr>' +

            '<tr><td align="center" style="padding:18px;font-size:12px;color:#777777;font-family:Arial,Helvetica,sans-serif;">' +
              '&copy; 2026 Construction Technology Today<br />' +
              '<a href="https://www.constructiontechnology.in" target="_blank" style="color:#000000;text-decoration:none;">www.constructiontechnology.in</a>' +
            '</td></tr>' +

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

function addStoryField(title = "", link = "", img = "", desc = "") {
  const container = document.getElementById("storiesContainer");
  const storyCount = container.querySelectorAll(".story-entry").length + 1;
  const div = document.createElement("div");
  div.className = "story-entry";
  div.innerHTML = 
    '<label>Story ' + storyCount + ' Title <span class="req">*</span></label>' +
    '<input type="text" class="story-title-input" value="' + escapeHtml(title) + '" placeholder="Story title" required />' +
    '<label>Story ' + storyCount + ' Link <span class="req">*</span></label>' +
    '<input type="text" class="story-link-input" value="' + escapeHtml(link) + '" placeholder="https://..." required />' +
    '<label>Image URL or Device File</label>' +
    '<div class="image-input-group">' +
      '<input type="text" class="story-img-input" value="' + escapeHtml(img) + '" placeholder="https://..." />' +
      '<label class="file-upload-btn"><i class="fa-solid fa-upload"></i> Upload<input type="file" class="story-file-input" accept="image/*" style="display:none;" /></label>' +
    '</div>' +
    '<label>Summary</label>' +
    '<textarea class="story-desc-input" placeholder="Brief summary...">' + escapeHtml(desc) + '</textarea>';
  container.appendChild(div);
  attachFileInputListeners(div);
  renderPreview();
}

function addAdField(link = "", img = "") {
  const container = document.getElementById("adsContainer");
  const adCount = container.querySelectorAll(".ad-entry").length + 1;
  const div = document.createElement("div");
  div.className = "ad-entry";
  div.innerHTML = 
    '<label>Ad ' + adCount + ' Destination Link</label>' +
    '<input type="text" class="ad-link-input" value="' + escapeHtml(link) + '" placeholder="https://..." />' +
    '<label>Ad ' + adCount + ' Banner Image URL or Device File</label>' +
    '<div class="image-input-group">' +
      '<input type="text" class="ad-img-input" value="' + escapeHtml(img) + '" placeholder="https://..." />' +
      '<label class="file-upload-btn"><i class="fa-solid fa-upload"></i> Upload<input type="file" class="ad-file-input" accept="image/*" style="display:none;" /></label>' +
    '</div>';
  container.appendChild(div);
  attachFileInputListeners(div);
  renderPreview();
}

function escapeHtml(text) {
  return String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function attachFileInputListeners(scope = document) {
  scope.querySelectorAll('input[type="file"]').forEach(fileInput => {
    fileInput.removeEventListener('change', handleFileChange);
    fileInput.addEventListener('change', handleFileChange);
  });
}

function handleFileChange(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(uploadEvent) {
    const textInput = e.target.closest('.image-input-group').querySelector('input[type="text"]');
    textInput.value = uploadEvent.target.result;
    renderPreview();
  };
  reader.readAsDataURL(file);
}

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

function populateDeleteDropdown(items) {
  const deleteSelect = document.getElementById("deleteSelect");
  if (!items || !items.length) return;
  deleteSelect.innerHTML = '<option value="">-- Choose an edition to remove --</option>' +
    items.map(item => `<option value="${item.folder}">${item.year} - ${item.monthName} (${item.folder})</option>`).join("");
}

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

  if (deleteLog) {
    deleteLog.style.color = "#f36f21";
    deleteLog.innerText = "Connecting to GitHub repository...";
  }

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

    if (deleteLog) {
      deleteLog.style.color = "#16a34a";
      deleteLog.innerText = `Loaded ${items.length} issues directly from GitHub.`;
    }
  } catch (err) {
    if (deleteLog) {
      deleteLog.style.color = "#dc2626";
      deleteLog.innerText = "Error loading list: " + err.message;
    }
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
  const leadBannerImg = document.getElementById("leadBannerImg").value.trim();

  const log = document.getElementById("publishLog");
  const btn = document.getElementById("publishBtn");

  if (!token) {
    alert("Please paste your GitHub Personal Access Token in Section 1.");
    tokenInput.focus();
    return;
  }
  if (!user || !repo || !year || !folderInput || !monthName || !headline || !leadTitle || !leadLink || !leadBannerImg) {
    alert("Required fields cannot be empty. Please fill in all fields marked with *.");
    return;
  }

  const targetFolderPath = "issues/" + year + "/" + folderInput;
  const targetFilePath = targetFolderPath + "/index.html";

  btn.disabled = true;
  btn.innerText = "Publishing to GitHub...";
  if (log) {
    log.style.color = "#f36f21";
    log.innerText = "1/2 Committing issue HTML file to GitHub...";
  }

  try {
    const content = renderPreview();

    const fileRes = await fetch(`https://api.github.com/repos/${user}/${repo}/contents/${targetFilePath}`, {
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
      throw new Error(`Failed saving ${targetFilePath}: ${errJson.message || fileRes.statusText}`);
    }

    if (log) log.innerText = "2/2 Safely updating data/newsletters.json registry...";

    const jsonPath = "data/newsletters.json";
    const jsonGet = await fetch(`https://api.github.com/repos/${user}/${repo}/contents/${jsonPath}?ref=main`, {
      headers: { "Authorization": "Bearer " + token }
    });

    if (!jsonGet.ok) throw new Error("Could not find data/newsletters.json on GitHub.");

    const jsonGetData = await jsonGet.json();
    const sha = jsonGetData.sha;
    let existingData = JSON.parse(safeDecodeBase64(jsonGetData.content));

    existingData = existingData.filter(item => item.folder !== targetFolderPath);

    const newEntry = {
      year: parseInt(year, 10),
      month: folderInput,
      monthName: monthName,
      title: headline,
      folder: targetFolderPath
    };
    existingData.unshift(newEntry);

    const jsonPut = await fetch(`https://api.github.com/repos/${user}/${repo}/contents/${jsonPath}`, {
      method: "PUT",
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: "Update registry entry: " + headline,
        content: safeEncodeBase64(JSON.stringify(existingData, null, 2)),
        sha: sha
      })
    });

    if (!jsonPut.ok) {
      const errJson = await jsonPut.json();
      throw new Error(`Failed updating newsletters.json: ${errJson.message || jsonPut.statusText}`);
    }

    if (log) {
      log.style.color = "#16a34a";
      log.innerText = "Success! Issue saved and registry updated.";
    }
    alert("Published successfully!");
    populateDeleteDropdown(existingData);
  } catch (err) {
    if (log) {
      log.style.color = "#dc2626";
      log.innerText = "Error: " + err.message;
    }
    alert("Failed to publish: " + err.message);
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

  const confirmDelete = confirm(`Are you sure you want to completely delete "${deleteFolder}" and its index.html file from GitHub?`);
  if (!confirmDelete) return;

  btn.disabled = true;
  btn.innerText = "Deleting issue & files...";
  if (log) {
    log.style.color = "#f36f21";
    log.innerText = "1/2 Removing index.html from GitHub...";
  }

  try {
    const htmlFilePath = deleteFolder + "/index.html";
    const fileGetRes = await fetch(`https://api.github.com/repos/${user}/${repo}/contents/${htmlFilePath}?ref=main`, {
      headers: { "Authorization": "Bearer " + token }
    });

    if (fileGetRes.ok) {
      const fileData = await fileGetRes.json();
      await fetch(`https://api.github.com/repos/${user}/${repo}/contents/${htmlFilePath}`, {
        method: "DELETE",
        headers: {
          "Authorization": "Bearer " + token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: "Delete folder file: " + htmlFilePath,
          sha: fileData.sha
        })
      });
    }

    if (log) log.innerText = "2/2 Updating newsletters.json registry...";

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
        message: "Remove edition from registry: " + deleteFolder,
        content: safeEncodeBase64(JSON.stringify(updatedData, null, 2)),
        sha: jsonGetData.sha
      })
    });

    if (!jsonPut.ok) throw new Error("Failed to commit updated newsletters.json");

    if (log) {
      log.style.color = "#16a34a";
      log.innerText = "Issue and its files successfully deleted from GitHub!";
    }
    alert("Issue deleted successfully!");
    populateDeleteDropdown(updatedData);
  } catch (err) {
    if (log) {
      log.style.color = "#dc2626";
      log.innerText = "Error: " + err.message;
    }
    alert("Deletion failed: " + err.message);
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-trash-can"></i> Remove Selected Issue from Archive';
  }
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

window.addEventListener("DOMContentLoaded", function() {
  const formPanel = document.getElementById("formPanel");
  if (formPanel) {
    formPanel.addEventListener("input", renderPreview);
    formPanel.addEventListener("change", renderPreview);
  }

  const addStoryBtn = document.getElementById("addStoryBtn");
  if (addStoryBtn) addStoryBtn.addEventListener("click", () => addStoryField());

  const addAdBtn = document.getElementById("addAdBtn");
  if (addAdBtn) addAdBtn.addEventListener("click", () => addAdField());

  const refreshPreviewBtn = document.getElementById("refreshPreviewBtn");
  if (refreshPreviewBtn) refreshPreviewBtn.addEventListener("click", renderPreview);

  const publishBtn = document.getElementById("publishBtn");
  if (publishBtn) publishBtn.addEventListener("click", publishIssueToGithub);

  const fetchDeleteBtn = document.getElementById("fetchDeleteBtn");
  if (fetchDeleteBtn) fetchDeleteBtn.addEventListener("click", fetchExistingIssuesViaToken);

  const deleteBtn = document.getElementById("deleteBtn");
  if (deleteBtn) deleteBtn.addEventListener("click", deleteIssueFromGithub);

  attachFileInputListeners();
  renderPreview();
  loadLocalDeleteList();
});