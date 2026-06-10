const prompt = require('prompt-sync')({ sigint: true });
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Erro: defina SUPABASE_URL e SUPABASE_KEY no arquivo .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function exibirMenu() {
  console.log('\n==============================');
  console.log('SISTEMA BANCÁRIO');
  console.log('==============================');
  console.log('1 - Cadastrar cliente');
  console.log('2 - Listar clientes');
  console.log('3 - Buscar cliente');
  console.log('4 - Atualizar cliente');
  console.log('5 - Deletar cliente');
  console.log('6 - Cadastrar conta');
  console.log('7 - Listar contas');
  console.log('8 - Registrar transação');
  console.log('9 - Listar transações');
  console.log('10 - Buscar transações por tipo');
  console.log('11 - Buscar transações por valor');
  console.log('12 - Cadastrar serviço');
  console.log('13 - Listar serviços');
  console.log('14 - Contratar serviço');
  console.log('15 - Listar serviços contratados');
  console.log('0 - Sair');
}

function lerNumero(promptText) {
  const resposta = prompt(promptText).trim();
  if (!resposta) return null;
  const valor = Number(resposta);
  return Number.isNaN(valor) ? null : valor;
}

function formatarValor(valor) {
  return Number(valor).toFixed(2).replace('.', ',');
}

async function buscarClientePorId(id) {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return null;
  }

  return data;
}

async function cadastrarCliente() {
  try {
    console.log('\n--- Cadastro de Cliente ---');
    const nome = prompt('Nome: ').trim();
    const cpf = prompt('CPF: ').trim();
    const email = prompt('Email: ').trim();
    const telefone = prompt('Telefone: ').trim();
    const endereco = prompt('Endereço: ').trim();

    if (!nome || !cpf || !email) {
      console.log('Nome, CPF e Email são obrigatórios.');
      return;
    }

    const { data, error } = await supabase.from('clientes').insert([
      { nome, cpf, email, telefone, endereco },
    ]);

    if (error) {
      console.error('Falha ao cadastrar cliente:', error.message);
      return;
    }

    console.log('Cliente cadastrado com sucesso:', data[0]);
  } catch (error) {
    console.error('Erro inesperado ao cadastrar cliente:', error.message);
  }
}

async function listarClientes() {
  try {
    console.log('\n--- Lista de Clientes ---');
    const { data, error } = await supabase.from('clientes').select('*').order('id', { ascending: true });

    if (error) {
      console.error('Falha ao listar clientes:', error.message);
      return;
    }

    if (!data || data.length === 0) {
      console.log('Nenhum cliente encontrado.');
      return;
    }

    data.forEach((cliente) => {
      console.log(`ID: ${cliente.id} | ${cliente.nome} | CPF: ${cliente.cpf} | Email: ${cliente.email} | Telefone: ${cliente.telefone} | Endereço: ${cliente.endereco}`);
    });
  } catch (error) {
    console.error('Erro inesperado ao listar clientes:', error.message);
  }
}

async function buscarCliente() {
  try {
    console.log('\n--- Buscar Cliente ---');
    const termo = prompt('Digite nome, CPF ou ID do cliente: ').trim();

    if (!termo) {
      console.log('Termo de busca obrigatório.');
      return;
    }

    const isId = /^[0-9]+$/.test(termo);
    let query = supabase.from('clientes').select('*');

    if (isId) {
      query = query.or(`id.eq.${termo},nome.ilike.%${termo}%,cpf.ilike.%${termo}%`);
    } else {
      query = query.or(`nome.ilike.%${termo}%,cpf.ilike.%${termo}%`);
    }

    const { data, error } = await query.order('id', { ascending: true });

    if (error) {
      console.error('Falha ao buscar cliente:', error.message);
      return;
    }

    if (!data || data.length === 0) {
      console.log('Nenhum cliente encontrado para o termo informado.');
      return;
    }

    data.forEach((cliente) => {
      console.log(`ID: ${cliente.id} | ${cliente.nome} | CPF: ${cliente.cpf} | Email: ${cliente.email} | Telefone: ${cliente.telefone} | Endereço: ${cliente.endereco}`);
    });
  } catch (error) {
    console.error('Erro inesperado ao buscar cliente:', error.message);
  }
}

