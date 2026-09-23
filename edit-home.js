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

async function loadCurrentHomepageData() {
  const user = document.getElementById("ghUsername")?.value.trim() || "karan1223";
  const repo = document.getElementById("ghRepo")?.value.trim() || "NewsletterArchive";
  const tokenInput = document.getElementById("ghToken");
  const token = tokenInput ? tokenInput.value.trim() : "";
  const log = document.getElementById("publishLog");

  if (log) {
    log.style.color = "#f36f21";
    log.innerText = "Loading current index.html from GitHub repository...";
  }

  try {
    const headers = { "Accept": "application/vnd.github.v3+json" };
    if (token) headers["Authorization"] = "Bearer " + token;

    const res = await fetch(`https://api.github.com/repos/${user}/${repo}/contents/index.html?ref=main`, { headers });
    if (!res.ok) {
      throw new Error(`Failed to fetch index.html (Status ${res.status})`);
    }
    const data = await res.json();
    const rawHtml = safeDecodeBase64(data.content);
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawHtml, "text/html");

    // 1. Digital Magazine Spotlight
    const sImg = doc.querySelector(".magazine-spotlight img.spotlight-cover")?.getAttribute("src");
    if (sImg) document.getElementById("spotlightImg").value = sImg;

    const sLink = doc.querySelector(".magazine-spotlight > a")?.getAttribute("href") || doc.querySelector(".magazine-spotlight a.btn-digital-copy")?.getAttribute("href");
    if (sLink) document.getElementById("spotlightLink").value = sLink;

    const sDesc = doc.querySelector(".magazine-spotlight .spotlight-info p")?.textContent.trim();
    if (sDesc) document.getElementById("spotlightDesc").value = sDesc;

    // 2. Latest Issue Spotlight
    const latestTitleEl = doc.querySelector("#latestIssueLabel, .latest-issue-label, .latest-issue-title");
    if (latestTitleEl && latestTitleEl.textContent.trim()) {
      document.getElementById("latestIssueLabel").value = latestTitleEl.textContent.trim();
    }
    const latestLinkEl = doc.querySelector("#latestIssueLink, .latest-issue-link");
    if (latestLinkEl && latestLinkEl.getAttribute("href")) {
      document.getElementById("latestIssueLink").value = latestLinkEl.getAttribute("href");
    }

    // 3. Technical Insight Cards
    const techCards = doc.querySelectorAll(".tech-articles-grid .tech-card");
    const topicInputs = document.querySelectorAll(".card-topic");
    const titleInputs = document.querySelectorAll(".card-title");
    const descInputs = document.querySelectorAll(".card-desc");
    const linkInputs = document.querySelectorAll(".card-link");

    techCards.forEach((card, idx) => {
      if (topicInputs[idx]) topicInputs[idx].value = card.querySelector(".tech-topic")?.textContent.trim() || "";
      if (titleInputs[idx]) titleInputs[idx].value = card.querySelector("h4")?.textContent.trim() || "";
      if (descInputs[idx]) descInputs[idx].value = card.querySelector("p")?.textContent.trim() || "";
      if (linkInputs[idx]) linkInputs[idx].value = card.querySelector(".card-footer-link")?.getAttribute("href") || "";
    });

    // 4. Upcoming Trade Shows
    const eventBlocks = doc.querySelectorAll(".event-item-block");
    const evDays = document.querySelectorAll(".ev-day");
    const evMonths = document.querySelectorAll(".ev-month");
    const evNames = document.querySelectorAll(".ev-name");
    const evMetas = document.querySelectorAll(".ev-meta");
    const evLinks = document.querySelectorAll(".ev-link");

    eventBlocks.forEach((block, idx) => {
      if (evDays[idx]) evDays[idx].value = block.querySelector(".cal-day")?.textContent.trim() || "";
      if (evMonths[idx]) evMonths[idx].value = block.querySelector(".cal-month")?.textContent.trim() || "";
      if (evNames[idx]) evNames[idx].value = block.querySelector("h5")?.textContent.trim() || "";
      if (evMetas[idx]) evMetas[idx].value = block.querySelector("p")?.textContent.trim() || "";
      if (evLinks[idx]) evLinks[idx].value = block.querySelector(".event-link-text")?.getAttribute("href") || "";
    });

    // 5. Sidebar Banner Ads
    const adCards = doc.querySelectorAll(".sidebar-box.ad-card");
    if (adCards.length >= 2) {
      const ad1Img = adCards[0].querySelector("img")?.getAttribute("src");
      const ad1Link = adCards[0].querySelector("a")?.getAttribute("href");
      if (ad1Img) document.getElementById("adImg1").value = ad1Img;
      if (ad1Link) document.getElementById("adLink1").value = ad1Link;

      const ad2Img = adCards.querySelector("img")?.getAttribute("src");
      const ad2Link = adCards.querySelector("a")?.getAttribute("href");
      if (ad2Img) document.getElementById("adImg2").value = ad2Img;
      if (ad2Link) document.getElementById("adLink2").value = ad2Link;
    }

    if (log) {
      log.style.color = "#16a34a";
      log.innerText = "Loaded current values from live index.html!";
    }
  } catch (err) {
    console.warn("Could not load current index.html:", err);
    if (log) {
      log.style.color = "#dc2626";
      log.innerText = "Load warning: " + err.message;
    }
  }
}

