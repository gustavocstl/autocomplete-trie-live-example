class TrieNode {
  constructor(endOfWord = false) {
    this.children = new Map();
    this.endOfWord = endOfWord;
  }

  add(char, node) {
    this.children.set(char, node)
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode(); 
  }

  insert(word) {
    let currentNode = this.root;
    
    for (let i = 0; i < word.length; i++) {
      const endOfWord = i == word.length - 1;
      
      if (currentNode.children.get(word[i]) === undefined) {
        currentNode.add(word[i], new TrieNode(endOfWord));
      } else if (endOfWord) {
        currentNode.children.get(word[i]).endOfWord = true;
      }

      currentNode = currentNode.children.get(word[i]);
    }
  }

  searchCompleteWord(word) {
    let currentNode = this.root;
    let endOfWord = false;

    for (let i = 0; i < word.length; i++) {
      if (currentNode.children.get(word[i]) === undefined) {
        return false;
      }

      endOfWord = currentNode.children.get(word[i]).endOfWord;
      currentNode = currentNode.children.get(word[i]); 
    }

    if (endOfWord) {
      return word;
    }
    
    return false;
  }

  searchPrefix(prefix) {
    let currentNode = this.root;

    for (let i = 0; i < prefix.length; i++) {
      if (currentNode.children.get(prefix[i]) === undefined) {
        return [];
      }

      currentNode = currentNode.children.get(prefix[i]);
    }

    return this.wordsToAutocomplete(prefix, currentNode);
  }

  wordsToAutocomplete(prefix, node) {
    const stack = [];
    const matches = [];

    if (node.endOfWord) {
      matches.push(prefix);
    }

    for (let [key, child] of node.children) {
      stack.push([key, child, []]);
    }

    while (stack.length > 0) {
      let [char, node, currentWord] = stack.pop();

      currentWord.push(char);

      if (node.endOfWord) {
        matches.push(currentWord.join(""));
      }

      for (let [key, child] of node.children) {
        stack.push([key, child, [...currentWord]]);
      }
    }

    return matches;
  }
}

/**
  *
  *
  *
  * Manipulação do DOM
  *
  *
  *
  */

const trie = new Trie();
trie.insert("abacate");
trie.insert("abacaxi");
trie.insert("abutre");
trie.insert("bola");
trie.insert("bolo");
trie.insert("bolao");

const insert = () => {
  const word = document.getElementById("insert").value;

  if (!word || word.trim() == "") {
    alert("Campo vazio...");
    return;
  }

  trie.insert(word.trim());

  const element = document.createElement("div");
  element.innerHTML = word.trim();
  document.getElementById("words").append(element);
}

const setWord = (element) => {
  document.getElementById("search").value = element.srcElement.innerHTML;
  autocomplete()
}

const autocomplete = () => {
  const currentSearch = document.getElementById("search").value;
  document.getElementById("autocomplete").innerHTML = "";

  if (currentSearch.trim() == "") {
    return;
  }

  const matches = trie.searchPrefix(currentSearch.trim());

  matches.forEach((match) => {
    if (match != "") {
      const element = document.createElement("div");
      if (currentSearch.trim() != match) {
        element.innerHTML = currentSearch.trim() + match;
      } else {
        element.innerHTML = match;
      }

      element.onclick = setWord;
      document.getElementById("autocomplete").append(element);
    }
  })
}

const search = () => {
  const word = document.getElementById("search").value;

  if (trie.searchCompleteWord(word.trim())) {
    alert("Palavra encontrada!");
    return
  }

  alert("Palavra não encontrada!");
  return
}

document.getElementById("insert-button").onclick = insert;
document.getElementById("search").onkeyup = autocomplete;
document.getElementById("search-button").onclick = search;

document.getElementById("insert").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    insert();
  }
});

document.getElementById("search").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    search();
  }
});