async function atualizarCliente() {
  try {
    console.log('\n--- Atualizar Cliente ---');
    const id = prompt('ID do cliente: ').trim();

    if (!id) {
      console.log('ID é obrigatório.');
      return;
    }

    const clienteExistente = await buscarClientePorId(id);

    if (!clienteExistente) {
      console.log('Cliente não encontrado.');
      return;
    }

    const nome = prompt(`Nome [${clienteExistente.nome}]: `).trim() || clienteExistente.nome;
    const cpf = prompt(`CPF [${clienteExistente.cpf}]: `).trim() || clienteExistente.cpf;
    const email = prompt(`Email [${clienteExistente.email}]: `).trim() || clienteExistente.email;
    const telefone = prompt(`Telefone [${clienteExistente.telefone}]: `).trim() || clienteExistente.telefone;
    const endereco = prompt(`Endereço [${clienteExistente.endereco}]: `).trim() || clienteExistente.endereco;

    const { error } = await supabase.from('clientes').update({ nome, cpf, email, telefone, endereco }).eq('id', id);

    if (error) {
      console.error('Falha ao atualizar cliente:', error.message);
      return;
    }

    console.log('Cliente atualizado com sucesso.');
  } catch (error) {
    console.error('Erro inesperado ao atualizar cliente:', error.message);
  }
}

async function deletarCliente() {
  try {
    console.log('\n--- Deletar Cliente ---');
    const id = prompt('ID do cliente: ').trim();

    if (!id) {
      console.log('ID é obrigatório.');
      return;
    }

    const clienteExistente = await buscarClientePorId(id);

    if (!clienteExistente) {
      console.log('Cliente não encontrado.');
      return;
    }

    const confirmar = prompt(`Tem certeza que deseja deletar ${clienteExistente.nome}? (s/n): `).trim().toLowerCase();
    if (confirmar !== 's') {
      console.log('Operação cancelada.');
      return;
    }

    const { error } = await supabase.from('clientes').delete().eq('id', id);

    if (error) {
      console.error('Falha ao deletar cliente:', error.message);
      return;
    }

    console.log('Cliente deletado com sucesso.');
  } catch (error) {
    console.error('Erro inesperado ao deletar cliente:', error.message);
  }
}

async function cadastrarConta() {
  try {
    console.log('\n--- Cadastro de Conta ---');
    const clienteId = prompt('ID do cliente proprietário: ').trim();

    if (!clienteId) {
      console.log('ID do cliente é obrigatório.');
      return;
    }

    const clienteExistente = await buscarClientePorId(clienteId);

    if (!clienteExistente) {
      console.log('Cliente não encontrado. Crie o cliente antes de cadastrar a conta.');
      return;
    }

    const numero = prompt('Número da conta (ou deixe em branco para gerar): ').trim() || String(Math.floor(Math.random() * 900000) + 100000);
    const tipo = prompt('Tipo da conta (corrente/poupança): ').trim() || 'corrente';
    const saldoEntrada = lerNumero('Saldo inicial: ');
    const saldo = saldoEntrada === null ? 0 : saldoEntrada;

    const { data, error } = await supabase.from('contas').insert([
      { cliente_id: clienteId, numero, tipo, saldo },
    ]);

    if (error) {
      console.error('Falha ao cadastrar conta:', error.message);
      return;
    }

    console.log('Conta cadastrada com sucesso:', data[0]);
  } catch (error) {
    console.error('Erro inesperado ao cadastrar conta:', error.message);
  }
}

async function listarContas() {
  try {
    console.log('\n--- Lista de Contas ---');

    const { data, error } = await supabase
      .from('contas')
      .select('id, numero, tipo, saldo, cliente_id, cliente:clientes(id, nome, cpf)')
      .order('id', { ascending: true });

    if (error) {
      console.error('Falha ao listar contas com relacionamento:', error.message);
      return;
    }

    if (!data || data.length === 0) {
      console.log('Nenhuma conta encontrada.');
      return;
    }

    for (const conta of data) {
      const dono = conta.cliente || (await buscarClientePorId(conta.cliente_id));
      const nomeDono = dono ? dono.nome : 'Cliente não encontrado';
      console.log(`ID: ${conta.id} | Conta: ${conta.numero} | Tipo: ${conta.tipo} | Saldo: R$ ${formatarValor(conta.saldo)} | Dono: ${nomeDono}`);
    }
  } catch (error) {
    console.error('Erro inesperado ao listar contas:', error.message);
  }
}

