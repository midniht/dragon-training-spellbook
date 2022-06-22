// ==UserScript==
// @name         Dragon Training Spellbook
// @@name:zh     驯龙魔典
// @namespace    3BBBC94E5807338FF2A3A63A253333D049DECC00
// @version      0.1.1
// @description  Help you to raise your dragon well
// @author       syd
// @license      2022 up to now, syd All Rights Reserved
// @match        https://dragcave.net/*
// @resource     IMPORTED_CSS https://pastebin.com/raw/yPkhNWFW
// @require      https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js
// @require      https://greasyfork.org/scripts/446851-dragon-training-magic/code/Dragon%20Training%20Magic.js?version=1063317
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_setClipboard
// ==/UserScript==

const pad = (num, length = 2) => "0".repeat(length).concat(num).slice(-length);
const now = () => {
  const t = new Date();
  return `${t.getFullYear()}-${pad(t.getMonth())}-${pad(t.getDay())} ${pad(
    t.getHours()
  )}:${pad(t.getMinutes())}:${pad(t.getSeconds())}`;
};

class DragonTrainingSpellbook extends DragonTrainingMagic {
  NAME = "驯龙魔典";
  constructor() {
    super();
    this.CFG = {
      username: "",
      wishlist: [],
    };
  }
  get wishlist() {
    return this.CFG.wishlist; //.sort();
  }
  set wishlist(value) {
    this.CFG.wishlist = value;
    this.saveConfig();
  }
  match(dragon) {
    if (
      typeof dragon === "object" &&
      Object.hasOwnProperty.call(dragon, "egg")
    ) {
      // TODO 改造为相似度判断来匹配
      for (const key in dragon) {
        if (Object.hasOwnProperty.call(dragon, key)) {
          for (const keyword of this.wishlist) {
            switch (typeof dragon[key]) {
              case "object":
                if (dragon[key].length > 0) {
                  for (const property of dragon[key]) {
                    if (property.includes(keyword)) return true;
                  }
                }
                break;
              case "string":
                if (dragon[key].includes(keyword)) {
                  return true;
                }
                break;
              default:
                console.error(typeof dragon[key], dragon[key]);
                return false;
                break;
            }
          }
        }
      }
      return false;
    } else {
      return false;
    }
  }
  log(...args) {
    console.log(`${now()} [${this.NAME}]`, ...args);
  }
  saveConfig(first_run = false) {
    try {
      SYS.set("dragon_training_spellbook", JSON.stringify(this.CFG));
    } catch (error) {
      let d = new Date();
      d.setTime(d.getTime() + 360 * 24 * 60 * 60 * 1000);
      const expires = "expires=" + d.toGMTString();
      document.cookie =
        "dragon_training_spellbook=" +
        encodeURIComponent(JSON.stringify(this.CFG)) +
        "; " +
        expires;
    }
    if (first_run) {
      this.log("配置已加载", this.CFG);
    } else {
      this.log("配置已保存", this.CFG);
    }
  }
  loadConfig() {
    let temp = {};
    try {
      temp = JSON.parse(GM_getValue("dragon_training_spellbook", "{}"));
    } catch (error) {
      let ca = document.cookie.split(";");
      for (let items of ca) {
        items = items.trim();
        if (items.indexOf("dragon_training_spellbook=") == 0) {
          temp = JSON.parse(
            decodeURIComponent(
              items.substring("dragon_training_spellbook=".length, items.length)
            )
          );
          break;
        }
      }
    }
    if (Object.keys(temp).length === 0) {
      this.CFG.wishlist = [
        "紫龙", // 紫龙 BSA 为「丰产(催产素/增加繁殖率)」
        "粉龙", // 粉龙 BSA 为「影响(可以让龙蛋性转)」注意只有蛋可以 孵出来变成幼体就不能再性转
        "永恒龙", // 永恒龙 BSA 为「预知(预测任意龙蛋/幼龙的性别)」让我康康(震声) 一般配合「影响」使用
        "红龙", // 红龙 BSA 为「加热(减少一天孵化时间/加速孵化)」
        "绿龙", // 绿龙 BSA 为「地震(拔苗助长)」4种结果 强行孵化成功 孵出来吓跑了 蛋被震碎 蛋没理你
        "闪电龙", // 闪电龙 BSA 为「眩晕(暂停龙蛋成长一天)」
        "贤龙", // 贤龙 BSA 为「传送(允许赠送或交易龙蛋)」
      ];
      this.saveConfig();
    } else {
      for (const key in temp) {
        if (Object.hasOwnProperty.call(temp, key)) {
          this.CFG[key] = temp[key];
        }
      }
      this.saveConfig(true);
    }
  }
}

