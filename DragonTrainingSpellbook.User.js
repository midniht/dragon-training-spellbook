// ==UserScript==
// @name         驯龙魔典
// @namespace    https://abyss.sbs/home.php?mod=space&uid=33917
// @version      0.1.0
// @description  Dragon Cave 龙蛋提醒小助手
// @author       syd
// @match        https://dragcave.net/locations/*
// @match        https://dragcave.net/abandoned
// @icon         https://dragcave.net/favicon.ico
// @require      https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js
// ==/UserScript==

(function () {
  "use strict";

  //================================================================
  // 自定义愿望单 (想要蹲守的龙)
  // 可以匹配任何关键词: 中/英种群名 中/英龙蛋描述 等等
  //================================================================
  const Wishlist = [
    // 新手必备
    "Red", // 红龙 BSA 为「加热(减少一天孵化时间/加速孵化)」
    "Green", // 绿龙 BSA 为「地震(拔苗助长)」4种结果 强行孵化成功 孵出来吓跑了 蛋被震碎 蛋没理你
    "Pink", // 粉龙 BSA 为「影响(可以让龙蛋性转)」注意只有蛋可以 孵出来变成幼体就不能再性转
    "Aeon Wyvern", // 永恒龙 BSA 为「预知(预测任意龙蛋/幼龙的性别)」让我康康(震声) 一般配合「影响」使用
    "Purple", // 紫龙 BSA 为「丰产(催产素/增加繁殖率)」
    "Bolt", // 闪电龙 BSA 为「眩晕(暂停龙蛋成长一天)」
    "Magi", // 贤龙 BSA 为「传送(允许赠送或交易龙蛋)」
    // 你在正在蹲守的龙
    "起司龙",
    "纸龙",
    "This egg is much smaller than the others.", // 鸡
    "This egg looks like it doesn't belong", // 恐龙
  ];

  //================================================================
  // 请勿改动以下代码
  //================================================================

  WebFont.load({
    google: {
      families: ["Noto Sans SC:400"],
    },
  });

  class DragonTrainingSpellbook {
    // 神奇的《驯龙魔典》
    WikiURL = "https://dragcave.fandom.com";
    RarityName = {
      未知稀有度: "未知稀有度",
      Normal: "常见种",
      NotNormal: "不常见种",
      Rare: "稀有种",
      SuperRare: "超稀有种",
      Other: "非龙生物",
      Holiday: "活动独占",
    };
    Color = {
      Expect: "#8df103", // 寻觅中 青柠色(亮绿色)
      Normal: "#f4f4f4", // 常见种 白色
      NotNormal: "#00c4f9", // 不常见种 蓝色
      Rare: "#bf92e3", // 稀有种 紫色
      SuperRare: "#cdcd01", // 超稀有种 金色
      Other: "#8787e6", // 非龙生物 紫色
      Holiday: "#e20141", // 活动独占 红色
    };
    DragonDataBase = [
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
      {
        breed: ["Almerald", "祖姆绿龙"],
        egg: [
          "This glossy green egg is rather warm.",
          "这颗光滑的绿蛋挺温暖的。",
        ],
        wiki_path: [
          "/wiki/Almerald_Dragon",
          "/zh/wiki/%E7%A5%96%E5%A7%86%E7%B6%A0%E9%BE%8D",
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
        breed: ["Amalthean", ""],
        egg: ["This pristine egg sits in a clear pool of water.", ""],
        wiki_path: ["/wiki/Amalthean_Dragon", ""],
        rarity: "SuperRare",
        habitat: [],
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
        breed: ["Anagallis", "海绿龙"],
        egg: [
          "This delicately patterned egg is sitting in the sunshine.",
          "这颗图案精致的蛋躺在阳光下。",
        ],
        wiki_path: ["/wiki/Anagallis_Dragon", ""],
        rarity: "Normal",
        habitat: ["Desert", "Forest", "Jungle"],
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
        breed: ["Antarean", "安塔林龙"],
        egg: [
          "This egg is surrounded by mysterious, reflective dust.",
          "这颗蛋被神秘的反光尘埃环绕著。",
        ],
        wiki_path: [
          "/wiki/Antarean_Dragon",
          "/zh/wiki/%E5%AE%89%E5%A1%94%E6%9E%97%E9%BE%8D",
        ],
        rarity: "Normal",
        habitat: ["Desert"],
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
        breed: ["Aqualis", "水利司龙"],
        egg: [
          "This drab egg rests far from the water’s edge.",
          "这颗蓝灰色的蛋离水边有一段距离。",
        ],
        wiki_path: [
          "/wiki/Aqualis_Dragon",
          "/zh/wiki/%E6%B0%B4%E5%88%A9%E5%8F%B8%E9%BE%8D",
        ],
        rarity: "Normal",
        habitat: ["Coast"],
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
        breed: ["Aranoa", "艾拉诺亚龙"],
        egg: [
          "The vibrant scales on this egg glisten in the sunlight",
          "这颗蛋的鳞片在阳光下闪闪发光。",
        ],
        wiki_path: [
          "/wiki/Aranoa_Dragon",
          "/zh/wiki/%E8%89%BE%E6%8B%89%E8%AB%BE%E4%BA%9E%E9%BE%8D",
        ],
        rarity: "Normal",
        habitat: ["Coast", "Jungle"],
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
        breed: ["Aria", "咏叹龙"],
        egg: [
          "This bright egg has a warm shell.",
          "这颗明亮的蛋有著温暖的壳。",
        ],
        wiki_path: ["/wiki/Aria_Dragon", ""],
        rarity: "Normal",
        habitat: ["Jungle"],
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
        breed: ["Astralophyne", ""],
        egg: [
          "This pleasant egg was placed in the path of a refreshing breeze.",
          "",
        ],
        wiki_path: ["/wiki/Astralophyne_Dragon", ""],
        rarity: "未知稀有度",
        habitat: ["Forest"],
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
        breed: ["Ash", "阴灰龙"],
        egg: [
          "This ashen egg is smooth to the touch.",
          "这颗阴灰的蛋触感光滑。",
        ],
        wiki_path: ["/wiki/Ash_Dragon", "/zh/wiki/%E9%99%B0%E7%81%B0%E9%BE%8D"],
        rarity: "Normal",
        habitat: ["Forest", "Volcano"],
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
        breed: ["Astaarus", ""],
        egg: ["This egg reminds you of the night sky.", ""],
        wiki_path: ["/wiki/Astaarus_Dragon", ""],
        rarity: "未知稀有度",
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
        breed: ["Avatar of Change", "变化的化身"],
        egg: [
          "This iridescent egg radiates mysterious energy.",
          "这颗有著闪亮虹彩的蛋散发出神秘的能量。",
        ],
        wiki_path: [
          "/wiki/Avatar_of_Change",
          "/zh/wiki/%E8%AE%8A%E5%8C%96%E7%9A%84%E5%8C%96%E8%BA%AB",
        ],
        rarity: "SuperRare",
        habitat: [],
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
        breed: ["Avatar of Creation", "创造的化身"],
        egg: [
          "This shimmering egg radiates primordial energy.",
          "这颗闪烁微光的蛋散发出原始的能量。",
        ],
        wiki_path: [
          "/wiki/Avatar_of_Creation",
          "/zh/wiki/%E5%89%B5%E9%80%A0%E7%9A%84%E5%8C%96%E8%BA%AB",
        ],
        rarity: "SuperRare",
        habitat: [],
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
        breed: ["Avatar of Destruction", "毁灭的化身"],
        egg: [
          "This smoldering egg radiates volatile energy.",
          "这颗焖烧的蛋散释放着不稳定的能量。",
        ],
        wiki_path: [
          "/wiki/Avatar_of_Destruction",
          "/zh/wiki/%E6%AF%80%E6%BB%85%E7%9A%84%E5%8C%96%E8%BA%AB",
        ],
        rarity: "SuperRare",
        habitat: [],
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
        breed: ["Azure Glacewing", "苍冰翅龙"],
        egg: [
          "This large egg has a lustrous sheen and appears to be covered in scales.",
          "这是颗散发著光泽且布满麟片的大蛋。",
        ],
        wiki_path: [
          "/wiki/Azure_Glacewing_Dragon",
          "/zh/wiki/%E8%92%BC%E5%86%B0%E7%BF%85%E9%BE%8D",
        ],
        rarity: "Normal",
        habitat: ["Forest"],
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
        breed: ["Balloon", "气球龙"],
        egg: [
          "This light egg is floating in the air.",
          "这颗轻飘飘的蛋浮在空中。",
        ],
        wiki_path: ["/wiki/Balloon_Dragon", ""],
        rarity: "Normal",
        habitat: ["Alpine", "Coast", "Forest", "Jungle"],
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
        breed: ["Black", "黑龙"],
        egg: [
          "This egg has a faint green glow around it.",
          "这颗蛋周围有淡淡的绿色光晕。",
        ],
        wiki_path: ["/wiki/Black_Dragon", "/zh/wiki/%E9%BB%91%E9%BE%8D"],
        rarity: "SuperRare",
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
      {
        breed: ["Black Capped Teimarr", "黑帽泰马尔龙"],
        egg: ["This egg has a black cap.", "这颗蛋有一个黑尖儿。"],
        wiki_path: ["/wiki/Black_Capped_Teimarr", ""],
        rarity: "Normal",
        habitat: ["Coast"],
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
        breed: ["Black Tea", "红茶龙"],
        egg: [
          "This egg has a faintly exotic scent.",
          "这颗蛋有种淡淡的异国情调的香味儿。",
        ],
        wiki_path: ["/wiki/Black_Tea_Dragon", ""],
        rarity: "Normal",
        habitat: ["Desert"],
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
        breed: ["Black Truffle", "黑松露龙"],
        egg: [
          "This egg has a pleasant, musky smell.",
          "这蛋带有一股令人愉悦的麝香味。",
        ],
        wiki_path: [
          "/wiki/Black_Truffle_Dragon",
          "/zh/wiki/%E9%BB%91%E6%9D%BE%E9%9C%B2%E9%BE%8D",
        ],
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
      {
        breed: ["Blacktip", "黑鳍龙"],
        egg: [
          "This egg is off-white in color and smells a bit like salt.",
          "这颗蛋是灰白色的，闻起来有些像盐。",
        ],
        wiki_path: ["/wiki/Blacktip_Dragon", ""],
        rarity: "Normal",
        habitat: ["Coast"],
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
        breed: ["Blazeback", ""],
        egg: [
          "This egg has a dull metallic luster and is hot to the touch.",
          "",
        ],
        wiki_path: ["/wiki/Blazeback_Dragon", ""],
        rarity: "未知稀有度",
        habitat: ["Volcano"],
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
        breed: ["Bleeding Moon", "血月龙"],
        egg: [
          "This egg shines brilliantly in moonlight, and is covered in red spots.",
          "这颗被红斑覆盖的蛋在月光下闪耀。",
        ],
        wiki_path: [
          "/wiki/Bleeding_Moon_Dragon",
          "/zh/wiki/%E8%A1%80%E6%9C%88%E9%BE%8D",
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
        breed: ["Blue-Banded", "蓝纹龙"],
        egg: [
          "This egg is covered in thick blue stripes.",
          "这颗蛋上有密集的蓝色条纹。",
        ],
        wiki_path: ["/wiki/Blue-Banded_Dragon", ""],
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
        breed: ["Blusang Lindwyrm", "蓝桑鳞龙"],
        egg: [
          "This egg smells faintly like brine.",
          "这颗蛋闻起来有点儿像海水。",
        ],
        wiki_path: ["/wiki/Blusang_Lindwyrm", ""],
        rarity: "Rare",
        habitat: ["Coast"],
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
        breed: ["Bolt", "闪电龙"],
        egg: ["This egg has a striking pattern.", "这蛋有著引人注目的花纹。"],
        wiki_path: [
          "/wiki/Bolt_Dragon",
          "/zh/wiki/%E9%96%83%E9%9B%BB%E9%BE%8D",
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
        breed: ["Boreal", "北方极龙"],
        egg: [
          "This egg is covered in pale blue spots.",
          "这颗蛋满布亮蓝色的斑点。",
        ],
        wiki_path: [
          "/wiki/Boreal_Dragon",
          "/zh/wiki/%E5%8C%97%E6%96%B9%E6%A5%B5%E9%BE%8D",
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
        breed: ["Bright-Breasted Wyvern", "鲜胸纹翼龙"],
        egg: ["This egg is covered in speckles.", "这颗蛋覆盖在斑点下。"],
        wiki_path: ["/wiki/Bright-Breasted_Wyvern", ""],
        rarity: "Normal",
        habitat: ["Jungle"],
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
        breed: ["Brimstone", "硫磺龙"],
        egg: ["This egg smells rather rancid.", "这颗蛋闻起来颇为腐臭。"],
        wiki_path: [
          "/wiki/Brimstone_Dragon",
          "/zh/wiki/%E7%A1%AB%E7%A3%BA%E9%BE%8D",
        ],
        rarity: "Normal",
        habitat: ["Desert", "Volcano"],
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
        breed: ["Brute", "狂龙"],
        egg: ["This egg is unusually large and heavy.", "这颗蛋又大又重。"],
        wiki_path: ["/wiki/Brute_Dragon", "/zh/wiki/%E7%8B%82%E9%BE%8D"],
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
        breed: ["Candelabra", "枝状烛台龙"],
        egg: [
          "This mottled red egg almost glows from within.",
          "这颗斑驳的红蛋似乎自内而外散发著光。",
        ],
        wiki_path: [
          "/wiki/Candelabra_Dragon",
          "/zh/wiki/%E6%9E%9D%E7%8B%80%E7%87%AD%E8%87%BA%E9%BE%8D",
        ],
        rarity: "Normal",
        habitat: ["Coast", "Jungle"],
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
        breed: ["Canopy", "林冠龙"],
        egg: ["This egg is hidden by some leaves.", "这颗蛋隐藏在叶子里。"],
        wiki_path: ["/wiki/Canopy_Dragon", ""],
        rarity: "Normal",
        habitat: ["Jungle"],
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
        breed: ["Cantormaris Dragon", ""],
        egg: ["Something about this egg seems to lure you in.", ""],
        wiki_path: ["/wiki/Cantormaris_Dragon", ""],
        rarity: "未知稀有度",
        habitat: ["Coast", "Jungle", "Volcano"],
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
        breed: ["Carina", "船底座龙"],
        egg: [
          "This egg shimmers with dazzling constellations.",
          "这蛋闪著耀眼的星座图案。",
        ],
        wiki_path: [
          "/wiki/Carina_Dragon",
          "/zh/wiki/%E8%88%B9%E5%BA%95%E5%BA%A7%E9%BE%8D",
        ],
        rarity: "SuperRare",
        habitat: [],
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
        breed: ["Carmine Wyvern", "胭脂红翼龙"],
        egg: [
          "This pink and red egg wobbles occasionally.",
          "这颗粉红相间的蛋时不时会摇晃。",
        ],
        wiki_path: ["/wiki/Carmine_Wyvern", ""],
        rarity: "Normal",
        habitat: ["Jungle"],
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
        breed: ["Cassare", "撤魔龙"],
        egg: [
          "This egg makes you feel a bit uneasy.",
          "这颗蛋让你感到有些不安。",
        ],
        wiki_path: ["/wiki/Cassare_Dragon", ""],
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
      {
        breed: ["Celestial", "天龙"],
        egg: [
          "This translucent egg shines like starlight.",
          "这颗通透的蛋散发出如星辰的光芒。",
        ],
        wiki_path: ["/wiki/Celestial_Dragon", "/zh/wiki/%E5%A4%A9%E9%BE%8D"],
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
      {
        breed: ["Cloudplume", ""],
        egg: ["This soft egg was carefully nestled in feathers and snow.", ""],
        wiki_path: ["/wiki/Cloudplume_Dragon", ""],
        rarity: "未知稀有度",
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
        breed: ["Coastal Waverunner", "海岸浪奔龙"],
        egg: ["This egg reminds you of the sea.", "这颗蛋令你想起海洋。"],
        wiki_path: ["/wiki/Coastal_Waverunner", ""],
        rarity: "Normal",
        habitat: ["Coast"],
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
        breed: ["Copper", "铜龙"],
        egg: [
          "This egg gleams with a reddish shine.",
          "这颗蛋闪耀著淡红的光芒。",
        ],
        wiki_path: ["/wiki/Copper_Dragon", ""],
        rarity: "SuperRare",
        habitat: ["Desert", "Volcano"],
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
        breed: ["Crystalline", "结晶龙"],
        egg: [
          "This icy egg sparkles with frost.",
          "这颗结冰的蛋因霜而闪闪发光。",
        ],
        wiki_path: [
          "/wiki/Crystalline_Dragon",
          "/zh/wiki/%E7%B5%90%E6%99%B6%E9%BE%8D",
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
        breed: ["Dark Green", "深绿龙"],
        egg: [
          "This egg is sitting in a patch of grass and small flowers even though there’s no sun in the cave.",
          "这颗蛋位于一片草与小花中，尽管洞穴里没有阳光。",
        ],
        wiki_path: ["/wiki/Dark_Green_Dragon", ""],
        rarity: "SuperRare",
        habitat: ["Forest", "Jungle"],
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
        breed: ["Dark Lumina", "黑暗绚光龙"],
        egg: [
          "This egg shines coldly in the moonlight.",
          "这颗蛋在月光下冷冷地发著光。",
        ],
        wiki_path: [
          "/wiki/Dark_Lumina_Dragon",
          "/zh/wiki/%E9%BB%91%E6%9A%97%E7%B5%A2%E5%85%89%E9%BE%8D",
        ],
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
      {
        breed: ["Daydream", "空想龙"],
        egg: ["This egg is sitting on a cloud.", "这颗蛋坐在云彩上。"],
        wiki_path: ["/wiki/Daydream_Dragon", ""],
        rarity: "Normal",
        habitat: ["Coast", "Forest", "Jungle"],
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
        breed: ["Deep Sea", "深海龙"],
        egg: [
          "This egg appears to be covered in scales.",
          "这颗蛋似乎覆着鳞。",
        ],
        wiki_path: [
          "/wiki/Deep_Sea_Dragon",
          "/zh/wiki/%E6%B7%B1%E6%B5%B7%E9%BE%8D",
        ],
        rarity: "Normal",
        habitat: ["Coast"],
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
        breed: ["Diamondwing", "钻翼龙"],
        egg: ["This egg shines like a diamond.", "这蛋如钻石般闪亮。"],
        wiki_path: [
          "/wiki/Diamondwing_Dragon",
          "/zh/wiki/%E9%91%BD%E7%BF%BC%E9%BE%8D",
        ],
        rarity: "Normal",
        habitat: ["Alpine", "Volcano"],
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
        breed: ["Dorsal", "脊背龙"],
        egg: [
          "This egg has multiple bands of color on it.",
          "这颗蛋上有多重颜色排列。",
        ],
        wiki_path: ["/wiki/Dorsal_Dragon", ""],
        rarity: "Normal",
        habitat: ["Jungle"],
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
        breed: ["Electric", "电光龙"],
        egg: [
          "Bright sparks glide across the surface of this egg’s shell.",
          "",
        ],
        wiki_path: ["/wiki/Electric_Dragon", ""],
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
        breed: ["Elux Lucis", ""],
        egg: ["Starlight shimmers across this egg’s iridescent shell.", ""],
        wiki_path: ["/wiki/Elux_Lucis_Dragon", ""],
        rarity: "未知稀有度",
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
        breed: ["Ember", "馀焰龙"],
        egg: ["This egg is really hot.", "这颗蛋真的很烫。"],
        wiki_path: [
          "/wiki/Ember_Dragon",
          "/zh/wiki/%E9%A4%98%E7%87%84%E9%BE%8D",
        ],
        rarity: "Normal",
        habitat: ["Volcano"],
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
        breed: ["Equinox", ""],
        egg: ["This egg shakes slightly when taken out of the light.", ""],
        wiki_path: ["/wiki/Equinox_Dragon", ""],
        rarity: "未知稀有度",
        habitat: ["Forest", "Volcano", "Jungle", "Alpine"],
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
        breed: ["Fanalea", ""],
        egg: ["This egg has delicate markings that curl around its shell.", ""],
        wiki_path: ["/wiki/Fanalea_Dragon", ""],
        rarity: "未知稀有度",
        habitat: ["Jungle"],
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
        breed: ["Falconiform Wyvern", "隼形翼龙"],
        egg: [
          "Cold flames dance across the surface of this egg.",
          "冰冷的火焰跳跃在这颗蛋的表面上。",
        ],
        wiki_path: [
          "/wiki/Falconiform_Wyvern",
          "/zh/wiki/%E9%9A%BC%E5%BD%A2%E7%BF%BC%E9%BE%8D",
        ],
        rarity: "Normal",
        habitat: ["Volcano"],
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
        breed: ["Fell", "猛龙"],
        egg: [
          "This mottled egg looks positively ancient.",
          "这颗斑驳的蛋看起来相当古老。",
        ],
        wiki_path: ["/wiki/Fell_Dragon", "/zh/wiki/%E7%8C%9B%E9%BE%8D"],
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
      {
        breed: ["Fever Wyvern", "热病翼龙"],
        egg: [
          "This egg is patterned with an orange flare.",
          "这颗蛋上有橘色的火焰纹样。",
        ],
        wiki_path: ["/wiki/Fever_Wyvern", ""],
        rarity: "Normal",
        habitat: ["Jungle"],
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
        breed: ["Fire Gem", "火晶龙"],
        egg: [
          "This rough egg has shimmering veins of crystal running across its surface.",
          "这粗糙蛋的表面爬满发著光的水晶脉。",
        ],
        wiki_path: [
          "/wiki/Fire_Gem_Dragon",
          "/zh/wiki/%E7%81%AB%E6%99%B6%E9%BE%8D",
        ],
        rarity: "未知稀有度",
        habitat: ["Volcano"],
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
        breed: ["Flamingo Wyvern", "火烈翼龙"],
        egg: ["It’s bright. And pink.", "它是明亮的。而且是粉色的。"],
        wiki_path: ["/wiki/Flamingo_Wyvern", ""],
        rarity: "Normal",
        habitat: ["Coast", "Jungle"],
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
        breed: ["Iris Floret Wyvern", "小花双足翼龙"],
        egg: [
          "This shiny egg smells faintly like flowers.",
          "这颗明亮的蛋带有些许花香。",
        ],
        wiki_path: [
          "/wiki/Floret_Wyvern_(Iris)",
          "/zh/wiki/%E5%B0%8F%E8%8A%B1%E9%9B%99%E8%B6%B3%E7%BF%BC%E9%BE%8D",
        ],
        rarity: "未知稀有度",
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
        breed: ["Floret Wyvern (Alstroemeria)", ""],
        egg: ["This shiny egg smells faintly like flowers.", ""],
        wiki_path: ["/wiki/Floret_Wyvern_(Alstroemeria)", ""],
        rarity: "未知稀有度",
        habitat: [],
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
        breed: ["Freckled", "雀斑龙"],
        egg: [
          "This egg is yellow with orange speckling.",
          "这是颗带有橘斑的黄蛋。",
        ],
        wiki_path: [
          "/wiki/Freckled_Dragon",
          "/zh/wiki/%E9%9B%80%E6%96%91%E9%BE%8D",
        ],
        rarity: "未知稀有度",
        habitat: ["Desert", "Jungle"],
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
        breed: ["Frilled", "褶伞龙"],
        egg: ["This egg has strange markings on it.", "这颗蛋上有奇怪的花样。"],
        wiki_path: ["/wiki/Frilled_Dragon", ""],
        rarity: "Normal",
        habitat: ["Jungle"],
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
        breed: ["Frostbite", "霜噬龙"],
        egg: [
          "Frost is creeping over this cold egg.",
          "这颗寒冷的蛋上爬满冰霜。",
        ],
        wiki_path: [
          "/wiki/Frostbite_Dragon",
          "/zh/wiki/%E9%9C%9C%E5%99%AC%E9%BE%8D",
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
        breed: ["Galvanic Wyvern", "双足流导翼龙"],
        egg: [
          "Powerful energy emanates from this egg.",
          "强烈的能量自这颗蛋发散而出。",
        ],
        wiki_path: [
          "/wiki/Galvanic_Wyvern",
          "/zh/wiki/%E9%9B%99%E8%B6%B3%E6%B5%81%E5%B0%8E%E7%BF%BC%E9%BE%8D",
        ],
        rarity: "Normal",
        habitat: ["Volcano"],
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
        breed: ["Gemshard", "碎宝石龙"],
        egg: [
          "This egg is encrusted with colorful gemstones.",
          "这颗蛋镶有色彩缤纷的宝石。",
        ],
        wiki_path: ["/wiki/Gemshard_Dragon", ""],
        rarity: "Normal",
        habitat: ["Jungle"],
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
        breed: ["Geode", "晶岩龙"],
        egg: [
          "This egg is heavy and rough, as if it were made out of rock.",
          "这颗蛋重且粗糙，仿佛由岩石构成。",
        ],
        wiki_path: ["/wiki/Geode_Dragon", ""],
        rarity: "SuperRare",
        habitat: [],
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
        breed: ["Gold", "饰龙"],
        egg: [
          "This egg is very reflective, almost metallic-looking.",
          "这颗蛋有著近似金属的高反光外壳。",
        ],
        wiki_path: ["/wiki/Gold_Dragon", ""],
        rarity: "SuperRare",
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
      {
        breed: ["Gold-Horned Tangar", "金角坦加尔龙"],
        egg: [
          "This egg has bright orange and green markings.",
          "这颗蛋有明亮橙色与绿色花纹。",
        ],
        wiki_path: ["/wiki/Gold-Horned_Tangar", ""],
        rarity: "未知稀有度",
        habitat: ["Jungle"],
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
        breed: ["Golden Wyvern", "黄金翼龙"],
        egg: ["This egg shimmers like gold.", "这颗蛋像金子般闪耀。"],
        wiki_path: [
          "/wiki/Golden_Wyvern",
          "/zh/wiki/%E9%BB%83%E9%87%91%E7%BF%BC%E9%BE%8D",
        ],
        rarity: "Rare",
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
        breed: ["Green", "绿龙"],
        egg: [
          "This egg is sitting in a pile of small pebbles.",
          "这颗蛋位于一些小卵石之间。",
        ],
        wiki_path: ["/wiki/Green_Dragon", ""],
        rarity: "Normal",
        habitat: ["Forest", "Volcano"],
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
        breed: ["Guardian", "护卫龙"],
        egg: [
          "This egg is sitting in front of the others.",
          "这颗蛋立于其他蛋前方。",
        ],
        wiki_path: [
          "/wiki/Guardian_Dragon",
          "/zh/wiki/%E8%AD%B7%E8%A1%9B%E9%BE%8D",
        ],
        rarity: "Normal",
        habitat: ["Volcano"],
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
        breed: ["Guardian of Nature", "自然守护龙"],
        egg: ["This egg glows mysteriously.", "这颗蛋发出神秘的光。"],
        wiki_path: [
          "/wiki/Guardian_of_Nature",
          "/zh/wiki/%E8%87%AA%E7%84%B6%E5%AE%88%E8%AD%B7%E9%BE%8D",
        ],
        rarity: "SuperRare",
        habitat: [],
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
        breed: ["Harvest", "收获龙"],
        egg: [
          "This heavy egg feels slightly warm.",
          "这个沉重的蛋有微暖的感觉。",
        ],
        wiki_path: ["/wiki/Harvest_Dragon", ""],
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
        breed: ["Hellfire Wyvern", "地狱火龙"],
        egg: [
          "This egg radiates the heat of a fell flame.",
          "这颗蛋放出可怕的火焰热量。",
        ],
        wiki_path: [
          "/wiki/Hellfire_Wyvern",
          "/zh/wiki/%E5%9C%B0%E7%8D%84%E7%81%AB%E9%BE%8D",
        ],
        rarity: "Normal",
        habitat: ["Volcano"],
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
        breed: ["Hellhorse", "狱马龙"],
        egg: [
          "This hot egg shakes violently when you touch it.",
          "这颗灼热的蛋在你触碰它时暴烈地摇晃。",
        ],
        wiki_path: [
          "/wiki/Hellhorse_Dragon",
          "/zh/wiki/%E7%8B%B1%E9%A9%AC%E9%BE%99",
        ],
        rarity: "SuperRare",
        habitat: [],
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
        breed: ["Hooded Murkling", ""],
        egg: ["This shady egg seems to be lurking just out of sight.", ""],
        wiki_path: ["/wiki/Hooded_Murkling_Dragon", ""],
        rarity: "未知稀有度",
        habitat: ["Coast"],
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
        breed: ["Horse", "悍马龙"],
        egg: ["This egg has strange markings on it.", "这颗蛋上有奇怪的花纹。"],
        wiki_path: [
          "/wiki/Horse_Dragon",
          "/zh/wiki/%E6%82%8D%E9%A6%AC%E9%BE%8D",
        ],
        rarity: "Normal",
        habitat: ["Jungle"],
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
        breed: ["Hydrophidius", ""],
        egg: ["This striped egg is surprisingly heavy.", ""],
        wiki_path: ["/wiki/Hydrophidius_Dragon", ""],
        rarity: "未知稀有度",
        habitat: ["Coast"],
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
        breed: ["Ice", "冰龙"],
        egg: ["This egg has icicles forming on it.", "这颗蛋上形成了冰柱。"],
        wiki_path: ["/wiki/Ice_Dragon", "/zh/wiki/%E5%86%B0%E9%BE%8D"],
        rarity: "SuperRare",
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
        breed: ["Imperial Fleshcrowne", "帝王肉冠龙"],
        egg: ["This egg is hidden in the trees.", "这颗蛋隐藏于树丛中。"],
        wiki_path: ["/wiki/Imperial_Fleshcrowne", ""],
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
      {
        breed: ["Khusa", "酷沙龙"],
        egg: ["This egg is smooth and shiny.", "这颗蛋光滑且闪闪发亮。"],
        wiki_path: [
          "/wiki/Khusa_Dragon",
          "/zh/wiki/%E9%85%B7%E6%B2%99%E9%BE%8D",
        ],
        rarity: "Normal",
        habitat: ["Alpine", "Desert"],
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
        breed: ["Kingcrowne", "王冠龙"],
        egg: [
          "This shiny egg gives off an almost magical aura.",
          "这闪闪发光的蛋散发出近似魔法的光圈。",
        ],
        wiki_path: [
          "/wiki/Kingcrowne_Dragon",
          "/zh/wiki/%E7%8E%8B%E5%86%A0%E9%BE%8D",
        ],
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
      {
        breed: ["Labradorite", ""],
        egg: ["This shimmering egg was hidden far from the others.", ""],
        wiki_path: ["/wiki/Labradorite_Dragon", ""],
        rarity: "未知稀有度",
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
      {
        breed: ["Lacula", "拉库拉龙"],
        egg: [
          "This green and silver egg lurks in the shadows, tempting you to steal it.",
          "这颗银绿色蛋潜伏在暗处，诱使你去偷走它。",
        ],
        wiki_path: [
          "/wiki/Lacula_Dragon",
          "/zh/wiki/%E6%8B%89%E5%BA%AB%E6%8B%89%E9%BE%8D",
        ],
        rarity: "Normal",
        habitat: ["Coast"],
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
        breed: ["Leodon", "烈傲龙"],
        egg: [
          "This red and gold egg sits before the others, almost daring you to grab it.",
          "这颗红金色的蛋坐在最前方，鼓励你大胆夺走他。",
        ],
        wiki_path: [
          "/wiki/Leodon_Dragon",
          "/zh/wiki/%E7%83%88%E5%82%B2%E9%BE%8D",
        ],
        rarity: "Normal",
        habitat: ["Volcano"],
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
        breed: ["Lihnseyre", "宁视乐龙"],
        egg: [
          "This glowing egg seems to tug at your very core.",
          "这颗发著光的蛋似是在拉扯你的内在。",
        ],
        wiki_path: [
          "/wiki/Lihnseyre_Dragon",
          "/zh/wiki/%E5%AF%A7%E8%A6%96%E6%A8%82%E9%BE%8D",
        ],
        rarity: "Normal",
        habitat: ["Jungle"],
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
        breed: ["Lotaan", ""],
        egg: ["This scaly egg seems to disappear in the depths.", ""],
        wiki_path: ["/wiki/Lotaan_Dragon", ""],
        rarity: "未知稀有度",
        habitat: ["Coast"],
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
        breed: ["Lumina", "绚光龙"],
        egg: [
          "This egg shines brightly in the sunlight.",
          "这颗蛋在阳光下明亮地闪耀。",
        ],
        wiki_path: ["/wiki/Lumina_Dragon", ""],
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
      {
        breed: ["Luminox Dragon", "夜明龙"],
        egg: [
          "The markings on this egg glow brightly in the shadows.",
          "这颗蛋上的斑点在阴影中闪闪发光。",
        ],
        wiki_path: [
          "/wiki/Luminox_Dragon",
          "/zh/wiki/%E5%A4%9C%E6%98%8E%E9%BE%8D",
        ],
        rarity: "未知稀有度",
        habitat: ["Forest"],
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
        breed: ["Lunar Herald Dragon", "月亮使者龙"],
        egg: [
          "This metallic egg shows faint iridescence in moonlight.",
          "这颗金属光泽的蛋在月光下发出微弱的虹光。",
        ],
        wiki_path: ["/wiki/Lunar_Herald_Dragon", ""],
        rarity: "未知稀有度",
        habitat: ["Alpine", "Desert", "Volcano"],
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
        breed: ["Magi", "贤龙"],
        egg: [
          "This egg has an orange aura radiating from it.",
          "这颗蛋放射出橙色魔力的光环。",
        ],
        wiki_path: ["/wiki/Magi_Dragon", "/zh/wiki/%E8%B3%A2%E9%BE%8D"],
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
      {
        breed: ["Magma", "岩浆龙"],
        egg: ["This egg is almost too hot to touch.", "这颗蛋热到难以触碰。"],
        wiki_path: ["/wiki/Magma_Dragon", ""],
        rarity: "SuperRare",
        habitat: ["Volcano"],
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
        breed: ["Melismor", "梅力斯莫龙"],
        egg: [
          "This heavy egg has an earthy scent, like freshly-tilled soil.",
          "这颗重蛋有股土味，像是新翻过的土壤。",
        ],
        wiki_path: [
          "/wiki/Melismor_Dragon",
          "/zh/wiki/%E6%A2%85%E5%8A%9B%E6%96%AF%E8%8E%AB%E9%BE%8D",
        ],
        rarity: "Normal",
        habitat: ["Forest"],
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
        breed: ["Mint", "薄荷龙"],
        egg: [
          "This egg is hidden behind the others, as if it is shy.",
          "这颗蛋藏在其他蛋后面，似乎很害羞。",
        ],
        wiki_path: ["/wiki/Mint_Dragon", ""],
        rarity: "Normal",
        habitat: ["Alpine", "Coast", "Forest", "Jungle", "Volcano"],
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
        breed: ["Mirisia Amphiptere", ""],
        egg: ["This egg emanates a peculiar smell.", ""],
        wiki_path: ["/wiki/Mirisia_Amphiptere", ""],
        rarity: "未知稀有度",
        habitat: ["Alpine", "Forest", "Jungle"],
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
        breed: ["Mistra", ""],
        egg: ["You hear a soft melody as you approach this egg.", ""],
        wiki_path: ["/wiki/Mistra_Dragon", ""],
        rarity: "未知稀有度",
        habitat: ["Coast", "Jungle"],
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
        breed: ["Monarch", "帝王龙"],
        egg: ["This egg is buried in leaf litter.", "这颗蛋被埋在落叶堆里。"],
        wiki_path: [
          "/wiki/Monarch_Dragon",
          "/zh/wiki/%E5%B8%9D%E7%8E%8B%E9%BE%8D",
        ],
        rarity: "Normal",
        habitat: ["Desert", "Forest", "Jungle"],
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
        breed: ["Moonstone", "月石龙"],
        egg: [
          "This egg resembles a glowing stone.",
          "这颗蛋像一颗闪闪发光的石头。",
        ],
        wiki_path: ["/wiki/Moonstone_Dragon", ""],
        rarity: "Normal",
        habitat: ["Desert"],
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
        breed: ["Nebula", "星云龙"],
        egg: [
          "This egg glows with a brilliant radiance.",
          "这颗蛋散发出灿烂的光辉。",
        ],
        wiki_path: [
          "/wiki/Nebula_Dragon",
          "/zh/wiki/%E6%98%9F%E9%9B%B2%E9%BE%8D",
        ],
        rarity: "Normal",
        habitat: ["Alpine", "Desert"],
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
        breed: ["Neglected", "弃龙"],
        egg: [
          "This egg is very sickly looking, like it’s diseased.",
          "这颗蛋看起来非常虚弱，似乎已经病变了。",
        ],
        wiki_path: ["/wiki/Neglected_Dragon", ""],
        rarity: "SuperRare",
        habitat: [],
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
        breed: ["Neotropical", "新热带龙"],
        egg: [
          "This egg has strange yellow stripes.",
          "这颗蛋有奇怪的黄色条纹。",
        ],
        wiki_path: ["/wiki/Neotropical_Dragon", ""],
        rarity: "Normal",
        habitat: ["Jungle"],
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
        breed: ["Nhiostrife Wyvern", "霓纹翼龙"],
        egg: [
          "This dull purple egg has two bright stripes on it.",
          "这颗暗紫色的蛋上有两条明亮的纹路。",
        ],
        wiki_path: ["/wiki/Nhiostrife_Wyvern", ""],
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
        breed: ["Nobleshield Dragon", ""],
        egg: ["This tough egg has a protective ridge down its shell.", ""],
        wiki_path: ["/wiki/Nobleshield_Dragon", ""],
        rarity: "未知稀有度",
        habitat: [],
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
        breed: ["Nocturne", "夜曲龙"],
        egg: [
          "This egg appears to be made of limestone.",
          "这颗蛋似乎由石灰石构成。",
        ],
        wiki_path: ["/wiki/Nocturne_Dragon", ""],
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
        breed: ["Olive", "橄榄龙"],
        egg: [
          "This egg smells musty, like rotting leaves.",
          "这颗蛋闻起来发霉了，像腐烂的树叶。",
        ],
        wiki_path: ["/wiki/Olive_Dragon", ""],
        rarity: "Normal",
        habitat: ["Forest"],
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
        breed: ["Oracle Wyrm", ""],
        egg: ["It feels like this egg knew you were coming.", ""],
        wiki_path: ["/wiki/Oracle_Wyrm", ""],
        rarity: "未知稀有度",
        habitat: ["Alpine", "Coast", "Forest", "Jungle"],
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
        breed: ["Pillow", "软枕龙"],
        egg: ["This egg has a velvety texture.", "这颗蛋有天鹅绒般的质地。"],
        wiki_path: ["/wiki/Pillow_Dragon", ""],
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
        breed: ["Pink", "粉龙"],
        egg: ["It’s bright. And pink.", "它是明亮的。而且是粉色的。"],
        wiki_path: ["/wiki/Pink_Dragon", "/zh/wiki/%E7%B2%89%E9%BE%8D"],
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
      {
        breed: ["Plated Colossus", "装甲巨龙"],
        egg: [
          "This massive egg is covered with thick plates.",
          "这颗巨大的蛋被装甲包覆。",
        ],
        wiki_path: ["/wiki/Plated_Colossus_Dragon", ""],
        rarity: "Normal",
        habitat: ["Forest", "Jungle"],
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
        breed: ["Purple", "紫龙"],
        egg: [
          "Wow, purple isn’t a color of egg you expected to see.",
          "哇，紫色不是你想象中会在蛋上看到的颜色。",
        ],
        wiki_path: ["/wiki/Purple_Dragon", ""],
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
      {
        breed: ["Pyralspite", "铝榴石龙"],
        egg: [
          "This egg feels like polished stone.",
          "这颗蛋就像是剖光过的宝石。",
        ],
        wiki_path: ["/wiki/Pyralspite_Dragon", ""],
        rarity: "Rare",
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
        breed: ["Pyropellis Wyvern", ""],
        egg: ["Tough ridges line the surface of this rough, mottled egg.", ""],
        wiki_path: ["/wiki/Pyropellis_Wyvern", ""],
        rarity: "未知稀有度",
        habitat: ["Volcano"],
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
        breed: ["Pyrovar", "火沸龙"],
        egg: [
          "This glassy egg is too hot to hold with your bare hands.",
          "这颗玻璃蛋烫到不能直接用手拿著。",
        ],
        wiki_path: [
          "/wiki/Pyrovar_Dragon",
          "/zh/wiki/%E7%81%AB%E6%B2%B8%E9%BE%8D",
        ],
        rarity: "Normal",
        habitat: ["Volcano"],
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
        breed: ["Pyrrhichios", ""],
        egg: [
          "When you tap on this shell, the hatchling inside taps back.",
          "",
        ],
        wiki_path: ["/wiki/Pyrrhichios_Dragon", ""],
        rarity: "未知稀有度",
        habitat: ["Volcano"],
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
        breed: ["Razorcrest Wyvern", "剃刀羽冠翼龙"],
        egg: [
          "This blue and bronze egg piques your curiosity.",
          "这颗蓝铜色蛋激起你的好奇心。",
        ],
        wiki_path: [
          "/wiki/Razorcrest_Wyvern",
          "/zh/wiki/%E5%89%83%E5%88%80%E7%BE%BD%E5%86%A0%E7%BF%BC%E9%BE%8D",
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
        breed: ["Red", "红龙"],
        egg: ["This egg is rather warm.", "这颗蛋相当温暖。"],
        wiki_path: ["/wiki/Red_Dragon", "/zh/wiki/%E7%B4%85%E9%BE%8D"],
        rarity: "Normal",
        habitat: ["Desert", "Volcano"],
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
        breed: ["Ridgewing", "脊翼龙"],
        egg: [
          "A cool mountain breeze blows around this egg.",
          "清凉的山风在这颗蛋四周吹拂。",
        ],
        wiki_path: ["/wiki/Ridgewing_Dragon", ""],
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
        breed: ["Rift Wyrm", "裂谷龙"],
        egg: [
          "This egg radiates an otherworldly chill.",
          "这颗蛋散发出超自然的寒意。",
        ],
        wiki_path: ["/wiki/Rift_Wyrm", "/zh/wiki/%E8%A3%82%E8%B0%B7%E9%BE%8D"],
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
      {
        breed: ["Risensong", "旭歌龙"],
        egg: [
          "This bright egg shines in the morning sunlight.",
          "这颗亮眼的蛋在朝曦中闪耀著光芒。",
        ],
        wiki_path: [
          "/wiki/Risensong_Dragon",
          "/zh/wiki/%E6%97%AD%E6%AD%8C%E9%BE%8D",
        ],
        rarity: "SuperRare",
        habitat: [],
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
        breed: ["Royal Blue", "皇家蓝龙"],
        egg: ["This egg shines in the moonlight.", "这颗蛋在月色下闪耀。"],
        wiki_path: [
          "/wiki/Royal_Blue_Dragon",
          "/zh/wiki/%E7%9A%87%E5%AE%B6%E8%97%8D%E9%BE%8D",
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
        breed: ["Royal Crimson", "皇家绯红龙"],
        egg: [
          "This large egg is a dark crimson color.",
          "这颗巨大的蛋有黯沉的绯红色。",
        ],
        wiki_path: ["/wiki/Royal_Crimson_Dragon", ""],
        rarity: "Normal",
        habitat: ["Volcano"],
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
        breed: ["Royal Eminence Dragon", ""],
        egg: ["This magnificent purple egg shimmers in the light.", ""],
        wiki_path: ["/wiki/Royal_Eminence_Dragon", ""],
        rarity: "未知稀有度",
        habitat: [],
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
        breed: ["Sandwaste", "沙荒龙"],
        egg: ["This egg was buried in a sand dune.", "这颗蛋被埋在沙堆下。"],
        wiki_path: [
          "/wiki/Sandwaste_Dragon",
          "/zh/wiki/%E6%B2%99%E8%8D%92%E9%BE%8D",
        ],
        rarity: "Normal",
        habitat: ["Desert"],
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
        breed: ["Sapo", ""],
        egg: ["This egg’s shell is slippery and clean.", ""],
        wiki_path: ["/wiki/Sapo_Dragon", ""],
        rarity: "Normal",
        habitat: ["Forest", "Jungle"],
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
        breed: ["Sapphire", "蓝宝石龙"],
        egg: [
          "This egg looks like a beautiful blue stone.",
          "这颗蛋看起来像是颗漂亮的蓝石头。",
        ],
        wiki_path: [
          "/wiki/Sapphire_Dragon",
          "/zh/wiki/%E8%97%8D%E5%AF%B6%E7%9F%B3%E9%BE%8D",
        ],
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
      {
        breed: ["Sawtooth Dragon", ""],
        egg: ["Soft chirping sounds are coming from inside the egg.", ""],
        wiki_path: ["/wiki/Sawtooth_Dragon", ""],
        rarity: "未知稀有度",
        habitat: ["Jungle"],
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
        breed: ["Scimitar-wing Wyvern", "弯刀翼龙"],
        egg: ["This egg seems quite harmless.", "这颗蛋看起来很无害。"],
        wiki_path: ["/wiki/Scimitar-wing_Wyvern", ""],
        rarity: "Normal",
        habitat: ["Desert", "Volcano"],
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
        breed: ["Script", "符纹龙"],
        egg: [
          "This egg is covered in mysterious patterns.",
          "这颗蛋布满了神秘的符文。",
        ],
        wiki_path: ["/wiki/Script_Dragon", ""],
        rarity: "Normal",
        habitat: ["Volcano"],
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
        breed: ["Seasonal (Spring)", "季龙"],
        egg: [
          "The markings on this egg match the weather outside.",
          "这颗蛋上的花纹与外面的季节相对应。",
        ],
        wiki_path: ["/wiki/Seasonal_Dragon_(Spring)", ""],
        rarity: "未知稀有度",
        habitat: ["Forest"],
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
        breed: ["Seasonal (Summer)", ""],
        egg: ["The markings on this egg match the weather outside.", ""],
        wiki_path: ["/wiki/Seasonal_Dragon_(Summer)", ""],
        rarity: "未知稀有度",
        habitat: ["Forest"],
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
        breed: ["Seasonal (Autumn)", ""],
        egg: ["The markings on this egg match the weather outside.", ""],
        wiki_path: ["/wiki/Seasonal_Dragon_(Autumn)", ""],
        rarity: "未知稀有度",
        habitat: ["Forest"],
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
        breed: ["Seasonal (Winter)", ""],
        egg: ["The markings on this egg match the weather outside.", ""],
        wiki_path: ["/wiki/Seasonal_Dragon_(Winter)", ""],
        rarity: "未知稀有度",
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
        breed: ["Serrati Wyvern", ""],
        egg: ["This egg has striations marking its rough shell.", ""],
        wiki_path: ["/wiki/Serrati_Wyvern", ""],
        rarity: "未知稀有度",
        habitat: ["Volcano"],
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
        breed: ["Setsong Dragon", "暮歌龙"],
        egg: [
          "This dark egg shines in the evening sunlight.",
          "这颗暗沉的蛋在暮色中闪耀著光芒。",
        ],
        wiki_path: [
          "/wiki/Setsong_Dragon",
          "/zh/wiki/%E6%9A%AE%E6%AD%8C%E9%BE%8D",
        ],
        rarity: "SuperRare",
        habitat: [],
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
        breed: ["Shallow Water", "浅水龙"],
        egg: [
          "This egg appears to be covered in scales.",
          "这颗蛋似乎覆着鳞。",
        ],
        wiki_path: ["/wiki/Shallow_Water_Dragon", ""],
        rarity: "SuperRare",
        habitat: [],
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
        breed: ["Shimmer-scale", ""],
        egg: ["This egg is very reflective, almost metallic looking.", ""],
        wiki_path: ["/wiki/Shimmer-scale_Dragon", ""],
        rarity: "未知稀有度",
        habitat: [],
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
        breed: ["Shumoga", ""],
        egg: ["This striped egg has a rough, ridged texture.", ""],
        wiki_path: ["/wiki/Shumoga_Dragon", ""],
        rarity: "未知稀有度",
        habitat: ["Alpine", "Desert"],
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
        breed: ["Silver", "安魂龙"],
        egg: [
          "This egg gives off a beautiful glow.",
          "这颗蛋散发出美丽的光芒。",
        ],
        wiki_path: ["/wiki/Silver_Dragon", ""],
        rarity: "SuperRare",
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
      {
        breed: ["Sinii Krai", "青尼廓蓝龙"],
        egg: [
          "This striped egg has a warm glow.",
          "这颗条纹蛋散发著温和光芒。",
        ],
        wiki_path: ["/wiki/Sinii_Krai_Dragon", ""],
        rarity: "Normal",
        habitat: ["Coast"],
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
        breed: ["Siyat", "夏特龙"],
        egg: [
          "This egg seems to be glowing in spots.",
          "这颗蛋上的斑点看起来在发光。",
        ],
        wiki_path: [
          "/wiki/Siyat_Dragon",
          "/zh/wiki/%E5%A4%8F%E7%89%B9%E9%BE%8D",
        ],
        rarity: "Normal",
        habitat: ["Alpine", "Coast", "Forest"],
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
        breed: ["Skystrider", ""],
        egg: ["This plain blue egg almost seems to float.", ""],
        wiki_path: ["/wiki/Skystrider_Dragon", ""],
        rarity: "未知稀有度",
        habitat: ["Alpine", "Coast", "Forest"],
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
        breed: ["Skysilk", "天丝龙"],
        egg: [
          "This light egg has very vibrant colors.",
          "这颗轻巧的蛋色彩斑斓。",
        ],
        wiki_path: [
          "/wiki/Skysilk_Dragon",
          "/zh/wiki/%E5%A4%A9%E7%B5%B2%E9%BE%8D",
        ],
        rarity: "Normal",
        habitat: ["Desert", "Jungle"],
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
        breed: ["Skywing", "空翼龙"],
        egg: ["This egg has strange markings on it.", "这颗蛋上有奇怪的花纹。"],
        wiki_path: ["/wiki/Skywing_Dragon", ""],
        rarity: "Normal",
        habitat: ["Coast"],
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
        breed: ["Sophrosyne", ""],
        egg: ["This egg gives off a beautiful glow.", ""],
        wiki_path: ["/wiki/Sophrosyne_Dragon", ""],
        rarity: "未知稀有度",
        habitat: [],
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
        breed: ["Speckle-Throated", "斑喉龙"],
        egg: [
          "This egg has a rough—yet shiny—shell.",
          "这颗蛋有个粗糙——然而闪亮的壳。",
        ],
        wiki_path: ["/wiki/Speckle-Throated_Dragon", ""],
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
        breed: ["Spinel Wyvern", "尖晶石翼龙"],
        egg: [
          "This glassy egg has a single stripe on it.",
          "这颗玻璃般的蛋上有一道条纹。",
        ],
        wiki_path: ["/wiki/Spinel_Wyvern", ""],
        rarity: "Normal",
        habitat: ["Desert", "Volcano"],
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
        breed: ["Spirit Ward", "守灵龙"],
        egg: ["This egg glows from within.", "这颗蛋自内而外散发著光芒。"],
        wiki_path: ["/wiki/Spirit_Ward_Dragon", ""],
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
        breed: ["Spitfire", "条纹龙"],
        egg: [
          "This egg has brightly colored markings on it.",
          "这颗蛋上有色泽明亮的花纹。",
        ],
        wiki_path: ["/wiki/Spitfire_Dragon", ""],
        rarity: "Normal",
        habitat: ["Desert"],
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
        breed: ["Spotted Greenwing", "斑点绿翼龙"],
        egg: [
          "This egg is covered in bright spots.",
          "这颗蛋覆盖着明亮的斑点。",
        ],
        wiki_path: ["/wiki/Spotted_Greenwing", ""],
        rarity: "Normal",
        habitat: ["Forest"],
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
        breed: ["Stone", "石龙"],
        egg: [
          "This egg is heavy and rough, as if it were made out of rock.",
          "这颗蛋重且粗糙，仿佛由岩石构成。",
        ],
        wiki_path: ["/wiki/Stone_Dragon", ""],
        rarity: "Normal",
        habitat: ["Alpine", "Desert", "Volcano"],
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
        breed: ["Storm", "风暴龙"],
        egg: ["This egg is surrounded by fog.", "这颗蛋被雾笼罩。"],
        wiki_path: ["/wiki/Storm_Dragon", ""],
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
      {
        breed: ["Storm-Rider", "风暴驾驭龙"],
        egg: [
          "You can feel the static electricity that surrounds this egg.",
          "你可以感受到静电环绕著这颗蛋。",
        ],
        wiki_path: [
          "/wiki/Storm-Rider_Dragon",
          "/zh/wiki/%E9%A2%A8%E6%9A%B4%E9%A7%95%E9%A6%AD%E9%BE%8D",
        ],
        rarity: "SuperRare",
        habitat: [],
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
        breed: ["Stratos Dragon", "斯特拉托斯龙"],
        egg: [
          "This egg is very large, but light for its size.",
          "这蛋虽大，却没那么重。",
        ],
        wiki_path: [
          "/wiki/Stratos_Dragon",
          "/zh/wiki/%E6%96%AF%E7%89%B9%E6%8B%89%E6%89%98%E6%96%AF%E9%BE%8D",
        ],
        rarity: "Normal",
        habitat: ["Alpine", "Desert", "Jungle"],
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
        breed: ["Striped", ""],
        egg: ["This egg has brightly colored markings on it.", ""],
        wiki_path: ["/wiki/Striped_Dragon", ""],
        rarity: "Normal",
        habitat: ["Forest", "Jungle"],
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
        breed: ["Striped River", "条纹河龙"],
        egg: [
          "A small puddle of condensation has collected under this egg.",
          "小小的水滩凝聚在这颗蛋下。",
        ],
        wiki_path: ["/wiki/Striped_River_Dragon", ""],
        rarity: "Normal",
        habitat: ["Forest"],
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
        breed: ["Sunset", "落日龙"],
        egg: [
          "This egg is glowing as brightly as the sun.",
          "这颗蛋闪耀得像太阳。",
        ],
        wiki_path: ["/wiki/Sunset_Dragon", "#cite_note-sunrise-sunset-13"],
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
        breed: ["Sunsong Amphiptere", "日歌翼蛇"],
        egg: [
          "This egg changes colors in the sunlight.",
          "这颗蛋在阳光下变幻着颜色。",
        ],
        wiki_path: ["/wiki/Sunsong_Amphiptere", ""],
        rarity: "Normal",
        habitat: ["Jungle"],
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
        breed: ["Sunstone", "太阳石龙"],
        egg: [
          "This egg resembles a glowing stone.",
          "这颗蛋像一颗闪闪发光的石头。",
        ],
        wiki_path: ["/wiki/Sunstone_Dragon", ""],
        rarity: "Normal",
        habitat: ["Desert"],
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
        breed: ["Swallowtail", "燕尾龙"],
        egg: ["This egg has a very thin shell.", "这颗蛋的壳非常薄。"],
        wiki_path: ["/wiki/Swallowtail_Dragon", ""],
        rarity: "Normal",
        habitat: ["Forest"],
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
        breed: ["Tercorn", "三角龙"],
        egg: [
          "Water glistens on this egg’s shimmering shell.",
          "水珠在这颗蛋晶莹璀璨的壳上闪闪发光。",
        ],
        wiki_path: [
          "/wiki/Tercorn_Dragon",
          "/zh/wiki/%E4%B8%89%E8%A7%92%E9%BE%8D",
        ],
        rarity: "Normal",
        habitat: ["Coast"],
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
        breed: ["Terrae", "土壤龙"],
        egg: ["This egg is a lush green hue.", "这颗蛋有绿意盎然的色调。"],
        wiki_path: ["/wiki/Terrae_Dragon", ""],
        rarity: "Normal",
        habitat: ["Forest"],
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
        breed: ["Tetra", "灯鱼龙"],
        egg: ["This egg has faint markings.", "这颗蛋有著发出微光的花纹。"],
        wiki_path: ["/wiki/Tetra_Dragon", ""],
        rarity: "Normal",
        habitat: ["Coast", "Jungle"],
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
        breed: ["Thunder", "雷龙"],
        egg: [
          "Whenever you go near this egg your hair stands on end.",
          "当你靠近这颗蛋时你的头发根根竖立。",
        ],
        wiki_path: ["/wiki/Thunder_Dragon", "/zh/wiki/%E9%9B%B7%E9%BE%8D"],
        rarity: "SuperRare",
        habitat: ["Desert"],
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
        breed: ["Thundersnow", ""],
        egg: [
          "Cold lightning arcs out from this egg’s shell if you try to touch it.",
          "",
        ],
        wiki_path: ["/wiki/Thundersnow_Dragon", ""],
        rarity: "未知稀有度",
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
        breed: ["Tideweaver", ""],
        egg: [
          "This egg has vivid red stripes, reminiscent of waves and flames at once.",
          "",
        ],
        wiki_path: ["/wiki/Tideweaver_Lindwyrm", ""],
        rarity: "未知稀有度",
        habitat: ["Coast"],
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
        breed: ["Tinsel", ""],
        egg: ["This egg is very reflective, almost metallic looking.", ""],
        wiki_path: ["/wiki/Tinsel_Dragon", ""],
        rarity: "未知稀有度",
        habitat: [],
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
        breed: ["Tri-Horn Wyvern", "三角翼龙"],
        egg: [
          "This brown egg is covered in intricate designs.",
          "这颗棕色的蛋覆盖在错综复杂的纹样下。",
        ],
        wiki_path: ["/wiki/Tri-Horn_Wyvern", ""],
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
        breed: ["Tsunami Wyvern", "海啸翼龙"],
        egg: [
          "This egg is rocking back and forth in a puddle, creating small waves.",
          "这颗蛋在水坑里摇摇晃晃，引起了小小的波澜。",
        ],
        wiki_path: ["/wiki/Tsunami_Wyvern", ""],
        rarity: "Normal",
        habitat: ["Coast"],
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
        breed: ["Turpentine", "松节油龙"],
        egg: [
          "This egg smells strongly of turpentine.",
          "这颗蛋闻起来有浓烈的松节油气味。",
        ],
        wiki_path: ["/wiki/Turpentine_Dragon", ""],
        rarity: "Normal",
        habitat: ["Desert"],
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
        breed: ["Two-Finned Bluna", "双鳍布鲁纳"],
        egg: ["This egg has colored speckles on it.", "这颗蛋有彩色的斑纹。"],
        wiki_path: ["/wiki/Two-Finned_Bluna", ""],
        rarity: "SuperRare",
        habitat: [],
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
        breed: ["Ultraviolet", "紫外光龙"],
        egg: [
          "This egg is very warm, as if it has been sitting out in strong sunlight.",
          "这颗蛋非常温暖，仿佛一直位于强烈的阳光下。",
        ],
        wiki_path: [
          "/wiki/Ultraviolet_Dragon",
          "/zh/wiki/%E7%B4%AB%E5%A4%96%E5%85%89%E9%BE%8D",
        ],
        rarity: "SuperRare",
        habitat: [],
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
        breed: ["Undine", "温蒂妮龙"],
        egg: [
          "There is a thin layer of moisture coating this egg.",
          "这颗蛋被一层薄薄的水膜包裹。",
        ],
        wiki_path: ["/wiki/Undine_Dragon", ""],
        rarity: "SuperRare",
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
        breed: ["Vampire", "吸血龙"],
        egg: [
          "This egg is stone cold and smells rotten.",
          "这颗蛋冰冷而且有腐臭味。",
        ],
        wiki_path: ["/wiki/Vampire_Dragon", ""],
        rarity: "未知稀有度",
        habitat: [],
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
        breed: ["Venturis", "文丘里斯龙"],
        egg: [
          "An aura of serenity surrounds this iridescent egg.",
          "宁静的氛围环绕在这颗虹蛋四周。",
        ],
        wiki_path: [
          "/wiki/Venturis_Dragon",
          "/zh/wiki/%E6%96%87%E4%B8%98%E9%87%8C%E6%96%AF%E9%BE%8D",
        ],
        rarity: "未知稀有度",
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
        breed: ["Water", "水龙"],
        egg: [
          "This egg is sitting in a shallow puddle.",
          "这颗蛋位于一个浅浅的水坑中。",
        ],
        wiki_path: ["/wiki/Water_Dragon", ""],
        rarity: "Normal",
        habitat: ["Coast"],
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
        breed: ["Water Walker", "水行龙"],
        egg: [
          "This egg seems to be floating on a puddle.",
          "这颗蛋似乎漂浮在水坑上。",
        ],
        wiki_path: ["/wiki/Water_Walker_Dragon", ""],
        rarity: "Normal",
        habitat: ["Coast", "Forest", "Jungle"],
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
        breed: ["Waterhorse", "水马龙"],
        egg: ["This egg is slimy and blue.", "这颗蛋又光滑又蓝。"],
        wiki_path: ["/wiki/Waterhorse_Dragon", ""],
        rarity: "Normal",
        habitat: ["Coast"],
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
        breed: ["Whiptail", "鞭尾龙"],
        egg: [
          "This egg shakes from time to time, as if it is eager to hatch.",
          "这颗蛋不时地摇摆，似乎渴望孵化。",
        ],
        wiki_path: ["/wiki/Whiptail_Dragon", ""],
        rarity: "Normal",
        habitat: ["Forest"],
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
        breed: ["White", "白龙"],
        egg: [
          "This egg has a very clean look; it’s completely devoid of dirt and scratches.",
          "这颗蛋看起来非常洁净，没有一点污垢和划痕。",
        ],
        wiki_path: ["/wiki/White_Dragon", ""],
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
      {
        breed: ["Wisteria", ""],
        egg: ["This egg is surrounded by beautiful flowers.", ""],
        wiki_path: ["/wiki/Wisteria_Dragon", ""],
        rarity: "未知稀有度",
        habitat: ["Forest"],
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
        breed: ["Xenowyrm (Aquilo)", "海岸"],
        egg: [
          "Mana courses throughout this glassy egg.",
          "魔力从这玻璃般的蛋散发出来。",
        ],
        wiki_path: [
          "/wiki/Aquilo_Xenowyrm",
          "/zh/wiki/Category:%E6%B5%B7%E5%B2%B8",
        ],
        rarity: "未知稀有度",
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
        breed: ["Xenowyrm (Aso)", ""],
        egg: ["Mana courses throughout this glassy egg.", ""],
        wiki_path: ["/wiki/Aso_Xenowyrm", ""],
        rarity: "未知稀有度",
        habitat: ["Coast"],
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
        breed: ["Xenowyrm (Astrapi)", ""],
        egg: ["Mana courses throughout this glassy egg.", ""],
        wiki_path: ["/wiki/Astrapi_Xenowyrm", ""],
        rarity: "未知稀有度",
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
        breed: ["Xenowyrm (Chrono)", ""],
        egg: ["Mana courses throughout this glassy egg.", ""],
        wiki_path: ["/wiki/Chrono_Xenowyrm", ""],
        rarity: "未知稀有度",
        habitat: ["Forest"],
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
        breed: ["Xenowyrm (Gaia)", ""],
        egg: ["Mana courses throughout this glassy egg.", ""],
        wiki_path: ["/wiki/Gaia_Xenowyrm", ""],
        rarity: "未知稀有度",
        habitat: ["Jungle"],
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
        breed: ["Xenowyrm (Ke'maro)", ""],
        egg: ["Mana courses throughout this glassy egg.", ""],
        wiki_path: ["/wiki/Ke%E2%80%99maro_Xenowyrm", ""],
        rarity: "未知稀有度",
        habitat: ["Volcano"],
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
        breed: ["Xenowyrm (Mageia)", ""],
        egg: ["Mana courses throughout this glassy egg.", ""],
        wiki_path: ["/wiki/Mageia_Xenowyrm", ""],
        rarity: "未知稀有度",
        habitat: ["Desert"],
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
        breed: ["Xenowyrm (Obidar)", ""],
        egg: ["Mana courses throughout this glassy egg.", ""],
        wiki_path: ["/wiki/Obidar_Xenowyrm", ""],
        rarity: "未知稀有度",
        habitat: ["Forest"],
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
        breed: ["Xenowyrm (Pharos)", ""],
        egg: ["Mana courses throughout this glassy egg.", ""],
        wiki_path: ["/wiki/Pharos_Xenowyrm", ""],
        rarity: "未知稀有度",
        habitat: ["Desert"],
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
        breed: ["Xenowyrm (Pyro)", ""],
        egg: ["Mana courses throughout this glassy egg.", ""],
        wiki_path: ["/wiki/Pyro_Xenowyrm", ""],
        rarity: "未知稀有度",
        habitat: ["Volcano"],
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
        breed: ["Xenowyrm (Staterae)", ""],
        egg: ["Mana flows like a current through this glassy egg.", ""],
        wiki_path: ["/wiki/Staterae_Xenowyrm", ""],
        rarity: "未知稀有度",
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
      {
        breed: ["Xenowyrm (Thalassa)", ""],
        egg: ["Mana courses throughout this glassy egg.", ""],
        wiki_path: ["/wiki/Thalassa_Xenowyrm", ""],
        rarity: "未知稀有度",
        habitat: ["Coast"],
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
        breed: ["Xenowyrm (Umbra)", ""],
        egg: ["Mana courses throughout this glassy egg.", ""],
        wiki_path: ["/wiki/Umbra_Xenowyrm", ""],
        rarity: "未知稀有度",
        habitat: ["Jungle"],
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
        breed: ["Xol", "柯索龙"],
        egg: [
          "This dull egg feels cozily warm.",
          "这颗色彩不鲜明蛋让人感到舒适温和。",
        ],
        wiki_path: ["/wiki/Xol_Dragon", ""],
        rarity: "未知稀有度",
        habitat: ["Volcano"],
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
        breed: ["Yellow-Crowned", "黄冠龙"],
        egg: [
          "The air shimmers around this egg, as if from heat.",
          "这颗蛋周遭的空气摇晃扭曲，仿佛蜃气楼。",
        ],
        wiki_path: ["/wiki/Yellow-Crowned_Dragon", ""],
        rarity: "Normal",
        habitat: ["Desert"],
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
        breed: ["Zyumorph", "赛尔莫夫龙"],
        egg: [
          "This shiny egg seems to radiate power.",
          "这颗闪亮的蛋似乎正放射出能量。",
        ],
        wiki_path: [
          "/wiki/Zyumorph",
          "/zh/wiki/%E8%B3%BD%E7%88%BE%E8%8E%AB%E5%A4%AB%E9%BE%8D",
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
        breed: ["Baikala", "贝加尔龙"],
        egg: [
          "This heavy egg has a soft, yielding shell.",
          "这颗沉重的蛋外壳柔软。",
        ],
        wiki_path: ["/wiki/Baikala_Dragon", ""],
        rarity: "Normal",
        habitat: ["Coast"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Two-headed Dragon",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Bauta", "假面龙"],
        egg: [
          "This egg has raised golden ridges.",
          "这颗蛋上有著金色浮雕般的隆起。",
        ],
        wiki_path: ["/wiki/Bauta_Dragon", "/zh/wiki/Bauta_Dragon"],
        rarity: "Normal",
        habitat: ["Coast"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Two-headed Dragon",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Blancblack", "白黑龙"],
        egg: [
          "This egg is dark with light speckles...or maybe it’s light with dark speckles?",
          "这颗深色的蛋上有浅色斑点……还是浅色蛋上有暗色斑点呢？",
        ],
        wiki_path: [
          "/wiki/Blancblack_Dragon",
          "/zh/wiki/%E7%99%BD%E9%BB%91%E9%BE%8D",
        ],
        rarity: "Normal",
        habitat: ["Desert", "Forest", "Volcano"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Two-headed Dragon",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Ciriax Lindwyrm", "双头鳞龙"],
        egg: [
          "This opalescent egg shimmers in the moonlight.",
          "这种发着乳白色光的蛋在月光下闪闪发光。",
        ],
        wiki_path: ["/wiki/Ciriax_Lindwyrm", ""],
        rarity: "未知稀有度",
        habitat: ["Alpine"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Two-headed Dragon",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Duotone", "双色龙"],
        egg: ["This egg can’t seem to make up its mind what color it is.", ""],
        wiki_path: ["/wiki/Duotone_Dragon", ""],
        rarity: "Normal",
        habitat: ["Alpine", "Coast", "Desert", "Forest", "Jungle", "Volcano"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Two-headed Dragon",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Geminae", "双子龙"],
        egg: [
          "This shiny egg gives you a headache when you get close.",
          "你靠近这颗发著光的蛋就头痛。",
        ],
        wiki_path: [
          "/wiki/Geminae_Dragon",
          "/zh/wiki/%E9%9B%99%E5%AD%90%E9%BE%8D",
        ],
        rarity: "Normal",
        habitat: ["Desert"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Two-headed Dragon",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Ghanser", ""],
        egg: ["This egg has spots that glow brightly when touched.", ""],
        wiki_path: ["/wiki/Ghanser_Dragon", ""],
        rarity: "未知稀有度",
        habitat: ["Forest", "Jungle"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Two-headed Dragon",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Gilded Bloodscale", "镀金血鳞龙"],
        egg: [
          "This egg glitters oddly in the light.",
          "这颗蛋在光下奇异地闪烁。",
        ],
        wiki_path: ["/wiki/Gilded_Bloodscale_Dragon", ""],
        rarity: "Normal",
        habitat: ["Volcano"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Two-headed Dragon",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Hooktalon", "勾爪龙"],
        egg: [
          "The surface of this egg is rough and sharp.",
          "蛋的表面又粗糙又尖锐。",
        ],
        wiki_path: ["/wiki/Hooktalon_Dragon", ""],
        rarity: "Normal",
        habitat: ["Desert"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Two-headed Dragon",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Jester", ""],
        egg: ["This egg has a checkered shell.", ""],
        wiki_path: ["/wiki/Jester_Dragon", ""],
        rarity: "SuperRare",
        habitat: [],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Two-headed Dragon",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Magnesium Amphiptere", ""],
        egg: ["This shiny grey egg smells of burnt metal.", ""],
        wiki_path: ["/wiki/Magnesium_Amphiptere", ""],
        rarity: "未知稀有度",
        habitat: ["Desert", "Volcano"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Two-headed Dragon",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Nexus", "连龙"],
        egg: [
          "This dense, crystalline egg seems dangerously unstable.",
          "这颗高密度、如结晶般的蛋看起来极为不稳定。",
        ],
        wiki_path: ["/wiki/Nexus_Dragon", "/zh/wiki/%E9%80%A3%E9%BE%8D"],
        rarity: "Normal",
        habitat: ["Alpine", "Volcano"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Two-headed Dragon",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Scourgekeeper", ""],
        egg: ["You feel a clawing dread the closer you get to this egg.", ""],
        wiki_path: ["/wiki/Scourgekeeper_Dragon", ""],
        rarity: "未知稀有度",
        habitat: [],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Two-headed Dragon",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Split", "分龙"],
        egg: [
          "This egg is split down the middle into two colors.",
          "这颗蛋从中间分成两个颜色。",
        ],
        wiki_path: ["/wiki/Split_Dragon", ""],
        rarity: "Normal",
        habitat: ["Alpine", "Coast", "Desert", "Forest", "Jungle", "Volcano"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Two-headed Dragon",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Temple Wyrm", ""],
        egg: ["This egg has a winding pattern on it.", ""],
        wiki_path: ["/wiki/Temple_Wyrm", ""],
        rarity: "未知稀有度",
        habitat: ["Desert", "Jungle"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Two-headed Dragon",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Avea Pygmy", "阿维亚侏儒龙"],
        egg: ["This tiny egg is rather light.", "这个小蛋很轻。"],
        wiki_path: [
          "/wiki/Avea_Pygmy",
          "/zh/wiki/%E9%98%BF%E7%B6%AD%E4%BA%9E%E4%BE%8F%E5%84%92%E9%BE%8D",
        ],
        rarity: "Normal",
        habitat: ["Alpine", "Coast", "Desert", "Forest", "Jungle", "Volcano"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Pygmy Dragon",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Avin Pygmy", ""],
        egg: ["This tiny white egg shakes sometimes.", ""],
        wiki_path: ["/wiki/Avin_Pygmy", ""],
        rarity: "未知稀有度",
        habitat: ["Alpine", "Coast", "Desert", "Forest", "Jungle", "Volcano"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Pygmy Dragon",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Common Pygmy", "侏儒龙"],
        egg: [
          "This egg is so tiny you almost didn’t see it.",
          "这颗蛋太小了以至于你几乎没有看到它。",
        ],
        wiki_path: ["/wiki/Common_Pygmy", ""],
        rarity: "Normal",
        habitat: ["Alpine", "Forest", "Jungle"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Pygmy Dragon",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Coral Pygmy Wyvern", "珊瑚侏儒翼龙"],
        egg: [
          "This tiny egg is striped and feels coarse.",
          "这颗有条纹的小蛋感觉很粗糙。",
        ],
        wiki_path: [
          "/wiki/Coral_Pygmy_Wyvern",
          "/zh/wiki/%E7%8F%8A%E7%91%9A%E4%BE%8F%E5%84%92%E7%BF%BC%E9%BE%8D",
        ],
        rarity: "Normal",
        habitat: ["Coast"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Pygmy Dragon",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Crimson Flare Pygmy", "红火侏儒龙"],
        egg: [
          "This egg is tiny and brightly colored.",
          "这颗蛋很小并有明亮的颜色。",
        ],
        wiki_path: ["/wiki/Crimson_Flare_Pygmy", ""],
        rarity: "Normal",
        habitat: ["Volcano"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Pygmy Dragon",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Dusk Pygmy", "薄暮侏儒龙"],
        egg: ["This tiny egg is cold to the touch.", "这颗娇小的蛋触手冰凉。"],
        wiki_path: [
          "/wiki/Dusk_Pygmy",
          "/zh/wiki/%E8%96%84%E6%9A%AE%E4%BE%8F%E5%84%92%E9%BE%8D",
        ],
        rarity: "SuperRare",
        habitat: [],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Pygmy Dragon",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Furor Pygmy", ""],
        egg: ["Grabbing this tiny egg makes you feel reckless.", ""],
        wiki_path: ["/wiki/Furor_Pygmy", ""],
        rarity: "未知稀有度",
        habitat: ["Desert"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Pygmy Dragon",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Glowback Pygmy", "曜背侏儒龙"],
        egg: ["This tiny egg gives off a colorful glow.", "这颗小蛋闪著彩光。"],
        wiki_path: [
          "/wiki/Glowback_Pygmy",
          "/zh/wiki/%E6%9B%9C%E8%83%8C%E4%BE%8F%E5%84%92%E9%BE%8D",
        ],
        rarity: "Normal",
        habitat: ["Forest", "Jungle"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Pygmy Dragon",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Kovos Pygmy", "克伏弑侏儒龙"],
        egg: [
          "This tiny, dark egg fills you with existential dread.",
          "这颗深色小蛋使你充满畏惧。",
        ],
        wiki_path: [
          "/wiki/Kovos_Pygmy",
          "/zh/wiki/%E5%85%8B%E4%BC%8F%E5%BC%92%E4%BE%8F%E5%84%92%E9%BE%8D",
        ],
        rarity: "Normal",
        habitat: ["Coast"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Pygmy Dragon",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Kyanite Pygmy", "蓝晶石侏儒龙"],
        egg: [
          "This tiny cobalt egg has a crystalline sheen.",
          "这颗钴蓝色的小蛋有著结晶的光泽。",
        ],
        wiki_path: [
          "/wiki/Kyanite_Pygmy",
          "/zh/wiki/%E8%97%8D%E6%99%B6%E7%9F%B3%E4%BE%8F%E5%84%92%E9%BE%8D",
        ],
        rarity: "Normal",
        habitat: ["Alpine", "Coast", "Desert", "Forest", "Jungle", "Volcano"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Pygmy Dragon",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Magelight Pygmy", "魔光侏儒龙"],
        egg: [
          "This small egg is engulfed in a cool, purple flame.",
          "这枚小蛋被包裹在清凉的紫色火焰中。",
        ],
        wiki_path: [
          "/wiki/Magelight_Pygmy",
          "/zh/wiki/%E9%AD%94%E5%85%89%E4%BE%8F%E5%84%92%E9%BE%8D",
        ],
        rarity: "Normal",
        habitat: ["Alpine"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Pygmy Dragon",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Mariner Pygmy", "水手侏儒龙"],
        egg: ["This tiny egg smells like the sea.", "这颗小蛋闻起来像是大海。"],
        wiki_path: [
          "/wiki/Mariner_Pygmy",
          "/zh/wiki/%E6%B0%B4%E6%89%8B%E4%BE%8F%E5%84%92%E9%BE%8D",
        ],
        rarity: "Normal",
        habitat: ["Coast"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Pygmy Dragon",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Mimic Pygmy", "模仿侏儒龙"],
        egg: [
          "This tiny glowing egg tempts you to follow its light.",
          "这颗发光的小蛋诱使你跟著光线走。",
        ],
        wiki_path: [
          "/wiki/Mimic_Pygmy",
          "/zh/wiki/%E6%A8%A1%E4%BB%BF%E4%BE%8F%E5%84%92%E9%BE%8D",
        ],
        rarity: "Normal",
        habitat: ["Forest", "Jungle"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Pygmy Dragon",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Misfit Pygmy", "捣蛋侏儒龙"],
        egg: [
          "This tiny egg has crazy swirls on it.",
          "这颗小蛋上有繁复的漩涡纹。",
        ],
        wiki_path: ["/wiki/Misfit_Pygmy", ""],
        rarity: "Normal",
        habitat: ["Jungle"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Pygmy Dragon",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Mistlet Pygmy", "黑雾侏儒龙"],
        egg: ["This tiny egg is mysterious and dark.", "这颗小蛋神秘而黑暗。"],
        wiki_path: ["/wiki/Mistlet_Pygmy", ""],
        rarity: "未知稀有度",
        habitat: ["Forest", "Jungle"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Pygmy Dragon",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Nilia Pygmy", "妮莉亚侏儒龙"],
        egg: [
          "This tiny egg is heavier than you expected.",
          "这颗小小的蛋比你预期的要重。",
        ],
        wiki_path: ["/wiki/Nilia_Pygmy", ""],
        rarity: "Normal",
        habitat: ["Alpine"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Pygmy Dragon",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Pargulus Pygmy", ""],
        egg: ["This tiny egg resembles a seed.", ""],
        wiki_path: ["/wiki/Pargulus_Pygmy", ""],
        rarity: "未知稀有度",
        habitat: ["Alpine", "Coast", "Desert", "Forest", "Jungle", "Volcano"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Pygmy Dragon",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Pipio Pygmy", "咕啾侏儒龙"],
        egg: [
          "This little egg is soft with a few feathers stuck to it.",
          "这颗轻柔的蛋上黏了些羽毛。",
        ],
        wiki_path: [
          "/wiki/Pipio_Pygmy",
          "/zh/wiki/%E5%92%95%E5%95%BE%E4%BE%8F%E5%84%92%E9%BE%8D",
        ],
        rarity: "Normal",
        habitat: ["Alpine", "Coast", "Desert", "Forest", "Jungle", "Volcano"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Pygmy Dragon",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Red-Tailed Wyrm Pygmy", "红尾长龙"],
        egg: [
          "This tiny egg has a bold red streak on it.",
          "这颗小蛋上面有道醒目的红色凸起。",
        ],
        wiki_path: [
          "/wiki/Red-Tailed_Wyrm_Pygmy",
          "/zh/wiki/%E7%B4%85%E5%B0%BE%E9%95%B7%E9%BE%8D",
        ],
        rarity: "Normal",
        habitat: ["Desert", "Forest", "Jungle"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Pygmy Dragon",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Scymrian Pygmy", ""],
        egg: ["This tiny egg flashes in the sunlight.", ""],
        wiki_path: ["/wiki/Scymrian_Pygmy", ""],
        rarity: "未知稀有度",
        habitat: ["Alpine", "Coast", "Desert", "Forest", "Jungle", "Volcano"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Pygmy Dragon",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Seawyrm Pygmy", "侏儒海龙"],
        egg: ["This tiny egg shines like a pearl.", "这颗小蛋有珍珠的光泽。"],
        wiki_path: ["/wiki/Seawyrm_Pygmy", ""],
        rarity: "Normal",
        habitat: ["Coast"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Pygmy Dragon",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Glaucus Drake", "海神德雷克"],
        egg: ["This striped egg feels moist.", "这颗条纹蛋感觉很潮湿。"],
        wiki_path: ["/wiki/Glaucus_Drake", ""],
        rarity: "Normal",
        habitat: ["Coast"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Drake",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Greater Spotted Drake", "大斑德雷克"],
        egg: [
          "This egg is speckled with rosette-like markings.",
          "这颗蛋布满了玫瑰花纹般的班点。",
        ],
        wiki_path: [
          "/wiki/Greater_Spotted_Drake",
          "/zh/wiki/%E5%A4%A7%E6%96%91%E5%BE%B7%E9%9B%B7%E5%85%8B",
        ],
        rarity: "Normal",
        habitat: ["Forest"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Drake",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Honey Drake", "蜂蜜德雷克"],
        egg: [
          "This egg is covered in tiny golden scales.",
          "这颗蛋布满小小的黄金麟片。",
        ],
        wiki_path: [
          "/wiki/Honey_Drake",
          "/zh/wiki/%E8%9C%82%E8%9C%9C%E5%BE%B7%E9%9B%B7%E5%85%8B",
        ],
        rarity: "Normal",
        habitat: ["Coast", "Forest", "Jungle"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Drake",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Howler Drake", "咆啸德雷克"],
        egg: [
          "You hear strange noises coming from inside this egg.",
          "你听到奇怪的声音从这颗蛋里传出。",
        ],
        wiki_path: ["/wiki/Howler_Drake", ""],
        rarity: "Normal",
        habitat: ["Jungle"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Drake",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Moonglow Drake", "夜耀德雷克"],
        egg: [
          "This egg displays the colors of both dawn and dusk.",
          "这颗蛋呈现出昼与夜的颜色。",
        ],
        wiki_path: ["/wiki/Moonglow_Drake", ""],
        rarity: "未知稀有度",
        habitat: ["Forest"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Drake",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Morphodrake", "闪蝶德雷克"],
        egg: [
          "A few bright markings decorate this egg’s shell.",
          "有些亮眼的斑点装饰了这颗蛋的壳。",
        ],
        wiki_path: [
          "/wiki/Morphodrake",
          "/zh/wiki/%E9%96%83%E8%9D%B6%E5%BE%B7%E9%9B%B7%E5%85%8B",
        ],
        rarity: "Normal",
        habitat: ["Jungle"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Drake",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Ochredrake", "赭黄德雷克"],
        egg: ["This egg has strange markings on it.", "这颗蛋上有奇怪的花纹。"],
        wiki_path: ["/wiki/Ochredrake", ""],
        rarity: "Normal",
        habitat: ["Forest"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Drake",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Pseudo-wyvern Drake", ""],
        egg: ["It almost looks like there are claw marks on this egg.", ""],
        wiki_path: ["/wiki/Pseudo-wyvern_Drake", ""],
        rarity: "未知稀有度",
        habitat: ["Desert"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Drake",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Sabertooth Bull Drake", ""],
        egg: ["This striped egg is surprisingly heavy.", ""],
        wiki_path: ["/wiki/Sabertooth_Bull_Drake", ""],
        rarity: "未知稀有度",
        habitat: ["Volcano"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Drake",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Spotted Teal Drake", ""],
        egg: ["You almost didn’t see this egg among the plants.", ""],
        wiki_path: ["/wiki/Spotted_Teal_Drake", ""],
        rarity: "未知稀有度",
        habitat: [],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Drake",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Sunbeam Drake", ""],
        egg: ["This egg displays the colors of both dawn and dusk.", ""],
        wiki_path: ["/wiki/Sunbeam_Drake", ""],
        rarity: "未知稀有度",
        habitat: ["Forest"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Drake",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Tarantula Hawk Drake", "沙漠蛛蜂德雷克"],
        egg: [
          "A delicate web-like pattern decorates this egg’s shell.",
          "精致的网状图案妆点了这颗蛋的壳。",
        ],
        wiki_path: [
          "/wiki/Tarantula_Hawk_Drake",
          "/zh/wiki/%E6%B2%99%E6%BC%A0%E8%9B%9B%E8%9C%82%E5%BE%B7%E9%9B%B7%E5%85%8B",
        ],
        rarity: "Normal",
        habitat: ["Desert"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Drake",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Tatterdrake", "碎裂德雷克"],
        egg: ["This egg has a rough shell.", "这颗蛋有著粗糙的壳。"],
        wiki_path: [
          "/wiki/Tatterdrake",
          "/zh/wiki/%E7%A2%8E%E8%A3%82%E5%BE%B7%E9%9B%B7%E5%85%8B",
        ],
        rarity: "Normal",
        habitat: ["Forest", "Jungle"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Drake",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Vremya Drake", "时间德雷克"],
        egg: [
          "This smooth green egg looks vaguely familiar.",
          "这颗平滑的绿蛋似曾相识。",
        ],
        wiki_path: [
          "/wiki/Vremya_Drake",
          "/zh/wiki/%E6%99%82%E9%96%93%E5%BE%B7%E9%9B%B7%E5%85%8B",
        ],
        rarity: "Normal",
        habitat: ["Forest"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Drake",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Blue Dino", "蓝恐龙"],
        egg: [
          "This egg looks like it doesn’t belong; it is brightly colored with white spots. It’s much lighter than the other eggs.",
          "这颗蛋看起来不属于这里；它有鲜艳的白斑，而且比其他蛋轻太多了。",
        ],
        wiki_path: ["/wiki/Blue_Dino", ""],
        rarity: "Other",
        habitat: ["Jungle"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Non-dragon",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Cheese", "起司龙"],
        egg: [
          "This egg is soft and smells uncannily like cheese.",
          "这颗蛋是柔软的而且气味与乳酪惊人地相似。",
        ],
        wiki_path: ["/wiki/Cheese_Dragon", ""],
        rarity: "SuperRare",
        habitat: ["Alpine", "Coast", "Desert", "Forest", "Jungle", "Volcano"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Non-dragon",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Chicken", "鸡"],
        egg: [
          "This egg is much smaller than the others.",
          "这颗蛋比其他的更小。",
        ],
        wiki_path: ["/wiki/Chicken", "/zh/wiki/%E9%9B%9E"],
        rarity: "Other",
        habitat: ["Alpine", "Coast", "Desert", "Forest", "Jungle", "Volcano"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Non-dragon",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Green Dino", "绿恐龙"],
        egg: [
          "This egg looks like it doesn’t belong; it is brightly colored with white spots.",
          "这颗蛋看起来不属于这里；它颜色鲜亮并有白色斑点。",
        ],
        wiki_path: ["/wiki/Green_Dino", ""],
        rarity: "Other",
        habitat: ["Jungle"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Non-dragon",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Paper", "纸龙"],
        egg: [
          "This egg is tiny and made out of several pieces of paper folded together.",
          "这颗蛋很小，由几张纸叠在一起。",
        ],
        wiki_path: ["/wiki/Paper_Dragon", ""],
        rarity: "SuperRare",
        habitat: ["Alpine", "Coast", "Desert", "Forest", "Jungle", "Volcano"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Non-dragon",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Purple Dino", "紫恐龙"],
        egg: [
          "This egg looks like it doesn’t belong; it is brightly colored with white spots. It’s much lighter than the other eggs.",
          "这颗蛋看起来不属于这里；它有鲜艳的白斑，而且比其他蛋轻太多了。",
        ],
        wiki_path: ["/wiki/Purple_Dino", ""],
        rarity: "Other",
        habitat: ["Jungle"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Non-dragon",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Red Dino", "红恐龙"],
        egg: [
          "This egg looks like it doesn’t belong; it is brightly colored with white spots. It’s much warmer than the rest of the eggs.",
          "这颗蛋看起来不属于这里；它颜色鲜亮并有白色斑点。它比其馀的蛋暖和很多。",
        ],
        wiki_path: ["/wiki/Red_Dino", ""],
        rarity: "Other",
        habitat: ["Jungle"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Non-dragon",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Yellow Dino", "黄恐龙"],
        egg: [
          "This egg looks like it doesn’t belong; it is brightly colored with white spots. It’s much heavier than the other eggs.",
          "这颗蛋看起来不属于这里；它颜色鲜亮并有白色斑点。它比其他的蛋重很多。",
        ],
        wiki_path: ["/wiki/Yellow_Dino", ""],
        rarity: "Other",
        habitat: ["Jungle"],
        bsa: "未知种族特性技能",
        elemental: ["主要元素亲和力", "次要元素亲和力"],
        morphology: "Non-dragon",
        release_at: "未知发布日期",
        sprites: {
          egg: [""],
          adult: [""],
        },
      },
      {
        breed: ["Valentine Dragon", "瓦伦泰龙"],
        egg: [
          "This egg is speckled and very fragile.",
          "这颗附着着斑点的蛋非常脆弱。",
        ],
        wiki_path: ["/wiki/Valentine_Dragon", ""],
        rarity: "Holiday",
        habitat: [],
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
        breed: ["Sweetling", "甜心龙"],
        egg: ["This egg looks delicate and sweet.", "这颗蛋看起来精致而甜美。"],
        wiki_path: ["/wiki/Sweetling", ""],
        rarity: "SuperRare",
        habitat: [],
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
        breed: ["Rosebud Dragon", "玫瑰花蕾龙"],
        egg: [
          "This sweet smelling egg is covered by a ribbon.",
          "这颗甜蜜的蛋系着一根丝带。",
        ],
        wiki_path: ["/wiki/Rosebud_Dragon", ""],
        rarity: "Holiday",
        habitat: [],
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
        breed: ["Heartseeker Dragon", "觅心龙"],
        egg: [
          "This scarlet egg has a faintly sweet aroma.",
          "这深红色的蛋有淡淡的甜香。",
        ],
        wiki_path: ["/wiki/Heartseeker_Dragon", ""],
        rarity: "Holiday",
        habitat: [],
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
        breed: ["Arsani Dragon", "阿莎妮龙"],
        egg: ["This egg is a deep pink.", "这颗蛋是深粉色的。"],
        wiki_path: ["/wiki/Arsani_Dragon", ""],
        rarity: "Holiday",
        habitat: [],
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
        breed: ["Radiant Angel Dragon", "辉煌天使龙"],
        egg: [
          "This radiant white egg has red and gold swirls on it.",
          "这颗发光的白色蛋上有红色与金色的涡形。",
        ],
        wiki_path: ["/wiki/Radiant_Angel_Dragon", ""],
        rarity: "Holiday",
        habitat: [],
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
        breed: ["Heartstealing Dragon", "偷心龙"],
        egg: [
          "This egg is so shiny it makes you want to take it.",
          "这颗富有光泽的蛋令你忍不住想要将它据为己有。",
        ],
        wiki_path: ["/wiki/Heartstealing_Dragon", ""],
        rarity: "Holiday",
        habitat: [],
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
        breed: ["Mutamore Dragon", "穆塔莫龙"],
        egg: [
          "This lovely egg has rolled off to the side.",
          "这颗可爱的蛋滚到一边去了。",
        ],
        wiki_path: [
          "/wiki/Mutamore_Dragon",
          "/zh/wiki/%E7%A9%86%E5%A1%94%E8%8E%AB%E9%BE%8D",
        ],
        rarity: "Holiday",
        habitat: [],
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
        breed: ["Soulstone Dragon", "灵魂石龙"],
        egg: [
          "This deep purple egg shimmers like a pearl.",
          "这颗深紫色的蛋如珍珠般闪烁著。",
        ],
        wiki_path: [
          "/wiki/Soulstone_Dragon",
          "/zh/wiki/%E9%9D%88%E9%AD%82%E7%9F%B3%E9%BE%8D",
        ],
        rarity: "Holiday",
        habitat: [],
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
        breed: ["Floral-Crowned Dragon", "花冠龙"],
        egg: [
          "This egg has a sweet, floral scent.",
          "这颗蛋散发著甜美的花香。",
        ],
        wiki_path: [
          "/wiki/Floral-Crowned_Dragon",
          "/zh/wiki/%E8%8A%B1%E5%86%A0%E9%BE%8D",
        ],
        rarity: "Holiday",
        habitat: [],
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
        breed: ["Sakuhana Wyvern", "花绽双足翼龙"],
        egg: [
          "This warm egg is surrounded by plants.",
          "这颗温暖的蛋被植物环绕著。",
        ],
        wiki_path: [
          "/wiki/Sakuhana_Wyvern",
          "/zh/wiki/%E8%8A%B1%E7%B6%BB%E9%9B%99%E8%B6%B3%E7%BF%BC%E9%BE%8D",
        ],
        rarity: "Holiday",
        habitat: [],
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
        breed: ["Erador Lindwyrm", "爱拉托麟龙"],
        egg: [
          "This regal egg feels oddly light.",
          "这颗华丽的蛋轻得令人难以置信。",
        ],
        wiki_path: ["/wiki/Erador_Lindwyrm", ""],
        rarity: "Holiday",
        habitat: [],
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
        breed: ["Amarignis Dragon", ""],
        egg: [
          "Dim flames spark up from this egg whenever joy sparks up in you.",
          "",
        ],
        wiki_path: ["/wiki/Amarignis_Dragon", ""],
        rarity: "Holiday",
        habitat: [],
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
        breed: ["Vermeil Dragon", ""],
        egg: ["This egg smells pleasantly floral, maybe fruity.", ""],
        wiki_path: ["/wiki/Vermeil_Dragon", ""],
        rarity: "Holiday",
        habitat: [],
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
        breed: ["Vampire Dragon", ""],
        egg: ["This egg is stone cold and smells rotten.", ""],
        wiki_path: ["/wiki/Vampire_Dragon", ""],
        rarity: "Holiday",
        habitat: [],
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
        breed: ["Pumpkin Dragon", "南瓜龙"],
        egg: [
          "This egg smells like the autumn harvest.",
          "这颗蛋闻起来有丰收的味道。",
        ],
        wiki_path: ["/wiki/Pumpkin_Dragon", ""],
        rarity: "Holiday",
        habitat: [],
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
        breed: ["Black Marrow", "黑髓龙"],
        egg: [
          "This egg is covered in a dark crust.",
          "这颗蛋被黑暗的外壳覆盖。",
        ],
        wiki_path: [
          "/wiki/Black_Marrow",
          "/zh/wiki/%E9%BB%91%E9%AB%93%E9%BE%8D",
        ],
        rarity: "Holiday",
        habitat: [],
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
        breed: ["Shadow Walker", "影行龙"],
        egg: ["This egg fades into the shadows.", "这颗蛋湮没在阴影中。"],
        wiki_path: ["/wiki/Shadow_Walker", ""],
        rarity: "Holiday",
        habitat: [],
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
        breed: ["Cavern Lurker Dragon", "蛰窟龙"],
        egg: [
          "This egg is wedged in a dark corner.",
          "这颗蛋楔在一个黑暗的角落里。",
        ],
        wiki_path: [
          "/wiki/Cavern_Lurker_Dragon",
          "/zh/wiki/%E8%9F%84%E7%AA%9F%E9%BE%8D",
        ],
        rarity: "Holiday",
        habitat: [],
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
        breed: ["Grave Dragon", "墓穴龙"],
        egg: [
          "This egg appears to have an evil grin.",
          "这颗蛋似乎露出了邪恶的笑容。",
        ],
        wiki_path: ["/wiki/Grave_Dragon", ""],
        rarity: "Holiday",
        habitat: [],
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
        breed: ["Desipis Dragon", "德西比斯龙"],
        egg: [
          "Being near this egg makes it hard to think clearly.",
          "一靠近这颗蛋就让人思绪紊乱。",
        ],
        wiki_path: [
          "/wiki/Desipis_Dragon",
          "/zh/wiki/%E5%BE%B7%E8%A5%BF%E6%AF%94%E6%96%AF%E9%BE%8D",
        ],
        rarity: "Holiday",
        habitat: [],
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
        breed: ["Caligene Dragon", "暗龙"],
        egg: [
          "The pattern on this egg’s shell is unsettling.",
          "这颗蛋上的花纹令人不安…",
        ],
        wiki_path: ["/wiki/Caligene_Dragon", "/zh/wiki/%E9%97%87%E9%BE%8D"],
        rarity: "Holiday",
        habitat: [],
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
        breed: ["Witchlight Dragon", "魔光龙"],
        egg: [
          "This downy egg is hidden in brambles.",
          "这颗毛茸茸的蛋藏在荆棘里。",
        ],
        wiki_path: [
          "/wiki/Witchlight_Dragon",
          "/zh/wiki/%E9%AD%94%E5%85%89%E9%BE%8D",
        ],
        rarity: "Holiday",
        habitat: [],
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
        breed: ["Omen Wyrm", "恶兆龙"],
        egg: [
          "This warm egg is tangled in the roots of a dead tree.",
          "这颗温暖的蛋被枯木的树根裹著。",
        ],
        wiki_path: ["/wiki/Omen_Wyrm", "/zh/wiki/%E6%83%A1%E5%85%86%E9%BE%8D"],
        rarity: "Holiday",
        habitat: [],
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
        breed: ["Arcana Dragon", "阿尔克那龙"],
        egg: [
          "This egg has reflective spots that remind you of gems, or eyes.",
          "这蛋上会反光的斑点使你想到了钻石，或眼睛。",
        ],
        wiki_path: [
          "/wiki/Arcana_Dragon",
          "/zh/wiki/%E9%98%BF%E7%88%BE%E5%85%8B%E9%82%A3%E9%BE%8D",
        ],
        rarity: "Holiday",
        habitat: [],
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
        breed: ["Kohraki Dragon", "柯拉奇龙"],
        egg: [
          "A fine mist rolls over this cool, scaly egg.",
          "浓密的厚雾包裹著这颗冰冷可怖的蛋。",
        ],
        wiki_path: [
          "/wiki/Kohraki_Dragon",
          "/zh/wiki/%E6%9F%AF%E6%8B%89%E5%A5%87%E9%BE%8D",
        ],
        rarity: "Holiday",
        habitat: [],
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
        breed: ["Pitfire Dragon", ""],
        egg: ["Dead leaves obscure this egg’s scratched shell.", ""],
        wiki_path: ["/wiki/Pitfire_Dragon", ""],
        rarity: "Holiday",
        habitat: [],
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
        breed: ["Iridichi Dragon", ""],
        egg: [
          "Your eyes struggle to completely focus on the light coming through this cloudy egg.",
          "",
        ],
        wiki_path: ["/wiki/Iridichi_Dragon", ""],
        rarity: "Holiday",
        habitat: [],
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
        breed: ["Holly Dragon", "冬青龙"],
        egg: [
          "This egg has a holly leaf stuck to it.",
          "这颗蛋上卡着一片冬青叶。",
        ],
        wiki_path: ["/wiki/Holly_Dragon", ""],
        rarity: "Holiday",
        habitat: [],
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
        breed: ["Yulebuck", "圣诞鹿龙"],
        egg: [
          "This egg is covered with bright, festive stripes.",
          "这颗蛋有着明亮的节日花纹。",
        ],
        wiki_path: ["/wiki/Yulebuck", ""],
        rarity: "Holiday",
        habitat: [],
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
        breed: ["Snow Angel", "雪天使龙"],
        egg: [
          "This egg fills you with holiday cheer.",
          "这颗蛋使你充满节日的喜乐。",
        ],
        wiki_path: ["/wiki/Snow_Angel", ""],
        rarity: "Holiday",
        habitat: [],
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
        breed: ["Ribbon Dancer", "缎带舞者龙"],
        egg: [
          "This egg shines like a holiday ribbon.",
          "这颗蛋耀眼得像是节日彩带。",
        ],
        wiki_path: ["/wiki/Ribbon_Dancer", ""],
        rarity: "Holiday",
        habitat: [],
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
        breed: ["Blizzard Wizard", "冬贤龙"],
        egg: [
          "This colorful egg is covered by a light layer of snow.",
          "这颗五彩缤纷的蛋被一层薄雪覆盖着。",
        ],
        wiki_path: ["/wiki/Blizzard_Wizard", ""],
        rarity: "Holiday",
        habitat: [],
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
        breed: ["Wrapping-Wing", "彩纸龙"],
        egg: [
          "This egg has a rich, shiny pattern on it.",
          "这颗蛋有个丰富、闪亮的花样。",
        ],
        wiki_path: ["/wiki/Wrapping-Wing", ""],
        rarity: "Holiday",
        habitat: [],
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
        breed: ["Solstice Dragon", "冬至龙"],
        egg: [
          "This egg emits a soft, heartwarming glow.",
          "这颗蛋会发出柔和、温馨的光芒。",
        ],
        wiki_path: ["/wiki/Solstice_Dragon", ""],
        rarity: "Holiday",
        habitat: [],
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
        breed: ["Mistletoe Dragon", "榭寄生龙"],
        egg: [
          "This colorful egg gleams in the light.",
          "这颗缤纷的蛋在光芒下闪闪发光。",
        ],
        wiki_path: ["/wiki/Mistletoe_Dragon", ""],
        rarity: "Holiday",
        habitat: [],
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
        breed: ["Aegis Dragon", "庇护之龙"],
        egg: [
          "A wintry chill swirls just beneath the surface of this egg.",
          "冰冷的寒气在蛋里旋转。",
        ],
        wiki_path: [
          "/wiki/Aegis_Dragon",
          "/zh/wiki/%E5%BA%87%E8%AD%B7%E4%B9%8B%E9%BE%8D",
        ],
        rarity: "Holiday",
        habitat: [],
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
        breed: ["Snow Dragon", "雪龙"],
        egg: ["This egg is surrounded by frost.", "这颗蛋被冰霜包裹。"],
        wiki_path: ["/wiki/Snow_Dragon", "/zh/wiki/%E9%9B%AA%E9%BE%8D"],
        rarity: "Holiday",
        habitat: [],
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
        breed: ["Garland Dragon", "花环龙"],
        egg: [
          "This festive egg gives off comforting warmth.",
          "这颗喜庆的蛋带给人舒适的温暖。",
        ],
        wiki_path: [
          "/wiki/Garland_Dragon",
          "/zh/wiki/%E8%8A%B1%E7%92%B0%E9%BE%8D",
        ],
        rarity: "Holiday",
        habitat: [],
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
        breed: ["Starsinger Dragon", "吟星龙"],
        egg: [
          "This egg glows with a soft, soothing light.",
          "这颗蛋上发出抚慰人心的暖光。",
        ],
        wiki_path: [
          "/wiki/Starsinger_Dragon",
          "/zh/wiki/%E5%90%9F%E6%98%9F%E9%BE%8D",
        ],
        rarity: "Holiday",
        habitat: [],
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
        breed: ["Wintertide Dragon", "玄英龙"],
        egg: [
          "This egg emanates a gentle chime when met with the winter breeze.",
          "每当有冬季微风吹拂而过，这颗蛋就会发出轻柔的敲钟声。",
        ],
        wiki_path: [
          "/wiki/Wintertide_Dragon",
          "/zh/wiki/%E7%8E%84%E8%8B%B1%E9%BE%8D",
        ],
        rarity: "Holiday",
        habitat: [],
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
        breed: ["Glystere Wyrm", ""],
        egg: ["Colorful light twinkles within this frozen egg.", ""],
        wiki_path: ["/wiki/Glystere_Wyrm", ""],
        rarity: "Holiday",
        habitat: [],
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
        breed: ["Pryanost Lindwyrm", ""],
        egg: ["This warm brown egg smells faintly of spices.", ""],
        wiki_path: ["/wiki/Pryanost_Lindwyrm", ""],
        rarity: "Holiday",
        habitat: [],
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
    Tips = {
      random: [
        "欧皇吃我一矛",
        "抱走干嘛 楞着啊",
        "这是活动独占 你在犹豫什么？",
      ],
    };
    getByRarity(want_rarity) {
      want_rarity = ["Rare", "SuperRare"].includes(want_rarity)
        ? want_rarity
        : "Normal";
      return this.DragonDataBase.filter(
        (dragon) => dragon.rarity === want_rarity
      );
    }
    getByEgg(desc) {
      let res = this.DragonDataBase.filter((dragon) => dragon.egg[0] === desc);
      return res && res.length > 0 ? res[0] : null;
    }
    genDragonHTML(dragon) {
      let html = `<a href="${this.WikiURL}${dragon.wiki_path[0].replaceAll(
        " ",
        "_"
      )}" target="_blank">${dragon.breed[0]}</a><br>`;
      if (dragon.breed[1] === "") {
        html +=
          '<a style="pointer-events: none; text-decoration: none;">&nbsp;</a>';
      } else {
        if (dragon.wiki_path[1] === "") {
          html += `<a style="pointer-events: none; text-decoration: none;">${dragon.breed[1]}</a>`;
        } else {
          html += `<a href="${this.WikiURL}${dragon.wiki_path[1]}" target="_blank">${dragon.breed[1]}</a>`;
        }
      }
      return html;
    }
    match(dragon, wishlist) {
      for (const key in dragon) {
        if (Object.hasOwnProperty.call(dragon, key)) {
          for (const keyword of wishlist) {
            if (typeof dragon[key] === "object" && dragon[key].length > 0) {
              for (const property of dragon[key]) {
                if (property === keyword) return true;
              }
            } else if (dragon[key] === keyword) {
              return true;
            }
          }
        }
      }
      return false;
    }
  }

  const DTS = new DragonTrainingSpellbook();

  const renderWishlist = () => {
    let Eggs = document.querySelectorAll(".eggs > *");
    //let Paragraphs = document.querySelectorAll("#middle p");
    let Abandoned = document.querySelectorAll(".ap > div");
    console.info("[DTS] 《驯龙魔典》飘浮到半空中，伴随耀眼的光芒缓缓转动。");

    if (Eggs.length > 0) {
      [...Eggs].forEach((item) => {
        let dragon = DTS.getByEgg(item.textContent);
        if (dragon === null) return;
        //TODO 直接替换未知蛋的图像
        //console.log("[DEBUG]", dragon, item);
        item.querySelector("a > img").title =
          DTS.Tips.random[
            parseInt(Math.random() * DTS.Tips.random.length, 10)
          ] + " (当前提示为随机生成 仅供演示用途 请勿当真)";
        let title_node = document.createElement("div");
        title_node.innerHTML = DTS.genDragonHTML(dragon);
        item.insertBefore(title_node, item.querySelector("a"));
        item.querySelector("span").innerHTML += `<br>${dragon.egg[1]}`;
        if (DTS.match(dragon, Wishlist)) {
          item.style.backgroundColor = DTS.Color.Expect;
          console.info("[DTS] 发现寻觅中的种群 背景已标记为青柠色", dragon);
        }
        switch (dragon.rarity) {
          case "Holiday":
            title_node.style.cssText = `margin-bottom: 1rem; background-color: ${DTS.Color.Holiday};`;
            item.style.fontWeight = "bold";
            console.info("[DTS] 发现节日独占", dragon);
            break;
          case "Other":
            title_node.style.cssText = `margin-bottom: 1rem; background-color: ${DTS.Color.Other};`;
            item.style.fontStyle = "italic";
            console.info("[DTS] 发现非龙生物", dragon);
            break;
          case "SuperRare":
            title_node.style.cssText = `margin-bottom: 1rem; background-color: ${DTS.Color.SuperRare};`;
            item.style.fontWeight = "bold";
            console.info("[DTS] 发现超稀有种", dragon);
            break;
          case "Rare":
            title_node.style.cssText = `margin-bottom: 1rem; background-color: ${DTS.Color.Rare};`;
            console.info("[DTS] 发现稀有种", dragon);
          case "NotNormal":
            title_node.style.cssText = `margin-bottom: 1rem; background-color: ${DTS.Color.NotNormal};`;
            console.info("[DTS] 发现不常见种", dragon);
            break;
          case "Normal":
            title_node.style.cssText = `margin-bottom: 1rem; background-color: ${DTS.Color.Normal};`;
            console.info("[DTS] 发现常见种", dragon);
            break;
          case "未知稀有度":
            title_node.style.cssText = `margin-bottom: 1rem;`;
            break;
          default:
            console.info(
              "[DTS] 发现未知品种（好吧其实是出错了），请联系作者反应问题。",
              item
            );
            break;
        }
      });
    } else if (Abandoned.length > 0) {
      let dragon = {
        breed: ["Test", ""],
        egg: [
          "This crystalline egg almost looks like you could reach into its depths.",
          "这颗结晶化的蛋似是能让你看透其内侧。",
        ],
        wiki_path: ["/wiki/Egg/Identification_guide", ""],
        rarity: "稀有度",
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
      Abandoned.forEach((item) => {
        item.querySelector("img").title = item
          .querySelector("img")
          .src.replace("https://dragcave.net/images/", "");
        let title_node = document.createElement("div");
        //item.style.backgroundColor = DTS.Color.Normal;
        title_node.innerHTML = `<a href="${DTS.WikiURL}${dragon.wiki_path[0]}" target="_blank" style="width: 100%; height: auto; background-color: ${DTS.Color.Normal}; margin-top: 1rem;">${dragon.breed[0]}</a>`;
        if (dragon.breed[1] === "") {
          title_node.innerHTML += `<a style="pointer-events: none; width: 100%; height: auto; background-color: ${DTS.Color.Normal};">&nbsp;</a>`;
        } else {
          if (dragon.wiki_path[1] === "") {
            title_node.innerHTML += `<a style="pointer-events: none; width: 100%; height: auto; background-color: ${DTS.Color.Normal};">${dragon.breed[1]}</a>`;
          } else {
            title_node.innerHTML += `<a href="${DTS.WikiURL}${dragon.wiki_path[1]}" target="_blank" style="width: 100%; height: auto; background-color: ${DTS.Color.Normal};">${dragon.breed[1]}</a>`;
          }
        }
        item.insertBefore(title_node, item.querySelector("a"));
      });
    }
    console.info("[DTS] 《驯龙魔典》光芒渐弱，并逐渐变得静止。");
  };

  const main = () => {
    let GuiContainer = document.createElement("div");
    GuiContainer.style.cssText =
      "position: fixed; left: 5vw; top: 20vh; width: 360px; border-radius: 5px; box-shadow: 0 0 1rem 0 rgba(0, 0, 0, .2); background-color: rgba(255, 255, 255, .3); backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(16px); z-index: 999; font-family: 'Noto Sans SC';";
    document.body.append(GuiContainer);
    let GUI = document.createElement("div");
    GUI.style.cssText =
      "display: flex; flex-direction: column; align-items: stretch; align-content: stretch; flex-wrap: wrap; margin: 1rem;";
    GuiContainer.append(GUI);

    let title = document.createElement("div");
    title.innerText = "《驯龙魔典》散发着辉光";
    title.style.cssText =
      "font-size: 1.5rem; text-shadow: 0 0 10px red, 0 0 20px red, 0 0 30px red, 0 0 40px red; text-align: center;";
    GUI.append(title);

    let creatureCounter = {};
    for (const key in DTS.RarityName) {
      if (Object.hasOwnProperty.call(DTS.RarityName, key)) {
        creatureCounter[key] = 0;
      }
    }
    DTS.DragonDataBase.forEach((dragon) => {
      if (Object.hasOwnProperty.call(creatureCounter, dragon.rarity)) {
        creatureCounter[dragon.rarity] += 1;
      }
    });
    let rarity_tips = "";
    for (const kind in creatureCounter) {
      if (Object.hasOwnProperty.call(creatureCounter, kind)) {
        rarity_tips += `<span style="color: ${DTS.Color[kind]}">${DTS.RarityName[kind]}</span> ${creatureCounter[kind]} 种<br>`;
      }
    }
    let subTitle = document.createElement("div");
    subTitle.innerHTML = `当前收录了 ${DTS.DragonDataBase.length} 种神奇生物：<br>${rarity_tips}`;
    subTitle.style.cssText = "margin: 1rem 0;";
    GUI.append(subTitle);

    let content = document.createElement("div");
    // content.style.cssText = "height: 20vh;";
    GUI.append(content);

    let wishlistDiv = document.createElement("div");
    wishlistDiv.innerText = `愿望单：\n${Wishlist.join("\n")}`;
    wishlistDiv.style.cssText = `margin-bottom: 1rem; color: ${DTS.Color.Expect}`;
    content.append(wishlistDiv);

    let footer = document.createElement("div");
    footer.style.cssText = "";
    content.append(footer);
    let btn = document.createElement("button");
    btn.innerHTML = "奇怪的按钮";
    btn.style.cssText = `margin-top: 1rem;`;
    btn.onclick = function () {
      alert("点击了奇怪的按钮，什么都没有发生。");
    };
    footer.append(btn);
    let btns = document.createElement("div");
    btns.innerHTML = `<a href="${DTS.WikiURL}/wiki/Egg/Identification_guide" target="_blank">英文龙蛋清单</a>&emsp;`;
    btns.innerHTML += `<a href="${DTS.WikiURL}/zh/wiki/龍蛋種類" target="_blank">中文龙蛋清单(有缺失)</a><br>`;
    btns.innerHTML += `<a href="https://dc.evinext.com/" target="_blank">孵化室 DragHatch</a>&emsp;`;
    btns.innerHTML +=
      '<span id="clickable-span-id" style="cursor: pointer; text-decoration: underline;">检查更新</span>&emsp;';
    btns.innerHTML +=
      '<span class="clickable-span-class" style="cursor: pointer; text-decoration: underline;">反馈 BUG</span>';
    btns.onclick = function (event) {
      if (event.target.id == "clickable-span-id") {
        alert("「检查更新」功能尚未完成。");
      } else if (event.target.className == "clickable-span-class") {
        alert("「反馈 BUG」功能尚未完成。");
      }
    };
    footer.append(btns);
  };

  main();
  renderWishlist(Wishlist);
})();