async function registrarTransacao() {
  try {
    console.log('\n--- Registrar Transação ---');
    const contaId = prompt('ID da conta: ').trim();

    if (!contaId) {
      console.log('ID da conta é obrigatório.');
      return;
    }

    const tipo = prompt('Tipo (deposito/saque/transferencia): ').trim().toLowerCase();
    const valorEntrada = lerNumero('Valor: ');
    const descricao = prompt('Descrição: ').trim();

    if (!tipo || valorEntrada === null) {
      console.log('Tipo e valor são obrigatórios.');
      return;
    }

    if (!['deposito', 'saque', 'transferencia'].includes(tipo)) {
      console.log('Tipo inválido. Use deposito, saque ou transferencia.');
      return;
    }

    const { data, error } = await supabase.from('transacoes').insert([
      { conta_id: contaId, tipo, valor: valorEntrada, descricao, data: new Date().toISOString() },
    ]);

    if (error) {
      console.error('Falha ao registrar transação:', error.message);
      return;
    }

    console.log('Transação registrada com sucesso:', data[0]);
  } catch (error) {
    console.error('Erro inesperado ao registrar transação:', error.message);
  }
}

async function listarTransacoes() {
  try {
    console.log('\n--- Lista de Transações ---');
    const { data, error } = await supabase.from('transacoes').select('*').order('data', { ascending: false });

    if (error) {
      console.error('Falha ao listar transações:', error.message);
      return;
    }

    if (!data || data.length === 0) {
      console.log('Nenhuma transação encontrada.');
      return;
    }

    data.forEach((transacao) => {
      console.log(`ID: ${transacao.id} | Conta: ${transacao.conta_id} | Tipo: ${transacao.tipo} | Valor: R$ ${formatarValor(transacao.valor)} | Data: ${transacao.data} | Descrição: ${transacao.descricao}`);
    });
  } catch (error) {
    console.error('Erro inesperado ao listar transações:', error.message);
  }
}

async function buscarTransacoesPorTipo() {
  try {
    console.log('\n--- Buscar Transações por Tipo ---');
    const tipo = prompt('Tipo (deposito/saque/transferencia): ').trim().toLowerCase();

    if (!tipo) {
      console.log('Tipo obrigatório.');
      return;
    }

    const { data, error } = await supabase.from('transacoes').select('*').eq('tipo', tipo).order('data', { ascending: false });

    if (error) {
      console.error('Falha ao buscar transações:', error.message);
      return;
    }

    if (!data || data.length === 0) {
      console.log('Nenhuma transação encontrada para o tipo informado.');
      return;
    }

    data.forEach((transacao) => {
      console.log(`ID: ${transacao.id} | Conta: ${transacao.conta_id} | Tipo: ${transacao.tipo} | Valor: R$ ${formatarValor(transacao.valor)} | Data: ${transacao.data} | Descrição: ${transacao.descricao}`);
    });
  } catch (error) {
    console.error('Erro inesperado ao buscar transações por tipo:', error.message);
  }
}

async function buscarTransacoesPorValor() {
  try {
    console.log('\n--- Buscar Transações por Valor ---');
    console.log('1 - Igual a');
    console.log('2 - Maior que');
    console.log('3 - Menor que');
    console.log('4 - Maior ou igual');
    console.log('5 - Menor ou igual');
    const opcao = prompt('Escolha a comparação: ').trim();
    const valor = lerNumero('Valor: ');

    if (!opcao || valor === null) {
      console.log('Opção e valor são obrigatórios.');
      return;
    }

    const comparadores = {
      '1': 'eq',
      '2': 'gt',
      '3': 'lt',
      '4': 'gte',
      '5': 'lte',
    };

    const operador = comparadores[opcao];

    if (!operador) {
      console.log('Opção inválida.');
      return;
    }

    const { data, error } = await supabase.from('transacoes').select('*')[operador]('valor', valor).order('data', { ascending: false });

    if (error) {
      console.error('Falha ao buscar transações por valor:', error.message);
      return;
    }

    if (!data || data.length === 0) {
      console.log('Nenhuma transação encontrada para o filtro informado.');
      return;
    }

    data.forEach((transacao) => {
      console.log(`ID: ${transacao.id} | Conta: ${transacao.conta_id} | Tipo: ${transacao.tipo} | Valor: R$ ${formatarValor(transacao.valor)} | Data: ${transacao.data} | Descrição: ${transacao.descricao}`);
    });
  } catch (error) {
    console.error('Erro inesperado ao buscar transações por valor:', error.message);
  }
}

async function cadastrarServico() {
  try {
    console.log('\n--- Cadastro de Serviço ---');
    const nome = prompt('Nome do serviço: ').trim();
    const descricao = prompt('Descrição do serviço: ').trim();
    const precoEntrada = lerNumero('Preço do serviço: ');

    if (!nome || precoEntrada === null) {
      console.log('Nome e preço são obrigatórios.');
      return;
    }

    const { data, error } = await supabase.from('servicos').insert([
      { nome, descricao, preco: precoEntrada },
    ]);

    if (error) {
      console.error('Falha ao cadastrar serviço:', error.message);
      return;
    }

    console.log('Serviço cadastrado com sucesso:', data[0]);
  } catch (error) {
    console.error('Erro inesperado ao cadastrar serviço:', error.message);
  }
}

