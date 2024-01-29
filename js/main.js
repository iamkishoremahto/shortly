



function handburgerHandler() {

    let handburger = document.querySelector('.handburger');

    handburger.addEventListener('click', () => {
        let mobileMenu = document.querySelector('.mobile_menu');
        
        mobileMenu.classList.toggle('mobile_menu_show');
        if(mobileMenu.classList.contains('mobile_menu_show')){
            handburger.innerHTML = `<i class="fa-solid fa-xmark"></i>`
        }
        else{
            handburger.innerHTML = `<i class="fa-solid fa-bars"></i>`
        }
    })
}

async function isValidWebsite(url) {

    return new Promise((resolve, reject) => {
        let urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?$/;

        resolve(urlPattern.test(url));
        reject(new Error('Unable to resolve'));
    })

}

async function errorShowHandler() {
    let showError = document.querySelector('#showError');
    let linkInput = document.querySelector('#linkInput');
    let isValidUrl = await isValidWebsite(linkInput.value);



    if (linkInput.value === null || linkInput.value === " " || linkInput.value === "") {
        showError.textContent = "Please add a link";
        showError.classList.add('showErrorOccured');
        linkInput.classList.add('inputError');
        linkInput.classList.remove('inputCorrect');

    }

    else if (!isValidUrl) {

        showError.textContent = "Add a valid website";
        showError.classList.add('showErrorOccured');
        linkInput.classList.add('inputError');
        linkInput.classList.remove('inputCorrect');

    }
    else if (isValidUrl) {

        linkInput.classList.remove('inputError');
        showError.classList.remove('showErrorOccured');
        linkInput.classList.add('inputCorrect');

    }



}

class myLocalStorage {

    constructor() {
        this.myLocalItems = localStorage.getItem("sortedUrls");
        if (this.myLocalItems == null || this.myLocalItems == undefined) {
            this.myLocalItems = [];
            localStorage.setItem("sortedUrls", JSON.stringify(this.myLocalItems));
        }

    }

    getMyLocalItems() {
        return JSON.parse(this.myLocalItems)
    }

    updateMyLocalItems(newData) {
        localStorage.setItem("sortedUrls", JSON.stringify(newData));
    }


}

async function getSortedUrl(url) {
    
    let apiEndPoint = ` http://tinyurl.com/api-create.php?url=${url}`;
    let response = await fetch(apiEndPoint);
    let sortUrl = await response.text();
    if(response.status == 200){
       
        return sortUrl;
    }
    else{
        return "error";
    }
}

async function updateShortedUrlsInLocalStorage(url) {

    let myLocatDataObj =  new myLocalStorage();
    let ObjectArray = await myLocatDataObj.getMyLocalItems();

    async function updateData(url){
        let sortUrl = await getSortedUrl(url);
        if(sortUrl !== 'error'){
            let newUrlObject = { url: url, sortUrl: sortUrl }
            ObjectArray.push(newUrlObject)
            myLocatDataObj.updateMyLocalItems(ObjectArray)
        }
        
    }

    if (ObjectArray.length === 0) {
        await updateData(url);
    }

    
    let matchCount = 0;

    ObjectArray.forEach((object) =>{
        if(object.url === url) {
            matchCount++;
        }
    })

    if (matchCount === 0){
        await updateData(url);
    }
}


async function shortenBtnHandler() {
    let linkInput = document.querySelector('#linkInput');
    let isValidUrl = await isValidWebsite(linkInput.value);
    if (isValidUrl) {
        await updateShortedUrlsInLocalStorage(linkInput.value);
        updateShortedUrlSection();
    }
    

}

function updateShortedUrlSection(){
    let myLocatDataObj = new myLocalStorage();
    let allUrls = myLocatDataObj.getMyLocalItems();

    let shortedUrlSection = document.querySelector('.showPreviousUrls ul')
    shortedUrlSection.innerHTML = `` ;

    allUrls.reverse().forEach((items) => {
        let shortedUrlSection = document.querySelector('.showPreviousUrls ul')
      
        let template = `<p class="mainUrl">${items.url}</p>
        <div class="sortUrl">
            <a href="${items.sortUrl}">${items.sortUrl}</a>
            <button class="copy">Copy</button>
        </div>`
        let newUrlElement = document.createElement('li')
        newUrlElement.classList.add('previousUrl');
        newUrlElement.innerHTML = template;
        let copyBtn = newUrlElement.querySelector('.copy')

        copyBtn.addEventListener('click', () =>{
            let textarea = document.createElement('textarea')
            textarea.value = items.sortUrl;
            document.body.appendChild(textarea)
            textarea.select();
            document.execCommand('copy');
            textarea.remove();
            copyBtn.textContent = 'Copied!'
            copyBtn.classList.add('copied')

        })

        shortedUrlSection.appendChild(newUrlElement)
    })
}

let shortenBtn = document.querySelector('.shortenBtn');
let linkInput = document.querySelector('#linkInput');

linkInput.addEventListener('change', errorShowHandler);
linkInput.addEventListener('keydown', errorShowHandler);
shortenBtn.addEventListener('click', shortenBtnHandler);

updateShortedUrlSection();
handburgerHandler();
let myLocatDataObj = new myLocalStorage();
// async function test(){
//     let url = "https://www.vmokshagroup.com/";
//     let data = await getSortedUrl(url)
//     console.log(data)
// }

// test()