const SYS = {
  set(key, value) {
    return GM_setValue(key, value);
  },
  get(key) {
    return GM_getValue(key, undefined);
  },
  remove(key) {
    return GM_deleteValue(key);
  },
  identify(path) {
    path = path.split("?"); // TODO 优化 URL 查询
    const path_map = {
      "": "主页",
      "/account": "账号页面",
      "/dragons": "仓库页面",
      "/trading": "自由贸易区（与玩家交易）",
      "/help": "帮助页面",
      "/market": "系统商城（与系统交易）",
      "/abandoned": "弃蛋区（AP）",
      "/locations/5": `${DTS.HABITAT_NAME.Alpine}（Alpine）`, // 高山
      "/locations/1": `${DTS.HABITAT_NAME.Coast}（Coast）`, // 海岸
      "/locations/2": `${DTS.HABITAT_NAME.Desert}（Desert）`, // 沙漠
      "/locations/3": `${DTS.HABITAT_NAME.Forest}（Forest）`, // 森林
      "/locations/4": `${DTS.HABITAT_NAME.Jungle}（Jungle）`, // 丛林
      "/locations/6": `${DTS.HABITAT_NAME.Volcano}（Volcano）`, // 火山
      "/dragonopedia": "图鉴页面",
    };
    if (Object.hasOwnProperty.call(path_map, path[0].replace(/\/$/g, ""))) {
      return path_map[path[0].replace(/\/$/g, "")];
    }
    return path.join("");
  },
};
let DTS = new DragonTrainingSpellbook();
// if (typeof unsafeWindow !== "undefined") {
//   unsafeWindow.DTS = DTS;
// } else {
//   console.log("unsafeWindow API not available. Try to inject into window.DTS");
//   window.wishlist = DTS.wishlist;
// }
let MenuCommandID = [];
const Path = window.location.href.replace("https://dragcave.net", "");
const Username =
  document.querySelector("._3o_3").innerText.indexOf("Not logged in") == -1
    ? document.querySelector("._3o_3 > a").innerText
    : undefined;

