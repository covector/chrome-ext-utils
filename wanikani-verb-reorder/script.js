function combine(arr1, arr2) {
    result = [];
    totalLength = arr1.length + arr2.length;
    let i1 = 0;
    let i2 = 0
    for (let i = 0; i < totalLength; i++) {
        if (i1/arr1.length <= i2/arr2.length) {
            result[i] = arr1[i1++];
        } else {
            result[i] = arr2[i2++];
        }
    }
    return result;
}

function getList() {
    return document.getElementsByClassName("character-grid")[2].getElementsByClassName("subject-character-grid__items")[0].children;
}

function getWord(entry) {
    return entry.getElementsByClassName("subject-character__characters")[0].textContent;
}

verbEnd = ["す", "く", "ぐ", "ぶ", "む", "ぬ", "る", "う", "つ"];

function createOrder(arr) {
    let arr1 = [];
    let arr2 = [];
    for (let i = 0; i < arr.length; i++) {
        if (verbEnd.indexOf(getWord(arr[i]).at(-1)) == -1) {
            arr1.push(i);
        } else {
            arr2.push(i);
        }
    }
    return combine(arr1, arr2);
}

function main() {
    list = getList();
    originalList = [...list];
    order = createOrder(list);
    list[0].before(originalList[order[0]]);
    for (let i = 1; i < order.length; i++) {
        list[i-1].after(originalList[order[i]]);
    }
    console.log("Reordered Vocabulary List!");
}

chrome.storage.sync.get("active", ({ active }) => {
    if (active) {
        main();
    }
});

