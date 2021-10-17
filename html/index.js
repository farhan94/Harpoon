const button = document.querySelector('button');

button.addEventListener('mouseover', () => {
    button.style.backgroundColor = '#47c2e7';
    button.style.color = 'white';
    button.style.transform = 'scale(1.3)';
});

button.addEventListener('mouseleave', () => {
    button.style.backgroundColor = '#4e77e6';
    button.style.color = 'black';
    button.style.transform = 'scale(1)';
});

button.addEventListener('click', () => {
    chrome.runtime.sendMessage({ message: 'login' });
});

const getFromChromeStorageLocal = async (key) => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(key, function (result) {
            if (result[key] === undefined) {
                reject();
            }
            else {
                resolve(result[key]);
            }
        });
    });
};

chrome.storage.local.get("harpoon", function (result) {
    if (result["harpoon"] === undefined || result["harpoon"] == null) {
        reject();
    }
    else {
        let p = document.getElementById("exp");
        let d = new Date(result["harpoon"]);
        p.textContent = "Login expires on " + d.toString();
    }
});