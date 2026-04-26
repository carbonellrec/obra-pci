export function fmtMoeda(valor) {
  return (+(valor) || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function fmtPct(valor) {
  return (+(valor) || 0).toFixed(1) + '%';
}

export function fmtData(data) {
  if (!data) return '—';

  // 1. Tenta identificar se já é formato ISO ou Americano (YYYY-MM-DD ou YYYY/MM/DD)
  // Isso resolve o problema de quando você volta para editar
  if (/^\d{4}[-/]\d{2}[-/]\d{2}/.test(data)) {
    const separador = data.includes('-') ? '-' : '/';
    const [ano, mes, dia] = data.split(separador);
    // Remove qualquer lixo de timestamp (T00:00:00...) se houver
    return `${dia.substring(0, 2)}/${mes}/${ano}`;
  }

  // 2. Trata entrada apenas de números (ex: "24052025")
  const numeros = data.replace(/\D/g, '');
  if (numeros.length === 8) {
    const dia = parseInt(numeros.substring(0, 2));
    const mes = parseInt(numeros.substring(2, 4));
    const ano = parseInt(numeros.substring(4, 8));

    const dataObj = new Date(ano, mes - 1, dia);
    if (dataObj.getFullYear() === ano && dataObj.getMonth() === mes - 1 && dataObj.getDate() === dia) {
      return `${String(dia).padStart(2, '0')}/${String(mes).padStart(2, '0')}/${ano}`;
    }
  }

  // 3. Se a data já estiver no formato brasileiro (DD/MM/YYYY), apenas retorna ela
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(data)) {
    return data;
  }

  return 'Data inválida';
}

export function validarData(data) {
  if (!data) return false;
  const numeros = data.replace(/\D/g, '');
  if (numeros.length !== 8) return false;

  const dia = parseInt(numeros.substring(0, 2));
  const mes = parseInt(numeros.substring(2, 4));
  const ano = parseInt(numeros.substring(4, 8));

  const dataObj = new Date(ano, mes - 1, dia);
  return (
    dataObj.getFullYear() === ano &&
    dataObj.getMonth() === mes - 1 &&
    dataObj.getDate() === dia
  );
}

// Garante que salve sempre com traço (padrão ISO) para o banco de dados
export function dataParaISO(dataBR) {
  if (!dataBR || !dataBR.includes('/')) return dataBR;
  const [dia, mes, ano] = dataBR.split('/');
  return `${ano}-${mes}-${dia}`;
}