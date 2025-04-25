var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var getId = function (x) { return document.getElementById(x); };
var choice = function (array) { return array[Math.floor(Math.random() * array.length)]; };
/** Move all the tooltips to follow the user's mouse */
function doTooltips(m) {
    for (var _i = 0, _a = Array.from(document.getElementsByClassName("tool")).map(function (x) { return x.firstElementChild; }); _i < _a.length; _i++) {
        var i = _a[_i];
        i.style.top = m.y + "px";
        i.style.left = m.x + "px";
    }
}
document.onmousemove = doTooltips;
var activeMenu = "main-menu";
/**
 * Change to a different menu, hiding the current one.
 * @param newMenu The ID of the menu to switch to.
 */
function switchMenu(newMenu) {
    getId(activeMenu).style.top = "-100%";
    getId(newMenu).style.top = "0%";
}
/** A scene containing some description text and options. */
var Scene = /** @class */ (function () {
    function Scene(title, desc, options) {
        if (options === void 0) { options = []; }
        this.title = title;
        this.description = desc;
        this.options = options;
    }
    Scene.prototype.load = function () {
        var _this = this;
        activeScene = this;
        getId("core-menu").style.opacity = "0";
        setTimeout(function () {
            getId("scene-title").innerHTML = typeof _this.title == "string" ? _this.title : _this.title();
            getId("scene-description").innerHTML = typeof _this.description == "string" ? _this.description : _this.description();
            getId("scene-options").textContent = "";
            for (var i = 0; i < _this.options.length; i++) {
                var el = document.createElement("div");
                el.id = "scene-option-" + i;
                var opt = _this.options[i];
                el.textContent = opt.name;
                el.onclick = opt.click;
                getId("scene-options").appendChild(el);
            }
            getId("core-menu").style.opacity = "1";
        }, 510);
    };
    return Scene;
}());
var activeScene;
var settingsButton = getId("settings-button"), settings = getId("settings"), showingSettings = false;
var changesButton = getId("changelog-button"), changes = getId("changelog"), showingChanges = false;
settingsButton.onclick = function () {
    if (showingSettings) {
        showingSettings = false;
        settings.style.height = "0px";
        settingsButton.classList.remove("selected");
    }
    else {
        showingSettings = true;
        settings.style.height = "50px";
        settingsButton.classList.add("selected");
        if (showingChanges) {
            showingChanges = false;
            changes.style.height = "0px";
            changesButton.classList.remove("selected");
        }
    }
};
changesButton.onclick = function () {
    if (showingChanges) {
        showingChanges = false;
        changes.style.height = "0px";
        changesButton.classList.remove("selected");
    }
    else {
        showingChanges = true;
        changes.style.height = "100px";
        changesButton.classList.add("selected");
        if (showingSettings) {
            showingSettings = false;
            settings.style.height = "0px";
            settingsButton.classList.remove("selected");
        }
    }
};
/** A procedurally generated "language". */
var ProceduralLanguage = /** @class */ (function () {
    function ProceduralLanguage() {
        /** The list of words. */
        this.rootList = {};
        /** Words that have a guess. */
        this.wordsKnown = {};
    }
    /**
     * Use this procedural language to encode a sentence.
     * @param sub Sentence's subject.
     * @param ver Sentence's verb.
     * @param obj Sentence's object.
     * @param yesNo Whether the sentence is a yes or no question.
     * @returns The translated sentence.
     */
    ProceduralLanguage.prototype.translate = function (sub, ver, obj, iobj, yesNo) {
        if (ver === void 0) { ver = ""; }
        if (obj === void 0) { obj = ""; }
        if (iobj === void 0) { iobj = ""; }
        if (yesNo === void 0) { yesNo = false; }
        var result = [];
        var flip = yesNo && this.questionsReverseOrder;
        for (var i = 0; i <= 2; i++) {
            var original = this.wordOrder[i] == "s" ? (flip ? ver : sub) : this.wordOrder[i] == "v" ? (flip ? sub : ver) : this.wordOrder[i] == "o" ? obj : iobj;
            if (original.length) {
                var total = [];
                var words = original.split(" ");
                for (var _i = 0, _a = (this.adjectivesGoFirst ? words : __spreadArray([words[words.length - 1]], words.slice(0, -1), true)); _i < _a.length; _i++) {
                    var i_1 = _a[_i];
                    total.push(this.rootList[i_1] || i_1);
                }
                result.push(total.join(" "));
            }
        }
        return result.join(" ");
    };
    /** Encode a sentence using this language, and format it. */
    ProceduralLanguage.prototype.f_translate = function (sub, ver, obj, iobj, yesNo) {
        if (ver === void 0) { ver = ""; }
        if (obj === void 0) { obj = ""; }
        if (iobj === void 0) { iobj = ""; }
        if (yesNo === void 0) { yesNo = false; }
        var result = [];
        var flip = yesNo && this.questionsReverseOrder;
        for (var i = 0; i <= 2; i++) {
            var original = this.wordOrder[i] == "s" ? (flip ? ver : sub) : this.wordOrder[i] == "v" ? (flip ? sub : ver) : this.wordOrder[i] == "o" ? obj : iobj;
            if (original.length) {
                var total = [];
                var words = original.split(" ");
                for (var _i = 0, _a = (this.adjectivesGoFirst ? words : __spreadArray([words[words.length - 1]], words.slice(0, -1), true)); _i < _a.length; _i++) {
                    var i_2 = _a[_i];
                    if (Object.keys(this.rootList).includes(i_2)) {
                        if (Object.keys(this.wordsKnown).includes(this.rootList[i_2])) {
                            total.push("<span class=\"ethereal tool clickable\" onclick=\"currentLang=".concat(langList.indexOf(this), ";getId('word-modal').style.top='0%';getId('word-input').focus();getId('word-input').value='").concat(this.wordsKnown[this.rootList[i_2]], "';getId('word').textContent='").concat(this.rootList[i_2], "';\">").concat(this.rootList[i_2], "<span>").concat(this.wordsKnown[this.rootList[i_2]], "</span></span>"));
                        }
                        else {
                            total.push("<span class=\"ethereal clickable\" onclick=\"currentLang=".concat(langList.indexOf(this), ";getId('word-modal').style.top='0%';getId('word-input').focus();getId('word-input').value='';getId('word').textContent='").concat(this.rootList[i_2], "';\">").concat(this.rootList[i_2], "</span>"));
                        }
                    }
                    else {
                        total.push(i_2);
                    }
                }
                result.push(total.join(" "));
            }
        }
        return result.join(" ");
    };
    return ProceduralLanguage;
}());
var langList = [];
var currentLang = -1;
var cons = ["w", "r", "t", "p", "s", "d", "j", "k", "l", "z", "v", "b", "n", "m"];
var vows = ["a", "e", "i", "o", "u"];
function randomSyllable() {
    return choice(cons) + choice(vows) + (Math.random() < 0.4 ? choice(cons) : "");
}
function generateLanguage() {
    var l = new ProceduralLanguage();
    l.wordOrder = choice(["svoi", "soiv", "sovi", "osvi"]);
    l.adjectivesGoFirst = Math.random() < 0.5;
    l.questionsReverseOrder = Math.random() < 0.7;
    l.rootsGoFirst = Math.random() < 0.3;
    l.useRootChance = 0.5 + Math.random() * 0.5;
    // Add simple words
    for (var _i = 0, _a = ["question", "pronoun", "ownership", "indicator", "is", "not", "can", "know", "go", "and", "1", "2", "3", "4", "5"]; _i < _a.length; _i++) {
        var i = _a[_i];
        var candidate = void 0;
        while (!candidate || Object.values(l.rootList).includes(candidate))
            candidate = randomSyllable() + (Math.random() < 0.3 ? randomSyllable() : "");
        l.rootList[i] = candidate;
    }
    // Add complicated words
    for (var _b = 0, _c = [
        ["Rivu"], ["Survi"],
        ["hello"], ["name"], ["awaken"], ["sleep"], ["cat"], ["patient"], ["close"], ["door"], ["room"], ["name"], ["good"],
        ["who", "question"], ["what", "question"],
        ["i", "pronoun"], ["you", "pronoun"],
        ["my", "i", "ownership"], ["your", "you", "ownership"],
        ["this", "indicator"], ["that", "indicator"],
        ["learn", "know"], ["teach", "know"], ["come", "go"]
    ]; _b < _c.length; _b++) {
        var i = _c[_b];
        // If a word has a root associated with it, it'll usually use the root, but it also has a chance to be a completely random word.
        var candidate = void 0;
        while (!candidate || Object.values(l.rootList).includes(candidate)) {
            var rootWord = (Math.random() < l.useRootChance && i.length > 1) ? (i.length >= 3 ? l.rootList[i[1]] + l.rootList[i[2]] : l.rootList[i[1]]) : randomSyllable();
            var suffix = (Math.random() < 1 - 0.3 * i.length ? randomSyllable() : "") + (Math.random() < 0.2 ? randomSyllable() : "");
            candidate = l.rootsGoFirst ? rootWord + suffix : suffix + rootWord;
        }
        if (i[0][0].toUpperCase() == i[0][0])
            candidate = candidate[0].toUpperCase() + candidate.slice(1);
        l.rootList[i[0]] = candidate;
    }
    // Set up modal thing
    getId("word-set").onclick = function () {
        langList[currentLang].wordsKnown[getId("word").textContent] = getId("word-input").value;
        getId("word-modal").style.top = "-100%";
        activeScene.load();
    };
    getId("word-cancel").onclick = function () { getId("word-modal").style.top = "-100%"; };
    currentLang = langList.length;
    langList.push(l);
    return l;
}
var beginButton = getId("begin-button");
beginButton.onclick = function () {
    switchMenu("core-menu");
    var toki = getId("tokipona").checked;
    var l = generateLanguage();
    var awakenChamber = function () { return toki ? "tomo pi kama lape ala" : l.f_translate("awaken") + " Chamber"; };
    var scene1 = new Scene(awakenChamber, "You find yourself in a room you've never seen before. The sound of a door slamming shut echoes in your mind, but you can't tell from where.", [
        { name: "Look around", click: function () {
                new Scene(awakenChamber, function () { return "This area seems pretty barren. As you look around, someone comes into the room and waves to you. 'a, ".concat(toki ? "sina lape ala. nimi sina li seme" : l.f_translate("you", "awaken") + ". " + l.f_translate("you", "is", "who"), "?'<br/>They look like they're barely staying awake..."); }, [
                    { name: "'huh what?'", click: function () {
                            new Scene(awakenChamber, function () { return "The ".concat(toki ? "soweliko" : l.f_translate("cat"), " sighs...<br/>'... ").concat(toki ? "mi ken pana e sona pona tawa sina" : l.f_translate("i", "can teach", "you") + ". " + l.f_translate("", "come"), ".'"); }, [
                                { name: "Go outside", click: function () { inevitability.load(); } }
                            ]).load();
                        } },
                    { name: "Stay silent", click: function () {
                            new Scene(awakenChamber, function () { return "'...'<br/>They exit the room."; }, [
                                { name: "Follow", click: function () { inevitability.load(); } }
                            ]).load();
                        } }
                ]).load();
                var inevitability = new Scene("Chamber I", function () { return "The ".concat(toki ? "soweliko" : l.f_translate("cat"), " leads you out of the room into a large hall. They close your door and enter a code on the wall next to it.\n      '").concat(toki ? "mi pini e lupa" : l.f_translate("i", "close", "door"), ".'"); }, [
                    { name: "Try to read the code", click: function () {
                            new Scene("Chamber I", function () { return "You manage to look over their shoulder as they're entering the code. It reads: ".concat(toki ? "1 2 5" : ["1", "2", "5"].map(function (x) { return l.f_translate(x); }).join(" "), "."); }, [
                                { name: "'who are you?'", click: function () {
                                        introductions.load();
                                    } },
                                { name: "Enter that code again", click: function () {
                                        new Scene("Chamber I", "The door opens.", [
                                            { name: "Go back inside", click: function () { } }
                                        ]).load();
                                    } }
                            ]).load();
                        } },
                    { name: "Just wait", click: function () {
                            introductions.load();
                        } }
                ]);
                var introductions = new Scene("Chamber I", function () { return "'".concat(toki ? "mi jan Wisu" : l.f_translate("i", "is", "Rivu"), ".' They pause for a moment. '").concat(toki ? "sina jan seme" : l.f_translate("who", "is", "you"), "?'"); }, [
                    { name: "'... " + (toki ? "jan Suwiko" : l.translate("Survi")) + "?'", click: function () {
                            new Scene("Chamber I", function () { return "'".concat(toki ? "ni li nimi sina" : l.f_translate("that", "is", "your name"), "? a... ").concat(toki ? "jan Wisu en jan Suwiko" : ["Rivu", "and", "Survi"].map(function (x) { return l.f_translate(x); }).join(" "), ".'<br/>\n          ").concat(toki ? "jan Wisu" : l.f_translate("Rivu"), " points at the door you just came through. '").concat(toki ? "ni li tomo sina" : l.f_translate("this", "is", "your awaken room"), ".'"); }, [
                                { name: l.translate("my awaken room") + "?", click: function () {
                                        new Scene("Chamber I", function () { return "'a.'<br/>".concat(toki ? "jan Wisu" : l.f_translate("Rivu"), " looks pretty tired... '").concat(toki ? "mi kama lape" : l.f_translate("i", "go sleep") + ". " + l.f_translate("sleep") + "- " + l.f_translate("not awaken"), ".'"); }).load();
                                    } }
                            ]).load();
                        } },
                    { name: "Stay silent", click: function () {
                            new Scene("Chamber I", function () { return "'... ".concat(toki ? "seme" : l.f_translate("what"), "?'"); }, [
                                { name: "'you can call me whatever I guess'", click: function () {
                                        new Scene("Chamber I", function () { return "'".concat(toki ? "sina jan Suwiko? pona" : l.f_translate("you", "is", "Survi", "", true) + "? " + l.f_translate("good"), ".' They pause for a moment, seemingly trying to remember what they were thinking about...<br/>\n              '... ").concat(toki ? "mi pana e sona" : l.f_translate("i", "go teach", "you"), ".'"); }).load();
                                    } },
                                { name: "Continue staying silent", click: function () {
                                        new Scene("Chamber I", "...").load();
                                    } }
                            ]).load();
                        } }
                ]);
            } },
        { name: "Try to exit the room", click: function () {
                new Scene(awakenChamber, function () { return "The door clangs. You hear the sound of a code being entered on the other side... you feel like you might have attracted some attention."; }, [
                    { name: "Bang on the door more", click: function () {
                            new Scene(awakenChamber, function () { return "You hear a voice from the other side of the door. '".concat(toki ? "sina ken ala awen...?" : l.f_translate("you", "is", "not patient") + "...", "'"); }).load();
                        } }
                ]).load();
            } }
    ]);
    var scene2;
    scene1.load();
};