async function autoDetectLatestIssue() {
  const user = document.getElementById("ghUsername")?.value.trim() || "karan1223";
  const repo = document.getElementById("ghRepo")?.value.trim() || "NewsletterArchive";
  
  try {
    const res = await fetch(`https://api.github.com/repos/${user}/${repo}/contents/data/newsletters.json?ref=main`, {
      headers: { "Accept": "application/vnd.github.v3+json" }
    });
    if (res.ok) {
      const data = await res.json();
      const content = JSON.parse(decodeURIComponent(escape(atob(data.content.replace(/\s/g, '')))));
      if (Array.isArray(content) && content.length > 0) {
        const latest = content[content.length - 1]; 
        const labelInput = document.getElementById("latestIssueLabel");
        const linkInput = document.getElementById("latestIssueLink");
        
        if (labelInput && latest.title) labelInput.value = latest.title;
        else if (labelInput && latest.monthName) labelInput.value = latest.monthName;

        if (linkInput && latest.folder) {
          linkInput.value = `https://${user}.github.io/${repo}/${latest.folder}/index.html`;
        }
        alert("Auto-detected latest issue: " + (latest.title || latest.folder));
      }
    } else {
      alert("Could not load newsletters.json manifesto. Check repo path.");
    }
  } catch (err) {
    console.warn("Auto-detect failed:", err);
    alert("Auto-detect error: " + err.message);
  }
}

