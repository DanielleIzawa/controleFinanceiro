/* function formatarMoeda(i) {
  var v = i.value.replace(/\D/g,'');
  v = (v/100).toFixed(2) + '';
  v = v.replace(".", ",");
  v = v.replace(/(\d)(\d{3})(\d{3}),/g, "$1.$2.$3,");
  v = v.replace(/(\d)(\d{3}),/g, "$1.$2,");
  i.value = v;
}
 */
function confirmationMessage() {
  var resposta = confirm("Você realmente deseja remover esse(s) registro(s)?");
  if (resposta == true) {
    delet()
  } 
}


const inputType = document.getElementById('type')
const inputName = document.getElementById('name')
const inputValue = document.getElementById('value')

let list = []

function add(event) {
  event.preventDefault()
  console.log(event)
  const transaction = { type: inputType.value, name: inputName.value, value: inputValue.value }
  list.push(transaction)
  console.log(list)

  const data = {
    fields: {
      Responsavel: environment.USER,
      Json: JSON.stringify(list),
    },
  };

  if (id) {
    patch(data, id).then(res => {
      console.log(res)
      id = res.id
      get()
      document.location.reload(true)
    })
  } else {
    post(data).then(res => {
      console.log(res)
      id = res.id
      get()
      document.location.reload(true)
    })
  }
}

function delet(event) {
  /* event.preventDefault() */
  const transaction = { type: inputType.value, name: inputName.value, value: inputValue.value }
  list.splice(0, list.length)
  console.log(list)

  const data = {
    fields: {
      Responsavel: environment.USER,
      Json: JSON.stringify(list),
    },
  };

  if (id) {
    patch(data, id).then(res => {
      console.log(res)
      id = res.null
      document.location.reload(true)
    })
  }
}

const environment = {
  PATH: "https://api.airtable.com/v0",
  AUTH: "Bearer key2CwkHb0CKumjuM",
  KEY: "appRNtYLglpPhv2QD",
  USER: "3879",
};

const url = `${environment.PATH}/${environment.KEY}/Historico`;
const headers = new Headers({
  Authorization: environment.AUTH,
  "Content-Type": "application/json",
});

let id = null

function get() {
  return fetch(
    `${url}?filterByFormula=Responsavel=${environment.USER}`,
    {
      headers: headers,
    }
  )
    .then((response) => response.json())
    .then((data) => data)
    .catch((e) => console.log(e));
    
}

function post(params) {
  return fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(params),
  })
    .then((response) => response.json())
    .then((data) => data)
    /* .then((post) => document.location.reload(true)) */
    .catch((e) => console.log(e));
}

function patch(params, id) {
  return fetch(`${url}/${id}`, {
    method: "PATCH",
    headers: headers,
    body: JSON.stringify(params),
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((e) => console.log(e));
}

function del(id) {
  return fetch(`${url}/${id}`, {
    method: "DELETE",
    headers: headers,
  })
    .then((response) => response.json())
    .then((data) => data)
    .catch((e) => console.log(e));
}

get().then(res => {
  console.log(JSON.parse(res.records[0]?.fields.Json))
  id = res.records[0]?.id
  list = JSON.parse(res.records[0]?.fields.Json)
  list.length > 0 ? tableDinamic(list) : messsage();
})

function tableDinamic(records) {
  const table = document.getElementById('extratoTransacoes')
  const [_, tbody, tfoot] = table.children
  
  buildTbody(records, tbody);
  buildTFoot(records, tfoot);
}

function messsage(){
  const testeMessage = document.getElementById('text')
  testeMessage.textContent = 'Nenhuma transação cadastrada.'
}

function buildTFoot(records, tfoot) {
  const initialValue = 0;
  const sumWithInitial = records.reduce(
    (previousValue, currentValue) => {
      let value = previousValue;
      if (currentValue.type === '-') {
        value = previousValue - +currentValue.value;
      } else {
        value = previousValue + +currentValue.value;
      }
      return value;
    },
    initialValue
  );

  console.log(sumWithInitial);
  const [_, tr] = tfoot.children;
  const p = tr.children[2].children[0];
  p.textContent = `R$ ${sumWithInitial}`;
  const p2 = tr.children[2].children[1];
  p2.children[0].textContent = sumWithInitial > 0 ? '[LUCRO]' : sumWithInitial < 0 ? '[PREJUÍZO]' :'';
}

function buildTbody(records, tbody) {
  for (let i = 0; i < records.length; i++) {
    let tr = document.createElement('tr');
    buildTd(records, i, tr);
    tbody.appendChild(tr);
  }
}



function buildTd(records, i, tr) {
  for (let j = 0; j < 3; j++) {
    let td = document.createElement('td');
    td.appendChild(document.createTextNode(j == 0 ? records[i].type : j == 1 ? records[i].name : records[i].value));
    td.classList.add(j == 0 ? 'signal' : j == 1 ? 'text' : 'value');
    tr.appendChild(td);
  }
}

module.exports = {confirmationMessage, add, get}
