const btnMobile = document.getElementById("btn-mobile");
const btnMobileClose = document.getElementById("btn-mobile-close");
function toggleMenu(event) {
  if (event.type === "touchstart") event.preventDefault();
  const nav = document.getElementById("nav");
  nav.classList.toggle("active");
  const active = nav.classList.contains("active");
  event.currentTarget.setAttribute("aria-expanded", active);
  if (active) {
    event.currentTarget.setAttribute("aria-label", "Fechar Menu");
  } else {
    event.currentTarget.setAttribute("aria-label", "Abrir Menu");
  }
}

btnMobile.addEventListener("click", toggleMenu);
btnMobile.addEventListener("touchstart", toggleMenu);

btnMobileClose.addEventListener("click", toggleMenu);
btnMobileClose.addEventListener("touchstart", toggleMenu);

function formatarMoeda(i) {
  var v = i.value.replace(/\D/g,'');
	v = (v/100).toFixed(2) + '';
	v = v.replace(".", ",");
	v = v.replace(/(\d)(\d{3})(\d{3}),/g, "$1.$2.$3,");
	v = v.replace(/(\d)(\d{3}),/g, "$1.$2,");
	i.value = v;
}

function confirmationMessage() {
  var resposta = confirm("Você realmente deseja remover esse(s) registro(s)?");
  if (resposta == true) {
    clear();
  }
}

const inputType = document.getElementById("type");
const inputName = document.getElementById("name");
const inputValue = document.getElementById("value");

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

let id = null;

let list = [];

function add(event) {
  event.preventDefault();
  console.log(event);
  const transaction = {
    type: inputType.value,
    name: inputName.value,
    value: inputValue.value,
  };
  list.push(transaction);
  console.log(list);

  const data = {
    fields: {
      Responsavel: environment.USER,
      Json: JSON.stringify(list),
    },
  };

  if (id) {
    patch(data, id).then((res) => {
      console.log(res);
      id = res.id;
      get();
      document.location.reload(true);
    });
  } else {
    post(data).then((res) => {
      console.log(res);
      id = res.id;
      get();
    });
  }
}

function clear(event) {
  const transaction = {
    type: inputType.value,
    name: inputName.value,
    value: inputValue.value,
  };
  list.splice(0, list.length);
  console.log(list);

  const data = {
    fields: {
      Responsavel: environment.USER,
      Json: JSON.stringify(list),
    },
  };

  if (id) {
    patch(data, id).then((res) => {
      console.log(res);
      id = res.null;
      document.location.reload(true);
    });
  }
}
function get() {
  return fetch(`${url}?filterByFormula=Responsavel=${environment.USER}`, {
    headers: headers,
  })
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

get().then((res) => {
  console.log(JSON.parse(res.records[0]?.fields.Json));
  id = res.records[0]?.id;
  list = JSON.parse(res.records[0]?.fields.Json);
  list.length > 0 ? tableDinamic(list) : messsage();
});

function tableDinamic(records) {
  const table = document.getElementById("extratoTransacoes");
  const [_, tbody, tfoot] = table.children;

  buildTbody(records, tbody);
  buildTFoot(records, tfoot);
}

function buildTbody(records, tbody) {
  for (let i = 0; i < records.length; i++) {
    let tr = document.createElement("tr");
    buildTd(records, i, tr);
    tbody.innerHtml = "0";
    tbody.appendChild(tr);
  }
}

function buildTd(records, i, tr) {
  for (let j = 0; j < 3; j++) {
    let td = document.createElement("td");
    td.appendChild(
      document.createTextNode(
        j == 0 ? records[i].type : j == 1 ? records[i].name : `R$ ${records[i].value}`
      )
    );
    td.classList.add(j == 0 ? "signal" : j == 1 ? "text" : "value");
    tr.appendChild(td);
  }
}

function buildTFoot(records, tfoot) {
  let initialValue = 0;
  records.forEach(element => {
    
    if(element.type === '-'){
      initialValue = parseFloat(`-${element.value.replace(".","").replace(",",".")}`) + initialValue
    } else{
      initialValue = parseFloat(element.value.replace(".","").replace(",",".")) + initialValue
    }
  });

  const tr = document.getElementsByClassName("top")[0];
  const p = tr.children[2].children[0];
  let formatedInitialValue = initialValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  p.textContent = `${String(formatedInitialValue).replace("-","")}`;
  const p2 = tr.children[2].children[1];
  
  p2.children[0].textContent =
  initialValue > 0 ? "[LUCRO]" : initialValue < 0 ? "[PREJUÍZO]" : "";
}

function messsage() {
  const testeMessage = document.getElementById("text");
  testeMessage.textContent = "Nenhuma transação cadastrada.";
}