async function publishHomeUpdates(e) {
  if (e) e.preventDefault();

  const tokenInput = document.getElementById("ghToken");
  const token = tokenInput ? tokenInput.value.trim() : "";
  const user = document.getElementById("ghUsername") ? document.getElementById("ghUsername").value.trim() : "";
  const repo = document.getElementById("ghRepo") ? document.getElementById("ghRepo").value.trim() : "";
  const log = document.getElementById("publishLog");
  const btn = document.getElementById("publishHomeBtn");

  if (!token) {
    alert("Please paste your GitHub Personal Access Token in Section 1.");
    if (tokenInput) tokenInput.focus();
    return;
  }

  if (!user || !repo) {
    alert("GitHub Username and Repository name cannot be empty.");
    return;
  }

  // Gather form values
  const sImg = document.getElementById("spotlightImg")?.value.trim() || "";
  const sLink = document.getElementById("spotlightLink")?.value.trim() || "";
  const sDesc = document.getElementById("spotlightDesc")?.value.trim() || "";

  const latestLabel = document.getElementById("latestIssueLabel")?.value.trim() || "";
  const latestLink = document.getElementById("latestIssueLink")?.value.trim() || "";

  const cardTopics = Array.from(document.querySelectorAll(".card-topic")).map(el => el.value.trim());
  const cardLinks = Array.from(document.querySelectorAll(".card-link")).map(el => el.value.trim());
  const cardTitles = Array.from(document.querySelectorAll(".card-title")).map(el => el.value.trim());
  const cardDescs = Array.from(document.querySelectorAll(".card-desc")).map(el => el.value.trim());

  const evDays = Array.from(document.querySelectorAll(".ev-day")).map(el => el.value.trim());
  const evMonths = Array.from(document.querySelectorAll(".ev-month")).map(el => el.value.trim());
  const evNames = Array.from(document.querySelectorAll(".ev-name")).map(el => el.value.trim());
  const evMetas = Array.from(document.querySelectorAll(".ev-meta")).map(el => el.value.trim());
  const evLinks = Array.from(document.querySelectorAll(".ev-link")).map(el => el.value.trim());

  const adImg1 = document.getElementById("adImg1")?.value.trim() || "";
  const adLink1 = document.getElementById("adLink1")?.value.trim() || "";
  const adImg2 = document.getElementById("adImg2")?.value.trim() || "";
  const adLink2 = document.getElementById("adLink2")?.value.trim() || "";

  tokenInput.value = "";

  if (btn) {
    btn.disabled = true;
    btn.innerText = "Publishing updates to GitHub...";
  }
  if (log) {
    log.style.color = "#f36f21";
    log.innerText = "Fetching current index.html from repository...";
  }

  try {
    const indexPath = "index.html";
    const apiUrl = `https://api.github.com/repos/${user}/${repo}/contents/${indexPath}?ref=main`;

    const res = await fetch(apiUrl, {
      headers: {
        "Authorization": "Bearer " + token,
        "Accept": "application/vnd.github.v3+json"
      }
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.message || `GitHub returned status ${res.status}: ${res.statusText}`);
    }

    const indexData = await res.json();
    let rawHtml = safeDecodeBase64(indexData.content);

    const parser = new DOMParser();
    const doc = parser.parseFromString(rawHtml, "text/html");

    // ── 2. DIGITAL MAGAZINE SPOTLIGHT ──
    const spotlightCoverImg = doc.querySelector(".magazine-spotlight img.spotlight-cover");
    if (spotlightCoverImg && sImg) {
      spotlightCoverImg.setAttribute("src", sImg);
    }

    const spotlightDescP = doc.querySelector(".magazine-spotlight .spotlight-info p");
    if (spotlightDescP && sDesc) {
      spotlightDescP.textContent = sDesc;
    }

    const spotlightImageAnchor = doc.querySelector(".magazine-spotlight > a");
    if (spotlightImageAnchor && sLink) {
      spotlightImageAnchor.setAttribute("href", sLink);
    }

    const spotlightReadMagBtn = doc.querySelector(".magazine-spotlight a.btn-digital-copy");
    if (spotlightReadMagBtn && sLink) {
      spotlightReadMagBtn.setAttribute("href", sLink);
    }

    // ── LATEST ISSUE SPOTLIGHT SYNC ──
    const latestTitleEl = doc.querySelector("#latestIssueLabel, .latest-issue-label, .latest-issue-title");
    const latestLinkEl = doc.querySelector("#latestIssueLink, .latest-issue-link");
    if (latestTitleEl && latestLabel) {
      latestTitleEl.textContent = latestLabel;
    }
    if (latestLinkEl && latestLink) {
      latestLinkEl.setAttribute("href", latestLink);
    }

    // ── 3. TECHNICAL INSIGHT CARDS ──
    const techGrid = doc.querySelector(".tech-articles-grid");
    if (techGrid) {
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
      techGrid.innerHTML = cardsHtml;
    }

    // ── 4. UPCOMING TRADE SHOWS ──
    const tradeShowsBoxes = doc.querySelectorAll(".sidebar-box");
    let tradeShowsBody = null;
    tradeShowsBoxes.forEach(box => {
      const header = box.querySelector(".sidebar-header");
      if (header && header.textContent.includes("Upcoming Trade Shows")) {
        tradeShowsBody = box.querySelector(".sidebar-body");
      }
    });

    if (tradeShowsBody) {
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
      tradeShowsBody.innerHTML = eventsHtml;
    }

    // ── 5. SIDEBAR BANNER ADS ──
    const adCards = doc.querySelectorAll(".sidebar-box.ad-card");
    if (adCards.length >= 2) {
      const ad1Anchor = adCards[0].querySelector("a");
      const ad1Img = adCards[0].querySelector("img");
      if (ad1Anchor && adLink1) ad1Anchor.setAttribute("href", adLink1);
      if (ad1Img && adImg1) ad1Img.setAttribute("src", adImg1);

      const ad2Anchor = adCards.querySelector("a");
      const ad2Img = adCards.querySelector("img");
      if (ad2Anchor && adLink2) ad2Anchor.setAttribute("href", adLink2);
      if (ad2Img && adImg2) ad2Img.setAttribute("src", adImg2);
    }

    const updatedHtml = "<!DOCTYPE html>\n" + doc.documentElement.outerHTML;

    // Commit back to GitHub
    const putRes = await fetch(`https://api.github.com/repos/${user}/${repo}/contents/${indexPath}`, {
      method: "PUT",
      headers: {
        "Authorization": "Bearer " + token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: "Update portal spotlight cover, latest issue, descriptions, links, and banners via Homepage Editor",
        content: safeEncodeBase64(updatedHtml),
        sha: indexData.sha
      })
    });

    if (!putRes.ok) {
      const errJson = await putRes.json().catch(() => ({}));
      throw new Error(errJson.message || `Commit failed with status ${putRes.status}`);
    }

    if (log) {
      log.style.color = "#16a34a";
      log.innerText = "Success! Portal homepage updated on GitHub.";
    }
    alert("Homepage updated successfully! Latest issue, spotlight cover, and description are now live.");
  } catch (err) {
    console.error("Publish error:", err);
    if (log) {
      log.style.color = "#dc2626";
      log.innerText = "Error: " + err.message;
    }
    alert("Update failed: " + err.message);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> Save & Publish Homepage Updates to GitHub';
    }
  }
}

