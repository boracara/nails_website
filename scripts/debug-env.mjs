const candidates = [
  "DATABASE_URL",
  "POSTGRES_PRISMA_URL",
  "POSTGRES_URL",
  "DATABASE_URL_UNPOOLED",
  "POSTGRES_URL_NON_POOLING",
  "DATABASE_PUBLIC_URL",
];

console.log("---- Database env var check ----");
for (const name of candidates) {
  const value = process.env[name];
  if (!value) {
    console.log(`${name}: (not set)`);
    continue;
  }
  const looksValid = /^postgres(ql)?:\/\//.test(value);
  const preview = value.slice(0, 12) + "..." + value.slice(-8);
  console.log(`${name}: SET, length=${value.length}, startsWithValidProtocol=${looksValid}, preview="${preview}"`);
}
console.log("---------------------------------");
