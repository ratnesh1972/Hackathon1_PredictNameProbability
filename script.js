//UI variables.
const form = document.getElementById('form');
const root = document.getElementById('root');
let localData = {};

//Submit Form Event.
form.addEventListener('submit', (e) => {
    e.preventDefault();
    //check name value
    const name = e.target.name.value;

    if (name !== '') {
        //display the data
        loadData(name);

    } else {
        alert('Please enter name!');
    }

    //reset the form
    e.target.reset();
})

const loadData = async (name) => {
    try {

        const res = await fetch(`https://api.nationalize.io?name=${name}`);
        const data = await res.json();
        localData = { ...data };

        displayData(localData);

    } catch (error) {

        console.error(error.message);

    }

}

const displayData = (data) => {

    clearData();

    //Current Name
    const nameEle = document.createElement('h4');
    nameEle.classList = 'text-success mb-3';
    const nameText = document.createTextNode(`Current Name : ${data.name}`);
    nameEle.appendChild(nameText);
    root.appendChild(nameEle);

    if (data.country.length > 0) {
        //Countries
        for (let i = 0; i < data.country.length; i++) {

            const mainDiv = document.createElement("div");
            mainDiv.classList = 'col-md-12 mb-3';

            const card = document.createElement("div");
            card.classList = 'card';
            card.style.width = 100;

            const cardBody = document.createElement("div");
            cardBody.classList = 'card-body';

            const cardTitle = document.createElement('h5');
            cardTitle.classList = 'card-title';
            const cardTitleText = document.createTextNode(`Country ID : ${data.country[i].country_id}`);
            cardTitle.appendChild(cardTitleText);

            const cardText = document.createElement('p');
            cardText.classList = 'card-text';
            const cardContentText = document.createTextNode(`Probability : ${data.country[i].probability}`);
            cardText.appendChild(cardContentText);

            cardBody.appendChild(cardTitle);
            cardBody.appendChild(cardText);
            card.appendChild(cardBody);
            mainDiv.appendChild(card);
            root.appendChild(mainDiv);
        }
    } else {

        const mainDiv = document.createElement("div");
        mainDiv.classList = 'col-md-12 mb-3';

        const card = document.createElement("div");
        card.classList = 'card';
        card.style.width = 100;

        const cardBody = document.createElement("div");
        cardBody.classList = 'card-body';

        const cardTitle = document.createElement('h5');
        cardTitle.classList = 'card-title';
        const cardTitleText = document.createTextNode(`No Countries Found`);
        cardTitle.appendChild(cardTitleText);

        cardBody.appendChild(cardTitle);
        card.appendChild(cardBody);
        mainDiv.appendChild(card);
        root.appendChild(mainDiv);
    }
}

const clearData = () => {
    if (root.children !== null) {
        while (root.lastElementChild) {
            root.removeChild(root.lastElementChild);
        }
    }
}