window.addEventListener("DOMContentLoaded", function() {
  attachFileUpload('spotlightImgFile', 'spotlightImg');
  attachFileUpload('adImg1File', 'adImg1');
  attachFileUpload('adImg2File', 'adImg2');

  // Insert a quick-pull sync button dynamically before the form panel content
  const loadCurrentBtn = document.createElement("button");
  loadCurrentBtn.type = "button";
  loadCurrentBtn.className = "btn btn-secondary";
  loadCurrentBtn.style.marginBottom = "16px";
  loadCurrentBtn.style.width = "100%";
  loadCurrentBtn.innerHTML = '<i class="fa-solid fa-download"></i> Load Current Homepage Values from GitHub';
  loadCurrentBtn.addEventListener("click", loadCurrentHomepageData);

  const panel = document.querySelector(".form-panel");
  if (panel) {
    panel.insertBefore(loadCurrentBtn, panel.firstChild);
  }

  const autoDetectBtn = document.getElementById("autoDetectLatestBtn");
  if (autoDetectBtn) {
    autoDetectBtn.addEventListener("click", autoDetectLatestIssue);
  }

  const publishBtn = document.getElementById("publishHomeBtn");
  if (publishBtn) {
    publishBtn.addEventListener("click", publishHomeUpdates);
  }
});