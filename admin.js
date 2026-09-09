function renderPreview() {
  const headline = document.getElementById("issueHeadline").value || "CT Today e-Magazine";
  const coverImg = document.getElementById("coverImgUrl").value;
  const leadTitle = document.getElementById("leadTitle").value;
  const leadLink = document.getElementById("leadLink").value;
  const leadDesc = document.getElementById("leadDesc").value;

  const titles = Array.from(document.querySelectorAll(".story-title-input")).map(function(el) { return el.value; });
  const links = Array.from(document.querySelectorAll(".story-link-input")).map(function(el) { return el.value; });
  const images = Array.from(document.querySelectorAll(".story-img-input")).map(function(el) { return el.value; });
  const descs = Array.from(document.querySelectorAll(".story-desc-input")).map(function(el) { return el.value; });

  let storiesRows = "";
  for (let i = 0; i < titles.length; i += 2) {
    const leftImg = images[i] || "https://www.constructiontechnology.in/nl_images/logo.png";
    const rightImg = images[i+1] || "https://www.constructiontechnology.in/nl_images/logo.png";

    let rightCol = "";
    if (titles[i+1]) {
      rightCol = 
        '<a href="' + links[i+1] + '" target="_blank" style="text-decoration:none;color:inherit;">' +
          '<img src="' + rightImg + '" width="100%" style="border-radius:6px;margin-bottom:8px;display:block;">' +
          '<strong style="font-size:13px;color:#111;line-height:1.4;display:block;">' + titles[i+1] + '</strong>' +
          '<p style="font-size:12px;color:#666;line-height:1.4;margin-top:6px;">' + descs[i+1] + '</p>' +
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
    '<body style="margin:0;padding:0;background:#f4f5f7;font-family:Arial,sans-serif;">' +
      '<table width="100%" cellpadding="0" cellspacing="0" bgcolor="#f4f5f7">' +
        '<tr><td align="center" style="padding:20px 10px;">' +
          '<table width="600" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="border-radius:10px;overflow:hidden;border:1px solid #e1e1e1;">' +
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

  document.getElementById("livePreview").srcdoc = fullHtml;
  return fullHtml;
}

function addStoryField() {
  const container = document.getElementById("storiesContainer");
  const div = document.createElement("div");
  div.className = "story-entry";
  div.innerHTML = 
    '<label>Story Title</label>' +
    '<input type="text" class="story-title-input" placeholder="Story title" />' +
    '<label>Story Link</label>' +
    '<input type="text" class="story-link-input" placeholder="https://..." />' +
    '<label>Image URL</label>' +
    '<input type="text" class="story-img-input" placeholder="https://..." />' +
    '<label>Summary</label>' +
    '<textarea class="story-desc-input" placeholder="Brief summary..."></textarea>';
  container.appendChild(div);
  renderPreview();
}

async function publishIssueToGithub() {
  const token = document.getElementById("ghToken").value.trim();
  const user = document.getElementById("ghUsername").value.trim();
  const repo = document.getElementById("ghRepo").value.trim();
  const year = document.getElementById("issueYear").value.trim();
  const folderInput = document.getElementById("issueFolder").value.trim() || ("Mailer_" + Date.now());
  const monthName = document.getElementById("issueMonthName").value.trim() || "New Edition";
  const headline = document.getElementById("issueHeadline").value.trim() || "e-Magazine";
  const log = document.getElementById("publishLog");
  const btn = document.getElementById("publishBtn");

  if (!token) {
    alert("Please paste your GitHub Personal Access Token.");
    return;
  }

  localStorage.setItem("ct_gh_token", token);
  btn.disabled = true;
  btn.innerText = "Publishing to GitHub...";
  log.style.color = "#f36f21";
  log.innerText = "1/2 Creating issue file...";

  try {
    const folderPath = "issues/" + year + "/" + folderInput;
    const filePath = folderPath + "/index.html";
    const content = renderPreview();

    const fileRes = await fetch("https://api.github.com/repos/" + user + "/" + repo + "/contents/" + filePath, {
      method: "PUT",
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: "Publish issue: " + headline,
        content: btoa(unescape(encodeURIComponent(content)))
      })
    });

    if (!fileRes.ok) throw new Error("Could not create HTML file: " + fileRes.statusText);

    log.innerText = "2/2 Updating data/newsletters.json...";

    const jsonPath = "data/newsletters.json";
    const jsonGet = await fetch("https://api.github.com/repos/" + user + "/" + repo + "/contents/" + jsonPath, {
      headers: { "Authorization": "Bearer " + token }
    });

    let existingData = [];
    let sha = null;

    if (jsonGet.ok) {
      const jsonGetData = await jsonGet.json();
      sha = jsonGetData.sha;
      existingData = JSON.parse(decodeURIComponent(escape(atob(jsonGetData.content))));
    }

    const newEntry = {
      year: parseInt(year, 10),
      month: folderInput,
      monthName: monthName,
      title: headline,
      folder: folderPath
    };
    existingData.unshift(newEntry);

    const putBody = {
      message: "Register issue: " + headline,
      content: btoa(unescape(encodeURIComponent(JSON.stringify(existingData, null, 2))))
    };
    if (sha) putBody.sha = sha;

    const jsonPut = await fetch("https://api.github.com/repos/" + user + "/" + repo + "/contents/" + jsonPath, {
      method: "PUT",
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(putBody)
    });

    if (!jsonPut.ok) throw new Error("Could not update newsletters.json: " + jsonPut.statusText);

    log.style.color = "#16a34a";
    log.innerText = "Published! The new edition will be visible on your portal in ~1 minute.";
    alert("Published successfully!");
  } catch (err) {
    log.style.color = "#dc2626";
    log.innerText = "Error: " + err.message;
    alert("Failed to publish: " + err.message);
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> Save & Publish Issue to GitHub';
  }
}

window.addEventListener("DOMContentLoaded", function() {
  const savedToken = localStorage.getItem("ct_gh_token");
  if (savedToken) document.getElementById("ghToken").value = savedToken;
  
  document.getElementById("formPanel").addEventListener("input", renderPreview);
  document.getElementById("addStoryBtn").addEventListener("click", addStoryField);
  document.getElementById("refreshPreviewBtn").addEventListener("click", renderPreview);
  document.getElementById("publishBtn").addEventListener("click", publishIssueToGithub);
  
  renderPreview();
});