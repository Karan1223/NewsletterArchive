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

  // 1. Gather form values
  const sImg = document.getElementById("spotlightImg")?.value.trim() || "";
  const sLink = document.getElementById("spotlightLink")?.value.trim() || "";
  const sDesc = document.getElementById("spotlightDesc")?.value.trim() || "";

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
  localStorage.removeItem("ct_gh_token");

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

    // ── 2. DIGITAL MAGAZINE SPOTLIGHT (FIXED & TARGETED) ──
    const spotlightCoverImg = doc.querySelector(".magazine-spotlight img.spotlight-cover");
    if (spotlightCoverImg && sImg) {
      spotlightCoverImg.setAttribute("src", sImg);
    }

    const spotlightDescP = doc.querySelector(".magazine-spotlight .spotlight-info p");
    if (spotlightDescP && sDesc) {
      spotlightDescP.textContent = sDesc;
    }

    // Target the cover image wrapper anchor specifically
    const spotlightImageAnchor = doc.querySelector(".magazine-spotlight > a");
    if (spotlightImageAnchor && sLink) {
      spotlightImageAnchor.setAttribute("href", sLink);
    }

    // Target the "Read Full Magazine" button specifically
    const spotlightReadMagBtn = doc.querySelector(".magazine-spotlight a.btn-digital-copy");
    if (spotlightReadMagBtn && sLink) {
      spotlightReadMagBtn.setAttribute("href", sLink);
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

      const ad2Anchor = adCards[1].querySelector("a");
      const ad2Img = adCards[1].querySelector("img");
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
        message: "Update portal spotlight cover, descriptions, links, and banners via Homepage Editor",
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
    alert("Homepage updated successfully! Spotlight cover image and description are now live.");
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

  const publishBtn = document.getElementById("publishHomeBtn");
  if (publishBtn) {
    publishBtn.addEventListener("click", publishHomeUpdates);
  }
});