/* ============================================================
   RollingQuate 创作信息公示平台 - 全站公共脚本
   原生 JS 实现，不依赖任何框架
   功能：日期显示、导航高亮、文章清单渲染、上下篇导航、
         应用推荐、回到顶部、文章搜索、标签系统、访客计数、文章目录
   数据源：js/articles-data.js（JS 内嵌，file:// 协议下也能正常加载）
   ============================================================ */

/* ---------- 栏目配置（栏目值 与 导航页对应） ---------- */
window.RQ_CATEGORIES = {
    "info":      "信息发布",
    "team-news": "团队新闻",
    "creation":  "创作专栏",
    "member":    "社员互动",
    "special":   "专题汇总"
};

/* ---------- 工具：HTML 转义，防止文章标题/摘要破坏布局 ---------- */
function rqEscape(str) {
    if (str === undefined || str === null) return "";
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

/* ---------- 顶部日期 + 星期显示 ---------- */
function rqRenderDate() {
    var el = document.getElementById("topDate");
    if (!el) return;
    var d = new Date();
    var weeks = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    var y = d.getFullYear();
    var m = ("0" + (d.getMonth() + 1)).slice(-2);
    var day = ("0" + d.getDate()).slice(-2);
    el.innerHTML =
        '<span class="date-text">' + y + '年' + m + '月' + day + '日</span>' +
        '<span class="week-text">' + weeks[d.getDay()] + '</span>';
}

/* ---------- 主导航高亮（依据 body[data-page]） ---------- */
function rqActiveNav() {
    var page = document.body.getAttribute("data-page");
    if (!page) return;
    var links = document.querySelectorAll(".main-nav a[data-nav]");
    for (var i = 0; i < links.length; i++) {
        if (links[i].getAttribute("data-nav") === page) {
            links[i].parentNode.classList.add("active");
        }
    }
}

/* ---------- 获取文章清单（同步，直接读取 window.RQ_ARTICLES） ---------- */
function rqGetArticles() {
    var arr = window.RQ_ARTICLES;
    if (!Array.isArray(arr)) return [];
    return arr;
}

/* 计算文章详情链接的相对路径前缀（articles/ 目录下需回到上级） */
function rqArticlePrefix() {
    var p = location.pathname;
    if (p.indexOf("/articles/") !== -1) {
        return "../";
    }
    return "";
}

/* ---------- 渲染纯文字资讯列表（ul.news-list） ---------- */
function rqRenderNewsList(containerId, category, limit) {
    var box = document.getElementById(containerId);
    if (!box) return;
    var list = rqGetArticles();
    var filtered = (category === "all") ? list : list.filter(function (a) {
        return a.category === category;
    });
    if (limit) filtered = filtered.slice(0, limit);
    if (filtered.length === 0) {
        box.innerHTML = '<li class="empty-tip">暂无内容，待发布后自动显示。</li>';
        return;
    }
    var prefix = rqArticlePrefix();
    var html = "";
    filtered.forEach(function (a) {
        html +=
            '<li>' +
            '  <span class="dot"></span>' +
            '  <a class="title" href="' + prefix + rqEscape(a.file) + '" title="' + rqEscape(a.title) + '">' + rqEscape(a.title) + '</a>' +
            '  <span class="date">' + rqEscape((a.date || "").slice(5)) + '</span>' +
            '</li>';
    });
    box.innerHTML = html;
}

/* ---------- 渲染图文混排列表（首页头条/推荐） ---------- */
function rqRenderFigureList(containerId, category, limit) {
    var box = document.getElementById(containerId);
    if (!box) return;
    var list = rqGetArticles();
    var filtered = (category === "all") ? list : list.filter(function (a) {
        return a.category === category;
    });
    if (limit) filtered = filtered.slice(0, limit);
    if (filtered.length === 0) {
        box.innerHTML = '<div class="empty-tip">暂无内容，待发布后自动显示。</div>';
        return;
    }
    var prefix = rqArticlePrefix();
    var html = "";
    filtered.forEach(function (a) {
        var thumb = '';
        if (a.image) {
            thumb = '<img class="real-img" src="' + prefix + rqEscape(a.image) + '" alt="" style="width:110px;height:78px;object-fit:cover;" loading="lazy">';
        } else {
            thumb = '截图占位';
        }
        html +=
            '<div class="news-figure">' +
            '  <div class="thumb">' + thumb + '</div>' +
            '  <div class="text">' +
            '    <h3><a href="' + prefix + rqEscape(a.file) + '">' + rqEscape(a.title) + '</a></h3>' +
            '    <p>' + rqEscape(a.summary || "") + '</p>' +
            '    <div class="meta">' + rqEscape(a.date || "") + '　' + rqEscape(window.RQ_CATEGORIES[a.category] || "") + '</div>' +
            '  </div>' +
            '</div>';
    });
    box.innerHTML = html;
}

/* ---------- 渲染列表页主区（含分页占位 + 数量统计） ---------- */
function rqRenderListPage(containerId, category, pageTitle) {
    var box = document.getElementById(containerId);
    if (!box) return;
    var list = rqGetArticles();
    var filtered = (category === "all") ? list : list.filter(function (a) {
        return a.category === category;
    });
    var countEl = document.getElementById("listCount");
    if (countEl) countEl.textContent = filtered.length;

    if (filtered.length === 0) {
        box.innerHTML = '<div class="empty-tip">本栏目暂无内容，待管理员发布后自动显示。</div>';
        return;
    }
    var prefix = rqArticlePrefix();
    var html = '<ul class="news-list">';
    filtered.forEach(function (a) {
        html +=
            '<li>' +
            '  <span class="dot"></span>' +
            '  <a class="title" href="' + prefix + rqEscape(a.file) + '" title="' + rqEscape(a.title) + '">' + rqEscape(a.title) + '</a>' +
            '  <span class="date">' + rqEscape(a.date || "") + '</span>' +
            '</li>';
    });
    html += '</ul>';
    html += '<div class="pagination"><span class="current">1</span><span>共 ' + filtered.length + ' 条</span></div>';
    box.innerHTML = html;
}

/* ---------- 渲染右侧栏"最新发布"（取最新 N 条，全栏目） ---------- */
function rqRenderRightNotice(containerId, limit) {
    rqRenderNewsList(containerId, "all", limit || 6);
}

/* ---------- 渲染应用天地列表（卡片网格） ---------- */
function rqRenderAppList(containerId) {
    var box = document.getElementById(containerId);
    if (!box) return;
    var apps = window.RQ_APPS;
    if (!Array.isArray(apps) || apps.length === 0) {
        box.innerHTML = '<div class="empty-tip">暂无应用，待管理员发布后自动显示。</div>';
        return;
    }
    var countEl = document.getElementById("appCount");
    if (countEl) countEl.textContent = apps.length;
    var prefix = rqArticlePrefix();
    var html = '<div class="app-grid">';
    apps.forEach(function (app) {
        var iconHtml = '';
        if (app.icon) {
            iconHtml = '<img src="' + prefix + rqEscape(app.icon) + '" alt="' + rqEscape(app.name) + '" loading="lazy">';
        } else {
            iconHtml = '<span class="placeholder">图标<br>占位</span>';
        }
        var downloadBtn = '';
        if (app.apk) {
            downloadBtn = '<a class="app-download" href="' + prefix + rqEscape(app.apk) + '" download>下载 APK</a>';
        } else {
            downloadBtn = '<span class="app-download disabled">暂无下载</span>';
        }
        html +=
            '<div class="app-card">' +
            '  <div class="app-icon">' + iconHtml + '</div>' +
            '  <div class="app-info">' +
            '    <h3>' + rqEscape(app.name) + '</h3>' +
            '    <span class="version">' + rqEscape(app.version || "1.0.0") + '</span>' +
            '    <p class="desc">' + rqEscape(app.description || "") + '</p>' +
            '    <div class="meta-line">发布日期：' + rqEscape(app.date || "") + ' ｜ 大小：' + rqEscape(app.size || "未知") + '</div>' +
            '    ' + downloadBtn +
            '  </div>' +
            '</div>';
    });
    html += '</div>';
    box.innerHTML = html;
}

/* ---------- 渲染首页横幅大图（读取 site-config.js） ---------- */
function rqRenderBanner() {
    var banner = document.getElementById("focusBanner");
    var placeholder = document.getElementById("bannerPlaceholder");
    if (!banner) return;
    var cfg = window.RQ_SITE_CONFIG || {};
    if (cfg.bannerImage) {
        placeholder.style.display = "none";
        var img = document.createElement("img");
        img.src = cfg.bannerImage;
        img.alt = cfg.bannerAlt || "团队主视觉";
        img.style.cssText = "width:100%;height:100%;object-fit:cover;display:block;";
        img.loading = "lazy";
        banner.appendChild(img);
    }
}

/* ============================================================
   新增功能：上下篇导航（文章详情页）
   ============================================================ */
function rqRenderPrevNext() {
    var box = document.getElementById("prevNextNav");
    if (!box) return;
    var articles = rqGetArticles();
    if (articles.length === 0) return;

    // 尝试从 URL 或 meta 获取当前文章 ID
    var currentId = null;
    var metaEl = document.querySelector('meta[name="article-id"]');
    if (metaEl) currentId = metaEl.getAttribute("content");

    if (!currentId) {
        // 尝试从路径推断
        var path = location.pathname;
        var m = path.match(/articles\/([^.]+)\.html/);
        if (m) currentId = m[1];
    }

    if (!currentId) return;

    var idx = -1;
    for (var i = 0; i < articles.length; i++) {
        if (articles[i].id === currentId) { idx = i; break; }
    }
    if (idx === -1) return;

    var prefix = rqArticlePrefix();
    var prev = idx < articles.length - 1 ? articles[idx + 1] : null;
    var next = idx > 0 ? articles[idx - 1] : null;

    var html = '<div class="prev-next-nav">';
    if (prev) {
        html += '<a class="prev-link" href="' + prefix + rqEscape(prev.file) + '">';
        html += '<span class="pn-label">上一篇</span>';
        html += '<span class="pn-title">' + rqEscape(prev.title) + '</span>';
        html += '</a>';
    } else {
        html += '<span class="prev-link disabled"><span class="pn-label">上一篇</span><span class="pn-title">没有更多了</span></span>';
    }
    if (next) {
        html += '<a class="next-link" href="' + prefix + rqEscape(next.file) + '">';
        html += '<span class="pn-label">下一篇</span>';
        html += '<span class="pn-title">' + rqEscape(next.title) + '</span>';
        html += '</a>';
    } else {
        html += '<span class="next-link disabled"><span class="pn-label">下一篇</span><span class="pn-title">没有更多了</span></span>';
    }
    html += '</div>';
    box.innerHTML = html;
}

/* ============================================================
   新增功能：首页应用天地推荐
   ============================================================ */
function rqRenderAppRecommend(containerId, limit) {
    var box = document.getElementById(containerId);
    if (!box) return;
    var apps = window.RQ_APPS;
    if (!Array.isArray(apps) || apps.length === 0) {
        box.innerHTML = '<div class="empty-tip">暂无应用</div>';
        return;
    }
    var shown = apps.slice(0, limit || 3);
    var prefix = rqArticlePrefix();
    var html = '<ul class="app-recommend-list">';
    shown.forEach(function (app) {
        var iconHtml = app.icon
            ? '<img src="' + prefix + rqEscape(app.icon) + '" alt="' + rqEscape(app.name) + '" loading="lazy">'
            : '<span class="placeholder">图标</span>';
        html += '<li class="app-recommend-item">' +
            '<div class="app-rec-icon">' + iconHtml + '</div>' +
            '<div class="app-rec-info">' +
            '<h4>' + rqEscape(app.name) + '</h4>' +
            '<span class="version">' + rqEscape(app.version || "1.0") + '</span>' +
            '</div>' +
            '<a class="app-download" href="' + prefix + rqEscape(app.apk || "#") + '"' + (app.apk ? ' download' : '') + '>下载</a>' +
            '</li>';
    });
    html += '</ul>';
    box.innerHTML = html;
}

/* ============================================================
   新增功能：回到顶部按钮
   ============================================================ */
function rqInitBackToTop() {
    if (document.getElementById("backToTop")) return;
    var btn = document.createElement("div");
    btn.id = "backToTop";
    btn.className = "back-to-top";
    btn.innerHTML = "&#9650;";
    btn.title = "回到顶部";
    btn.onclick = function () {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
    document.body.appendChild(btn);

    window.addEventListener("scroll", function () {
        if (window.scrollY > 300) {
            btn.classList.add("visible");
        } else {
            btn.classList.remove("visible");
        }
    });
}

/* ============================================================
   新增功能：文章搜索（纯前端，遍历文章标题/摘要/标签）
   ============================================================ */
function rqInitSearch() {
    var input = document.getElementById("searchInput");
    var btn = document.getElementById("searchBtn");
    var results = document.getElementById("searchResults");
    if (!input || !results) return;

    function doSearch() {
        var keyword = input.value.trim().toLowerCase();
        if (keyword.length < 1) {
            results.innerHTML = "";
            results.style.display = "none";
            return;
        }
        var articles = rqGetArticles();
        var matched = articles.filter(function (a) {
            var text = ((a.title || "") + " " + (a.summary || "") + " " + (a.tags || []).join(" ")).toLowerCase();
            return text.indexOf(keyword) !== -1;
        });
        results.style.display = "block";
        if (matched.length === 0) {
            results.innerHTML = '<li class="empty-tip">未找到相关文章</li>';
            return;
        }
        var prefix = rqArticlePrefix();
        var html = "";
        matched.forEach(function (a) {
            html += '<li>' +
                '<a href="' + prefix + rqEscape(a.file) + '">' + rqEscape(a.title) + '</a>' +
                '<span class="date">' + rqEscape(a.date || "") + '</span>' +
                '</li>';
        });
        results.innerHTML = html;
    }

    if (btn) btn.onclick = doSearch;
    input.addEventListener("keydown", function (e) {
        if (e.key === "Enter") doSearch();
    });
    // 点击页面其他地方关闭搜索结果
    document.addEventListener("click", function (e) {
        if (!e.target.closest(".search-box")) {
            results.style.display = "none";
        }
    });
}

/* ============================================================
   新增功能：标签系统（渲染标签云 + 点击筛选）
   ============================================================ */
function rqRenderTags(containerId) {
    var box = document.getElementById(containerId);
    if (!box) return;
    var articles = rqGetArticles();
    var tagMap = {};
    articles.forEach(function (a) {
        var tags = a.tags || [];
        tags.forEach(function (t) {
            tagMap[t] = (tagMap[t] || 0) + 1;
        });
    });
    var keys = Object.keys(tagMap);
    if (keys.length === 0) {
        box.innerHTML = '<div class="empty-tip">暂无标签</div>';
        return;
    }
    var prefix = rqArticlePrefix();
    var html = '<div class="tag-cloud">';
    keys.forEach(function (tag) {
        html += '<a class="tag-item" href="' + prefix + 'info.html?tag=' + encodeURIComponent(tag) + '" title="' + tagMap[tag] + ' 篇文章">' + rqEscape(tag) + '</a>';
    });
    html += '</div>';
    box.innerHTML = html;
}

/* ============================================================
   新增功能：访客计数器（使用 countapi.xyz 免费服务）
   ============================================================ */
function rqInitVisitorCount() {
    var el = document.getElementById("visitorCount");
    if (!el) return;
    // 使用 countapi.xyz 的免费计数服务
    var ns = "rollingquate-site";
    var key = "visits";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api.countapi.xyz/hit/" + ns + "/" + key, true);
    xhr.timeout = 5000;
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                try {
                    var data = JSON.parse(xhr.responseText);
                    el.textContent = data.value || 0;
                } catch (e) {
                    el.textContent = "--";
                }
            } else {
                el.textContent = "--";
            }
        }
    };
    xhr.onerror = function () { el.textContent = "--"; };
    xhr.ontimeout = function () { el.textContent = "--"; };
    xhr.send();
}

/* ============================================================
   新增功能：文章目录导航（提取正文 h3 标题生成锚点目录）
   ============================================================ */
function rqRenderArticleTOC() {
    var tocBox = document.getElementById("articleTOC");
    if (!tocBox) return;
    var content = document.querySelector(".article-content");
    if (!content) return;
    var headings = content.querySelectorAll("h3");
    if (headings.length === 0) {
        tocBox.style.display = "none";
        return;
    }
    var html = '<div class="box-title"><h2>文章目录</h2></div><div class="box-body"><ul class="toc-list">';
    headings.forEach(function (h, i) {
        var anchorId = "toc-" + i;
        h.id = anchorId;
        html += '<li><a href="#' + anchorId + '">' + rqEscape(h.textContent) + '</a></li>';
    });
    html += '</ul></div>';
    tocBox.innerHTML = html;
}

/* ---------- 页面初始化（每个页面 body 末尾调用） ---------- */
function rqInit() {
    rqRenderDate();
    rqActiveNav();
    rqRenderBanner();
    rqInitBackToTop();
    rqInitSearch();
    rqInitVisitorCount();
    rqRenderPrevNext();
    rqRenderArticleTOC();
}
