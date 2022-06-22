// ==UserScript==
// @name         Dragon Training Magic
// @@name:zh     驯龙魔法
// @namespace    3BBBC94E5807338FF2A3A63A253333D049DECC00
// @version      0.1.0
// @description  Help you to raise your dragon well
// @author       syd
// @license      2022 up to now, syd All Rights Reserved
// @grant        none
// ==/UserScript==

class DragonTrainingMagic {
  constructor() {
    this.WIKI = "https://dragcave.fandom.com";
    this.COLOR = {
      Expect: "#8df103", // 寻觅中 青柠色(亮绿色)
      Normal: "#f4f4f4", // 常见种 白色
      NotNormal: "#00c4f9", // 不常见种 蓝色
      Rare: "#bf92e3", // 稀有种 紫色
      SuperRare: "#cdcd01", // 超稀有种 金色
      Other: "#8787e6", // 非龙生物 紫色
      Holiday: "#e20141", // 活动独占 红色
    };
    this.RARITY_NAME = {
      Unknown: "未知稀有度",
      Normal: "常见种",
      NotNormal: "不常见种",
      Rare: "稀有种",
      SuperRare: "超稀有种",
      Other: "非龙生物",
      Holiday: "活动独占",
    };
    this.DB = [
      {
        breed: ["Aeon Wyvern", "永恒龙"],
        egg: [
          "It’s almost like time is distorted around this egg.",
          "时间在这颗蛋周围似乎被扭曲了。",
        ],
        wiki_path: [
          "/wiki/Aeon_Wyvern",
          "/zh/wiki/%E6%B0%B8%E6%81%86%E9%BE%8D",
        ],
        rarity: "Normal",
        habitat: ["Alpine", "Forest"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "未知型态",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Aeria Gloris", "至高荣誉龙"],
        egg: [
          "This crystalline egg almost looks like you could reach into its depths.",
          "这颗结晶化的蛋似是能让你看透其内侧。",
        ],
        wiki_path: [
          "/wiki/Aeria_Gloris_Dragon",
          "/zh/wiki/%E8%87%B3%E9%AB%98%E6%A6%AE%E8%AD%BD%E9%BE%8D",
        ],
        rarity: "Normal",
        habitat: ["Alpine"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "未知型态",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Aether Wyvern", "埃忒耳龙"],
        egg: ["Wind gusts around this egg.", "风在蛋的四周呼啸。"],
        wiki_path: [
          "/wiki/Aether_Wyvern",
          "/zh/wiki/%E5%9F%83%E5%BF%92%E8%80%B3%E9%BE%8D",
        ],
        rarity: "Normal",
        habitat: ["Alpine"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "未知型态",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Albino", "白化龙"],
        egg: [
          "You can see the baby dragon curled up inside this translucent egg.",
          "你能看到龙宝宝蜷缩在这个半透明的蛋里。",
        ],
        wiki_path: [
          "/wiki/Albino_Dragon",
          "/zh/wiki/%E7%99%BD%E5%8C%96%E9%BE%8D",
        ],
        rarity: "Normal",
        habitat: ["Alpine", "Forest"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "未知型态",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Alcedine Wyvern", ""],
        egg: ["The brilliant blue spots on this egg stand out.", ""],
        wiki_path: ["/wiki/Alcedine_Wyvern", ""],
        rarity: "Normal",
        habitat: ["Alpine", "Coast", "Desert", "Forest", "Jungle", "Volcano"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "未知型态",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
    ];
  }
  getByRarity(search_rarity) {
    search_rarity = Object.keys(this.RARITY_NAME).includes(search_rarity)
      ? search_rarity
      : "Unknown";
    return this.DB.filter((dragon) => dragon.rarity === search_rarity);
  }
  getByEggDesc(desc) {
    let res = this.DB.filter((dragon) => dragon.egg[0] === desc);
    return res && res.length > 0 ? res[0] : null;
  }
}
