export function creditAvailable(level: number): string {
  if (level < 500) {
    return "não ofereceremos micro-crédito ou ofereceremos a uma taxa de juros alta.";
  } else if (level < 700) {
    return "podemos oferecer micro-crédito a uma taxa de juros a nível de mercado.";
  } else if (level > 700) {
    return "podemos oferecer micro-crédito com taxa de juros bem competitivas.";
  } else {
    throw new Error("Nível inválido. O valor deve estar entre 0 e 10.");
  }
}

export function quantityAvailable(value: number): string {
  if (value < 500) {
    return "possui pouco capital e/ou pouca experiência.";
  } else if (value < 700) {
    return "possui capital decente e/ou experiência regular.";
  } else if (value > 700) {
    return "possui muito capital e/ou muita experiência.";
  } else {
    throw new Error("Nível inválido. O valor deve estar entre 0 e 10.");
  }
}
