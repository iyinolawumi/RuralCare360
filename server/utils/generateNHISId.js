// Generates a unique NHIS ID like NHIS-2026-00042
const generateNHISId = async (NHIS) => {
  const year = new Date().getFullYear();
  const count = await NHIS.countDocuments();
  const padded = String(count + 1).padStart(5, '0');
  return `NHIS-${year}-${padded}`;
};

module.exports = generateNHISId;