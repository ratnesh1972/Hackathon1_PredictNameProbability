//UI variables.
const search = document.getElementById('search');
const root = document.getElementById('root');
const resetFilter = document.getElementById('resetFilter');


//state
const state = {
    name: '',
    localData: [],
    filter: false,
};

//Submit Form Event.
search.addEventListener('submit', (e) => {

    e.preventDefault();

    console.log('In search Listener');

    //check name value
    const name = e.target.name.value;
    const regex = /^[A-Za-z]{2,}$/;
    if (regex.test(name)) {

        state.name = name;

        //fetch and display data
        loadData();

    } else {
        alert('Please enter valid first name!');
    }

    //reset the form
    e.target.reset();
})

const loadData = async () => {

    console.log('In loadData');

    try {

        //Clear filter form & submit event listener if any.
        clearFilter();

        //Clear previous data.
        clearDisplayData();

        const res = await fetch(`https://api.nationalize.io?name=${state.name}`);
        const data = await res.json();

        state.localData = [...data.country];

        state.filter = data.country.length > 1 ? true : false;

        //Load filter form  & submit event listener.
        loadFilter();

        //Display Data
        displayData(state.localData);

    } catch (error) {
        console.error(error.message);
    }

}

//Function to display filter form.
const loadFilter = () => {

    console.log('In loadFilter', state.filter);

    if (state.filter) {
        const formEle = document.createElement('form');
        formEle.id = 'filter';
        formEle.classList = 'mb-3'
        formEle.innerHTML = `<div class="form-group mb-3">
            <label for="prob">Filter probability</label>
            <input type="text" class="form-control mt-1" id="prob" placeholder="Example : 0.05"
                required>
        </div>
        <div class="d-grid">
            <button type="submit" class="btn btn-dark mb-3">Filter</button>
        </div>`;

        root.appendChild(formEle);

        //Load filter form submit event listener.
        loadFilterEventListener();
    }
}


const loadFilterEventListener = () => {

    console.log('In loadFilterEventListener');

    const filter = document.getElementById('filter');

    console.log(filter);

    filter.addEventListener('submit', filterListener);
}

//Filter listener function
const filterListener = (e) => {
    e.preventDefault();

    //check probability value
    const prob = e.target.prob.value;
    const regex = /^[0-9][.]{0,1}[0-9]{0,}$/;

    if (regex.test(prob)) {

        const filterData = state.localData.filter(c => c.probability > prob);

        //clear display data.
        clearDisplayData();
        //load filter data.
        displayData(filterData);

    } else {
        alert('Please enter valid probability!');
    }

    e.target.reset();
}


//Function to display data cards.
const displayData = (data) => {

    console.log('In displayData', data);

    //data element
    const dataEle = document.createElement('div');

    //Current Name
    const nameEle = document.createElement('h4');
    nameEle.classList = 'text-success mb-3';
    const nameText = document.createTextNode(`Current Name : ${state.name}`);
    nameEle.appendChild(nameText);
    dataEle.appendChild(nameEle);

    if (data.length > 0) {

        //Countries
        for (let i = 0; i < data.length; i++) {

            const mainDiv = document.createElement("div");
            mainDiv.classList = 'col-md-12 mb-3';

            const card = document.createElement("div");
            card.classList = 'card';
            card.style.width = 100;

            const cardBody = document.createElement("div");
            cardBody.classList = 'card-body';

            const cardTitle = document.createElement('h5');
            cardTitle.classList = 'card-title';
            const cardTitleText = document.createTextNode(`Country ID : ${data[i].country_id}`);
            cardTitle.appendChild(cardTitleText);

            const cardText = document.createElement('p');
            cardText.classList = 'card-text';
            const cardContentText = document.createTextNode(`Probability : ${data[i].probability}`);
            cardText.appendChild(cardContentText);

            cardBody.appendChild(cardTitle);
            cardBody.appendChild(cardText);
            card.appendChild(cardBody);
            mainDiv.appendChild(card);
            dataEle.appendChild(mainDiv);
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
        dataEle.appendChild(mainDiv);
    }

    root.appendChild(dataEle);
}

//Clear filter form.
const clearFilter = () => {
    console.log('In clearFilter');

    if (state.filter) {
        document.getElementById('filter').removeEventListener('submit', filterListener);
        document.getElementById('filter').remove();
    }

}

//Clear displayed data cards.
const clearDisplayData = () => {

    console.log('In clearDisplayData');

    if (root.children !== null) {
        if (root.lastElementChild) {
            root.removeChild(root.lastElementChild);
        }
    }
}