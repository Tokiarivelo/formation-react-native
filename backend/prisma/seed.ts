import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      username: 'admin',
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isActive: true,
    },
  });

  console.log('✅ Admin user created:', admin);

  // Create a sample project
  const project = await prisma.project.create({
    data: {
      name: 'Sample Project',
      description: 'A sample project for demonstration',
      status: 'ACTIVE',
      userId: admin.id,
    },
  });

  console.log('✅ Sample project created:', project);

  // Create sample tasks
  const task1 = await prisma.task.create({
    data: {
      title: 'Setup Database',
      description: 'Configure and setup the database',
      status: 'DONE',
      priority: 'HIGH',
      userId: admin.id,
      projectId: project.id,
    },
  });

  const task2 = await prisma.task.create({
    data: {
      title: 'Implement Authentication',
      description: 'Setup JWT authentication with refresh tokens',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      userId: admin.id,
      projectId: project.id,
    },
  });

  const task3 = await prisma.task.create({
    data: {
      title: 'Create API Documentation',
      description: 'Generate Swagger/OpenAPI documentation',
      status: 'TODO',
      priority: 'MEDIUM',
      userId: admin.id,
      projectId: project.id,
    },
  });

  console.log('✅ Sample tasks created:', [task1, task2, task3]);

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });