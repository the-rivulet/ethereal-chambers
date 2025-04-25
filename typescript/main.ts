let getId = (x: string) => document.getElementById(x) as HTMLElement;
let choice = function<T>(array: T[]) { return array[Math.floor(Math.random() * array.length)]; };

/** Move all the tooltips to follow the user's mouse */
function doTooltips(m: MouseEvent) {
  for(let i of Array.from(document.getElementsByClassName("tool")).map(x => x.firstElementChild) as HTMLElement[]) {
    i.style.top = m.y + "px";
    i.style.left = m.x + "px";
  }
}
document.onmousemove = doTooltips;

let activeMenu = "main-menu";
/**
 * Change to a different menu, hiding the current one.
 * @param newMenu The ID of the menu to switch to.
 */
function switchMenu(newMenu: string) {
  getId(activeMenu).style.top = "-100%";
  getId(newMenu).style.top = "0%";
}

/** A clickable option in a menu. */
interface Option {
  name: string;
  click: () => void;
}

/** A scene containing some description text and options. */
class Scene {
  title: string | (() => string);
  description: string | (() => string);
  options: Option[];
  constructor(title: string | (() => string), desc: string | (() => string), options: Option[] = []) {
    this.title = title;
    this.description = desc;
    this.options = options;
  }
  load() {
    activeScene = this;
    getId("core-menu").style.opacity = "0";
    setTimeout(() => {
      getId("scene-title").innerHTML = typeof this.title == "string" ? this.title : this.title();
      getId("scene-description").innerHTML = typeof this.description == "string" ? this.description : this.description();
      getId("scene-options").textContent = "";
      for(let i = 0; i < this.options.length; i++) {
        let el = document.createElement("div");
        el.id = "scene-option-" + i;
        let opt = this.options[i];
        el.textContent = opt.name;
        el.onclick = opt.click;
        getId("scene-options").appendChild(el);
      }
      getId("core-menu").style.opacity = "1";
    }, 510);
  }
}
let activeScene: Scene;

let settingsButton = getId("settings-button"), settings = getId("settings"), showingSettings = false;
let changesButton = getId("changelog-button"), changes = getId("changelog"), showingChanges = false;
settingsButton.onclick = function() {
  if(showingSettings) {
    showingSettings = false;
    settings.style.height = "0px";
    settingsButton.classList.remove("selected");
  } else {
    showingSettings = true;
    settings.style.height = "50px";
    settingsButton.classList.add("selected");
    if(showingChanges) {
      showingChanges = false;
      changes.style.height = "0px";
      changesButton.classList.remove("selected");
    }
  }
}
changesButton.onclick = function() {
  if(showingChanges) {
    showingChanges = false;
    changes.style.height = "0px";
    changesButton.classList.remove("selected");
  } else {
    showingChanges = true;
    changes.style.height = "200px";
    changesButton.classList.add("selected");
    if(showingSettings) {
      showingSettings = false;
      settings.style.height = "0px";
      settingsButton.classList.remove("selected");
    }
  }
}

/** A procedurally generated "language". */
class ProceduralLanguage {
  /** The list of words. */
  rootList = {};
  /** The chance that a word will actually include its root, if it has one. */
  useRootChance: number;
  /** Whether words with roots will have the root at the start of the word. */
  rootsGoFirst: boolean;
  /** The order to organize words within a sentence. */
  wordOrder: "svoi" | "soiv" | "sovi" | "osvi";
  /** Whether modifiers should go before the things they modify. */
  adjectivesGoFirst: boolean;
  /** Whether yes-no questions should have their subject and verb swapped (e.g. you are Rivu -> are you Rivu). */
  questionsReverseOrder: boolean;
  /** Words that have a guess. */
  wordsKnown = {};
  /**
   * Use this procedural language to encode a sentence.
   * @param sub Sentence's subject.
   * @param ver Sentence's verb.
   * @param obj Sentence's object.
   * @param yesNo Whether the sentence is a yes or no question.
   * @returns The translated sentence.
   */
  translate(sub: string, ver = "", obj = "", iobj = "", yesNo = false) {
    let result: string[] = [];
    let flip = yesNo && this.questionsReverseOrder;
    for(let i = 0; i <= 3; i++) {
      let original = this.wordOrder[i] == "s" ? (flip ? ver : sub) : this.wordOrder[i] == "v" ? (flip ? sub : ver) : this.wordOrder[i] == "o" ? obj : iobj;
      if(original.length) {
        let total: string[] = [];
        let words = original.split(" ");
        for(let i of (this.adjectivesGoFirst ? words : [words[words.length - 1], ...words.slice(0, -1)])) {
          total.push(this.rootList[i] || i);
        }
        result.push(total.join(" "));
      }
    }
    return result.join(" ");
  }
  /** Encode a sentence using this language, and format it. */
  f_translate(sub: string, ver = "", obj = "", iobj = "", yesNo = false) {
    let result: string[] = [];
    let flip = yesNo && this.questionsReverseOrder;
    for(let i = 0; i <= 3; i++) {
      let original = this.wordOrder[i] == "s" ? (flip ? ver : sub) : this.wordOrder[i] == "v" ? (flip ? sub : ver) : this.wordOrder[i] == "o" ? obj : iobj;
      if(original.length) {
        let total: string[] = [];
        let words = original.split(" ");
        for(let i of (this.adjectivesGoFirst ? words : [words[words.length - 1], ...words.slice(0, -1)])) {
          if(Object.keys(this.rootList).includes(i)) {
            if(Object.keys(this.wordsKnown).includes(this.rootList[i])) {
              total.push(`<span class="ethereal tool clickable" onclick="currentLang=${langList.indexOf(this)};getId('word-modal').style.top='0%';getId('word-input').focus();getId('word-input').value='${this.wordsKnown[this.rootList[i]]}';getId('word').textContent='${this.rootList[i]}';">${this.rootList[i]}<span>${this.wordsKnown[this.rootList[i]]}</span></span>`);
            } else {
              total.push(`<span class="ethereal clickable" onclick="currentLang=${langList.indexOf(this)};getId('word-modal').style.top='0%';getId('word-input').focus();getId('word-input').value='';getId('word').textContent='${this.rootList[i]}';">${this.rootList[i]}</span>`);
            }
          } else {
            total.push(i);
          }
        }
        result.push(total.join(" "));
      }
    }
    return result.join(" ");
  }
}
let langList: ProceduralLanguage[] = [];
let currentLang = -1;