const initScript = () => {
  DTS.loadConfig();
  if (Username !== DTS.CFG.username) {
    DTS.CFG.username = Username;
    DTS.saveConfig();
  }

  // 注册菜单
  MenuCommandID = [
    GM_registerMenuCommand(
      Username === undefined ? "请先登录" : `已作为 ${Username} 登录`,
      () => {
        if (Username === undefined) {
          window.location.href = "/login";
        } else {
          DTS.log(`已登录成功 当前用户为 ${Username}`);
        }
      },
      "L"
    ),
    GM_registerMenuCommand(
      "查看仓库里的龙蛋 / 幼体 / 成体",
      () => {
        window.location.href = "/dragons";
      },
      "I"
    ),
    GM_registerMenuCommand(
      "去 Cave(野外洞穴) 蹲 CB(Cave Born 原生种)",
      () => {
        window.location.href = `/locations/${parseInt(
          Math.random() * 6 + 1,
          10
        )}`;
      },
      "C"
    ),
    GM_registerMenuCommand(
      "去 AP(Abandoned Page 弃蛋区) 摸奖",
      () => {
        window.location.href = "/abandoned";
      },
      "A"
    ),
    GM_registerMenuCommand(
      "自动摸蛋",
      () => {
        alert("TODO [自动摸蛋] 功能尚未完成 敬请期待");
      },
      "Q"
    ),
  ];

  // 加载字体
  WebFont.load({
    google: {
      families: ["Noto Sans SC:400"],
    },
  });
  GM_addStyle(GM_getResourceText("IMPORTED_CSS"));

  // 渲染左侧卡片
  let left_card_node = document.createElement("div");
  left_card_node.setAttribute("class", "dts-left-card-container");
  document.body.append(left_card_node);
  let left_card = document.createElement("div");
  left_card.setAttribute("class", "dts-left-card");
  left_card_node.append(left_card);
  // 渲染左侧标题
  let left_card_title = document.createElement("div");
  left_card_title.setAttribute("class", "dts-left-card-title");
  left_card_title.innerText = "《驯龙魔典》散发着辉光";
  left_card.append(left_card_title);
  // 渲染稀有度统计
  let creatureCounter = {};
  for (const key in DTS.RARITY_NAME) {
    if (Object.hasOwnProperty.call(DTS.RARITY_NAME, key)) {
      creatureCounter[key] = 0;
    }
  }
  DTS.DB.forEach((dragon) => {
    if (Object.hasOwnProperty.call(creatureCounter, dragon.rarity)) {
      creatureCounter[dragon.rarity] += 1;
    }
  });
  let rarity_tips = "";
  for (const kind in creatureCounter) {
    if (Object.hasOwnProperty.call(creatureCounter, kind)) {
      rarity_tips += `✔ <span style="color: ${DTS.COLOR[kind]}">${DTS.RARITY_NAME[kind]}</span> ${creatureCounter[kind]} 种<br>`;
    }
  }
  let subTitle = document.createElement("div");
  subTitle.innerHTML = `当前收录了 ${DTS.DB.length} 种神奇生物：<br>${rarity_tips}`;
  subTitle.style.cssText = "margin: 1rem 0;";
  left_card.append(subTitle);
  // 渲染左侧正文
  let content = document.createElement("div");
  left_card.append(content);
  // 渲染愿望单
  let wishlist_node = document.createElement("div");
  wishlist_node.innerHTML = '<span style="font-size: 125%;">愿望单</span>';
  wishlist_node.innerHTML += ` (<span id="wishlist_count">${DTS.wishlist.length}</span>)<br>`;
  for (const keyword of DTS.wishlist) {
    wishlist_node.innerHTML += `<span class="wishlist-item">${keyword}</span><br>`;
  }
  wishlist_node.style.cssText = `margin-bottom: 1rem; color: ${DTS.COLOR.Expect}`;
  wishlist_node.onclick = (event) => {
    if (event.target.className == "wishlist-item") {
      const delete_keyword = event.target.innerHTML;
      event.target.parentElement.removeChild(event.target.nextSibling);
      event.target.parentElement.removeChild(event.target);
      wishlist_node.querySelector("#wishlist_count").innerHTML = String(
        parseInt(wishlist_node.querySelector("#wishlist_count").innerHTML) - 1
      );
      DTS.wishlist.splice(DTS.wishlist.indexOf(delete_keyword), 1);
      DTS.saveConfig();
    }
  };
  content.append(wishlist_node);
  // 渲染输入框
  let input_node = document.createElement("div");
  input_node.setAttribute("class", "input-group");
  input_node.innerHTML = `
  <input type="input" class="input" id="wishlist-input" name="wishlist-input" placeholder="与龙蛋相关的关键词" autocomplete="off">
  <input id="add-to-wishlist" value="加入愿望单" type="submit">`;
  input_node
    .querySelector("#wishlist-input")
    .addEventListener("keypress", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        document.getElementById("add-to-wishlist").click();
      }
    });
  input_node.onclick = (event) => {
    if (event.target.id == "add-to-wishlist") {
      const expect_keyword = input_node.querySelector("#wishlist-input").value;
      input_node.querySelector("#wishlist-input").value = "";
      if (!DTS.wishlist.includes(expect_keyword)) {
        wishlist_node.innerHTML += `<span class="wishlist-item">${expect_keyword}</span><br>`;
        wishlist_node.querySelector("#wishlist_count").innerHTML = String(
          parseInt(wishlist_node.querySelector("#wishlist_count").innerHTML) + 1
        );
        DTS.wishlist.push(expect_keyword);
        DTS.saveConfig();
      }
    }
  };
  content.append(input_node);

  // 渲染右侧卡片
  let right_card_node = document.createElement("div");
  right_card_node.setAttribute("class", "dts-right-card-container");
  document.body.append(right_card_node);
  let right_card = document.createElement("div");
  right_card.setAttribute("class", "dts-right-card");
  right_card.innerHTML = `<div class="dts-right-card-content">
当前位于<br><b>${SYS.identify(Path)}</b><br><br>
<a href="${
    DTS.WIKI
  }/wiki/Egg/Identification_guide" target="_blank">英文龙蛋清单</a><br>
<a href="${
    DTS.WIKI
  }/zh/wiki/%E9%BE%8D%E8%9B%8B%E7%A8%AE%E9%A1%9E" target="_blank">中文龙蛋清单（有缺漏）</a><br><br>
孵化场<br>
<a href="https://dc.evinext.com/" target="_blank">DragHatch</a></div>`;
  right_card_node.append(right_card);

  if (Path.indexOf("/locations/") === 0) {
    document.querySelectorAll(".eggs > div").forEach((egg_node) => {
      let link = egg_node.querySelector("a");
      let img = egg_node.querySelector("a > img");
      let desc = egg_node.querySelector("span");
      let dragon = DTS.getByEggDesc(desc.innerText);
      // TODO 替换未知的龙蛋图片 img.src = link.href.replace("get", "image");
      // 渲染龙蛋的种群
      let egg_title_node = document.createElement("div");
      egg_title_node.setAttribute("class", "cb-egg-title");
      egg_title_node.style.backgroundColor = DTS.COLOR[dragon.rarity]; // 稀有度高亮显示
      egg_node.insertBefore(egg_title_node, link);
      // 添加英文名
      let egg_breed_en = document.createElement("a");
      egg_breed_en.href = `${DTS.WIKI}${dragon.wiki_path[0]}`;
      egg_breed_en.target = "_blank";
      egg_breed_en.innerHTML = `<b>${dragon.breed[0]}</b>`;
      //egg_breed_en.style.color = DTS.COLOR[dragon.rarity]; // 另一种高亮方案 染色文本 可以考虑加阴影
      egg_breed_en.style.fontSize = "120%";
      egg_title_node.appendChild(egg_breed_en);
      // 添加中文名
      egg_title_node.appendChild(document.createElement("br"));
      if (dragon.breed[1] !== "") {
        let egg_breed_zh = document.createElement("a");
        egg_breed_zh.style.marginRight = "1rem";
        if (dragon.wiki_path[1] === "") {
          egg_breed_zh.setAttribute("class", "no-href"); // 只有中文名 没有对应的中文 wiki 条目
        } else {
          egg_breed_zh.href = `${DTS.WIKI}${dragon.wiki_path[1]}`; // 有中文 wiki 条目
          egg_breed_zh.target = "_blank";
        }
        egg_breed_zh.innerHTML = `${dragon.breed[1]}`;
        egg_title_node.appendChild(egg_breed_zh);
      }
      // 获取龙蛋代码
      const egg_code = link.href
        .replace("https://dragcave.net/get/", "")
        .replace("/", "");
      let egg_code_node = document.createElement("a");
      egg_code_node.href = link.href.replace("get", "view");
      egg_code_node.target = "_blank";
      egg_code_node.innerHTML = `<i>${egg_code}</i>`;
      egg_code_node.style.fontSize = "80%";
      egg_code_node.setAttribute("class", "no-href"); // TODO 大部分时候无法预览 暂时禁止点击
      egg_title_node.appendChild(egg_code_node);
      if (DTS.match(dragon)) {
        egg_node.style.backgroundColor = DTS.COLOR.Expect;
      }
      img.title = egg_code; // 龙蛋图片/链接 mouseover 信息
      desc.innerHTML += `<br>${dragon.egg[1]}`; // 翻译龙蛋描述
      DTS.log("检测到龙蛋", egg_code, dragon);
    });
  } else if (Path.indexOf("/abandoned") === 0) {
    document.querySelectorAll(".ap > div").forEach((egg_node) => {
      let dragon = {
        // TODO mock 数据
        breed: ["Test", ""],
        egg: [
          "This crystalline egg almost looks like you could reach into its depths.",
          "这颗结晶化的蛋似是能让你看透其内侧。",
        ],
        wiki_path: ["/wiki/Egg/Identification_guide", ""],
        rarity: "Normal",
        habitat: ["Alpine"],
        bsa: "种族特性技能",
        elemental: ["元素亲和", "元素亲和"],
        morphology: "形态",
        release_at: "更新时间",
        sprites: {
          egg: [""],
          adult: [""],
        },
      };
      let link = egg_node.querySelector("a");
      let img = egg_node.querySelector("a > img");
      // 渲染龙蛋的种群
      // 添加英文名
      let egg_breed_en = document.createElement("a");
      egg_breed_en.href = `${DTS.WIKI}${dragon.wiki_path[0]}`;
      egg_breed_en.target = "_blank";
      egg_breed_en.innerHTML = `<b>${dragon.breed[0]}</b>`;
      egg_breed_en.style.backgroundColor = DTS.COLOR[dragon.rarity]; // 稀有度高亮显示
      egg_breed_en.style.marginTop = "1.5rem";
      egg_breed_en.style.width = "100%";
      egg_breed_en.style.height = "auto";
      egg_node.insertBefore(egg_breed_en, link);
      // 添加中文名
      // TODO 根据图像识别龙蛋
      dragon.breed[1] = `${img.src.replace(
        "https://dragcave.net/images/",
        ""
      )}`;
      if (dragon.breed[1] !== "") {
        let egg_breed_zh = document.createElement("a");
        if (dragon.wiki_path[1] === "") {
          egg_breed_zh.setAttribute("class", "no-href"); // 只有中文名 没有对应的中文 wiki 条目
        } else {
          egg_breed_zh.href = `${DTS.WIKI}${dragon.wiki_path[1]}`; // 有中文 wiki 条目
          egg_breed_zh.target = "_blank";
        }
        egg_breed_zh.innerHTML = `${dragon.breed[1]}`;
        egg_breed_zh.style.backgroundColor = DTS.COLOR[dragon.rarity]; // 稀有度高亮显示
        egg_breed_zh.style.width = "100%";
        egg_breed_zh.style.height = "auto";
        egg_node.insertBefore(egg_breed_zh, link);
      }
      // 获取龙蛋代码
      const egg_code = link.href
        .replace("https://dragcave.net/abandoned/", "")
        .replace("/", "");
      let egg_code_node = document.createElement("a");
      egg_code_node.href = link.href.replace("get", "view");
      egg_code_node.target = "_blank";
      egg_code_node.innerHTML = `<i>${egg_code}</i>`;
      egg_code_node.style.fontSize = "70%";
      egg_code_node.setAttribute("class", "no-href"); // TODO 大部分时候无法预览 暂时禁止点击
      egg_code_node.style.backgroundColor = DTS.COLOR[dragon.rarity]; // 稀有度高亮显示
      egg_code_node.style.width = "100%";
      egg_code_node.style.height = "auto";
      egg_node.insertBefore(egg_code_node, link);
      if (DTS.match(dragon)) {
        egg_node.style.backgroundColor = DTS.COLOR.Expect;
      }
      img.title = egg_code; // 龙蛋图片/链接 mouseover 信息
    });
  }

  DTS.log("初始化完成 当前位于", SYS.identify(Path));
};

const DebugScript = () => {
  // TODO 发布时删掉
  //SYS.remove("dragon_training_spellbook");
  //console.log("[DEBUG]", GM_listValues(), MenuCommandID);
  //GM.setClipboard("Clear Clipboard");
  DTS.log(DTS);
};

(function () {
  "use strict";

  DTS.log("魔典飘浮到半空中，伴随耀眼的光芒缓缓转动。");
  initScript();
  DebugScript();
  DTS.log("魔典光芒渐弱，并逐渐变得静止。");
})();
