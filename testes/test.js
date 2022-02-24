const script = require('../script');
const {Response} = jest.requireActual('node-fetch');

/* test('Está aparecendo a mensagem', () => {
   expect(messsage.add({ type: "+", name: "transaction", value: '10' }));
})

expect(generatedParagraphs.length).toBe(3) */

describe('Está aparecendo a mensagem', () => {
  const get = fetch('${url}?filterByFormula=Responsavel=${environment.USER}', {method: 'POST'});
  it('renders a new paragraph via JavaScript when the button is clicked', async () => {
    const button = getByText(testeMessage.textContent, 'Nenhuma transação cadastrada.')
  })
})