let cons = ["w", "r", "t", "p", "s", "d", "j", "k", "l", "z", "v", "b", "n", "m"];
let vows = ["a", "e", "i", "o", "u"];
function randomSyllable() {
  return (Math.random() < 0.9 ? choice(cons) : "") + choice(vows) + (Math.random() < 0.3 ? choice(cons) : "");
}
function generateLanguage() {
  let l = new ProceduralLanguage();
  l.wordOrder = choice(["svoi", "soiv", "sovi", "osvi"]);
  l.adjectivesGoFirst = Math.random() < 0.5;
  l.questionsReverseOrder = Math.random() < 0.7;
  l.rootsGoFirst = Math.random() < 0.3;
  l.useRootChance = 0.5 + Math.random() * 0.5;
  // Add simple words
  for(let i of ["question", "pronoun", "ownership", "indicator", "is", "not", "can", "know", "go", "and", "1", "2", "3", "4", "5"]) {
    let candidate = "";
    while(candidate.length < 1 || Object.values(l.rootList).includes(candidate)) candidate = randomSyllable() + (Math.random() < 0.3 ? randomSyllable() : "");
    l.rootList[i] = candidate;
  }
  // Add complicated words
  for(let i of [
    ["Rivu"], ["Survi"],
    ["hello"], ["awaken"], ["sleep"], ["cat"], ["patient"], ["close"], ["door"], ["room"], ["good"],
    ["who", "question"], ["what", "question"],
    ["i", "pronoun"], ["you", "pronoun"],
    ["my", "i", "ownership"], ["your", "you", "ownership"],
    ["this", "indicator"], ["that", "indicator"],
    ["learn", "know"], ["teach", "know"], ["come", "go"]
  ]) {
    // If a word has a root associated with it, it'll usually use the root, but it also has a chance to be a completely random word.
    let candidate = "";
    while(candidate.length < 1 || Object.values(l.rootList).includes(candidate)) {
      let rootWord = (Math.random() < l.useRootChance && i.length > 1)
        ? l.rootList[i[1]] + (i.length >= 3 ? l.rootList[i[2]] : randomSyllable())
        : (randomSyllable() + randomSyllable());
      let suffix = (Math.random() < 0.3 ? randomSyllable() : "") + (Math.random() < 0.1 ? randomSyllable() : "");
      candidate = l.rootsGoFirst ? rootWord + suffix : suffix + rootWord;
    }
    if(i[0][0].toUpperCase() == i[0][0]) candidate = candidate[0].toUpperCase() + candidate.slice(1);
    l.rootList[i[0]] = candidate;
  }

  // Set up modal thing
  getId("word-set").onclick = () => {
    langList[currentLang].wordsKnown[getId("word").textContent] = (getId("word-input") as HTMLInputElement).value;
    getId("word-modal").style.top = "-100%";
    activeScene.load();
  };
  getId("word-cancel").onclick = () => { getId("word-modal").style.top = "-100%"; };

  currentLang = langList.length;
  langList.push(l);
  return l;
}

