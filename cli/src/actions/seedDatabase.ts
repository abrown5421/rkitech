export default async function seedDatabase() {
  console.log("Seeding database...");
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log("✅ Database seeded successfully!");
}
