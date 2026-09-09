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

// Local file upload handler for Spotlight & Ads
function attachFileUpload(fileInputId, textInputId) {
  const fileInput = document.getElementById(fileInputId);
  const textInput = document.getElementById(textInputId);
  if (!fileInput || !textInput) return;

  fileInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(uploadEvent) {
      textInput.value = uploadEvent.target.result;
    };
    reader.readAsDataURL(file);
  });
}

async function publishHomeUpdates() {
  const tokenInput = document.getElementById("ghToken");
  const token = tokenInput.value.trim();
  const user = document.getElementById("ghUsername").value.trim();
  const repo = document.getElementById("ghRepo").value.trim();
  const log = document.getElementById("publishLog");
  const btn = document.getElementById("publishHomeBtn");

  if (!token) {
    alert("Please paste your GitHub Personal Access Token.");
    tokenInput.focus();
    return;
  }

  const sImg = document.getElementById("spotlightImg").value.trim();
  const sLink = document.getElementById("spotlightLink").value.trim();
  const sDesc = document.getElementById("spotlightDesc").value.trim();

  const cardTopics = Array.from(document.querySelectorAll(".card-topic")).map(el => el.value.trim());
  const cardLinks = Array.from(document.querySelectorAll(".card-link")).map(el => el.value.trim());
  const cardTitles = Array.from(document.querySelectorAll(".card-title")).map(el => el.value.trim());
  const cardDescs = Array.from(document.querySelectorAll(".card-desc")).map(el => el.value.trim());

  const evDays = Array.from(document.querySelectorAll(".ev-day")).map(el => el.value.trim());
  const evMonths = Array.from(document.querySelectorAll(".ev-month")).map(el => el.value.trim());
  const evNames = Array.from(document.querySelectorAll(".ev-name")).map(el => el.value.trim());
  const evMetas = Array.from(document.querySelectorAll(".ev-meta")).map(el => el.value.trim());
  const evLinks = Array.from(document.querySelectorAll(".ev-link")).map(el => el.value.trim());

  const adImg1 = document.getElementById("adImg1").value.trim();
  const adLink1 = document.getElementById("adLink1").value.trim();
  const adImg2 = document.getElementById("adImg2").value.trim();
  const adLink2 = document.getElementById("adLink2").value.trim();

  tokenInput.value = "";
  localStorage.removeItem("ct_gh_token");

  btn.disabled = true;
  btn.innerText = "Publishing updates to GitHub...";
  log.style.color = "#f36f21";
  log.innerText = "Fetching current index.html from repository...";

  try {
    const indexPath = "index.html";
    const res = await fetch(`https://api.github.com/repos/${user}/${repo}/contents/${indexPath}?ref=main`, {
      headers: { "Authorization": "Bearer " + token }
    });

    if (!res.ok) throw new Error("Could not retrieve index.html from repository.");

    const indexData = await res.json();
    let html = safeDecodeBase64(indexData.content);

    // 1. Update Spotlight Cover, Link, & Description
    html = html.replace(/(<a href=")[^"]*("[^>]*>\s*<img class="spotlight-cover" src=")/, `$1${sLink}$2`);
    html = html.replace(/(<img class="spotlight-cover" src=")[^"]*(")/, `$1${sImg}$2`);
    html = html.replace(/(<div class="spotlight-info">[\s\S]*?<p>)[^<]*(<\/p>)/, `$1${sDesc}$2`);
    html = html.replace(/(<a href=")[^"]*("[^>]* class="btn-digital-copy">[\s\S]*?<i class="fa-solid fa-book-open"><\/i> Read Full Magazine<\/a>)/, `$1${sLink}$2`);

    // 2. Update Technical Cards with individual links
    let cardsHtml = "";
    for (let i = 0; i < cardTitles.length; i++) {
      cardsHtml += `
          <article class="tech-card">
            <div>
              <div class="tech-topic">${cardTopics[i]}</div>
              <h4>${cardTitles[i]}</h4>
              <p>${cardDescs[i]}</p>
            </div>
            <a href="${cardLinks[i]}" target="_blank" class="card-footer-link">
              Explore Technology <i class="fa-solid fa-arrow-up-right-from-square"></i>
            </a>
          </article>`;
    }
    html = html.replace(/(<div class="tech-articles-grid">)[\s\S]*?(<\/div>\s*<div class="section-heading">)/, `$1${cardsHtml}\n        </div>$2`);

    // 3. Update Upcoming Trade Shows with individual links
    let eventsHtml = "";
    for (let j = 0; j < evNames.length; j++) {
      eventsHtml += `
          <div class="event-item-block">
            <div class="event-calendar-badge"><div class="cal-day">${evDays[j]}</div><div class="cal-month">${evMonths[j]}</div></div>
            <div class="event-details">
              <h5>${evNames[j]}</h5>
              <p>${evMetas[j]}</p>
              <a href="${evLinks[j]}" target="_blank" class="event-link-text">Contact Us For Details <i class="fa-solid fa-chevron-right"></i></a>
            </div>
          </div>`;
    }
    html = html.replace(/(<div class="sidebar-box">\s*<div class="sidebar-header"><i class="fa-solid fa-calendar-days"></i> Upcoming Trade Shows<\/div>\s*<div class="sidebar-body">)[\s\S]*?(<\/div>\s*<\/div>\s*<div class="sidebar-box ad-card">)/, `$1${eventsHtml}\n        </div>$2`);

    // 4. Update Sidebar Ad Banners & Links
    html = html.replace(/(<div class="sidebar-box ad-card">[\s\S]*?<a href=")[^"]*(" [^>]*>\s*<img src=")[^"]*("[^>]*>\s*<\/a>\s*<\/div>\s*<div class="sidebar-box">\s*<div class="sidebar-header">[\s\S]*?<div class="sidebar-box ad-card">[\s\S]*?<a href=")[^"]*(" [^>]*>\s*<img src=")[^"]*("[^>]*>)/, 
      `$1${adLink1}$2${adImg1}$3$4${adLink2}$5${adImg2}$6`);

    // 5. Commit updated index.html back to GitHub
    const putRes = await fetch(`https://api.github.com/repos/${user}/${repo}/contents/${indexPath}`, {
      method: "PUT",
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: "Update portal homepage custom banner ads and links",
        content: safeEncodeBase64(html),
        sha: indexData.sha
      })
    });

    if (!putRes.ok) {
      const errJson = await putRes.json();
      throw new Error(errJson.message || putRes.statusText);
    }

    log.style.color = "#16a34a";
    log.innerText = "Success! Portal homepage updated with custom banner ads and links.";
    alert("Homepage updated successfully!");
  } catch (err) {
    log.style.color = "#dc2626";
    log.innerText = "Error: " + err.message;
    alert("Update failed: " + err.message);
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> Save & Publish Homepage Updates to GitHub';
  }
}

window.addEventListener("DOMContentLoaded", function() {
  attachFileUpload('spotlightImgFile', 'spotlightImg');
  attachFileUpload('adImg1File', 'adImg1');
  attachFileUpload('adImg2File', 'adImg2');

  document.getElementById("publishHomeBtn").addEventListener("click", publishHomeUpdates);
});