let beginButton = getId("begin-button");
beginButton.onclick = function() {
  switchMenu("core-menu");
  let toki = (getId("tokipona") as HTMLInputElement).checked;
  let l = generateLanguage();

  let awakenChamber = () => toki ? "tomo pi kama lape ala" : l.f_translate("awaken") + " Chamber";
  let scene1 = new Scene(awakenChamber, `You find yourself in a room you've never seen before. The sound of a door slamming shut echoes in your mind, but you can't tell from where.`, [
    {name: "Look around", click() {
      new Scene(awakenChamber, () => `This area seems pretty barren. As you look around, someone comes into the room and waves to you. 'a, ${toki ? "sina lape ala" : l.f_translate("you", "awaken")}.'<br/>They look like they're barely staying awake...`, [
        {name: "'huh what?'", click() {
          new Scene(awakenChamber, () => `The ${toki ? "soweliko" : l.f_translate("cat")} sighs...<br/>'... ${toki ? "mi ken pana e sona pona tawa sina" : l.f_translate("i", "can teach", "you") + ". " + l.f_translate("", "go")}.'`, [
            {name: "Go outside", click() { inevitability.load(); }}
          ]).load();
        }},
        {name: "Stay silent", click() {
          new Scene(awakenChamber, () => `'...'<br/>They exit the room.`, [
            {name: "Follow", click() { inevitability.load(); }}
          ]).load();
        }}
      ]).load();
    }},
    {name: "Try to exit the room", click() {
      new Scene(awakenChamber, () => `The door clangs. You hear the sound of a code being entered on the other side... you feel like you might have attracted some attention.`, [
        {name: "Bang on the door more", click() {
          new Scene(awakenChamber, () => `You hear a voice from the other side of the door. '${toki ? "sina ken ala awen...?" : l.f_translate("you", "is", "not patient") + "..."}'`, [
            {name: "'sorry what'", click() {
              new Scene(awakenChamber, () => `'${toki ? "sina wile kama lon poka mi" : l.f_translate("you and me", "go")}?'`).load();
            }}
          ]).load();
        }}
      ]).load();
    }}
  ]);

  let inevitability = new Scene("Chamber I", () => `The ${toki ? "soweliko" : l.f_translate("cat")} leads you out of the room into a large hall. They close your door and enter a code on the wall next to it.
  '${toki ? "mi pini e lupa" : l.f_translate("i", "close", "door")}.'`, [
    {name: "Try to read the code", click() {
      new Scene("Chamber I", () => `You manage to look over their shoulder as they're entering the code. It reads: ${toki ? "1 2 5" : ["1", "2", "5"].map(x => l.f_translate(x)).join(" ")}.`, [
        {name: "'who are you?'", click() {
          introductions.load();
        }},
        {name: "Enter that code again", click() {
          new Scene("Chamber I", "The door opens.", [
            {name: "Go back inside", click() {
              new Scene(awakenChamber, `${toki ? "jan Wisu" : l.f_translate("Rivu")} allows you to go back inside.<br/>'${toki ? "o lape pona": l.f_translate("good sleep")}...'`).load();
            }}
          ]).load();
        }}
      ]).load();
    }},
    {name: "Just wait", click() {
      introductions.load();
    }}
  ]);

  let introductions = new Scene("Chamber I", () => `'${toki ? "mi jan Wisu" : l.f_translate("i", "is", "Rivu")}.' They pause for a moment. '${toki ? "sina jan seme" : l.f_translate("who", "is", "you")}?'`, [
    {name: "'... " + (toki ? "jan Suwiko" : l.translate("Survi")) + "?'", click() {
      new Scene("Chamber I", () => `'${toki ? "ni li nimi sina" : l.f_translate("that", "is", "you")}? a... ${toki ? "jan Wisu en jan Suwiko" : ["Rivu", "and", "Survi"].map(x => l.f_translate(x)).join(" ")}.'<br/>
      ${toki ? "jan Wisu" : l.f_translate("Rivu")} points at the door you just came through. '${toki ? "ni li tomo sina" : l.f_translate("this", "is", "your awaken room")}.'`, [
        {name: l.translate("my awaken room") + "?", click() {
          new Scene("Chamber I", () => `'a.'<br/> You notice ${toki ? "jan Wisu" : l.f_translate("Rivu")} looks tired... '${toki ? "mi kama lape" : l.f_translate("i", "go sleep") + ". " + l.f_translate("sleep") + "- " + l.f_translate("not awaken")}.'`).load();
        }}
      ]).load();
    }},
    {name: "Stay silent", click() {
      new Scene("Chamber I", () => `'... ${toki ? "seme" : l.f_translate("what")}?'`, [
        {name: "'you can call me whatever I guess'", click() {
          new Scene("Chamber I", () => `'${toki ? "sina jan Suwiko? pona" : l.f_translate("you", "is", "Survi", "", true) + "? " + l.f_translate("good")}.' They pause for a moment, seemingly trying to remember what they were thinking about...<br/>
          '... ${toki ? "mi pana e sona" : l.f_translate("i", "go teach", "you")}.'`).load();
        }},
        {name: "Continue staying silent", click() {
          new Scene("Chamber I", `...`).load();
        }}
      ]).load();
    }}
  ]);

  scene1.load();
}