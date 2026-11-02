/** Valida os dígitos verificadores do CPF; não consulta situação na Receita Federal. */
export function validarCPF(valor: string): boolean {
  const cpf = valor.replace(/\D/g, '');
  if (!/^\d{11}$/.test(cpf) || /^(\d)\1{10}$/.test(cpf)) return false;
  for (const tamanho of [9, 10]) {
    const soma = [...cpf.slice(0, tamanho)].reduce((acc, numero, i) => acc + Number(numero) * (tamanho + 1 - i), 0);
    const resto = (soma * 10) % 11;
    const digito = resto === 10 ? 0 : resto;
    if (digito !== Number(cpf[tamanho])) return false;
  }
  return true;
}
