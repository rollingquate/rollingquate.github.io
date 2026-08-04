/* ============================================================
   RollingQuate 创作信息公示平台 - 全站公共脚本
   原生 JS 实现，不依赖任何框架
   功能：日期显示、导航高亮、文章清单渲染
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
/* articles-data.js 内嵌数据，不依赖 fetch，file:// 协议下也能正常加载 */
function rqGetArticles() {
    var arr = window.RQ_ARTICLES;
    if (!Array.isArray(arr)) return [];
    // 不二次排序，严格按清单顺序渲染：admin-generator 每次将新文章插入数组顶部，
    // 因此"列表顶部插入新文章条目"由清单顺序保证。
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
/* containerId: 容器 id；category: 栏目值，传 "all" 表示全部；limit: 最多条数 */
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
            // 真实配图
            thumb = '<img class="real-img" src="' + prefix + rqEscape(a.image) + '" alt="" style="width:110px;height:78px;object-fit:cover;">';
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
            iconHtml = '<img src="' + prefix + rqEscape(app.icon) + '" alt="' + rqEscape(app.name) + '">';
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
        banner.appendChild(img);
    }
}

/* ---------- 页面初始化（每个页面 body 末尾调用） ---------- */
function rqInit() {
    rqRenderDate();
    rqActiveNav();
    rqRenderBanner();
}