async function listarServicos() {
  try {
    console.log('\n--- Lista de Serviços ---');
    const { data, error } = await supabase.from('servicos').select('*').order('id', { ascending: true });

    if (error) {
      console.error('Falha ao listar serviços:', error.message);
      return;
    }

    if (!data || data.length === 0) {
      console.log('Nenhum serviço encontrado.');
      return;
    }

    data.forEach((servico) => {
      console.log(`ID: ${servico.id} | ${servico.nome} | Preço: R$ ${formatarValor(servico.preco)} | Descrição: ${servico.descricao}`);
    });
  } catch (error) {
    console.error('Erro inesperado ao listar serviços:', error.message);
  }
}

async function contratarServico() {
  try {
    console.log('\n--- Contratar Serviço ---');
    const clienteId = prompt('ID do cliente: ').trim();
    const servicoId = prompt('ID do serviço: ').trim();

    if (!clienteId || !servicoId) {
      console.log('IDs do cliente e do serviço são obrigatórios.');
      return;
    }

    const clienteExistente = await buscarClientePorId(clienteId);
    const { data: servicoExistente, error: servicoError } = await supabase.from('servicos').select('*').eq('id', servicoId).single();

    if (!clienteExistente) {
      console.log('Cliente não encontrado.');
      return;
    }

    if (servicoError || !servicoExistente) {
      console.log('Serviço não encontrado.');
      return;
    }

    const { data, error } = await supabase.from('servicos_contratados').insert([
      { cliente_id: clienteId, servico_id: servicoId, data_contratacao: new Date().toISOString() },
    ]);

    if (error) {
      console.error('Falha ao contratar serviço:', error.message);
      return;
    }

    console.log('Serviço contratado com sucesso:', data[0]);
  } catch (error) {
    console.error('Erro inesperado ao contratar serviço:', error.message);
  }
}

async function listarServicosContratados() {
  try {
    console.log('\n--- Lista de Serviços Contratados ---');
    const { data, error } = await supabase
      .from('servicos_contratados')
      .select('id, cliente_id, servico_id, data_contratacao, cliente:clientes(id, nome, cpf), servico:servicos(id, nome, preco)')
      .order('id', { ascending: true });

    if (error) {
      console.error('Falha ao listar serviços contratados:', error.message);
      return;
    }

    if (!data || data.length === 0) {
      console.log('Nenhum serviço contratado encontrado.');
      return;
    }

    data.forEach((registro) => {
      const cliente = registro.cliente || { nome: 'Cliente não encontrado' };
      const servico = registro.servico || { nome: 'Serviço não encontrado', preco: 0 };
      console.log(`ID: ${registro.id} | Cliente: ${cliente.nome} | Serviço: ${servico.nome} | Preço: R$ ${formatarValor(servico.preco)} | Data: ${registro.data_contratacao}`);
    });
  } catch (error) {
    console.error('Erro inesperado ao listar serviços contratados:', error.message);
  }
}

async function executarOpcao(opcao) {
  switch (opcao) {
    case '1':
      await cadastrarCliente();
      break;
    case '2':
      await listarClientes();
      break;
    case '3':
      await buscarCliente();
      break;
    case '4':
      await atualizarCliente();
      break;
    case '5':
      await deletarCliente();
      break;
    case '6':
      await cadastrarConta();
      break;
    case '7':
      await listarContas();
      break;
    case '8':
      await registrarTransacao();
      break;
    case '9':
      await listarTransacoes();
      break;
    case '10':
      await buscarTransacoesPorTipo();
      break;
    case '11':
      await buscarTransacoesPorValor();
      break;
    case '12':
      await cadastrarServico();
      break;
    case '13':
      await listarServicos();
      break;
    case '14':
      await contratarServico();
      break;
    case '15':
      await listarServicosContratados();
      break;
    case '0':
      console.log('Saindo do sistema. Até mais!');
      process.exit(0);
    default:
      console.log('Opção inválida. Tente novamente.');
  }
}

async function main() {
  while (true) {
    exibirMenu();
    const opcao = prompt('Escolha uma opção: ').trim();
    await executarOpcao(opcao);
  }
}

main().catch((error) => {
  console.error('Erro inesperado no sistema:', error.message);
  process.exit(1);
});
