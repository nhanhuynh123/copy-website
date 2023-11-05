const search_box = document.querySelector(".search-box"),
searchInput = search_box.querySelector("input");
const info = document.getElementById("info");
var search_recomandation = document.getElementById("search-and-recomandation");
var rcm = document.getElementById("recomandation");
const myKeyValue = window.location.search;
const urlParams = new URLSearchParams(myKeyValue);
const key_word = urlParams.get('k-word');

class TrieNode {
    constructor() {
        this.children = {};
        this.isWord = false;
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
    }

    insert(word) {
        let node = this.root;
        for (let i = 0; i < word.length; i++) {
        if (!node.children[word[i]]) {
            node.children[word[i]] = new TrieNode();
        }
        node = node.children[word[i]];
        }
        node.isWord = true;
    }

    suggestHelper(root, list, curr) {
        if (root.isWord) {
        list.push(curr);
        }
        if (!Object.keys(root.children).length) {
        return;
        }
        for (let child in root.children) {
        this.suggestHelper(root.children[child], list, curr + child);
        }
    }

    suggest(prefix) {
        let node = this.root;
        let curr = "";
        for (let i = 0; i < prefix.length; i++) {
        if (!node.children[prefix[i]]) {
            return [];
        }
        node = node.children[prefix[i]];
        curr += prefix[i];
        }
        let list = [];
        this.suggestHelper(node, list, curr);
        return list;
    }
}

function showData(result,word){
    if(result.title == "No Definitions Found"){
        var response = document.getElementById("response");
        document.querySelector("#response p").innerText = "No exact match found for \'" + word + "\' in English";
        response.style.display = "block";
    }
    else{
        document.querySelector(".word p").innerText = result[0].word;
        document.querySelector(".part-of-speech span").innerText = result[0].meanings[0].partOfSpeech;
        for (let i = 0; i < result[0].phonetics.length; i++) {    
            if(result[0].phonetics[i].text != null){
                document.querySelector(".pronun span").innerText = result[0].phonetics[i].text;
                break;
            }
        }
        document.querySelector(".define span").innerText = result[0].meanings[0].definitions[0].definition;
        document.querySelector(".exam span").innerText = result[0].meanings[0].definitions[0].example;
        for (let i = 0; i < result[0].phonetics.length; i++) {    
            if(result[0].phonetics[i].audio != ""){
                audio = new Audio(result[0].phonetics[i].audio);
                break;
            }
        }
        var playaudio = document.getElementById("volumn-up");
        info.style.display = 'block';
        search_recomandation.className = "";
        rcm.style.display = "none";
    }
}

function recomandation(data,word){
    if(word.length>1){
        listRcm = trieWord.suggest(word);
        console.log(listRcm);
        rcm.innerHTML = "";
        for(let i = 0;i<10;i++){
            if (listRcm[i]){
                let rcmtag = `<div class="rcm"><a href="/main.html?k-word=${listRcm[i]}">${listRcm[i]}</a></div>`;
                rcm.insertAdjacentHTML("beforeend",rcmtag);
            }
        }
        search_recomandation.className = "active";
        rcm.style.display = "block";
        
    }
    else
    {
        rcm.style.display = "none";
        search_recomandation.setAttribute("style","height:auto");
    }
}

function fetchAPI(word){
    let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    fetch(url).then(res => res.json()).then(result => showData(result,word));
};

trieWord = new Trie();        

fetch('/data/oxford.json').then(response => {
    return response.json();
}).then(data => {

    console.log('oce');
    
    for(let i = 0;i < data.length;i++){
        trieWord.insert(data[i]['word']);
    }
    if(key_word){
        fetchAPI(key_word);
    }
    searchInput.addEventListener("keyup",e =>{
        recomandation(data,e.target.value);
    });
    }).catch(err => {
        console.warn('Something wrong!!!')
});

function playaudio(){
        audio.play();
}